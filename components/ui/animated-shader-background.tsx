
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AnoAI = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let mesh: THREE.Mesh | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let frameId: number;

    const init = () => {
      try {
        renderer = new THREE.WebGLRenderer({ 
          antialias: false, // Disable antialias to save resources
          alpha: true,
          powerPreference: "low-power" // Be gentle on the GPU
        });
        
        // Handle context loss specifically
        renderer.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          if (frameId) cancelAnimationFrame(frameId);
          console.warn('WebGL context lost. Animating background disabled.');
        }, false);

      } catch (e) {
        console.warn("WebGL initialization failed: ", e);
        return;
      }

      scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio for performance
      container.appendChild(renderer.domElement);

      material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float iTime;
          uniform vec2 iResolution;

          #define NUM_OCTAVES 2

          float rand(vec2 n) {
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }

          float noise(vec2 p) {
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);
            float res = mix(
              mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
              mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
            return res * res;
          }

          float fbm(vec2 x) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100.0);
            for (int i = 0; i < NUM_OCTAVES; ++i) {
              v += a * noise(x);
              x = x * 2.0 + shift;
              a *= 0.5;
            }
            return v;
          }

          vec4 my_tanh(vec4 x) {
            vec4 exp2x = exp(2.0 * x);
            return (exp2x - 1.0) / (exp2x + 1.0);
          }

          void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec2 p = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y;
            
            p *= 4.0;
            vec2 v;
            vec4 o = vec4(0.0);
            float f = 1.5 + fbm(p + vec2(iTime * 0.2, 0.0)) * 0.5;

            // Significantly reduced iterations from 35 to 10 to prevent GPU hangs
            for (int i = 0; i < 10; i++) {
              float fi = float(i);
              v = p + cos(fi * 1.5 + (iTime * 0.1 + p.x * 0.05) + fi * vec2(1.2, 1.1)) * 1.5;
              float tailNoise = fbm(v + vec2(iTime * 0.1, fi)) * 0.2;
              
              vec4 color = vec4(
                0.1 + 0.1 * sin(fi * 0.5 + iTime * 0.2),
                0.2 + 0.1 * cos(fi * 0.3 + iTime * 0.3),
                0.4 + 0.3 * sin(fi * 0.1 + iTime * 0.1),
                1.0
              );
              
              float dist = length(v);
              o += color * 0.05 / (dist + 0.1) * (1.0 + tailNoise);
            }

            o = my_tanh(o * 1.5);
            gl_FragColor = vec4(o.rgb, 0.4 * o.a);
          }
        `,
        transparent: true,
      });

      geometry = new THREE.PlaneGeometry(2, 2);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const animate = () => {
        if (!renderer || !material) return;
        material.uniforms.iTime.value += 0.005;
        renderer.render(scene!, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();
    };

    init();

    const handleResize = () => {
      if (renderer && material) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (renderer) {
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      renderer = null;
      scene = null;
      mesh = null;
      geometry = null;
      material = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none opacity-50 bg-black" />
  );
};

export default AnoAI;
