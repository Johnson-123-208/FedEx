import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
import json
from datetime import datetime

def get_atlantic_tracking_details(awb_number, driver):
    """
    Fetch detailed tracking information from Atlantic Courier website
    Returns: dict with status, timeline, and other details
    """
    try:
        # Navigate to tracking page
        driver.get("https://atlanticcourier.net/track/")
        time.sleep(2)
        
        # Find and clear the input field
        tracking_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "tracking"))
        )
        tracking_input.clear()
        tracking_input.send_keys(str(awb_number))
        
        # Click the track button
        track_button = driver.find_element(By.ID, "track")
        track_button.click()
        
        # Wait longer for results to load (tables load dynamically via AJAX)
        # The page needs 5-7 seconds to populate the tracking tables
        time.sleep(7)
        
        # Try to wait for the table to be present
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "table"))
            )
        except:
            pass  # Continue anyway, we'll check for tables below
        
        # Check for "No tracking data" message
        try:
            no_data = driver.find_element(By.CLASS_NAME, "alert-info")
            if "No tracking data" in no_data.text:
                return {
                    "awb": awb_number,
                    "status": "Not Found",
                    "consignee_name": None,
                    "destination": None,
                    "delivery_date": None,
                    "signing_for": None,
                    "fwd_no": None,
                    "timeline": []
                }
        except:
            pass
        
        # Extract tracking details
        tracking_data = {
            "awb": awb_number,
            "status": "Unknown",
            "consignee_name": None,
            "destination": None,
            "delivery_date": None,
            "signing_for": None,
            "fwd_no": None,
            "timeline": []
        }
        
        try:
            # Wait a bit more for the table to load
            time.sleep(1)
            
            # Check if there's any table on the page
            tables = driver.find_elements(By.TAG_NAME, "table")
            
            if not tables:
                # No tables found - likely no tracking data
                tracking_data["status"] = "No Tracking Data Available"
                return tracking_data
            
            # Try to find the main results table (table-bordered)
            try:
                main_table = driver.find_element(By.CSS_SELECTOR, "table.table-bordered")
                main_rows = main_table.find_elements(By.TAG_NAME, "tr")
                
                # Parse main table (consignee details)
                for row in main_rows:
                    cells = row.find_elements(By.TAG_NAME, "td")
                    
                    # Row with 3 columns
                    if len(cells) == 3:
                        cell0_text = cells[0].text.strip()
                        cell1_text = cells[1].text.strip()
                        cell2_text = cells[2].text.strip()
                        
                        # First row: Consignee Name | Name Value | Destination
                        if "Consignee Name" in cell0_text:
                            tracking_data["consignee_name"] = cell1_text
                            if "Destination:" in cell2_text:
                                tracking_data["destination"] = cell2_text.replace("Destination:", "").strip()
                        
                        # Second row: Delivery Date | Date Value | Signing Info
                        elif "Delivery Date" in cell0_text:
                            tracking_data["delivery_date"] = cell1_text
                            # Extract signing for and fwd no from cell2
                            if "Signing for:" in cell2_text:
                                parts = cell2_text.split("Fwd No:")
                                signing = parts[0].replace("Signing for:", "").strip()
                                tracking_data["signing_for"] = signing
                                if len(parts) > 1:
                                    tracking_data["fwd_no"] = parts[1].strip()
                
                # Find the nested timeline table (table-striped)
                try:
                    timeline_table = driver.find_element(By.CSS_SELECTOR, "table.table-striped")
                    timeline_rows = timeline_table.find_elements(By.TAG_NAME, "tr")
                    
                    for row in timeline_rows:
                        cells = row.find_elements(By.TAG_NAME, "td")
                        
                        # Skip header row and rows without 3 cells
                        if len(cells) == 3:
                            date_time = cells[0].text.strip()
                            activity = cells[1].text.strip()
                            location = cells[2].text.strip()
                            
                            # Skip header row (check if it's the header)
                            if date_time and date_time != "Date/Time" and activity != "Activity":
                                tracking_data["timeline"].append({
                                    "date_time": date_time,
                                    "activity": activity,
                                    "location": location
                                })
                    
                    # Determine status from timeline (first entry is the latest)
                    if tracking_data["timeline"]:
                        latest_activity = tracking_data["timeline"][0]["activity"].upper()
                        
                        if "DELIVERED" in latest_activity:
                            tracking_data["status"] = "Delivered"
                        elif "OUT FOR DELIVERY" in latest_activity or "WITH DELIVERY COURIER" in latest_activity:
                            tracking_data["status"] = "Out for Delivery"
                        elif "PARCEL DELIVERY CENTRE" in latest_activity or "AT PARCEL" in latest_activity:
                            tracking_data["status"] = "At Delivery Centre"
                        elif "CUSTOM CLEARED" in latest_activity:
                            tracking_data["status"] = "Customs Cleared"
                        elif "CUSTOM" in latest_activity or "UNDER CUSTOM" in latest_activity:
                            tracking_data["status"] = "In Customs"
                        elif "TRANSIT" in latest_activity or "SHIPMENT SENT" in latest_activity or "IN TRANSIT" in latest_activity:
                            tracking_data["status"] = "In Transit"
                        elif "RECEIVED" in latest_activity or "PICKED" in latest_activity:
                            tracking_data["status"] = "Picked Up"
                        else:
                            # Use the actual activity as status
                            tracking_data["status"] = tracking_data["timeline"][0]["activity"]
                    else:
                        # No timeline found, use destination if available
                        if tracking_data["destination"]:
                            tracking_data["status"] = f"Destination: {tracking_data['destination']}"
                            
                except Exception as e:
                    # Timeline table not found
                    if tracking_data["destination"]:
                        tracking_data["status"] = f"Destination: {tracking_data['destination']}"
                    else:
                        tracking_data["status"] = "Tracking Data Incomplete"
                
            except Exception as e:
                # Main table not found - check if it's a "No tracking data" message
                tracking_data["status"] = "No Tracking Data Available"
            
            return tracking_data
            
        except Exception as e:
            print(f"   Warning: Unexpected error - {str(e)[:100]}")
            tracking_data["status"] = "Error Fetching Data"
            return tracking_data
    
    except Exception as e:
        print(f"   Error tracking AWB {awb_number}: {str(e)}")
        return {
            "awb": awb_number,
            "status": f"Error: {str(e)}",
            "consignee_name": None,
            "destination": None,
            "delivery_date": None,
            "signing_for": None,
            "fwd_no": None,
            "timeline": []
        }

def update_atlantic_tracking():
    """
    Main function to update Atlantic tracking data
    """
    # Read the Excel file
    file_path = 'split_datasets/ATLANTIC.xlsx'
    df = pd.read_excel(file_path)
    
    print(f"📦 Processing {len(df)} ATLANTIC shipments...")
    print("=" * 70)
    
    # Setup Chrome driver with headless option
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # Run in background
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
                tracking_details = get_atlantic_tracking_details(awb_number, driver)
                
                # Update the dataframe
                df.at[index, 'STATUS'] = tracking_details['status']
                
                # Add to JSON data
                all_tracking_data.append(tracking_details)
                
                print(f"   ✓ Status: {tracking_details['status']}")
                if tracking_details['consignee_name']:
                    print(f"   ✓ Consignee: {tracking_details['consignee_name']}")
                if tracking_details['destination']:
                    print(f"   ✓ Destination: {tracking_details['destination']}")
                if tracking_details['delivery_date']:
                    print(f"   ✓ Delivery Date: {tracking_details['delivery_date']}")
                if tracking_details['timeline']:
                    print(f"   ✓ Timeline Events: {len(tracking_details['timeline'])}")
                print()
                
                # Small delay to avoid overwhelming the server
                time.sleep(2)
            else:
                print(f"[{index + 1}/{len(df)}] Skipping empty AWB\n")
        
        # Save the updated Excel file (overwrite original)
        output_excel = file_path  # Update the same file
        df.to_excel(output_excel, index=False)
        
        # Save detailed tracking data to JSON
        output_json = 'split_datasets/ATLANTIC_tracking_details.json'
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump({
                "provider": "ATLANTIC",
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
    update_atlantic_tracking()
