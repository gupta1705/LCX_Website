import test from "node:test";
import assert from "node:assert/strict";
import { bufferedAhead, createHeroVideoController, heroVideoPolicy, HERO_SOURCES } from "./hero-video.mjs";

class FakeTimers {
  now = 0;
  nextId = 0;
  pending = new Map();
  schedule = (callback, delay) => {
    const id = ++this.nextId;
    this.pending.set(id, { callback, due: this.now + delay });
    return id;
  };
  cancel = (id) => { this.pending.delete(id); };
  advance(ms) {
    const end = this.now + ms;
    while (true) {
      const next = [...this.pending].filter(([, task]) => task.due <= end)
        .sort((a, b) => a[1].due - b[1].due)[0];
      if (!next) break;
      const [id, task] = next;
      this.now = task.due;
      this.pending.delete(id);
      task.callback();
    }
    this.now = end;
  }
}

class FakeVideo extends EventTarget {
  src = "";
  preload = "none";
  paused = true;
  currentTime = 0;
  duration = NaN;
  readyState = 0;
  seeking = false;
  ranges = [];
  loads = [];
  playCalls = 0;
  rejection = null;
  get buffered() {
    return { length: this.ranges.length, start: (i) => this.ranges[i][0], end: (i) => this.ranges[i][1] };
  }
  emit(type) { this.dispatchEvent(new Event(type)); }
  load() {
    this.loads.push(this.src);
    this.paused = true;
    this.currentTime = 0;
    this.duration = NaN;
    this.readyState = 0;
    this.ranges = [];
  }
  pause() { this.paused = true; }
  play() {
    this.playCalls++;
    if (this.rejection) return Promise.reject(this.rejection);
    this.paused = false;
    this.emit("playing");
    return Promise.resolve();
  }
  removeAttribute(name) { if (name === "src") this.src = ""; }
  metadata(duration = 109) { this.duration = duration; this.readyState = 1; this.emit("loadedmetadata"); }
  buffer(ranges) { this.ranges = ranges; this.readyState = 3; this.emit("progress"); }
}

function setup(options = {}) {
  const video = new FakeVideo();
  const timers = new FakeTimers();
  const states = [];
  const controller = createHeroVideoController(video, {
    ...options, onState: (state) => states.push(state), schedule: timers.schedule, cancel: timers.cancel,
  });
  return { video, timers, states, controller, last: () => states.at(-1), start() {
    controller.setVisible(true);
    controller.setIntent(true);
  } };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test("source policy selects lightweight media without requiring Network Information support", () => {
  assert.deepEqual(heroVideoPolicy(1440), { profile: "standard", autoplay: true });
  assert.deepEqual(heroVideoPolicy(390), { profile: "light", autoplay: true });
  assert.equal(heroVideoPolicy(1440, { effectiveType: "3g" }).profile, "light");
  assert.equal(heroVideoPolicy(1440, { downlink: 1.5 }).profile, "light");
  assert.equal(heroVideoPolicy(1440, { downlink: 0 }).profile, "standard");
  for (const connection of [{ saveData: true }, { effectiveType: "2g" }, { effectiveType: "slow-2g" }]) {
    assert.deepEqual(heroVideoPolicy(1440, connection), { profile: "light", autoplay: false });
  }
  assert.deepEqual(heroVideoPolicy(1440, {}, true), { profile: "standard", autoplay: false });
});

test("buffer calculation only counts the contiguous range at the playback position", () => {
  const video = new FakeVideo();
  video.currentTime = 4;
  video.ranges = [[0, 2], [4, 9], [11, 20]];
  assert.equal(bufferedAhead(video), 5);
  video.currentTime = 10;
  assert.equal(bufferedAhead(video), 0);
});

test("does not request a video until both visible and wanted", () => {
  const f = setup();
  f.controller.setIntent(true);
  assert.equal(f.video.loads.length, 0);
  f.controller.setIntent(false);
  f.controller.setVisible(true);
  assert.equal(f.video.loads.length, 0);
  f.controller.toggle();
  assert.deepEqual(f.video.loads, [HERO_SOURCES.standard]);
  f.controller.destroy();
});

test("waits for a three-second buffer before playback and after a stall", async () => {
  const f = setup();
  f.start();
  f.video.metadata();
  f.video.buffer([[0, 2.9]]);
  assert.equal(f.video.playCalls, 0);
  assert.equal(f.last().mode, "buffering");
  f.video.buffer([[0, 4]]);
  await settle();
  assert.equal(f.video.playCalls, 1);
  assert.equal(f.last().mode, "playing");
  assert.equal(f.timers.pending.size, 0);
  f.video.currentTime = 4;
  f.video.emit("waiting");
  assert.equal(f.video.paused, true);
  f.video.buffer([[0, 6]]);
  assert.equal(f.video.playCalls, 1);
  f.video.buffer([[0, 8]]);
  assert.equal(f.video.playCalls, 2);
  assert.equal(f.last().mode, "playing");
  f.controller.destroy();
});

test("can resume close to the end without requiring three seconds beyond duration", () => {
  const f = setup();
  f.start();
  f.video.metadata();
  f.video.currentTime = 108;
  f.video.buffer([[0, 109]]);
  assert.equal(f.video.playCalls, 1);
  f.controller.destroy();
});

test("manual pause survives scrolling or tab visibility changes", async () => {
  const f = setup();
  f.start();
  f.video.metadata();
  f.video.buffer([[0, 30]]);
  await settle();
  f.controller.toggle();
  assert.equal(f.last().wantsPlayback, false);
  f.controller.setVisible(false);
  f.controller.setVisible(true);
  f.video.emit("canplay");
  assert.equal(f.video.playCalls, 1);
  assert.equal(f.video.paused, true);
  assert.equal(f.last().mode, "paused");
  f.controller.toggle();
  assert.equal(f.video.playCalls, 2);
  f.controller.destroy();
});

test("offscreen loading does not trigger a downgrade until visible again", () => {
  const f = setup();
  f.start();
  f.controller.setVisible(false);
  f.timers.advance(30000);
  assert.deepEqual(f.video.loads, [HERO_SOURCES.standard]);
  f.controller.setVisible(true);
  f.timers.advance(10000);
  assert.equal(f.video.src, HERO_SOURCES.light);
  f.controller.destroy();
});

test("a sustained stall downgrades once and resumes at the prior position", async () => {
  const f = setup();
  f.start();
  f.video.metadata();
  f.video.buffer([[0, 30]]);
  await settle();
  f.video.currentTime = 21;
  f.video.emit("waiting");
  f.timers.advance(9999);
  assert.equal(f.video.src, HERO_SOURCES.standard);
  f.timers.advance(1);
  assert.equal(f.video.src, HERO_SOURCES.light);
  f.video.metadata();
  assert.equal(f.video.currentTime, 21);
  f.video.buffer([[21, 25]]);
  assert.equal(f.last().mode, "playing");
  assert.equal(f.video.playCalls, 2);
  assert.deepEqual(f.video.loads, [HERO_SOURCES.standard, HERO_SOURCES.light]);
  f.controller.destroy();
});

test("light source failure returns to the still without an automatic retry loop", () => {
  const f = setup({ profile: "light" });
  f.start();
  f.timers.advance(10000);
  assert.equal(f.video.src, "");
  assert.deepEqual(f.last(), { mode: "poster", wantsPlayback: false });
  const requests = f.video.loads.length;
  f.timers.advance(100000);
  f.video.emit("error");
  f.controller.setVisible(false);
  f.controller.setVisible(true);
  assert.equal(f.video.loads.length, requests);
  f.controller.toggle();
  assert.equal(f.video.src, HERO_SOURCES.light);
  f.controller.destroy();
});

test("two separate short playback stalls downgrade once, while duplicate waiting events do not", async () => {
  const f = setup();
  f.start();
  f.video.metadata();
  f.video.buffer([[0, 10]]);
  await settle();
  f.video.currentTime = 10;
  f.video.emit("waiting");
  f.video.emit("waiting");
  assert.equal(f.video.src, HERO_SOURCES.standard, "duplicate notifications are one stall");
  f.timers.advance(1000);
  f.video.buffer([[10, 15]]);
  await settle();
  assert.equal(f.last().mode, "playing");
  f.video.currentTime = 15;
  f.video.emit("waiting");
  assert.equal(f.video.src, HERO_SOURCES.light, "repeated stalls should not each wait ten seconds");
  f.video.metadata();
  assert.equal(f.video.currentTime, 15);
  f.video.buffer([[15, 20]]);
  await settle();
  f.video.currentTime = 20;
  f.video.emit("waiting");
  assert.deepEqual(f.video.loads, [HERO_SOURCES.standard, HERO_SOURCES.light]);
  f.controller.destroy();
});

test("returning while replacement metadata is pending restores its recovery deadline", async () => {
  const f = setup();
  f.start();
  f.video.metadata();
  f.video.buffer([[0, 30]]);
  await settle();
  f.video.currentTime = 21;
  f.video.emit("waiting");
  f.timers.advance(10000);
  assert.equal(f.video.src, HERO_SOURCES.light);
  f.controller.setVisible(false);
  assert.equal(f.timers.pending.size, 0);
  f.controller.setVisible(true);
  assert.equal(f.timers.pending.size, 1, "metadata loading must retain a bounded recovery window");
  f.timers.advance(10000);
  assert.deepEqual(f.last(), { mode: "poster", wantsPlayback: false });
  f.controller.destroy();
});

test("a source error cancels the old recovery deadline before trying the light source", () => {
  const f = setup();
  f.start();
  f.timers.advance(5000);
  f.video.emit("error");
  assert.equal(f.video.src, HERO_SOURCES.light);
  assert.equal(f.timers.pending.size, 1, "the old standard-source timer must be cancelled");
  f.timers.advance(5000);
  assert.equal(f.video.src, HERO_SOURCES.light, "light source gets its own full recovery window");
  f.timers.advance(5000);
  assert.equal(f.video.src, "");
  f.controller.destroy();
});

test("autoplay rejection exposes a manual play option without repeated attempts", async () => {
  const f = setup();
  f.video.rejection = Object.assign(new Error("Autoplay blocked"), { name: "NotAllowedError" });
  f.start();
  f.video.metadata();
  f.video.buffer([[0, 10]]);
  await settle();
  assert.deepEqual(f.last(), { mode: "poster", wantsPlayback: false });
  assert.equal(f.timers.pending.size, 0);
  f.video.emit("canplay");
  assert.equal(f.video.playCalls, 1);
  f.video.rejection = null;
  f.controller.toggle();
  assert.equal(f.video.playCalls, 2);
  assert.equal(f.last().mode, "playing");
  f.controller.destroy();
});

test("destroy clears listeners and recovery timers and releases the media request", () => {
  const f = setup();
  f.start();
  f.controller.destroy();
  assert.equal(f.video.src, "");
  assert.equal(f.video.paused, true);
  assert.equal(f.timers.pending.size, 0);
  const stateCount = f.states.length;
  const loadCount = f.video.loads.length;
  for (const event of ["error", "progress", "canplay", "loadedmetadata", "playing", "waiting"]) f.video.emit(event);
  f.timers.advance(100000);
  f.controller.setIntent(true);
  assert.equal(f.states.length, stateCount);
  assert.equal(f.video.loads.length, loadCount);
});
