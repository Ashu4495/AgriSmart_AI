"""
Data loading module for AgriSmart AI ML pipeline.
"""

import pandas as pd
from pathlib import Path
from typing import Optional
from ml.config.config import RAW_DATA_PATH


def load_raw_dataset(csv_path: Optional[Path] = None) -> pd.DataFrame:
    """
    Loads the historical weather dataset from CSV.
    """
    path = Path(csv_path) if csv_path else RAW_DATA_PATH
    if not path.exists():
        raise FileNotFoundError(f"Weather dataset CSV not found at: {path}")

    print(f"[DataLoader] Loading raw dataset from: {path} ...")
    df = pd.read_csv(path)
    print(f"[DataLoader] Successfully loaded {len(df):,} records across {len(df.columns)} columns.")
    return df
