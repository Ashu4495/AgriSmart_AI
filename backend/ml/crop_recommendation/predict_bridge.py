import sys
import json
import os
import joblib
import pandas as pd
import numpy as np
import warnings

# Suppress sklearn unpickle warnings
warnings.filterwarnings("ignore")

def predict_from_ml(payload):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "models", "crop_recommendation_model.joblib")
    encoder_path = os.path.join(base_dir, "models", "crop_label_encoder.joblib")

    if not os.path.exists(model_path) or not os.path.exists(encoder_path):
        raise FileNotFoundError("ML model or label encoder file not found.")

    model = joblib.load(model_path)
    label_encoder = joblib.load(encoder_path)

    # 7 exact features
    input_df = pd.DataFrame([
        {
            "Nitrogen": float(payload["nitrogen"]),
            "Phosphorus": float(payload["phosphorus"]),
            "Potassium": float(payload["potassium"]),
            "Temperature": float(payload["temperature"]),
            "Humidity": float(payload["humidity"]),
            "pH_Value": float(payload["ph"]),
            "Rainfall": float(payload["rainfall"]),
        }
    ])

    probabilities = model.predict_proba(input_df)[0]
    ranked_indices = np.argsort(probabilities)[::-1]

    all_preds = []
    recommendations = []
    for idx in ranked_indices:
        prob_percent = round(float(probabilities[idx] * 100), 2)
        crop_name = str(label_encoder.inverse_transform([idx])[0])
        item = {"crop": crop_name, "probability": prob_percent}
        all_preds.append(item)
        if prob_percent > 0 and len(recommendations) < 3:
            recommendations.append(item)

    if not recommendations and len(all_preds) > 0:
        recommendations.append(all_preds[0])

    return {
        "success": True,
        "recommendations": recommendations,
        "all_predictions": all_preds,
    }

if __name__ == "__main__":
    try:
        raw_input = sys.stdin.read() if not sys.argv[1:] else sys.argv[1]
        data = json.loads(raw_input)
        result = predict_from_ml(data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)
