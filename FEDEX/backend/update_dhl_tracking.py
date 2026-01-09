import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import time
import json
from datetime import datetime

def get_dhl_tracking_details(awb_number, driver):
    """
    Fetch detailed tracking information from DHL website
    Returns: dict with status, timeline, and other details
    """
    try:
        # Navigate directly to tracking results URL
        tracking_url = f"https://www.dhl.com/in-en/home/tracking.html?tracking-id={awb_number}&submit=1"
        driver.get(tracking_url)
        
        # Wait for page to load
        time.sleep(5)
        
        # 1. Handle Cookie Banner (if present)
        try:
            accept_cookies = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.ID, "onetrust-accept-btn-handler"))
            )
            accept_cookies.click()
            time.sleep(1)
        except:
            pass # Cookie banner might not be there
            
        # 2. Try to expand "All Shipment Updates"
        try:
            # Scroll down a bit
            driver.execute_script("window.scrollBy(0, 500);")
            time.sleep(1)
            
            expand_button = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "#c-tracking-result--checkpoints-dropdown-button, button[class*='checkpoints-dropdown']"))
            )
            driver.execute_script("arguments[0].click();", expand_button) 
            time.sleep(2)
        except:
            # Button might not exist or timeline already expanded
            pass

        # Extract tracking details
        tracking_data = {
            "awb": awb_number,
            "status": "Unknown",
            "origin": None,
            "destination": None,
            "delivery_date": None,
            "timeline": []
        }

        # 3. Extract Status (Specific Selectors)
        try:
            # Primary status selector
            status_element = driver.find_element(By.CSS_SELECTOR, ".c-tracking-result--status-copy h3, .c-tracking-result--status-copy h2, [class*='status-copy']")
            tracking_data["status"] = status_element.text.strip()
        except:
            # Fallback parsing
            try:
                # Look for bold text or headers that contain status words
                headers = driver.find_elements(By.CSS_SELECTOR, "h2, h3, h4")
                for h in headers:
                    txt = h.text.lower()
                    if any(x in txt for x in ['delivered', 'transit', 'shipment picked up', 'returned', 'arrived']):
                         if len(h.text) < 50:
                            tracking_data["status"] = h.text.strip()
                            break
            except:
                pass

        # 4. Extract Origin/Destination/Date
        try:
            # These are often in a summary list
            summary_items = driver.find_elements(By.CSS_SELECTOR, ".c-tracking-result--summary-content dl div, .c-tracking-result--summary-content p")
            for item in summary_items:
                text = item.text
                if "Origin" in text:
                    tracking_data["origin"] = text.replace("Origin", "").replace(":", "").strip()
                elif "Destination" in text:
                    tracking_data["destination"] = text.replace("Destination", "").replace(":", "").strip()
        except:
            pass
            
        # 5. Extract Timeline Events (Specific Selectors)
        try:
            # Timeline items
            checkpoints = driver.find_elements(By.CSS_SELECTOR, ".c-tracking-result--checkpoint, li.c-tracking-result--checkpoint, [class*='tracking-result--checkpoint']")
            
            for checkpoint in checkpoints:
                try:
                    # Parse individual event 
                    full_text = checkpoint.text.split('\n')
                    
                    if len(full_text) >= 2:
                        event = {
                            "date_time": full_text[0] if len(full_text) > 0 else "", 
                            "activity": full_text[1] if len(full_text) > 1 else "",
                            "location": full_text[2] if len(full_text) > 2 else ""
                        }
                        tracking_data["timeline"].append(event)
                except:
                    continue
        except:
            pass

        # Determine status from timeline if not already set or empty
        # Improved logic to check all events for 'Delivered'
        if (tracking_data["status"] == "Unknown" or not tracking_data["status"]) and tracking_data["timeline"]:
            # Check all timeline events for delivered status first
            is_delivered = False
            for event in tracking_data["timeline"]:
                # Check both activity and date_time fields as sometimes they get swapped in parsing
                text_to_check = (str(event.get("activity", "")) + " " + str(event.get("date_time", ""))).upper()
                if "DELIVERED" in text_to_check:
                    tracking_data["status"] = "Delivered"
                    is_delivered = True
                    break
            
            if not is_delivered:
                # If not delivered, take the latest activity
                latest_event = tracking_data["timeline"][0]
                latest_text = (str(latest_event.get("activity", "")) + " " + str(latest_event.get("date_time", ""))).upper()
                
                if "TRANSIT" in latest_text or "DEPARTED" in latest_text:
                    tracking_data["status"] = "In Transit"
                elif "PICKED" in latest_text or "COLLECTED" in latest_text:
                    tracking_data["status"] = "Picked Up"
                elif "CUSTOMS" in latest_text:
                    tracking_data["status"] = "In Customs"
                elif "ARRIVED" in latest_text:
                    tracking_data["status"] = "Arrived at Facility"
                else:
                    # Use the activity text itself if it's reasonable length
                    activity_text = latest_event.get("activity", "")
                    if activity_text and len(activity_text) < 50:
                        tracking_data["status"] = activity_text
                    else:
                            tracking_data["status"] = "In Transit" # Default fallback if we have timeline data
        
        # If still no status but have destination
        if (tracking_data["status"] == "Unknown" or not tracking_data["status"]) and tracking_data["destination"]:
            tracking_data["status"] = "Tracking Data Available"
            
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

def update_dhl_tracking():
    """
    Main function to update DHL tracking data
    """
    # Read the Excel file
    file_path = 'split_datasets/DHL.xlsx'
    df = pd.read_excel(file_path)
    
    print(f"📦 Processing {len(df)} DHL shipments...")
    print("=" * 70)
    
    # Setup Chrome driver with headless option
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    # Add fake user agent to avoid bot detection
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36")
    
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
                tracking_details = get_dhl_tracking_details(awb_number, driver)
                
                # Update the dataframe
                df.at[index, 'STATUS'] = tracking_details['status']
                
                # Add to JSON data
                all_tracking_data.append(tracking_details)
                
                print(f"   ✓ Status: {tracking_details['status']}")
                if tracking_details['origin']:
                    print(f"   ✓ Origin: {tracking_details['origin']}")
                if tracking_details['destination']:
                    print(f"   ✓ Destination: {tracking_details['destination']}")
                if tracking_details['timeline']:
                    print(f"   ✓ Timeline Events: {len(tracking_details['timeline'])}")
                print()
                
                # Small delay to avoid overwhelming the server
                time.sleep(3)
            else:
                print(f"[{index + 1}/{len(df)}] Skipping empty AWB\n")
        
        # Save the updated Excel file (overwrite original)
        output_excel = file_path
        df.to_excel(output_excel, index=False)
        
        # Save detailed tracking data to JSON
        output_json = 'split_datasets/DHL_tracking_details.json'
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump({
                "provider": "DHL",
                "updated_at": datetime.now().isoformat(),
                "total_shipments": len(all_tracking_data),
                "shipments": all_tracking_data
            }, f, indent=2, ensure_ascii=False)
        
        print("=" * 70)
        print(f"✅ Successfully updated tracking data!")
        print(f"📁 Excel file saved to: {output_excel}")
        print(f"📁 JSON file saved to: {output_json}")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        driver.quit()

if __name__ == "__main__":
    update_dhl_tracking()
