"use client";

import { useEffect, useRef } from "react";

/**
 * Gold contour field — a WebGL2 fragment shader painted behind a section band.
 *
 * Antialiased iso-lines of a slowly domain-warped fbm: engraved topographic
 * strokes that morph like a living survey chart, kin to the Lorenz filaments
 * and the orrery drawing rather than a foreign visual language. The noise/fbm
 * helpers descend from the flowing-cloud shader by Matthias Hurrle
 * (@atzedent); the contour rendering is ours. The field is deliberately
 * calmest in a pocket where the orbit sits and densest toward the band edges.
 *
 * The site already runs a WebGL canvas full-time (the Lorenz attractor), so
 * this one is disciplined about when it draws: it paints only while its band is
 * on screen, stops when the tab is hidden, renders at most 1.5x device pixels
 * (enough that the ~1px engraved strokes stay crisp on retina — affordable
 * because the fragment is cheap: 3 fbm evaluations per pixel), and holds a
 * single static frame when the visitor prefers reduced motion.
 */

const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
void main(void) {
  // Engraved contour field: antialiased iso-lines of a slowly domain-warped
  // fbm, inked in the gold scale over ink-900. No fills, no glow -- fine
  // plate-engraving strokes that morph like a living topographic chart.
  const vec3 INK  = vec3(.039,.035,.031); // ink-900 #0A0908
  const vec3 G700 = vec3(.510,.349,.133); // gold-700 #825922
  const vec3 G600 = vec3(.663,.463,.180); // gold-600 #A9762E
  const vec3 G300 = vec3(.910,.725,.416); // gold-300 #E8B96A
  const vec3 G200 = vec3(.945,.816,.541); // gold-200 #F1D08A

  vec2 uv=(FC-.5*R)/MN;            // centered, aspect-true
  vec2 p=uv*vec2(1.4,1.)*.8;       // low frequency: long, unhurried curves
  float t=T*.045;                  // slow, stately drift

  // Domain warp: one fbm pair bends the lattice of a third (3 fbm total).
  vec2 w=vec2(
    fbm(p+vec2(t,-.7*t)),
    fbm(p+vec2(-.6*t,t)+3.7)
  );
  float f=fbm(p+1.1*(w-.5)+vec2(.3*t,-.2*t));

  // Field -> contour space. A faint radial term crowds the rings outward
  // so the pocket -- where the orbit lives -- stays quiet.
  float r=length(uv+vec2(0.,.08)); // pocket center ~58% down the band, where the orbit sits
  float v=f*4.5+r*1.2;             // major contours
  float vm=v*3.;                   // minor contours between them

  // fwidth-based iso-lines: ~1px strokes at any resolution. Where contours
  // crowd below pixel scale the strokes fade out instead of aliasing.
  float aw=fwidth(v)+1e-5;
  float awm=fwidth(vm)+1e-5;
  float major=(1.-smoothstep(.35*aw,1.4*aw,abs(fract(v)-.5)))*(1.-smoothstep(.2,.45,aw));
  float minor=(1.-smoothstep(.3*awm,1.1*awm,abs(fract(vm)-.5)))*(1.-smoothstep(.2,.45,awm));

  // Brightness breathes along each line; a rare contour is promoted to a
  // bright crest -- the "index line" of an engraved survey chart.
  float flow=.45+.55*smoothstep(.25,.85,w.y);
  float crest=smoothstep(.82,.97,noise(vec2(floor(v)*3.7,floor(v)*1.3)+t));

  // Soft center vignette: calm pocket (~30%), full weight at the edges.
  vec2 q=FC/R-vec2(.5,.42); // vignette follows the orbit, not the canvas center
  float vig=mix(.3,1.,smoothstep(.1,.52,length(q*vec2(1.,1.35))));

  vec3 inkline=mix(G700,G600,flow);
  vec3 hiline=mix(G300,G200,flow);
  vec3 col=INK;
  col+=minor*.3*flow*vig*inkline;
  col+=major*flow*vig*mix(inkline,hiline,crest)*(.55+.45*crest);
  O=vec4(col,1.);
}`;

export default function NebulaField({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    // No WebGL2 → leave the canvas transparent; the CSS gradient behind it stands in.
    if (!gl) return;

    const compile = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("NebulaField shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("NebulaField link:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "resolution");
    const uTime = gl.getUniformLocation(program, "time");

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (now) => {
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let raf = 0;
    let onScreen = false;
    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || reduce || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    draw(0); // first frame — and the only frame under reduced motion

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      resize();
      if (!raf) draw(performance.now());
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
      // Deliberately NOT calling WEBGL_lose_context here: StrictMode and HMR
      // re-run this effect on the same canvas element, and getContext() would
      // hand back the very context we killed — leaving a dead black band.
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
