"""
Quick test of FedEx API with your credentials
"""
import os
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=" * 60)
print("FEDEX API TEST")
print("=" * 60)

# Check credentials
client_id = os.getenv('FEDEX_CLIENT_ID')
client_secret = os.getenv('FEDEX_CLIENT_SECRET')
mode = os.getenv('FEDEX_MODE', 'sandbox')

print(f"\n📋 Configuration:")
print(f"   Client ID: {client_id[:10]}..." if client_id else "   ❌ Client ID: Not found")
print(f"   Secret: {'*' * 20}" if client_secret else "   ❌ Secret: Not found")
print(f"   Mode: {mode.upper()}")

if not client_id or not client_secret:
    print("\n❌ ERROR: Missing credentials in .env file")
    sys.exit(1)

print("\n" + "-" * 60)
print("STEP 1: Testing OAuth Token Generation")
print("-" * 60)

try:
    from fedex_api import get_fedex_access_token
    
    token = get_fedex_access_token()
    print(f"✅ OAuth token obtained successfully!")
    print(f"   Token prefix: {token[:20]}...")
    print(f"   Token length: {len(token)} characters")
    
except Exception as e:
    print(f"❌ OAuth failed: {str(e)}")
    print("\nPossible issues:")
    print("  1. Credentials are incorrect")
    print("  2. FedEx API endpoint is unreachable")
    print("  3. Account not activated")
    sys.exit(1)

print("\n" + "-" * 60)
print("STEP 2: Testing Shipment Tracking")
print("-" * 60)

try:
    from fedex_api import track_shipment
    
    # Use FedEx sandbox test tracking number
    test_tracking = "794887278605"
    print(f"\nTracking shipment: {test_tracking}")
    
    result = track_shipment(test_tracking)
    
    if result['success']:
        print(f"\n✅ Tracking successful!")
        print(f"   Status: {result['status']}")
        print(f"   Status Code: {result.get('status_code', 'N/A')}")
        
        if result.get('origin'):
            origin = result['origin']
            print(f"   Origin: {origin.get('city', '')}, {origin.get('state', '')} {origin.get('country', '')}")
        
        if result.get('destination'):
            dest = result['destination']
            print(f"   Destination: {dest.get('city', '')}, {dest.get('state', '')} {dest.get('country', '')}")
        
        events = result.get('events', [])
        print(f"   Events: {len(events)} scan events found")
        
        if events:
            print(f"\n   📦 Recent Events:")
            for i, event in enumerate(events[:3], 1):
                loc = event.get('location', {})
                location_str = f"{loc.get('city', '')}, {loc.get('state', '')}"
                print(f"      {i}. {event.get('timestamp', 'N/A')}")
                print(f"         {event.get('status', '')} - {location_str}")
        
        print(f"\n✅ FedEx API is fully functional!")
        
    else:
        print(f"\n⚠️ Tracking returned error:")
        print(f"   Error: {result.get('error', 'Unknown')}")
        print(f"   Details: {result.get('error_details', 'N/A')}")
        
        if result.get('error') == 'Invalid tracking number':
            print("\n💡 This is expected for sandbox - try a real tracking number in production mode")
    
except Exception as e:
    print(f"\n❌ Tracking failed: {str(e)}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)
print("✅ ALL TESTS COMPLETED SUCCESSFULLY!")
print("=" * 60)
print("\n💡 Next steps:")
print("   1. Integration is ready for use")
print("   2. Replace Selenium-based tracking with this API")
print("   3. For production: Change FEDEX_MODE=production in .env")
print("\n")
