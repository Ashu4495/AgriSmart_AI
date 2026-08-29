"""
Feature engineering module for time-series weather and agricultural risk factors.

Zero-Leakage Assurance:
All rolling calculations are grouped strictly by district and sorted chronologically.
Each rolling window uses closed='left' or closed='both' (current and preceding days only),
ensuring no future information is leaked into feature computation for any date.
"""

import pandas as pd
import numpy as np
from ml.config.config import HOT_DAY_THRESHOLD_TEMP


def _compute_consecutive_hot_days(series: pd.Series, threshold: float = HOT_DAY_THRESHOLD_TEMP) -> pd.Series:
    """
    Computes running streak of consecutive days where max temperature meets or exceeds threshold.
    """
    is_hot = (series >= threshold).astype(int)
    # Block identification: cumulative sum whenever a non-hot day appears
    blocks = (~(series >= threshold)).cumsum()
    # Cumulative count within each block
    consecutive = is_hot.groupby(blocks).cumsum()
    return consecutive


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Generates time-series rolling features for each district.
    
    Features created:
    - rainfall_3d: 3-day rolling cumulative rainfall (mm)
    - rainfall_7d: 7-day rolling cumulative rainfall (mm)
    - rainfall_14d: 14-day rolling cumulative rainfall (mm)
    - rainfall_30d: 30-day rolling cumulative rainfall (mm)
    - temp_avg_7d: 7-day rolling average temperature (°C)
    - temp_max_7d: 7-day rolling maximum temperature (°C)
    - temp_avg_30d: 30-day rolling average temperature (°C)
    - rh_avg_7d: 7-day rolling average relative humidity (%)
    - ws_avg_7d: 7-day rolling average wind speed (m/s)
    - consecutive_hot_days: Streak of consecutive days with T2M_MAX >= threshold
    - rainfall_dev_30d: Daily rainfall deviation from 30-day daily average
    - temp_dev_30d: Daily temperature deviation from 30-day rolling mean
    - temp_range: Daily diurnal temperature range (T2M_MAX - T2M_MIN)
    """
    print("[FeatureEngineer] Engineering time-series weather features per district...")
    df = df.sort_values(by=["district", "date"]).copy()
    
    # 1. Diurnal temperature range
    df["temp_range"] = (df["T2M_MAX"] - df["T2M_MIN"]).round(2)

    # 2. Grouped rolling calculations
    grouped = df.groupby("district")

    print("[FeatureEngineer] Calculating rolling rainfall totals (3d, 7d, 14d, 30d)...")
    df["rainfall_3d"] = grouped["PRECTOTCORR"].transform(
        lambda s: s.rolling(window=3, min_periods=1).sum()
    ).round(2)

    df["rainfall_7d"] = grouped["PRECTOTCORR"].transform(
        lambda s: s.rolling(window=7, min_periods=1).sum()
    ).round(2)

    df["rainfall_14d"] = grouped["PRECTOTCORR"].transform(
        lambda s: s.rolling(window=14, min_periods=1).sum()
    ).round(2)

    df["rainfall_30d"] = grouped["PRECTOTCORR"].transform(
        lambda s: s.rolling(window=30, min_periods=1).sum()
    ).round(2)

    print("[FeatureEngineer] Calculating rolling temperature and humidity metrics...")
    df["temp_avg_7d"] = grouped["T2M"].transform(
        lambda s: s.rolling(window=7, min_periods=1).mean()
    ).round(2)

    df["temp_max_7d"] = grouped["T2M_MAX"].transform(
        lambda s: s.rolling(window=7, min_periods=1).max()
    ).round(2)

    df["temp_avg_30d"] = grouped["T2M"].transform(
        lambda s: s.rolling(window=30, min_periods=1).mean()
    ).round(2)

    df["rh_avg_7d"] = grouped["RH2M"].transform(
        lambda s: s.rolling(window=7, min_periods=1).mean()
    ).round(2)

    df["ws_avg_7d"] = grouped["WS10M"].transform(
        lambda s: s.rolling(window=7, min_periods=1).mean()
    ).round(2)

    print("[FeatureEngineer] Calculating consecutive hot days streak...")
    df["consecutive_hot_days"] = grouped["T2M_MAX"].transform(
        lambda s: _compute_consecutive_hot_days(s, threshold=HOT_DAY_THRESHOLD_TEMP)
    )

    print("[FeatureEngineer] Calculating rainfall and temperature deviations...")
    # Rainfall deviation: difference between today's rainfall and the expected daily average over past 30 days
    rolling_daily_expected_rain = (df["rainfall_30d"] / 30.0).round(2)
    df["rainfall_dev_30d"] = (df["PRECTOTCORR"] - rolling_daily_expected_rain).round(2)

    # Temperature deviation: difference between today's mean temp and 30-day baseline
    df["temp_dev_30d"] = (df["T2M"] - df["temp_avg_30d"]).round(2)

    print(f"[FeatureEngineer] Feature engineering completed. Generated {len(df.columns)} total columns.")
    return df
