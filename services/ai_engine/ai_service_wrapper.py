"""
AI Service Wrapper
Provides a unified interface for AI bias detection.
Currently uses MockAIService.
"""

from typing import Optional
from schemas.ai_schema import AIAnalysisResult
from services.ai_engine.mock_ai_service import MockAIService
import logging

logger = logging.getLogger(__name__)


class AIService:
    """
    Unified AI Service wrapper for MockAIService.
    """
    
    def __init__(self, use_mock: bool = True):
        """
        Initialize AI Service.
        
        Args:
            use_mock: Currently always uses MockAIService
        """
        self.service = MockAIService()
        logger.info("🤖 AIService initialized with MockAIService")
    
    async def analyze_bias(
        self,
        content: str,
        analysis_id: str,
        language: Optional[str] = None
    ) -> AIAnalysisResult:
        """
        Analyze text for bias.
        
        Args:
            content: Text to analyze
            analysis_id: Unique identifier
            language: Optional language hint
            
        Returns:
            AIAnalysisResult with bias scores and explanations
        """
        return await self.service.analyze_bias(content, analysis_id, language)
    
    async def health_check(self) -> bool:
        """
        Check if the service is healthy.
        
        Returns:
            True if healthy, False otherwise
        """
        try:
            return self.service is not None
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return False
