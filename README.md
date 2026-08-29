# 🌾 AgriSmart AI — Smart Agricultural Intelligence & Crop Advisory Platform

An AI-powered agricultural advisory platform and machine learning recommendation engine designed for farmers to optimize crop yields, monitor soil health, and track real-time weather & mandi market analytics.

---

## 📁 Project & Directory Structure

```text
AgriSmart AI/
├── Crop Recommendations_ML/               # 🧠 Machine Learning Engine
│   ├── api/                              # FastAPI Service
│   │   ├── app.py                        # REST API endpoints (/predict, /health)
│   │   ├── requirements.txt              # Python dependencies
│   │   └── README.md                     # ML service guide
│   ├── data/                             # Training Data
│   │   └── Crop_Recommendation.csv       # 22-crop NPK & climate dataset
│   ├── models/                           # Trained Serialized Artifacts
│   │   ├── crop_recommendation_model.joblib # Random Forest Classifier
│   │   └── crop_label_encoder.joblib     # Label encoder for 22 crops
│   └── notebook/                         # Data Science & EDA
│       └── crop_recommendation_eda.ipynb # Model training & evaluation notebook
│
├── public/                               # 🌐 Static Assets & Icons
│   ├── favicon.ico
│   ├── og-image.png
│   └── robots.txt
│
├── src/                                  # ⚡ Next.js App Source
│   ├── app/                              # App Router Pages & Layouts
│   │   ├── (auth)/                       # Authentication Route Group
│   │   │   ├── auth/page.tsx             # Login & Signup with 2-hr session limit
│   │   │   └── reset-password/page.tsx   # Password Recovery
│   │   ├── (dashboard)/                  # Protected Dashboard Routes
│   │   │   ├── layout.tsx                # Dashboard Layout & Location Permission Sync
│   │   │   ├── dashboard/page.tsx        # Farmer Dashboard Overview
│   │   │   ├── crop-recommendation/      # AI Crop Recommendation Engine
│   │   │   ├── crop-intelligence/        # Crop Analytics & Insights
│   │   │   ├── soil-crop-health/         # NPK, pH & Soil Health Tracking
│   │   │   ├── weather-climate/          # 7-Day Forecast & Weather Advisory
│   │   │   ├── farm-planning/            # Seasonal Calendar & Task Management
│   │   │   ├── market-finance/           # Live Mandi Prices & Trends
│   │   │   ├── government-resources/     # Schemes, Subsidies & PM-Kisan
│   │   │   ├── ai-assistant/             # AgriSmart AI Chatbot
│   │   │   ├── profile/                  # Farmer Profile & Farm Settings
│   │   │   └── settings/                 # Account & Preference Settings
│   │   ├── globals.css                   # Tailwind Design Tokens & Typography
│   │   ├── layout.tsx                    # Root Layout & Metadata
│   │   ├── page.tsx                      # Landing Page
│   │   └── providers.tsx                 # Providers (Auth, Theme, Query, Session)
│   │
│   ├── assets/                           # Image Assets & Illustrations
│   │   ├── crop-cotton.jpg
│   │   ├── crop-maize.jpg
│   │   ├── crop-rice.jpg
│   │   ├── crop-sugarcane.jpg
│   │   ├── crop-wheat.jpg
│   │   ├── crops-bg.jpg
│   │   └── hero-bg.jpg
│   │
│   ├── components/                       # Modular UI Components
│   │   ├── crop-recommendation/          # Crop Recommendation UI & Engine
│   │   │   ├── CropRecommendationPage.tsx # Two-column reference layout
│   │   │   ├── recommendation-engine.ts  # ML API client & fallback calculation
│   │   │   ├── types.ts                  # TypeScript interfaces
│   │   │   └── ...                       # Subcomponents
│   │   ├── dashboard/                    # Dashboard shell, header & sidebar
│   │   │   └── shell.tsx                 # Finalized navigation & sidebar
│   │   ├── landing/                      # Landing page sections
│   │   │   ├── crops.tsx                 # 24-crop auto-scrolling showcase
│   │   │   ├── hero.tsx                  # Hero banner & CTA
│   │   │   ├── features.tsx              # Platform features grid
│   │   │   ├── navbar.tsx                # Public top navigation
│   │   │   └── footer.tsx                # Footer & links
│   │   └── ui/                           # Reusable design system components
│   │       ├── button.tsx, card.tsx, dialog.tsx, dropdown-menu.tsx, etc.
│   │
│   └── lib/                              # Core Utilities & Services
│       ├── i18n.tsx                      # English & Hindi translation dictionaries
│       ├── insforge.ts                   # InsForge client (Auth, DB, Storage)
│       ├── location.tsx                  # Location Context & GPS Geolocation
│       ├── session.ts                    # 2-hour Auto-Logout tracking
│       ├── theme.ts                      # Dark/Light mode theme system
│       ├── use-auth.ts                   # Current user & auth hooks
│       └── utils.ts                      # Helper functions (cn / clsx)
│
├── .env                                  # Environment variables
├── components.json                       # shadcn/ui configuration
├── next.config.ts                        # Next.js configuration
├── package.json                          # Node dependencies
└── tsconfig.json                         # TypeScript configuration
```

---

## 🚀 Quick Start Guide

### 1. Frontend Web App (Next.js)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. Python ML Recommendation API (FastAPI)

```bash
# Navigate to ML API folder
cd "Crop Recommendations_ML/api"

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

API Documentation (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
Prediction Endpoint: `POST http://localhost:8000/predict`
