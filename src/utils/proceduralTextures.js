import * as THREE from 'three';

let cachedCarbonTexture = null;
let cachedCarbonBump = null;
let cachedBrakeRotorTexture = null;

/**
 * Generates a realistic 2x2 twill carbon fiber weave texture and bump map
 */
export function getCarbonFiberTextures() {
  if (cachedCarbonTexture && cachedCarbonBump) {
    return { map: cachedCarbonTexture, bumpMap: cachedCarbonBump };
  }

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Base dark carbon matrix
  ctx.fillStyle = '#14161b';
  ctx.fillRect(0, 0, size, size);

  const cell = 16;
  for (let y = 0; y < size; y += cell) {
    for (let x = 0; x < size; x += cell) {
      const isAlt = ((x / cell) + (y / cell)) % 2 === 0;

      // Horizontal weave strand
      const gradH = ctx.createLinearGradient(x, y, x + cell, y);
      gradH.addColorStop(0, '#101216');
      gradH.addColorStop(0.5, isAlt ? '#383e4c' : '#232730');
      gradH.addColorStop(1, '#101216');

      ctx.fillStyle = gradH;
      ctx.fillRect(x, y, cell, cell / 2 - 1);

      // Vertical weave strand
      const gradV = ctx.createLinearGradient(x, y + cell / 2, x, y + cell);
      gradV.addColorStop(0, '#0d0f12');
      gradV.addColorStop(0.5, isAlt ? '#252a34' : '#404756');
      gradV.addColorStop(1, '#0d0f12');

      ctx.fillStyle = gradV;
      ctx.fillRect(x, y + cell / 2, cell - 1, cell / 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(28, 28);
  texture.needsUpdate = true;

  const bump = new THREE.CanvasTexture(canvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(28, 28);
  bump.needsUpdate = true;

  cachedCarbonTexture = texture;
  cachedCarbonBump = bump;

  return { map: texture, bumpMap: bump };
}

/**
 * Generates a radial cross-drilled carbon-ceramic brake disc texture
 */
export function getBrakeRotorTexture() {
  if (cachedBrakeRotorTexture) return cachedBrakeRotorTexture;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = '#2a2e35';
  ctx.fillRect(0, 0, size, size);

  // Concentric brushed grooves
  for (let r = 45; r < 120; r += 2) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 4 === 0 ? '#3b4049' : '#23272e';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // Cross-drilled ventilation holes in curved spiral arms
  const numArms = 18;
  for (let i = 0; i < numArms; i++) {
    const baseAngle = (i / numArms) * Math.PI * 2;
    for (let step = 0; step < 4; step++) {
      const radius = 58 + step * 16;
      const angle = baseAngle + step * 0.08;
      const hx = cx + Math.cos(angle) * radius;
      const hy = cy + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(hx, hy, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = '#090a0d';
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  cachedBrakeRotorTexture = texture;
  return texture;
}
