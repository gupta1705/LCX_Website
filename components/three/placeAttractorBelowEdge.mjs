// Return only a vertical translation. Scale, rotation and horizontal travel
// stay untouched. Test the real curve against the padded top camera plane.
export function topEdgeOffset(positions, matrix, cameraZ, fov, cursorPadding = 0.75) {
  const slope = Math.tan(fov * Math.PI / 360) * 0.82;
  const m = matrix.elements;
  let offset = 0;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i], y = positions[i + 1], z = positions[i + 2];
    const worldY = m[1] * x + m[5] * y + m[9] * z + m[13];
    const worldZ = m[2] * x + m[6] * y + m[10] * z + m[14];
    offset = Math.max(offset, worldY - (cameraZ - worldZ) * slope + cursorPadding * Math.hypot(1, slope));
  }
  return offset;
}
