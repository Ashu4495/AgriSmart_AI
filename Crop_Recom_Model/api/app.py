import os
import sys
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Query, status, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Add project root to sys.path so sibling packages import cleanly
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Import Climate Risk ML service
try:
    from importlib.machinery import SourceFileLoader
    climate_service_path = os.path.join(PROJECT_ROOT, "Climate Risk_model", "api", "service.py")
    if os.path.exists(climate_service_path):
        climate_mod = SourceFileLoader("climate_service", climate_service_path).load_module()
        climate_risk_service = climate_mod.ClimateRiskMLService.get_instance()
    else:
        climate_risk_service = None
except Exception as e:
    print(f"[WARNING] Could not load Climate Risk ML service: {e}")
    climate_risk_service = None

# Import Assistant Tool Router
try:
    from .tool_router import assistant_tool_router
except ImportError:
    try:
        from tool_router import assistant_tool_router
    except Exception as e:
        print(f"[WARNING] Could not load assistant tool router: {e}")
        assistant_tool_router = None

# ---------------------------------------------------------------------------
# App initialization & CORS Middleware
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AgriSmart AI Unified ML & Assistant API",
    description="Production FastAPI service serving Random Forest Crop Recommendation, Climate Risk Ensembles, and AI Farming Assistant.",
    version="1.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Crop Recommendation Model & Encoder Loading
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_CANDIDATE_PATHS = [
    os.path.join(BASE_DIR, "..", "models", "crop_recommendation_model.joblib"),
    os.path.join(BASE_DIR, "models", "crop_recommendation_model.joblib"),
    os.path.join(PROJECT_ROOT, "Crop_Recom_Model", "models", "crop_recommendation_model.joblib"),
]

ENCODER_CANDIDATE_PATHS = [
    os.path.join(BASE_DIR, "..", "models", "crop_label_encoder.joblib"),
    os.path.join(BASE_DIR, "models", "crop_label_encoder.joblib"),
    os.path.join(PROJECT_ROOT, "Crop_Recom_Model", "models", "crop_label_encoder.joblib"),
]

crop_model = None
crop_label_encoder = None

for path in MODEL_CANDIDATE_PATHS:
    if os.path.exists(path):
        try:
            crop_model = joblib.load(path)
            print(f"[INFO] Loaded Crop Recommendation model from {path}")
            break
        except Exception as e:
            print(f"[WARNING] Failed loading crop model from {path}: {e}")

for path in ENCODER_CANDIDATE_PATHS:
    if os.path.exists(path):
        try:
            crop_label_encoder = joblib.load(path)
            print(f"[INFO] Loaded Crop Label Encoder from {path}")
            break
        except Exception as e:
            print(f"[WARNING] Failed loading encoder from {path}: {e}")

# ---------------------------------------------------------------------------
# In-Memory Popular Questions Store with Usage Counters
# ---------------------------------------------------------------------------
POPULAR_QUESTIONS_DB = [
    {"id": 1, "text": "Which crop is best for the current season?", "category": "Crop Planning", "count": 284},
    {"id": 2, "text": "How to increase crop yield naturally?", "category": "Yield & Health", "count": 215},
    {"id": 3, "text": "What are the symptoms of nitrogen deficiency?", "category": "Soil & Nutrients", "count": 198},
    {"id": 4, "text": "How to control aphids in vegetables?", "category": "Pest & Disease", "count": 172},
    {"id": 5, "text": "What is the PM-KISAN eligibility criteria?", "category": "Government Schemes", "count": 146},
    {"id": 6, "text": "How much fertilizer is needed for wheat?", "category": "Soil & Nutrients", "count": 139},
]

# ---------------------------------------------------------------------------
# Data Schemas
# ---------------------------------------------------------------------------
class HealthResponse(BaseModel):
    status: str
    crop_model_loaded: bool
    climate_risk_models_loaded: bool
    assistant_loaded: bool
    version: str = "1.2.0"

class CropPredictionRequest(BaseModel):
    nitrogen: float = Field(..., description="Nitrogen content in soil (kg/ha)")
    phosphorus: float = Field(..., description="Phosphorus content in soil (kg/ha)")
    potassium: float = Field(..., description="Potassium content in soil (kg/ha)")
    temperature: float = Field(..., description="Temperature in degree Celsius")
    humidity: float = Field(..., description="Relative humidity in percentage")
    ph: float = Field(..., description="Soil pH value")
    rainfall: float = Field(..., description="Rainfall in mm")

class CropRecommendationItem(BaseModel):
    crop: str
    probability: float

class CropPredictionResponse(BaseModel):
    recommendations: List[CropRecommendationItem]
    all_predictions: List[CropRecommendationItem] = []

class ExtendedCropRecommendationRequest(BaseModel):
    location: str = Field(default="Bhopal, Madhya Pradesh", description="Farm location string")
    latitude: float = Field(default=23.2599, description="Latitude coordinate")
    longitude: float = Field(default=77.4126, description="Longitude coordinate")
    farm_area: float = Field(default=5.0, description="Farm area in acres/hectares")
    nitrogen: float = Field(..., description="Nitrogen content in soil (kg/ha)")
    phosphorus: float = Field(..., description="Phosphorus content in soil (kg/ha)")
    potassium: float = Field(..., description="Potassium content in soil (kg/ha)")
    soil_ph: float = Field(..., description="Soil pH value (0-14)")
    temperature: float = Field(..., description="Temperature in degree Celsius")
    humidity: float = Field(..., description="Relative humidity in percentage")
    rainfall: float = Field(..., description="Rainfall in mm")
    season: str = Field(default="Kharif", description="Crop season (Kharif, Rabi, Zaid)")

class AssistantChatRequest(BaseModel):
    message: str = Field(..., description="Farmer's natural language question")
    session_id: Optional[str] = Field(default="default-session", description="Conversation session ID")
    language: Optional[str] = Field(default="en", description="Language code (en, hi, mr, gu)")
    location: Optional[str] = Field(default="Bhopal, Madhya Pradesh", description="Selected farm location")
    latitude: Optional[float] = Field(default=23.2599, description="Location latitude")
    longitude: Optional[float] = Field(default=77.4126, description="Location longitude")
    soil: Optional[Dict[str, Any]] = Field(default=None, description="Soil parameters (N, P, K, pH, soilType)")
    crop: Optional[str] = Field(default=None, description="Active crop in context")

# ---------------------------------------------------------------------------
# General Routes
# ---------------------------------------------------------------------------
@app.get("/", tags=["General"])
def root():
    return {
        "message": "AgriSmart AI Unified ML & Assistant API is operational",
        "docs": "/docs",
        "health": "/health",
        "crop_model_loaded": crop_model is not None and crop_label_encoder is not None,
        "climate_models_loaded": climate_risk_service is not None and climate_risk_service.is_loaded,
        "assistant_loaded": assistant_tool_router is not None,
    }

@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    return HealthResponse(
        status="ok" if (crop_model is not None and climate_risk_service and climate_risk_service.is_loaded) else "degraded",
        crop_model_loaded=crop_model is not None and crop_label_encoder is not None,
        climate_risk_models_loaded=climate_risk_service is not None and climate_risk_service.is_loaded,
        assistant_loaded=assistant_tool_router is not None,
    )

# ---------------------------------------------------------------------------
# AI Assistant Routes
# ---------------------------------------------------------------------------
@app.post("/api/assistant/chat", tags=["AI Assistant"])
@app.post("/api/v1/assistant/chat", tags=["AI Assistant"])
def assistant_chat(req: AssistantChatRequest):
    if assistant_tool_router is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI Assistant router is currently initializing.",
        )

    try:
        res = assistant_tool_router.process_chat(
            session_id=req.session_id or "default-session",
            message=req.message,
            language=req.language or "en",
            location=req.location or "Bhopal, Madhya Pradesh",
            latitude=req.latitude or 23.2599,
            longitude=req.longitude or 77.4126,
            soil=req.soil,
            crop=req.crop,
        )
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assistant processing error: {str(e)}",
        )

@app.post("/api/assistant/clear", tags=["AI Assistant"])
@app.post("/api/v1/assistant/clear", tags=["AI Assistant"])
def assistant_clear(session_id: str = Query(default="default-session")):
    if assistant_tool_router:
        assistant_tool_router.clear_history(session_id)
    return {"success": True, "message": f"Session {session_id} history cleared"}

@app.get("/api/assistant/popular-questions", tags=["AI Assistant"])
@app.get("/api/v1/assistant/popular-questions", tags=["AI Assistant"])
def get_popular_questions():
    sorted_q = sorted(POPULAR_QUESTIONS_DB, key=lambda x: x["count"], reverse=True)
    return {"success": True, "data": sorted_q[:4]}

@app.post("/api/assistant/popular-questions/increment", tags=["AI Assistant"])
@app.post("/api/v1/assistant/popular-questions/increment", tags=["AI Assistant"])
def increment_question_count(question_id: int = Body(..., embed=True)):
    for q in POPULAR_QUESTIONS_DB:
        if q["id"] == question_id:
            q["count"] += 1
            return {"success": True, "data": q}
    return {"success": False, "error": "Question ID not found"}

@app.get("/api/assistant/insights", tags=["AI Assistant"])
@app.get("/api/v1/assistant/insights", tags=["AI Assistant"])
def get_assistant_insights(
    location: str = Query(default="Bhopal, Madhya Pradesh"),
    latitude: float = Query(default=23.2599),
    longitude: float = Query(default=77.4126),
):
    """Generates location-specific dynamic farm intelligence insight."""
    try:
        w_url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}&longitude={longitude}"
            f"&daily=precipitation_sum,temperature_2m_max&forecast_days=3&timezone=auto"
        )
        req = urllib.request.Request(w_url, headers={"User-Agent": "AgriSmart/1.0"})
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        daily = data.get("daily", {})
        rain_3d = sum(p for p in daily.get("precipitation_sum", [0, 0, 0]) if p is not None)
        tmax = max(t for t in daily.get("temperature_2m_max", [30]) if t is not None)

        if rain_3d > 20:
            title = f"Heavy rainfall ({rain_3d:.1f} mm) expected over the next 3 days in {location}."
            desc = "Clear field drainage channels to prevent waterlogging and postpone chemical spraying."
            link = "/weather-climate"
        elif tmax > 37:
            title = f"High temperature alert ({tmax:.1f}°C) in {location}."
            desc = "Apply light evening irrigation or mulching to protect standing crops against canopy heat stress."
            link = "/weather-climate"
        elif rain_3d < 2:
            title = f"Dry agro-climatic conditions prevailing across {location}."
            desc = "Ideal window for intercultural weeding, soil preparation, and scheduled drip fertigation."
            link = "/soil-crop-health"
        else:
            title = f"Favorable weather conditions prevailing for crop growth in {location}."
            desc = "Continue standard crop scouting and balanced nutrient management."
            link = "/crop-intelligence"

        return {
            "success": True,
            "data": {
                "title": title,
                "description": desc,
                "link": link,
                "location": location,
            }
        }
    except Exception:
        return {
            "success": True,
            "data": {
                "title": f"Favorable weather conditions prevailing for crop growth in {location}.",
                "description": "Continue standard crop scouting and balanced nutrient management.",
                "link": "/weather-climate",
                "location": location,
            }
        }

# ---------------------------------------------------------------------------
# Crop Recommendation Routes
# ---------------------------------------------------------------------------
@app.post("/predict", response_model=CropPredictionResponse, tags=["Crop Recommendation"])
def predict_crops(req: CropPredictionRequest):
    if crop_model is None or crop_label_encoder is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Crop Recommendation Model is not loaded.",
        )

    try:
        input_df = pd.DataFrame([
            {
                "Nitrogen": req.nitrogen,
                "Phosphorus": req.phosphorus,
                "Potassium": req.potassium,
                "Temperature": req.temperature,
                "Humidity": req.humidity,
                "pH_Value": req.ph,
                "Rainfall": req.rainfall,
            }
        ])

        probabilities = crop_model.predict_proba(input_df)[0]
        ranked_indices = np.argsort(probabilities)[::-1]

        all_preds = []
        recommendations = []
        for idx in ranked_indices:
            prob_percent = round(float(probabilities[idx] * 100), 2)
            crop_name = str(crop_label_encoder.inverse_transform([idx])[0])
            item = CropRecommendationItem(crop=crop_name, probability=prob_percent)
            all_preds.append(item)
            if prob_percent > 0 and len(recommendations) < 3:
                recommendations.append(item)

        if not recommendations and len(all_preds) > 0:
            recommendations.append(all_preds[0])

        return CropPredictionResponse(
            recommendations=recommendations,
            all_predictions=all_preds,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}",
        )

@app.post("/api/v1/crops/recommend", response_model=CropPredictionResponse, tags=["Crop Recommendation"])
def recommend_crops_extended(req: ExtendedCropRecommendationRequest):
    return predict_crops(
        CropPredictionRequest(
            nitrogen=req.nitrogen,
            phosphorus=req.phosphorus,
            potassium=req.potassium,
            temperature=req.temperature,
            humidity=req.humidity,
            ph=req.soil_ph,
            rainfall=req.rainfall,
        )
    )

# ---------------------------------------------------------------------------
# Climate Risk ML Routes
# ---------------------------------------------------------------------------
@app.get("/api/climate-risk", tags=["Climate Risk"])
@app.get("/api/v1/weather/climate-risk", tags=["Climate Risk"])
def get_climate_risk(
    latitude: float = Query(default=19.39, description="Latitude of farm location"),
    longitude: float = Query(default=72.84, description="Longitude of farm location"),
    crop: Optional[str] = Query(default=None, description="Optional crop name"),
    crop_stage: Optional[str] = Query(default=None, description="Optional crop growth stage"),
):
    if climate_risk_service is None or not climate_risk_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Climate Risk ML models are currently unavailable.",
        )

    try:
        prediction = climate_risk_service.predict_risk(
            latitude=latitude,
            longitude=longitude,
            crop=crop,
            crop_stage=crop_stage,
        )
        return prediction
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Climate risk inference failure: {str(e)}",
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
