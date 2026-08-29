"""
Evaluation module for AgriSmart AI Weather ML Models.
"""

import json
from pathlib import Path
from typing import Dict, Any, List
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)
from ml.config.thresholds import RISK_CLASSES, LABEL_MAPPING, INVERSE_LABEL_MAPPING
from ml.config.config import EVALUATION_DIR


def evaluate_model(
    model: Any,
    X_test: pd.DataFrame,
    y_test: pd.Series,
    model_name: str,
    target_names: List[str] = RISK_CLASSES
) -> Dict[str, Any]:
    """
    Evaluates a trained model on test data and returns a comprehensive metrics dictionary.
    """
    print(f"[Evaluator] Evaluating {model_name} on {len(X_test):,} test samples...")
    y_pred = model.predict(X_test)
    
    # Identify unique classes present
    unique_labels = sorted(list(set(y_test.unique()).union(set(y_pred))))
    labels_names = [INVERSE_LABEL_MAPPING[i] for i in unique_labels]

    acc = float(accuracy_score(y_test, y_pred))
    prec_macro = float(precision_score(y_test, y_pred, average="macro", zero_division=0))
    prec_weighted = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
    rec_macro = float(recall_score(y_test, y_pred, average="macro", zero_division=0))
    rec_weighted = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
    f1_macro = float(f1_score(y_test, y_pred, average="macro", zero_division=0))
    f1_weighted = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

    cm = confusion_matrix(y_test, y_pred, labels=list(range(len(RISK_CLASSES)))).tolist()
    clf_report = classification_report(
        y_test, y_pred,
        labels=list(range(len(RISK_CLASSES))),
        target_names=RISK_CLASSES,
        zero_division=0,
        output_dict=True
    )

    metrics = {
        "model_name": model_name,
        "sample_count": len(y_test),
        "accuracy": round(acc, 4),
        "precision_macro": round(prec_macro, 4),
        "precision_weighted": round(prec_weighted, 4),
        "recall_macro": round(rec_macro, 4),
        "recall_weighted": round(rec_weighted, 4),
        "f1_macro": round(f1_macro, 4),
        "f1_weighted": round(f1_weighted, 4),
        "confusion_matrix": cm,
        "confusion_matrix_classes": RISK_CLASSES,
        "classification_report": clf_report
    }

    print(f"[{model_name} Test Results]")
    print(f"  - Accuracy:           {acc * 100:.2f}%")
    print(f"  - F1-Score (Macro):   {f1_macro:.4f}")
    print(f"  - F1-Score (Weighted):{f1_weighted:.4f}")
    print(f"  - Precision (Macro):  {prec_macro:.4f}")
    print(f"  - Recall (Macro):     {rec_macro:.4f}")

    return metrics


def save_evaluation_artifacts(all_metrics: Dict[str, Any], output_dir: Path = EVALUATION_DIR):
    """
    Saves metrics as JSON and human-readable text report.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    json_path = output_dir / "evaluation_metrics.json"
    txt_path = output_dir / "evaluation_report.txt"

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_metrics, f, indent=2)

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("=" * 70 + "\n")
        f.write("AGRISMART AI - WEATHER RISK ML MODELS EVALUATION REPORT\n")
        f.write("=" * 70 + "\n\n")

        for model_key, m in all_metrics.items():
            f.write(f"MODEL: {m['model_name']}\n")
            f.write(f"Test Samples: {m['sample_count']:,}\n")
            f.write(f"Accuracy:           {m['accuracy'] * 100:.2f}%\n")
            f.write(f"F1-Score (Macro):   {m['f1_macro']:.4f}\n")
            f.write(f"F1-Score (Weighted):{m['f1_weighted']:.4f}\n")
            f.write(f"Precision (Macro):  {m['precision_macro']:.4f}\n")
            f.write(f"Recall (Macro):     {m['recall_macro']:.4f}\n\n")

            f.write("Confusion Matrix:\n")
            f.write(f"Classes: {m['confusion_matrix_classes']}\n")
            for row in m['confusion_matrix']:
                f.write(f"  {row}\n")
            f.write("\n" + "-" * 70 + "\n\n")

    print(f"[Evaluator] Saved evaluation metrics to: {json_path}")
    print(f"[Evaluator] Saved formatted report to: {txt_path}")
