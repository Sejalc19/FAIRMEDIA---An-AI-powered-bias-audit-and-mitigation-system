"""
API client for FAIRMEDIA backend.
Used by Member 4 (Frontend) to communicate with Member 1 (Backend).
"""

import requests
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class FairMediaAPIClient:
    """
    Client for interacting with FAIRMEDIA backend API.
    """

    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.timeout = 60  # seconds

    def analyze_content(
        self,
        content: str,
        language: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Submit content for bias analysis.

        Args:
            content: Text to analyze
            language: Optional language code
            metadata: Optional metadata dict

        Returns:
            Analysis result dict matching AnalyzeResponse schema

        Raises:
            requests.HTTPError: If request fails
        """
        url = f"{self.base_url}/api/v1/analyze"

        payload = {"content": content}

        if language:
            payload["language"] = language

        if metadata:
            payload["metadata"] = metadata

        try:
            response = requests.post(
                url,
                json=payload,
                timeout=self.timeout
            )
            response.raise_for_status()

            result = response.json()
            logger.info(f"Analysis completed: {result['analysis_id']}")

            return result

        except requests.HTTPError as e:
            logger.error(f"API request failed: {e}")
            if e.response is not None:
                logger.error(f"Response: {e.response.text}")
            raise

    def get_analysis(self, analysis_id: str) -> Dict[str, Any]:
        """
        Retrieve a previous analysis by ID.

        Args:
            analysis_id: UUID of the analysis

        Returns:
            Stored analysis result

        Raises:
            requests.HTTPError: If analysis not found or request fails
        """
        url = f"{self.base_url}/api/v1/analyze/{analysis_id}"

        try:
            response = requests.get(url, timeout=self.timeout)
            response.raise_for_status()
            return response.json()

        except requests.HTTPError as e:
            logger.error(f"Failed to retrieve analysis {analysis_id}: {e}")
            raise

    def health_check(self) -> bool:
        """
        Check if backend API is healthy.

        Returns:
            True if healthy, False otherwise
        """
        try:
            response = requests.get(
                f"{self.base_url}/health",
                timeout=5
            )
            return response.status_code == 200
        except Exception:
            return False
