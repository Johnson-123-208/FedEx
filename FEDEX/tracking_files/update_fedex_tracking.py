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

def get_fedex_tracking_details(awb_number, driver):
    """
    Fetch tracking info from FedEx
    """
    driver.get(f"https://www.fedex.com/fedextrack/?trknbr={awb_number}")
    time.sleep(10) # 10s wait for load
    
    tracking_data = {
        "awb": awb_number,
        "status": "Unknown",
        "origin": None,
        "destination": None,
        "delivery_date": None,
        "timeline": []
    }
    
    try:
        # 1. Handle Cookie Banner
        try:
            WebDriverWait(driver, 5).until(EC.element_to_be_clickable((By.ID, "onetrust-accept-btn-handler"))).click()
            time.sleep(1)
        except: pass

        # 2. Extract Status (Main Header)
        try:
            # Try multiple selectors for the main status
            selectors = [
                ".redesign-snapshot-status", 
                ".snapshotController_status_desc", 
                "h1.testing", 
                ".key-status"
            ]
            for sel in selectors:
                try:
                    el = driver.find_element(By.CSS_SELECTOR, sel)
                    if el.text.strip():
                        tracking_data["status"] = el.text.strip()
                        break
                except: continue
        except: pass
        
        # Fallback Status from Body Text
        if tracking_data["status"] == "Unknown":
            body_text = driver.find_element(By.TAG_NAME, "body").text.upper()
            if "DELIVERED" in body_text: tracking_data["status"] = "Delivered"
            elif "IN TRANSIT" in body_text: tracking_data["status"] = "In Transit"
            elif "ON FEDEX VEHICLE FOR DELIVERY" in body_text: tracking_data["status"] = "Out for Delivery"

        # 3. Expand Timeline
        # Try to click "View details" / "Travel History"
        expanded = False
        try:
            # Click "View details" link if present
            links = driver.find_elements(By.CSS_SELECTOR, "a")
            for link in links:
                if "VIEW" in link.text.upper() and "DETAILS" in link.text.upper():
                    driver.execute_script("arguments[0].click();", link)
                    time.sleep(2)
                    break
            
            # Click "Travel History" toggle
            toggles = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='Travel history'], button.travel-history-toggle")
            for toggle in toggles:
                driver.execute_script("arguments[0].click();", toggle)
                time.sleep(2)
                expanded = True
        except: pass

        # 4. Extract Timeline Events
        try:
            # Look for scan event rows
            # Strategy: Find all elements that look like scanning events
            scan_events = driver.find_elements(By.CSS_SELECTOR, ".travel-history__scan-event, li.travel-history-slide")
            
            for event in scan_events:
                text = event.text.strip()
                lines = [l.strip() for l in text.split('\n') if l.strip()]
                
                if len(lines) >= 2:
                    # Typical format: [Time], [Activity], [Location] OR [Date], [Time]...
                    # FedEx structure is complex. Let's capture as much as possible.
                    
                    # If date is separate header, we might miss it.
                    # But often the row contains basic info.
                    
                    evt = {
                        "date_time": lines[0],
                        "activity": lines[1] if len(lines) > 1 else "",
                        "location": lines[-1] if len(lines) > 2 else ""
                    }
                    tracking_data["timeline"].append(evt)
                    
            if not tracking_data["timeline"] and expanded:
                 # Try finding via generic text block in the specific container
                 history_container = driver.find_element(By.ID, "travel-history-accordion")
                 lines = history_container.text.split('\n')
                 # This is raw, but better than nothing
                 for line in lines:
                      if len(line) > 10:
                          tracking_data["timeline"].append({"activity": line, "date_time": "", "location": ""})

        except: pass

    except Exception as e:
        pass
        
    return tracking_data

def process_fedex_file(file_path):
    print(f"\n📦 Processing file: {file_path}")
    if not os.path.exists(file_path): return

    try:
        df = pd.read_excel(file_path)
    except: return
        
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
            else: awb_col_name = df.columns[2]

        processed_count = 0
        for index, row in df.iterrows():
            # Skip valid
            if str(row['STATUS']).lower() in ['delivered', 'in transit', 'out for delivery']:
                continue

            awb = row[awb_col_name]
            if pd.notna(awb):
                awb = str(awb).replace(' ', '').strip()
                print(f"[{index+1}/{len(df)}] Tracking AWB: {awb}")
                
                details = get_fedex_tracking_details(awb, driver)
                
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
        
        json_path = file_path.replace('.xlsx', '_tracking_details.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump({"provider": "FedEx", "updated_at": datetime.now().isoformat(), "shipments": all_tracking_data}, f, indent=2)

    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    for f in ['split_datasets/FEDEX(564).xlsx', 'split_datasets/FEDEX(3026).xlsx']:
        process_fedex_file(f)
