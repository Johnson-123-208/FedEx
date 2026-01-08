
import requests
import json
import time

CLIENT_ID = "l7a73775cf9a4747f088941551364be841"
CLIENT_SECRET = "ae5732d59f8a49a78891e6d764febf02"

def get_access_token():
    url = "https://apis.fedex.com/oauth/token"
    payload = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    print(f"🔑 Authenticating with FedEx API...")
    try:
        response = requests.post(url, data=payload, headers=headers)
        response.raise_for_status()
        token = response.json().get('access_token')
        print("✅ Access Token Recieved")
        return token
    except Exception as e:
        print(f"❌ Auth Error: {e}")
        print(f"Response: {response.text if 'response' in locals() else 'None'}")
        return None

def track_fedex(awb, token):
    url = "https://apis.fedex.com/track/v1/trackingnumbers"
    
    payload = json.dumps({
        "trackingInfo": [
            {
                "trackingNumberInfo": {
                    "trackingNumber": str(awb)
                }
            }
        ],
        "includeDetailedScans": True
    })
    
    headers = {
        'Content-Type': 'application/json',
        'X-locale': 'en_US',
        'Authorization': f'Bearer {token}'
    }
    
    print(f"🔍 API Tracking AWB: {awb}")
    try:
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
        data = response.json()
        return data
    except Exception as e:
        print(f"❌ Track Error: {e}")
        print(f"Response: {response.text}")
        return None

if __name__ == "__main__":
    token = get_access_token()
    if token:
        # Test with the known AWB
        awb = "885670900649"
        data = track_fedex(awb, token)
        if data:
            print(json.dumps(data, indent=2))
