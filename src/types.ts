export interface AnalyzeStep {
  step: string;
  action: string;
  ingredients: string[];
}

export interface SkinAnalysisResult {
  conditionName: string;
  confidence: "High" | "Medium" | "Low" | string;
  severity: "Mild" | "Moderate" | "Severe" | string;
  summary: string;
  symptoms: string[];
  causes: string[];
  routine: {
    morning: AnalyzeStep[];
    evening: AnalyzeStep[];
  };
  generalTips: string[];
  ingredientsToAvoid: string[];
  disclaimer: string;
}

export interface UserContext {
  skinType: string;
  mainConcern: string;
  details: string;
}

export interface PresetCondition {
  id: string;
  name: string;
  subTitle: string;
  description: string;
  iconName: "Flame" | "Droplet" | "Sparkles" | "Sun" | "Sparkle";
  skinType: string;
  mainConcern: string;
  details: string;
  colorTheme: {
    bg: string;
    accent: string;
    text: string;
    badge: string;
  };
  // Function to draw specific texture simulation on Canvas
  drawTexture: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}
