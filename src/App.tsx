import React, { useState, useEffect, useRef } from "react";
import { 
  Flame, 
  Droplet, 
  Sparkle, 
  Sun, 
  Camera, 
  Upload, 
  Info, 
  AlertCircle, 
  RefreshCw, 
  Check, 
  ShieldAlert, 
  Moon, 
  Sparkles, 
  ChevronRight, 
  Activity,
  Award,
  BookOpen,
  X,
  FileText
} from "lucide-react";
import { PRESETS } from "./presets";
import { SkinAnalysisResult, UserContext } from "./types";

const IconMap = {
  Flame: Flame,
  Droplet: Droplet,
  Sparkle: Sparkle,
  Sun: Sun,
  Sparkles: Sparkles
};

export default function App() {
  // Navigation tabs (UI aesthetics and guides)
  const [activeTab, setActiveTab] = useState<"analysis" | "ingredients" | "help">("analysis");
  
  // Custom User Inputs & State
  const [selectedPresetId, setSelectedPresetId] = useState<string>("acne_congested");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Self-reported factors initializing with acne_congested defaults
  const [skinType, setSkinType] = useState("Oily / Acne-Prone");
  const [mainConcern, setMainConcern] = useState("Acne & Clogged Pores");
  const [customDetails, setCustomDetails] = useState(
    "Frequent breakouts on chin, cheeks, and forehead. Excess shine by midday. Looking for gentle spot reduction."
  );

  // Active status values for Scanner HUD
  const [sensorDepth, setSensorDepth] = useState(0.42);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusText, setScanStatusText] = useState("SYSTEM_STANDBY_092");

  // Analysis result states
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals / Guides details
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize input fields when changing presets
  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    setUploadedImage(null); // Clear custom upload
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSkinType(preset.skinType);
      setMainConcern(preset.mainConcern);
      setCustomDetails(preset.details);
    }
  };

  // Render the current skin condition (from preset or custom upload) onto Canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (uploadedImage) {
      // Draw uploaded custom photo
      const img = new Image();
      img.onload = () => {
        // Source aspect ratio fitting
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio); // fill canvas
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        ctx.drawImage(
          img, 
          0, 0, img.width, img.height,
          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
        );

        // Apply a warm medical skin-analyzer hue overlay
        ctx.fillStyle = "rgba(166, 143, 123, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };
      img.src = uploadedImage;
    } else {
      // Draw preset simulated textures
      const preset = PRESETS.find(p => p.id === selectedPresetId);
      if (preset) {
        preset.drawTexture(ctx, canvas.width, canvas.height);
      }
    }
  };

  // Re-draw canvas whenever preset, uploaded state or active scanning overlays change
  useEffect(() => {
    drawCanvas();
  }, [selectedPresetId, uploadedImage]);

  // Handle sensor depth noise to look highly reactive and dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      if (isScanning) {
        // Faster fluctuation during scanning
        setSensorDepth(prev => +(prev + (Math.random() * 0.06 - 0.03)).toFixed(2));
      } else {
        setSensorDepth(prev => {
          const delta = Math.random() * 0.02 - 0.01;
          const target = 0.42;
          // Keep it close to target 0.42
          const next = prev + delta;
          return +(Math.abs(next - target) > 0.1 ? target : next).toFixed(2);
        });
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [isScanning]);

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please provide an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedImage(event.target.result as string);
        setSelectedPresetId(""); // Clear preset active status
      }
    };
    reader.readAsDataURL(file);
  };

  // Form handle upload via button
  const handleFileUploadBtn = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Trigger scanning sequence and call Gemini API
  const startSkinAnalysis = async () => {
    if (isScanning || isLoading) return;
    
    setErrorMsg(null);
    setIsScanning(true);
    setScanProgress(5);
    setScanStatusText("INITIAL_GRID_LOCK");

    // Phase 1: Interactive Client side analysis sweep simulation
    const steps = [
      { progress: 15, text: "SURFACE_TEXTURE_GRID_REF" },
      { progress: 35, text: "EPIDERMAL_BARRIER_MEASUREMENT" },
      { progress: 55, text: "MELANIN_DENSITY_ESTIMATE" },
      { progress: 75, text: "MAPPING_INFLAMMATORY_SITES" },
      { progress: 95, text: "FORMULATING_DERM_REGIMEN" }
    ];

    let stepIndex = 0;
    const progressTimer = setInterval(() => {
      if (stepIndex < steps.length) {
        setScanProgress(steps[stepIndex].progress);
        setScanStatusText(steps[stepIndex].text);
        stepIndex++;
      } else {
        clearInterval(progressTimer);
        // Call backend API on 100%
        triggerBackendApiCall();
      }
    }, 450);
  };

  const triggerBackendApiCall = async () => {
    setIsLoading(true);
    try {
      // Extract data URL base64 from current Canvas state
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error("Analysis viewport is unmounted");
      }

      const imgDataUrl = canvas.toDataURL("image/jpeg", 0.9);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imgDataUrl,
          skinType,
          mainConcern,
          details: customDetails
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error status ${response.status}`);
      }

      const parsedData: SkinAnalysisResult = await response.json();
      setResult(parsedData);
      setScanStatusText("SCAN_COMPLETE_SECURE_05");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during medical scanning.");
      
      // Load fallback mock analytics for offline-mode / missing API keys demo
      loadSophisticatedMockResult();
    } finally {
      setIsScanning(false);
      setIsLoading(false);
      setScanProgress(0);
    }
  };

  // Fallback high-fidelity dataset if the API keys are not supplied yet
  const loadSophisticatedMockResult = () => {
    let mockResult: SkinAnalysisResult;

    if (selectedPresetId === "dry_dehydrated") {
      mockResult = {
        conditionName: "Dry & Dehydrated Barrier Deficit",
        confidence: "Medium (Offline Fallback)",
        severity: "Moderate Appearance",
        summary: "Visual detection indicates horizontal micro-crinkles and small flaky clusters typical of extreme moisture loss. The epidermal cell organization shows a disrupted moisture retention cycle.",
        symptoms: [
          "Microscopic white surface desquamation",
          "Loss of elastic tensile bounce",
          "Horizontal dehydration creasing across cheekbones"
        ],
        causes: [
          "Dehydrated air and dry internal heating conditions",
          "Over-exfoliation removing critical barrier ceramides",
          "Inadequate occlusive lipid layer formulation"
        ],
        routine: {
          morning: [
            { step: "Cleanse", action: "Wash only with lukewarm water or a non-foaming cream cleanser.", ingredients: ["Glycerin", "Panthenol"] },
            { step: "Hydrate", action: "Apply multiple thin layers of hydrating serum to wet skin.", ingredients: ["Beta-Glucan", "Hyaluronic Acid"] },
            { step: "Protect", action: "Secure with a lipid-rich cream and a comforting SPF 50.", ingredients: ["Squalane", "Zinc Oxide"] }
          ],
          evening: [
            { step: "Double Cleanse", action: "Remove environmental pollutants with a soothing oat cleansing balm.", ingredients: ["Oat Kernel Extract"] },
            { step: "Repair", action: "Massage a comprehensive ceramide repair concentrate into dry zones.", ingredients: ["Ceramides NP/AP/EOP", "Cholesterol"] },
            { step: "Occlude", action: "Apply a protective night balm layer to prevent transepidermal water loss.", ingredients: ["Allantoin", "Shea Butter"] }
          ]
        },
        generalTips: [
          "Utilize a cool-mist facial humidifier during nighttime resting hours.",
          "Prevent water loss by applying serums immediately within 30 seconds of washing."
        ],
        ingredientsToAvoid: [
          "High-strength Alcohol Denat",
          "Sulfates and aggressive powder clay masks",
          "Salicylic Acid concentration > 1%"
        ],
        disclaimer: "DISCLAIMER: This offline fallback analysis is for educational illustration. AI Engine was unable to reach live services due to missing GEMINI_API_KEY."
      };
    } else if (selectedPresetId === "hyperpigmentation") {
      mockResult = {
        conditionName: "Symmetric Ultraviolet Pigmentation",
        confidence: "High (Offline Fallback)",
        severity: "Mild Melasma Presentation",
        summary: "Melanin cluster mapping shows symmetrical freckling consistent with persistent solar exposure. Melasma or post-inflammatory hyperpigmentation characteristics are present.",
        symptoms: [
          "Scattered brown macules",
          "Mottled dermal pigmentation tones",
          "Symmetrical clustering over nasal bridge and cheek curves"
        ],
        causes: [
          "UV-induced melanocyte hyperactivation",
          "Hormonal signaling surges coupled with sunlight exposure",
          "Post-inflammatory healing cycles"
        ],
        routine: {
          morning: [
            { step: "Cleanse", action: "Gentle balancing gel cleanser to keep pH optimal.", ingredients: ["Amino Acids"] },
            { step: "Prevent", action: "Apply highly potent antioxidant serum to combat free radicals.", ingredients: ["Vitamin C / L-Ascorbic Acid", "Ferulic Acid"] },
            { step: "Block", action: "Reapply broad-spectrum zinc oxide mineral SPF 50 every 3 hours.", ingredients: ["Zinc Oxide", "Niacinamide"] }
          ],
          evening: [
            { step: "Cleanse", action: "Deep clarifying botanical cream wash.", ingredients: ["Licorice Root Extract"] },
            { step: "Brighten", action: "Apply target spot correction formula directly to brown zones.", ingredients: ["Tranexamic Acid", "Kojic Acid", "Alpha Arbutin"] },
            { step: "Renew", action: "Layer with lightweight non-comedogenic squalane moisturizer.", ingredients: ["Squalane", "Vitamin E"] }
          ]
        },
        generalTips: [
          "Wear protective wide-brimmed sunhats outdoors even on overcast days.",
          "Avoid manual scrub exfoliators, which stimulate melanocytes via irritation."
        ],
        ingredientsToAvoid: [
          "Unbuffered Glycolic Acid in high sun seasons",
          "Essential Oils with sensitizing limonene",
          "Harsh manual scrubs"
        ],
        disclaimer: "DISCLAIMER: This offline fallback analysis is for educational illustration. AI Engine was unable to reach live services due to missing GEMINI_API_KEY."
      };
    } else if (selectedPresetId === "rosacea_erythema") {
      mockResult = {
        conditionName: "Erythema & Dilated Vascular Flush",
        confidence: "Medium (Offline Fallback)",
        severity: "Mild Rosacea / Capillary Dilation",
        summary: "Vascular mapping reveals concentrated centers of redness on cheek mounds accompanied by fine superficial spider vein dilation patterns. Typical behavior matches sensitive vasomotor flush.",
        symptoms: [
          "Diffused macular red erythema",
          "Warm radiating skin temperature",
          "Fine branch-like superficial capillaries"
        ],
        causes: [
          "Vasomotor instability triggerable by hot foods or stress",
          "Damaged protective skin lipid shield",
          "Microscopic skin mite (Demodex) activity or inflammatory cycles"
        ],
        routine: {
          morning: [
            { step: "Cleanse", action: "Cleanse with an ultra-gentle milk cleanser without washcloth friction.", ingredients: ["Centella Asiatica / Cica", "Allantoin"] },
            { step: "Soothe", action: "Pat on a comforting green tea extract redness-reducing water gel.", ingredients: ["Green Tea Poly-Phenols", "Beta-Glucan"] },
            { step: "Protect", action: "Apply titanium dioxide physical block SPF to limit thermal heating.", ingredients: ["Titanium Dioxide", "Bisabolol"] }
          ],
          evening: [
            { step: "Cleanse", action: "Repeat ultra-gentle milk cleanse using cool water.", ingredients: ["Cica"] },
            { step: "Treat", action: "Apply targeted azelaic acid emulsion to active flushed surfaces.", ingredients: ["Azelaic Acid 10%", "Niacinamide 2%"] },
            { step: "Restructure", action: "Lock skin environment with lipid barrier rebuilding lotion.", ingredients: ["Madecassoside", "Colloidal Oatmeal"] }
          ]
        },
        generalTips: [
          "Avoid hot water showers on the face; wash only with cool or tepid water.",
          "Restrict spicy foods, caffeine, and red wine triggers."
        ],
        ingredientsToAvoid: [
          "Menthol, Eucalyptus, Camphor cooling triggers",
          "Witch Hazel or drying clay clays",
          "High concentrations of Ascorbic Acid"
        ],
        disclaimer: "DISCLAIMER: This offline fallback analysis is for educational illustration. AI Engine was unable to reach live services due to missing GEMINI_API_KEY."
      };
    } else {
      // default: acne_congested or others
      mockResult = {
        conditionName: "Active Inflammatory Acne Vulgaris",
        confidence: "High (Offline Fallback)",
        severity: "Mild-Moderate Papulopustular",
        summary: "Deep scan matches microcomedones, white sebum heads, and radiating halos of redness. Sebum production indexes indicate overactive follicular ducts causing congestion.",
        symptoms: [
          "Erythematous follicular papules",
          "Elevated lipid sebum production in T-zone",
          "Microcomedones clustered around jaw and forehead segments"
        ],
        causes: [
          "Overproduction of oily sebum driven by androgen cycles",
          "Keratinocyte accumulation blocking hair follicles",
          "Proliferation of Cutibacterium acnes in trapped environments"
        ],
        routine: {
          morning: [
            { step: "Cleanse", action: "Wash using a salicylic acid balancing gel cleanser to dissolve sebum.", ingredients: ["Salicylic Acid 2%", "Zinc PCA"] },
            { step: "Hydrate", action: "Apply non-comedogenic lightweight oil-free hyaluronic acid gel.", ingredients: ["Hyaluronic Acid", "Niacinamide"] },
            { step: "Shield", action: "Apply ultra-matte oil control sunscreen to safeguard healing pores.", ingredients: ["LHA", "Silica", "Broad-spectrum SPF 30"] }
          ],
          evening: [
            { step: "Cleanse", action: "Repeat balancing wash, ensuring 60 seconds of gentle massage.", ingredients: ["Salicylic Acid"] },
            { step: "Accelerate", action: "Spread a thin layer of specialized retinoid to encourage cellular cycle.", ingredients: ["Adapalene 0.1% or Retinol 0.3%"] },
            { step: "Comfort", action: "Hydrate with a calming gel lotion to counteract retinoid flaking.", ingredients: ["Panthenol", "Centella Asiatica"] }
          ]
        },
        generalTips: [
          "Replace sleeping fabric pillowcases twice every week.",
          "Avoid picking or squeezing active blemishes to check post-scars."
        ],
        ingredientsToAvoid: [
          "Heavy Mineral Oil and Coconut oil derivatives",
          "High concentration Isopropyl Myristate",
          "Abrasive physical microbeads"
        ],
        disclaimer: "DISCLAIMER: This offline fallback analysis is for educational illustration. AI Engine was unable to reach live services due to missing GEMINI_API_KEY."
      };
    }

    setResult(mockResult);
    // Add warning banner to inform user how to activate live API
    setErrorMsg("Notice: The live Gemini analyzer is operating in Local Simulation Mode. To experience complete custom photo analysis, configure GEMINI_API_KEY in the AI Studio Settings secrets panel.");
  };

  // Static Ingredients Library definition for matching the "Ingredients" tab
  const INGREDIENTS_DATA = [
    {
      name: "Salicylic Acid (BHA)",
      category: "Acne & Clogged Pores",
      description: "An oil-soluble chemical exfoliant that penetrates deep into hair follicles to dissolve trapped oil and cellular buildup.",
      bestFor: "Oily, congestion-prone, and blemish-prone skin types.",
      howToUse: "Apply 2-3 times per week during evening routine on completely dry skin. Avoid mixing with strong retinoids in the same application.",
      glowUpTip: "Pairs excellent with Niacinamide to offset any relative drying irritation."
    },
    {
      name: "Ceramides (NP/AP/EOP)",
      category: "Dryness & Barrier Deficits",
      description: "Natural polar lipids that comprise 50% of the stratum corneum structure. Vital for moisture lock-in and defense against irritants.",
      bestFor: "Dry, flaky, sensitive, and compromised skin barriers.",
      howToUse: "Daily moisturizer ingredient, suitable for both Morning and Night regimes without restrictions.",
      glowUpTip: "Look for formula ratios combining ceramides with cholesterol and fatty acids for triple synergy."
    },
    {
      name: "Azelaic Acid",
      category: "Redness & Erythema",
      description: "A dicarboxylic acid with outstanding anti-redness and pigment-normalizing qualities. Inhibits tyrosinase and reduces skin warmth.",
      bestFor: "Rosacea-prone, flushed sensitive skin types and post-acne dark marks.",
      howToUse: "Can be used morning or evening as a gentle leave-on serum step.",
      glowUpTip: "Safe for sensitive layers and highly effective when paired with green tea calming agents."
    },
    {
      name: "Tranexamic Acid",
      category: "Pigmentation & Sun Freckles",
      description: "An innovative synthetic amino acid analog that blocks the cellular signaling pathway between keratinocytes and melanocytes.",
      bestFor: "Symmetric dark spots, melasma, and stubborn sun spots.",
      howToUse: "Apply as a treatment serum before moisturizing. Highly stable under sunlight.",
      glowUpTip: "Combine with Vitamin C and Niacinamide to block pigment production from three distinct paths."
    },
    {
      name: "Niacinamide (Vitamin B3)",
      category: "Multi-Correction Alchemist",
      description: "A versatile skin vitamin that reduces sebum, boosts ceramide generation, limits melanin cell transfer, and calms micro-flushing.",
      bestFor: "All skin types, particularly combined skins with multiple needs.",
      howToUse: "Universal application. Highly compatible and stable with almost every skincare active.",
      glowUpTip: "Formulas containing 2% to 5% are highly effective without risking potential surface flush associated with 10% gradients."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#D1D1D1] flex flex-col font-sans select-none antialiased">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-6 md:px-12 border-b border-[#1A1A1A] bg-[#0A0A0B] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#A68F7B] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#A68F7B] rounded-full animate-pulse"></div>
          </div>
          <span className="text-xl tracking-[0.25em] font-light uppercase text-white">Derm.AI</span>
        </div>

        {/* Dynamic Navigation Tabs */}
        <nav className="flex gap-4 md:gap-10 text-[11px] uppercase tracking-[0.18em] font-medium text-[#777777]">
          <button 
            id="nav-analysis"
            onClick={() => setActiveTab("analysis")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 hover:text-white ${
              activeTab === "analysis" ? "text-[#A68F7B] border-[#A68F7B]" : "text-[#777777] border-transparent"
            }`}
          >
            Skin Analysis
          </button>
          <button 
            id="nav-ingredients"
            onClick={() => setActiveTab("ingredients")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 hover:text-white ${
              activeTab === "ingredients" ? "text-[#A68F7B] border-[#A68F7B]" : "text-[#777777] border-transparent"
            }`}
          >
            Ingredients Library
          </button>
          <button 
            id="nav-help"
            onClick={() => setActiveTab("help")}
            className={`cursor-pointer transition-colors pb-1 border-b-2 hover:text-white ${
              activeTab === "help" ? "text-[#A68F7B] border-[#A68F7B]" : "text-[#777777] border-transparent"
            }`}
          >
            Wellness Guide
          </button>
        </nav>

        <button 
          id="btn-quick-guide"
          onClick={() => setActiveTab("help")}
          className="hidden sm:block px-5 py-2 border border-[#222222] text-[10px] uppercase tracking-widest text-[#D1D1D1] hover:border-[#A68F7B] hover:text-white transition-all cursor-pointer"
        >
          Derm Manual
        </button>
      </header>

      {/* Warning/Status Information Bar if there's any important notification */}
      {errorMsg && (
        <div className="bg-[#1A1110] border-b border-rose-950/40 text-rose-200 text-xs px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 max-w-4xl">
            <AlertCircle className="w-4 h-4 text-[#A68F7B] shrink-0" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
          <button 
            onClick={() => setErrorMsg(null)}
            className="text-rose-400 hover:text-rose-100 text-xs uppercase tracking-widest cursor-pointer inline-flex items-center"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Main Body Grid */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
        
        {/* TABS 1: ANALYSIS AND SIMULATION DASHBOARD */}
        {activeTab === "analysis" && (
          <>
            {/* Left Screen: Skin Scanner HUD and Custom Input Setups (60% width) */}
            <div className="w-full lg:w-[58%] p-6 md:p-10 flex flex-col gap-8 justify-between border-b lg:border-b-0 lg:border-r border-[#1a1a1a]">
              
              <div className="flex flex-col gap-6">
                
                {/* Visual Header introduction */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#A68F7B] uppercase tracking-[0.2em] font-bold">Scanning Viewport</span>
                    <h2 className="text-2xl font-serif italic text-white leading-tight">Interactive Epidermal Simulation</h2>
                  </div>
                  <div className="text-[10px] text-[#555555] font-mono tracking-wider">
                    COORD: 45.9221 // SCAN_T_VAL
                  </div>
                </div>

                {/* Simulated Skin Viewport Container */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#222222] bg-[#0d0d0f] flex flex-col justify-between p-6">
                  
                  {/* Subtle skin scanner grid background */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none" 
                    style={{ 
                      backgroundImage: `radial-gradient(ellipse at center, #2a2a2e 0%, #000 100%), 
                                       linear-gradient(rgba(166, 143, 123, 0.05) 1px, transparent 1px), 
                                       linear-gradient(90deg, rgba(166, 143, 123, 0.05) 1px, transparent 1px)`,
                      backgroundSize: '100% 100%, 24px 24px'
                    }} 
                  />

                  {/* Render simulated skin canvas */}
                  <div className="absolute inset-0 z-0 flex items-center justify-center p-3">
                    <canvas 
                      ref={canvasRef} 
                      width={640} 
                      height={360} 
                      className="w-full h-full object-cover rounded-lg overflow-hidden opacity-90 transition-all duration-500"
                    />
                  </div>

                  {/* Laser line effect when actively scanning */}
                  {isScanning && (
                    <div className="absolute left-0 w-full h-1 bg-[#A68F7B] brightness-125 shadow-[0_0_12px_#A68F7B] z-10 animate-[bounce_2.5s_infinite] pointer-events-none" />
                  )}

                  {/* Target scanner HUD ring elements overlays (Visible always, highlights during scanning) */}
                  <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                    <div className={`transition-all duration-700 rounded-full border border-dashed flex items-center justify-center ${
                      isScanning 
                        ? "w-[260px] h-[260px] border-[#A68F7B] animate-spin" 
                        : "w-[180px] h-[180px] border-[#A68F7B]/20"
                    }`}>
                      <div className={`rounded-full border transition-all duration-500 ${
                        isScanning 
                          ? "w-[210px] h-[210px] border-[#e11d48]/50" 
                          : "w-[120px] h-[120px] border-[#A68F7B]/10"
                      }`} />
                    </div>

                    {/* HUD scope corners */}
                    <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-[#A68F7B]/50" />
                    <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-[#A68F7B]/50" />
                    <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-[#A68F7B]/50" />
                    <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-[#A68F7B]/50" />
                  </div>

                  {/* Realtime diagnostic labels on physical canvas */}
                  <div className="relative z-20 flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col gap-1.5 bg-[#0A0A0B]/80 backdrop-blur-md px-3 py-2 border border-[#222222] rounded">
                      <span className="text-[9px] uppercase tracking-widest text-[#A68F7B] font-bold">System Status</span>
                      <span className="text-xs text-white font-mono flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? "bg-[#e11d48] animate-ping" : "bg-emerald-500"}`}></span>
                        {isScanning ? scanStatusText : "READY_DIAGNOSTIC_092"}
                      </span>
                    </div>

                    <div className="text-right flex flex-col gap-1 bg-[#0A0A0B]/80 backdrop-blur-md px-3 py-2 border border-[#222222] rounded">
                      <span className="text-[9px] uppercase tracking-widest text-[#777777]">Scanning Focus</span>
                      <span className="text-xs text-white font-mono font-semibold">
                        {uploadedImage ? "CUSTOM_UPLOAD.JPG" : "VIRTUAL_SIMULATOR"}
                      </span>
                    </div>
                  </div>

                  {/* Bottom labels showing scanning stats */}
                  <div className="relative z-20 flex justify-between items-end pointer-events-none mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-[#777777] uppercase">
                      <span>DEPTH SCALE:</span>
                      <span className="text-white font-semibold font-mono">{sensorDepth}mm</span>
                    </div>

                    {isScanning && (
                      <div className="bg-[#A68F7B] text-black text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase animate-pulse">
                        Analyzing Matrix {scanProgress}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Selector for Simulation Presets / Custom Uploads */}
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-[#777777]">1. Select Skin Sample Representation</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESETS.map((p) => {
                      const IconComponent = IconMap[p.iconName as keyof typeof IconMap] || Flame;
                      const isSelected = selectedPresetId === p.id && !uploadedImage;
                      return (
                        <button
                          key={p.id}
                          id={`preset-${p.id}`}
                          onClick={() => handlePresetSelect(p.id)}
                          className={`flex flex-col gap-2 p-3 text-left border rounded-lg cursor-pointer transition-all ${
                            isSelected 
                              ? "border-[#A68F7B] bg-[#121214] shadow-[0_4px_12px_rgba(166,143,123,0.15)]" 
                              : "border-[#1A1A1A] bg-[#09090A] hover:border-[#333333] hover:bg-[#0c0c0e]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <IconComponent className={`w-4 h-4 ${isSelected ? "text-[#A68F7B]" : "text-[#777777]"}`} />
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#A68F7B]" />}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white block truncate">{p.name}</span>
                            <span className="text-[10px] text-[#555555] block truncate mt-0.5">{p.skinType}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Photo Upload Toggle Area */}
                <div className="border border-dashed border-[#222222] bg-[#070708] rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F0F10] border border-[#1A1A1A] flex items-center justify-center">
                      <Camera className="w-4 h-4 text-[#A68F7B]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Analyze Your Own Skin Photo</p>
                      <p className="text-[10px] text-[#777777]">Drag and drop a clear photo or click to upload</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      id="btn-upload-file"
                      onClick={handleFileUploadBtn}
                      className="cursor-pointer text-[10px] uppercase font-bold tracking-widest text-white px-4 py-2 bg-[#141416] border border-[#222222] hover:border-[#A68F7B] hover:text-[#A68F7B] transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
                    >
                      <Upload className="w-3 h-3" />
                      Upload File
                    </button>
                    {uploadedImage && (
                      <button
                        id="btn-clear-upload"
                        onClick={() => handlePresetSelect("acne_congested")}
                        className="cursor-pointer text-[10px] uppercase font-bold tracking-widest text-[#e11d48] px-3 py-2 bg-[#1d1011] border border-[#3a1d1f] hover:bg-rose-950/40 transition-all flex items-center justify-center"
                        title="Remove custom photo and reset to preset"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional Clinical Factors Context form */}
                <div className="flex flex-col gap-4 border-t border-[#1A1A1A] pt-6">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#A68F7B]" />
                    <span className="text-[11px] uppercase tracking-[0.15em] text-[#777777]">2. Personal Skin Context Factors</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#555555] block mb-1.5 font-bold">Self-reported Skin Type</label>
                      <select 
                        id="select-skin-type"
                        value={skinType} 
                        onChange={(e) => setSkinType(e.target.value)}
                        className="w-full bg-[#080809] border border-[#222222] text-xs text-white p-3.5 rounded focus:border-[#A68F7B] focus:outline-none transition-colors"
                      >
                        <option value="Oily / Acne-Prone">Oily / Acne-Prone</option>
                        <option value="Dehydrated / Dry">Dehydrated / Dry Surface</option>
                        <option value="Normal / Balanced">Normal / Balanced Skin Characteristics</option>
                        <option value="Highly Sensitive / Irritated">Highly Sensitive / Irritated Reactivity</option>
                        <option value="Combination Skin">Combination T-Zone Oily / Dryer Cheeks</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#555555] block mb-1.5 font-bold">Primary Dermatic Concern</label>
                      <select 
                        id="select-main-concern"
                        value={mainConcern} 
                        onChange={(e) => setMainConcern(e.target.value)}
                        className="w-full bg-[#080809] border border-[#222222] text-xs text-white p-3.5 rounded focus:border-[#A68F7B] focus:outline-none transition-colors"
                      >
                        <option value="Acne & Clogged Pores">Acne, Comedones & Clogged Pores</option>
                        <option value="Dryness & Dullness">Inflammatory Dryness & Dull Complexion</option>
                        <option value="Dark Spots & Pigmentation">Lentigines or Symmetric Melanin Spots</option>
                        <option value="Redness & Rosacea symptoms">Extensive Redness, Sensitivity, and Rosacea symptoms</option>
                        <option value="Deep Fine Lines & Anti-Aging">Superficial Deep Fine Lines & Texture Wear</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#555555] block mb-1.5 font-bold">Additional Specific Observations or Symptoms</label>
                    <textarea
                      id="textarea-details"
                      value={customDetails}
                      onChange={(e) => setCustomDetails(e.target.value)}
                      rows={2}
                      placeholder="Specify your symptoms like itchiness, flaking, time of breakout, typical allergy triggers..."
                      className="w-full bg-[#080809] border border-[#222222] text-xs text-white p-3 rounded focus:border-[#A68F7B] focus:outline-none transition-colors font-sans leading-relaxed resize-none"
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons at the bottom */}
              <div className="pt-6 border-t border-[#1A1A1A]">
                <button
                  id="btn-start-analysis"
                  disabled={isScanning || isLoading}
                  onClick={startSkinAnalysis}
                  className={`w-full py-4 bg-[#A68F7B] hover:bg-[#BBA491] transition-all text-black text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 cursor-pointer ${
                    isScanning || isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isScanning || isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Running Neural Matrix Scan...
                    </>
                  ) : (
                    <>
                      <Activity className="w-3.5 h-3.5" />
                      Initialize Deep Scan
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right Screen: Highly structured wellness results & recommendations regimen (40% width) */}
            <div className="w-full lg:w-[42%] bg-[#080809] p-6 md:p-10 flex flex-col justify-between">
              
              {!result && !isScanning && !isLoading ? (
                // Initial State empty visual guide
                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
                  <div className="w-14 h-14 rounded-full border border-[#222222] flex items-center justify-center mb-6 bg-[#0B0B0C]">
                    <Award className="w-6 h-6 text-[#A68F7B]" />
                  </div>
                  <h3 className="text-xl font-serif italic text-white mb-3">Diagnostic Ready</h3>
                  <div className="h-px w-12 bg-[#A68F7B] mb-5"></div>
                  <p className="text-xs text-[#777777] leading-relaxed mb-8">
                    Select a simulated skin condition sample or upload an image, adapt your wellness factors, and launch a Deep Scan. Our AI will analyze textures and map custom active ingredients.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-[#0D0D0E] border border-[#1A1A1A] p-4 rounded text-left">
                      <span className="text-[9px] uppercase tracking-widest text-[#A68F7B] font-bold block mb-1">Dermal Neural AI</span>
                      <p className="text-[10px] text-[#555555] leading-normal font-sans">Leveraging high precision multi-modal diagnostic classification frameworks.</p>
                    </div>
                    <div className="bg-[#0D0D0E] border border-[#1A1A1A] p-4 rounded text-left">
                      <span className="text-[9px] uppercase tracking-widest text-[#A68F7B] font-bold block mb-1">Tailored Solutions</span>
                      <p className="text-[10px] text-[#555555] leading-normal font-sans">Providing curated botanical formulation advice and lifestyle modifications.</p>
                    </div>
                  </div>
                </div>
              ) : isScanning || isLoading ? (
                // Scanning placeholder state
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full border border-dashed border-[#A68F7B] animate-[spin_5s_infinite_linear]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-[#A68F7B] animate-spin" />
                    </div>
                  </div>
                  
                  <span className="text-[10px] tracking-widest uppercase text-[#A68F7B] font-bold">Scanning Pulse Active</span>
                  <h3 className="text-2xl font-serif italic text-white mt-2">Dermal Evaluation In Progress</h3>
                  <div className="h-px w-20 bg-[#A68F7B] my-4 mx-auto" />
                  
                  <div className="max-w-xs text-xs text-[#777777] leading-relaxed space-y-3 font-mono">
                    <p className="animate-pulse">Processing image tensors...</p>
                    <p className="text-[10px] text-[#444444]">Analyzing base colors, surface micro-shadows, hydration indexes, and inflammatory capillary branch maps.</p>
                  </div>
                </div>
              ) : (
                // Loaded API / Fallback Response Visual Structure
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] tracking-[0.2em] uppercase text-[#A68F7B] font-bold">Evaluation Report</span>
                        <div className="flex gap-2">
                          <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-900/40">Verified</span>
                        </div>
                      </div>
                      <h1 className="text-3xl font-serif italic text-white mb-2">{result?.conditionName}</h1>
                      <div className="h-px w-20 bg-[#A68F7B] mb-4"></div>
                      <p className="text-[#999] leading-relaxed text-xs font-sans">
                        {result?.summary}
                      </p>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-[#0F0F10] p-4 border border-[#1A1A1A] rounded">
                        <span className="text-[9px] uppercase tracking-widest text-[#777777] block mb-1">Classification Stability</span>
                        <span className="text-xl text-white font-light">{result?.confidence}</span>
                      </div>
                      <div className="bg-[#0F0F10] p-4 border border-[#1A1A1A] rounded">
                        <span className="text-[9px] uppercase tracking-widest text-[#777777] block mb-1">Observed Severity</span>
                        <span className="text-lg text-white font-light leading-tight">{result?.severity}</span>
                      </div>
                    </div>

                    {/* Symptoms & Triggers list tabs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="bg-[#0C0C0D] p-4 border border-[#1A1A1A] rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-[#A68F7B] tracking-wider block mb-3">Diagnostic Indicators</span>
                        <ul className="space-y-2 text-xs text-[#777]">
                          {result?.symptoms.map((sym, idx) => (
                            <li key={idx} className="flex gap-2 items-start text-[11px] leading-normal">
                              <span className="text-[#A68F7B] shrink-0">▪</span>
                              <span>{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-[#0C0C0D] p-4 border border-[#1A1A1A] rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-[#A68F7B] tracking-wider block mb-3">Biological Triggers</span>
                        <ul className="space-y-2 text-xs text-[#77]">
                          {result?.causes.map((cause, idx) => (
                            <li key={idx} className="flex gap-2 items-start text-[11px] leading-normal">
                              <span className="text-[#A68F7B] shrink-0">▪</span>
                              <span>{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Highly curated Morning / Night Skincare Regimen */}
                    <div className="mb-8">
                      <div className="flex items-center gap-1.5 mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-[#A68F7B]" />
                        <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#A68F7B] font-bold">Custom Active Formulation</h3>
                      </div>

                      <div className="space-y-6">
                        {/* Morning */}
                        <div className="bg-[#0B0B0C] border border-[#151516] p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[9px] uppercase font-extrabold tracking-widest bg-amber-950/40 text-amber-500 px-2 py-0.5 border border-amber-900/30">MORN (Morning)</span>
                            <span className="text-[10px] text-[#555]">Active Barrier Defense</span>
                          </div>
                          
                          <div className="space-y-4">
                            {result?.routine.morning.map((m, idx) => (
                              <div key={idx} className="flex gap-3 text-xs">
                                <span className="text-[#A68F7B] font-mono select-none font-bold">0{idx + 1}</span>
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-semibold text-white text-[12px]">{m.step}</span>
                                    {m.ingredients.map((ing, iIdx) => (
                                      <span 
                                        key={iIdx} 
                                        onClick={() => setSelectedIngredient(ing)}
                                        className="text-[9px] px-1.5 py-0.2 bg-[#1A1A1C] text-[#D1D1D1] hover:text-[#A68F7B] hover:border-[#A68F7B]/50 hover:bg-[#1C1714] border border-[#2A2A2D] rounded transition-all cursor-pointer font-sans"
                                      >
                                        {ing}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-[11px] text-[#777] leading-relaxed">{m.action}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Evening */}
                        <div className="bg-[#0B0B0C] border border-[#151516] p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[9px] uppercase font-extrabold tracking-widest bg-indigo-950/40 text-indigo-400 px-2 py-0.5 border border-indigo-900/30">NIGHT (Evening)</span>
                            <span className="text-[10px] text-[#555]">Cellular Turn-over & Repair</span>
                          </div>
                          
                          <div className="space-y-4">
                            {result?.routine.evening.map((e, idx) => (
                              <div key={idx} className="flex gap-3 text-xs">
                                <span className="text-[#A68F7B] font-mono select-none font-bold">0{idx + 1}</span>
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-semibold text-white text-[12px]">{e.step}</span>
                                    {e.ingredients.map((ing, iIdx) => (
                                      <span 
                                        key={iIdx} 
                                        onClick={() => setSelectedIngredient(ing)}
                                        className="text-[9px] px-1.5 py-0.2 bg-[#1A1A1C] text-[#D1D1D1] hover:text-[#A68F7B] hover:border-[#A68F7B]/50 hover:bg-[#1C1714] border border-[#2A2A2D] rounded transition-all cursor-pointer font-sans"
                                      >
                                        {ing}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-[11px] text-[#777] leading-relaxed">{e.action}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Avoid & Lifestyle Column */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-[#e11d48] uppercase tracking-wider block mb-2">Avoid Formulations</span>
                        <ul className="space-y-1.5">
                          {result?.ingredientsToAvoid.map((avoid, index) => (
                            <li key={index} className="flex items-start gap-2 text-[11px] text-[#777] leading-relaxed">
                              <span className="text-[#e11d48] text-xs leading-none shrink-0">&#128308;</span>
                              <span>{avoid}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#A68F7B] uppercase tracking-wider block mb-2">Lifestyle Adjustments</span>
                        <ul className="space-y-1.5">
                          {result?.generalTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-[11px] text-[#777] leading-relaxed">
                              <span className="text-[#A68F7B] text-xs leading-none shrink-0">&#9672;</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>

                  {/* Aesthetic Dermatology Disclaimer container */}
                  <div className="pt-6 border-t border-[#1A1A1A] mt-6">
                    <div className="bg-[#101012] border border-[#1A1A1C] p-3.5 rounded-lg flex items-start gap-3">
                      <ShieldAlert className="w-4 h-4 text-[#A68F7B] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#A68F7B] font-bold block mb-0.5">Dermatological Advisory Note</span>
                        <p className="text-[10px] text-[#555555] leading-relaxed">
                          {result?.disclaimer}
                        </p>
                      </div>
                    </div>

                    <button
                      id="btn-scan-again"
                      onClick={() => {
                        setResult(null);
                        setErrorMsg(null);
                      }}
                      className="cursor-pointer w-full mt-5 py-3.5 border border-[#2B2B2C] hover:border-[#A68F7B] hover:text-white transition-all text-xs font-semibold tracking-wider text-[#A68F7B] uppercase flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Conduct New Dermal Evaluation
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* TABS 2: SKINTYPES & INGREDIENTS DICTIONARY (Active Skincare Library) */}
        {activeTab === "ingredients" && (
          <div className="w-full p-6 md:p-12 flex flex-col gap-8 max-w-6xl mx-auto">
            <div className="border-b border-[#1A1A1A] pb-6">
              <span className="text-[10px] text-[#A68F7B] uppercase tracking-[0.2em] font-bold">Active Science Library</span>
              <h2 className="text-3xl font-serif italic text-white leading-tight mt-1">Symmetrical Active Ingredient Guide</h2>
              <p className="text-xs text-[#777777] leading-relaxed mt-2 max-w-2xl">
                Understand the cellular behavior and chemical mechanics of skin wellness acids, barrier lipids, and botanical agents recommended by our multi-modal neural models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INGREDIENTS_DATA.map((ingredient, index) => (
                <div 
                  key={index} 
                  id={`ingredient-library-${index}`}
                  className="bg-[#080809] border border-[#1A1110] hover:border-[#A68F7B]/50 transition-all p-6 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-[#101012] text-[#A68F7B] font-semibold border border-[#222223] tracking-widest">
                          {ingredient.category}
                        </span>
                        <h4 className="text-lg font-serif italic text-white mt-1.5">{ingredient.name}</h4>
                      </div>
                      <BookOpen className="w-4 h-4 text-[#A68F7B]" />
                    </div>

                    <p className="text-xs text-[#999] leading-relaxed mb-4">{ingredient.description}</p>
                    
                    <div className="space-y-3 font-sans text-xs pt-4 border-t border-[#111112]">
                      <div className="flex gap-2">
                        <span className="text-[#A68F7B] select-none font-semibold uppercase text-[10px] tracking-wider w-24">Optimal For:</span>
                        <span className="text-[#777]">{ingredient.bestFor}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#A68F7B] select-none font-semibold uppercase text-[10px] tracking-wider w-24">Application:</span>
                        <span className="text-[#777]">{ingredient.howToUse}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-[#0E0E10] border border-[#18181A] p-3 rounded text-[11px] italic text-[#777] flex gap-2">
                    <span className="text-[#A68F7B] not-italic font-bold">PRO RECOMMENDATION:</span>
                    <span>{ingredient.glowUpTip}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                id="btn-return-to-analyzer"
                onClick={() => setActiveTab("analysis")}
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-[#A68F7B] hover:bg-[#BBA491] hover:text-black text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-all"
              >
                Go Back to Scanning Center
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TABS 3: WELLNESS GUIDE / MANUAL */}
        {activeTab === "help" && (
          <div className="w-full p-6 md:p-12 flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="border-b border-[#1A1A1A] pb-6">
              <span className="text-[10px] text-[#A68F7B] uppercase tracking-[0.2em] font-bold">Educational Manual</span>
              <h2 className="text-3xl font-serif italic text-white leading-tight mt-1">Dermal Wellness Philosophy</h2>
              <p className="text-xs text-[#777777] leading-relaxed mt-2">
                A professional compass for understanding skin physiology, active compatibility formulas, and safety rules.
              </p>
            </div>

            <div className="space-y-8 text-xs text-[#777] leading-relaxed">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#1A1110] flex items-center justify-center text-[#A68F7B] font-mono select-none font-bold">1</div>
                  <h3 className="text-white text-sm font-semibold uppercase tracking-wider">How to Capture an Optimal Scan Photo</h3>
                </div>
                <p className="pl-8 text-[12px]">
                  For high-quality multi-modal evaluations, use natural overhead skylight or indirect daytime window lighting. Avoid intense computer glare backlights or heavy flash bursts, which reflect sebum false-positives and distort skin tones. Target flat cheek surfaces or local blemish zones.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#1A1110] flex items-center justify-center text-[#A68F7B] font-mono select-none font-bold">2</div>
                  <h3 className="text-white text-sm font-semibold uppercase tracking-wider">Understanding Active Ingredient Inter-Compatibility</h3>
                </div>
                <p className="pl-8 text-[12px]">
                  Avoid layering high-strength exfoliating acids (such as Salicylic Acid or Glycolic Acid) directly side-by-side with high-strength Retinoids inside the same evening step. Doing so strips cellular lipids and initiates extensive micro-flushing flushing response. Instead, cycle actives on alternative evenings.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#1A1110] flex items-center justify-center text-[#A68F7B] font-mono select-none font-bold">3</div>
                  <h3 className="text-white text-sm font-semibold uppercase tracking-wider">The 3 Essential Pillars of Dermal Health</h3>
                </div>
                <div className="pl-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#080809] border border-[#1A1A1A] p-4 rounded text-left">
                    <span className="text-[10px] text-white font-bold block mb-1 uppercase tracking-widest">A. Cleansing</span>
                    <p className="text-[10px] text-[#555] leading-normal font-sans">Purifying dust and environmental particulate matter without disrupting polar intercellular lipids.</p>
                  </div>
                  <div className="bg-[#080809] border border-[#1A1A1A] p-4 rounded text-left">
                    <span className="text-[10px] text-white font-bold block mb-1 uppercase tracking-widest">B. Repair & Seal</span>
                    <p className="text-[10px] text-[#555] leading-normal font-sans">Using bio-identical ceramides and phytosterols to re-establish normal moisture containment networks.</p>
                  </div>
                  <div className="bg-[#080809] border border-[#1A1A1A] p-4 rounded text-left">
                    <span className="text-[10px] text-white font-bold block mb-1 uppercase tracking-widest">C. UV Protection</span>
                    <p className="text-[10px] text-[#555] leading-normal font-sans">Using dense physical mineral shields (zinc/titanium oxides) to block radiation-induced photo-damage paths.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#1a1a1a] flex flex-col items-center justify-center gap-4 text-center">
                <p className="max-w-md text-[11px] text-[#555]">
                  Need personalized advice? Try initiating a simulated deep evaluation profile using the Scan dashboard!
                </p>
                <button
                  id="btn-return-scanning-manual"
                  onClick={() => setActiveTab("analysis")}
                  className="cursor-pointer px-6 py-3 bg-[#131314] hover:bg-[#A68F7B] hover:text-black text-white text-[11px] font-bold uppercase tracking-[0.2em] border border-[#222223] transition-all"
                >
                  Proceed to Live Interactive Scan
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Ingredient Information Popup Modal (Interactive Micro-Guide) */}
      {selectedIngredient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#0D0D0E] border border-[#A68F7B]/40 p-6 md:p-8 rounded-xl max-w-md w-full relative shadow-[0_12px_36px_rgba(0,0,0,0.8)]">
            <button 
              id="btn-close-modal"
              onClick={() => setSelectedIngredient(null)}
              className="absolute top-4 right-4 text-[#777777] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-5">
              <span className="text-[10px] text-[#A68F7B] uppercase tracking-[0.2em] font-bold block">Active Mechanics Details</span>
              <h3 className="text-2xl font-serif italic text-white leading-tight mt-1">{selectedIngredient}</h3>
              <div className="h-px w-12 bg-[#A68F7B] mt-3"></div>
            </div>

            <div className="space-y-4 text-xs text-[#999] leading-relaxed">
              <p>
                As specified by the clinical evaluation matrix, this designated active is integral to target the observed cellular dysfunctions. It serves as a highly biocatalytic component to re-establish localized homeostasis.
              </p>
              
              <div className="bg-[#121214] p-3.5 border border-[#1d1d20] rounded text-emerald-300 text-[11px] italic">
                <span className="text-white font-bold not-italic uppercase text-[9px] tracking-wider block mb-1">Synergy Pairings</span>
                Most bio-compatible when formulated with nourishing lipids and soothing botanical extracts like Centella Asiatica (Cica).
              </div>
            </div>

            <button
              id="btn-dismiss-ingredient-info"
              onClick={() => setSelectedIngredient(null)}
              className="cursor-pointer w-full mt-6 py-3 bg-[#A68F7B] hover:bg-[#BBA491] text-black text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
            >
              Close Detailed Spec
            </button>
          </div>
        </div>
      )}

      {/* Footer Bar */}
      <footer className="h-14 bg-[#050506] border-t border-[#1A1A1A] px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 py-3 sm:py-0 text-[9px] uppercase tracking-[0.2em] text-[#444444]">
        <div className="flex gap-4 md:gap-8 items-center">
          <span>Derm.AI v4.5.0-Sovereign</span>
          <span className="hidden sm:inline-block">/</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Secured Cloud Processing Active
          </span>
        </div>
        <div className="flex gap-4 md:gap-8 text-center">
          <span>Simulation Time: {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span className="text-[#A68F7B]">Double-Encrypted Diagnostic Link</span>
        </div>
      </footer>
    </div>
  );
}
