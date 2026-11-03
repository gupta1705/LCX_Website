import test from "node:test";
import assert from "node:assert/strict";
import { createFrameBudget, frameEase, scenePolicy } from "./device-performance.mjs";

const close = (actual, expected, tolerance = 1e-9) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
};

test("unknown or invalid hardware hints retain the normal presentation", () => {
  for (const hints of [undefined, {}, { connection: undefined },
    { deviceMemory: 0, hardwareConcurrency: 0 },
    { deviceMemory: NaN, hardwareConcurrency: Infinity },
    { deviceMemory: -1, hardwareConcurrency: -2 },
    { deviceMemory: 8, hardwareConcurrency: 8 }]) {
    assert.deepEqual(scenePolicy(hints), { mode: "full", fps: 60 });
  }
});

test("explicit data and motion constraints avoid loading the animated scene", () => {
  for (const hints of [
    { reducedMotion: true },
    { connection: { saveData: true } },
    { connection: { effectiveType: "slow-2g" } },
    { connection: { effectiveType: "2g" } },
    { deviceMemory: 1 },
    { deviceMemory: 2, hardwareConcurrency: 2 },
  ]) assert.deepEqual(scenePolicy(hints), { mode: "still", fps: 0 });
});

test("limited hardware lowers frame frequency without discarding the design", () => {
  for (const hints of [
    { deviceMemory: 2 },
    { hardwareConcurrency: 2 },
    { deviceMemory: 4, hardwareConcurrency: 12 },
    { deviceMemory: 8, hardwareConcurrency: 4 },
    { deviceMemory: 2, hardwareConcurrency: 4 },
  ]) assert.deepEqual(scenePolicy(hints), { mode: "light", fps: 30 });
  assert.deepEqual(scenePolicy({ connection: { effectiveType: "3g" } }), { mode: "full", fps: 60 });
});

test("60, 120 and 144 Hz displays all obey the 30 or 60 fps rendering budget", () => {
  for (const refreshRate of [60, 120, 144]) {
    for (const target of [30, 60]) {
      const budget = createFrameBudget(target);
      let draws = 0;
      for (let frame = 0; frame < refreshRate * 10; frame++) {
        budget.advance(1 / refreshRate, true);
        if (budget.draw) draws++;
      }
      assert.ok(Math.abs(draws - target * 10) <= 1,
        `${refreshRate} Hz / ${target} fps rendered ${draws} frames in ten seconds`);
    }
  }
});

test("skipped frames preserve elapsed animation time instead of slowing motion", () => {
  for (const refreshRate of [60, 120, 144]) {
    for (const target of [30, 60]) {
      const budget = createFrameBudget(target);
      let consumed = 0;
      let lastDrawTime = 0;
      for (let frame = 1; frame <= refreshRate * 10; frame++) {
        budget.advance(1 / refreshRate, true);
        if (!budget.draw) continue;
        consumed += budget.delta;
        lastDrawTime = frame / refreshRate;
        close(consumed, lastDrawTime);
      }
      assert.ok(10 - consumed < 1 / target + 1e-9);
    }
  }
});

test("uneven frame arrival preserves elapsed time and does not emit catch-up bursts", () => {
  const budget = createFrameBudget(30);
  const deltas = [0.005, 0.012, 0.021, 0.008, 0.03, 0.017, 0.023, 0.01];
  let elapsed = 0;
  let consumed = 0;
  for (let i = 0; i < 100; i++) {
    const delta = deltas[i % deltas.length];
    elapsed += delta;
    budget.advance(delta, true);
    if (budget.draw) {
      assert.ok(budget.delta > 0 && budget.delta <= 0.1);
      consumed += budget.delta;
      close(consumed, elapsed);
    }
  }
});

test("inactive frames never grant a draw, including the first frame", () => {
  const budget = createFrameBudget(60);
  for (let i = 0; i < 300; i++) {
    budget.advance(1 / 60, false);
    assert.equal(budget.draw, false);
  }
  budget.advance(1 / 60, true);
  assert.equal(budget.draw, true);
  for (const delta of [1 / 144, 1 / 30, 5]) {
    budget.advance(delta, false);
    assert.equal(budget.draw, false, "geometry, particles and GPU rendering must all remain gated");
  }
});

test("returning to view draws immediately without accumulating hidden time", () => {
  const budget = createFrameBudget(30);
  budget.advance(1 / 120, true);
  budget.advance(1 / 120, true); // pending time from a skipped active frame
  assert.equal(budget.draw, false);
  budget.advance(20, false);
  budget.advance(1 / 120, true);
  assert.equal(budget.draw, true);
  close(budget.delta, 1 / 120);
  budget.advance(1 / 120, true);
  assert.equal(budget.draw, false);
});

test("a delayed browser resume has a bounded animation step", () => {
  const budget = createFrameBudget(60);
  budget.advance(1 / 60, true);
  budget.advance(30, true);
  assert.equal(budget.draw, true);
  close(budget.delta, 0.1);
  budget.advance(1 / 60, true);
  assert.equal(budget.draw, true);
  close(budget.delta, 1 / 60);
});

test("time-normalised easing reaches the same pose at 30, 60, 120 and 144 Hz", () => {
  for (const amount of [0.085, 0.095, 0.15]) {
    close(frameEase(amount, 1 / 60), amount);
    close(frameEase(amount, 0), 0);
    const expected = 1 - Math.pow(1 - amount, 60);
    for (const refreshRate of [30, 60, 120, 144]) {
      let position = 0;
      for (let frame = 0; frame < refreshRate; frame++) {
        position += (1 - position) * frameEase(amount, 1 / refreshRate);
      }
      close(position, expected);
    }
  }
});

test("time-normalised easing also stays consistent when driven by gated frames", () => {
  for (const refreshRate of [60, 120, 144]) {
    for (const target of [30, 60]) {
      const budget = createFrameBudget(target);
      let position = 0;
      let time = 0;
      for (let frame = 0; frame < refreshRate; frame++) {
        budget.advance(1 / refreshRate, true);
        if (!budget.draw) continue;
        time += budget.delta;
        position += (1 - position) * frameEase(0.095, budget.delta);
      }
      close(position, 1 - Math.pow(1 - 0.095, time * 60));
    }
  }
});
