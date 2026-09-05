# Crop Recommendation ML API (FastAPI)

Production-ready REST API for serving the trained Random Forest Crop Recommendation model.

---

## Features

- **Framework**: FastAPI + Uvicorn
- **Validation**: Strict Pydantic model validation
- **Endpoints**:
  - `GET /health`: Service and model health status
  - `POST /predict`: Generate top 3 crop recommendations with probability percentages
  - `GET /docs`: Interactive Swagger UI documentation
- **CORS**: Fully configured to connect with Next.js frontend

---

## Installation & Running

### 1. Install Dependencies

```bash
cd api
pip install -r requirements.txt
```

### 2. Start the Server

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

or simply:

```bash
python app.py
```

The API will be available at: `http://localhost:8000`

---

## API Reference

### Health Check

```http
GET /health
```

**Response (200 OK):**

```json
{
  "status": "ok",
  "model_loaded": true
}
```

---

### Crop Prediction

```http
POST /predict
Content-Type: application/json
```

**Request Body:**

```json
{
  "nitrogen": 80,
  "phosphorus": 40,
  "potassium": 50,
  "temperature": 28,
  "humidity": 62,
  "ph": 6.8,
  "rainfall": 600
}
```

**Response (200 OK):**

```json
{
  "recommendations": [
    {
      "crop": "Coffee",
      "probability": 49.5
    },
    {
      "crop": "Jute",
      "probability": 15.0
    },
    {
      "crop": "Rice",
      "probability": 13.0
    }
  ]
}
```
