"""
FedEx Tracking Service
Production-ready shipment tracking using FedEx REST API
"""

import os
import requests
from typing import Dict, List, Optional
import logging
from .token_manager import get_fedex_access_token, token_manager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FedExTrackingService:
    """
    Handles FedEx shipment tracking with automatic token refresh
    and comprehensive error handling
    """
    
    def __init__(self):
        """Initialize with environment-based configuration"""
        self.mode = os.getenv('FEDEX_MODE', 'sandbox').lower()
        
        # Set API endpoint based on mode
        if self.mode == 'production':
            self.tracking_url = 'https://apis.fedex.com/track/v1/trackingnumbers'
        else:
            self.tracking_url = 'https://apis-sandbox.fedex.com/track/v1/trackingnumbers'
        
        logger.info(f"FedEx Tracking Service initialized in {self.mode.upper()} mode")
    
    def track_shipment(self, tracking_number: str, retry_on_auth_error: bool = True) -> Dict:
        """
        Track a FedEx shipment by tracking number
        
        Args:
            tracking_number: FedEx tracking number (e.g., "794887278605")
            retry_on_auth_error: Retry once if token expires (default: True)
            
        Returns:
            dict: Normalized tracking data with status, events, locations
            
        Example response:
            {
                "success": True,
                "tracking_number": "794887278605",
                "status": "Delivered",
                "status_detail": "Delivered - Left at front door",
                "delivery_date": "2024-01-09",
                "origin": {"city": "Memphis", "state": "TN", "country": "US"},
                "destination": {"city": "Los Angeles", "state": "CA", "country": "US"},
                "events": [
                    {
                        "timestamp": "2024-01-09T14:30:00",
                        "status": "Delivered",
                        "location": "Los Angeles, CA"
                    }
                ]
            }
        """
        try:
            # Get valid access token
            access_token = get_fedex_access_token()
            
            # Prepare request
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json',
                'X-locale': 'en_US'
            }
            
            payload = {
                "trackingInfo": [
                    {
                        "trackingNumberInfo": {
                            "trackingNumber": tracking_number
                        }
                    }
                ],
                "includeDetailedScans": True
            }
            
            # Make API request
            logger.debug(f"Tracking shipment: {tracking_number}")
            response = requests.post(
                self.tracking_url,
                headers=headers,
                json=payload,
                timeout=15
            )
            
            # Handle authentication errors
            if response.status_code == 401 and retry_on_auth_error:
                logger.warning("Token expired, refreshing and retrying")
                token_manager.invalidate_token()
                return self.track_shipment(tracking_number, retry_on_auth_error=False)
            
            # Handle other errors
            if response.status_code != 200:
                return self._handle_error(response, tracking_number)
            
            # Parse and normalize response
            return self._normalize_response(response.json(), tracking_number)
            
        except requests.exceptions.Timeout:
            logger.error(f"Timeout tracking {tracking_number}")
            return self._error_response(tracking_number, "Request timeout")
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error tracking {tracking_number}: {type(e).__name__}")
            return self._error_response(tracking_number, f"Network error: {type(e).__name__}")
        
        except Exception as e:
            logger.error(f"Unexpected error tracking {tracking_number}: {str(e)}")
            return self._error_response(tracking_number, "System error")
    
    def track_multiple(self, tracking_numbers: List[str]) -> List[Dict]:
        """
        Track multiple shipments (sequential processing)
        
        Args:
            tracking_numbers: List of tracking numbers
            
        Returns:
            list: List of tracking results
        """
        results = []
        for tracking_num in tracking_numbers:
            result = self.track_shipment(tracking_num)
            results.append(result)
        return results
    
    def _normalize_response(self, raw_data: Dict, tracking_number: str) -> Dict:
        """
        Normalize FedEx API response to standardized format
        
        Args:
            raw_data: Raw FedEx API response
            tracking_number: Tracking number being queried
            
        Returns:
            dict: Normalized tracking data
        """
        try:
            # Extract tracking info
            output = raw_data.get('output', {})
            complete_tracks = output.get('completeTrackResults', [])
            
            if not complete_tracks:
                return self._error_response(tracking_number, "No tracking data found")
            
            track_result = complete_tracks[0]
            track_results = track_result.get('trackResults', [])
            
            if not track_results:
                return self._error_response(tracking_number, "No tracking results")
            
            shipment_data = track_results[0]
            
            # Extract status
            latest_status = shipment_data.get('latestStatusDetail', {})
            status = latest_status.get('description', 'Unknown')
            status_code = latest_status.get('code', '')
            
            # Extract dates
            dates_times = shipment_data.get('dateAndTimes', [])
            delivery_date = None
            for dt in dates_times:
                if dt.get('type') == 'ACTUAL_DELIVERY':
                    delivery_date = dt.get('dateTime', '')
                    break
            
            # Extract locations
            origin_location = shipment_data.get('originLocation', {})
            destination_location = shipment_data.get('destinationLocation', {})
            
            origin = {
                "city": origin_location.get('city', ''),
                "state": origin_location.get('stateOrProvinceCode', ''),
                "country": origin_location.get('countryCode', '')
            }
            
            destination = {
                "city": destination_location.get('city', ''),
                "state": destination_location.get('stateOrProvinceCode', ''),
                "country": destination_location.get('countryCode', '')
            }
            
            # Extract scan events
            events = []
            scan_events = shipment_data.get('scanEvents', [])
            
            for scan in scan_events:
                event_location = scan.get('scanLocation', {})
                events.append({
                    "timestamp": scan.get('date', ''),
                    "status": scan.get('eventDescription', ''),
                    "status_code": scan.get('eventType', ''),
                    "location": {
                        "city": event_location.get('city', ''),
                        "state": event_location.get('stateOrProvinceCode', ''),
                        "country": event_location.get('countryCode', '')
                    }
                })
            
            # Build normalized response
            return {
                "success": True,
                "tracking_number": tracking_number,
                "status": status,
                "status_code": status_code,
                "delivery_date": delivery_date,
                "origin": origin,
                "destination": destination,
                "events": events,
                "service_type": shipment_data.get('serviceType', ''),
                "package_count": shipment_data.get('packageCount', 1),
                "weight": shipment_data.get('packageWeight', {}),
                "raw_data": shipment_data  # Include for debugging if needed
            }
            
        except Exception as e:
            logger.error(f"Error normalizing response: {str(e)}")
            return self._error_response(tracking_number, "Data parsing error")
    
    def _handle_error(self, response: requests.Response, tracking_number: str) -> Dict:
        """
        Handle HTTP error responses from FedEx API
        
        Args:
            response: Failed HTTP response
            tracking_number: Tracking number being queried
            
        Returns:
            dict: Structured error response
        """
        status_code = response.status_code
        
        try:
            error_data = response.json()
            error_msg = error_data.get('errors', [{}])[0].get('message', 'Unknown error')
        except:
            error_msg = f"HTTP {status_code}"
        
        logger.error(f"FedEx API error {status_code}: {error_msg}")
        
        # Map common errors
        if status_code == 400:
            error_type = "Invalid tracking number"
        elif status_code == 401:
            error_type = "Authentication failed"
        elif status_code == 404:
            error_type = "Tracking not found"
        elif status_code >= 500:
            error_type = "FedEx service unavailable"
        else:
            error_type = f"API error ({status_code})"
        
        return self._error_response(tracking_number, error_type, error_msg)
    
    def _error_response(self, tracking_number: str, error_type: str, details: str = "") -> Dict:
        """
        Generate standardized error response
        
        Args:
            tracking_number: Tracking number that failed
            error_type: Type of error
            details: Additional error details
            
        Returns:
            dict: Structured error response
        """
        return {
            "success": False,
            "tracking_number": tracking_number,
            "error": error_type,
            "error_details": details,
            "status": "Error",
            "events": []
        }


# Global service instance
tracking_service = FedExTrackingService()


def track_shipment(tracking_number: str) -> Dict:
    """
    Convenience function to track a FedEx shipment
    
    Args:
        tracking_number: FedEx tracking number
        
    Returns:
        dict: Normalized tracking data
    """
    return tracking_service.track_shipment(tracking_number)
