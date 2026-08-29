"""
Data cleaning and validation module for historical weather dataset.
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple


def clean_weather_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Cleans raw weather records:
    1. Parses 'date' column into datetime.
    2. Drops full duplicate rows and duplicate (district, date) entries.
    3. Handles missing/invalid NASA sentinel values (-999 or < -900).
    4. Interpolates missing values per district chronologically.
    5. Validates physical numeric ranges.
    6. Sorts strictly by district and date.
    
    Returns:
        cleaned_df: Cleaned and validated DataFrame
        audit_report: Dictionary with cleaning statistics
    """
    print("[Cleaner] Starting data cleaning and validation pipeline...")
    initial_rows = len(df)
    
    # 1. Parse date
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"], format="%Y-%m-%d", errors="coerce")
    invalid_dates = df["date"].isnull().sum()
    if invalid_dates > 0:
        print(f"[Cleaner] Warning: {invalid_dates} invalid date records dropped.")
        df = df.dropna(subset=["date"])

    # 2. Check duplicates
    duplicate_rows = df.duplicated().sum()
    if duplicate_rows > 0:
        print(f"[Cleaner] Dropping {duplicate_rows} duplicate rows.")
        df = df.drop_duplicates()

    duplicate_district_date = df.duplicated(subset=["district", "date"]).sum()
    if duplicate_district_date > 0:
        print(f"[Cleaner] Dropping {duplicate_district_date} duplicate district-date pairs.")
        df = df.drop_duplicates(subset=["district", "date"], keep="first")

    # 3. Sort chronologically per district
    df = df.sort_values(by=["district", "date"]).reset_index(drop=True)

    # 4. Handle invalid NASA POWER values (-999 or < -900)
    numeric_cols = [
        "latitude", "longitude", "T2M", "T2M_MAX", "T2M_MIN",
        "RH2M", "PRECTOTCORR", "WS10M", "PS"
    ]
    
    replaced_invalid_counts = {}
    for col in numeric_cols:
        if col in df.columns:
            # Mask -999 or negative values where impossible
            invalid_mask = (df[col] < -900) | (df[col] == -999)
            if col in ["PRECTOTCORR", "WS10M", "RH2M"]:
                invalid_mask = invalid_mask | (df[col] < 0)
            
            invalid_count = int(invalid_mask.sum())
            replaced_invalid_counts[col] = invalid_count
            if invalid_count > 0:
                print(f"[Cleaner] Replacing {invalid_count} invalid values in '{col}' with interpolated data...")
                df.loc[invalid_mask, col] = np.nan
                # Group-wise linear interpolation and forward/backward fill
                df[col] = df.groupby("district")[col].transform(
                    lambda group: group.interpolate(method="linear").bfill().ffill()
                )

    # 5. Physical bounds validation and clipping
    # RH2M should not exceed 100%
    if "RH2M" in df.columns:
        df["RH2M"] = df["RH2M"].clip(lower=0.0, upper=100.0)
    
    # PRECTOTCORR cannot be negative
    if "PRECTOTCORR" in df.columns:
        df["PRECTOTCORR"] = df["PRECTOTCORR"].clip(lower=0.0)

    # WS10M cannot be negative
    if "WS10M" in df.columns:
        df["WS10M"] = df["WS10M"].clip(lower=0.0)

    # Ensure T2M_MAX >= T2M_MIN
    if "T2M_MAX" in df.columns and "T2M_MIN" in df.columns:
        inversion_mask = df["T2M_MAX"] < df["T2M_MIN"]
        inversions = int(inversion_mask.sum())
        if inversions > 0:
            print(f"[Cleaner] Correcting {inversions} T2M_MAX < T2M_MIN inversions.")
            df.loc[inversion_mask, ["T2M_MAX", "T2M_MIN"]] = df.loc[
                inversion_mask, ["T2M_MIN", "T2M_MAX"]
            ].values

    final_rows = len(df)
    audit_report = {
        "initial_rows": initial_rows,
        "final_rows": final_rows,
        "duplicate_rows_removed": int(duplicate_rows),
        "duplicate_keys_removed": int(duplicate_district_date),
        "invalid_values_replaced": replaced_invalid_counts,
        "date_min": df["date"].min().strftime("%Y-%m-%d"),
        "date_max": df["date"].max().strftime("%Y-%m-%d"),
        "total_districts": int(df["district"].nunique())
    }
    
    print(f"[Cleaner] Cleaning complete. Retained {final_rows:,} records across {audit_report['total_districts']} districts.")
    return df, audit_report
