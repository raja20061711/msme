"""
SECUREMSME AI - Payment Screenshot Analyzer Module

Extracts payment transaction proof metadata (UPI ID, Txn ID, Amount, Status) from screenshot OCR.
Detects missing reference numbers, low image resolution, or altered layout indicators.
"""

import re
from risk_engine import calculate_risk

TXN_ID_REGEX = r'(?i)(?:txn\s*id|transaction\s*id|utr|ref\s*no|reference\s*no|google\s*transaction\s*id)\s*[:.\-\n]?\s*([A-Z0-9]{8,24})'
UPI_ID_REGEX = r'[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}'
AMOUNT_REGEX = r'(?:₹|\$|rs\.?|inr|amount)\s*([\d,]+\.?\d{0,2})'
STATUS_SUCCESS_KEYWORDS = ["successful", "paid", "completed", "transferred", "sent", "success", "done", "g pay", "google pay", "powered by upi"]

def analyze_payment_screenshot(ocr_text, image_metadata=None, ocr_confidence=85.0):
    text = ocr_text or ""

    # Transaction ID match
    txn_match = re.search(TXN_ID_REGEX, text)
    txn_id = txn_match.group(1) if txn_match else None

    # General 12-digit UTR fallback
    if not txn_id:
        utr_match = re.search(r'\b\d{12}\b', text)
        if utr_match:
            txn_id = utr_match.group(0)

    # Google Pay transaction ID fallback (e.g. CICAgMjS7J63dA)
    if not txn_id:
        gpay_match = re.search(r'\b[A-Za-z0-9]{12,18}\b', text)
        if gpay_match and any(c.isupper() for c in gpay_match.group(0)) and any(c.islower() for c in gpay_match.group(0)):
            txn_id = gpay_match.group(0)

    # UPI ID match
    upi_match = re.search(UPI_ID_REGEX, text)
    upi_id = upi_match.group(0) if upi_match else None

    # Amount match
    amount_match = re.search(AMOUNT_REGEX, text, re.IGNORECASE)
    amount = amount_match.group(1) if amount_match else None
    if not amount:
        # Standalone currency/number search
        num_match = re.search(r'₹?\s*(\d{1,6}(?:\.\d{2})?)', text)
        if num_match:
            amount = num_match.group(1)

    # Status check
    has_success_status = any(kw in text.lower() for kw in STATUS_SUCCESS_KEYWORDS)

    # Image metadata checks
    is_blurry = image_metadata.get("isBlurry", False) if image_metadata else False
    is_low_res = image_metadata.get("isLowRes", False) if image_metadata else False

    # Risk Indicators
    missing_txn_id = True if (txn_id is None) else False
    missing_upi = True if (upi_id is None) else False
    missing_status = True if (not has_success_status) else False
    poor_image_quality = True if (is_blurry or is_low_res or ocr_confidence < 40.0) else False

    feature_flags = [
        {
            "key": "missing_txn_id",
            "name": "Missing Transaction ID / UTR Reference Number",
            "active": missing_txn_id,
            "weight": 30,
            "severity": "HIGH",
            "reason": "Payment screenshot lacks a verified 12-digit UTR or unique banking reference transaction ID" if missing_txn_id else ""
        },
        {
            "key": "missing_upi_handle",
            "name": "Unverified or Missing UPI ID Format",
            "active": missing_upi,
            "weight": 20,
            "severity": "MEDIUM",
            "reason": "No standardized sender/receiver UPI VPA handle (e.g. name@okaxis) found in text" if missing_upi else ""
        },
        {
            "key": "unconfirmed_status",
            "name": "Unconfirmed / Ambiguous Payment Status",
            "active": missing_status,
            "weight": 25,
            "severity": "HIGH",
            "reason": "Screenshot text does not contain explicit 'SUCCESSFUL' or 'COMPLETED' confirmation badge" if missing_status else ""
        },
        {
            "key": "poor_image_quality",
            "name": "Low Quality / Blurry Screenshot Artifacts",
            "active": poor_image_quality,
            "weight": 15,
            "severity": "MEDIUM",
            "reason": "Low image resolution or blurring detected, which can indicate digital editing or screenshot manipulation" if poor_image_quality else ""
        }
    ]

    result = calculate_risk(feature_flags, context_type="payment")
    result["extractedData"] = {
        "transactionId": txn_id or "NOT DETECTED",
        "upiId": upi_id or "NOT DETECTED",
        "amount": f"INR {amount}" if amount else "UNSPECIFIED",
        "paymentStatus": "SUCCESSFUL" if has_success_status else "UNVERIFIED / PENDING",
        "ocrConfidence": f"{ocr_confidence}%",
        "disclaimer": "Prototype screenshot analysis. This does not verify an actual bank transaction with the central banking switch."
    }
    return result

