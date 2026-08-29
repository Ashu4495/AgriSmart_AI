"""
End-to-end ML Pipeline Runner for AgriSmart AI.
Executes: Data loading -> Preprocessing & Cleaning -> Time-series Feature Engineering
-> Agricultural Risk Labeling -> Model Training -> Evaluation & Artifact Persistence.
"""

import sys
import time
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ml.data.loader import load_raw_dataset
from ml.preprocessing.cleaner import clean_weather_data
from ml.features.engineer import engineer_features
from ml.labeling.label_generator import add_all_risk_labels
from ml.training.trainer import train_and_evaluate_all_models
from ml.config.config import PROCESSED_DATA_DIR, FEATURES_DATA_PATH


def run_pipeline():
    start_time = time.time()
    print("=" * 70)
    print("AGRISMART AI - WEATHER DATA PREPARATION & ML TRAINING PIPELINE")
    print("=" * 70)

    # 1. Load Raw CSV Dataset
    raw_df = load_raw_dataset()

    # 2. Preprocess and Clean
    clean_df, audit_report = clean_weather_data(raw_df)

    # 3. Time-series Feature Engineering
    features_df = engineer_features(clean_df)

    # 4. Generate Agronomic Risk Labels
    labeled_df = add_all_risk_labels(features_df)

    # Optionally save processed features
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[Pipeline] Saving processed dataframe snapshot to: {FEATURES_DATA_PATH} ...")
    labeled_df.to_parquet(FEATURES_DATA_PATH, index=False)
    print(f"[Pipeline] Saved processed parquet dataset ({len(labeled_df):,} rows).")

    # 5. Train & Evaluate Models
    results = train_and_evaluate_all_models(labeled_df, save_artifacts=True)

    elapsed = time.time() - start_time
    print("=" * 70)
    print(f"PIPELINE COMPLETED SUCCESSFULLY in {elapsed / 60:.2f} minutes.")
    print("=" * 70)
    return results


if __name__ == "__main__":
    run_pipeline()
