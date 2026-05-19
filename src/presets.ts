import { PresetCondition } from "./types";

export const PRESETS: PresetCondition[] = [
  {
    id: "acne_congested",
    name: "Congested & Acne-Prone",
    subTitle: "Simulator: Active papules on oily base",
    description: "Simulates sebum congestion with scattered red inflammatory blemishes and microcomedones typical of breakout-prone skin.",
    iconName: "Flame",
    skinType: "Oily / Acne-Prone",
    mainConcern: "Acne & Clogged Pores",
    details: "Frequent breakouts on chin, cheeks, and forehead. Excess shine by midday. Looking for gentle spot reduction.",
    colorTheme: {
      bg: "bg-rose-50",
      accent: "#e11d48",
      text: "text-rose-700",
      badge: "bg-rose-100 text-rose-800 border-rose-200"
    },
    drawTexture: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // 1. Draw base oily skin color gradient
      const gradient = ctx.createRadialGradient(width/2, height/2, 10, width/2, height/2, width * 0.8);
      gradient.addColorStop(0, "#ffe4e6"); // soft oily peach
      gradient.addColorStop(1, "#fecdd3"); // rosier edge
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw subtle shiny speckles (sebum reflection)
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = 2 + Math.random() * 4;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw active blemishes (inflammation)
      const spotCoordinates = [
        { x: width * 0.25, y: height * 0.3, r: 14 },
        { x: width * 0.7, y: height * 0.25, r: 12 },
        { x: width * 0.5, y: height * 0.55, r: 18 },
        { x: width * 0.4, y: height * 0.75, r: 9 },
        { x: width * 0.75, y: height * 0.7, r: 15 }
      ];

      spotCoordinates.forEach(spot => {
        // Red halo (erythema)
        const radialGrad = ctx.createRadialGradient(spot.x, spot.y, 1, spot.x, spot.y, spot.r);
        radialGrad.addColorStop(0, "rgba(225, 29, 72, 1)");
        radialGrad.addColorStop(0.4, "rgba(244, 63, 94, 0.8)");
        radialGrad.addColorStop(1, "rgba(244, 63, 94, 0)");
        
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
        ctx.fill();

        // White/yellow pustular center
        ctx.fillStyle = "#fffbeb";
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(spot.x, spot.y, 2.5 + Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // 4. Draw tiny closed microcomedones (blackheads/whiteheads)
      ctx.fillStyle = "#1e293b"; // dark dark gray for blackheads
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        // Avoid clustering too close to active blemishes for contrast
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  {
    id: "dry_dehydrated",
    name: "Dry & Flaky Barrier",
    subTitle: "Simulator: Fine lines and surface flakiness",
    description: "Simulates severe skin dehydration marked by pale tone, horizontal fine lines, and microscopic scaling/flaking textures.",
    iconName: "Droplet",
    skinType: "Dehydrated / Dry",
    mainConcern: "Dryness & Dullness",
    details: "Skin feels tight and itchy, especially in cold weather. Noticeable white scaling flakes around nose and mouth, dull complexion.",
    colorTheme: {
      bg: "bg-amber-50",
      accent: "#d97706",
      text: "text-amber-800",
      badge: "bg-amber-100 text-amber-900 border-amber-200"
    },
    drawTexture: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // 1. Dry, pale beige base
      ctx.fillStyle = "#fdf6e2";
      ctx.fillRect(0, 0, width, height);

      // 2. Add dry patchy pink irritation fields
      ctx.fillStyle = "rgba(248, 113, 113, 0.15)";
      for (let i = 0; i < 4; i++) {
        const x = width * (0.2 + Math.random() * 0.6);
        const y = height * (0.2 + Math.random() * 0.6);
        const rx = 30 + Math.random() * 50;
        const ry = 15 + Math.random() * 30;
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw fine dry micro-cracks
      ctx.strokeStyle = "rgba(139, 92, 26, 0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 18; i++) {
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(
          startX + (Math.random() - 0.5) * 40, startY + 15,
          startX + (Math.random() - 0.5) * 40, startY + 30,
          startX + (Math.random() - 0.5) * 80, startY + 50
        );
        ctx.stroke();
      }

      // 4. White flakiness indicators
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.strokeStyle = "rgba(229, 231, 235, 0.6)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 3 + Math.random() * 5;
        ctx.beginPath();
        // Tiny triangle representing skin scale
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y - size / 2);
        ctx.lineTo(x + size / 2, y + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
  },
  {
    id: "hyperpigmentation",
    name: "Symmetric Hyperpigmentation",
    subTitle: "Simulator: Solar freckling & UV spots",
    description: "Simulates clustered irregular melanin deposits resembling melasma patches and chronic sun freckling.",
    iconName: "Sun",
    skinType: "Normal to Combination",
    mainConcern: "Dark Spots & Pigmentation",
    details: "Mottled brownish patches on cheekbones and forehead. Dark spots worsen during summer. Seeking active brightening regime.",
    colorTheme: {
      bg: "bg-orange-50",
      accent: "#c2410c",
      text: "text-orange-800",
      badge: "bg-orange-100 text-orange-900 border-orange-200"
    },
    drawTexture: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // 1. Warm honey skin tone base
      ctx.fillStyle = "#f5d0a9";
      ctx.fillRect(0, 0, width, height);

      // 2. Draw irregular mottled dark spots (Melasma simulation)
      const spotsInfo = [
        { x: width * 0.35, y: height * 0.4, rx: 45, ry: 25, ang: 0.2 },
        { x: width * 0.65, y: height * 0.45, rx: 50, ry: 30, ang: -0.15 },
        { x: width * 0.5, y: height * 0.25, rx: 35, ry: 15, ang: 0.05 }
      ];

      spotsInfo.forEach(s => {
        const spotGrad = ctx.createRadialGradient(s.x, s.y, 5, s.x, s.y, Math.max(s.rx, s.ry));
        spotGrad.addColorStop(0, "rgba(115, 60, 20, 0.6)");
        spotGrad.addColorStop(0.5, "rgba(127, 75, 30, 0.35)");
        spotGrad.addColorStop(1, "rgba(127, 75, 30, 0)");

        ctx.fillStyle = spotGrad;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.rx, s.ry, s.ang, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw scattered small sun freckles
      for (let i = 0; i < 45; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = 1 + Math.random() * 3.5;
        // Make color vary slightly
        ctx.fillStyle = Math.random() > 0.4 ? "rgba(102, 51, 15, 0.7)" : "rgba(142, 85, 43, 0.5)";
        ctx.beginPath();
        // Freckles are irregular, so draw overlapping minuscule segments
        ctx.ellipse(x, y, r, r * (0.6 + Math.random() * 0.5), Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  {
    id: "rosacea_erythema",
    name: "Erythema & Rosacea Flush",
    subTitle: "Simulator: Vascular capillary network",
    description: "Simulates severe facial flushing with dilated superficial capillaries (telangiectasia) and persistent center redness.",
    iconName: "Sparkles",
    skinType: "Highly Sensitive",
    mainConcern: "Redness & Rosacea symptoms",
    details: "Intense flushing upon hot drinks or stress. Cheeks and nose are persistently pink with tiny visible spider vein patterns.",
    colorTheme: {
      bg: "bg-emerald-50",
      accent: "#0d9488",
      text: "text-emerald-800",
      badge: "bg-emerald-100 text-emerald-900 border-emerald-200"
    },
    drawTexture: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // 1. Fair, delicate skin base
      ctx.fillStyle = "#fff1f2";
      ctx.fillRect(0, 0, width, height);

      // 2. High diffuse center flushing (erythema)
      const centerFlushes = [
        { x: width * 0.5, y: height * 0.5, r: 85 },
        { x: width * 0.35, y: height * 0.55, r: 60 },
        { x: width * 0.65, y: height * 0.45, r: 65 }
      ];

      centerFlushes.forEach(f => {
        const flushGrad = ctx.createRadialGradient(f.x, f.y, 5, f.x, f.y, f.r);
        flushGrad.addColorStop(0, "rgba(244, 63, 94, 0.45)"); // healthy blushing rose
        flushGrad.addColorStop(0.4, "rgba(244, 63, 94, 0.25)");
        flushGrad.addColorStop(1, "rgba(244, 63, 94, 0)");
        
        ctx.fillStyle = flushGrad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Spider capillary lines (Telangiectasia simulation)
      ctx.strokeStyle = "rgba(225, 29, 72, 0.65)";
      ctx.lineWidth = 0.85;
      
      const drawCapillaryLine = (startX: number, startY: number, length: number) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        let currX = startX;
        let currY = startY;
        const steps = 4 + Math.floor(Math.random() * 4);
        for (let j = 0; j < steps; j++) {
          currX += (Math.random() * 8 - 4) + (length / steps);
          currY += Math.random() * 10 - 5;
          ctx.lineTo(currX, currY);
        }
        ctx.stroke();
      };

      // Draw spider networks around cheek centers
      for (let i = 0; i < 10; i++) {
        drawCapillaryLine(width * 0.35 + (Math.random() * 30 - 15), height * 0.5 + (Math.random() * 30 - 15), Math.random() * 15 + 10);
        drawCapillaryLine(width * 0.6 + (Math.random() * 30 - 15), height * 0.45 + (Math.random() * 30 - 15), - (Math.random() * 15 + 10));
      }
    }
  }
];
