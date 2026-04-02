from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

from model_utils import RAW_FEATURE_COUNT, build_feature_matrix

app = Flask(__name__)
CORS(app)

MODEL_PATH = "isl_model.pkl"
ENCODER_PATH = "label_encoder.pkl"

CONFIDENCE_THRESHOLD = 0.55
AMBIGUITY_MARGIN = 0.08

model = None
encoder = None

try:
    model = joblib.load(MODEL_PATH)
    encoder = joblib.load(ENCODER_PATH)
    print(f"Model loaded from:   {MODEL_PATH}")
    print(f"Encoder loaded from: {ENCODER_PATH}")
    print(f"Classes: {list(encoder.classes_)}")
    print(f"Confidence threshold: {CONFIDENCE_THRESHOLD * 100:.0f}%")
    print(f"Ambiguity margin: {AMBIGUITY_MARGIN * 100:.0f}%")
except FileNotFoundError as e:
    print(f"Error loading model files: {e}")
    print("Run train_model.py first!")
except Exception as e:
    print(f"Unexpected error: {e}")


@app.route("/predict", methods=["POST"])
def predict():
    if model is None or encoder is None:
        return jsonify({
            "error": "Model not loaded. Run train_model.py first.",
            "prediction": None,
            "confidence": 0,
        }), 500

    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({"error": "Invalid JSON", "prediction": None}), 400

    data = payload.get("landmarks")
    if data is None:
        return jsonify({"error": "No landmarks provided", "prediction": None}), 400

    if not isinstance(data, list) or len(data) != RAW_FEATURE_COUNT:
        return jsonify({
            "error": f"Expected {RAW_FEATURE_COUNT} landmark values.",
            "prediction": None,
        }), 400

    try:
        input_data = build_feature_matrix(np.array(data, dtype=float))

        probs = model.predict_proba(input_data)[0]
        sorted_probs = np.sort(probs)[::-1]
        confidence = float(sorted_probs[0])
        runner_up = float(sorted_probs[1]) if len(sorted_probs) > 1 else 0.0
        margin = confidence - runner_up

        if confidence < CONFIDENCE_THRESHOLD or margin < AMBIGUITY_MARGIN:
            return jsonify({
                "prediction": None,
                "confidence": round(confidence, 3),
                "margin": round(margin, 3),
                "message": f"Ambiguous prediction ({confidence * 100:.1f}% confidence)",
            })

        prediction = model.predict(input_data)
        label = encoder.inverse_transform(prediction)

        print(f"Predicted: {label[0]} ({confidence * 100:.1f}%, margin {margin * 100:.1f}%)")

        return jsonify({
            "prediction": label[0],
            "confidence": round(confidence, 3),
            "margin": round(margin, 3),
        })

    except ValueError as e:
        return jsonify({"error": f"Invalid input: {e}", "prediction": None}), 400
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "Internal server error", "prediction": None}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "model_loaded": model is not None,
        "classes": list(encoder.classes_) if encoder else [],
    })


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    print(f"\nStarting ISL API on http://127.0.0.1:{port}")
    print(f"Test it: http://127.0.0.1:{port}/health\n")
    app.run(port=port, debug=debug)
