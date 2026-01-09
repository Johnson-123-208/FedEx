import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import json
from datetime import datetime
import io

def get_pxc_tracking_details(awb_number, driver):
    """
    Fetch detailed tracking information from PXC Pacific website
    Returns: dict with status, timeline, and other details
    """
    try:
        # Navigate to tracking page
        driver.get("https://www.pacificexp.net/tracking-details.html")
        time.sleep(3)
        
        # input field
        tracking_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "Tracking1_txtAwb"))
        )
        tracking_input.clear()
        tracking_input.send_keys(str(awb_number))
        
        # Click track button
        track_button = driver.find_element(By.CSS_SELECTOR, "button.track-button.show")
        track_button.click()
        
        # Wait for results to load - increase wait time
        time.sleep(8)
        
        tracking_data = {
            "awb": awb_number,
            "status": "Unknown",
            "origin": None,
            "destination": None,
            "delivery_date": None,
            "timeline": []
        }
        
        # Improved parsing using pandas read_html
        try:
            # Get table HTMLs
            dfs = pd.read_html(io.StringIO(driver.page_source))
            
            if dfs:
                print(f"   Found {len(dfs)} tables.")
                
                # Check each table
                for df in dfs:
                    # Convert to string to search easily
                    table_str = df.to_string().upper()
                    
                    # 1. Check for Summary Table (has Origin, Dest, Status)
                    if "ORIGIN" in table_str and "DESTINATION" in table_str:
                        # Iterate rows to find values
                        # Usually Key-Value pairs or specific columns
                        # Let's simple search for keywords in columns
                        for col in df.columns:
                            for idx, val in enumerate(df[col]):
                                val_str = str(val).upper()
                                if "STATUS" in val_str:
                                    # Value might be in next column
                                    if idx + 1 < len(df.columns): # next col same row? no, logic is hard with df
                                        pass
                        
                        # Simpler: Iterate values
                        # Assuming key is in one cell, value in next or same row
                        # PXC table likely: Headers in first row?
                        if "STATUS" in str(df.columns).upper():
                           # Column header is status
                           tracking_data["status"] = str(df.iloc[0]['Status']) if 'Status' in df.columns else "Unknown"

                        # Let's try row iteration for key-value
                        for i, row in df.iterrows():
                            row_str = " ".join([str(x) for x in row.values]).upper()
                            if "STATUS" in row_str:
                                # Try to find the status value
                                parts = row_str.split("STATUS")
                                if len(parts) > 1:
                                    candidate = parts[1].replace(":","").strip().split(" ")[0] # Grab first word/phrase?
                                    # Actually better to rely on timeline if summary fails
                                    pass

                    # 2. Check for Timeline Table
                    if "DATE" in table_str and ("LOCATION" in table_str or "ACTIVITY" in table_str or "STATUS" in table_str):
                        # This is likely the timeline
                        # Rename cols to standard if possible
                        df.columns = [str(c).upper().strip() for c in df.columns]
                        
                        # Map columns
                        date_col = next((c for c in df.columns if "DATE" in c), None)
                        status_col = next((c for c in df.columns if "STATUS" in c or "ACTIVITY" in c), None)
                        loc_col = next((c for c in df.columns if "LOCATION" in c or "ORIGIN" in c), None)
                        
                        if date_col and status_col:
                            for _, row in df.iterrows():
                                event = {
                                    "date_time": str(row[date_col]),
                                    "activity": str(row[status_col]),
                                    "location": str(row[loc_col]) if loc_col else ""
                                }
                                tracking_data["timeline"].append(event)

            # Fallback to manual text parsing if tables failed or empty
            if not tracking_data["timeline"]:
                # Try raw text regex/splitting
                pass

            # Determine status from timeline
            if tracking_data["timeline"]:
                # Latest event is usually first? Or last? PXC typically Newest First.
                # Let's check dates to be sure? No, usually ordered.
                # Assuming first row is latest.
                
                latest_event = tracking_data["timeline"][0]
                latest_status = latest_event['activity'].upper()
                
                if "DELIVERED" in latest_status:
                    tracking_data["status"] = "Delivered"
                else:
                    tracking_data["status"] = latest_event['activity']
                    
        except Exception as e:
            print(f"   Warning parsing PXC tables with pandas: {e}")
            
        return tracking_data
        
    except Exception as e:
        print(f"   Error tracking AWB {awb_number}: {str(e)[:100]}")
        return {
            "awb": awb_number,
            "status": "Error",
            "origin": None,
            "destination": None,
            "delivery_date": None,
            "timeline": []
        }

def update_pxc_tracking():
    file_path = 'split_datasets/PXC_PACIFIC.xlsx'
    df = pd.read_excel(file_path)
    
    print(f"📦 Processing {len(df)} PXC Pacific shipments...")
    
    chrome_options = Options()
    # chrome_options.add_argument('--headless') # Debug
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
            awb = row[awb_col]
            if pd.notna(awb):
                print(f"[{index+1}/{len(df)}] Tracking AWB: {awb}")
                details = get_pxc_tracking_details(awb, driver)
                
                df.at[index, 'STATUS'] = details['status']
                all_tracking_data.append(details)
                
                print(f"   ✓ Status: {details['status']}")
                print(f"   ✓ Timeline Events: {len(details['timeline'])}\n")
                time.sleep(2)
        
        df.to_excel(file_path, index=False)
        with open('split_datasets/PXC_PACIFIC_tracking_details.json', 'w', encoding='utf-8') as f:
            json.dump({"provider": "PXC Pacific", "updated_at": datetime.now().isoformat(), "shipments": all_tracking_data}, f, indent=2)
            
        print("✅ PXC Tracking Update Complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    update_pxc_tracking()
