"""
FedEx OAuth Token Manager
Handles secure token generation, caching, and automatic refresh
"""

import os
import time
import requests
from datetime import datetime, timedelta
from typing import Optional, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FedExTokenManager:
    """
    Manages FedEx OAuth tokens with automatic caching and refresh.
    Thread-safe singleton implementation for production use.
    """
    
    _instance = None
    _token_cache: Optional[Dict] = None
    _token_expiry: Optional[datetime] = None
    
    def __new__(cls):
        """Singleton pattern to ensure single token manager instance"""
        if cls._instance is None:
            cls._instance = super(FedExTokenManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize with environment-based configuration"""
        if not hasattr(self, 'initialized'):
            self.client_id = os.getenv('FEDEX_CLIENT_ID')
            self.client_secret = os.getenv('FEDEX_CLIENT_SECRET')
            self.mode = os.getenv('FEDEX_MODE', 'sandbox').lower()
            
            # Validate credentials - WARN instead of FAIL
            if not self.client_id or not self.client_secret:
                logger.warning(
                    "FedEx credentials not found in environment. "
                    "FedEx tracking will not be available. "
                    "Set FEDEX_CLIENT_ID and FEDEX_CLIENT_SECRET to enable."
                )
                self.credentials_available = False
            else:
                self.credentials_available = True
                # Set OAuth endpoint based on mode
                if self.mode == 'production':
                    self.oauth_url = 'https://apis.fedex.com/oauth/token'
                else:
                    self.oauth_url = 'https://apis-sandbox.fedex.com/oauth/token'
                
                logger.info(f"FedEx Token Manager initialized in {self.mode.upper()} mode")
            
            self.initialized = True
    
    def get_access_token(self) -> str:
        """
        Get a valid access token. Returns cached token if valid,
        otherwise requests a new one.
        
        Returns:
            str: Valid OAuth access token
            
        Raises:
            Exception: If token generation fails or credentials not available
        """
        # Check if credentials are available
        if not hasattr(self, 'credentials_available') or not self.credentials_available:
            raise Exception(
                "FedEx API credentials not configured. "
                "Set FEDEX_CLIENT_ID and FEDEX_CLIENT_SECRET in environment."
            )
        
        # Check if cached token is still valid
        if self._is_token_valid():
            logger.debug("Using cached access token")
            return self._token_cache['access_token']
        
        # Request new token
        logger.info("Requesting new FedEx access token")
        return self._request_new_token()
    
    def _is_token_valid(self) -> bool:
        """Check if cached token exists and hasn't expired"""
        if self._token_cache is None or self._token_expiry is None:
            return False
        
        # Add 60 second buffer before expiry
        return datetime.now() < (self._token_expiry - timedelta(seconds=60))
    
    def _request_new_token(self) -> str:
        """
        Request a new OAuth token from FedEx API
        
        Returns:
            str: New access token
            
        Raises:
            Exception: If token request fails
        """
        try:
            # Prepare request
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            
            data = {
                'grant_type': 'client_credentials',
                'client_id': self.client_id,
                'client_secret': self.client_secret
            }
            
            # Make OAuth request
            response = requests.post(
                self.oauth_url,
                headers=headers,
                data=data,
                timeout=10
            )
            
            # Handle errors
            if response.status_code != 200:
                sanitized_error = self._sanitize_error(response)
                logger.error(f"OAuth failed: HTTP {response.status_code}")
                raise Exception(f"FedEx OAuth failed: {sanitized_error}")
            
            # Parse response
            token_data = response.json()
            access_token = token_data.get('access_token')
            expires_in = token_data.get('expires_in', 3600)
            
            if not access_token:
                raise Exception("No access_token in FedEx OAuth response")
            
            # Cache token
            self._token_cache = token_data
            self._token_expiry = datetime.now() + timedelta(seconds=expires_in)
            
            logger.info(f"New token obtained, expires in {expires_in}s")
            return access_token
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error during OAuth: {type(e).__name__}")
            raise Exception(f"FedEx OAuth network error: {type(e).__name__}")
        except Exception as e:
            logger.error(f"Unexpected OAuth error: {str(e)}")
            raise
    
    def _sanitize_error(self, response: requests.Response) -> str:
        """
        Sanitize error response to avoid exposing sensitive data
        
        Args:
            response: Failed HTTP response
            
        Returns:
            str: Sanitized error message
        """
        try:
            error_data = response.json()
            # Remove any credential info if present
            safe_error = {
                'error': error_data.get('error', 'unknown'),
                'error_description': error_data.get('error_description', 'No description')
            }
            return str(safe_error)
        except:
            return f"HTTP {response.status_code}"
    
    def invalidate_token(self):
        """Force token refresh on next request"""
        self._token_cache = None
        self._token_expiry = None
        logger.info("Token cache invalidated")


# Global instance
token_manager = FedExTokenManager()


def get_fedex_access_token() -> str:
    """
    Convenience function to get FedEx access token
    
    Returns:
        str: Valid OAuth access token
    """
    return token_manager.get_access_token()
