"""
SECUREMSME AI - Invoice Risk Analyzer Module

Extracts key billing metadata (Invoice #, Vendor, GSTIN, Amount, Date) from OCR text.
Evaluates structural integrity, format compliance, and fraud indicators.
"""

import re
from risk_engine import calculate_risk

GSTIN_REGEX = r'\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b'
INVOICE_NO_REGEX = r'(?i)(?:invoice\s*(?:no|number|#)?\s*[:.-]?\s*)([A-Z0-9/-]{3,20})'
AMOUNT_REGEX = r'(?i)(?:total|amount|grand total|subtotal)\s*[:.-]?\s*₹?\s*\$?\s*([\d,]+\.?\d{0,2})'
DATE_REGEX = r'\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b'

def analyze_invoice_text(ocr_text, ocr_confidence=85.0):
    text = ocr_text or ""
    
    # Field extraction via Regex patterns
    inv_no_match = re.search(INVOICE_NO_REGEX, text)
    invoice_number = inv_no_match.group(1) if inv_no_match else None

    gstin_match = re.search(GSTIN_REGEX, text)
    gstin = gstin_match.group(0) if gstin_match else None

    amount_match = re.search(AMOUNT_REGEX, text)
    amount = amount_match.group(1) if amount_match else None

    date_match = re.search(DATE_REGEX, text)
    date_val = date_match.group(0) if date_match else None

    # Vendor extraction simple heuristic (first non-empty line or matching vendor keywords)
    lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 2]
    vendor_name = lines[0] if lines else None

    # Risk Indicators Calculation
    missing_inv_no = invoice_number is None
    missing_vendor = vendor_name is None or len(vendor_name) < 3
    invalid_gstin = gstin is None  # If text looks like an invoice but no standard 15-char GSTIN found
    missing_amount = amount is None
    missing_date = date_val is None

    # Check for suspicious invoice words like "sample", "test", "fake", "proforma"
    has_test_keyword = any(w in text.lower() for w in ["test invoice", "sample invoice", "draft", "dummy", "duplicate tax"])

    feature_flags = [
        {
            "key": "missing_invoice_number",
            "name": "Missing / Unclear Invoice Number",
            "active": missing_inv_no,
            "weight": 20,
            "severity": "HIGH",
            "reason": "Invoice image lacks a recognizable standard Invoice Number identifier" if missing_inv_no else ""
        },
        {
            "key": "invalid_gstin_format",
            "name": "Missing or Invalid GSTIN Format",
            "active": invalid_gstin,
            "weight": 25,
            "severity": "HIGH",
            "reason": "No valid 15-character GSTIN structure detected in invoice text (Format: 27AAAAA0000A1Z5)" if invalid_gstin else ""
        },
        {
            "key": "missing_vendor",
            "name": "Unclear Vendor / Supplier Header",
            "active": missing_vendor,
            "weight": 20,
            "severity": "MEDIUM",
            "reason": "Unable to confidently extract verified vendor business name from invoice top header" if missing_vendor else ""
        },
        {
            "key": "missing_amount",
            "name": "Unusual or Missing Total Amount",
            "active": missing_amount,
            "weight": 15,
            "severity": "MEDIUM",
            "reason": "Grand total billing amount could not be clearly parsed from OCR text" if missing_amount else ""
        },
        {
            "key": "test_draft_keyword",
            "name": "Sample / Draft / Duplicate Invoice Marking",
            "active": has_test_keyword,
            "weight": 20,
            "severity": "HIGH",
            "reason": "Document contains keywords indicating a non-binding, sample, or duplicate billing record" if has_test_keyword else ""
        }
    ]

    result = calculate_risk(feature_flags, context_type="invoice")
    result["extractedData"] = {
        "invoiceNumber": invoice_number or "NOT DETECTED",
        "vendorName": vendor_name or "UNSPECIFIED VENDOR",
        "gstin": gstin or "NOT FOUND / INVALID FORMAT",
        "amount": amount or "UNSPECIFIED",
        "date": date_val or "UNSPECIFIED",
        "ocrConfidence": f"{ocr_confidence}%",
        "rawTextSnippet": text[:300] + ("..." if len(text) > 300 else "")
    }
    return result
