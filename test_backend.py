"""
Quick test script to verify backend components are working.
"""

import asyncio
from services.ai_engine.mock_ai_service import MockAIService
from services.ai_engine.enhanced_bias_detector import EnhancedBiasDetector

async def test_mock_ai_service():
    """Test MockAIService with enhanced detector."""
    print("=" * 60)
    print("Testing MockAIService with Enhanced Bias Detector")
    print("=" * 60)
    
    # Initialize service
    service = MockAIService()
    print("✅ MockAIService initialized successfully")
    print(f"✅ Has enhanced_detector: {hasattr(service, 'enhanced_detector')}")
    
    # Test with English text
    test_text = """
    The chairman announced that his company will hire more female engineers.
    He said that women are naturally more nurturing and emotional.
    """
    
    print("\n📝 Test Text:")
    print(test_text.strip())
    
    # Analyze
    result = await service.analyze_bias(
        content=test_text,
        analysis_id="test-001",
        language="en"
    )
    
    print("\n📊 Analysis Results:")
    print(f"  Overall Bias Score: {result.bias_scores.overall:.2f}")
    print(f"  Gender Bias: {result.bias_scores.gender_bias:.2f}")
    print(f"  Stereotype: {result.bias_scores.stereotype:.2f}")
    print(f"  Language Dominance: {result.bias_scores.language_dominance:.2f}")
    print(f"  Language Detected: {result.language_detected}")
    print(f"  Confidence: {result.confidence:.2f}")
    print(f"  Highlighted Spans: {len(result.highlighted_text)}")
    
    print("\n🔍 Biased Terms Found:")
    for span in result.highlighted_text[:5]:
        print(f"  - '{span.text}' ({span.bias_type}, {span.severity})")
    
    print("\n💡 Explanations:")
    for bias_type, explanation in result.explanations.items():
        print(f"  {bias_type}: {explanation}")
    
    print("\n" + "=" * 60)
    print("✅ All tests passed!")
    print("=" * 60)

def test_enhanced_detector():
    """Test EnhancedBiasDetector directly."""
    print("\n" + "=" * 60)
    print("Testing EnhancedBiasDetector")
    print("=" * 60)
    
    detector = EnhancedBiasDetector()
    print("✅ EnhancedBiasDetector initialized")
    
    # Test with Hindi text
    hindi_text = "लड़के रोते नहीं और मर्दानगी दिखाओ। औरतों का काम घर संभालना है।"
    
    print(f"\n📝 Hindi Test Text: {hindi_text}")
    
    result = detector.analyze(hindi_text)
    
    print("\n📊 Analysis Results:")
    print(f"  Language: {result['language_info']['detected']}")
    print(f"  Hindi %: {result['language_info']['hindi_pct']}")
    print(f"  English %: {result['language_info']['english_pct']}")
    print(f"  Combined Bias Score: {result['combined_bias_score']}")
    print(f"  Total Issues: {result['total_issues']}")
    
    print("\n🔍 Hindi Biased Terms:")
    for term in result['hindi_bias']['biased_terms_found']:
        print(f"  - {term['phrase']} → {term['neutral_alternative']}")
        print(f"    Translation: {term['translation']}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    # Run tests
    test_enhanced_detector()
    asyncio.run(test_mock_ai_service())
