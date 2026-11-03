export const HERO_POSTER = "/home/showreel-poster-v2.webp";
export const HERO_SOURCES = {
  standard: "/home/showreel-720-v2.mp4",
  light: "/home/showreel-480-v2.mp4",
};

export function heroVideoPolicy(width, connection = {}, reducedMotion = false) {
  const verySlow = ["slow-2g", "2g"].includes(connection.effectiveType);
  const light = width < 768 || connection.saveData || verySlow ||
    connection.effectiveType === "3g" ||
    (connection.downlink > 0 && connection.downlink < 2);
  return { profile: light ? "light" : "standard", autoplay: !reducedMotion && !connection.saveData && !verySlow };
}

export function bufferedAhead(video) {
  for (let i = 0; i < video.buffered.length; i++) {
    if (video.buffered.start(i) <= video.currentTime + 0.05 && video.buffered.end(i) > video.currentTime) {
      return video.buffered.end(i) - video.currentTime;
    }
  }
  return 0;
}

// One source at a time. Wait for a small runway before starting/restarting;
// downgrade once after a sustained stall, then offer a manual retry on a still.
export function createHeroVideoController(video, {
  profile = "standard", onState = () => {},
  schedule = setTimeout, cancel = clearTimeout,
} = {}) {
  let wanted = false;
  let visible = false;
  let loaded = false;
  let destroyed = false;
  let hasFrame = false;
  let waiting = true;
  let playPending = false;
  let resumeAt = 0;
  let stalls = 0;
  let recoveryTimer;
  let lastState = "";
  const events = [];

  const publish = (mode) => {
    const key = `${mode}:${wanted}`;
    if (key !== lastState && !destroyed) {
      lastState = key;
      onState({ mode, wantsPlayback: wanted });
    }
  };
  const clearRecovery = () => {
    if (recoveryTimer !== undefined) cancel(recoveryTimer);
    recoveryTimer = undefined;
  };
  const stop = () => {
    wanted = false;
    clearRecovery();
    video.pause();
    video.removeAttribute("src");
    video.load();
    loaded = false;
    hasFrame = false;
    publish("poster");
  };
  const recover = () => {
    clearRecovery();
    if (!wanted || !visible || destroyed) return;
    if (profile === "standard") {
      profile = "light";
      loadSource(video.currentTime || resumeAt);
    } else stop();
  };
  const armRecovery = () => {
    if (recoveryTimer === undefined && wanted && visible) recoveryTimer = schedule(recover, 10000);
  };
  const loadSource = (position = 0) => {
    clearRecovery();
    waiting = true;
    playPending = false;
    hasFrame = false;
    stalls = 0;
    resumeAt = position;
    loaded = true;
    video.preload = "auto";
    video.src = HERO_SOURCES[profile];
    video.load();
    publish("buffering");
    armRecovery();
  };
  const update = () => {
    if (destroyed) return;
    if (!wanted || !visible) {
      clearRecovery();
      video.pause();
      publish(hasFrame ? "paused" : "poster");
      return;
    }
    if (!loaded) { loadSource(); return; }
    if (resumeAt > 0 || video.seeking) { publish("buffering"); armRecovery(); return; }
    const remaining = Number.isFinite(video.duration) ? video.duration - video.currentTime : Infinity;
    if (waiting && (video.readyState < 2 || bufferedAhead(video) < Math.min(3, remaining))) {
      publish("buffering");
      armRecovery();
      return;
    }
    if (!video.paused || playPending) return;
    playPending = true;
    const source = video.src;
    video.play().catch((error) => {
      if (destroyed || video.src !== source || error.name === "AbortError") return;
      wanted = false;
      clearRecovery();
      publish(hasFrame ? "paused" : "poster");
    }).finally(() => { playPending = false; });
  };
  const listen = (type, callback) => {
    video.addEventListener(type, callback);
    events.push([type, callback]);
  };
  listen("loadedmetadata", () => {
    if (resumeAt > 0) {
      video.currentTime = Math.min(resumeAt, Math.max(0, video.duration - 0.1));
      resumeAt = 0;
    }
    update();
  });
  for (const type of ["progress", "canplay", "seeked"]) listen(type, update);
  listen("playing", () => {
    if (!wanted || !visible) { update(); return; }
    waiting = false;
    hasFrame = true;
    clearRecovery();
    publish("playing");
  });
  listen("waiting", () => {
    if (!wanted || !visible) return;
    if (!waiting && hasFrame) stalls++;
    waiting = true;
    video.pause();
    publish("buffering");
    if (profile === "standard" && stalls >= 2) { recover(); return; }
    armRecovery();
  });
  // A stalled download can still have plenty buffered. Only recover when
  // playback itself runs out, rather than treating every network pause as one.
  listen("error", () => { if (wanted && visible) recover(); });

  return {
    setVisible(value) { visible = value; update(); },
    setIntent(value) { wanted = value; update(); },
    toggle() { wanted = !wanted; update(); },
    destroy() {
      destroyed = true;
      clearRecovery();
      for (const [type, callback] of events) video.removeEventListener(type, callback);
      video.pause();
      video.removeAttribute("src");
      video.load();
    },
  };
}
