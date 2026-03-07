"""
Enhanced Bias Detection Service
Combines rule-based detection with advanced pattern matching
Supports English and Hindi languages
"""

import re
from typing import Dict, List, Optional

# Gender Bias Dictionaries
# Core pronouns
MALE_PRONOUNS = {"he", "him", "his", "himself"}
FEMALE_PRONOUNS = {"she", "her", "hers", "herself"}

# Common gendered words and roles that signal representation bias
MALE_WORDS = {
    "man", "men", "male", "boy", "boys", "gentleman", "gentlemen",
    "husband", "father", "son", "sons", "brother", "brothers"
}
FEMALE_WORDS = {
    "woman", "women", "female", "girl", "girls", "lady", "ladies",
    "wife", "mother", "daughter", "daughters", "sister", "sisters"
}

# Stereotypical gender-biased words/phrases (English)
GENDER_STEREOTYPE_WORDS = {
    "male_stereotypes": {
        "aggressive": "assertive",
        "bossy": "decisive",
        "ambitious": "driven",
        "dominant": "leading",
        "man up": "be brave",
        "boys don't cry": "it's okay to show emotion",
        "chairman": "chairperson",
        "fireman": "firefighter",
        "policeman": "police officer",
        "businessman": "businessperson",
    },
    "female_stereotypes": {
        "emotional": "expressive",
        "hysterical": "upset",
        "nurturing": "caring",
        "ditzy": "thoughtful",
        "nagging": "persistent",
        "lady doctor": "doctor",
        "lady engineer": "engineer",
        "working mother": "working parent",
        "career woman": "professional",
    },
}

# Hindi biased terms with translations
HINDI_BIAS_TERMS = {
    "औरतों का काम": {
        "translation": "women's work",
        "neutral": "घर का काम (household work)",
        "category": "gender_role",
    },
    "मर्दानगी": {
        "translation": "manliness/machismo",
        "neutral": "साहस (courage)",
        "category": "toxic_masculinity",
    },
    "लड़के रोते नहीं": {
        "translation": "boys don't cry",
        "neutral": "भावनाएं स्वाभाविक हैं (emotions are natural)",
        "category": "toxic_masculinity",
    },
    "पराया धन": {
        "translation": "someone else's wealth (referring to daughters)",
        "neutral": "बेटी (daughter)",
        "category": "gender_role",
    },
}


class EnhancedBiasDetector:
    """Enhanced bias detection with multilingual support"""
    
    def __init__(self):
        self.male_pronouns = MALE_PRONOUNS
        self.female_pronouns = FEMALE_PRONOUNS
        self.gender_stereotypes = GENDER_STEREOTYPE_WORDS
        self.hindi_bias_terms = HINDI_BIAS_TERMS
    
    def detect_language(self, text: str) -> Dict:
        """Detect whether text contains English, Hindi, or mixed content"""
        hindi_chars = len(re.findall(r'[\u0900-\u097F]', text))
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        total = hindi_chars + english_chars
        
        if total == 0:
            return {"detected": "unknown", "hindi_pct": 0, "english_pct": 0}
        
        hindi_pct = round(hindi_chars / total * 100, 1)
        english_pct = round(english_chars / total * 100, 1)
        
        if hindi_pct > 70:
            detected = "hi"
        elif english_pct > 70:
            detected = "en"
        else:
            detected = "mixed"
        
        return {
            "detected": detected,
            "hindi_pct": hindi_pct,
            "english_pct": english_pct
        }
    
    def detect_gender_bias(self, text: str) -> Dict:
        """Detect gender bias with detailed breakdown"""
        text_lower = text.lower()
        words = re.findall(r'\b\w+\b', text_lower)
        
        # Pronoun counting
        male_pronoun_count = sum(1 for w in words if w in self.male_pronouns)
        female_pronoun_count = sum(1 for w in words if w in self.female_pronouns)
        total_pronouns = male_pronoun_count + female_pronoun_count
        
        imbalance_score = (
            abs(male_pronoun_count - female_pronoun_count) / total_pronouns
            if total_pronouns > 0 else 0.0
        )
        
        # Gendered terms (man/woman, boy/girl, etc.)
        male_term_count = sum(1 for w in words if w in MALE_WORDS)
        female_term_count = sum(1 for w in words if w in FEMALE_WORDS)
        total_gender_terms = male_term_count + female_term_count
        
        term_imbalance_score = (
            abs(male_term_count - female_term_count) / total_gender_terms
            if total_gender_terms > 0 else 0.0
        )
        
        # Stereotype detection
        found_stereotypes = []
        for category, terms in self.gender_stereotypes.items():
            for word, alternative in terms.items():
                pattern = re.compile(r'\b' + re.escape(word) + r'\b', re.IGNORECASE)
                for match in pattern.finditer(text):
                    found_stereotypes.append({
                        "phrase": match.group(),
                        "type": category,
                        "suggestion": alternative,
                        "start": match.start(),
                        "end": match.end(),
                    })
        
        # Calculate bias score
        bias_points = 0
        # Pronoun imbalance (up to 4 points)
        bias_points += imbalance_score * 4
        # Overall gender term imbalance (up to 3 additional points)
        bias_points += term_imbalance_score * 3
        # Explicit stereotypes get higher weight (up to 4 points)
        bias_points += min(len(found_stereotypes) * 1.5, 4)
        
        # Cap at 10 and normalize to 0–1
        gender_bias_score = round(min(bias_points, 10), 2) / 10
        
        return {
            "male_pronoun_count": male_pronoun_count,
            "female_pronoun_count": female_pronoun_count,
            "male_term_count": male_term_count,
            "female_term_count": female_term_count,
            "imbalance_score": round(imbalance_score, 4),
            "term_imbalance_score": round(term_imbalance_score, 4),
            "stereotypes_found": found_stereotypes,
            "gender_bias_score": gender_bias_score,
            "total_issues": len(found_stereotypes),
        }
    
    def detect_hindi_bias(self, text: str) -> Dict:
        """Detect Hindi-specific biased terms"""
        found_terms = []
        
        for term, info in self.hindi_bias_terms.items():
            if term in text:
                start = text.index(term)
                found_terms.append({
                    "phrase": term,
                    "translation": info["translation"],
                    "neutral_alternative": info["neutral"],
                    "category": info["category"],
                    "start": start,
                    "end": start + len(term),
                })
        
        bias_score = min(len(found_terms) * 0.2, 1.0)
        
        return {
            "biased_terms_found": found_terms,
            "hindi_bias_score": bias_score,
            "total_issues": len(found_terms),
        }
    
    def analyze(self, text: str) -> Dict:
        """Complete bias analysis"""
        # Detect language
        lang_info = self.detect_language(text)
        
        # Gender bias
        gender_result = self.detect_gender_bias(text)
        
        # Hindi bias (if applicable)
        hindi_result = {"biased_terms_found": [], "hindi_bias_score": 0, "total_issues": 0}
        if lang_info["hindi_pct"] > 0:
            hindi_result = self.detect_hindi_bias(text)
        
        # Combined score:
        # - If we only have gender issues (pure English text), don't dilute by 0 Hindi score
        # - If we have both, average them
        gender_score = gender_result["gender_bias_score"]
        hindi_score = hindi_result["hindi_bias_score"]
        if hindi_result["total_issues"] > 0:
            combined_score = round((gender_score + hindi_score) / 2, 2)
        else:
            combined_score = round(gender_score, 2)
        
        # Language dominance score (0-1) based on English character share.
        # This approximates English dominance vs Indic script usage.
        language_dominance = round(lang_info["english_pct"] / 100.0, 2)
        
        # Build response
        all_issues = (
            gender_result["stereotypes_found"] +
            hindi_result["biased_terms_found"]
        )
        
        return {
            "language_info": lang_info,
            "gender_bias": gender_result,
            "hindi_bias": hindi_result,
            "language_dominance": language_dominance,
            "combined_bias_score": combined_score,
            "total_issues": len(all_issues),
            "all_biased_terms": all_issues,
        }
