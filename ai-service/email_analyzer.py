"""
SECUREMSME AI - Email Analyzer Module

Analyzes email sender, subject, body, and embedded URLs.
Extracts feature flags and runs the deterministic risk engine.
"""

import re
from risk_engine import calculate_risk

URGENCY_KEYWORDS = [
    "urgent", "immediately", "suspended", "blocked", "verify now",
    "action required", "account locked", "final notice", "within 24 hours",
    "unauthorized access", "terminate", "expire soon", "immediate action"
]

CREDENTIAL_KEYWORDS = [
    "password", "otp", "credentials", "security code", "bank details",
    "credit card", "update payment", "pin", "ssn", "login now", "verify password"
]

SHORTENER_DOMAINS = ["bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy", "goo.gl"]

KNOWN_BRANDS = {
    "paypal": ["paypal.com"],
    "hdfc": ["hdfcbank.com"],
    "sbi": ["sbi.co.in", "onlinesbi.sbi"],
    "icici": ["icicibank.com"],
    "amazon": ["amazon.com", "amazon.in"],
    "microsoft": ["microsoft.com", "outlook.com"],
    "google": ["google.com", "gmail.com"],
    "razorpay": ["razorpay.com"]
}

def analyze_email(sender="", subject="", body=""):
    full_text = f"{subject} {body}".lower()
    sender_lower = sender.lower().strip()

    # Extract sender domain
    sender_domain = ""
    if "@" in sender_lower:
        sender_domain = sender_lower.split("@")[-1].strip(">").strip()

    # 1. Urgency Language (+15)
    urgency_matches = [w for w in URGENCY_KEYWORDS if w in full_text]
    has_urgency = len(urgency_matches) > 0

    # 2. Credential Request (+25)
    cred_matches = [w for w in CREDENTIAL_KEYWORDS if w in full_text]
    has_cred_request = len(cred_matches) > 0

    # 3. Suspicious Link Detection (+25)
    urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', full_text)
    has_suspicious_link = False
    link_reason = ""

    for url in urls:
        url_lower = url.lower()
        if any(shortener in url_lower for shortener in SHORTENER_DOMAINS):
            has_suspicious_link = True
            link_reason = "Email contains shortened URL hiding real destination"
            break
        elif re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url_lower):
            has_suspicious_link = True
            link_reason = "Email contains IP address link instead of valid domain name"
            break
        elif any(sus in url_lower for sus in ["login", "verify", "secure", "update-account", "free"]):
            has_suspicious_link = True
            link_reason = "Email contains link with suspicious authentication keywords"
            break

    if not has_suspicious_link and len(urls) > 0:
        # Check if URL domain matches sender domain
        for url in urls:
            domain_match = re.search(r'https?://(?:www\.)?([^/]+)', url.lower())
            if domain_match:
                link_domain = domain_match.group(1)
                if sender_domain and sender_domain not in link_domain and link_domain not in sender_domain:
                    has_suspicious_link = True
                    link_reason = f"Link domain ({link_domain}) does not match sender domain ({sender_domain})"
                    break

    # 4. Suspicious Sender Domain & Mismatch (+20)
    has_sender_mismatch = False
    sender_reason = ""

    # Check brand spoofing
    for brand, valid_domains in KNOWN_BRANDS.items():
        if brand in full_text or brand in sender_lower:
            if sender_domain and not any(sender_domain.endswith(vd) for vd in valid_domains):
                has_sender_mismatch = True
                sender_reason = f"Claims association with '{brand.upper()}' but sender address ({sender}) uses unverified domain ({sender_domain})"
                break

    if not has_sender_mismatch and sender_domain:
        if any(free in sender_domain for free in ["gmail.com", "yahoo.com", "hotmail.com"]) and ("invoice" in full_text or "bank" in full_text or "payment" in full_text):
            has_sender_mismatch = True
            sender_reason = "Official business/financial notice sent from free public webmail address"

    # 5. Direct Payment / Bank Request (+15)
    has_payment_request = any(p in full_text for p in ["wire transfer", "bank details", "pay to account", "send money", "crypto", "bitcoin", "upi id"])

    feature_flags = [
        {
            "key": "urgency_language",
            "name": "Urgency & Threat Language",
            "active": has_urgency,
            "weight": 15,
            "severity": "MEDIUM",
            "reason": f"Email uses high-urgency keywords ({', '.join(urgency_matches[:3])})" if has_urgency else ""
        },
        {
            "key": "credential_request",
            "name": "Sensitive Credential Request",
            "active": has_cred_request,
            "weight": 25,
            "severity": "HIGH",
            "reason": f"Email requests sensitive information ({', '.join(cred_matches[:3])})" if has_cred_request else ""
        },
        {
            "key": "suspicious_link",
            "name": "Suspicious URL / Link Pattern",
            "active": has_suspicious_link,
            "weight": 25,
            "severity": "HIGH",
            "reason": link_reason if has_suspicious_link else ""
        },
        {
            "key": "sender_mismatch",
            "name": "Sender Domain Mismatch / Spoofing",
            "active": has_sender_mismatch,
            "weight": 20,
            "severity": "HIGH",
            "reason": sender_reason if has_sender_mismatch else ""
        },
        {
            "key": "payment_request",
            "name": "Unverified Payment / Wire Transfer Demand",
            "active": has_payment_request,
            "weight": 15,
            "severity": "MEDIUM",
            "reason": "Email requests direct wire transfer or payment details" if has_payment_request else ""
        }
    ]

    analysis_result = calculate_risk(feature_flags, context_type="email")
    analysis_result["extractedData"] = {
        "sender": sender,
        "subject": subject,
        "urgencyWordsDetected": urgency_matches,
        "urlsFound": urls,
        "senderDomain": sender_domain
    }
    return analysis_result
