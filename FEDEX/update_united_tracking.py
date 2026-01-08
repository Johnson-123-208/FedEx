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

def get_united_tracking_details(awb_number, driver):
    """
    Fetch tracking info from United Express
    """
    try:
        # Navigate
        driver.get("https://unitedexpress.itdservices.in/tracking.php")
        time.sleep(3)
        
        # Input
        try:
            inp = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "myInput"))
            )
            inp.clear()
            inp.send_keys(str(awb_number))
            
            # Click Track
            btn = driver.find_element(By.ID, "submit_tracking")
            btn.click()
        except:
            return {"awb": awb_number, "status": "Error", "timeline": []}
            
        # Wait for results
        time.sleep(5)
        
        tracking_data = {
            "awb": awb_number,
            "status": "Unknown",
            "origin": None,
            "destination": None,
            "delivery_date": None,
            "timeline": []
        }
        
        # Parse Results
        try:
            dfs = pd.read_html(io.StringIO(driver.page_source))
            
            for df in dfs:
                table_str = df.to_string().upper()
                
                # Check for Summary (Status, Origin, Dest)
                if "STATUS" in table_str and "ORIGIN" in table_str:
                    # Iterate rows/cols for data
                    # Assuming it's a key-value vertical table or standard horizontal
                    # Let's check for specific values
                    if "DELIVERED" in table_str:
                        tracking_data["status"] = "Delivered"
                    
                    # Try to extract exact status
                    for i, row in df.iterrows():
                        row_text = " ".join([str(x) for x in row.values]).upper()
                        if "STATUS" in row_text:
                            # Try to extract value
                            pass

                # Check for Timeline (Date, Time, Status/Activity, Location)
                if "DATE" in table_str and ("STATUS" in table_str or "ACTIVITY" in table_str):
                    # Likely timeline
                    df.columns = [str(c).upper().strip() for c in df.columns]
                    
                    for _, row in df.iterrows():
                        row_clean = " ".join([str(x) for x in row.values if pd.notna(x)])
                        
                        event = {
                            "date_time": row_clean, # Capture full row text for safety
                            "activity": row_clean,
                            "location": ""
                        }
                        tracking_data["timeline"].append(event)

            # Refine Status
            if tracking_data["status"] == "Unknown":
                if "DELIVERED" in driver.page_source.upper():
                    tracking_data["status"] = "Delivered"
                    
                elif tracking_data["timeline"]:
                    if "DELIVERED" in str(tracking_data["timeline"][0]).upper():
                        tracking_data["status"] = "Delivered"
                    else:
                        tracking_data["status"] = "In Transit"

        except Exception as e:
            pass
            
        return tracking_data

    except Exception as e:
        return {"awb": awb_number, "status": "Error", "timeline": []}

def update_united_tracking():
    file_path = 'split_datasets/UNITED_EXPRESS.xlsx'
    df = pd.read_excel(file_path)
    
    print(f"📦 Processing {len(df)} United Express shipments...")
    
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--window-size=1920,1080')
    driver = webdriver.Chrome(options=chrome_options)
    
    all_tracking_data = []
    
    try:
        # Check columns - United Express file had S.NO, Date, AWBNO., etc.
        # Use column 2 (index 2) if name doesn't match
        awb_col_name = 'AWBNO.'
        if awb_col_name not in df.columns:
            # Try to find a column with 'AWB'
            cols = [c for c in df.columns if 'AWB' in str(c).upper()]
            if cols: awb_col_name = cols[0]
            else: awb_col_name = df.columns[2]
            
        if 'STATUS' not in df.columns: df['STATUS'] = ''
            
        for index, row in df.iterrows():
            awb = row[awb_col_name]
            if pd.notna(awb):
                print(f"[{index+1}/{len(df)}] Tracking AWB: {awb}")
                details = get_united_tracking_details(awb, driver)
                
                df.at[index, 'STATUS'] = details['status']
                all_tracking_data.append(details)
                
                print(f"   ✓ Status: {details['status']}")
                print(f"   ✓ Timeline Events: {len(details['timeline'])}\n")
                
                time.sleep(2)
        
        df.to_excel(file_path, index=False)
        with open('split_datasets/UNITED_EXPRESS_tracking_details.json', 'w', encoding='utf-8') as f:
            json.dump({"provider": "United Express", "updated_at": datetime.now().isoformat(), "shipments": all_tracking_data}, f, indent=2)
            
        print("✅ United Express Tracking Update Complete!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        driver.quit()

if __name__ == "__main__":
    update_united_tracking()
