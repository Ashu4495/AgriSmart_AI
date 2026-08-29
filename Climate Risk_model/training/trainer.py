"""
Model training module for Drought, Flood, and Heat Stress risk classifiers.
"""

import json
import joblib
from pathlib import Path
from typing import Dict, Any, Tuple
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

from ml.config.config import (
    TRAIN_END_DATE,
    VAL_START_DATE,
    VAL_END_DATE,
    TEST_START_DATE,
    TEST_END_DATE,
    DROUGHT_FEATURE_COLS,
    FLOOD_FEATURE_COLS,
    HEAT_STRESS_FEATURE_COLS,
    MODEL_PARAMS,
    MODELS_DIR
)
from ml.config.thresholds import LABEL_MAPPING, INVERSE_LABEL_MAPPING, RISK_CLASSES
from ml.evaluation.evaluator import evaluate_model, save_evaluation_artifacts


def split_data_by_time(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Performs chronological time-aware train / val / test split without data leakage.
    """
    print(f"[Trainer] Splitting dataset chronologically...")
    train_mask = df["date"] <= TRAIN_END_DATE
    val_mask = (df["date"] >= VAL_START_DATE) & (df["date"] <= VAL_END_DATE)
    test_mask = df["date"] >= TEST_START_DATE

    df_train = df[train_mask].copy()
    df_val = df[val_mask].copy()
    df_test = df[test_mask].copy()

    print(f"  - Train: {len(df_train):,} rows ({df_train['date'].min().strftime('%Y-%m-%d')} to {df_train['date'].max().strftime('%Y-%m-%d')})")
    print(f"  - Val:   {len(df_val):,} rows ({df_val['date'].min().strftime('%Y-%m-%d')} to {df_val['date'].max().strftime('%Y-%m-%d')})")
    print(f"  - Test:  {len(df_test):,} rows ({df_test['date'].min().strftime('%Y-%m-%d')} to {df_test['date'].max().strftime('%Y-%m-%d')})")

    return df_train, df_val, df_test


def train_and_evaluate_all_models(
    df: pd.DataFrame,
    save_artifacts: bool = True
) -> Dict[str, Any]:
    """
    Trains and evaluates 3 Random Forest classifiers:
    1. drought_risk_model
    2. flood_risk_model
    3. heat_stress_model
    """
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    df_train, df_val, df_test = split_data_by_time(df)

    models_spec = {
        "drought_risk_model": {
            "features": DROUGHT_FEATURE_COLS,
            "target": "drought_risk_encoded",
            "name": "Drought Risk Classifier"
        },
        "flood_risk_model": {
            "features": FLOOD_FEATURE_COLS,
            "target": "flood_risk_encoded",
            "name": "Flood Risk Classifier"
        },
        "heat_stress_model": {
            "features": HEAT_STRESS_FEATURE_COLS,
            "target": "heat_stress_encoded",
            "name": "Heat Stress Classifier"
        }
    }

    all_metrics = {}
    trained_models = {}

    for model_key, spec in models_spec.items():
        print("\n" + "=" * 60)
        print(f"[Trainer] Training: {spec['name']} ({model_key})")
        print(f"[Trainer] Features ({len(spec['features'])}): {spec['features']}")
        print("=" * 60)

        X_train = df_train[spec["features"]]
        y_train = df_train[spec["target"]]
        X_val = df_val[spec["features"]]
        y_val = df_val[spec["target"]]
        X_test = df_test[spec["features"]]
        y_test = df_test[spec["target"]]

        clf = RandomForestClassifier(**MODEL_PARAMS)
        print(f"[Trainer] Fitting Random Forest on {len(X_train):,} training records...")
        clf.fit(X_train, y_train)

        # Evaluate on Test set
        test_metrics = evaluate_model(clf, X_test, y_test, spec["name"])
        all_metrics[model_key] = test_metrics
        trained_models[model_key] = clf

        if save_artifacts:
            model_path = MODELS_DIR / f"{model_key}.joblib"
            print(f"[Trainer] Saving model to: {model_path}")
            joblib.dump(clf, model_path, compress=3)

    if save_artifacts:
        # Save feature columns config
        feature_cols_map = {
            k: v["features"] for k, v in models_spec.items()
        }
        features_config_path = MODELS_DIR / "feature_columns.json"
        with open(features_config_path, "w", encoding="utf-8") as f:
            json.dump(feature_cols_map, f, indent=2)

        # Save label mapping
        label_mapping_path = MODELS_DIR / "label_mapping.json"
        with open(label_mapping_path, "w", encoding="utf-8") as f:
            json.dump({
                "classes": RISK_CLASSES,
                "label_to_id": LABEL_MAPPING,
                "id_to_label": INVERSE_LABEL_MAPPING
            }, f, indent=2)

        # Save preprocessing and metadata configuration
        metadata_path = MODELS_DIR / "pipeline_metadata.json"
        with open(metadata_path, "w", encoding="utf-8") as f:
            json.dump({
                "dataset_source": "NASA POWER Daily Weather Dataset",
                "train_date_range": f"2005-01-01 to {TRAIN_END_DATE}",
                "val_date_range": f"{VAL_START_DATE} to {VAL_END_DATE}",
                "test_date_range": f"{TEST_START_DATE} to {TEST_END_DATE}",
                "total_districts": int(df["district"].nunique()),
                "total_observations": len(df),
                "model_parameters": MODEL_PARAMS,
                "risk_classes": RISK_CLASSES
            }, f, indent=2)

        # Save evaluation metrics
        save_evaluation_artifacts(all_metrics)

    return {
        "models": trained_models,
        "metrics": all_metrics
    }
