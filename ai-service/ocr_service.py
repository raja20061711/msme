"""
SECUREMSME AI - Multi-Engine OCR Service Wrapper

Primary Engine: RapidOCR (ONNX Deep Learning Vision Engine - Pure Python)
Fallback Engine: Pytesseract (Tesseract OCR wrapper)
"""

import numpy as np
from PIL import Image

rapid_ocr_engine = None
try:
    from rapidocr_onnxruntime import RapidOCR
    rapid_ocr_engine = RapidOCR()
    print("[OCR SERVICE] RapidOCR ONNX Deep Learning engine initialized successfully!")
except Exception as e:
    print(f"[OCR SERVICE] RapidOCR initialization notice: {e}")

try:
    import pytesseract
except ImportError:
    pytesseract = None

def extract_text_from_image(processed_img, orig_img=None, fallback_text=None):
    """
    Executes OCR on OpenCV image array using RapidOCR or Pytesseract.
    Returns extracted text string and confidence score.
    """
    text_lines = []
    confidence = 85.0

    # 1. Try RapidOCR (ONNX Deep Learning OCR Engine)
    if rapid_ocr_engine is not None:
        try:
            # Use orig_img if available for maximum contrast, else processed_img
            ocr_input = orig_img if orig_img is not None else processed_img
            result, elapse = rapid_ocr_engine(ocr_input)
            if result:
                lines = [line[1] for line in result if line and len(line) > 1]
                scores = [float(line[2]) for line in result if line and len(line) > 2]
                text_lines = lines
                if scores:
                    avg_score = sum(scores) / len(scores)
                    confidence = round(avg_score * 100, 1) if avg_score <= 1.0 else round(avg_score, 1)
                
                full_text = "\n".join(text_lines).strip()
                if full_text:
                    print(f"[OCR SERVICE] RapidOCR extracted {len(text_lines)} lines (Confidence: {confidence}%)")
                    return full_text, confidence
        except Exception as err:
            print(f"[OCR SERVICE] RapidOCR runtime notice: {err}")

    # 2. Try Pytesseract if installed & binary available
    if pytesseract is not None:
        try:
            pil_img = Image.fromarray(processed_img)
            text = pytesseract.image_to_string(pil_img)
            if text and len(text.strip()) > 0:
                return text.strip(), 85.0
        except Exception as err:
            print(f"[OCR SERVICE] Pytesseract notice: {err}")

    # 3. Fallback text if provided
    if fallback_text:
        return fallback_text, 70.0

    return "", 0.0

