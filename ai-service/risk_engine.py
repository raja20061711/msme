"""
SECUREMSME AI - Deterministic Feature-Based AI Risk Engine

This module processes extracted features from emails, URLs, invoices, payment screenshots, and QR codes.
It applies rule-weighted feature scoring to compute a consistent, explainable fraud risk score (0-100),
assigns a risk level (SAFE, MEDIUM, HIGH), and generates actionable XAI explanations and recommendations.
"""

def calculate_risk(feature_flags, context_type="general"):
    """
    feature_flags: list of dicts, each containing:
        - key: str
        - name: str
        - active: bool
        - weight: int
        - severity: 'LOW' | 'MEDIUM' | 'HIGH'
        - reason: str
    """
    score = 0
    detected_indicators = []

    for item in feature_flags:
        if item.get("active", False):
            weight = int(item.get("weight", 0))
            score += weight
            detected_indicators.append({
                "key": str(item.get("key", "")),
                "name": str(item.get("name", "Indicator Flagged")),
                "severity": str(item.get("severity", "MEDIUM")),
                "reason": str(item.get("reason", "Suspicious pattern detected")),
                "scoreContribution": int(weight)
            })

    # Cap score at 100
    risk_score = int(min(100, max(0, score)))

    # Determine risk level
    if risk_score <= 30:
        risk_level = "SAFE"
    elif risk_score <= 70:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    # Generate recommendation
    recommendation = generate_recommendation(risk_level, detected_indicators, context_type)

    return {
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "indicators": detected_indicators,
        "recommendation": recommendation,
        "disclaimer": "AI-powered prototype analysis. Does not perform real bank transaction verification or official GST database lookups."
    }

def generate_recommendation(risk_level, indicators, context_type):
    if risk_level == "HIGH":
        if context_type == "email":
            return "CRITICAL: Do NOT click any links, download attachments, or provide passwords/OTP. Verify the sender through an official phone call or known direct contact."
        elif context_type == "url":
            return "DANGER: High probability of phishing or malicious site. Do not input credentials, credit card info, or business banking details on this webpage."
        elif context_type == "invoice":
            return "WARNING: Invoice exhibits multiple fraud indicators (e.g. missing ID or mismatched details). Cross-check vendor credentials and hold payment release until manually confirmed."
        elif context_type == "payment":
            return "ALERT: Payment screenshot appears edited or missing official transaction proof. Re-check your bank account statement directly before dispatching goods."
        elif context_type == "qr":
            return "HIGH RISK: QR code points to a suspicious destination. Do not proceed with payment or log in to the destination URL."
        return "HIGH RISK DETECTED: Exercise maximum caution. Halt all sensitive transactions until details are independently verified."

    elif risk_level == "MEDIUM":
        if context_type == "email":
            return "CAUTION: Email contains mild urgency or unfamiliar domain elements. Check full email headers and confirm sender identity before responding."
        elif context_type == "url":
            return "MODERATE RISK: Website has non-standard URL structure or missing security certificates. Avoid sharing sensitive data."
        elif context_type == "invoice":
            return "ATTENTION: Minor inconsistencies found in invoice formatting or vendor GSTIN syntax. Request official confirmation from vendor billing department."
        elif context_type == "payment":
            return "VERIFY: Payment proof missing key fields like complete reference transaction ID. Confirm bank receipt before finalizing invoice."
        elif context_type == "qr":
            return "PROCEED WITH CAUTION: QR link has uncommon domain elements. Verify destination domain in browser before taking action."
        return "MODERATE RISK: Review flagged indicators carefully before completing any financial transaction."

    else: # SAFE
        return "SAFE: No major suspicious indicators were detected in this analysis. Regular verification procedures are still recommended."
