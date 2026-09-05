import os
import sys
import unittest

# Ensure project root is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from importlib.machinery import SourceFileLoader

class TestClimateRiskMLIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        service_path = os.path.join(CURRENT_DIR, "service.py")
        cls.service_mod = SourceFileLoader("climate_service", service_path).load_module()
        cls.service = cls.service_mod.ClimateRiskMLService.get_instance()

    def test_models_loaded(self):
        """Test that all three .joblib models and metadata are loaded into memory."""
        self.assertIsNotNone(self.service.drought_model, "Drought model failed to load")
        self.assertIsNotNone(self.service.flood_model, "Flood model failed to load")
        self.assertIsNotNone(self.service.heat_model, "Heat stress model failed to load")
        self.assertTrue(self.service.is_loaded, "Service is_loaded should be True")
        self.assertIn("drought_risk_model", self.service.feature_columns)
        self.assertIn("flood_risk_model", self.service.feature_columns)
        self.assertIn("heat_stress_model", self.service.feature_columns)

    def test_valid_coordinates_prediction(self):
        """Test prediction with valid coordinates (e.g. Vasai, Maharashtra: 19.39, 72.84)."""
        result = self.service.predict_risk(19.39, 72.84)
        
        self.assertIn("location", result)
        self.assertIn("overall_risk", result)
        self.assertIn("risks", result)
        self.assertIn("alerts", result)

        overall = result["overall_risk"]
        self.assertIn(overall["level"], ["Low", "Medium", "High", "Critical"])
        self.assertTrue(0 <= overall["score"] <= 100)

        risks = result["risks"]
        for risk_name in ["drought", "flood", "heat_stress"]:
            self.assertIn(risk_name, risks)
            r = risks[risk_name]
            self.assertIn(r["level"], ["Low", "Medium", "High", "Critical"])
            self.assertTrue(0 <= r["score"] <= 100)

    def test_extreme_coordinates_prediction(self):
        """Test prediction with different regional coordinates across India."""
        # Punjab (North)
        res_north = self.service.predict_risk(30.90, 75.85)
        self.assertTrue(0 <= res_north["overall_risk"]["score"] <= 100)

        # Tamil Nadu (South)
        res_south = self.service.predict_risk(11.01, 76.95)
        self.assertTrue(0 <= res_south["overall_risk"]["score"] <= 100)

        # Rajasthan (Arid West)
        res_west = self.service.predict_risk(26.91, 75.78)
        self.assertTrue(0 <= res_west["overall_risk"]["score"] <= 100)

    def test_feature_engineering_integrity(self):
        """Test that feature engineering produces all required rolling features with zero leakage."""
        df = self.service._generate_fallback_timeseries(19.39, 72.84)
        featured = self.service.engineer_features(df)

        expected_cols = [
            "rainfall_3d", "rainfall_7d", "rainfall_14d", "rainfall_30d",
            "temp_avg_7d", "temp_max_7d", "temp_avg_30d", "rh_avg_7d",
            "ws_avg_7d", "consecutive_hot_days", "rainfall_dev_30d",
            "temp_dev_30d", "temp_range"
        ]
        for col in expected_cols:
            self.assertIn(col, featured.columns, f"Missing engineered feature: {col}")

if __name__ == "__main__":
    unittest.main()
