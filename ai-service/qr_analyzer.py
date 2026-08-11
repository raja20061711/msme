"""
SECUREMSME AI - QR Code Analyzer Module

Decodes QR code images using OpenCV QRCodeDetector.
Evaluates payload (URL, UPI payment string, or plain text) and computes risk score.
"""

import cv2
import numpy as np
from url_analyzer import analyze_url
from risk_engine import calculate_risk

def decode_and_analyze_qr(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Failed to decode QR code image file bytes.")

    detector = cv2.QRCodeDetector()
    decoded_text, points, _ = detector.detectAndDecode(img)

    if not decoded_text or len(decoded_text.strip()) == 0:
        # Fallback OpenCV barcode / threshold search
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        decoded_text, points, _ = detector.detectAndDecode(gray)

    if not decoded_text:
        return {
            "riskScore": 60,
            "riskLevel": "MEDIUM",
            "indicators": [
                {
                    "key": "qr_decode_failed",
                    "name": "Unreadable QR Code Matrix",
                    "severity": "MEDIUM",
                    "reason": "Unable to decode a valid 2D matrix payload from image. Ensure QR image is clear.",
                    "scoreContribution": 60
                }
            ],
            "recommendation": "CAUTION: Could not clearly parse QR code. Do not scan unknown or damaged QR codes.",
            "extractedData": {
                "qrContent": "UNREADABLE / BLURRY QR MATRIX",
                "destination": "UNKNOWN"
            }
        }

    decoded_text = decoded_text.strip()

    # If QR contains a URL
    if decoded_text.startswith("http://") or decoded_text.startswith("https://") or "www." in decoded_text or ".com" in decoded_text or ".in" in decoded_text:
        url_analysis = analyze_url(decoded_text)
        url_analysis["extractedData"]["qrContent"] = decoded_text
        url_analysis["extractedData"]["destinationType"] = "WEBSITE URL"
        url_analysis["recommendation"] = f"QR Destination: {decoded_text}. " + url_analysis["recommendation"]
        return url_analysis

    # If QR contains UPI payment string (upi://pay?pa=...&pn=...)
    elif decoded_text.startswith("upi://"):
        feature_flags = []
        is_suspicious_upi = "pa=" not in decoded_text or len(decoded_text) < 15
        
        feature_flags.append({
            "key": "raw_upi_qr",
            "name": "UPI Payment QR Code",
            "active": is_suspicious_upi,
            "weight": 40,
            "severity": "HIGH",
            "reason": "UPI QR payload is malformed or missing payee address parameters" if is_suspicious_upi else ""
        })

        analysis = calculate_risk(feature_flags, context_type="qr")
        analysis["extractedData"] = {
            "qrContent": decoded_text,
            "destinationType": "UPI PAYMENT DEEP LINK",
            "payeeAddress": decoded_text.split("pa=")[1].split("&")[0] if "pa=" in decoded_text else "UNKNOWN"
        }
        return analysis

    # Plain text QR
    else:
        feature_flags = [
            {
                "key": "plain_text_qr",
                "name": "Plain Text Payload",
                "active": len(decoded_text) > 200,
                "weight": 15,
                "severity": "LOW",
                "reason": "QR contains an abnormally long unencrypted text block" if len(decoded_text) > 200 else ""
            }
        ]
        analysis = calculate_risk(feature_flags, context_type="qr")
        analysis["extractedData"] = {
            "qrContent": decoded_text,
            "destinationType": "PLAIN TEXT"
        }
        return analysis
