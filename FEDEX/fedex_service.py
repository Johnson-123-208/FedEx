import requests
import time
import json
import os
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

class FedExTrackingService:
    def __init__(self, client_id, client_secret, env='production'):
        self.client_id = client_id
        self.client_secret = client_secret
        self.env = env.lower()
        
        if self.env == 'sandbox':
            self.base_url = "https://apis-sandbox.fedex.com"
        else:
            self.base_url = "https://apis.fedex.com"
            
        self.token = None
        self.token_expiry = 0

    def _get_token(self):
        """Authenticates with FedEx API and caches the token."""
        if self.token and time.time() < self.token_expiry:
            return self.token

        url = f"{self.base_url}/oauth/token"
        payload = {
            'grant_type': 'client_credentials',
            'client_id': self.client_id,
            'client_secret': self.client_secret
        }
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}

        try:
            response = requests.post(url, data=payload, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            self.token = data['access_token']
            # Cache for slightly less than actual expiry to be safe (usually 3600s)
            self.token_expiry = time.time() + int(data.get('expires_in', 3600)) - 60
            print(f"✅ FedEx Authentication Successful ({self.env})")
            return self.token
        except Exception as e:
            print(f"❌ FedEx Auth Error: {e}")
            if 'response' in locals():
                print(f"Response: {response.text}")
            raise

    def normalize_status(self, api_status, events):
        """Normalizes FedEx status codes to standard internal statuses."""
        # Standard mappings based on FedEx API values
        s = api_status.lower()
        
        if 'delivered' in s:
            return 'Delivered'
        elif 'exception' in s or 'delivery exception' in s:
            return 'Exception'
        elif 'out' in s and 'delivery' in s:
            return 'Out for Delivery'
        elif any(x in s for x in ['transit', 'picked', 'way', 'arrived', 'departed', 'label created']):
            return 'In Transit'
        
        # Fallback: Check most recent event description
        if events:
            last_desc = events[0].get('eventDescription', '').lower()
            if 'delivered' in last_desc: return 'Delivered'
            if 'out for delivery' in last_desc: return 'Out for Delivery'
            
        return 'In Transit' # Default fallback

    def get_tracking_info(self, awb):
        """Fetches tracking info for a single AWB."""
        try:
            token = self._get_token()
            url = f"{self.base_url}/track/v1/trackingnumbers"
            
            payload = {
                "trackingInfo": [
                    {
                        "trackingNumberInfo": {
                            "trackingNumber": str(awb)
                        }
                    }
                ],
                "includeDetailedScans": True
            }
            
            headers = {
                'Content-Type': 'application/json',
                'X-locale': 'en_US',
                'Authorization': f'Bearer {token}'
            }

            response = requests.post(url, headers=headers, json=payload, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # Parse Response
            result = {
                'awb': awb,
                'courier': 'FedEx',
                'status': 'Unknown',
                'current_location': '',
                'last_update': '',
                'raw_events': []
            }

            complete_track = data.get('output', {}).get('completeTrackResults', [])
            if not complete_track:
                return result

            track_result = complete_track[0].get('trackResults', [])
            if not track_result:
                return result

            # Access the first result
            details = track_result[0]
            
            # Extract basic info
            latest_status_detail = details.get('latestStatusDetail', {})
            api_status = latest_status_detail.get('statusByLocale', 'Unknown')
            
            # Extract Location
            scan_loc = latest_status_detail.get('scanLocation', {})
            city = scan_loc.get('city', '')
            state = scan_loc.get('stateOrProvinceCode', '')
            country = scan_loc.get('countryCode', '')
            location_str = f"{city}, {state}, {country}".strip(', ')
            
            # Parse Events
            events = []
            for scan in details.get('scanEvents', []):
                evt_desc = scan.get('eventDescription', '')
                evt_date = scan.get('date', '') # format usually 2023-10-25T10:00:00
                evt_loc = scan.get('scanLocation', {}).get('city', '')
                events.append({
                    'description': evt_desc,
                    'date': evt_date,
                    'location': evt_loc
                })
            
            # Set Final Normalized Data
            result['status'] = self.normalize_status(api_status, events)
            result['current_location'] = location_str
            result['raw_events'] = events
            if events:
                result['last_update'] = events[0]['date']
                
            return result

        except Exception as e:
            # print(f"⚠️ Tracking Failed for {awb}: {e}") # Reduce noise in batch
            return {
                'awb': awb,
                'courier': 'FedEx',
                'status': 'Error',
                'error': str(e)
            }

    def track_batch(self, awb_list, max_workers=5):
        """Concurrent batch tracking."""
        results = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_awb = {executor.submit(self.get_tracking_info, awb): awb for awb in awb_list}
            for future in as_completed(future_to_awb):
                try:
                    data = future.result()
                    results.append(data)
                except Exception as exc:
                    print(f'Generated an exception: {exc}')
        return results
