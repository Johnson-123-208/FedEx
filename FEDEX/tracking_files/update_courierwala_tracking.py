import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import json
from datetime import datetime

def get_courierwala_tracking_details(awb_number, driver):
    """
    Fetch detailed tracking information from Courier Wala website
    Returns: dict with status, timeline, and other details
    """
    try:
        # Navigate to tracking page
        driver.get("https://courierwalaexpress.in/track-shipment.html")
        time.sleep(3)
        
        # Find and clear the input field using correct ID
        tracking_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "txtawbno"))
        )
        tracking_input.clear()
        tracking_input.send_keys(str(awb_number))
        
        # Find and click the track button using correct ID
        track_button = driver.find_element(By.ID, "trackAwbNumber")
        track_button.click()
        
        # Wait longer for results to load (similar to Atlantic)
        time.sleep(7)
        
        # Try to wait for results table to be present
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "table"))
            )
        except:
            pass
        
        # Check for "No data found" or similar message
        try:
            page_text = driver.find_element(By.TAG_NAME, "body").text
            if "no data" in page_text.lower() or "not found" in page_text.lower():
                return {
                    "awb": awb_number,
                    "status": "Not Found",
                    "booking_date": None,
                    "consignee_name": None,
                    "destination": None,
                    "delivery_date_time": None,
                    "receiver_name": None,
                    "delivery_awb": None,
                    "timeline": []
                }
        except:
            pass
        
        # Extract tracking details
        tracking_data = {
            "awb": awb_number,
            "status": "Unknown",
            "booking_date": None,
            "consignee_name": None,
            "destination": None,
            "delivery_date_time": None,
            "receiver_name": None,
            "delivery_awb": None,
            "timeline": []
        }
        
        try:
            time.sleep(1)
            
            # Check if there are any tables on the page
            tables = driver.find_elements(By.TAG_NAME, "table")
            
            if not tables:
                tracking_data["status"] = "No Tracking Data Available"
                return tracking_data
            
            # Parse the main details table (first table with shipment info)
            try:
                # Find all table rows
                all_rows = driver.find_elements(By.TAG_NAME, "tr")
                
                for row in all_rows:
                    cells = row.find_elements(By.TAG_NAME, "td")
                    
                    if len(cells) == 2:
                        label = cells[0].text.strip()
                        value = cells[1].text.strip()
                        
                        if "AWB No" in label or "AWB No." in label:
                            # This is the AWB confirmation
                            pass
                        elif "Booking Date" in label:
                            tracking_data["booking_date"] = value
                        elif "Consignee Name" in label:
                            tracking_data["consignee_name"] = value
                        elif "Destination" in label:
                            tracking_data["destination"] = value
                        elif "Status" in label:
                            tracking_data["status"] = value
                        elif "Delivery Date and Time" in label or "Delivery Date" in label:
                            tracking_data["delivery_date_time"] = value
                        elif "Receiver Name" in label:
                            tracking_data["receiver_name"] = value
                        elif "Delivery AWB" in label:
                            tracking_data["delivery_awb"] = value
                
                # Find the timeline table (table with Date, Time, Location, Activity headers)
                # Look for table rows with 4 columns
                timeline_found = False
                for row in all_rows:
                    cells = row.find_elements(By.TAG_NAME, "td")
                    
                    if len(cells) == 4:
                        date = cells[0].text.strip()
                        time_val = cells[1].text.strip()
                        location = cells[2].text.strip()
                        activity = cells[3].text.strip()
                        
                        # Skip header row
                        if date and date != "Date" and activity != "Activity":
                            tracking_data["timeline"].append({
                                "date": date,
                                "time": time_val,
                                "location": location,
                                "activity": activity
                            })
                            timeline_found = True
                
                # If status wasn't found in the table but we have timeline, get it from latest activity
                if tracking_data["status"] == "Unknown" and tracking_data["timeline"]:
                    latest_activity = tracking_data["timeline"][0]["activity"].upper()
                    
                    if "DELIVERED" in latest_activity:
                        tracking_data["status"] = "Delivered"
                    elif "OUT FOR DELIVERY" in latest_activity:
                        tracking_data["status"] = "Out for Delivery"
                    elif "CUSTOMS" in latest_activity or "CUSTOM" in latest_activity:
                        tracking_data["status"] = "In Customs"
                    elif "TRANSIT" in latest_activity or "IN TRANSIT" in latest_activity:
                        tracking_data["status"] = "In Transit"
                    elif "RECEIVED" in latest_activity:
                        tracking_data["status"] = "Received"
                    elif "ARRIVAL" in latest_activity or "ARRIVED" in latest_activity:
                        tracking_data["status"] = "Arrived at Hub"
                    else:
                        tracking_data["status"] = tracking_data["timeline"][0]["activity"]
                
                # If still no status but have destination
                if tracking_data["status"] == "Unknown" and tracking_data["destination"]:
                    tracking_data["status"] = "Tracking Data Available"
                
            except Exception as e:
                print(f"   Warning: Error parsing tables - {str(e)[:100]}")
                tracking_data["status"] = "Error Parsing Data"
            
            return tracking_data
            
        except Exception as e:
            print(f"   Warning: Unexpected error - {str(e)[:100]}")
            tracking_data["status"] = "Error Fetching Data"
            return tracking_data
    
    except Exception as e:
        print(f"   Error tracking AWB {awb_number}: {str(e)}")
        return {
            "awb": awb_number,
            "status": f"Error: {str(e)[:50]}",
            "booking_date": None,
            "consignee_name": None,
            "destination": None,
            "delivery_date_time": None,
            "receiver_name": None,
            "delivery_awb": None,
            "timeline": []
        }

def update_courierwala_tracking():
    """
    Main function to update Courier Wala tracking data
    """
    # Read the Excel file
    file_path = 'split_datasets/COURIER_WALA.xlsx'
    df = pd.read_excel(file_path)
    
    print(f"📦 Processing {len(df)} COURIER WALA shipments...")
    print("=" * 70)
    
    # Setup Chrome driver with headless option
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    
    driver = webdriver.Chrome(options=chrome_options)
    
    # Store all tracking data for JSON export
    all_tracking_data = []
    
    try:
        # Find AWB column
        awb_columns = [col for col in df.columns if 'AWB' in col.upper()]
        if not awb_columns:
            print("❌ Could not find AWB column!")
            return
        
        awb_col = awb_columns[0]
        print(f"Using AWB column: '{awb_col}'\n")
        
        # Check if STATUS column exists, if not create it
        if 'STATUS' not in df.columns:
            df['STATUS'] = ''
        
        # Process each row
        for index, row in df.iterrows():
            awb_number = row[awb_col]
            
            if pd.notna(awb_number):
                print(f"[{index + 1}/{len(df)}] Tracking AWB: {awb_number}")
                
                # Get detailed tracking information
                tracking_details = get_courierwala_tracking_details(awb_number, driver)
                
                # Update the dataframe
                df.at[index, 'STATUS'] = tracking_details['status']
                
                # Add to JSON data
                all_tracking_data.append(tracking_details)
                
                print(f"   ✓ Status: {tracking_details['status']}")
                if tracking_details['consignee_name']:
                    print(f"   ✓ Consignee: {tracking_details['consignee_name']}")
                if tracking_details['destination']:
                    print(f"   ✓ Destination: {tracking_details['destination']}")
                if tracking_details['delivery_date_time']:
                    print(f"   ✓ Delivery Date: {tracking_details['delivery_date_time']}")
                if tracking_details['timeline']:
                    print(f"   ✓ Timeline Events: {len(tracking_details['timeline'])}")
                print()
                
                # Small delay to avoid overwhelming the server
                time.sleep(2)
            else:
                print(f"[{index + 1}/{len(df)}] Skipping empty AWB\n")
        
        # Save the updated Excel file (overwrite original)
        output_excel = file_path
        df.to_excel(output_excel, index=False)
        
        # Save detailed tracking data to JSON
        output_json = 'split_datasets/COURIER_WALA_tracking_details.json'
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump({
                "provider": "COURIER_WALA",
                "updated_at": datetime.now().isoformat(),
                "total_shipments": len(all_tracking_data),
                "shipments": all_tracking_data
            }, f, indent=2, ensure_ascii=False)
        
        print("=" * 70)
        print(f"✅ Successfully updated tracking data!")
        print(f"📁 Excel file saved to: {output_excel}")
        print(f"📁 JSON file saved to: {output_json}")
        
        # Show summary
        print("\n📊 Status Summary:")
        status_counts = df['STATUS'].value_counts()
        for status, count in status_counts.items():
            print(f"   {status}: {count}")
        
        # Show timeline summary
        shipments_with_timeline = sum(1 for t in all_tracking_data if t['timeline'])
        print(f"\n📍 Shipments with detailed timeline: {shipments_with_timeline}/{len(all_tracking_data)}")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        driver.quit()

if __name__ == "__main__":
    update_courierwala_tracking()
