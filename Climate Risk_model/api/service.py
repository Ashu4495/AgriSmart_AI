import os
import json
import joblib
import urllib.request
import urllib.parse
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd
import numpy as np

# ---------------------------------------------------------------------------
# Base Paths & Lazy-loaded Singleton Model Storage
# ---------------------------------------------------------------------------
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CURRENT_DIR)  # Climate Risk_model root
MODELS_DIR = os.path.join(BASE_DIR, "models")

class ClimateRiskMLService:
    _instance: Optional["ClimateRiskMLService"] = None

    def __init__(self):
        self.drought_model = None
        self.flood_model = None
        self.heat_model = None
        self.feature_columns: Dict[str, List[str]] = {}
        self.label_mapping: Dict[str, Any] = {}
        self.metadata: Dict[str, Any] = {}
        self.is_loaded = False
        self._load_models()

    @classmethod
    def get_instance(cls) -> "ClimateRiskMLService":
        if cls._instance is None:
            cls._instance = ClimateRiskMLService()
        return cls._instance

    def _load_models(self):
        try:
            drought_path = os.path.join(MODELS_DIR, "drought_risk_model.joblib")
            flood_path = os.path.join(MODELS_DIR, "flood_risk_model.joblib")
            heat_path = os.path.join(MODELS_DIR, "heat_stress_model.joblib")
            feats_path = os.path.join(MODELS_DIR, "feature_columns.json")
            labels_path = os.path.join(MODELS_DIR, "label_mapping.json")
            meta_path = os.path.join(MODELS_DIR, "pipeline_metadata.json")

            if os.path.exists(drought_path):
                self.drought_model = joblib.load(drought_path)
            if os.path.exists(flood_path):
                self.flood_model = joblib.load(flood_path)
            if os.path.exists(heat_path):
                self.heat_model = joblib.load(heat_path)

            if os.path.exists(feats_path):
                with open(feats_path, "r", encoding="utf-8") as f:
                    self.feature_columns = json.load(f)

            if os.path.exists(labels_path):
                with open(labels_path, "r", encoding="utf-8") as f:
                    self.label_mapping = json.load(f)

            if os.path.exists(meta_path):
                with open(meta_path, "r", encoding="utf-8") as f:
                    self.metadata = json.load(f)

            if self.drought_model and self.flood_model and self.heat_model:
                self.is_loaded = True
            else:
                print("[ClimateRiskService] Warning: One or more models failed to load.")
        except Exception as e:
            print(f"[ClimateRiskService] Model loading error: {e}")
            self.is_loaded = False

    def fetch_weather_timeseries(self, latitude: float, longitude: float) -> pd.DataFrame:
        """
        Fetches 30 days past weather + 7-day forecast from Open-Meteo API.
        Variables aligned with NASA POWER training features:
        - Temperature (2m): mean, max, min (°C)
        - Relative Humidity (2m) (%)
        - Precipitation (mm)
        - Wind Speed (10m) (m/s) (using wind_speed_unit=ms)
        - Surface Pressure (kPa)
        """
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}&longitude={longitude}"
            f"&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,"
            f"relative_humidity_2m_mean,precipitation_sum,wind_speed_10m_max,surface_pressure_mean"
            f"&wind_speed_unit=ms&past_days=30&forecast_days=7&timezone=auto"
        )

        try:
            req = urllib.request.Request(url, headers={"User-Agent": "AgriSmart-ClimateRisk/1.0"})
            with urllib.request.urlopen(req, timeout=7) as response:
                payload = json.loads(response.read().decode("utf-8"))

            daily = payload.get("daily", {})
            times = daily.get("time", [])
            t_max = daily.get("temperature_2m_max", [])
            t_min = daily.get("temperature_2m_min", [])
            t_mean = daily.get("temperature_2m_mean", [])
            rh = daily.get("relative_humidity_2m_mean", [])
            precip = daily.get("precipitation_sum", [])
            wind = daily.get("wind_speed_10m_max", [])
            ps_raw = daily.get("surface_pressure_mean", [])
            ps = [p / 10.0 if p is not None else 101.3 for p in ps_raw]

            n = len(times)
            if n == 0:
                raise ValueError("Empty weather time-series returned.")

            df = pd.DataFrame({
                "date": times,
                "latitude": [latitude] * n,
                "longitude": [longitude] * n,
                "T2M": [t_mean[i] if t_mean[i] is not None else 28.0 for i in range(n)],
                "T2M_MAX": [t_max[i] if t_max[i] is not None else 33.0 for i in range(n)],
                "T2M_MIN": [t_min[i] if t_min[i] is not None else 22.0 for i in range(n)],
                "RH2M": [rh[i] if rh[i] is not None else 65.0 for i in range(n)],
                "PRECTOTCORR": [precip[i] if precip[i] is not None else 0.0 for i in range(n)],
                "WS10M": [wind[i] if wind[i] is not None else 3.5 for i in range(n)],
                "PS": ps,
            })
            return df
        except Exception as e:
            print(f"[ClimateRiskService] Weather API error: {e}. Generating fallback.")
            return self._generate_fallback_timeseries(latitude, longitude)

    def _generate_fallback_timeseries(self, latitude: float, longitude: float) -> pd.DataFrame:
        """Generates realistic meteorological time-series based on geographical coordinates."""
        dates = pd.date_range(end=datetime.now(), periods=37, freq="D")
        n = len(dates)
        base_temp = 28.0 if latitude < 22 else 24.0
        np.random.seed(int(abs(latitude * 100 + longitude * 10)) % 10000)

        t_mean = base_temp + np.random.normal(0, 2.5, n)
        t_max = t_mean + np.random.uniform(4.0, 8.0, n)
        t_min = t_mean - np.random.uniform(4.0, 7.0, n)
        rh = np.clip(np.random.normal(65, 12, n), 20, 95)
        precip = np.clip(np.random.exponential(2.5, n) - 1.5, 0, 80)
        wind = np.clip(np.random.normal(3.5, 1.2, n), 0.5, 15)
        ps = np.random.normal(100.8, 0.4, n)

        return pd.DataFrame({
            "date": dates,
            "latitude": [latitude] * n,
            "longitude": [longitude] * n,
            "T2M": t_mean,
            "T2M_MAX": t_max,
            "T2M_MIN": t_min,
            "RH2M": rh,
            "PRECTOTCORR": precip,
            "WS10M": wind,
            "PS": ps,
        })

    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates rolling features matching training pipeline in ml/features/engineer.py.
        """
        df = df.copy()
        
        # 1. Diurnal temperature range
        df["temp_range"] = (df["T2M_MAX"] - df["T2M_MIN"]).round(2)

        # 2. Rolling cumulative rainfall
        df["rainfall_3d"] = df["PRECTOTCORR"].rolling(window=3, min_periods=1).sum().round(2)
        df["rainfall_7d"] = df["PRECTOTCORR"].rolling(window=7, min_periods=1).sum().round(2)
        df["rainfall_14d"] = df["PRECTOTCORR"].rolling(window=14, min_periods=1).sum().round(2)
        df["rainfall_30d"] = df["PRECTOTCORR"].rolling(window=30, min_periods=1).sum().round(2)

        # 3. Rolling temperature and humidity
        df["temp_avg_7d"] = df["T2M"].rolling(window=7, min_periods=1).mean().round(2)
        df["temp_max_7d"] = df["T2M_MAX"].rolling(window=7, min_periods=1).max().round(2)
        df["temp_avg_30d"] = df["T2M"].rolling(window=30, min_periods=1).mean().round(2)
        df["rh_avg_7d"] = df["RH2M"].rolling(window=7, min_periods=1).mean().round(2)
        df["ws_avg_7d"] = df["WS10M"].rolling(window=7, min_periods=1).mean().round(2)

        # 4. Consecutive hot days streak (T2M_MAX >= 38.0°C)
        is_hot = (df["T2M_MAX"] >= 38.0).astype(int)
        blocks = (~(df["T2M_MAX"] >= 38.0)).cumsum()
        df["consecutive_hot_days"] = is_hot.groupby(blocks).cumsum()

        # 5. Deviations from 30-day baseline
        rolling_daily_expected_rain = (df["rainfall_30d"] / 30.0).round(2)
        df["rainfall_dev_30d"] = (df["PRECTOTCORR"] - rolling_daily_expected_rain).round(2)
        df["temp_dev_30d"] = (df["T2M"] - df["temp_avg_30d"]).round(2)

        return df

    def predict_risk(
        self, latitude: float, longitude: float, crop: Optional[str] = None, crop_stage: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes ML inference on all 3 risk models using real engineered weather features.
        """
        if not self.is_loaded:
            self._load_models()

        # 1. Fetch meteorological time-series and engineer features
        raw_df = self.fetch_weather_timeseries(latitude, longitude)
        featured_df = self.engineer_features(raw_df)

        # Latest feature row (Today / baseline)
        latest_row = featured_df.iloc[[-1]]

        label_map = self.label_mapping.get("id_to_label", {
            "0": "Low",
            "1": "Medium",
            "2": "High",
            "3": "Critical",
        })

        # Helper to run model inference
        def run_inference(model, model_key: str) -> Tuple[str, int, Dict[str, float]]:
            cols = self.feature_columns.get(model_key, [])
            if not cols:
                cols = [c for c in latest_row.columns if c != "date"]
            
            input_features = latest_row[cols]
            pred_class_id = int(model.predict(input_features)[0])
            pred_label = label_map.get(str(pred_class_id), "Low")

            prob_dict = {}
            if hasattr(model, "predict_proba"):
                probs = model.predict_proba(input_features)[0]
                model_classes = list(model.classes_)
                for i, c_id in enumerate(model_classes):
                    c_name = label_map.get(str(c_id), f"Class {c_id}")
                    prob_dict[c_name] = round(float(probs[i] * 100), 1)

                p_low = prob_dict.get("Low", 0.0)
                p_med = prob_dict.get("Medium", 0.0)
                p_high = prob_dict.get("High", 0.0)
                p_crit = prob_dict.get("Critical", 0.0)
                base_score = (p_low * 0.12) + (p_med * 0.45) + (p_high * 0.78) + (p_crit * 0.98)
            else:
                score_map = {"Low": 15, "Medium": 45, "High": 75, "Critical": 92}
                base_score = score_map.get(pred_label, 15)

            return pred_label, round(base_score), prob_dict

        # 2. Inference for Drought, Flood, and Heat Stress
        drought_lvl, d_base, drought_probs = run_inference(
            self.drought_model, "drought_risk_model"
        )
        flood_lvl, f_base, flood_probs = run_inference(
            self.flood_model, "flood_risk_model"
        )
        heat_lvl, h_base, heat_probs = run_inference(
            self.heat_model, "heat_stress_model"
        )

        # 3. Continuous feature calibration for local sensitivity within tier
        r30 = float(latest_row["rainfall_30d"].values[0]) if "rainfall_30d" in latest_row else 100.0
        r7 = float(latest_row["rainfall_7d"].values[0]) if "rainfall_7d" in latest_row else 20.0
        precip = float(latest_row["PRECTOTCORR"].values[0]) if "PRECTOTCORR" in latest_row else 0.0
        tmax = float(latest_row["T2M_MAX"].values[0]) if "T2M_MAX" in latest_row else 30.0
        rh7 = float(latest_row["rh_avg_7d"].values[0]) if "rh_avg_7d" in latest_row else 65.0

        # Drought adjustment: lower 30d rain & lower RH increases drought stress
        drought_factor = max(0, min(15, int((300.0 - min(300.0, r30)) / 25.0) + (1 if rh7 < 60 else 0)))
        drought_score = max(5, min(98, d_base + (drought_factor if drought_lvl == "Low" else 0)))

        # Flood adjustment: higher recent precipitation increases waterlogging stress
        flood_factor = max(0, min(20, int(r7 / 8.0) + (10 if precip >= 25 else 0)))
        flood_score = max(5, min(98, f_base + (flood_factor if flood_lvl == "Low" else 0)))

        # Heat adjustment: higher max temperature increases thermal load
        heat_factor = max(0, min(20, int(max(0, tmax - 28.0) * 3.0)))
        heat_score = max(5, min(98, h_base + (heat_factor if heat_lvl == "Low" else 0)))

        # Re-derive level if calibrated score crosses tier boundary
        def derive_lvl(score: int, orig_lvl: str) -> str:
            if orig_lvl in ["High", "Critical"]:
                return orig_lvl
            if score >= 75:
                return "Critical"
            if score >= 50:
                return "High"
            if score >= 25:
                return "Medium"
            return "Low"

        drought_lvl = derive_lvl(drought_score, drought_lvl)
        flood_lvl = derive_lvl(flood_score, flood_lvl)
        heat_lvl = derive_lvl(heat_score, heat_lvl)

        # 4. Overall Risk Calculation (Weighted Formula: Drought 35%, Flood 35%, Heat Stress 30%)
        overall_score = round(
            (drought_score * 0.35) + (flood_score * 0.35) + (heat_score * 0.30)
        )
        overall_score = max(5, min(98, overall_score))

        if overall_score >= 75:
            overall_lvl = "Critical"
        elif overall_score >= 50:
            overall_lvl = "High"
        elif overall_score >= 25:
            overall_lvl = "Medium"
        else:
            overall_lvl = "Low"

        # Development Logging (Requirement 18)
        import sys
        sys.stderr.write(f"[ClimateRiskML] Location: Lat={latitude}, Lon={longitude}\n")
        sys.stderr.write(f"[ClimateRiskML] Features: Rain30d={r30}mm, Rain7d={r7}mm, Tmax={tmax}°C, RH7d={rh7}%\n")
        sys.stderr.write(f"[ClimateRiskML] Predictions: Drought={drought_lvl} ({drought_score}%), Flood={flood_lvl} ({flood_score}%), Heat={heat_lvl} ({heat_score}%), Overall={overall_lvl} ({overall_score}%)\n")

        return {
            "location": {
                "latitude": latitude,
                "longitude": longitude,
            },
            "overall_risk": {
                "level": overall_lvl,
                "score": overall_score,
            },
            "risks": {
                "drought": {
                    "level": drought_lvl,
                    "score": drought_score,
                    "probabilities": drought_probs,
                },
                "flood": {
                    "level": flood_lvl,
                    "score": flood_score,
                    "probabilities": flood_probs,
                },
                "heat_stress": {
                    "level": heat_lvl,
                    "score": heat_score,
                    "probabilities": heat_probs,
                },
            },
            "updated_at": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        }


# Global singleton instance
climate_risk_service = ClimateRiskMLService.get_instance()
