// Hints are optional and deliberately coarse. Unknown hardware keeps the
// normal presentation; only explicit constraints select the still fallback.
export function scenePolicy({ deviceMemory, hardwareConcurrency, connection = {}, reducedMotion = false } = {}) {
  const knownMemory = Number.isFinite(deviceMemory) && deviceMemory > 0;
  const knownCores = Number.isFinite(hardwareConcurrency) && hardwareConcurrency > 0;
  const verySmallDevice = knownMemory && (deviceMemory <= 1 ||
    (deviceMemory <= 2 && knownCores && hardwareConcurrency <= 2));
  if (reducedMotion || connection.saveData || ["slow-2g", "2g"].includes(connection.effectiveType) || verySmallDevice) {
    return { mode: "still", fps: 0 };
  }
  const constrained = (knownMemory && deviceMemory <= 4) || (knownCores && hardwareConcurrency <= 4);
  return constrained ? { mode: "light", fps: 30 } : { mode: "full", fps: 60 };
}

// Shared by geometry, particles and GPU drawing so a skipped frame skips all
// expensive work. Keep elapsed time so 30 Hz motion has the same speed as 60 Hz.
export function createFrameBudget(fps = 60) {
  let elapsed = 0;
  let phase = 0;
  let first = true;
  return {
    draw: false,
    delta: 0,
    advance(delta, active) {
      this.draw = false;
      if (!active) { elapsed = 0; phase = 0; first = true; return; }
      const step = Math.min(Math.max(delta, 0), 0.1);
      elapsed += step;
      phase += step;
      const interval = 1 / fps;
      if (!first && phase + 0.00001 < interval) return;
      this.draw = true;
      this.delta = Math.min(elapsed, 0.1);
      phase = first ? 0 : Math.max(0, phase - interval);
      phase %= interval;
      elapsed = 0;
      first = false;
    },
  };
}

export const frameEase = (amount, delta) => 1 - Math.pow(1 - amount, delta * 60);
