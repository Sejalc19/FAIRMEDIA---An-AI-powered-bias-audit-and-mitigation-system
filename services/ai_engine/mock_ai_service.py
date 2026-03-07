"""
Mock AI service for development and testing.
Returns realistic bias detection results without requiring external AI models.
Enhanced with multilingual support (English + Hindi)
"""

import re
from typing import List, Dict
from schemas.ai_schema import AIAnalysisResult, BiasScores, HighlightedSpan
from services.ai_engine.language_service import LanguageDetectionService
from services.ai_engine.enhanced_bias_detector import EnhancedBiasDetector
import logging

logger = logging.getLogger(__name__)


class MockAIService:
    """
    Mock implementation of AI bias detection.
    Uses rule-based pattern matching to simulate AI analysis.
    """
    
    def __init__(self):
        self.language_service = LanguageDetectionService()
        self.enhanced_detector = EnhancedBiasDetector()
        
        # Bias detection patterns
        self.gender_patterns = [
            r'\b(he|his|him|himself)\b',
            r'\b(she|her|hers|herself)\b',
            r'\b(man|men|male|guy|guys)\b',
            r'\b(woman|women|female|girl|girls|lady|ladies)\b',
            r'\b(chairman|policeman|fireman|businessman)\b',
        ]
        
        self.stereotype_patterns = [
            r'\b(typical|naturally|obviously|inherently)\s+(woman|man|female|male)\b',
            r'\b(women|men)\s+(are|tend to|usually|always)\b',
            r'\b(emotional|aggressive|nurturing|dominant)\s+(woman|man|female|male)\b',
        ]
        
        logger.info("🤖 Mock AI Service initialized")
    
    async def analyze_bias(
        self,
        content: str,
        analysis_id: str,
        language: str = None
    ) -> AIAnalysisResult:
        """
        Analyze text for bias using enhanced multilingual detection.
        
        Args:
            content: Text to analyze
            analysis_id: Unique identifier
            language: Optional language hint
            
        Returns:
            AIAnalysisResult with bias scores and highlighted spans
        """
        logger.info(f"🤖 Mock AI analyzing: {analysis_id}")
        
        # Use enhanced detector for better results
        enhanced_result = self.enhanced_detector.analyze(content)
        
        # Detect language if not provided
        if not language:
            language = enhanced_result["language_info"]["detected"]
        
        # Extract bias scores from enhanced detector
        gender_bias = enhanced_result["gender_bias"]["gender_bias_score"]
        # Use only explicit stereotype findings for the stereotype dimension
        stereotype_issues = len(enhanced_result["gender_bias"]["stereotypes_found"])
        stereotype = min(stereotype_issues * 0.15, 1.0)
        # Language dominance approximated from English character share (0-1)
        language_dominance = enhanced_result.get("language_dominance", 0.0)
        # Overall bias: average of the three dimensions
        overall = round((gender_bias + stereotype + language_dominance) / 3.0, 2)
        
        # Convert enhanced results to highlighted spans with suggestions
        highlighted_spans = []
        for item in enhanced_result["all_biased_terms"]:
            # Get suggestion/alternative
            suggestion = item.get("suggestion") or item.get("neutral_alternative") or item.get("neutral", "")
            
            highlighted_spans.append(HighlightedSpan(
                span=[item["start"], item["end"]],
                text=item["phrase"],
                bias_type=item.get("type", "gender_bias"),
                severity="high" if overall > 0.7 else "medium" if overall > 0.4 else "low",
                contribution_score=0.15,
                suggestion=suggestion  # Add suggestion field
            ))
        
        # Generate explanations
        explanations = {
            "gender_bias": self._explain_gender_bias(gender_bias, content),
            "stereotype": self._explain_stereotype(stereotype, content),
            "language_dominance": f"Language: {language.upper()} (Hindi: {enhanced_result['language_info']['hindi_pct']}%, English: {enhanced_result['language_info']['english_pct']}%)"
        }
        
        result = AIAnalysisResult(
            bias_scores=BiasScores(
                gender_bias=gender_bias,
                stereotype=stereotype,
                language_dominance=language_dominance,
                overall=overall
            ),
            explanations=explanations,
            highlighted_text=highlighted_spans,
            language_detected=language,
            confidence=0.85,
            model_version="mock-ai-v1.0.0"
        )
        
        logger.info(
            f"✅ Mock AI completed: overall_bias={overall:.2f}, "
            f"spans={len(highlighted_spans)}"
        )
        
        return result
    
    def _calculate_gender_bias(self, text: str) -> float:
        """Calculate gender bias score based on gendered language."""
        text_lower = text.lower()
        matches = 0
        
        for pattern in self.gender_patterns:
            matches += len(re.findall(pattern, text_lower))
        
        # Normalize by text length
        words = len(text.split())
        if words == 0:
            return 0.0
        
        score = min(1.0, (matches / words) * 10)
        return round(score, 2)
    
    def _calculate_stereotype_bias(self, text: str) -> float:
        """Calculate stereotype bias score."""
        text_lower = text.lower()
        matches = 0
        
        for pattern in self.stereotype_patterns:
            matches += len(re.findall(pattern, text_lower))
        
        # Higher weight for stereotypes
        score = min(1.0, matches * 0.3)
        return round(score, 2)
    
    def _calculate_language_dominance(self, text: str) -> float:
        """Calculate language dominance bias."""
        # Check for English-centric or culturally specific references
        english_centric = [
            'american', 'british', 'western', 'english-speaking'
        ]
        
        text_lower = text.lower()
        matches = sum(1 for term in english_centric if term in text_lower)
        
        score = min(1.0, matches * 0.2)
        return round(score, 2)
    
    def _find_biased_spans(self, text: str) -> List[HighlightedSpan]:
        """Find specific text spans that contribute to bias."""
        spans = []
        text_lower = text.lower()
        
        # Find gender-biased terms
        for pattern in self.gender_patterns[:3]:  # Limit to avoid too many spans
            for match in re.finditer(pattern, text_lower):
                start, end = match.span()
                spans.append(HighlightedSpan(
                    span=[start, end],
                    text=text[start:end],
                    bias_type="gender_bias",
                    severity="medium" if len(spans) < 3 else "low",
                    contribution_score=0.15
                ))
        
        # Limit to top 5 spans
        return spans[:5]
    
    def _explain_gender_bias(self, score: float, text: str) -> str:
        """Generate explanation for gender bias score."""
        if score < 0.2:
            return "Minimal gender bias detected. Language is mostly gender-neutral."
        elif score < 0.5:
            return "Moderate gender bias detected. Some gendered pronouns and terms present."
        elif score < 0.7:
            return "Significant gender bias detected. Frequent use of gendered language and role associations."
        else:
            return "High gender bias detected. Pervasive gendered language throughout the text."
    
    def _explain_stereotype(self, score: float, text: str) -> str:
        """Generate explanation for stereotype bias."""
        if score < 0.2:
            return "No significant stereotypical patterns detected."
        elif score < 0.5:
            return "Some stereotypical associations identified in the text."
        else:
            return "Significant stereotypical patterns detected that may reinforce biases."
    
    def _explain_language_dominance(self, score: float) -> str:
        """Generate explanation for language dominance bias."""
        if score < 0.2:
            return "Minimal language dominance bias. Content is culturally inclusive."
        elif score < 0.5:
            return "Some English-centric or culturally specific references present."
        else:
            return "Significant language dominance bias with culturally specific assumptions."
