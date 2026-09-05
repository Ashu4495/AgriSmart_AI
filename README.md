# 🌾 AgriSmart AI — Smart Agricultural Intelligence & Crop Advisory Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-https%3A%2F%2Fagrismartai.insforge.site-168447?style=for-the-badge&logo=vercel)](https://agrismartai.insforge.site/)
[![InsForge BaaS](https://img.shields.io/badge/Backend-InsForge_PostgreSQL-3b82f6?style=for-the-badge)](https://5xs4vbzv.us-east.insforge.app)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js_16_Turbopack-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn_Random_Forest-orange?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org/)
[![AI Assistant](https://img.shields.io/badge/LLM-Meta_LLaMA_3.3_70B-purple?style=for-the-badge)](https://openrouter.ai/)

An end-to-end, production-ready AI and Machine Learning agricultural intelligence platform designed for Indian farmers, agronomists, and agricultural stakeholders. AgriSmart AI combines precision soil analysis, machine learning crop recommendations, real-time meteorological forecasting, live Mandi commodity tracking, leaf disease computer vision diagnosis, and an autonomous multilingual AI agronomist.

---

## 🌐 Live Production Application

- **Live Deployed App:** [https://agrismartai.insforge.site/](https://agrismartai.insforge.site/)
- **InsForge Backend Project:** `AgriSmart AI` (`https://5xs4vbzv.us-east.insforge.app`)
- **Deployment Status:** ✅ Live & Operational

---

## 📑 Table of Contents

1. [Problem Statement & Purpose](#-problem-statement--purpose)
2. [Key Features & How They Work](#-key-features--how-they-work)
   - [1. Crop Intelligence & ML Recommendation](#1-crop-intelligence--ml-recommendation)
   - [2. Weather Intelligence & Climate Risk Ensemble](#2-weather-intelligence--climate-risk-ensemble)
   - [3. Soil Chemistry & Plant Disease Scanner](#3-soil-chemistry--plant-disease-scanner)
   - [4. Live Mandi Market Rates & Financial Analytics](#4-live-mandi-market-rates--financial-analytics)
   - [5. Government Schemes & Subsidies Directory](#5-government-schemes--subsidies-directory)
   - [6. Autonomous AI Agronomist & RAG Assistant](#6-autonomous-ai-agronomist--rag-assistant)
3. [System Architecture](#-system-architecture)
4. [Machine Learning Models & Accuracy](#-machine-learning-models--accuracy)
5. [Database Schema & Data Persistence](#-database-schema--data-persistence)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Local Installation & Setup](#-local-installation--setup)
8. [Environment Variables](#-environment-variables)
9. [Deployment](#-deployment)

---

## 🎯 Problem Statement & Purpose

Indian agriculture faces major challenges that limit smallholder farmer profitability:
- **Suboptimal Crop Selection:** Crops are often planted based on tradition rather than scientific soil chemistry (NPK, pH) and micro-climate parameters.
- **Unpredictable Weather Risks:** Droughts, unseasonal floods, and heat stress damage yields without advance advisory.
- **Delayed Pest & Disease Diagnosis:** Crop infections propagate rapidly before farmers receive expert pathological advice.
- **Information Asymmetry:** Middlemen capture crop value due to lack of transparent, real-time APMC Mandi market rates.
- **Complex Welfare Schemes:** Farmers struggle to find and apply for relevant state and central agricultural subsidies.

**AgriSmart AI** solves these challenges in a unified, mobile-responsive, multilingual interface that turns raw data into actionable agronomic decisions.

---

## 🌟 Key Features & How They Work

### 1. Crop Intelligence & ML Recommendation
- **What It Does:** Analyzes farm soil parameters and environmental conditions to recommend the top most suitable, profitable crops from a catalog of 22 regional crops.
- **How It Works:**
  - **Inputs:** Soil Nitrogen (N), Phosphorus (P), Potassium (K), Soil pH, Temperature (°C), Relative Humidity (%), Rainfall (mm), Land Area (Acres), Season (Kharif / Rabi / Zaid).
  - **ML Engine:** Evaluates inputs through a trained Random Forest Classifier (`crop_recommendation_model.joblib`) with a 99.55% test accuracy.
  - **Economic Analysis:** Automatically computes Expected Yield (q/ha), Market Price (₹/qtl), Total Revenue, Cultivation Cost, and Net Return on Investment (ROI %).
  - **Use Case:** A farmer in Maharashtra with acidic soil (pH 5.8) and high rainfall can determine whether Rice, Jute, or Soybean will yield the highest return before the sowing season starts.

### 2. Weather Intelligence & Climate Risk Ensemble
- **What It Does:** Delivers live micro-climate forecasts, 7-day weather predictions, and predictive climate risk scores for drought, flooding, and heat stress.
- **How It Works:**
  - **Live Weather Data:** Interfaces with Open-Meteo APIs to fetch live temperature, apparent feel, precipitation, wind speed, and humidity based on GPS or selected Indian districts.
  - **Climate ML Ensemble:** Three specialized Random Forest models (`drought_risk_model.joblib`, `flood_risk_model.joblib`, `heat_stress_model.joblib`) score 7-day rolling dry days, temperature anomalies, and precipitation volumes.
  - **Actionable Advisories:** Generates farmer-friendly prevention measures (e.g., "Schedule early morning drip irrigation; avoid applying foliar spray before anticipated rainfall").

### 3. Soil Chemistry & Plant Disease Scanner
- **What It Does:** Provides a computerized plant pathology tool for instant crop disease diagnosis and soil health parameter management.
- **How It Works:**
  - **Image Diagnosis & Storage:** Farmers take or upload leaf photos. Images are stored securely in InsForge Cloud Storage (`scans` bucket) and analyzed for disease symptoms.
  - **Curated Remedies:** Prescribes both **Organic Bio-Cures** (e.g., *Neem Seed Kernel Extract 5%*, *Trichoderma viride*) and **Chemical Treatments** (e.g., *Propiconazole 25% EC*).
  - **Interactive Treatment Tracking:** Allows marking fields as "Treated" or "Pending" with persistent database updates.
  - **Soil Health Test Modal:** Allows manual logging of official Soil Health Card lab results, automatically re-balancing fertilizer dosing recommendations.

### 4. Live Mandi Market Rates & Financial Analytics
- **What It Does:** Displays real-time wholesale APMC Mandi prices across 24 key agricultural commodities across all major Indian states.
- **How It Works:**
  - Aggregates live market data (Arrivals, Min Price, Max Price, Modal Price ₹/Quintal, State Trends).
  - Provides interactive **30-Day Price Trend Sparklines** with dynamic hover tooltips.
  - Highlights highest-paying Mandi hubs to assist farmers in timing their crop sales.

### 5. Government Schemes & Subsidies Directory
- **What It Does:** A searchable, state-filtered repository of 60 official government schemes, subsidies, insurance, and financial support initiatives.
- **How It Works:**
  - Seeded into InsForge PostgreSQL (`schemes` table) with structured eligibility rules, authority bodies, monetary benefits, and direct application links (e.g., *PM-Kisan Samman Nidhi*, *PM Fasal Bima Yojana*, *Kisan Credit Card*, *Sub-Mission on Agricultural Mechanization*).
  - Instant search by keyword, category (Credit, Insurance, Machinery, Organic Farming), and state.

### 6. Autonomous AI Agronomist & RAG Assistant
- **What It Does:** A 24/7 conversational agricultural expert supporting English, Hindi, and regional dialects with text and voice output.
- **How It Works:**
  - **LLM Gateway:** Powered by InsForge AI Model Gateway using `meta-llama/llama-3.3-70b-instruct:free`.
  - **Retrieval-Augmented Generation (RAG):** Context is augmented with local scheme data, crop agronomy knowledge bases, and user farm profiles.
  - **Autonomous Tool Calling:**
    - `weather_tool`: Queries real-time weather for the user's location.
    - `market_pricing_tool`: Queries live Mandi rates for requested crops.
    - `fertilizer_calculator_tool`: Computes exact Urea, DAP, and MOP kilograms based on NPK deficiency.
  - **Speech Synthesis:** Farmers can listen to voice readouts of recommendations.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                         CLIENT APPLICATION                             │
│       Next.js 16 (Turbopack) • React 19 • Tailwind CSS • Lucide UI     │
│   Landing Page • Dashboard • Crop Intel • Soil/Disease • AI Chatbot    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / REST / WebSockets
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS BACKEND ROUTERS                         │
│  /api/v1/crops/recommend       •  /api/v1/weather/climate-risk         │
│  /api/v1/assistant/chat (RAG)  •  /api/v1/market/prices                │
│  /api/v1/schemes               •  /api/v1/dashboard                    │
└──────────────┬───────────────────┬───────────────────┬─────────────────┘
               │                   │                   │
               ▼                   ▼                   ▼
┌────────────────────────┐┌──────────────────┐┌──────────────────────────┐
│ INSFORGE BaaS PLATFORM ││  ML PREDICTION   ││   EXTERNAL APIS & LLM    │
│ • PostgreSQL Database  ││ • Random Forest  ││ • Open-Meteo Weather API │
│ • Auth & User Sessions ││   (22 Crops)     ││ • Data.gov.in Mandi Data │
│ • Storage (`scans`)    ││ • Climate Risk   ││ • OpenRouter LLaMA-3.3   │
│ • 10 RLS Tables        ││   Ensemble       ││   70B Model Gateway      │
└────────────────────────┘└──────────────────┘└──────────────────────────┘
```

---

## 🧠 Machine Learning Models & Accuracy

| Model Name | Type | Target Output | Accuracy / Metric |
| :--- | :--- | :--- | :--- |
| **Crop Recommendation Model** | Random Forest Classifier | 22 Crops (Rice, Maize, Cotton, Wheat, Jute, etc.) | **99.55% Accuracy** |
| **Drought Risk Model** | Random Forest Regressor | Drought Risk Score (0–100) | $R^2 = 0.942$ |
| **Flood Risk Model** | Random Forest Regressor | Flood Risk Score (0–100) | $R^2 = 0.928$ |
| **Heat Stress Model** | Random Forest Regressor | Heat Stress Score (0–100) | $R^2 = 0.951$ |

---

## 🗄️ Database Schema & Data Persistence

The backend utilizes **InsForge PostgreSQL** with strict Row-Level Security (RLS):

1. `farm_profiles`: Stores farmer metadata (full name, phone, state, district, village, farm acreage, soil type, irrigation source).
2. `soil_readings`: Historic soil test parameters (N, P, K, pH, organic carbon, source).
3. `disease_scans`: Scanned leaf images (`url`), identified pathogen, severity, organic & chemical cures, `treated` flag.
4. `schemes`: 60 official government schemes with structured JSON eligibility criteria.
5. `crop_recommendations`: Historic recommendation logs with confidence scores.
6. `market_price_cache`: Cached Mandi price feeds.
7. `notifications`: Farmer advisories and alert triggers.
8. `chat_messages`: Conversational history with the AI Assistant.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/crops/recommend` | Runs ML crop recommendation & profitability analysis |
| `GET` | `/api/v1/weather/current` | Fetches live Open-Meteo current meteorological conditions |
| `GET` | `/api/v1/weather/forecast` | Returns 7-day detailed weather forecast |
| `GET` | `/api/v1/weather/climate-risk` | Runs ML Climate Risk Ensemble (Drought, Flood, Heat Stress) |
| `GET` | `/api/v1/market/prices` | Returns live Mandi prices across 24 commodities |
| `GET` | `/api/v1/schemes` | Returns 60 official government welfare schemes with search/filter |
| `POST` | `/api/v1/assistant/chat` | Autonomous AI Assistant with Tool Calling & RAG search |
| `GET` | `/api/v1/dashboard` | Aggregated farmer overview (Profile, Weather, Soil, Tasks) |

---

## 💻 Local Installation & Setup

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **Python**: 3.10+ (for local ML execution / FastAPI)
- **InsForge CLI**: `npx insforge`

### 1. Clone the Repository
```bash
git clone https://github.com/Ashu4495/AgriSmart_AI.git
cd AgriSmart_AI
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Setup Python ML Environment (Optional for local training)
```bash
# For Crop Recommendation
cd backend/ml/crop_recommendation
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate
pip install -r api/requirements.txt
cd ../../..

# For Climate Risk
cd backend/ml/climate_risk
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate
pip install -r requirements.txt
cd ../../..
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your keys:
```bash
cp .env.example .env.local
```

### 5. Seed Government Schemes Data
```bash
node scripts/seed-data.mjs
```

### 6. Run Next.js Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_INSFORGE_URL` | InsForge BaaS API Base URL | `https://5xs4vbzv.us-east.insforge.app` |
| `NEXT_PUBLIC_INSFORGE_KEY` | InsForge Public Anon Key | `ik_...` |
| `OPENROUTER_API_KEY` | OpenRouter / InsForge AI Gateway Key | `sk-or-v1-...` |
| `NEXT_PUBLIC_ML_API_URL` | Local FastAPI ML URL (Optional) | `http://localhost:8000` |
| `DATA_GOV_API_KEY` | Data.gov.in Mandi API Key (Optional) | `579b...` |

---

## 🚀 Deployment

The project is preconfigured for zero-friction deployment to **InsForge**:

```bash
# Build verification
npm run build

# Deploy to InsForge
npx insforge deployments deploy .
```

---

