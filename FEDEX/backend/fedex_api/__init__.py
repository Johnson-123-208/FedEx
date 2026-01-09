"""
FedEx API Integration Package
Production-ready FedEx REST API integration for automated tracking
"""

from .token_manager import get_fedex_access_token, FedExTokenManager
from .tracking_service import track_shipment, FedExTrackingService

__all__ = [
    'get_fedex_access_token',
    'FedExTokenManager',
    'track_shipment',
    'FedExTrackingService'
]
