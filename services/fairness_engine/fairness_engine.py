def calculate_fairness(bias_score, original_score):

    fairness_adjusted_score = original_score - (bias_score * 0.5)

    if fairness_adjusted_score < 0:
        fairness_adjusted_score = 0

    return {
        "fairness_score": round(fairness_adjusted_score, 2)
    }
if __name__ == "__main__":
    result = calculate_fairness(0.7, 0.9)
    print("Fairness Result:", result)