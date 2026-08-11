"""
SECUREMSME AI - Python Flask AI Microservice Entry Point

Exposes REST APIs for email, URL, invoice, payment screenshot, and QR fraud detection.
Port: 5001
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

from email_analyzer import analyze_email
from url_analyzer import analyze_url
from invoice_analyzer import analyze_invoice_text
from payment_analyzer import analyze_payment_screenshot
from qr_analyzer import decode_and_analyze_qr
from image_processor import preprocess_image
from ocr_service import extract_text_from_image

app = Flask(__name__)
CORS(app)

def make_json_safe(obj):
    def default_converter(o):
        if hasattr(o, 'item'):
            return o.item()
        return str(o)
    return json.loads(json.dumps(obj, default=default_converter))

# Custom JSON Provider for NumPy 2.x and Python 3.14 compatibility
class CustomJSONProvider(Flask.json_provider_class):
    def default(self, obj):
        if hasattr(obj, 'item'):
            return obj.item()
        return super().default(obj)

app.json_provider_class = CustomJSONProvider

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ONLINE",
        "service": "SecureMSME AI Flask Service",
        "version": "1.0.0-prototype"
    }), 200

@app.route('/analyze/email', methods=['POST'])
def handle_email_analysis():
    try:
        data = request.json or {}
        sender = data.get('sender', '')
        subject = data.get('subject', '')
        body = data.get('body', '')

        result = analyze_email(sender=sender, subject=subject, body=body)
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/analyze/url', methods=['POST'])
def handle_url_analysis():
    try:
        data = request.json or {}
        url = data.get('url', '')

        if not url:
            return jsonify({"success": False, "error": "URL parameter is required."}), 400

        result = analyze_url(url)
        return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/analyze/invoice', methods=['POST'])
def handle_invoice_analysis():
    try:
        if 'file' not in request.files:
            # Check if raw ocrText was sent directly
            data = request.json or {}
            ocr_text = data.get('ocrText', '')
            result = analyze_invoice_text(ocr_text)
            return jsonify({"success": True, "data": result}), 200

        file = request.files['file']
        file_bytes = file.read()

        # Run OpenCV Preprocessing
        processed_img, orig_img, metadata = preprocess_image(file_bytes)

        # Run Tesseract OCR
        ocr_text, confidence = extract_text_from_image(processed_img, orig_img=orig_img)

        # Run Invoice Analyzer
        result = analyze_invoice_text(ocr_text, ocr_confidence=confidence)
        result["imageMetadata"] = metadata
        return jsonify({"success": True, "data": result}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/analyze/payment', methods=['POST'])
def handle_payment_analysis():
    try:
        if 'file' not in request.files:
            data = request.json or {}
            ocr_text = data.get('ocrText', '')
            result = analyze_payment_screenshot(ocr_text)
            return jsonify({"success": True, "data": result}), 200

        file = request.files['file']
        file_bytes = file.read()

        processed_img, orig_img, metadata = preprocess_image(file_bytes)
        ocr_text, confidence = extract_text_from_image(processed_img, orig_img=orig_img)

        result = analyze_payment_screenshot(ocr_text, image_metadata=metadata, ocr_confidence=confidence)
        result["imageMetadata"] = metadata
        safe_data = make_json_safe(result)
        return jsonify({"success": True, "data": safe_data}), 200

    except Exception as e:
        import traceback
        err_msg = traceback.format_exc()
        print(f"[FLASK APP ERROR IN /analyze/payment]:\n{err_msg}")
        return jsonify({"success": False, "error": str(e), "traceback": err_msg}), 500

@app.route('/analyze/qr', methods=['POST'])
def handle_qr_analysis():
    try:
        if 'file' in request.files:
            file = request.files['file']
            file_bytes = file.read()
            result = decode_and_analyze_qr(file_bytes)
            return jsonify({"success": True, "data": result}), 200
        else:
            data = request.json or {}
            qr_content = data.get('qrContent', '')
            if qr_content.startswith("http") or ".com" in qr_content:
                result = analyze_url(qr_content)
                result["extractedData"]["qrContent"] = qr_content
            else:
                result = analyze_url(f"http://{qr_content}") if qr_content else analyze_url("http://example.com")
                result["extractedData"]["qrContent"] = qr_content
            return jsonify({"success": True, "data": result}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5005))
    print(f"Starting SECUREMSME AI Python Service on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
