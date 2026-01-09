import requests
import json

# Backend URL
BACKEND_URL = "https://fedex-3oat.onrender.com"

print("=" * 60)
print("🧪 Testing FedEx Backend API")
print("=" * 60)

# Test 1: Health Check
print("\n1️⃣ Testing Health Check...")
try:
    response = requests.get(f"{BACKEND_URL}/")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
    if response.status_code == 200:
        print("   ✅ Health check PASSED")
    else:
        print("   ❌ Health check FAILED")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

# Test 2: Track Endpoint
print("\n2️⃣ Testing Track Endpoint...")
try:
    payload = {
        "awb": "9232031340",
        "provider": "dhl"
    }
    response = requests.post(
        f"{BACKEND_URL}/track",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    print(f"   Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Track endpoint PASSED")
        print(f"   AWB: {data.get('awb', 'N/A')}")
        print(f"   Status: {data.get('status', 'N/A')}")
        print(f"   Timeline events: {len(data.get('timeline', []))}")
    else:
        print(f"   ❌ Track endpoint FAILED")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"   ❌ Error: {str(e)}")

print("\n" + "=" * 60)
print("✅ Backend testing complete!")
print("=" * 60)
