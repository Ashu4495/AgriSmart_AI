"""
Central configuration for AgriSmart AI Weather ML Pipeline.
"""

from pathlib import Path
from typing import List

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent

# Data paths
RAW_DATA_PATH = (
    PROJECT_ROOT / "weather_dataset.csv"
    if (PROJECT_ROOT / "weather_dataset.csv").exists()
    else PROJECT_ROOT / "maharashtra_weather_dataset.csv"
)
PROCESSED_DATA_DIR = BASE_DIR / "data"
FEATURES_DATA_PATH = PROCESSED_DATA_DIR / "weather_features.parquet"

# Models and evaluation directories
MODELS_DIR = BASE_DIR / "models"
EVALUATION_DIR = BASE_DIR / "evaluation"

# Time-aware split dates
# Dataset spans 2005-01-01 to 2025-12-31 (21 years)
TRAIN_END_DATE = "2021-12-31"   # 2005 to 2021 (~81% of data: 17 years)
VAL_START_DATE = "2022-01-01"
VAL_END_DATE = "2023-12-31"     # 2022 to 2023 (~9.5% of data: 2 years)
TEST_START_DATE = "2024-01-01"
TEST_END_DATE = "2025-12-31"    # 2024 to 2025 (~9.5% of data: 2 years)

# Hot day threshold for consecutive hot days feature
HOT_DAY_THRESHOLD_TEMP = 38.0

# Base raw numeric columns
RAW_NUMERIC_COLS = [
    "latitude", "longitude", "T2M", "T2M_MAX", "T2M_MIN", 
    "RH2M", "PRECTOTCORR", "WS10M", "PS"
]

# Engineered time-series feature columns
TIME_SERIES_FEATURE_COLS = [
    "rainfall_3d",
    "rainfall_7d",
    "rainfall_14d",
    "rainfall_30d",
    "temp_avg_7d",
    "temp_max_7d",
    "rh_avg_7d",
    "consecutive_hot_days",
    "rainfall_dev_30d",
    "temp_dev_30d",
    "temp_range",
    "temp_avg_30d",
    "ws_avg_7d"
]

# All candidate features
ALL_FEATURE_COLS = RAW_NUMERIC_COLS + TIME_SERIES_FEATURE_COLS

# Feature subsets optimized for each specific model
DROUGHT_FEATURE_COLS: List[str] = [
    "latitude", "longitude", "T2M", "T2M_MAX", "T2M_MIN", "RH2M", "PS",
    "rainfall_3d", "rainfall_7d", "rainfall_14d", "rainfall_30d",
    "temp_avg_7d", "temp_max_7d", "temp_avg_30d", "rh_avg_7d",
    "rainfall_dev_30d", "temp_dev_30d"
]

FLOOD_FEATURE_COLS: List[str] = [
    "latitude", "longitude", "PRECTOTCORR", "RH2M", "WS10M", "PS",
    "rainfall_3d", "rainfall_7d", "rainfall_14d", "rainfall_30d",
    "rainfall_dev_30d", "temp_avg_7d"
]

HEAT_STRESS_FEATURE_COLS: List[str] = [
    "latitude", "longitude", "T2M", "T2M_MAX", "T2M_MIN", "RH2M", "WS10M",
    "temp_range", "temp_avg_7d", "temp_max_7d", "temp_avg_30d",
    "rh_avg_7d", "consecutive_hot_days", "temp_dev_30d"
]

# Random Forest Hyperparameters
MODEL_PARAMS = {
    "n_estimators": 100,
    "max_depth": 18,
    "min_samples_split": 10,
    "min_samples_leaf": 4,
    "class_weight": "balanced_subsample",
    "random_state": 42,
    "n_jobs": -1
}
