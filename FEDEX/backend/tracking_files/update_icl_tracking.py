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
import re

def get_icl_tracking_details(awb_number, driver):
    """
    Fetch detailed tracking information from ICL Express International
    """
    try:
        # Navigate to tracking page
        driver.get("https://iclexpress.in/tracking/")
        time.sleep(3)
        
        # 1. Click International Tab - CRITICAL STEP
        try:
            # First, try clicking by the exact ID discovered from browser inspection
            intl_tab = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.ID, "elementor-tab-title-9352"))
            )
            intl_tab.click()
            print("✓ Clicked International tab")
            time.sleep(2)  # Wait for tab content to load
        except Exception as e:
            print(f"Warning: Could not click International tab: {e}")
            # Try alternative method
            try:
                driver.execute_script("document.getElementById('elementor-tab-title-9352').click();")
                time.sleep(2)
                print("✓ Clicked International tab via JavaScript")
            except:
                print("⚠️ Could not switch to International tab - proceeding anyway")

        # 2. Input AWB into the International tracking field
        try:
            # Wait for the International tab's input field to be visible
            awb_input = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.ID, "awbNumber"))
            )
            awb_input.clear()
            awb_input.send_keys(str(awb_number))
            print(f"✓ Entered AWB: {awb_number}")
            time.sleep(1)
        except Exception as e:
            print(f"Could not find AWB input field: {e}\"")
            return {"awb": awb_number, "status": "Error Input", "origin": None, "destination": None, "timeline": []}

        # 3. Click Track Button
        try:
            # The button is next to the input field and has onclick="trackShipment()"
            # Try multiple strategies to find and click it
            track_btn = None
            
            # Strategy 1: Find button with onclick="trackShipment()"
            try:
                track_btn = driver.find_element(By.XPATH, "//button[@onclick='trackShipment()']")
                if track_btn.is_displayed():
                    track_btn.click()
                    print("✓ Clicked Track button (via onclick attribute)")
            except:
                pass
            
            # Strategy 2: Find button containing "Track Shipment" text in International tab
            if not track_btn:
                try:
                    track_btn = WebDriverWait(driver, 5).until(
                        EC.element_to_be_clickable((By.XPATH, "//div[@id='elementor-tab-content-9352']//button[contains(text(), 'Track Shipment')]"))
                    )
                    track_btn.click()
                    print("✓ Clicked Track button (via text content)")
                except:
                    pass
            
            # Strategy 3: JavaScript click as fallback
            if not track_btn:
                try:
                    driver.execute_script("""
                        const input = document.getElementById('awbNumber');
                        const button = input.parentElement.querySelector('button');
                        if (button) button.click();
                    """)
                    print("✓ Clicked Track button (via JavaScript)")
                except Exception as js_error:
                    print(f"Could not find Track button: {js_error}")
                    return {"awb": awb_number, "status": "Error Button", "origin": None, "destination": None, "timeline": []}
                 
        except Exception as e:
            print(f"Could not find Track button: {e}")
            return {"awb": awb_number, "status": "Error Button", "origin": None, "destination": None, "timeline": []}
            
        # Wait for results
        time.sleep(6)
        
        tracking_data = {
            "awb": awb_number,
            "status": "Unknown",
            "origin": None,
            "destination": None,
            "timeline": []
        }
        
        # 4. Extract Results
        try:
            html = driver.page_source
            
            # Check for error msg
            if "Invalid" in html or "Not Found" in html:
                 tracking_data["status"] = "Not Found"
            
            dfs = pd.read_html(io.StringIO(html))
            
            for df in dfs:
                df.columns = [str(c).strip() for c in df.columns]
                col_names = [c.upper() for c in df.columns]
                
                # Check for Date in Header (e.g., "28/08/2025 Status")
                current_date = ""
                # Look for date pattern in the first column name
                date_match = re.search(r'\d{1,2}[/-]\d{1,2}[/-]\d{4}', df.columns[0])
                if date_match:
                    current_date = date_match.group(0)
                
                # Identify columns
                status_col = None
                location_col = None
                time_col = None
                
                for i, col in enumerate(col_names):
                    if "STATUS" in col: status_col = df.columns[i]
                    if "LOCATION" in col: location_col = df.columns[i]
                    if "TIME" in col: time_col = df.columns[i]
                
                # Only process if we found meaningful columns
                if status_col:
                    for _, row in df.iterrows():
                        activity = str(row[status_col]).strip()
                        location = str(row[location_col]).strip() if location_col and pd.notna(row[location_col]) else ""
                        time_val = str(row[time_col]).strip() if time_col and pd.notna(row[time_col]) else ""
                        
                        full_date = f"{current_date} {time_val}".strip()
                        
                        if activity and activity.lower() != "nan" and activity.upper() != "STATUS":
                            tracking_data["timeline"].append({
                                "date_time": full_date,
                                "activity": activity,
                                "location": location
                            })

            # Determine main status
            if tracking_data["timeline"]:
                if any("DELIVERED" in t["activity"].upper() for t in tracking_data["timeline"]):
                    tracking_data["status"] = "Delivered"
                else:
                    tracking_data["status"] = tracking_data["timeline"][0]["activity"]
                
                # Extract origin and destination from timeline
                # Origin: earliest event (last in timeline if sorted newest first)
                # Destination: latest event (first in timeline if sorted newest first)
                
                # Get destination from the first event with a location
                for event in tracking_data["timeline"]:
                    if event.get("location") and event["location"].strip():
                        tracking_data["destination"] = event["location"]
                        break
                
                # Get origin from the last event with a location
                for event in reversed(tracking_data["timeline"]):
                    if event.get("location") and event["location"].strip():
                        tracking_data["origin"] = event["location"]
                        break
                    
        except Exception as e:
            # print(f"Error parsing table: {e}")
            pass
            
        return tracking_data

    except Exception as e:
        print(f"Global Error: {e}")
        traceback.print_exc()
        return {"awb": awb_number, "status": "Error Script", "origin": None, "destination": None, "timeline": []}

def update_icl_tracking():
    file_path = 'split_datasets/FEDEX(ICL).xlsx'
    
    # Check regular file access
    if not os.access(file_path, os.W_OK):
        print(f"⚠️ Warning: File '{file_path}' seems locked. Please close it.")
    
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
            current_status = str(row['STATUS']).lower()
            if "delivered" in current_status or "destination" in current_status or "picked" in current_status:
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
