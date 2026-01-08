from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import threading
import traceback
import sys
import os

# Add current dir to path just in case
sys.path.append(os.getcwd())

try:
    from geopy.geocoders import Nominatim
    from geopy.exc import GeocoderTimedOut, GeocoderServiceError
except ImportError:
    print("Warning: geopy not installed. Map coordinates will not be generated.")
    Nominatim = None
    
import time as time_module

# Initialize geocoder
geolocator = None
if Nominatim:
    geolocator = Nominatim(user_agent="fedex_tracking_app")

def geocode_location(location_name, max_retries=3):
    """
    Convert location name to coordinates with retry logic
    Returns: dict with lat and lng, or None if failed
    """
    if not geolocator or not location_name or location_name == 'N/A':
        return None
    
    for attempt in range(max_retries):
        try:
            location = geolocator.geocode(location_name, timeout=10)
            if location:
                return {
                    "lat": location.latitude,
                    "lng": location.longitude
                }
            return None
        except (GeocoderTimedOut, GeocoderServiceError) as e:
            if attempt < max_retries - 1:
                time_module.sleep(1)
                continue
            print(f"Geocoding failed for {location_name}: {str(e)}")
            return None
    return None

# Import functions 
# Note: Using generic try/except to allow partial functionality if some scripts break
try:
    from update_atlantic_tracking import get_atlantic_tracking_details
except ImportError:
    print("Could not import Atlantic script")

try:
    from update_courierwala_tracking import get_courierwala_tracking_details
except ImportError:
    print("Could not import Courier Wala script")
    
try:
    from update_dhl_tracking import get_dhl_tracking_details
except ImportError:
    print("Could not import DHL script")
    
try:
    from update_fedex_tracking import get_fedex_tracking_details
except ImportError:
    print("Could not import FedEx script")

try:
    from update_icl_tracking import get_icl_tracking_details
except ImportError:
    print("Could not import ICL script")

try:
    from update_pxc_tracking import get_pxc_tracking_details
except ImportError:
    print("Could not import PXC script")

try:
    from update_united_tracking import get_united_tracking_details
except ImportError:
    print("Could not import United Express script")

app = Flask(__name__)
CORS(app)

driver = None
driver_lock = threading.Lock()

def get_driver():
    global driver
    if driver is None:
        print("Initializing Global Chrome Driver...")
        chrome_options = Options()
        # Use new headless mode (harder to detect)
        chrome_options.add_argument('--headless=new')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--window-size=1920,1080')
        # Stealth mode settings
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        driver = webdriver.Chrome(options=chrome_options)
        
        # Hide webdriver flag
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    return driver

@app.route('/track', methods=['POST'])
def track():
    req_data = request.json
    awb = str(req_data.get('awb')).strip()
    provider = req_data.get('provider')
    
    print(f"🚀 Tracking Request: AWB={awb}, Provider={provider}")
    
    if not awb or not provider:
        return jsonify({"error": "Missing AWB or Provider"}), 400
        
    result = {}
    
    try:
        with driver_lock:
            drv = get_driver()
            
            if provider == 'Atlantic':
                result = get_atlantic_tracking_details(awb, drv)
            elif provider == 'Courier Wala':
                result = get_courierwala_tracking_details(awb, drv)
            elif provider == 'DHL':
                result = get_dhl_tracking_details(awb, drv)
            elif provider == 'FedEx':
                result = get_fedex_tracking_details(awb, drv)
            elif provider == 'ICL':
                result = get_icl_tracking_details(awb, drv)
            elif provider == 'PXC Pacific':
                result = get_pxc_tracking_details(awb, drv)
            elif provider == 'United Express':
                result = get_united_tracking_details(awb, drv)
            else:
                return jsonify({"error": "Unknown Provider - logic not implemented"}), 400
            
            # Normalize result structure for Frontend
            origin_location = result.get('origin')
            destination_location = result.get('destination')
            timeline = result.get('timeline', [])
            
            print(f"DEBUG - Initial origin: {origin_location}, destination: {destination_location}")
            print(f"DEBUG - Timeline has {len(timeline)} events")

            # Fallback: Try to infer Origin/Destination from Timeline if missing
            if (not origin_location or origin_location == 'N/A' or str(origin_location) == 'None') and timeline:
                # Use the location of the oldest event (last in list usually, or first depending on sort)
                # Assuming timeline is sorted new -> old. If not, we might need to check dates.
                # Let's check the last item in the list for Origin
                if timeline[-1].get('location') and timeline[-1]['location'].strip():
                    origin_location = timeline[-1]['location']
                    print(f"DEBUG - Extracted origin from timeline: {origin_location}")
            
            if (not destination_location or destination_location == 'N/A' or str(destination_location) == 'None') and timeline:
                # Use the location of the newest event (first in list)
                if timeline[0].get('location') and timeline[0]['location'].strip():
                    destination_location = timeline[0]['location']
                    print(f"DEBUG - Extracted destination from timeline: {destination_location}")

            print(f"DEBUG - Final origin: {origin_location}, destination: {destination_location}")

            # Geocode locations for map
            origin_coords = geocode_location(origin_location)
            destination_coords = geocode_location(destination_location)
            
            print(f"DEBUG - Origin coords: {origin_coords}, Destination coords: {destination_coords}")
            
            # Build coordinates object if both locations are geocoded
            coordinates = None
            if origin_coords and destination_coords:
                coordinates = {
                    "origin": origin_coords,
                    "destination": destination_coords
                }
                print(f"DEBUG - Coordinates object created successfully")
            
            response = {
                "awb": result.get('awb', awb),
                "status": result.get('status', 'Unknown'),
                "origin": origin_location if origin_location else 'N/A',
                "destination": destination_location if destination_location else 'N/A',
                "service": provider,
                "weight": result.get('weight', 'N/A'),
                "estimatedDelivery": result.get('delivery_date', result.get('delivery_date_time', 'N/A')),
                "timeline": timeline,
                "coordinates": coordinates
            }
            
            return jsonify(response)
            
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/shipments', methods=['GET'])
def get_shipments():
    """Endpoint to get all shipments from DataSet.xlsx for dashboards"""
    try:
        import pandas as pd
        
        # Read the Excel file
        df = pd.read_excel('DataSet.xlsx')
        
        # Convert to list of dictionaries
        shipments = df.to_dict('records')
        
        # Calculate metrics
        total = len(df)
        delivered = len(df[df['STATUS'].str.lower() == 'delivered']) if 'STATUS' in df.columns else 0
        in_transit = len(df[df['STATUS'].str.lower() == 'in transit']) if 'STATUS' in df.columns else 0
        success_rate = (delivered / total * 100) if total > 0 else 0
        
        response = {
            'shipments': shipments,
            'metrics': {
                'total': total,
                'delivered': delivered,
                'in_transit': in_transit,
                'success_rate': round(success_rate, 1)
            }
        }
        
        return jsonify(response)
    except Exception as e:
        print(f"Error loading shipments: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("✅ Starting Flask Tracking API on port 5000...")
    app.run(port=5000, debug=True, use_reloader=False)
