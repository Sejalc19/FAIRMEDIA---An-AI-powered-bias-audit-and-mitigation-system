from services.fairness_engine.fairness_engine import calculate_fairness
from services.fairness_engine.risk_engine import calculate_risk

# sample data
bias_score = 0.7
original_score = 0.9

fairness = calculate_fairness(bias_score, original_score)
risk = calculate_risk(bias_score)

print("Fairness Result:", fairness)
print("Risk Result:", risk)