"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  ONE Lorenz attractor, treated like a camera subject (the Axiom     */
/*  reference): the geometry itself never changes — scrolling drives   */
/*  a choreography of rotation, zoom and travel keyframes, so the      */
/*  same form reads face-on, edge-on (compressed), close-up (bands     */
/*  filling the screen) and wide, plus a cursor-repulsion "eye".       */
/* ------------------------------------------------------------------ */
const COUNT = 9000;

function lorenzStep(x, y, z, dt) {
  const s = 10, r = 28, b = 8 / 3;
  return [x + s * (y - x) * dt, y + (x * (r - z) - y) * dt, z + (x * y - b * z) * dt];
}

function integrate(step, seed, dt, warmup = 400, steps = COUNT) {
  const out = new Float32Array(steps * 3);
  let { x, y, z } = seed;
  for (let i = 0; i < warmup; i++) {
    [x, y, z] = step(x, y, z, dt);
  }
  for (let i = 0; i < steps; i++) {
    [x, y, z] = step(x, y, z, dt);
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/**
 * Resample a polyline to `count` points spaced evenly by ARC LENGTH.
 *
 * The integrator samples by TIME, so vertices bunch up where the attractor
 * crawls and stretch far apart where it races. Those long segments are the
 * reason the cursor repulsion looked jarring: one segment could span the whole
 * cleared zone, so the parted line read as a straight chord / angular kink
 * instead of a curve. Even spacing gives every segment the same short length,
 * so there are always plenty of vertices to bend smoothly around the cursor.
 * It also makes the travelling glow move at a constant speed along the curve.
 */
function resampleUniform(src, count) {
  const n = src.length / 3;
  const cum = new Float64Array(n);
  let total = 0;
  for (let i = 1; i < n; i++) {
    const dx = src[i * 3] - src[(i - 1) * 3];
    const dy = src[i * 3 + 1] - src[(i - 1) * 3 + 1];
    const dz = src[i * 3 + 2] - src[(i - 1) * 3 + 2];
    total += Math.hypot(dx, dy, dz);
    cum[i] = total;
  }
  const out = new Float32Array(count * 3);
  const stepLen = total / (count - 1);
  let seg = 1;
  for (let i = 0; i < count; i++) {
    const target = i * stepLen;
    while (seg < n - 1 && cum[seg] < target) seg++;
    const t0 = cum[seg - 1];
    const t1 = cum[seg];
    const f = t1 > t0 ? (target - t0) / (t1 - t0) : 0;
    const a = (seg - 1) * 3;
    const b = seg * 3;
    out[i * 3] = src[a] + (src[b] - src[a]) * f;
    out[i * 3 + 1] = src[a + 1] + (src[b + 1] - src[a + 1]) * f;
    out[i * 3 + 2] = src[a + 2] + (src[b + 2] - src[a + 2]) * f;
  }
  return out;
}

// Centre the attractor on the origin at a known radius so the keyframed
// scales/positions below always frame it predictably.
function normalize(arr, radius = 3.7) {
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < arr.length; i += 3) {
    minX = Math.min(minX, arr[i]); maxX = Math.max(maxX, arr[i]);
    minY = Math.min(minY, arr[i + 1]); maxY = Math.max(maxY, arr[i + 1]);
    minZ = Math.min(minZ, arr[i + 2]); maxZ = Math.max(maxZ, arr[i + 2]);
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
  let maxR = 0;
  for (let i = 0; i < arr.length; i += 3) {
    const dx = arr[i] - cx, dy = arr[i + 1] - cy, dz = arr[i + 2] - cz;
    maxR = Math.max(maxR, Math.hypot(dx, dy, dz));
  }
  const s = maxR > 0 ? radius / maxR : 1;
  for (let i = 0; i < arr.length; i += 3) {
    arr[i] = (arr[i] - cx) * s;
    arr[i + 1] = (arr[i + 1] - cy) * s;
    arr[i + 2] = (arr[i + 2] - cz) * s;
  }
  return arr;
}

function buildLorenz() {
  // Trace the SAME trajectory (dt x steps is unchanged at 54 time units) but at
  // 5x the temporal resolution, then resample to COUNT points at uniform arc
  // length: identical shape, evenly spaced short segments. One-time cost at
  // mount; the drawn buffer stays COUNT vertices.
  const dense = integrate(lorenzStep, { x: 0.1, y: 0, z: 0 }, 0.0012, 2000, COUNT * 5);
  return normalize(resampleUniform(dense, COUNT));
}

function goldColors() {
  const lo = new THREE.Color("#6e4513");
  const mid = new THREE.Color("#cf9a40");
  const hi = new THREE.Color("#fbe6bf");
  const c = new Float32Array(COUNT * 3);
  const tmp = new THREE.Color();
  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1);
    if (t < 0.5) tmp.lerpColors(lo, mid, t / 0.5);
    else tmp.lerpColors(mid, hi, (t - 0.5) / 0.5);
    c[i * 3] = tmp.r;
    c[i * 3 + 1] = tmp.g;
    c[i * 3 + 2] = tmp.b;
  }
  return c;
}

const smoothstep = (f) => f * f * (3 - 2 * f);

// Scroll choreography — the SAME shape presented like a camera subject.
// p = position, s = scale (zoom), r = base rotation (rad). rotY climbs
// monotonically so scrolling always reads as continuous rotation.
// Reviewed as a set. Two rules keep every pose sculptural rather than flat:
//  1. TILT — rX stays in ~0.6–1.15 so we always read the lobes at an angle.
//     Low tilt (the old 0.2/0.35/0.4 poses) flattens the form to a disc.
//  2. DON'T DIVE INSIDE A LOBE — the camera sees viewH/(2*3.7*s) of the form,
//     so past s≈2.05 less than half of it is in frame: you're within one wing
//     and its spiral fills the screen as concentric rings (a bullseye with no
//     form — the old s2.6 "rings fill the flank" and s2.9 poses). Capped at
//     2.05, i.e. >=51% of the form always in frame.
// Net: the baseline is bigger (min 1.35 → 1.7, typical ~1.8–2.0) while the
// deep dives that produced the flat targets are gone. rotY still climbs
// monotonically so scrolling always reads as one continuous rotation.
const KEYS = [
  { p: [2.2, 0.15, 0], s: 1.7, r: [0.62, 0.6, 0.18] }, // hero: three-quarter, right of centre
  { p: [1.2, -0.2, 0.3], s: 1.9, r: [0.95, 1.2, -0.2] }, // off the hero: tilt in, angled
  { p: [-0.4, 0.5, -0.2], s: 1.75, r: [0.72, 1.9, 0.22] }, // drift across centre, turning
  { p: [-2.1, 0.5, -0.3], s: 1.8, r: [0.88, 2.6, -0.2] }, // left: edge-on blade
  { p: [-1.1, -0.25, 0.4], s: 2.0, r: [1.1, 3.3, 0.3] }, // closer on the left flank, steeply tilted
  { p: [0.9, 0.25, 0.2], s: 1.85, r: [0.68, 4.0, -0.15] }, // sweep back through the centre
  { p: [2.1, -0.4, -0.3], s: 1.75, r: [0.82, 4.7, -0.26] }, // wide on the right, angled
  { p: [-0.8, 0.35, 0.35], s: 2.05, r: [1.15, 5.5, 0.16] }, // second close pass: bands sweep, not rings
  { p: [-1.9, -0.15, -0.2], s: 1.8, r: [0.75, 6.3, -0.18] }, // pull back, far left
  { p: [0.7, 0.5, 0.3], s: 2.0, r: [1.0, 7.2, 0.2] }, // swoop back in, mid-close
  { p: [1.3, -0.3, 0], s: 1.8, r: [0.7, 8.1, 0.22] }, // settle centre-right, three-quarter
];

// Cursor radii in WORLD units — divided by the group scale each frame so the
// eye and the highlight stay a constant size on screen at any zoom. The eye is
// measured against the cursor's sight-line (a CYLINDER), so filaments at every
// depth dissolve around it — a clean hole, not a dent at one depth plane.
const HIGHLIGHT_R = 1.9; // radius the cursor lights up
const VOID_R = 0.95; // radius the filaments dissolve inside (the eye)

// Scroll body language — while the page is actually moving the form spins a
// touch faster and compresses slightly, relaxing open when the scroll rests
// (rotate → compress → expand, matching the Axiom reference).
const SWIRL_GAIN = 1.4; // extra spin (rad/s) at full scroll speed
const COMPRESS = 0.12; // max scale compression while scrolling

// Travelling glow — a bright arc of the filament that runs along the curve
// (a comet: brightest at the head, fading down a tail), driven through the
// line's own vertex colours so it reads as the line glowing.
const HEAD_SPEED = 1200; // curve vertices advanced per second (~7.5s per lap)
const GLOW_TAIL = 340; // length of the glowing arc, in vertices
const GLOW_MAX = 0.65; // peak brightness of the travel glow (kept slight)

function LorenzAttractor() {
  const group = useRef();
  const cursor = useRef();
  const headIndex = useRef(0); // position of the travelling glow along the curve
  const ambient = useRef(0); // accumulated ambient spin, layered over keyframed pose
  const lastScrollY = useRef(0); // last sampled scrollY, for scroll-velocity
  const swirl = useRef(0); // smoothed scroll speed → spin/compression while moving
  const repel = useRef(0); // eased strength of the cursor's dissolved "eye"
  const hasPointer = useRef(false); // set on the first real pointer movement
  const vel = useRef(0); // smoothed pointer velocity (event-decoupled)
  const prevPointer = useRef({ x: 0, y: 0 });
  const { pointer, viewport, camera } = useThree();

  const base = useMemo(buildLorenz, []); // static curve — never rebuilt, never displaced
  const baseColors = useMemo(goldColors, []);
  const colors = useMemo(() => baseColors.slice(), [baseColors]); // working (mutated) colors
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const rayO = useMemo(() => new THREE.Vector3(), []); // camera position, local space
  const rayD = useMemo(() => new THREE.Vector3(), []); // cursor sight-line, local space
  const hi = useMemo(() => new THREE.Color("#fff4d6"), []);
  // repulsion is a hover interaction — only meaningful for mouse/trackpad
  const fine = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches,
    [],
  );

  const line = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // positions are static (the eye is carved in colour); only colours stream
    geo.setAttribute("position", new THREE.BufferAttribute(base, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));
    geo.frustumCulled = false;
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const l = new THREE.Line(geo, mat);
    l.frustumCulled = false; // the choreography swings it far off-centre; never cull
    return l;
  }, [base, colors]);

  // Release the imperatively-created buffers/material on unmount or HMR.
  useEffect(() => {
    const l = line;
    return () => {
      l.geometry.dispose();
      l.material.dispose();
    };
  }, [line]);

  // Close the eye when the pointer leaves the page or the window loses focus —
  // the easings then play the smooth close/fade, and the next pointermove
  // re-arms the latch via the existing delta check.
  useEffect(() => {
    const clear = () => {
      hasPointer.current = false;
    };
    const el = document.documentElement;
    el.addEventListener("pointerleave", clear);
    window.addEventListener("blur", clear);
    return () => {
      el.removeEventListener("pointerleave", clear);
      window.removeEventListener("blur", clear);
    };
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // --- scroll progress + velocity (screens/sec), read live each frame ---
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const sp = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    const sy = Math.min(Math.max(window.scrollY, 0), Math.max(max, 0));
    const vh = Math.max(window.innerHeight, 1);
    const sv = delta > 0 ? Math.abs(sy - lastScrollY.current) / (vh * delta) : 0;
    lastScrollY.current = sy;
    swirl.current += (Math.min(sv, 1.2) - swirl.current) * Math.min(delta * 4, 1);

    // --- choreography: interpolate the pose keyframes (position/zoom/rotation) ---
    const NK = KEYS.length;
    const kt = sp * (NK - 1);
    const ki = Math.min(Math.floor(kt), NK - 2);
    const kf = smoothstep(kt - ki);
    const KA = KEYS[ki];
    const KB = KEYS[ki + 1];
    g.position.x += (KA.p[0] + (KB.p[0] - KA.p[0]) * kf - g.position.x) * 0.085;
    g.position.y += (KA.p[1] + (KB.p[1] - KA.p[1]) * kf - g.position.y) * 0.085;
    g.position.z += (KA.p[2] + (KB.p[2] - KA.p[2]) * kf - g.position.z) * 0.085;
    const tS = KA.s + (KB.s - KA.s) * kf;
    const tRx = KA.r[0] + (KB.r[0] - KA.r[0]) * kf;
    const tRy = KA.r[1] + (KB.r[1] - KA.r[1]) * kf;
    const tRz = KA.r[2] + (KB.r[2] - KA.r[2]) * kf;

    // ambient spin layered on the keyframed pose — faster while scrolling, and
    // the form compresses slightly in motion, relaxing open at rest
    ambient.current += delta * (0.05 + swirl.current * SWIRL_GAIN);
    g.rotation.x += (tRx + pointer.y * 0.4 - g.rotation.x) * 0.095;
    g.rotation.y += (tRy + ambient.current - g.rotation.y) * 0.095;
    g.rotation.z += (tRz + pointer.x * 0.3 - g.rotation.z) * 0.095;
    g.scale.setScalar(
      tS * (1 + Math.sin(t * 0.4) * 0.02) * (1 - COMPRESS * Math.min(swirl.current, 1)),
    );
    const sNow = g.scale.x;

    // --- smoothed pointer velocity (decoupled from sparse pointermove events) ---
    const dpx = pointer.x - prevPointer.current.x;
    const dpy = pointer.y - prevPointer.current.y;
    if (dpx !== 0 || dpy !== 0) {
      vel.current = Math.min(vel.current + Math.hypot(dpx, dpy) * 60, 6);
      hasPointer.current = true;
    }
    vel.current *= Math.exp(-delta * 4);
    prevPointer.current.x = pointer.x;
    prevPointer.current.y = pointer.y;
    const speed = vel.current;

    // --- cursor glow (depth-corrected so it sits exactly under the pointer) ---
    const glowZ = 0.6;
    const dk = (camera.position.z - glowZ) / camera.position.z;
    const cx = (pointer.x * viewport.width) / 2 * dk;
    const cy = (pointer.y * viewport.height) / 2 * dk;
    if (cursor.current) {
      cursor.current.position.set(cx, cy, glowZ);
      const targetScale = 1 + Math.min(speed * 0.4, 2.2);
      cursor.current.scale.setScalar(cursor.current.scale.x + (targetScale - cursor.current.scale.x) * 0.15);
      // solid focal dot whenever a fine pointer is on the page (the centre of
      // the parted "eye"), swelling slightly with movement
      const targetOp = fine && hasPointer.current ? Math.min(0.8 + speed * 0.05, 0.95) : 0;
      cursor.current.material.opacity += (targetOp - cursor.current.material.opacity) * 0.15;
    }

    // --- the cursor's sight-line in the attractor's LOCAL space: from the
    //     camera through the dot's exact world position, so the parted tube is
    //     dead-centred under the dot at every group depth and travel position ---
    g.updateWorldMatrix(true, false);
    rayO.copy(camera.position);
    g.worldToLocal(rayO);
    tmp.set(cx, cy, glowZ);
    g.worldToLocal(tmp);
    rayD.copy(tmp).sub(rayO).normalize();
    const boost = Math.min(speed * 0.7, 1);
    const highlighting = boost > 0.02;

    // advance the travelling glow head; it runs past the end of the OPEN
    // polyline so the tail drains off naturally, then is reborn at the start
    headIndex.current = (headIndex.current + delta * HEAD_SPEED) % (COUNT + GLOW_TAIL);
    const headPos = headIndex.current;
    const headRamp = Math.min(headPos / GLOW_TAIL, 1); // fade in at birth, no pop

    // cursor repulsion: filaments part around the pointer, opening an "eye"
    // that eases closed when the pointer leaves. Positions are re-uploaded
    // only while the eye is open or closing — the base curve is static.
    const repelTarget = fine && hasPointer.current ? 1 : 0;
    repel.current += (repelTarget - repel.current) * Math.min(delta * 3.5, 1);
    const voidOn = repel.current > 0.01;

    // world-space cursor radii → local units (constant size on screen at any zoom)
    const sInv = sNow > 1e-4 ? 1 / sNow : 1;
    const hlR = HIGHLIGHT_R * sInv;
    const hl2 = hlR * hlR;
    const vdR = VOID_R * sInv;
    const vd2 = vdR * vdR;

    // colours refresh every frame so the glow can travel — the moving comet
    // arc plus the cursor-proximity highlight, both easing the base gold → cream.
    // The highlight and the eye share one measurement: each vertex's
    // perpendicular offset from the cursor sight-line, so both effects are
    // depth-independent and stay centred under the dot.
    const rox = rayO.x, roy = rayO.y, roz = rayO.z;
    const rdx = rayD.x, rdy = rayD.y, rdz = rayD.z;
    const measure = highlighting || voidOn;
    for (let v = 0, j = 0; v < COUNT; v++, j += 3) {
      // perpendicular offset from the cursor ray
      let d2 = Infinity;
      if (measure) {
        const ox = base[j] - rox, oy = base[j + 1] - roy, oz = base[j + 2] - roz;
        const tt = ox * rdx + oy * rdy + oz * rdz;
        const ppx = ox - tt * rdx;
        const ppy = oy - tt * rdy;
        const ppz = oz - tt * rdz;
        d2 = ppx * ppx + ppy * ppy + ppz * ppz;
      }

      // travelling comet: brightest at the head, fading back along the tail
      const d = headPos - v;
      let gl = 0;
      if (d >= 0 && d <= GLOW_TAIL) {
        const q = 1 - d / GLOW_TAIL;
        gl = q * q * GLOW_MAX * headRamp;
      }
      // cursor proximity highlight
      let br = 0;
      if (highlighting && d2 < hl2) {
        const dd = 1 - Math.sqrt(d2) / hlR;
        br = dd * dd * boost;
      }
      let tot = gl + br;
      if (tot > 1) tot = 1;

      // The eye: DISSOLVE the filaments inside the sight-line rather than
      // pushing them aside. A radial push tears any curve that crosses the
      // centre — the vertices either side of it get shoved to opposite rims and
      // the segment joining them draws as a straight chord across the void.
      // Fading to black (invisible under additive blending) opens the same hole
      // with no tearing, and the gradient along each segment softens the rim.
      let fade = 1;
      if (voidOn && d2 < vd2) {
        const q = Math.sqrt(d2) / vdR; // 0 on the ray → 1 at the rim
        fade = 1 - repel.current * (1 - q * q * (3 - 2 * q)); // smoothstep
      }

      const b0 = baseColors[j], b1 = baseColors[j + 1], b2 = baseColors[j + 2];
      colors[j] = (b0 + (hi.r - b0) * tot) * fade;
      colors[j + 1] = (b1 + (hi.g - b1) * tot) * fade;
      colors[j + 2] = (b2 + (hi.b - b2) * tot) * fade;
    }
    // Positions are never touched now — the eye is carved in colour, so only
    // the colour buffer is re-uploaded (this also removes the per-frame
    // position sync that used to stutter weaker GPUs during cursor movement).
    line.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <>
      <group ref={group} position={[2.4, 0.2, 0]} rotation={[0.5, 0, 0.2]}>
        <primitive object={line} />
      </group>

      {/* cursor-following gold glow (outside the rotating group → screen-space) */}
      <mesh ref={cursor}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshBasicMaterial color="#f0a63c" transparent opacity={0} toneMapped={false} />
      </mesh>
    </>
  );
}

function FloatingDust({ count = 200 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // deterministic pseudo-scatter (no Math.random at module scope needs)
      const a = Math.sin(i * 12.9898) * 43758.5453;
      const b = Math.sin(i * 78.233) * 12543.132;
      const cc = Math.sin(i * 39.425) * 21783.21;
      arr[i * 3] = ((a - Math.floor(a)) - 0.5) * 26;
      arr[i * 3 + 1] = ((b - Math.floor(b)) - 0.5) * 16;
      arr[i * 3 + 2] = ((cc - Math.floor(cc)) - 0.5) * 12 - 4;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#c9923d" transparent opacity={0.5} sizeAttenuation toneMapped={false} />
    </points>
  );
}

export default function AttractorScene() {
  // Lighter pipeline on phones: lower pixel ceiling + no composer MSAA (bloom's
  // mipmapBlur already softens the thin additive lines). Note: with the
  // always-on EffectComposer the scene renders into the composer's target, so
  // MSAA is controlled by its `multisampling` prop — canvas antialias is left
  // off since the default framebuffer only receives the final blit.
  const isMobile =
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

  return (
    <Canvas
      dpr={[1, isMobile ? 1.3 : 1.8]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 9.5], fov: 45 }}
      style={{ background: "transparent" }}
      eventSource={typeof document !== "undefined" ? document.documentElement : undefined}
      eventPrefix="client"
    >
      <fog attach="fog" args={["#0a0908", 9, 22]} />
      <LorenzAttractor />
      <FloatingDust />
      <EffectComposer multisampling={isMobile ? 0 : 4}>
        <Bloom intensity={1.05} luminanceThreshold={0.14} luminanceSmoothing={0.9} mipmapBlur radius={0.75} />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
