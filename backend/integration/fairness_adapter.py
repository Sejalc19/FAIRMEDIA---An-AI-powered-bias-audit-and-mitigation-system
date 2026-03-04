"""
Adapter for Member 3's Fairness Engine.
Handles all communication with the fairness calculation service.
"""

import httpx
from typing import Optional, Dict
from schemas.ai_schema import BiasScores
from schemas.fairness_schema import FairnessResult, MitigationWeights
from backend.config import settings
import logging

logger = logging.getLogger(__name__)


class FairnessAdapter:
    """
    Adapter for communicating with Member 3's Fairness Engine.
    
    When Member 3's service is ready, update the calculate_fairness method
    to make real HTTP calls instead of using mock data.
    """
    
    def __init__(self):
        self.base_url = settings.FAIRNESS_SERVICE_URL
        self.timeout = 30.0
        logger.info(f"⚖️  Fairness Adapter initialized: {self.base_url}")
    
    async def calculate_fairness(
        self,
        bias_scores: BiasScores,
        content: str,
        analysis_id: str,
        metadata: Optional[Dict] = None
    ) -> FairnessResult:
        """
        Call fairness engine to calculate risk and recommendations.
        
        Args:
            bias_scores: Bias scores from AI service (Member 2)
            content: Original text content
            analysis_id: Unique identifier
            metadata: Optional additional metadata
            
        Returns:
            FairnessResult with risk level and recommendations
            
        Raises:
            httpx.HTTPError: If the fairness service is unreachable
        
        TODO: Replace mock implementation with real HTTP call when
        Member 3's service is ready. Uncomment the code below.
        """
        logger.info(f"⚖️  Fairness Adapter: Calculating fairness for {analysis_id}")
        
        # MOCK IMPLEMENTATION - Replace with real HTTP call
        # When Member 3's service is ready, uncomment this:
        """
        payload = {
            "bias_scores": bias_scores.dict(),
            "content": content,
            "analysis_id": analysis_id
        }
        if metadata:
            payload["metadata"] = metadata
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/calculate",
                    json=payload
                )
                response.raise_for_status()
                result = FairnessResult(**response.json())
                
                logger.info(
                    f"✅ Fairness calculation completed for {analysis_id}: "
                    f"risk_level={result.risk_level}, "
                    f"fairness_score={result.fairness_score:.2f}"
                )
                
                return result
                
        except httpx.HTTPError as e:
            logger.error(f"❌ Fairness service error for {analysis_id}: {e}")
            raise
        """
        
        # Mock response for development (DELETE THIS WHEN MEMBER 3 IS READY)
        logger.warning("⚠️  Using MOCK Fairness response - replace with real service call")
        
        # Calculate risk level based on bias score
        overall_bias = bias_scores.overall
        if overall_bias < 0.3:
            risk_level = "low"
        elif overall_bias < 0.6:
            risk_level = "medium"
        elif overall_bias < 0.8:
            risk_level = "high"
        else:
            risk_level = "critical"
        
        # Fairness score is inverse of bias
        fairness_score = 1.0 - overall_bias
        
        # Calculate weight adjustment
        adjustment_factor = min(1.0, overall_bias * 0.5)
        adjusted_weight = max(0.1, 1.0 - adjustment_factor)
        
        return FairnessResult(
            risk_level=risk_level,
            fairness_score=fairness_score,
            recommendations=[
                "Consider using gender-neutral language",
                "Review stereotypical associations",
                "Include diverse perspectives",
                "Ensure balanced representation"
            ],
            mitigation_weights=MitigationWeights(
                original_weight=1.0,
                adjusted_weight=adjusted_weight,
                adjustment_factor=adjustment_factor,
                rationale=f"Weight adjusted based on {risk_level} bias level (score: {overall_bias:.2f})"
            ),
            detailed_metrics={
                "gender_fairness": 1.0 - bias_scores.gender_bias,
                "stereotype_fairness": 1.0 - bias_scores.stereotype,
                "language_fairness": 1.0 - bias_scores.language_dominance
            },
            engine_version="mock-fairness-v1.0.0"
        )
    
    async def health_check(self) -> bool:
        """
        Check if Fairness Engine is healthy.
        
        Returns:
            True if service is healthy, False otherwise
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"⚠️  Fairness service health check failed: {e}")
            return False
