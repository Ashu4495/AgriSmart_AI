"""
Risk label generator module for Drought, Flood, and Heat Stress risk.

ACADEMIC DISCLAIMER:
These rule-based labels serve as an agronomic benchmark baseline for model training
and prototype evaluation. They should not be treated as empirical ground truth.
The rules can be superseded by observational damage reports, satellite drought indices,
or disaster agency records when available.
"""

import pandas as pd
import numpy as np
from ml.config.thresholds import LABEL_MAPPING, RISK_CLASSES


def generate_drought_labels(df: pd.DataFrame) -> pd.Series:
    """
    Assigns 4-tier Drought Risk labels based on multi-week precipitation deficits,
    low relative humidity, and elevated temperatures.
    
    Tiers:
    - Critical: Extended dry period (30d rain <= 3mm, 14d rain <= 1mm, RH avg <= 35%, Temp >= 28°C)
    - High: Severe rainfall deficit (30d rain <= 12mm, 14d rain <= 4mm, RH avg <= 45%, Temp >= 26°C)
    - Medium: Moderate dry spell (30d rain <= 30mm, 14d rain <= 10mm, RH avg <= 55%)
    - Low: Adequate rainfall or moderate moisture levels
    """
    r30 = df["rainfall_30d"]
    r14 = df["rainfall_14d"]
    rh7 = df["rh_avg_7d"]
    t7 = df["temp_avg_7d"]

    # Start with Low
    labels = pd.Series("Low", index=df.index, dtype="object")

    # Medium condition
    cond_med = (
        ((r30 <= 30.0) & (r14 <= 10.0) & (rh7 <= 55.0)) |
        ((r30 <= 18.0) & (rh7 <= 50.0))
    )
    labels[cond_med] = "Medium"

    # High condition
    cond_high = (
        ((r30 <= 12.0) & (r14 <= 4.0) & (rh7 <= 45.0) & (t7 >= 26.0)) |
        ((r30 <= 6.0) & (rh7 <= 38.0))
    )
    labels[cond_high] = "High"

    # Critical condition
    cond_crit = (
        ((r30 <= 3.0) & (r14 <= 1.0) & (rh7 <= 35.0) & (t7 >= 28.0)) |
        ((r30 <= 1.0) & (rh7 <= 30.0))
    )
    labels[cond_crit] = "Critical"

    return labels


def generate_flood_labels(df: pd.DataFrame) -> pd.Series:
    """
    Assigns 4-tier Flood Risk labels based on extreme daily precipitation
    and multi-day cumulative saturation.
    
    Tiers:
    - Critical: Torrential daily rain >= 100mm, 3d rain >= 180mm, or 7d rain >= 250mm
    - High: Heavy daily rain >= 60mm, 3d rain >= 100mm, or 7d rain >= 150mm
    - Medium: Moderate-heavy daily rain >= 25mm, 3d rain >= 45mm, or 7d rain >= 75mm
    - Low: Normal to light rainfall (< 25mm daily and < 45mm 3d)
    """
    precip = df["PRECTOTCORR"]
    r3 = df["rainfall_3d"]
    r7 = df["rainfall_7d"]

    labels = pd.Series("Low", index=df.index, dtype="object")

    # Medium condition
    cond_med = (precip >= 25.0) | (r3 >= 45.0) | (r7 >= 75.0)
    labels[cond_med] = "Medium"

    # High condition
    cond_high = (precip >= 60.0) | (r3 >= 100.0) | (r7 >= 150.0)
    labels[cond_high] = "High"

    # Critical condition
    cond_crit = (precip >= 100.0) | (r3 >= 180.0) | ((r7 >= 250.0) & (r3 >= 120.0))
    labels[cond_crit] = "Critical"

    return labels


def generate_heat_stress_labels(df: pd.DataFrame) -> pd.Series:
    """
    Assigns 4-tier Heat Stress Risk labels based on maximum daily temperatures,
    consecutive hot streaks, and nocturnal cooling constraints.
    
    Tiers:
    - Critical: Tmax >= 44°C, or (Tmax >= 42°C & streak >= 3), or (Tmax >= 40°C & streak >= 5 & Tmin >= 27°C)
    - High: Tmax >= 41°C, or (Tmax >= 39°C & streak >= 2), or (Tmax >= 38°C & streak >= 4)
    - Medium: Tmax >= 37°C, or 7d Max >= 37°C, or streak >= 2
    - Low: Tmax < 37°C and 7d Max < 37°C
    """
    tmax = df["T2M_MAX"]
    tmin = df["T2M_MIN"]
    tmax7 = df["temp_max_7d"]
    streak = df["consecutive_hot_days"]

    labels = pd.Series("Low", index=df.index, dtype="object")

    # Medium condition
    cond_med = (tmax >= 37.0) | (tmax7 >= 37.0) | (streak >= 2)
    labels[cond_med] = "Medium"

    # High condition
    cond_high = (
        (tmax >= 41.0) |
        ((tmax >= 39.0) & (streak >= 2)) |
        ((tmax >= 38.0) & (streak >= 4))
    )
    labels[cond_high] = "High"

    # Critical condition
    cond_crit = (
        (tmax >= 44.0) |
        ((tmax >= 42.0) & (streak >= 3)) |
        ((tmax >= 40.0) & (streak >= 5) & (tmin >= 27.0))
    )
    labels[cond_crit] = "Critical"

    return labels


def add_all_risk_labels(df: pd.DataFrame) -> pd.DataFrame:
    """
    Attaches categorical and integer encoded risk labels for Drought, Flood, and Heat Stress.
    """
    print("[LabelGenerator] Generating rule-based agricultural risk labels...")
    df = df.copy()

    df["drought_risk_label"] = generate_drought_labels(df)
    df["drought_risk_encoded"] = df["drought_risk_label"].map(LABEL_MAPPING)

    df["flood_risk_label"] = generate_flood_labels(df)
    df["flood_risk_encoded"] = df["flood_risk_label"].map(LABEL_MAPPING)

    df["heat_stress_label"] = generate_heat_stress_labels(df)
    df["heat_stress_encoded"] = df["heat_stress_label"].map(LABEL_MAPPING)

    print("[LabelGenerator] Class distribution summary:")
    for risk_type in ["drought_risk", "flood_risk", "heat_stress"]:
        col = f"{risk_type}_label"
        dist = df[col].value_counts().to_dict()
        print(f"  - {risk_type}: {dist}")

    return df
