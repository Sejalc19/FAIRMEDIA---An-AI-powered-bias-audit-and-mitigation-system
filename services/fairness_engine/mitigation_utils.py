"""
Mitigation utilities for bias adjustment and weight calculations.
"""

from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)


def calculate_weight_adjustment(
    bias_score: float,
    risk_level: str,
    min_weight: float = 0.1,
    max_weight: float = 1.0
) -> Tuple[float, float, str]:
    """
    Calculate weight adjustment based on bias score and risk level.
    
    Args:
        bias_score: Overall bias score (0-1)
        risk_level: Risk level (low, medium, high, critical)
        min_weight: Minimum allowed weight
        max_weight: Maximum allowed weight
        
    Returns:
        Tuple of (adjusted_weight, adjustment_factor, rationale)
    """
    # Risk level multipliers
    risk_multipliers = {
        'low': 0.1,
        'medium': 0.3,
        'high': 0.5,
        'critical': 0.7
    }
    
    multiplier = risk_multipliers.get(risk_level, 0.3)
    
    # Calculate adjustment factor
    adjustment_factor = min(1.0, bias_score * multiplier)
    
    # Calculate adjusted weight
    adjusted_weight = max(min_weight, max_weight - adjustment_factor)
    
    # Generate rationale
    rationale = (
        f"Weight adjusted from {max_weight} to {adjusted_weight:.2f} "
        f"due to {risk_level} risk level (bias score: {bias_score:.2f})"
    )
    
    logger.info(f"Weight adjustment: {max_weight} → {adjusted_weight:.2f} ({risk_level})")
    
    return adjusted_weight, adjustment_factor, rationale


def generate_recommendations(
    bias_scores: Dict[str, float],
    risk_level: str
) -> List[str]:
    """
    Generate actionable recommendations based on bias analysis.
    
    Args:
        bias_scores: Dictionary of bias type to score
        risk_level: Overall risk level
        
    Returns:
        List of recommendation strings
    """
    recommendations = []
    
    # Gender bias recommendations
    if bias_scores.get('gender_bias', 0) > 0.3:
        recommendations.extend([
            "Use gender-neutral language (e.g., 'they' instead of 'he/she')",
            "Replace gendered job titles with neutral alternatives (e.g., 'chairperson' instead of 'chairman')",
            "Ensure balanced representation of all genders in examples"
        ])
    
    # Stereotype recommendations
    if bias_scores.get('stereotype', 0) > 0.3:
        recommendations.extend([
            "Avoid stereotypical associations between groups and characteristics",
            "Include diverse perspectives and counter-stereotypical examples",
            "Review language for implicit assumptions about groups"
        ])
    
    # Language dominance recommendations
    if bias_scores.get('language_dominance', 0) > 0.3:
        recommendations.extend([
            "Use culturally inclusive language and examples",
            "Avoid English-centric or Western-centric assumptions",
            "Consider multilingual and multicultural perspectives"
        ])
    
    # Risk-specific recommendations
    if risk_level in ['high', 'critical']:
        recommendations.insert(0, "⚠️ HIGH PRIORITY: This content requires immediate review and revision")
        recommendations.append("Consider having content reviewed by a diverse group of stakeholders")
    
    # Limit to top recommendations
    return recommendations[:6]


def calculate_fairness_score(bias_scores: Dict[str, float]) -> float:
    """
    Calculate overall fairness score from bias scores.
    Fairness is the inverse of bias.
    
    Args:
        bias_scores: Dictionary of bias type to score
        
    Returns:
        Fairness score (0-1, higher is better)
    """
    overall_bias = bias_scores.get('overall', 0.5)
    fairness = 1.0 - overall_bias
    return round(fairness, 2)


def determine_risk_level(bias_score: float) -> str:
    """
    Determine risk level from bias score.
    
    Args:
        bias_score: Overall bias score (0-1)
        
    Returns:
        Risk level string
    """
    if bias_score < 0.25:
        return 'low'
    elif bias_score < 0.5:
        return 'medium'
    elif bias_score < 0.75:
        return 'high'
    else:
        return 'critical'


def calculate_detailed_metrics(bias_scores: Dict[str, float]) -> Dict[str, float]:
    """
    Calculate detailed fairness metrics for each bias type.
    
    Args:
        bias_scores: Dictionary of bias type to score
        
    Returns:
        Dictionary of detailed fairness metrics
    """
    return {
        'gender_fairness': round(1.0 - bias_scores.get('gender_bias', 0), 2),
        'stereotype_fairness': round(1.0 - bias_scores.get('stereotype', 0), 2),
        'language_fairness': round(1.0 - bias_scores.get('language_dominance', 0), 2),
        'overall_fairness': round(1.0 - bias_scores.get('overall', 0), 2)
    }
