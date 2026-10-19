// Return only a vertical translation. Scale, rotation and horizontal travel
// stay untouched. Test the real curve against the padded top camera plane.
export function topEdgeOffset(positions, matrix, cameraZ, fov, cursorPadding = 0.75) {
  const slope = Math.tan(fov * Math.PI / 360) * 0.82;
  const m = matrix.elements;
  // Pull the camera-plane transform and constant padding outside the loop.
  const ax = m[1] + slope * m[2];
  const ay = m[5] + slope * m[6];
  const az = m[9] + slope * m[10];
  const bias = m[13] + slope * m[14] - cameraZ * slope + cursorPadding * Math.hypot(1, slope);
  let offset = 0;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i], y = positions[i + 1], z = positions[i + 2];
    offset = Math.max(offset, ax * x + ay * y + az * z + bias);
  }
  return offset;
}
