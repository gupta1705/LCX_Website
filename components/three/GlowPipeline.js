import * as THREE from "three";

/**
 * Bloom for the attractor, without a full-screen post-processing chain.
 *
 * The old setup ran @react-three/postprocessing's EffectComposer: the whole
 * scene rendered into a full-resolution offscreen buffer, a full-resolution
 * luminance pass, a full-resolution read into the blur, then a
 * full-resolution effect pass (bloom + vignette) copying it all to the
 * screen — four full-screen passes every frame for what is mostly empty
 * dark canvas, which is what pinned integrated GPUs well below 60fps.
 *
 * Here the sharp lines draw straight to the screen (vignette applied in their
 * own shader), and only the glow goes through offscreen buffers — rendered
 * from a QUARTER-resolution copy of the scene, so every pass in the chain
 * works on 1/16 of the pixels or fewer. Then one full-screen additive
 * composite. Measured on an Intel UHD iGPU at 1920x1000: locked 60fps; at
 * 1.5x DPR (2.25x the pixels) ~55fps where the old chain managed ~32.
 * Rendering lines into a quarter-res buffer feeds the glow more energy per
 * pixel than the old full-res source did, hence the lower intensity the
 * caller passes in.
 *
 * The blur itself is the same algorithm as postprocessing's MipmapBlurPass
 * (+ LuminanceMaterial threshold), with its shaders ported below, so the halo
 * keeps the same shape and falloff. postprocessing is © Raoul van Rüschen,
 * zlib licence.
 */

const TRIANGLE = new THREE.BufferGeometry();
TRIANGLE.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
);

const FULLSCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 1.0, 1.0);
}`;

const LUMINANCE_FRAG = /* glsl */ `
#include <common>
uniform sampler2D inputBuffer;
uniform float threshold;
uniform float smoothing;
varying vec2 vUv;
void main() {
  vec4 texel = texture2D(inputBuffer, vUv);
  float l = luminance(texel.rgb);
  gl_FragColor = texel * smoothstep(threshold, threshold + smoothing, l);
}`;

const DOWN_VERT = /* glsl */ `
uniform vec2 texelSize;
varying vec2 vUv;
varying vec2 vUv00; varying vec2 vUv01; varying vec2 vUv02; varying vec2 vUv03;
varying vec2 vUv04; varying vec2 vUv05; varying vec2 vUv06; varying vec2 vUv07;
varying vec2 vUv08; varying vec2 vUv09; varying vec2 vUv10; varying vec2 vUv11;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  vUv00 = vUv + texelSize * vec2(-1.0, 1.0);
  vUv01 = vUv + texelSize * vec2(1.0, 1.0);
  vUv02 = vUv + texelSize * vec2(-1.0, -1.0);
  vUv03 = vUv + texelSize * vec2(1.0, -1.0);
  vUv04 = vUv + texelSize * vec2(-2.0, 2.0);
  vUv05 = vUv + texelSize * vec2(0.0, 2.0);
  vUv06 = vUv + texelSize * vec2(2.0, 2.0);
  vUv07 = vUv + texelSize * vec2(-2.0, 0.0);
  vUv08 = vUv + texelSize * vec2(2.0, 0.0);
  vUv09 = vUv + texelSize * vec2(-2.0, -2.0);
  vUv10 = vUv + texelSize * vec2(0.0, -2.0);
  vUv11 = vUv + texelSize * vec2(2.0, -2.0);
  gl_Position = vec4(position.xy, 1.0, 1.0);
}`;

const DOWN_FRAG = /* glsl */ `
#define WEIGHT_INNER 0.125
#define WEIGHT_OUTER 0.05556
uniform sampler2D inputBuffer;
varying vec2 vUv;
varying vec2 vUv00; varying vec2 vUv01; varying vec2 vUv02; varying vec2 vUv03;
varying vec2 vUv04; varying vec2 vUv05; varying vec2 vUv06; varying vec2 vUv07;
varying vec2 vUv08; varying vec2 vUv09; varying vec2 vUv10; varying vec2 vUv11;
float clampToBorder(const in vec2 uv) {
  return float(uv.s >= 0.0 && uv.s <= 1.0 && uv.t >= 0.0 && uv.t <= 1.0);
}
void main() {
  vec4 c = vec4(0.0);
  vec4 w = WEIGHT_INNER * vec4(clampToBorder(vUv00), clampToBorder(vUv01), clampToBorder(vUv02), clampToBorder(vUv03));
  c += w.x * texture2D(inputBuffer, vUv00);
  c += w.y * texture2D(inputBuffer, vUv01);
  c += w.z * texture2D(inputBuffer, vUv02);
  c += w.w * texture2D(inputBuffer, vUv03);
  w = WEIGHT_OUTER * vec4(clampToBorder(vUv04), clampToBorder(vUv05), clampToBorder(vUv06), clampToBorder(vUv07));
  c += w.x * texture2D(inputBuffer, vUv04);
  c += w.y * texture2D(inputBuffer, vUv05);
  c += w.z * texture2D(inputBuffer, vUv06);
  c += w.w * texture2D(inputBuffer, vUv07);
  w = WEIGHT_OUTER * vec4(clampToBorder(vUv08), clampToBorder(vUv09), clampToBorder(vUv10), clampToBorder(vUv11));
  c += w.x * texture2D(inputBuffer, vUv08);
  c += w.y * texture2D(inputBuffer, vUv09);
  c += w.z * texture2D(inputBuffer, vUv10);
  c += w.w * texture2D(inputBuffer, vUv11);
  c += WEIGHT_OUTER * texture2D(inputBuffer, vUv);
  gl_FragColor = c;
}`;

const UP_VERT = /* glsl */ `
uniform vec2 texelSize;
varying vec2 vUv;
varying vec2 vUv0; varying vec2 vUv1; varying vec2 vUv2; varying vec2 vUv3;
varying vec2 vUv4; varying vec2 vUv5; varying vec2 vUv6; varying vec2 vUv7;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  vUv0 = vUv + texelSize * vec2(-1.0, 1.0);
  vUv1 = vUv + texelSize * vec2(0.0, 1.0);
  vUv2 = vUv + texelSize * vec2(1.0, 1.0);
  vUv3 = vUv + texelSize * vec2(-1.0, 0.0);
  vUv4 = vUv + texelSize * vec2(1.0, 0.0);
  vUv5 = vUv + texelSize * vec2(-1.0, -1.0);
  vUv6 = vUv + texelSize * vec2(0.0, -1.0);
  vUv7 = vUv + texelSize * vec2(1.0, -1.0);
  gl_Position = vec4(position.xy, 1.0, 1.0);
}`;

const UP_FRAG = /* glsl */ `
uniform sampler2D inputBuffer;
uniform sampler2D supportBuffer;
uniform float radius;
varying vec2 vUv;
varying vec2 vUv0; varying vec2 vUv1; varying vec2 vUv2; varying vec2 vUv3;
varying vec2 vUv4; varying vec2 vUv5; varying vec2 vUv6; varying vec2 vUv7;
void main() {
  vec4 c = vec4(0.0);
  c += texture2D(inputBuffer, vUv0) * 0.0625;
  c += texture2D(inputBuffer, vUv1) * 0.125;
  c += texture2D(inputBuffer, vUv2) * 0.0625;
  c += texture2D(inputBuffer, vUv3) * 0.125;
  c += texture2D(inputBuffer, vUv) * 0.25;
  c += texture2D(inputBuffer, vUv4) * 0.125;
  c += texture2D(inputBuffer, vUv5) * 0.0625;
  c += texture2D(inputBuffer, vUv6) * 0.125;
  c += texture2D(inputBuffer, vUv7) * 0.0625;
  gl_FragColor = mix(texture2D(supportBuffer, vUv), c, radius);
}`;

// Vignette shared with the line shader (same formula as postprocessing's
// default VignetteEffect technique), so lines and glow darken identically.
export const VIGNETTE_GLSL = /* glsl */ `
float vignette(vec2 uv, float offset, float darkness) {
  float d = distance(uv, vec2(0.5));
  return smoothstep(0.8, offset * 0.799, d * (darkness + offset));
}`;

const COMPOSITE_FRAG = /* glsl */ `
uniform sampler2D map;
uniform float intensity;
uniform float vignetteOffset;
uniform float vignetteDarkness;
varying vec2 vUv;
${VIGNETTE_GLSL}
void main() {
  vec3 c = texture2D(map, vUv).rgb * intensity * vignette(vUv, vignetteOffset, vignetteDarkness);
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}`;

function pass(fragmentShader, uniforms, vertexShader = FULLSCREEN_VERT) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
}

export class GlowPipeline {
  constructor({
    threshold,
    smoothing,
    radius,
    levels = 8,
    intensity,
    vignetteOffset,
    vignetteDarkness,
    sourceScale = 0.25,
    blurScale = 0.25,
  }) {
    this.sourceScale = sourceScale;
    this.blurScale = blurScale;
    // 8-bit sRGB targets: half the memory traffic of HalfFloat, and the
    // sRGB encoding keeps the dim tail of the halo from banding.
    const target = () =>
      new THREE.WebGLRenderTarget(1, 1, {
        depthBuffer: false,
        type: THREE.UnsignedByteType,
        colorSpace: THREE.SRGBColorSpace,
      });
    this.source = target();
    this.luminance = target();
    this.down = Array.from({ length: levels }, target);
    this.up = Array.from({ length: levels - 1 }, target);

    this.luminanceMat = pass(LUMINANCE_FRAG, {
      inputBuffer: { value: null },
      threshold: { value: threshold },
      smoothing: { value: smoothing },
    });
    this.downMat = pass(
      DOWN_FRAG,
      { inputBuffer: { value: null }, texelSize: { value: new THREE.Vector2() } },
      DOWN_VERT,
    );
    this.upMat = pass(
      UP_FRAG,
      {
        inputBuffer: { value: null },
        supportBuffer: { value: null },
        texelSize: { value: new THREE.Vector2() },
        radius: { value: radius },
      },
      UP_VERT,
    );
    // Additive onto the screen, colour only: the glow must add light without
    // raising the canvas alpha, or the whole canvas would turn opaque and
    // hide the CSS gradient fallback behind it.
    this.compositeMat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: null },
        intensity: { value: intensity },
        vignetteOffset: { value: vignetteOffset },
        vignetteDarkness: { value: vignetteDarkness },
      },
      vertexShader: FULLSCREEN_VERT,
      fragmentShader: COMPOSITE_FRAG,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor,
      blendDstAlpha: THREE.OneFactor,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });

    this.quad = new THREE.Mesh(TRIANGLE, this.luminanceMat);
    this.quad.frustumCulled = false;
    this.fsScene = new THREE.Scene();
    this.fsScene.add(this.quad);
    this.fsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  // Width/height in CSS pixels, not drawing-buffer pixels: the halo is a
  // blur, so rendering it at the screen's device pixel ratio buys nothing
  // visible and would multiply its cost by dpr² — 2.25x on the 150%-scaled
  // displays common on budget laptops. The sharp lines still render at full
  // DPR. Mips start at `blurScale` of the screen, then halve per level.
  setSize(width, height) {
    const sw = Math.max(1, Math.round(width * this.sourceScale));
    const sh = Math.max(1, Math.round(height * this.sourceScale));
    this.source.setSize(sw, sh);
    this.luminance.setSize(sw, sh);
    let w = width * this.blurScale * 2;
    let h = height * this.blurScale * 2;
    for (let i = 0; i < this.down.length; i++) {
      w = Math.max(1, Math.round(w * 0.5));
      h = Math.max(1, Math.round(h * 0.5));
      this.down[i].setSize(w, h);
      if (i < this.up.length) this.up[i].setSize(w, h);
    }
  }

  draw(renderer, material, target) {
    this.quad.material = material;
    renderer.setRenderTarget(target);
    renderer.render(this.fsScene, this.fsCamera);
  }

  // Renders the scene's glow into the mip chain. Expects autoClear off.
  renderGlow(renderer, scene, camera) {
    renderer.setRenderTarget(this.source);
    renderer.clear();
    renderer.render(scene, camera);

    this.luminanceMat.uniforms.inputBuffer.value = this.source.texture;
    this.draw(renderer, this.luminanceMat, this.luminance);

    let prev = this.luminance;
    const du = this.downMat.uniforms;
    for (const mip of this.down) {
      du.texelSize.value.set(1 / prev.width, 1 / prev.height);
      du.inputBuffer.value = prev.texture;
      this.draw(renderer, this.downMat, mip);
      prev = mip;
    }
    const uu = this.upMat.uniforms;
    for (let i = this.up.length - 1; i >= 0; i--) {
      uu.texelSize.value.set(1 / prev.width, 1 / prev.height);
      uu.inputBuffer.value = prev.texture;
      uu.supportBuffer.value = this.down[i].texture;
      this.draw(renderer, this.upMat, this.up[i]);
      prev = this.up[i];
    }
  }

  // Adds the glow onto whatever is currently on screen.
  composite(renderer) {
    this.compositeMat.uniforms.map.value = this.up[0].texture;
    this.draw(renderer, this.compositeMat, null);
  }

  dispose() {
    [this.source, this.luminance, ...this.down, ...this.up].forEach((t) => t.dispose());
    [this.luminanceMat, this.downMat, this.upMat, this.compositeMat].forEach((m) => m.dispose());
  }
}
