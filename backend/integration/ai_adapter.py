"""
Adapter for Member 2's AI Service.
Handles all communication with the AI bias detection service.
"""

import httpx
from typing import Optional
from schemas.ai_schema import AIAnalysisResult, BiasScores, HighlightedSpan
from backend.config import settings
import logging

logger = logging.getLogger(__name__)


class AIAdapter:
    """
    Adapter for communicating with Member 2's AI Service.
    
    When Member 2's service is ready, update the analyze_bias method
    to make real HTTP calls instead of using mock data.
    """
    
    def __init__(self):
        self.base_url = settings.AI_SERVICE_URL
        self.timeout = 30.0
        logger.info(f"🤖 AI Adapter initialized: {self.base_url}")
    
    async def analyze_bias(
        self,
        content: str,
        analysis_id: str,
        language: Optional[str] = None
    ) -> AIAnalysisResult:
        """
        Call AI service to analyze bias in content.
        
        Args:
            content: Text to analyze
            analysis_id: Unique identifier for this analysis
            language: Optional language hint (ISO 639-1 code)
            
        Returns:
            AIAnalysisResult with bias scores and explanations
            
        Raises:
            httpx.HTTPError: If the AI service is unreachable
        
        TODO: Replace mock implementation with real HTTP call when
        Member 2's service is ready. Uncomment the code below.
        """
        logger.info(f"🤖 AI Adapter: Analyzing content for {analysis_id}")
        
        # MOCK IMPLEMENTATION - Replace with real HTTP call
        # When Member 2's service is ready, uncomment this:
        """
        payload = {
            "content": content,
            "analysis_id": analysis_id
        }
        if language:
            payload["language"] = language
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/analyze",
                    json=payload
                )
                response.raise_for_status()
                result = AIAnalysisResult(**response.json())
                
                logger.info(
                    f"✅ AI analysis completed for {analysis_id}: "
                    f"overall_bias={result.bias_scores.overall:.2f}"
                )
                
                return result
                
        except httpx.HTTPError as e:
            logger.error(f"❌ AI service error for {analysis_id}: {e}")
            raise
        """
        
        # Mock response for development (DELETE THIS WHEN MEMBER 2 IS READY)
        logger.warning("⚠️  Using MOCK AI response - replace with real service call")
        
        return AIAnalysisResult(
            bias_scores=BiasScores(
                gender_bias=0.65,
                stereotype=0.42,
                language_dominance=0.28,
                overall=0.52
            ),
            explanations={
                "gender_bias": "Gendered language patterns detected in the text",
                "stereotype": "Stereotypical associations identified",
                "language_dominance": "English-centric references found"
            },
            highlighted_text=[
                HighlightedSpan(
                    span=[0, min(10, len(content))],
                    text=content[:10],
                    bias_type="gender_bias",
                    severity="medium",
                    contribution_score=0.15
                )
            ],
            language_detected=language or "en",
            confidence=0.95,
            model_version="mock-ai-v1.0.0"
        )
    
    async def health_check(self) -> bool:
        """
        Check if AI service is healthy.
        
        Returns:
            True if service is healthy, False otherwise
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
        except Exception as e:
            logger.warning(f"⚠️  AI service health check failed: {e}")
            return False
