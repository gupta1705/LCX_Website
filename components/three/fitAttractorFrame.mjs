export const ATTRACTOR_RADIUS = 3.7;

// Fit the enclosing sphere, so every rotation stays inside the canvas.
// The padded frustum also leaves room between the form and the video edge.
export function fitAttractorFrame({ distance, fov, aspect, zoom, x, y }) {
  const tanY = Math.tan((fov * Math.PI) / 360) * 0.84;
  const tanX = Math.tan((fov * Math.PI) / 360) * aspect * 0.9;
  const normX = Math.hypot(1, tanX);
  const normY = Math.hypot(1, tanY);
  const availableRadius = Math.min(distance * tanX / normX, distance * tanY / normY);
  const cursorRadius = Math.min(0.75, availableRadius * 0.18);
  const radius = (availableRadius - cursorRadius) * Math.min(zoom / 2.1, 1);
  const envelope = radius + cursorRadius;
  const limitX = Math.max(0, distance * tanX - envelope * normX);
  const limitY = Math.max(0, distance * tanY - envelope * normY);
  return {
    scale: radius / ATTRACTOR_RADIUS,
    x: Math.max(-limitX, Math.min(x, limitX)),
    y: Math.max(-limitY, Math.min(y, limitY)),
    cursorRadius,
  };
}
