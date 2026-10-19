import test from "node:test";
import assert from "node:assert/strict";
import { Matrix4, Euler, Vector3, Quaternion } from "three";
import { scenePixelRatio } from "./renderBudget.mjs";
import { topEdgeOffset } from "./placeAttractorBelowEdge.mjs";

test("canvas stays within its pixel budget on phones, laptops and 4K displays", () => {
  for (const [w, h, device] of [[390,844,3], [1536,864,1.25], [1920,1080,2], [3840,2160,2]]) {
    const dpr = scenePixelRatio(w,h,device);
    assert.ok(w*h*dpr*dpr <= 2_000_001);
    assert.ok(dpr <= device && dpr <= 1.25);
    assert.ok(Math.abs(scenePixelRatio(w,h,device,0.7) / dpr - 0.7) < 1e-10);
  }
});

test("faster top-edge calculation preserves original framing across poses", () => {
  const positions = Float32Array.from({length:9000*3}, (_,i) => Math.sin(i*0.73)*3.7);
  const slope = Math.tan(45*Math.PI/360)*0.82;
  for (let i=0;i<50;i++) {
    const matrix = new Matrix4().compose(new Vector3(i/10-2,Math.sin(i),0.3), new Quaternion().setFromEuler(new Euler(i*.1,i*.3,i*.05)), new Vector3(1.8,1.8,1.8));
    let expected = 0;
    for (let j=0;j<positions.length;j+=3) {
      const point = new Vector3(positions[j],positions[j+1],positions[j+2]).applyMatrix4(matrix);
      expected = Math.max(expected,point.y-(9.5-point.z)*slope+0.75*Math.hypot(1,slope));
    }
    assert.ok(Math.abs(topEdgeOffset(positions,matrix,9.5,45)-expected)<1e-10);
  }
});
