from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any


class LocationCoords(BaseModel):
    latitude: float = Field(..., description="Latitude coordinate")
    longitude: float = Field(..., description="Longitude coordinate")


class RiskScore(BaseModel):
    level: str = Field(..., description="Risk classification: Low, Medium, High, Critical")
    score: int = Field(..., description="Risk score between 0 and 100")
    probabilities: Optional[Dict[str, float]] = Field(
        default=None, description="Model predicted probabilities per class"
    )
    dominant_factor: Optional[str] = Field(
        default=None, description="Key driving meteorological factor"
    )


class ClimateRisksBreakdown(BaseModel):
    drought: RiskScore
    flood: RiskScore
    heat_stress: RiskScore


class FarmingAlertItem(BaseModel):
    type: str = Field(..., description="Alert category: Drought, Flood, Heat Stress, General")
    severity: str = Field(..., description="Severity level: Low, Medium, High, Critical")
    message: str = Field(..., description="Actionable advisory message for farmers")


class ClimateRiskResponse(BaseModel):
    location: LocationCoords
    overall_risk: RiskScore
    risks: ClimateRisksBreakdown
    alerts: List[FarmingAlertItem]
    model_source: str = "AgriSmart AI Climate Risk ML Ensemble"
    updated_at: str
