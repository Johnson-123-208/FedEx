
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
import os
import io

def get_united_tracking_details(awb_number, driver):
    """
    Fetch tracking info from United Express
    URL: https://unitedexpress.in/index
    """
    tracking_data = {
        "awb": awb_number,
        "status": "Unknown",
        "origin": "N/A",
        "destination": "N/A", 
        "delivery_date": None,
        "timeline": []
    }

    try:
        # Navigate to homepage
        driver.get("https://unitedexpress.in/index")
        
        # 1. Enter AWB
        try:
            input_field = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.ID, "tawbno"))
            )
            input_field.clear()
            input_field.send_keys(str(awb_number))
            
            # 2. Click Track
            track_btn = driver.find_element(By.CSS_SELECTOR, "button.tbt")
            driver.execute_script("arguments[0].click();", track_btn) # Force click
            
            # Wait for results
            time.sleep(4)
            
        except Exception as e:
            print(f"Error submitting form: {e}")
            return tracking_data

        # 3. Extract Details
        try:
            # === Extract Main Status ===
            # Status is often in the first table, row 4
            # Selector: table:nth-of-type(1) tr:nth-child(4) td:nth-child(2)
            try:
                status_el = driver.find_element(By.CSS_SELECTOR, "table:nth-of-type(1) tr:nth-child(4) td:nth-child(2)")
                if status_el:
                    tracking_data["status"] = status_el.text.strip().title()
            except: pass

            # === Extract Delivery Date ===
            # Selector: table:nth-of-type(1) tr:nth-child(3) td:nth-child(2)
            try:
                date_el = driver.find_element(By.CSS_SELECTOR, "table:nth-of-type(1) tr:nth-child(3) td:nth-child(2)")
                if date_el:
                    tracking_data["delivery_date"] = date_el.text.strip()
            except: pass

            # === Extract Origin ===
            # Try finding .order-1 h5
            try:
                origin_el = driver.find_element(By.CSS_SELECTOR, ".order-1 h5")
                if origin_el:
                    tracking_data["origin"] = origin_el.text.strip()
            except: pass

            # === Extract Destination ===
            # Try finding .order-3 h5
            try:
                dest_el = driver.find_element(By.CSS_SELECTOR, ".order-3 h5")
                if dest_el:
                    tracking_data["destination"] = dest_el.text.strip()
            except: pass

            # === Extract Timeline (History) ===
            try:
                # Find all tables
                tables = driver.find_elements(By.TAG_NAME, "table")
                history_table = None
                
                # Look for the specific table with correct headers
                for tbl in tables:
                    try:
                        header_text = tbl.text.lower()
                        if "date" in header_text and "activity" in header_text:
                            history_table = tbl
                            break
                    except: continue
                
                if history_table:
                    # Get all rows
                    rows = history_table.find_elements(By.TAG_NAME, "tr")
                    
                    for row in rows:
                        cols = row.find_elements(By.TAG_NAME, "td")
                        # We expect 3 columns: Date/Time, Activity, Location
                        if len(cols) == 3:
                            col_texts = [c.text.strip() for c in cols]
                            
                            # Skip header row if it contains "Date" or "Activity"
                            if "activity" in col_texts[1].lower():
                                continue
                                
                            evt = {
                                "date_time": col_texts[0],
                                "activity": col_texts[1],
                                "location": col_texts[2]
                            }
                            
                            # clean up empty events
                            if evt["activity"]:
                                tracking_data["timeline"].append(evt)
                                
            except Exception as e:
                print(f"Error parsing timeline table: {e}")
            
        except Exception as e:
            print(f"Error parsing results: {e}")

    except Exception as e:
        print(f"Global Error: {e}")
        
    return tracking_data

def process_united_file(file_path):
    print(f"\n📦 Processing United Express file: {file_path}")
    if not os.path.exists(file_path): 
        print(f"File not found: {file_path}")
        return

    try:
        df = pd.read_excel(file_path)
    except Exception as e:
        print(f"Could not read excel: {e}")
        return
        
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--window-size=1920,1080')
    driver = webdriver.Chrome(options=chrome_options)
    
    all_tracking_data = [] 
    
    try:
        if 'STATUS' not in df.columns: df['STATUS'] = ''
        
        # AWB Column
        awb_col_name = 'AWBNO.'
        if awb_col_name not in df.columns:
            cols = [c for c in df.columns if 'AWB' in str(c).upper()]
            if cols: awb_col_name = cols[0]
            else: awb_col_name = df.columns[2] # Fallback

        processed_count = 0
        for index, row in df.iterrows():
            # Skip delivered
            status_val = str(row.get('STATUS', '')).lower()
            if 'delivered' in status_val:
                continue

            awb = row[awb_col_name]
            if pd.notna(awb):
                awb = str(awb).replace(' ', '').strip()
                print(f"[{index+1}/{len(df)}] Tracking United AWB: {awb}")
                
                details = get_united_tracking_details(awb, driver)
                
                # Update DataFrame
                if details['status'] != "Unknown":
                     df.at[index, 'STATUS'] = details['status']
                
                all_tracking_data.append(details)
                processed_count += 1
                
                print(f"   ✓ Status: {details['status']}")
                print(f"   ✓ Timeline: {len(details['timeline'])}")
                
                if processed_count % 5 == 0:
                    try: df.to_excel(file_path, index=False)
                    except: pass
                
                time.sleep(2)
        
        try: df.to_excel(file_path, index=False)
        except: pass
        
        # Save JSON
        json_path = file_path.replace('.xlsx', '_tracking_details.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump({
                "provider": "United Express", 
                "updated_at": datetime.now().isoformat(), 
                "shipments": all_tracking_data
            }, f, indent=2)
            
        print(f"✅ Completed. Saved to {file_path}")

    except Exception as e:
        print(f"❌ Error process_united_file: {e}")
        traceback.print_exc()
    finally:
        driver.quit()

if __name__ == "__main__":
    # Test with the specific file mentioned
    process_united_file('split_datasets/UNITED_EXPRESS.xlsx')
