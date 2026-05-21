from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import io
import random
import math
from datetime import datetime, timedelta

app = FastAPI(title="DermaVision AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SKIN_CONDITIONS = [
    "acne", "dark_circles", "wrinkles", "pores", "pigmentation",
    "redness", "hydration", "oiliness", "texture", "blackheads",
    "eye_bags", "sun_damage", "skin_age", "stress_indicators"
]

FACE_REGIONS = ["forehead", "left_cheek", "right_cheek", "nose", "chin", "under_eyes"]


def analyze_image_pixels(image_bytes: bytes) -> dict:
    """Analyze image pixel data to generate deterministic skin metrics."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_resized = img.resize((64, 64))
    pixels = np.array(img_resized, dtype=np.float64)

    avg_r = float(np.mean(pixels[:, :, 0]))
    avg_g = float(np.mean(pixels[:, :, 1]))
    avg_b = float(np.mean(pixels[:, :, 2]))
    brightness = (avg_r + avg_g + avg_b) / 3.0
    contrast = float(np.std(pixels))

    redness_ratio = avg_r / max(avg_g, 1)
    warmth = (avg_r - avg_b) / 255.0

    seed = int(avg_r * 1000 + avg_g * 100 + avg_b * 10 + contrast) % (2**31)
    rng = random.Random(seed)

    def score(base, variance=15):
        return max(0, min(100, int(base + rng.gauss(0, variance))))

    hydration_base = 50 + (brightness - 128) * 0.3
    oiliness_base = 40 + warmth * 30
    acne_base = 30 + redness_ratio * 10 + rng.gauss(0, 10)
    texture_base = 60 + (contrast - 50) * 0.2
    pore_base = 45 + contrast * 0.15

    conditions = {
        "acne": {"severity": score(100 - acne_base, 10), "confidence": round(0.75 + rng.random() * 0.2, 2)},
        "dark_circles": {"severity": score(35 + (255 - brightness) * 0.15, 12), "confidence": round(0.7 + rng.random() * 0.25, 2)},
        "wrinkles": {"severity": score(25 + contrast * 0.2, 10), "confidence": round(0.8 + rng.random() * 0.15, 2)},
        "pores": {"severity": score(pore_base, 12), "confidence": round(0.7 + rng.random() * 0.2, 2)},
        "pigmentation": {"severity": score(30 + abs(warmth) * 40, 10), "confidence": round(0.75 + rng.random() * 0.2, 2)},
        "redness": {"severity": score(20 + (redness_ratio - 1) * 50, 12), "confidence": round(0.8 + rng.random() * 0.15, 2)},
        "hydration": {"level": score(hydration_base, 10), "confidence": round(0.7 + rng.random() * 0.2, 2)},
        "oiliness": {"level": score(oiliness_base, 10), "confidence": round(0.7 + rng.random() * 0.2, 2)},
        "texture": {"score": score(texture_base, 10), "confidence": round(0.75 + rng.random() * 0.2, 2)},
        "blackheads": {"severity": score(30 + oiliness_base * 0.3, 12), "confidence": round(0.65 + rng.random() * 0.25, 2)},
        "eye_bags": {"severity": score(30 + (255 - brightness) * 0.1, 10), "confidence": round(0.7 + rng.random() * 0.2, 2)},
        "sun_damage": {"severity": score(25 + warmth * 30, 10), "confidence": round(0.7 + rng.random() * 0.25, 2)},
        "skin_age": {"estimated_age": max(16, min(80, int(28 + contrast * 0.15 + rng.gauss(0, 5)))), "confidence": round(0.6 + rng.random() * 0.3, 2)},
        "stress_indicators": {"level": score(40 + (255 - brightness) * 0.15, 12), "confidence": round(0.6 + rng.random() * 0.3, 2)},
    }

    region_health = {}
    for region in FACE_REGIONS:
        region_seed = hash(region) % 100
        base_health = 55 + (brightness - 128) * 0.2 + region_seed * 0.1
        region_health[region] = {
            "health_score": score(base_health, 12),
            "primary_concern": rng.choice(["acne", "pores", "pigmentation", "texture", "redness"]),
            "severity": rng.choice(["mild", "moderate", "severe"]),
        }

    hydration_val = conditions["hydration"]["level"]
    acne_val = 100 - conditions["acne"]["severity"]
    texture_val = conditions["texture"]["score"]
    glow_base = (hydration_val * 0.4 + acne_val * 0.3 + texture_val * 0.3)
    wrinkle_val = 100 - conditions["wrinkles"]["severity"]

    scores = {
        "overall": score(int(glow_base * 0.4 + acne_val * 0.2 + hydration_val * 0.2 + wrinkle_val * 0.2), 5),
        "hydration": hydration_val,
        "acne": acne_val,
        "glow": score(int(glow_base), 8),
        "aging": score(int(wrinkle_val * 0.6 + hydration_val * 0.4), 8),
    }

    return {
        "conditions": conditions,
        "face_regions": region_health,
        "scores": scores,
        "skin_type": determine_skin_type(hydration_val, conditions["oiliness"]["level"]),
        "analysis_timestamp": datetime.utcnow().isoformat(),
    }


def determine_skin_type(hydration: int, oiliness: int) -> str:
    if oiliness > 65 and hydration > 50:
        return "oily"
    if oiliness < 35 and hydration < 40:
        return "dry"
    if oiliness > 50 and hydration < 45:
        return "combination"
    if hydration > 60 and 35 <= oiliness <= 55:
        return "normal"
    return "combination"


PRODUCT_DB = {
    "oily": {
        "cleanser": {"name": "CeraVe Foaming Facial Cleanser", "price": "$16.99", "rating": 4.7, "why": "Gentle foaming formula removes excess oil without stripping skin"},
        "serum": {"name": "The Ordinary Niacinamide 10% + Zinc 1%", "price": "$5.90", "rating": 4.5, "why": "Reduces sebum production and minimizes pore appearance"},
        "moisturizer": {"name": "Neutrogena Hydro Boost Water Gel", "price": "$19.99", "rating": 4.6, "why": "Lightweight, oil-free hydration with hyaluronic acid"},
        "sunscreen": {"name": "EltaMD UV Clear SPF 46", "price": "$39.00", "rating": 4.8, "why": "Oil-free, won't clog pores, calms and protects"},
    },
    "dry": {
        "cleanser": {"name": "CeraVe Hydrating Facial Cleanser", "price": "$15.99", "rating": 4.7, "why": "Hydrating formula with ceramides, never strips moisture"},
        "serum": {"name": "The Ordinary Hyaluronic Acid 2% + B5", "price": "$7.90", "rating": 4.4, "why": "Multi-depth hydration that plumps and soothes dry skin"},
        "moisturizer": {"name": "La Roche-Posay Toleriane Double Repair", "price": "$22.99", "rating": 4.7, "why": "Rich ceramide cream that repairs skin barrier"},
        "sunscreen": {"name": "Supergoop Unseen Sunscreen SPF 40", "price": "$38.00", "rating": 4.7, "why": "Weightless, invisible formula that doubles as primer"},
    },
    "combination": {
        "cleanser": {"name": "La Roche-Posay Toleriane Purifying Cleanser", "price": "$15.99", "rating": 4.6, "why": "Balances oily and dry zones without over-drying"},
        "serum": {"name": "Paula's Choice 2% BHA Liquid Exfoliant", "price": "$34.00", "rating": 4.6, "why": "Unclogs pores in oily zones while being gentle on dry areas"},
        "moisturizer": {"name": "Tatcha The Water Cream", "price": "$72.00", "rating": 4.5, "why": "Oil-free moisture that hydrates without heaviness"},
        "sunscreen": {"name": "La Roche-Posay Anthelios Melt-In SPF 60", "price": "$35.99", "rating": 4.7, "why": "Lightweight, fast-absorbing protection for all zones"},
    },
    "normal": {
        "cleanser": {"name": "Fresh Soy Face Cleanser", "price": "$40.00", "rating": 4.6, "why": "Gentle amino acid-based cleanser that maintains balance"},
        "serum": {"name": "Drunk Elephant C-Firma Fresh Day Serum", "price": "$78.00", "rating": 4.4, "why": "Potent vitamin C brightens and protects balanced skin"},
        "moisturizer": {"name": "Kiehl's Ultra Facial Cream", "price": "$35.50", "rating": 4.7, "why": "Lightweight 24-hour hydration that keeps skin balanced"},
        "sunscreen": {"name": "Biore UV Aqua Rich Watery Essence SPF 50", "price": "$15.99", "rating": 4.8, "why": "Ultra-light Japanese sunscreen, feels like water"},
    },
}


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/api/analyze")
async def analyze_skin(file: UploadFile = File(...)):
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        return JSONResponse(status_code=400, content={"error": "File too large (max 10MB)"})

    try:
        analysis = analyze_image_pixels(contents)
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid image: {str(e)}"})

    skin_type = analysis["skin_type"]
    products = PRODUCT_DB.get(skin_type, PRODUCT_DB["combination"])
    analysis["recommendations"] = products

    return analysis


@app.post("/api/coach")
async def skin_coach(data: dict):
    concern = data.get("concern", "general")
    skin_type = data.get("skin_type", "combination")
    severity = data.get("severity", "moderate")

    advice = generate_coach_advice(concern, skin_type, severity)
    return {"advice": advice, "concern": concern}


def generate_coach_advice(concern: str, skin_type: str, severity: str) -> dict:
    advice_db = {
        "acne": {
            "explanation": "Acne occurs when hair follicles become clogged with oil and dead skin cells. Bacteria can then cause inflammation, leading to pimples, blackheads, and cysts.",
            "causes": ["Excess sebum production", "Hormonal fluctuations", "Bacteria (C. acnes)", "Stress", "Diet high in refined sugars"],
            "routine": [
                "Morning: Gentle cleanser → Niacinamide serum → Oil-free moisturizer → SPF 30+",
                "Evening: Double cleanse (oil + water) → BHA/Salicylic acid → Retinoid (3x/week) → Barrier cream",
                "Weekly: Clay mask (1x) + Gentle chemical exfoliation (2x)",
            ],
            "tips": ["Don't pick or squeeze — causes scarring", "Change pillowcase every 2-3 days", "Clean phone screen daily", "Reduce dairy and sugar intake"],
            "lifestyle": {"sleep": "7-9 hours in a cool, dark room", "water": "2.5-3L daily minimum", "diet": "Increase omega-3, zinc, and vitamin A foods"},
        },
        "dark_circles": {
            "explanation": "Dark circles are caused by thin skin under the eyes revealing blood vessels, along with pigmentation, fluid retention, and loss of collagen with age.",
            "causes": ["Genetics", "Sleep deprivation", "Dehydration", "Allergies", "Screen fatigue", "Iron deficiency"],
            "routine": [
                "Morning: Caffeine eye cream → Vitamin C serum → SPF around eyes",
                "Evening: Gentle eye makeup remover → Retinol eye cream → Hydrating eye mask (2x/week)",
            ],
            "tips": ["Sleep with head slightly elevated", "Use cold compress for 5 min each morning", "Wear blue-light glasses when using screens"],
            "lifestyle": {"sleep": "8+ hours, consistent schedule", "water": "3L daily", "diet": "Iron-rich foods: spinach, lentils, red meat"},
        },
        "wrinkles": {
            "explanation": "Wrinkles form as collagen and elastin production decreases with age. UV exposure, smoking, and dehydration accelerate this process.",
            "causes": ["Natural aging", "UV damage", "Repeated facial expressions", "Dehydration", "Smoking", "Poor nutrition"],
            "routine": [
                "Morning: Vitamin C serum → Peptide moisturizer → SPF 50",
                "Evening: Gentle cleanser → Retinol (start low) → Hyaluronic acid → Rich night cream",
            ],
            "tips": ["SPF is #1 anti-aging product", "Never skip sunscreen, even indoors", "Consider professional treatments: microneedling, laser"],
            "lifestyle": {"sleep": "7-9 hours on silk pillowcase", "water": "2.5L+ daily", "diet": "Antioxidant-rich: berries, green tea, dark chocolate"},
        },
        "general": {
            "explanation": "Your skin is your largest organ and reflects your overall health. A consistent skincare routine, healthy lifestyle, and sun protection are the foundation of great skin.",
            "causes": ["Environmental factors", "Genetics", "Lifestyle choices", "Hormones", "Stress"],
            "routine": [
                "Morning: Cleanser → Antioxidant serum → Moisturizer → SPF 30+",
                "Evening: Double cleanse → Treatment (retinol/AHA) → Moisturizer",
                "Weekly: Exfoliation (1-2x) + Hydrating mask (1x)",
            ],
            "tips": ["Consistency beats intensity", "Introduce one new product at a time", "Patch test everything", "Less is more — don't over-treat"],
            "lifestyle": {"sleep": "7-9 hours", "water": "2.5L daily", "diet": "Balanced: fruits, vegetables, lean protein, healthy fats"},
        },
    }

    return advice_db.get(concern, advice_db["general"])


@app.get("/api/history")
async def get_history():
    """Generate sample history data for demo purposes."""
    history = []
    base_date = datetime.utcnow()
    base_scores = {"overall": 62, "hydration": 55, "acne": 58, "glow": 50, "aging": 65}

    for i in range(30):
        date = base_date - timedelta(days=29 - i)
        improvement = i * 0.8
        day_scores = {
            k: min(100, int(v + improvement + random.Random(i + hash(k)).gauss(0, 3)))
            for k, v in base_scores.items()
        }
        history.append({"date": date.strftime("%Y-%m-%d"), "scores": day_scores})

    return {"history": history}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
