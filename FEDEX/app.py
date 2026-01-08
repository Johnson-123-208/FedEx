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

app = Flask(__name__)
CORS(app)

driver = None
driver_lock = threading.Lock()

def get_driver():
    global driver
    if driver is None:
        print("Initializing Global Chrome Driver...")
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--window-size=1920,1080')
        # Add User Agent for FedEx
        chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
        
        driver = webdriver.Chrome(options=chrome_options)
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
            else:
                return jsonify({"error": "Unknown Provider - logic not implemented"}), 400
            
            # Normalize result structure for Frontend
            response = {
                "awb": result.get('awb', awb),
                "status": result.get('status', 'Unknown'),
                "origin": result.get('origin', 'N/A'),
                "destination": result.get('destination', 'N/A'),
                "service": provider,
                "weight": result.get('weight', 'N/A'),
                "estimatedDelivery": result.get('delivery_date', result.get('delivery_date_time', 'N/A')),
                "timeline": result.get('timeline', [])
            }
            
            return jsonify(response)
            
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("✅ Starting Flask Tracking API on port 5000...")
    app.run(port=5000, debug=True, use_reloader=False)
