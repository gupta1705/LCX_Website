// Spend pixels on the thin lines, not on supersampling a full-screen backdrop.
// The limit also covers large monitors, where a DPR cap alone is insufficient.
export function scenePixelRatio(width, height, deviceDpr = 1, quality = 1) {
  const pixelBudget = 2_000_000;
  return Math.min(deviceDpr, 1.25, Math.sqrt(pixelBudget / Math.max(1, width * height))) * quality;
}
