"""
FedEx API Usage Examples
Demonstrates production-ready tracking automation
"""

import os
from dotenv import load_dotenv
from fedex_api import track_shipment, FedExTrackingService
import json

# Load environment variables
load_dotenv()


def example_single_tracking():
    """Track a single shipment"""
    print("=" * 60)
    print("EXAMPLE 1: Track Single Shipment")
    print("=" * 60)
    
    # Track shipment
    tracking_number = "794887278605"  # Example sandbox tracking number
    result = track_shipment(tracking_number)
    
    # Display results
    if result['success']:
        print(f"\n✓ Tracking Number: {result['tracking_number']}")
        print(f"  Status: {result['status']}")
        print(f"  Origin: {result['origin']['city']}, {result['origin']['state']}")
        print(f"  Destination: {result['destination']['city']}, {result['destination']['state']}")
        print(f"  Events: {len(result['events'])} scan events")
        
        # Show recent events
        if result['events']:
            print("\n  Recent Events:")
            for event in result['events'][:3]:
                loc = event['location']
                print(f"    - {event['timestamp']}: {event['status']} ({loc['city']}, {loc['state']})")
    else:
        print(f"\n✗ Tracking failed: {result['error']}")
        print(f"  Details: {result.get('error_details', 'N/A')}")
    
    print("\n" + "=" * 60 + "\n")


def example_multiple_tracking():
    """Track multiple shipments"""
    print("=" * 60)
    print("EXAMPLE 2: Track Multiple Shipments")
    print("=" * 60)
    
    tracking_numbers = [
        "794887278605",
        "123456789012",  # Invalid number for error demo
        "794887278605"
    ]
    
    service = FedExTrackingService()
    results = service.track_multiple(tracking_numbers)
    
    # Summarize results
    successful = sum(1 for r in results if r['success'])
    failed = len(results) - successful
    
    print(f"\nProcessed {len(results)} shipments:")
    print(f"  ✓ Successful: {successful}")
    print(f"  ✗ Failed: {failed}")
    
    # Show individual results
    for result in results:
        status_icon = "✓" if result['success'] else "✗"
        print(f"\n  {status_icon} {result['tracking_number']}: {result['status']}")
    
    print("\n" + "=" * 60 + "\n")


def example_automation_workflow():
    """
    Example: Automated background tracking workflow
    Suitable for cron jobs, n8n, or background workers
    """
    print("=" * 60)
    print("EXAMPLE 3: Automation Workflow")
    print("=" * 60)
    
    # Simulate tracking from a database or file
    shipments_to_track = [
        {"id": 1, "tracking_number": "794887278605", "customer": "John Doe"},
        {"id": 2, "tracking_number": "123456789012", "customer": "Jane Smith"},
    ]
    
    service = FedExTrackingService()
    updates = []
    
    for shipment in shipments_to_track:
        print(f"\nProcessing shipment #{shipment['id']} for {shipment['customer']}...")
        
        result = service.track_shipment(shipment['tracking_number'])
        
        update = {
            "shipment_id": shipment['id'],
            "customer": shipment['customer'],
            "tracking_number": result['tracking_number'],
            "status": result['status'],
            "success": result['success']
        }
        
        updates.append(update)
        
        if result['success']:
            print(f"  ✓ Status updated: {result['status']}")
        else:
            print(f"  ✗ Update failed: {result['error']}")
    
    # Save updates (would be database in production)
    print("\n📊 Batch Update Summary:")
    print(json.dumps(updates, indent=2))
    
    print("\n" + "=" * 60 + "\n")


def example_error_handling():
    """Demonstrate robust error handling"""
    print("=" * 60)
    print("EXAMPLE 4: Error Handling")
    print("=" * 60)
    
    test_cases = [
        ("794887278605", "Valid tracking number"),
        ("000000000000", "Invalid tracking number"),
        ("INVALID", "Malformed tracking number"),
    ]
    
    service = FedExTrackingService()
    
    for tracking_num, description in test_cases:
        print(f"\nTest: {description}")
        print(f"  Tracking: {tracking_num}")
        
        result = service.track_shipment(tracking_num)
        
        if result['success']:
            print(f"  ✓ Result: {result['status']}")
        else:
            print(f"  ✗ Error: {result['error']}")
            if result.get('error_details'):
                print(f"  Details: {result['error_details']}")
    
    print("\n" + "=" * 60 + "\n")


if __name__ == "__main__":
    """
    Run all examples
    
    Requirements:
    1. Create .env file with FedEx credentials
    2. Install dependencies: pip install python-dotenv requests
    3. Run: python example_usage.py
    """
    
    # Check environment
    if not os.getenv('FEDEX_CLIENT_ID'):
        print("⚠️  ERROR: FedEx credentials not found!")
        print("Please create .env file with:")
        print("  FEDEX_CLIENT_ID=your_client_id")
        print("  FEDEX_CLIENT_SECRET=your_secret")
        print("  FEDEX_MODE=sandbox")
        exit(1)
    
    print("\n🚀 FedEx API Automation Examples\n")
    
    # Run examples
    example_single_tracking()
    example_multiple_tracking()
    example_automation_workflow()
    example_error_handling()
    
    print("✅ All examples completed!")
    print("\n💡 This code is ready for:")
    print("   - Cron jobs")
    print("   - n8n workflows") 
    print("   - Background workers")
    print("   - Automation pipelines\n")
