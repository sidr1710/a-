import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Simplex-style 3D noise used to morph the hero blob.
const noiseGLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const blobVertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;
  ${noiseGLSL}
  void main() {
    float n = snoise(normal * 1.4 + uTime * 0.35);
    float displacement = n * uIntensity;
    vec3 pos = position + normal * displacement;
    vNoise = n;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const blobFragment = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;
  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 2.2);
    vec3 violet = vec3(0.49, 0.36, 1.0);
    vec3 cyan = vec3(0.13, 0.85, 0.95);
    vec3 pink = vec3(1.0, 0.35, 0.7);
    float t = 0.5 + 0.5 * sin(uTime * 0.4 + vNoise * 3.0);
    vec3 base = mix(violet, cyan, t);
    base = mix(base, pink, smoothstep(0.3, 1.0, vNoise));
    vec3 color = base * 0.35 + fresnel * mix(cyan, pink, t) * 1.4;
    gl_FragColor = vec4(color, 1.0);
  }
`;

type Props = {
  className?: string;
};

function Scene3D({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07060f, 0.045);

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Morphing hero blob
    const blobUniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0.38 },
    };
    const blob = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.8, 64),
      new THREE.ShaderMaterial({
        uniforms: blobUniforms,
        vertexShader: blobVertex,
        fragmentShader: blobFragment,
      }),
    );

    // Wireframe shell around the blob
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.7, 1),
      new THREE.MeshBasicMaterial({ color: 0x8b7bff, wireframe: true, transparent: true, opacity: 0.18 }),
    );

    // Orbiting rings
    const rings = new THREE.Group();
    const ringColors = [0x22d3ee, 0xa78bfa, 0xf472b6];
    ringColors.forEach((color, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.3 + i * 0.45, 0.012, 16, 200),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 - i * 0.12 }),
      );
      ring.rotation.x = Math.PI / 2 + (i - 1) * 0.5;
      ring.rotation.y = (i - 1) * 0.35;
      rings.add(ring);
    });

    // Small satellites riding the rings
    const satellites: THREE.Mesh[] = [];
    ringColors.forEach((color, i) => {
      const sat = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshBasicMaterial({ color }),
      );
      sat.userData = { radius: 3.3 + i * 0.45, speed: 0.5 - i * 0.12, offset: i * 2 };
      rings.children[i].add(sat);
      satellites.push(sat);
    });

    const heroGroup = new THREE.Group();
    heroGroup.add(blob, shell, rings);
    scene.add(heroGroup);

    // Starfield
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const palette = [new THREE.Color(0xa78bfa), new THREE.Color(0x22d3ee), new THREE.Color(0xffffff)];
    for (let i = 0; i < starCount; i++) {
      const r = 8 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[i % palette.length];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(stars);

    // Floating low-poly shapes scattered in the background
    const floaters = new THREE.Group();
    const floaterGeometries = [
      new THREE.OctahedronGeometry(0.35),
      new THREE.TetrahedronGeometry(0.4),
      new THREE.TorusKnotGeometry(0.22, 0.07, 64, 8),
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
    ];
    for (let i = 0; i < 14; i++) {
      const mesh = new THREE.Mesh(
        floaterGeometries[i % floaterGeometries.length],
        new THREE.MeshStandardMaterial({
          color: ringColors[i % ringColors.length],
          metalness: 0.6,
          roughness: 0.25,
          flatShading: true,
        }),
      );
      const angle = (i / 14) * Math.PI * 2;
      const radius = 5.5 + Math.random() * 3;
      mesh.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 6, Math.sin(angle) * radius - 3);
      mesh.userData = { spin: 0.2 + Math.random() * 0.6, bob: Math.random() * Math.PI * 2 };
      floaters.add(mesh);
    }
    scene.add(floaters);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const keyLight = new THREE.PointLight(0x22d3ee, 40, 30);
    keyLight.position.set(5, 4, 5);
    const rimLight = new THREE.PointLight(0xf472b6, 40, 30);
    rimLight.position.set(-5, -3, 3);
    scene.add(keyLight, rimLight);

    // Interaction state
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0, scroll: 0 };
    let scrollProgress = 0;

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    };
    const onResize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      // Shift the hero object aside on wide screens so it sits next to the copy.
      // On narrow screens, lift it above the copy instead.
      const wide = w > 900;
      heroGroup.position.set(wide ? 2.4 : 0, wide ? 0 : 1.6, 0);
      heroGroup.scale.setScalar(wide ? 1 : 0.6);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onResize();
    onScroll();

    const clock = new THREE.Clock();
    let frame = 0;

    const render = () => {
      const t = reducedMotion ? 0 : clock.getElapsedTime();

      smooth.x += (pointer.x - smooth.x) * 0.05;
      smooth.y += (pointer.y - smooth.y) * 0.05;
      smooth.scroll += (scrollProgress - smooth.scroll) * 0.08;

      blobUniforms.uTime.value = t;
      blobUniforms.uIntensity.value = 0.32 + Math.sin(t * 0.6) * 0.08 + smooth.scroll * 0.3;

      heroGroup.rotation.y = t * 0.15 + smooth.x * 0.6 + smooth.scroll * Math.PI * 1.5;
      heroGroup.rotation.x = smooth.y * 0.35 + smooth.scroll * 0.8;
      shell.rotation.y = -t * 0.25;
      shell.rotation.z = t * 0.1;
      rings.rotation.z = t * 0.12;

      satellites.forEach((sat) => {
        const { radius, speed, offset } = sat.userData as { radius: number; speed: number; offset: number };
        const a = t * speed + offset;
        sat.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
      });

      floaters.children.forEach((m) => {
        const { spin, bob } = m.userData as { spin: number; bob: number };
        m.rotation.x = t * spin;
        m.rotation.y = t * spin * 0.7;
        m.position.y += Math.sin(t + bob) * 0.002;
      });
      floaters.rotation.y = t * 0.03 + smooth.scroll * 1.2;

      stars.rotation.y = t * 0.01;
      stars.rotation.x = smooth.scroll * 0.4;

      camera.position.x = smooth.x * 0.8;
      camera.position.y = -smooth.y * 0.5 - smooth.scroll * 1.5;
      camera.position.z = 9 - smooth.scroll * 2;
      camera.lookAt(0, -smooth.scroll * 1.5, 0);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const mat = obj.material as THREE.Material | THREE.Material[];
          (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}

export default Scene3D;
