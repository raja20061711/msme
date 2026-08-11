"""
SECUREMSME AI - OpenCV Image Preprocessing Service

Prepares uploaded invoice and payment screenshots for high-accuracy OCR extraction.
Performs grayscale conversion, noise reduction, thresholding, and quality metrics.
"""

import cv2
import numpy as np

def preprocess_image(image_bytes):
    """
    Decodes raw image bytes and executes OpenCV preprocessing pipeline.
    Returns processed image object, original image, and quality metadata.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img_orig = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img_orig is None:
        raise ValueError("Failed to decode image file bytes.")

    height, width = img_orig.shape[:2]

    # Convert to Grayscale
    gray = cv2.cvtColor(img_orig, cv2.COLOR_BGR2GRAY)

    # Calculate blurriness metric (Laplacian variance)
    blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
    is_blurry = blur_score < 80.0

    # Resize if too small for OCR readability
    if width < 800 or height < 800:
        scale = max(800.0 / width, 800.0 / height)
        new_w, new_h = int(width * scale), int(height * scale)
        gray = cv2.resize(gray, (new_w, new_h), interpolation=cv2.INTER_CUBIC)

    # Denoise using Gaussian Blur
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)

    # Adaptive Thresholding to sharpen text contrast
    thresholded = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    metadata = {
        "width": int(width),
        "height": int(height),
        "blurScore": float(round(float(blur_score), 2)),
        "isBlurry": True if is_blurry else False,
        "isLowRes": True if (width < 600 or height < 600) else False
    }
    rgb_orig = cv2.cvtColor(img_orig, cv2.COLOR_BGR2RGB)

    return thresholded, rgb_orig, metadata
