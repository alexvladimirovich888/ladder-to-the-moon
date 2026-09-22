import * as THREE from "three";

interface CraterTextureOptions {
  size?: number;
  base: string;
  shadow: string;
  highlight: string;
  craterCount?: number;
}

/**
 * Procedurally paints a cratered rock/moon surface onto a canvas so the
 * scene has zero dependency on external texture downloads.
 */
export function createCraterTexture({
  size = 512,
  base,
  shadow,
  highlight,
  craterCount = 90,
}: CraterTextureOptions): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < craterCount; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * size * 0.05 + size * 0.006;

    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, shadow);
    grad.addColorStop(0.7, shadow);
    grad.addColorStop(1, base);
    ctx.globalAlpha = 0.5 + Math.random() * 0.3;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = highlight;
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.05;
  for (let i = 0; i < size * 2; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? highlight : shadow;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Procedurally paints a realistic Earth-like surface: oceans, continents,
 * clouds and polar ice caps, mapped equirectangularly onto a sphere.
 */
export function createEarthTexture(size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext("2d")!;

  // Ocean base with subtle depth gradient.
  const ocean = ctx.createLinearGradient(0, 0, 0, h);
  ocean.addColorStop(0, "#0d3a66");
  ocean.addColorStop(0.5, "#12507f");
  ocean.addColorStop(1, "#0a2f57");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, w, h);

  const landColors = ["#3d6b35", "#4f7a3d", "#6f8a4a", "#8a7a4f", "#5c6e3a"];

  const drawBlob = (cx: number, cy: number, radius: number, color: string, alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    const lobes = 6 + Math.floor(Math.random() * 4);
    ctx.beginPath();
    for (let i = 0; i <= lobes; i++) {
      const angle = (i / lobes) * Math.PI * 2;
      const r = radius * (0.6 + Math.random() * 0.6);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r * 0.7;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  // Continents kept away from extreme poles so ice caps read clearly.
  const continentSeeds = 9;
  for (let i = 0; i < continentSeeds; i++) {
    const cx = Math.random() * w;
    const cy = h * 0.18 + Math.random() * h * 0.64;
    const radius = w * (0.05 + Math.random() * 0.09);
    const color = landColors[Math.floor(Math.random() * landColors.length)];
    drawBlob(cx, cy, radius, color, 0.9);

    // Scatter smaller islands around the main landmass.
    const islands = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < islands; j++) {
      drawBlob(
        cx + (Math.random() - 0.5) * radius * 2.4,
        cy + (Math.random() - 0.5) * radius * 1.6,
        radius * (0.2 + Math.random() * 0.25),
        color,
        0.85
      );
    }
  }
  ctx.globalAlpha = 1;

  // Polar ice caps.
  const poleGradTop = ctx.createLinearGradient(0, 0, 0, h * 0.16);
  poleGradTop.addColorStop(0, "rgba(240,248,255,0.95)");
  poleGradTop.addColorStop(1, "rgba(240,248,255,0)");
  ctx.fillStyle = poleGradTop;
  ctx.fillRect(0, 0, w, h * 0.16);

  const poleGradBottom = ctx.createLinearGradient(0, h * 0.84, 0, h);
  poleGradBottom.addColorStop(0, "rgba(240,248,255,0)");
  poleGradBottom.addColorStop(1, "rgba(240,248,255,0.95)");
  ctx.fillStyle = poleGradBottom;
  ctx.fillRect(0, h * 0.84, w, h * 0.16);

  // Soft cloud swirls.
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 26; i++) {
    const cx = Math.random() * w;
    const cy = Math.random() * h;
    const rx = w * (0.03 + Math.random() * 0.05);
    const ry = rx * 0.35;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function createNebulaTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, size, size);
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0, "rgba(110,130,200,0.35)");
  grad.addColorStop(0.4, "rgba(80,90,160,0.18)");
  grad.addColorStop(1, "rgba(10,10,20,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
