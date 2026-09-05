"""
Python CLI Bridge for AI Farming Assistant.
Allows direct execution from Next.js serverless route or child_process.execFile.
"""

import sys
import json
import os
import warnings

warnings.filterwarnings("ignore")

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

def run_bridge():
    try:
        from importlib.machinery import SourceFileLoader
        router_path = os.path.join(CURRENT_DIR, "api", "tool_router.py")
        mod = SourceFileLoader("tool_router", router_path).load_module()
        router = mod.AssistantToolRouter.get_instance()

        raw_input = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
        data = json.loads(raw_input) if raw_input.strip() else {}

        session_id = data.get("session_id", "default-session")
        message = data.get("message", "Hello")
        language = data.get("language", "en")
        location = data.get("location", "Bhopal, Madhya Pradesh")
        latitude = float(data.get("latitude", 23.2599))
        longitude = float(data.get("longitude", 77.4126))
        soil = data.get("soil")
        crop = data.get("crop")
        history = data.get("history")

        res = router.process_chat(
            session_id=session_id,
            message=message,
            language=language,
            location=location,
            latitude=latitude,
            longitude=longitude,
            soil=soil,
            crop=crop,
            history=history,
        )

        res["success"] = True
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    run_bridge()
