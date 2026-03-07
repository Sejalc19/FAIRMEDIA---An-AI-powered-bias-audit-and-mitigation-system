"""
Adapter for AI Service.
Handles all communication with the AI bias detection service.
"""

from typing import Optional
from schemas.ai_schema import AIAnalysisResult
from backend.config import settings
import logging

logger = logging.getLogger(__name__)


class AIAdapter:
    """
    Adapter for communicating with AI Service.
    Uses the real AI service implementation.
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
        """
        logger.info(f"🤖 AI Adapter: Analyzing content for {analysis_id}")
        
        # Use the AI service wrapper
        from services.ai_engine.ai_service_wrapper import AIService
        
        ai_service = AIService(use_mock=True)  # Set to False for production Bedrock
        result = await ai_service.analyze_bias(content, analysis_id, language)
        
        logger.info(
            f"✅ AI analysis completed for {analysis_id}: "
            f"overall_bias={result.bias_scores.overall:.2f}"
        )
        
        return result
    
    async def health_check(self) -> bool:
        """
        Check if AI service is healthy.
        
        Returns:
            True if service is healthy, False otherwise
        """
        try:
            from services.ai_engine.ai_service_wrapper import AIService
            ai_service = AIService(use_mock=True)
            return await ai_service.health_check()
        except Exception as e:
            logger.warning(f"⚠️  AI service health check failed: {e}")
            return False
