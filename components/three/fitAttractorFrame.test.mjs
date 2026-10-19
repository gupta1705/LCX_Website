import test from "node:test";
import assert from "node:assert/strict";
import { PerspectiveCamera, Vector3 } from "three";
import { ATTRACTOR_RADIUS, fitAttractorFrame } from "./fitAttractorFrame.mjs";

test("the rotating form and cursor displacement fit within all four padded edges", () => {
  for (const [width, height] of [[1920, 920], [1440, 900], [768, 1024], [390, 844], [320, 568], [844, 390]]) {
    const camera = new PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 9.5;
    camera.updateMatrixWorld();
    for (const z of [-0.3, 0, 0.4]) {
      for (const zoom of [1.4, 1.7, 1.9, 2.1, 3]) {
        for (const direction of [-1, 1]) {
          const frame = fitAttractorFrame({ distance: 9.5 - z, fov: 45, aspect: width / height, zoom, x: direction * 2.4, y: direction * 0.5 });
          const radius = ATTRACTOR_RADIUS * frame.scale + frame.cursorRadius;
          // Project the complete enclosing sphere: every rotation and pointer
          // displacement of the actual curve is contained by this envelope.
          for (let i = 0; i < 2000; i++) {
            const sy = 1 - 2 * (i + 0.5) / 2000;
            const ring = Math.sqrt(1 - sy * sy);
            const angle = i * Math.PI * (3 - Math.sqrt(5));
            const point = new Vector3(frame.x + radius * ring * Math.cos(angle), frame.y + radius * sy, z + radius * ring * Math.sin(angle)).project(camera);
            assert.ok(Math.abs(point.x) <= 0.900001, `horizontal crop at ${width}x${height}`);
            assert.ok(Math.abs(point.y) <= 0.840001, `vertical crop at ${width}x${height}`);
          }
        }
      }
    }
  }
});
