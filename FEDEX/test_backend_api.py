#!/usr/bin/env python3
import requests
import json

# Test health check
print("Testing backend health check...")
try:
    response = requests.get('https://fedex-backend-t4su.onrender.com/', timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "="*60)

# Test tracking endpoint
print("\nTesting tracking endpoint with ICL AWB...")
try:
    response = requests.post(
        'https://fedex-backend-t4su.onrender.com/track',
        json={'awb': '6002770480', 'provider': 'ICL'},
        timeout=30
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
