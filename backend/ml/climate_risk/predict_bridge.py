import sys
import json
import os
import warnings

# Suppress sklearn unpickle warnings
warnings.filterwarnings("ignore")

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

def run_prediction():
    try:
        from importlib.machinery import SourceFileLoader
        service_path = os.path.join(CURRENT_DIR, "api", "service.py")
        mod = SourceFileLoader("service", service_path).load_module()
        service = mod.ClimateRiskMLService.get_instance()

        raw_input = sys.stdin.read() if not sys.argv[1:] else sys.argv[1]
        data = json.loads(raw_input) if raw_input.strip() else {}

        lat = float(data.get("latitude", 19.39))
        lon = float(data.get("longitude", 72.84))
        crop = data.get("crop")
        crop_stage = data.get("crop_stage")

        result = service.predict_risk(lat, lon, crop, crop_stage)
        result["success"] = True
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    run_prediction()
