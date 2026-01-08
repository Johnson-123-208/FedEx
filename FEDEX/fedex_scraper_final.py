import time
import pandas as pd
import os
import re
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def get_fedex_tracking_scraper(awb_number, driver):
    """
    Scrapes FedEx tracking data from their website.
    Returns: dict with status, origin, destination, timeline
    """
    print(f"🔍 Tracking: {awb_number}")
    
    url = f"https://www.fedex.com/fedextrack/?trknbr={awb_number}"
    driver.get(url)
    
    result = {
        "awb": awb_number,
        "status": "Unknown",
        "origin": "",
        "destination": "",
        "current_location": "",
        "timeline": []
    }
    
    try:
        # Wait for page to load
        time.sleep(15)
        
        # Extract ALL text from page (including Shadow DOM)
        page_text = driver.execute_script("""
            function extractAllText(root) {
                let text = "";
                if (!root) return text;
                
                if (root.nodeType === Node.TEXT_NODE) {
                    return root.textContent.trim() + "\\n";
                }
                
                if (root.shadowRoot) {
                    text += extractAllText(root.shadowRoot);
                }
                
                if (root.childNodes) {
                    root.childNodes.forEach(child => {
                        text += extractAllText(child);
                    });
                }
                
                return text;
            }
            return extractAllText(document.body);
        """)
        
        if not page_text or len(page_text) < 100:
            print(f"⚠️ Page content too short or empty")
            return result
            
        # Check for error messages
        if "we're sorry" in page_text.lower() or "permission" in page_text.lower():
            print(f"⚠️ Access blocked or error page detected")
            return result
        
        # Debug: Show snippet of extracted text
        # print(f"   📄 Text preview: {page_text[:500]}")
        
        lines = [line.strip() for line in page_text.split('\n') if line.strip()]
        
        # Filter out common UI noise
        ui_noise = ['obtain proof of delivery', 'view details', 'view travel history', 
                    'track another', 'help', 'sign up', 'log in', 'fedex home',
                    'shipping', 'tracking', 'locations', 'support']
        
        lines = [line for line in lines if line.lower() not in ui_noise]
        
        # === STATUS EXTRACTION ===
        # FedEx shows status prominently at the top
        status_keywords = {
            "DELIVERED": "Delivered",
            "IN TRANSIT": "In Transit", 
            "ON THE WAY": "In Transit",
            "OUT FOR DELIVERY": "Out for Delivery",
            "PICKED UP": "In Transit",
            "SHIPMENT EXCEPTION": "Exception",
            "DELIVERY EXCEPTION": "Exception",
            "PENDING": "In Transit",
            "AT LOCAL FEDEX FACILITY": "In Transit",
            "ARRIVED AT FEDEX LOCATION": "In Transit"
        }
        
        for i, line in enumerate(lines[:200]):  # Check first 200 lines
            line_upper = line.upper()
            for keyword, normalized in status_keywords.items():
                if keyword in line_upper and len(line) < 100:  # Avoid long paragraphs
                    result["status"] = normalized
                    print(f"   Status: {normalized}")
                    break
            if result["status"] != "Unknown":
                break
        
        # === ORIGIN/DESTINATION EXTRACTION ===
        # Look for "FROM" and "TO" patterns
        for i, line in enumerate(lines):
            if line.upper() == "FROM" or "ORIGIN" in line.upper():
                # Check next few lines for location
                for j in range(1, 5):
                    if i + j < len(lines):
                        candidate = lines[i + j]
                        # Location must have comma, reasonable length, not be a button
                        if ("," in candidate and 5 < len(candidate) < 60 and 
                            not any(noise in candidate.lower() for noise in ['view', 'click', 'button', 'link'])):
                            result["origin"] = candidate
                            break
            
            if line.upper() == "TO" or "DESTINATION" in line.upper():
                for j in range(1, 5):
                    if i + j < len(lines):
                        candidate = lines[i + j]
                        if ("," in candidate and 5 < len(candidate) < 60 and
                            not any(noise in candidate.lower() for noise in ['view', 'click', 'button', 'link'])):
                            result["destination"] = candidate
                            break
        
        # === TIMELINE EXTRACTION ===
        # FedEx format: Date (e.g., "Monday, 12/15/24") followed by Time (e.g., "3:45 PM")
        # then Activity description, then Location
        
        date_pattern = re.compile(r'\w+,\s*\d{1,2}/\d{1,2}/\d{2,4}')
        time_pattern = re.compile(r'\d{1,2}:\d{2}\s*(?:AM|PM)', re.IGNORECASE)
        
        current_date = ""
        timeline = []
        
        for i, line in enumerate(lines):
            # Capture date context
            if date_pattern.search(line):
                current_date = line
                continue
            
            # When we find a time, it's likely an event
            if time_pattern.search(line):
                event_time = line
                
                # Next line is usually the activity
                activity = lines[i + 1] if i + 1 < len(lines) else ""
                # Line after that is usually location
                location = lines[i + 2] if i + 2 < len(lines) else ""
                
                # Validate: activity shouldn't be another time, and should be meaningful
                if (activity and not time_pattern.search(activity) and len(activity) > 3 and
                    not any(noise in activity.lower() for noise in ui_noise)):
                    
                    # Validate location - should be reasonable length and not UI noise
                    # Accept locations with OR without commas (e.g., "HYDERABAD, TG, IN" or "HYDERABAD TG IN")
                    if (location and len(location) > 5 and len(location) < 100 and
                        not any(noise in location.lower() for noise in ui_noise)):
                        pass  # Location is valid
                    else:
                        location = ""  # Invalid location
                    
                    timeline.append({
                        "date_time": f"{current_date} {event_time}".strip(),
                        "activity": activity,
                        "location": location
                    })
        
        result["timeline"] = timeline
        
        # === CURRENT LOCATION (from most recent event) ===
        if timeline:
            # Get location from first event (most recent)
            loc = timeline[0].get("location", "")
            # Validate it's not empty and not UI noise
            if loc and len(loc) > 2 and not any(noise in loc.lower() for noise in ui_noise):
                result["current_location"] = loc
        
        # === FALLBACK: Extract origin/dest from timeline if missing ===
        if not result["origin"] and len(timeline) > 0:
            # Origin is usually the last (oldest) event location
            last_loc = timeline[-1].get("location", "")
            if last_loc and len(last_loc) > 2:
                result["origin"] = last_loc
        
        if not result["destination"] and len(timeline) > 0:
            # Destination is usually the first (newest) event location for delivered items
            if result["status"] == "Delivered":
                first_loc = timeline[0].get("location", "")
                if first_loc and len(first_loc) > 2:
                    result["destination"] = first_loc
        
        print(f"   ✓ Events: {len(timeline)} | Location: {result['current_location']}")
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    return result


def process_fedex_excel(file_path, max_rows=None):
    """
    Process Excel file and update tracking statuses via web scraping.
    """
    print(f"\n🚀 FedEx Web Scraping Tracker")
    print(f"📦 File: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"❌ File not found")
        return
    
    # Load Excel
    try:
        df = pd.read_excel(file_path)
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return
    
    # Find AWB column
    awb_col = None
    for col in df.columns:
        if any(x in str(col).upper() for x in ['AWB', 'TRACKING']):
            awb_col = col
            break
    
    if not awb_col:
        print("❌ Could not find AWB column")
        return
    
    print(f"📋 AWB Column: {awb_col}")
    
    # Ensure status column exists
    if 'STATUS' not in df.columns:
        df['STATUS'] = ''
    if 'Current Location' not in df.columns:
        df['Current Location'] = ''
    
    # Convert to string to avoid dtype warnings
    df['STATUS'] = df['STATUS'].astype(str)
    df['Current Location'] = df['Current Location'].astype(str)
    
    # Setup Chrome with stealth mode
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    driver = webdriver.Chrome(options=chrome_options)
    
    # Hide webdriver flag
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    try:
        # Filter rows to process
        pending_mask = ~df['STATUS'].str.lower().isin(['delivered', 'exception'])
        pending_indices = df[pending_mask].index.tolist()
        
        if max_rows:
            pending_indices = pending_indices[:max_rows]
        
        total = len(pending_indices)
        print(f"📊 Processing {total} shipments...\n")
        
        for count, idx in enumerate(pending_indices, 1):
            awb = str(df.at[idx, awb_col]).replace(' ', '').strip()
            
            print(f"[{count}/{total}] AWB: {awb}")
            
            # Scrape tracking data
            data = get_fedex_tracking_scraper(awb, driver)
            
            # Update DataFrame
            df.at[idx, 'STATUS'] = data['status']
            df.at[idx, 'Current Location'] = data['current_location']
            
            # Save every 5 records
            if count % 5 == 0:
                try:
                    df.to_excel(file_path, index=False)
                    print(f"💾 Progress saved ({count}/{total})")
                except Exception as e:
                    print(f"⚠️ Save error: {e}")
            
            # Rate limiting
            time.sleep(3)
        
        # Final save
        df.to_excel(file_path, index=False)
        print(f"\n✅ Complete! Processed {total} shipments.")
        
    except Exception as e:
        print(f"❌ Fatal error: {e}")
    finally:
        driver.quit()


if __name__ == "__main__":
    # Process the target file
    # Set max_rows=3 for testing, None for full run
    process_fedex_excel('split_datasets/FEDEX(564).xlsx', max_rows=3)
