# FedEx REST API Integration

Production-grade automation service for FedEx shipment tracking using official REST APIs.

## Features

✅ **OAuth Token Management**
- Automatic token caching
- Auto-refresh before expiry
- Thread-safe singleton pattern

✅ **Tracking Service**
- Real-time shipment tracking
- Normalized response format
- Comprehensive error handling

✅ **Production Ready**
- Environment-based configuration
- Extensive logging
- Retry logic for transient failures
- Suitable for automation/cron jobs

## Setup

### 1. Install Dependencies

```bash
pip install requests python-dotenv
```

### 2. Configure Environment

Create `.env` file in `backend/` directory:

```env
FEDEX_CLIENT_ID=your_client_id_here
FEDEX_CLIENT_SECRET=your_client_secret_here
FEDEX_MODE=sandbox  # or production
```

### 3. Get FedEx API Credentials

1. Sign up at [FedEx Developer Portal](https://developer.fedex.com/)
2. Create a project
3. Generate API credentials (Client ID & Secret)
4. Start with **sandbox** mode for testing

## Usage

### Basic Tracking

```python
from fedex_api import track_shipment

# Track a shipment
result = track_shipment("794887278605")

if result['success']:
    print(f"Status: {result['status']}")
    print(f"Origin: {result['origin']}")
    print(f"Destination: {result['destination']}")
else:
    print(f"Error: {result['error']}")
```

### Advanced Usage

```python
from fedex_api import FedExTrackingService

# Create service instance
service = FedExTrackingService()

# Track multiple shipments
tracking_numbers = ["794887278605", "123456789012"]
results = service.track_multiple(tracking_numbers)

for result in results:
    print(f"{result['tracking_number']}: {result['status']}")
```

### Automation Workflow

```python
# Perfect for cron jobs, n8n, or background workers
from fedex_api import track_shipment
import schedule

def update_shipments():
    """Run every hour"""
    shipments = get_shipments_from_database()  # Your DB logic
    
    for shipment in shipments:
        result = track_shipment(shipment.tracking_number)
        if result['success']:
            shipment.update_status(result['status'])

# Schedule
schedule.every().hour.do(update_shipments)
```

## Response Format

### Successful Response

```json
{
  "success": true,
  "tracking_number": "794887278605",
  "status": "Delivered",
  "status_code": "DL",
  "delivery_date": "2024-01-09T14:30:00",
  "origin": {
    "city": "Memphis",
    "state": "TN",
    "country": "US"
  },
  "destination": {
    "city": "Los Angeles",
    "state": "CA",
    "country": "US"
  },
  "events": [
    {
      "timestamp": "2024-01-09T14:30:00",
      "status": "Delivered",
      "status_code": "DL",
      "location": {
        "city": "Los Angeles",
        "state": "CA",
        "country": "US"
      }
    }
  ],
  "service_type": "FEDEX_GROUND",
  "package_count": 1
}
```

### Error Response

```json
{
  "success": false,
  "tracking_number": "000000000000",
  "error": "Tracking not found",
  "error_details": "No tracking information available",
  "status": "Error",
  "events": []
}
```

## Architecture

```
fedex_api/
├── __init__.py              # Package exports
├── token_manager.py         # OAuth token handling
└── tracking_service.py      # Tracking API logic

Backend Flow:
1. Get tracking request
2. Token Manager checks cache
3. If expired → Request new token
4. Tracking Service makes API call
5. Response normalized and returned
```

## Error Handling

The service handles all error scenarios:

| Error | Handling |
|-------|----------|
| Expired token | Auto-refresh and retry |
| Invalid tracking number | Structured error response |
| Network timeout | Clean timeout error |
| FedEx downtime | Service unavailable error |
| Missing credentials | Startup validation error |

## Security

✅ Credentials stored in `.env` (not in code)  
✅ Tokens never logged or exposed  
✅ Auto-sanitization of error messages  
✅ No sensitive data in responses  

## Testing

Run examples:

```bash
cd backend/
python example_usage.py
```

This will demonstrate:
- Single shipment tracking
- Batch tracking
- Automation workflows
- Error handling

## Sandbox vs Production

**Sandbox Mode** (Testing):
```env
FEDEX_MODE=sandbox
```
- Use test tracking numbers
- No real shipments affected
- Free for development

**Production Mode** (Live):
```env
FEDEX_MODE=production
```
- Real shipment data
- Billing may apply
- Use in production apps

## Integration

### Flask API Endpoint

```python
from flask import Flask, jsonify, request
from fedex_api import track_shipment

app = Flask(__name__)

@app.route('/api/track', methods=['POST'])
def track():
    data = request.json
    tracking_number = data.get('tracking_number')
    
    result = track_shipment(tracking_number)
    return jsonify(result)
```

### Background Worker

```python
# Perfect for Celery, RQ, or similar
from fedex_api import track_shipment

def track_shipment_task(tracking_number):
    """Async task for tracking"""
    result = track_shipment(tracking_number)
    # Save to database
    save_to_db(result)
    return result
```

## Logs

The service provides detailed logging:

```
INFO: FedEx Token Manager initialized in SANDBOX mode
INFO: Requesting new FedEx access token
INFO: New token obtained, expires in 3600s
DEBUG: Tracking shipment: 794887278605
INFO: FedEx Tracking Service initialized in SANDBOX mode
```

## Performance

- **Token Caching**: Single token reused for ~1 hour
- **No Redundant Calls**: Token validated before every request
- **Automatic Retry**: Failed auth retried once automatically
- **Timeout Protection**: 15s timeout prevents hanging

## Troubleshooting

**"Missing FedEx credentials"**
→ Create `.env` file with FEDEX_CLIENT_ID and FEDEX_CLIENT_SECRET

**"OAuth failed: HTTP 401"**
→ Check credentials are correct for your FedEx account

**"Token expired"**
→ Handled automatically, but check system time is correct

**"Tracking not found"**
→ Tracking number may be invalid or not in system yet

## Support

- [FedEx API Docs](https://developer.fedex.com/api/en-us/catalog/track/v1/docs.html)
- [OAuth Guide](https://developer.fedex.com/api/en-us/get-started.html)

---

**This is production-grade infrastructure. Ready for automation, cron jobs, and continuous operation.**
