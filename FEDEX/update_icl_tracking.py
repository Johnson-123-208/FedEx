import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import json
from datetime import datetime
import traceback
import io
import os

def get_icl_tracking_details(awb_number, driver):
    """
    Fetch detailed tracking information from ICL Express International
    """
    try:
        # Navigate to tracking page
        driver.get("https://iclexpress.in/tracking/")
        time.sleep(3)
        
        # 1. Click International Tab
        try:
            intl_tab = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.ID, "elementor-tab-title-9352"))
            )
            intl_tab.click()
            time.sleep(1)
        except Exception as e:
            # print(f"Warning: Could not click International tab: {e}")
            pass
            
        # 2. Input AWB
        try:
            awb_input = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.ID, "awbNumber"))
            )
            awb_input.clear()
            awb_input.send_keys(str(awb_number))
        except:
             return {"awb": awb_number, "status": "Error", "timeline": []}

        # 3. Click Track
        try:
            track_btn = driver.find_element(By.CSS_SELECTOR, "#elementor-tab-content-9352 button")
            track_btn.click()
        except:
            return {"awb": awb_number, "status": "Error", "timeline": []}
            
        # Wait for results and Scroll
        time.sleep(6)
        driver.execute_script("window.scrollBy(0, 500);")
        time.sleep(2)
        
        tracking_data = {
            "awb": awb_number,
            "status": "Unknown",
            "origin": None,
            "destination": None,
            "delivery_date": None,
            "timeline": []
        }
        
        # 4. Extract Results
        try:
            page_source = driver.page_source
            page_text = driver.find_element(By.TAG_NAME, "body").text.upper()
            
            # Global check for Delivered
            is_delivered_global = "DELIVERED" in page_text
            
            # Use pandas to parse tables - best way to get timeline
            dfs = pd.read_html(io.StringIO(page_source))
            
            for df in dfs:
                table_str = df.to_string().upper()
                
                # Check for Timeline Table
                if "LOCATION" in table_str and ("TIME" in table_str or "STATUS" in table_str):
                     # Likely timeline
                     df.columns = [str(c).upper().strip() for c in df.columns]
                     
                     for _, row in df.iterrows():
                         row_text = " ".join([str(x) for x in row.values if pd.notna(x)])
                         
                         event = {
                             "date_time": row_text, # Just grab the whole row as text for safety
                             "activity": row_text,
                             "location": ""
                         }
                         tracking_data["timeline"].append(event)

            # Determine Status
            if is_delivered_global:
                tracking_data["status"] = "Delivered"
            elif tracking_data["timeline"]:
                # Check first and last event
                first_event = str(tracking_data["timeline"][0]).upper()
                last_event = str(tracking_data["timeline"][-1]).upper()
                
                # Check identifying keywords in first event
                if any(x in first_event for x in ["DELIVERED", "TRANSIT", "ARRIVED", "DEPARTED", "LEFT", "SENT"]):
                     tracking_data["status"] = tracking_data["timeline"][0]["activity"]
                elif any(x in last_event for x in ["DELIVERED", "TRANSIT", "ARRIVED", "DEPARTED", "LEFT", "SENT"]):
                     tracking_data["status"] = tracking_data["timeline"][-1]["activity"]
                else:
                     tracking_data["status"] = tracking_data["timeline"][0]["activity"] # Default to first

                # Normalize common lengthy statuses
                s = tracking_data["status"].upper()
                if "SENT TO DESTINATION" in s: tracking_data["status"] = "Sent to Destination"
                elif "LEFT" in s and "ORIGIN" in s: tracking_data["status"] = "Left Origin"
                elif "PICKED UP" in s: tracking_data["status"] = "Picked Up"

            if tracking_data["status"] == "Unknown":
                if "NOT FOUND" in page_text:
                    tracking_data["status"] = "Not Found"
                elif "Invalid" in page_text: # Case insensitive check
                     tracking_data["status"] = "Invalid AWB"

        except Exception as e:
            pass
            
        return tracking_data

    except Exception as e:
        return {"awb": awb_number, "status": "Error", "timeline": []}

def update_icl_tracking():
    file_path = 'split_datasets/FEDEX(ICL).xlsx'
    
    # Check regular file access
    if not os.access(file_path, os.W_OK):
        print(f"⚠️ Warning: File '{file_path}' seems locked. Please close it.")
        # We can still proceed if we read into memory, but saving will fail.
    
    df = pd.read_excel(file_path)
    
    print(f"📦 Processing {len(df)} ICL shipments...")
    
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--window-size=1920,1080')
    driver = webdriver.Chrome(options=chrome_options)
    
    all_tracking_data = []
    
    try:
        awb_col = 'AWBNO.' if 'AWBNO.' in df.columns else df.columns[2]
        if 'STATUS' not in df.columns: df['STATUS'] = ''
            
        for index, row in df.iterrows():
            # Skip if already has a valid status (optional, but good for resuming)
            current_status = str(row['STATUS']).lower()
            if "delivered" in current_status or "destination" in current_status or "picked" in current_status:
                 # Already processed? 
                 # Actually, let's just skip the first 10 we did successfully
                 if index < 10: 
                     continue

            awb = row[awb_col]
            if pd.notna(awb):
                print(f"[{index+1}/{len(df)}] Tracking AWB: {awb}")
                details = get_icl_tracking_details(awb, driver)
                
                df.at[index, 'STATUS'] = details['status']
                all_tracking_data.append(details)
                
                print(f"   ✓ Status: {details['status']}")
                print(f"   ✓ Timeline Events: {len(details['timeline'])}\n")
                
                if (index + 1) % 10 == 0:
                     try:
                        df.to_excel(file_path, index=False)
                        print("   (Saved progress)")
                     except:
                        print("   (Save failed - File locked?)")
                
                time.sleep(2)
        
        try:
            df.to_excel(file_path, index=False)
            print("✅ ICL Tracking Update Complete!")
        except:
             print("❌ Could not save final Excel file. Is it open?")
             
        # Always save JSON
        with open('split_datasets/FEDEX(ICL)_tracking_details.json', 'w', encoding='utf-8') as f:
            json.dump({"provider": "ICL Express", "updated_at": datetime.now().isoformat(), "shipments": all_tracking_data}, f, indent=2)
            
        
    except Exception as e:
        print(f"❌ Error: {e}")
        traceback.print_exc()
    finally:
        driver.quit()

if __name__ == "__main__":
    update_icl_tracking()
