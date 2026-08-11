"""
SECUREMSME AI - URL Risk Analyzer Module

Analyzes URL structure, domain characteristics, protocol, and keyword patterns.
Runs deterministic feature-weighted scoring.
"""

import re
from urllib.parse import urlparse
from risk_engine import calculate_risk

SHORTENER_DOMAINS = ["bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy", "goo.gl", "ow.ly"]
SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "bank", "account", "update", "signin", "free", "gift", 
    "payout", "wallet", "support", "trade", "trading", "flux", "crypto", "invest", "investment",
    "fx", "exchange", "profit", "claim", "bonus", "presale", "airdrop", "wealth", "fund", "pay"
]

def analyze_url(url_string):
    url = url_string.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "http://" + url  # Default protocol for parsing

    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""

    # 1. IP Address instead of domain (+25)
    is_ip = bool(re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', hostname))

    # 2. No HTTPS (+15)
    no_https = not url_string.strip().lower().startswith("https://")

    # 3. Excessive subdomains (+15)
    subdomains = hostname.split(".")
    has_excessive_subdomains = len(subdomains) > 3 and not is_ip

    # 4. Suspicious keywords (+20)
    found_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in hostname.lower() or kw in path.lower() or kw in query.lower()]
    has_suspicious_keywords = len(found_keywords) > 0

    # 5. Very long URL (+10)
    is_very_long = len(url_string) > 65

    # 6. Shortened URL (+15)
    is_shortened = any(shortener in hostname.lower() for shortener in SHORTENER_DOMAINS)

    feature_flags = [
        {
            "key": "ip_address_host",
            "name": "Raw IP Address Host",
            "active": is_ip,
            "weight": 25,
            "severity": "HIGH",
            "reason": f"URL uses numerical IP address ({hostname}) instead of a registered domain name" if is_ip else ""
        },
        {
            "key": "no_https",
            "name": "Missing HTTPS Encryption",
            "active": no_https,
            "weight": 15,
            "severity": "MEDIUM",
            "reason": "Connection is unencrypted (HTTP only), exposing transmitted data to interception" if no_https else ""
        },
        {
            "key": "excessive_subdomains",
            "name": "Excessive Subdomains",
            "active": has_excessive_subdomains,
            "weight": 15,
            "severity": "MEDIUM",
            "reason": f"Domain contains excessive nested subdomains ({hostname})" if has_excessive_subdomains else ""
        },
        {
            "key": "suspicious_keywords",
            "name": "Suspicious Authentication / Phishing Keywords",
            "active": has_suspicious_keywords,
            "weight": 20,
            "severity": "HIGH",
            "reason": f"URL path/domain contains sensitive target keywords ({', '.join(found_keywords[:3])})" if has_suspicious_keywords else ""
        },
        {
            "key": "long_url",
            "name": "Abnormally Long URL Length",
            "active": is_very_long,
            "weight": 10,
            "severity": "LOW",
            "reason": f"URL length is unusually long ({len(url_string)} characters), often used to obfuscate destination" if is_very_long else ""
        },
        {
            "key": "url_shortener",
            "name": "URL Redirection Shortener Service",
            "active": is_shortened,
            "weight": 15,
            "severity": "MEDIUM",
            "reason": "Uses a link shortener service to conceal the actual destination domain" if is_shortened else ""
        }
    ]

    result = calculate_risk(feature_flags, context_type="url")
    result["extractedData"] = {
        "url": url_string,
        "hostname": hostname,
        "protocol": parsed.scheme,
        "hasHttps": not no_https,
        "detectedKeywords": found_keywords
    }
    return result
