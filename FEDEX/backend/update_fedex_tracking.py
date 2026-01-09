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

def get_fedex_tracking_details(awb_number, driver):
    """
    Scrapes FedEx tracking data from their website.
    Returns: dict with status, origin, destination, timeline
    """
    url = f"https://www.fedex.com/fedextrack/?trknbr={awb_number}"
    driver.get(url)
    
    result = {
        "awb": awb_number,
        "status": "Unknown",
        "origin": "",
        "destination": "",
        "timeline": []
    }
    
    try:
        # Wait for page to load - FedEx uses AJAX so needs more time
        print(f"⏳ FedEx: Waiting for tracking data to load...")
        
        # Poll for content (up to 20s) instead of hard sleep
        start_wait = time.time()
        while time.time() - start_wait < 20:
             # Basic check if relevant content loaded
             src = driver.page_source.lower()
             if "shipment" in src or "delivered" in src or "in transit" in src or "tracking" in src:
                  time.sleep(2) # Allow settling
                  break
             time.sleep(1)
        
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
            print(f"⚠️ FedEx: Empty page content for {awb_number} (length: {len(page_text) if page_text else 0})")
            return result
        
        print(f"📄 FedEx: Extracted {len(page_text)} chars. Preview: {page_text[:500]}")
        
        # Check if we actually got tracking content (not just homepage)
        if "tracking" not in page_text.lower() and "shipment" not in page_text.lower():
            print(f"⚠️ FedEx: Page loaded but no tracking content found. Might be homepage or error.")
            return result
            
        # Check for error messages
        if "we're sorry" in page_text.lower() or "permission" in page_text.lower():
            print(f"⚠️ FedEx: Access blocked for {awb_number}")
            return result
        
        lines = [line.strip() for line in page_text.split('\n') if line.strip()]
        
        # Filter out common UI noise
        ui_noise = ['obtain proof of delivery', 'view details', 'view travel history', 
                    'track another', 'help', 'sign up', 'log in', 'fedex home',
                    'shipping', 'tracking', 'locations', 'support']
        
        lines = [line for line in lines if line.lower() not in ui_noise]
        
        # === STATUS EXTRACTION ===
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
        
        for i, line in enumerate(lines[:200]):
            line_upper = line.upper()
            for keyword, normalized in status_keywords.items():
                if keyword in line_upper and len(line) < 100:
                    result["status"] = normalized
                    print(f"✓ FedEx Status: {normalized}")
                    break
            if result["status"] != "Unknown":
                break
        
        # === ORIGIN/DESTINATION EXTRACTION ===
        for i, line in enumerate(lines):
            if line.upper() == "FROM" or "ORIGIN" in line.upper():
                for j in range(1, 5):
                    if i + j < len(lines):
                        candidate = lines[i + j]
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
        date_pattern = re.compile(r'\w+,\s*\d{1,2}/\d{1,2}/\d{2,4}')
        time_pattern = re.compile(r'\d{1,2}:\d{2}\s*(?:AM|PM)', re.IGNORECASE)
        
        current_date = ""
        timeline = []
        
        for i, line in enumerate(lines):
            if date_pattern.search(line):
                current_date = line
                continue
            
            if time_pattern.search(line):
                event_time = line
                activity = lines[i + 1] if i + 1 < len(lines) else ""
                location = lines[i + 2] if i + 2 < len(lines) else ""
                
                if (activity and not time_pattern.search(activity) and len(activity) > 3 and
                    not any(noise in activity.lower() for noise in ui_noise)):
                    
                    # Validate location
                    if (location and len(location) > 5 and len(location) < 100 and
                        not any(noise in location.lower() for noise in ui_noise) and
                        "DELIVERY STATUS" not in location.upper()):
                        pass  # Location is valid
                    else:
                        location = ""
                    
                    timeline.append({
                        "date_time": f"{current_date} {event_time}".strip(),
                        "activity": activity,
                        "location": location
                    })
        
        result["timeline"] = timeline
        print(f"✓ FedEx Timeline: {len(timeline)} events")
        
        # === FALLBACK: Extract origin/dest from timeline ===
        if not result["origin"] and len(timeline) > 0:
            last_loc = timeline[-1].get("location", "")
            if last_loc and len(last_loc) > 2:
                result["origin"] = last_loc
        
        if not result["destination"] and len(timeline) > 0:
            if result["status"] == "Delivered":
                first_loc = timeline[0].get("location", "")
                if first_loc and len(first_loc) > 2:
                    result["destination"] = first_loc
        
    except Exception as e:
        print(f"❌ FedEx error for {awb_number}: {e}")
        traceback.print_exc()
        
    return result


def process_fedex_file(file_path):
    """Legacy batch processing function - not used by app.py"""
    pass


if __name__ == "__main__":
    print("This module is imported by app.py for tracking")
