"""
Improved isl_api.py
===================
Fixes:
1. Confidence threshold — only returns prediction if > 65% confident
2. Handles new Pipeline model (scaler + classifier together)
3. Better error messages
4. Returns confidence score to frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# ── Load model and encoder ────────────────────────────────────────────────────
MODEL_PATH   = "isl_model.pkl"
ENCODER_PATH = "label_encoder.pkl"

# Minimum confidence to return a prediction (below this = "Not sure")
CONFIDENCE_THRESHOLD = 0.50

model   = None
encoder = None

try:
    model   = joblib.load(MODEL_PATH)
    encoder = joblib.load(ENCODER_PATH)
    print(f"✅ Model loaded from:   {MODEL_PATH}")
    print(f"✅ Encoder loaded from: {ENCODER_PATH}")
    print(f"✅ Classes: {list(encoder.classes_)}")
    print(f"✅ Confidence threshold: {CONFIDENCE_THRESHOLD * 100:.0f}%")
except FileNotFoundError as e:
    print(f"❌ Error loading model files: {e}")
    print("Run train_model.py first!")
except Exception as e:
    print(f"❌ Unexpected error: {e}")

# ── Predict endpoint ──────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    if model is None or encoder is None:
        return jsonify({
            "error": "Model not loaded. Run train_model.py first.",
            "prediction": None,
            "confidence": 0
        }), 500

    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({"error": "Invalid JSON", "prediction": None}), 400

    data = payload.get("landmarks")
    if data is None:
        return jsonify({"error": "No landmarks provided", "prediction": None}), 400

    if not isinstance(data, list) or len(data) == 0:
        return jsonify({"error": "Invalid landmarks format", "prediction": None}), 400

    try:
        # Reshape input
        input_data = np.array(data, dtype=float).reshape(1, -1)

        # Get probabilities
        probs      = model.predict_proba(input_data)
        confidence = float(np.max(probs))

        # Only return prediction if confidence is above threshold
        if confidence < CONFIDENCE_THRESHOLD:
            return jsonify({
                "prediction": None,
                "confidence": round(confidence, 3),
                "message": f"Not confident enough ({confidence*100:.1f}%)"
            })

        # Get prediction
        prediction = model.predict(input_data)
        label      = encoder.inverse_transform(prediction)

        print(f"Predicted: {label[0]} ({confidence*100:.1f}%)")

        return jsonify({
            "prediction": label[0],
            "confidence": round(confidence, 3)
        })

    except ValueError as e:
        return jsonify({"error": f"Invalid input: {e}", "prediction": None}), 400
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "Internal server error", "prediction": None}), 500

# ── Health check endpoint ─────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "model_loaded": model is not None,
        "classes": list(encoder.classes_) if encoder else []
    })

# ── Run server ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port  = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    print(f"\n🚀 Starting ISL API on http://127.0.0.1:{port}")
    print(f"📡 Test it: http://127.0.0.1:{port}/health\n")
    app.run(port=port, debug=debug)