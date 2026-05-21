# DermaVision AI 🔬

**AI-Powered Skin Intelligence Platform**

A futuristic AI-powered skin analyzer that analyzes skin from a selfie or live camera capture. Medical-grade skin analysis meets premium beauty-tech UI.

![DermaVision AI](https://img.shields.io/badge/DermaVision-AI%20Skin%20Scanner-blue?style=for-the-badge)

## Features

### AI Skin Scanner
- **14+ skin metrics** analyzed from a single selfie
- Acne, dark circles, wrinkles, pores, pigmentation, redness, hydration, oiliness, texture, blackheads, eye bags, sun damage, skin age estimation, stress indicators

### Interactive Face Heatmap
- Zone-by-zone health mapping (forehead, cheeks, nose, chin, under-eyes)
- Color-coded severity indicators (green/yellow/red)

### AI Beauty Score
- Overall skin score (0-100)
- Sub-scores: hydration, acne, glow, aging
- 30-day progress tracking with charts

### AI Skin Coach
- Personalized skincare advice
- Condition-specific routines
- Lifestyle recommendations (sleep, water, diet)
- Interactive chat interface

### Product Recommendations
- Curated product suggestions based on skin type
- Cleansers, serums, moisturizers, sunscreen
- Pricing and ratings included

### Premium Features
- Unlimited deep scans
- Advanced analytics & trends
- Priority dermatologist access
- Real-time AR scanner

## Tech Stack

### Frontend
- **React 19** with Vite
- **Framer Motion** for animations
- **Recharts** for analytics
- **Lucide React** for icons
- **React Router** for navigation
- Mobile-first responsive design
- Glassmorphism dark luxury theme

### Backend
- **FastAPI** (Python)
- **Pillow** + **NumPy** for image analysis
- RESTful API design
- CORS-enabled

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-multipart pillow numpy
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Analyze skin from uploaded image |
| POST | `/api/coach` | Get AI coaching advice |
| GET | `/api/history` | Get progress history data |

## Architecture

```
dermavision-ai/
├── frontend/          # React + Vite frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # React Context (state management)
│       ├── pages/       # App screens
│       └── main.jsx     # Entry point
├── backend/           # FastAPI backend
│   └── main.py        # API server + AI analysis engine
└── README.md
```

## App Screens

1. **Splash** — Animated brand intro
2. **Onboarding** — 4-step feature tour
3. **Scanner** — Camera capture / image upload
4. **Analyzing** — Animated AI pipeline visualization
5. **Results** — Score dashboard + face heatmap + conditions + products
6. **AI Coach** — Chat interface for skin advice
7. **History** — 30-day progress charts + trends
8. **Premium** — Subscription plans
9. **Settings** — Profile, preferences, support

## Design System

- **Theme**: Dark luxury with glassmorphism
- **Colors**: Neon gradients (blue → purple → pink)
- **Typography**: Inter font family
- **Animations**: Framer Motion throughout
- **Layout**: Mobile-first (430px max-width)

## License

MIT
