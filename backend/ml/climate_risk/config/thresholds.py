"""
Agricultural and meteorological risk threshold definitions for weather risk labeling.

DISCLAIMER:
These rule-based thresholds represent agronomic heuristics derived from Indian
meteorological guidelines (IMD) and crop heat/moisture stress research.
They serve as an academic benchmark baseline and can be superseded by observed
ground-truth telemetry or disaster records.
"""

from typing import Dict, Any

# 4-tier risk classification
RISK_CLASSES = ["Low", "Medium", "High", "Critical"]
LABEL_MAPPING: Dict[str, int] = {
    "Low": 0,
    "Medium": 1,
    "High": 2,
    "Critical": 3
}
INVERSE_LABEL_MAPPING: Dict[int, str] = {v: k for k, v in LABEL_MAPPING.items()}


# Drought risk agronomic thresholds
DROUGHT_RULES = {
    "critical": {
        "condition_1": {"rainfall_30d_max": 3.0, "rainfall_14d_max": 1.0, "rh_avg_7d_max": 35.0, "temp_avg_7d_min": 28.0},
        "condition_2": {"rainfall_30d_max": 1.0, "rh_avg_7d_max": 30.0}
    },
    "high": {
        "condition_1": {"rainfall_30d_max": 12.0, "rainfall_14d_max": 4.0, "rh_avg_7d_max": 45.0, "temp_avg_7d_min": 26.0},
        "condition_2": {"rainfall_30d_max": 6.0, "rh_avg_7d_max": 38.0}
    },
    "medium": {
        "condition_1": {"rainfall_30d_max": 30.0, "rainfall_14d_max": 10.0, "rh_avg_7d_max": 55.0},
        "condition_2": {"rainfall_30d_max": 18.0, "rh_avg_7d_max": 50.0}
    }
}


# Flood risk agronomic & hydrological thresholds (IMD heavy/extreme rainfall categories)
FLOOD_RULES = {
    "critical": {
        "condition_1": {"daily_rain_min": 100.0},
        "condition_2": {"rain_3d_min": 180.0},
        "condition_3": {"rain_7d_min": 250.0, "rain_3d_min": 120.0}
    },
    "high": {
        "condition_1": {"daily_rain_min": 60.0},
        "condition_2": {"rain_3d_min": 100.0},
        "condition_3": {"rain_7d_min": 150.0}
    },
    "medium": {
        "condition_1": {"daily_rain_min": 25.0},
        "condition_2": {"rain_3d_min": 45.0},
        "condition_3": {"rain_7d_min": 75.0}
    }
}


# Heat stress risk agronomic thresholds (Crop thermal tolerance & heat wave metrics)
HEAT_STRESS_RULES = {
    "critical": {
        "condition_1": {"tmax_min": 44.0},
        "condition_2": {"tmax_min": 42.0, "consecutive_hot_days_min": 3},
        "condition_3": {"tmax_min": 40.0, "consecutive_hot_days_min": 5, "tmin_min": 27.0}
    },
    "high": {
        "condition_1": {"tmax_min": 41.0},
        "condition_2": {"tmax_min": 39.0, "consecutive_hot_days_min": 2},
        "condition_3": {"tmax_min": 38.0, "consecutive_hot_days_min": 4}
    },
    "medium": {
        "condition_1": {"tmax_min": 37.0},
        "condition_2": {"temp_max_7d_min": 37.0},
        "condition_3": {"consecutive_hot_days_min": 2}
    }
}
