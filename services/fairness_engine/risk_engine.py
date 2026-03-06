def calculate_risk(bias_score):

    if bias_score > 0.75:
        risk_level = "HIGH"
        review_required = True

    elif bias_score > 0.4:
        risk_level = "MEDIUM"
        review_required = True

    else:
        risk_level = "LOW"
        review_required = False

    return {
        "risk_level": risk_level,
        "review_required": review_required
    }
if __name__ == "__main__":
    result = calculate_risk(0.7)
    print(result)