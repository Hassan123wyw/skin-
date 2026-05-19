import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Lazily initialize Gemini client to prevent app crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in the Secrets panel in AI Studio Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

// Increase payload limit because we will receive base64 images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Helper to determine if image is base64 and parse it
function parseBase64Image(dataUrl: string) {
  const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }
  return {
    mimeType: matches[1],
    base64Data: matches[2]
  };
}

// REST API for skin analysis
app.post("/api/analyze", async (req, res): Promise<any> => {
  try {
    const { image, skinType, mainConcern, details } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image data" });
    }

    const parsedImage = parseBase64Image(image);
    if (!parsedImage) {
      return res.status(400).json({ error: "Invalid image format. Must be a valid base64 data URL." });
    }

    const ai = getGeminiClient();

    const systemInstruction = 
      "You are a professional Dermatological Wellness Assistant and skincare formulation expert. " +
      "Your objective is to help analyze an image of the user's skin (or a representative sample) and use context " +
      "to identify potential skin conditions, categorize overall skin characteristics, " +
      "and recommend highly customized daily routines and ingredients. " +
      "REMEMBER: Write educational, supportive, and informative insights. Include a strong primary " +
      "and clear professional medical disclaimer stating that this is not a diagnostic tool and that they must " +
      "always consult a board-certified dermatologist for medical concerns.";

    const promptText = 
      `Analyze this skin photo.
      
      Additional User-Reported Context:
      - Self-reported skin type: ${skinType || "Unknown"}
      - Primary focus or concern: ${mainConcern || "General Analysis"}
      - User notes: ${details || "None provided"}
      
      Please return a meticulous skin intelligence report focusing on the visual cues in the image, or general dermatic patterns, and match it to standard skincare wisdom.`;

    const imagePart = {
      inlineData: {
        mimeType: parsedImage.mimeType,
        data: parsedImage.base64Data,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [imagePart, textPart]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "conditionName", 
            "confidence", 
            "severity", 
            "summary", 
            "symptoms", 
            "causes", 
            "routine", 
            "generalTips", 
            "ingredientsToAvoid", 
            "disclaimer"
          ],
          properties: {
            conditionName: {
              type: Type.STRING,
              description: "The name of the likely skin condition or skin classification observed (e.g., Active Acne vulgaris, Dry/Dehydrated Skin Barrier, Hyperpigmentation/Melasma, Mild Rosacea/Redness, Healthy Skin)."
            },
            confidence: {
              type: Type.STRING,
              description: "Confidence level: High / Medium / Low"
            },
            severity: {
              type: Type.STRING,
              description: "Estimated appearance severity: Mild / Moderate / Severe"
            },
            summary: {
              type: Type.STRING,
              description: "A friendly, professional 2-3 sentence overview explaining what is visible and what it typically means."
            },
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of typical visual or tactile indicators corresponding to this observed condition."
            },
            causes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Common biological or environmental triggers for this skin state."
            },
            routine: {
              type: Type.OBJECT,
              required: ["morning", "evening"],
              properties: {
                morning: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["step", "action", "ingredients"],
                    properties: {
                      step: { type: Type.STRING, description: "e.g., Cleanse, Hydrate, Protect" },
                      action: { type: Type.STRING, description: "The specific instruction for this morning step" },
                      ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key active ingredients recommended for this step" }
                    }
                  }
                },
                evening: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["step", "action", "ingredients"],
                    properties: {
                      step: { type: Type.STRING, description: "e.g., Cleanse, Treat, Moisturize" },
                      action: { type: Type.STRING, description: "The specific instruction for this evening step" },
                      ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key active ingredients recommended for this step" }
                    }
                  }
                }
              }
            },
            generalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Skincare lifestyle or habit tips (e.g., pillowcase changes, temperature of wash water, diet/stress)."
            },
            ingredientsToAvoid: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Ingredients, formulations, or habits to avoid for this specific condition."
            },
            disclaimer: {
              type: Type.STRING,
              description: "A clear dermatological disclaimer stating that this AI tool does not diagnose disease or replace real clinical dermatology."
            }
          }
        }
      }
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("Empty response from AI engine");
    }

    const data = JSON.parse(outputText.trim());
    return res.json(data);

  } catch (error: any) {
    console.error("Analysis API Error:", error);
    return res.status(500).json({ 
      error: error.message || "An error occurred during skin analysis. Please check your API configuration or try again." 
    });
  }
});

// Serve static assets or mount Vite middleware depending on environment
async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupFrontend().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully on http://localhost:${PORT}`);
  });
});
