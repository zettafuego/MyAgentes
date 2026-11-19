import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { audio } from '../lib/audio';
import type { SuitTheme } from '../lib/theme';
import { themeHex, themeParticleHex, themePitch, themeSecondaryHex } from '../lib/theme';

const CAMERA_PATH = [
  {
    progress: 0,
    cameraPos: new THREE.Vector3(0, 0.8, 6.5),
    lookAt: new THREE.Vector3(0, 0.8, 0),
    modelRotY: 0,
    modelOffsetY: 0.6,
  },
  {
    progress: 0.25,
    cameraPos: new THREE.Vector3(0, 1.4, 2.2),
    lookAt: new THREE.Vector3(0, 1.5, 0.38),
    modelRotY: 0,
    modelOffsetY: 0.8,
  },
  {
    progress: 0.5,
    cameraPos: new THREE.Vector3(1.2, 0.3, 1.8),
    lookAt: new THREE.Vector3(0, 0.3, 0.5),
    modelRotY: -0.4,
    modelOffsetY: 0.4,
  },
  {
    progress: 0.75,
    cameraPos: new THREE.Vector3(-1.4, -0.4, -2.4),
    lookAt: new THREE.Vector3(0, -0.6, -0.7),
    modelRotY: Math.PI,
    modelOffsetY: 0,
  },
  {
    progress: 1,
    cameraPos: new THREE.Vector3(0, 0.8, 6.5),
    lookAt: new THREE.Vector3(0, 0.8, 0),
    modelRotY: Math.PI * 2,
    modelOffsetY: 0.6,
  },
];

/** Escala base del astronauta: 120% más grande que la versión original (0.9 → 1.98) */
const MODEL_BASE_SCALE = 0.9 * 2.2;

/** Oscilación Y del modelo educhamba: ±30° */
const CHAMBA_YAW_DEG = 30;
/** Escala máxima de educhamba en el intro (tras normalizar el GLB) */
const CHAMBA_PRESENT_SCALE = 1.35;

/**
 * Secuencia intro (segundos desde que carga educhamba):
 * 0 → growEnd: crece al centro
 * growEnd → holdEnd: se mantiene grande
 * holdEnd → fadeEnd: se achica y desaparece
 * fadeEnd → astroEnd: entra astronaut.glb
 */
const INTRO = {
  growEnd: 2.6,
  holdEnd: 3.5,
  fadeEnd: 4.8,
  astroEnd: 6.4,
} as const;

interface Props {
  onActivate: () => void;
  isThinking: boolean;
  suitTheme: SuitTheme;
  warpSpeed: number;
  isFirstPerson: boolean;
  /** Si true, el modelo gira continuamente sobre su eje Y */
  modelSpinning?: boolean;
}

export function Scene3D({
  onActivate,
  isThinking,
  suitTheme,
  warpSpeed,
  isFirstPerson,
  modelSpinning = false,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const thinkingRef = useRef(isThinking);
  const themeRef = useRef(suitTheme);
  const warpRef = useRef(warpSpeed);
  const activateRef = useRef(onActivate);
  const fpRef = useRef(isFirstPerson);
  const spinRef = useRef(modelSpinning);

  useEffect(() => {
    thinkingRef.current = isThinking;
  }, [isThinking]);
  useEffect(() => {
    themeRef.current = suitTheme;
  }, [suitTheme]);
  useEffect(() => {
    warpRef.current = warpSpeed;
  }, [warpSpeed]);
  useEffect(() => {
    activateRef.current = onActivate;
  }, [onActivate]);
  useEffect(() => {
    fpRef.current = isFirstPerson;
  }, [isFirstPerson]);
  useEffect(() => {
    spinRef.current = modelSpinning;
  }, [modelSpinning]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.FogExp2('#050505', 0.08);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.15);
    const composer = new EffectComposer(renderer);
    composer.setSize(w, h);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    scene.add(new THREE.HemisphereLight('#1e293b', '#0a0a0a', 1.1));

    const spot = new THREE.SpotLight('#ffffff', 6);
    spot.position.set(-8, 6, -3);
    spot.angle = Math.PI / 4;
    spot.penumbra = 0.8;
    spot.castShadow = true;
    scene.add(spot);

    const key = new THREE.DirectionalLight('#ffffff', 1.6);
    key.position.set(5, 5, 8);
    scene.add(key);

    const fill = new THREE.DirectionalLight('#e0f2fe', 0.9);
    fill.position.set(-5, 3, 5);
    scene.add(fill);

    const pointBlue = new THREE.PointLight('#3b82f6', 3, 15);
    pointBlue.position.set(4, 3, 5);
    scene.add(pointBlue);

    const pointPurple = new THREE.PointLight('#a855f7', 1.5, 20);
    pointPurple.position.set(6, -6, -4);
    scene.add(pointPurple);

    // Astronaut group with wireframe placeholder
    const modelRoot = new THREE.Group();
    const placeholderGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const placeholderMat = new THREE.MeshBasicMaterial({ color: '#3b82f6', wireframe: true });
    const placeholder = new THREE.Mesh(placeholderGeo, placeholderMat);
    modelRoot.add(placeholder);
    // Astronauta oculto hasta que termine la secuencia de educhamba
    modelRoot.scale.set(0, 0, 0);
    modelRoot.position.set(-0.55, 0.8, 0);
    modelRoot.visible = false;
    scene.add(modelRoot);

    // ── educhamba.glb: aparece primero → crece → desaparece → luego astronaut ──
    const chambaRoot = new THREE.Group();
    chambaRoot.position.set(0.1, 0.5, 0.2);
    chambaRoot.scale.set(0.01, 0.01, 0.01);
    chambaRoot.visible = false;
    scene.add(chambaRoot);
    let chambaReady = false;
    let introDone = false;

    // ── PC 3D procedural (torre + monitor + teclado + base) ──
    // También oculta hasta que entre el astronauta
    const pcRoot = new THREE.Group();
    pcRoot.position.set(1.65, 0.15, 0.35);
    pcRoot.rotation.y = -0.45;
    pcRoot.scale.set(0, 0, 0);
    pcRoot.visible = false;
    scene.add(pcRoot);

    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1f,
      metalness: 0.65,
      roughness: 0.35,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a32,
      metalness: 0.8,
      roughness: 0.25,
    });
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0a1628,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.55,
      metalness: 0.2,
      roughness: 0.4,
    });
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0xe879f9,
      emissive: 0xe879f9,
      emissiveIntensity: 1.2,
      roughness: 0.3,
    });

    // Desk base
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.85), metalMat);
    desk.position.set(0, -0.55, 0.05);
    desk.castShadow = true;
    desk.receiveShadow = true;
    pcRoot.add(desk);

    // Tower
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.95, 0.55), chassisMat);
    tower.position.set(-0.42, -0.02, 0);
    tower.castShadow = true;
    tower.receiveShadow = true;
    pcRoot.add(tower);
    // Front panel glass
    const frontGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.7, 0.42),
      new THREE.MeshStandardMaterial({
        color: 0x111118,
        metalness: 0.4,
        roughness: 0.15,
        transparent: true,
        opacity: 0.85,
      }),
    );
    frontGlass.position.set(-0.22, 0.02, 0);
    pcRoot.add(frontGlass);
    // RGB strip on tower
    const rgbStrip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.55, 0.02), ledMat);
    rgbStrip.position.set(-0.22, 0.05, 0.22);
    pcRoot.add(rgbStrip);
    // Power LED
    const powerLed = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), ledMat);
    powerLed.position.set(-0.22, -0.35, 0.18);
    pcRoot.add(powerLed);

    // Monitor stand + bezel + screen
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.28, 12), metalMat);
    stand.position.set(0.28, -0.28, 0.05);
    stand.castShadow = true;
    pcRoot.add(stand);
    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 20), metalMat);
    basePlate.position.set(0.28, -0.42, 0.05);
    pcRoot.add(basePlate);
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.58, 0.06), chassisMat);
    bezel.position.set(0.28, 0.12, 0.05);
    bezel.castShadow = true;
    pcRoot.add(bezel);
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.48, 0.02), screenMat);
    screen.position.set(0.28, 0.12, 0.09);
    pcRoot.add(screen);
    // Screen glow light
    const screenLight = new THREE.PointLight(0x22d3ee, 1.2, 3.5);
    screenLight.position.set(0.28, 0.12, 0.45);
    pcRoot.add(screenLight);

    // Keyboard
    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.035, 0.28), metalMat);
    keyboard.position.set(0.22, -0.48, 0.28);
    keyboard.castShadow = true;
    pcRoot.add(keyboard);
    const keys = new THREE.Mesh(
      new THREE.BoxGeometry(0.64, 0.02, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x0f0f14, metalness: 0.3, roughness: 0.5 }),
    );
    keys.position.set(0.22, -0.455, 0.28);
    pcRoot.add(keys);

    // Mouse
    const mouse = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.04, 0.06, 4, 8),
      new THREE.MeshStandardMaterial({ color: 0x15151a, metalness: 0.5, roughness: 0.4 }),
    );
    mouse.rotation.z = Math.PI / 2;
    mouse.position.set(0.72, -0.48, 0.28);
    pcRoot.add(mouse);

    // Label "ZETTA" floating on screen via simple planes
    pcRoot.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).castShadow = true;
        (obj as THREE.Mesh).receiveShadow = true;
      }
    });

    const enhanceMesh = (obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            if (mat.color.r === 0 && mat.color.g === 0 && mat.color.b === 0) {
              mat.color.setHex(0xd1d5db);
            }
            mat.roughness = Math.max(Math.min(mat.roughness, 0.4), 0.1);
            mat.metalness = Math.max(Math.min(mat.metalness, 0.6), 0.1);
          }
        });
      }
    };

    new GLTFLoader().load(
      '/astronaut.glb',
      (gltf) => {
        while (modelRoot.children.length > 0) {
          modelRoot.remove(modelRoot.children[0]);
        }
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        model.position.sub(center);
        // Normaliza el GLB; el tamaño final lo define MODEL_BASE_SCALE (×2.2 = +120%)
        const scale = 2.4 / (Math.max(size.x, size.y, size.z) || 1);
        const wrap = new THREE.Group();
        wrap.add(model);
        wrap.scale.set(scale, scale, scale);
        wrap.position.set(0, -0.35, 0);
        model.traverse(enhanceMesh);
        modelRoot.add(wrap);
        // shift astronaut slightly left so PC has room
        modelRoot.position.x = -0.55;
        console.log('🚀 Custom GLB astronaut model loaded');
      },
      undefined,
      (err) => {
        console.warn('ℹ️ astronaut.glb not loaded. Using procedural placeholder.', err);
      },
    );

    // Modelo educhamba — primera pantalla, girando ±30° y zoom al centro
    new GLTFLoader().load(
      '/educhamba.glb',
      (gltf) => {
        while (chambaRoot.children.length > 0) {
          chambaRoot.remove(chambaRoot.children[0]);
        }
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const fit = 2.6 / maxDim;
        const wrap = new THREE.Group();
        wrap.add(model);
        wrap.scale.set(fit, fit, fit);
        wrap.position.set(0, -0.15, 0);
        model.traverse(enhanceMesh);
        chambaRoot.add(wrap);
        chambaRoot.visible = true;
        chambaReady = true;
        console.log('🧑 educhamba.glb loaded — intro: crece → desaparece → astronaut');
      },
      undefined,
      (err) => {
        console.warn('ℹ️ educhamba.glb no se pudo cargar. Mostrando astronauta directo.', err);
        // Fallback: si no hay chamba, el astronauta entra de inmediato
        chambaReady = false;
        introDone = true;
        modelRoot.visible = true;
        pcRoot.visible = true;
      },
    );

    // Warp particles (streak lines rebuilt each frame via positions buffer)
    const COUNT = 450;
    const positions = new Float32Array(COUNT * 2 * 3);
    const particles: { x: number; y: number; z: number; speed: number }[] = [];
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 28;
      const z = -Math.random() * 55;
      const speed = 0.05 + Math.random() * 0.15;
      particles.push({ x, y, z, speed });
      const base = i * 6;
      positions[base] = x;
      positions[base + 1] = y;
      positions[base + 2] = z;
      positions[base + 3] = x;
      positions[base + 4] = y;
      positions[base + 5] = z - 0.5;
    }
    const lineGeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', posAttr);

    const particleMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleLines = new THREE.LineSegments(lineGeo, particleMat);
    scene.add(particleLines);

    let speedSmoothed = 1;
    let bloomSmoothed = 1;
    let mouseX = 0;
    let mouseY = 0;
    let smoothMX = 0;
    let smoothMY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / el.clientWidth - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / el.clientHeight - 0.5) * 2;
    };
    el.addEventListener('mousemove', onMove);

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hitTest = (cx: number, cy: number) => {
      const rect = el.getBoundingClientRect();
      ndc.x = ((cx - rect.left) / el.clientWidth) * 2 - 1;
      ndc.y = -((cy - rect.top) / el.clientHeight) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hitsAstro = raycaster.intersectObjects(modelRoot.children, true).length > 0;
      const hitsPc = raycaster.intersectObjects(pcRoot.children, true).length > 0;
      const hitsChamba =
        chambaRoot.visible &&
        raycaster.intersectObjects(chambaRoot.children, true).length > 0;
      return hitsAstro || hitsPc || hitsChamba;
    };
    const onClick = (e: MouseEvent) => {
      if (hitTest(e.clientX, e.clientY)) {
        audio.playUplinkSweep();
        activateRef.current();
      }
    };
    const onHover = (e: MouseEvent) => {
      const hit = hitTest(e.clientX, e.clientY);
      hoverRef.current = hit;
      el.style.cursor = hit ? 'pointer' : 'default';
    };
    el.addEventListener('click', onClick);
    el.addEventListener('mousemove', onHover);

    const ro = new ResizeObserver(() => {
      if (!el) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      composer.setSize(nw, nh);
    });
    ro.observe(el);

    const camPos = new THREE.Vector3(0, 0.8, 6.5);
    const lookPos = new THREE.Vector3(0, 0.8, 0);
    let rotY = 0;
    let offsetY = 0.6;
    let pitchBias = 0;
    let particleTilt = 0;
    /** Escala del astronauta: arranca en 0 hasta que termine el intro de educhamba */
    let scaleTarget = 0;
    /** Ángulo extra de rotación en el eje Y (botón "Girar modelo") */
    let spinAngle = 0;
    let raf = 0;
    const t0 = performance.now();
    let last = t0;
    /** Reloj local de la secuencia intro (s) */
    let introClock = 0;
    let introClockRunning = false;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const t = (now - t0) * 0.001;
      const dt = (now - last) * 0.001;
      last = now;

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      let a = CAMERA_PATH[0];
      let b = CAMERA_PATH[CAMERA_PATH.length - 1];
      for (let i = 0; i < CAMERA_PATH.length - 1; i++) {
        if (progress >= CAMERA_PATH[i].progress && progress <= CAMERA_PATH[i + 1].progress) {
          a = CAMERA_PATH[i];
          b = CAMERA_PATH[i + 1];
          break;
        }
      }
      const local = (progress - a.progress) / (b.progress - a.progress || 1);
      const ease = (1 - Math.cos(local * Math.PI)) / 2;
      const pathCam = new THREE.Vector3().lerpVectors(a.cameraPos, b.cameraPos, ease);
      const pathLook = new THREE.Vector3().lerpVectors(a.lookAt, b.lookAt, ease);
      const pathRot = THREE.MathUtils.lerp(a.modelRotY, b.modelRotY, ease);
      const pathOffY = THREE.MathUtils.lerp(a.modelOffsetY, b.modelOffsetY, ease);

      const floatY = Math.sin(t * 0.85) * 0.18 + Math.cos(t * 1.95) * 0.04 + Math.sin(t * 0.31) * 0.08;
      const floatX = Math.cos(t * 0.67) * 0.14 + Math.sin(t * 1.43) * 0.03 + Math.cos(t * 0.23) * 0.06;
      const floatZ = Math.sin(t * 0.41) * 0.1 + Math.cos(t * 1.13) * 0.02 + Math.sin(t * 0.15) * 0.05;

      const targetCam = new THREE.Vector3();
      const targetLook = new THREE.Vector3();
      let targetRot = 0;
      let targetOffY = 0.6;

      if (fpRef.current) {
        targetCam.set(floatX, offsetY + floatY + 0.12, floatZ + 0.35);
        targetLook.set(0, 0.12, 15);
        targetRot = 0;
        targetOffY = 0.6;
      } else {
        targetCam.copy(pathCam);
        targetLook.copy(pathLook);
        targetRot = pathRot;
        targetOffY = pathOffY;
      }

      const k = 0.05;
      camPos.lerp(targetCam, k);
      lookPos.lerp(targetLook, k);
      rotY += (targetRot - rotY) * k;
      offsetY += (targetOffY - offsetY) * k;

      // ── Intro: educhamba primero → grande → desaparece → astronaut ──
      if (chambaReady && !introClockRunning && !introDone) {
        introClockRunning = true;
        introClock = 0;
      }
      // Si chamba nunca carga, introDone ya true por fallback
      if (introClockRunning && !introDone) {
        introClock += dt;
      }

      const ic = introClock;
      let chambaScaleMul = 0;
      let showChamba = false;
      let astroReveal = 0; // 0..1 entrada del astronauta

      if (!introDone && chambaReady) {
        const yawRad = THREE.MathUtils.degToRad(CHAMBA_YAW_DEG);
        chambaRoot.position.x = 0.08 + Math.sin(t * 0.4) * 0.03;
        chambaRoot.position.y = 0.5 + Math.sin(t * 0.9) * 0.05;
        chambaRoot.rotation.y = Math.sin(t * 0.85) * yawRad;
        chambaRoot.rotation.x = Math.sin(t * 0.35) * 0.04;
        chambaRoot.rotation.z = Math.cos(t * 0.4) * 0.03;

        if (ic < INTRO.growEnd) {
          // 1) Aparece y se hace grande + zoom al centro
          showChamba = true;
          const p = ic / INTRO.growEnd;
          const ease = 1 - Math.pow(1 - p, 3);
          chambaScaleMul = THREE.MathUtils.lerp(0.2, 1, ease);
          chambaRoot.position.z = THREE.MathUtils.lerp(1.6, 0.1, ease);
        } else if (ic < INTRO.holdEnd) {
          // 2) Se mantiene grande un momento
          showChamba = true;
          chambaScaleMul = 1 + Math.sin((ic - INTRO.growEnd) * 4) * 0.04;
          chambaRoot.position.z = 0.1;
        } else if (ic < INTRO.fadeEnd) {
          // 3) Se hace más grande un instante y desaparece
          showChamba = true;
          const p = (ic - INTRO.holdEnd) / (INTRO.fadeEnd - INTRO.holdEnd);
          const ease = p * p; // accel out
          // pico de escala y luego colapso
          chambaScaleMul = THREE.MathUtils.lerp(1.15, 0, ease);
          chambaRoot.position.z = THREE.MathUtils.lerp(0.1, -0.4, ease);
        } else if (ic < INTRO.astroEnd) {
          // 4) Chamba fuera; entra astronauta
          showChamba = false;
          chambaScaleMul = 0;
          const p = (ic - INTRO.fadeEnd) / (INTRO.astroEnd - INTRO.fadeEnd);
          astroReveal = 1 - Math.pow(1 - p, 2.5);
        } else {
          // Secuencia completa
          showChamba = false;
          chambaScaleMul = 0;
          astroReveal = 1;
          introDone = true;
          introClockRunning = false;
        }
      } else if (introDone) {
        showChamba = false;
        chambaScaleMul = 0;
        astroReveal = 1;
      } else {
        // Esperando a que cargue educhamba
        showChamba = false;
        astroReveal = 0;
      }

      // Primera persona: oculta modelos de presentación
      if (fpRef.current) {
        showChamba = false;
        astroReveal = 0;
      }

      chambaRoot.visible = showChamba && chambaScaleMul > 0.01;
      if (chambaRoot.visible) {
        const breath = 1 + Math.sin(t * 0.75) * 0.05;
        chambaRoot.scale.setScalar(
          Math.max(CHAMBA_PRESENT_SCALE * chambaScaleMul * breath, 0.001),
        );
      } else {
        chambaRoot.scale.setScalar(0.001);
      }

      // Astronauta solo tras el intro (o si no hay chamba)
      const scaleGoal = fpRef.current ? 0 : MODEL_BASE_SCALE * astroReveal;
      scaleTarget += (scaleGoal - scaleTarget) * 0.08;
      modelRoot.visible = scaleTarget > 0.02 && astroReveal > 0.01;
      modelRoot.scale.set(scaleTarget, scaleTarget, scaleTarget);
      modelRoot.position.y = offsetY + floatY;
      modelRoot.position.x = -0.55 + floatX * 0.35;
      modelRoot.position.z = floatZ;

      // Rotación en su propio eje Y (toggle con botón)
      if (spinRef.current && introDone) {
        spinAngle += dt * 1.15;
      }

      // PC entra junto con el astronauta
      const pcScale = fpRef.current ? 0 : astroReveal;
      pcRoot.visible = pcScale > 0.02;
      pcRoot.scale.setScalar(THREE.MathUtils.lerp(pcRoot.scale.x || 0, pcScale, 0.08));
      pcRoot.position.x = 1.65;
      pcRoot.position.y = 0.15 + Math.sin(t * 0.9) * 0.04;
      pcRoot.rotation.y = -0.45 + Math.sin(t * 0.35) * 0.06;
      // Screen pulse (thinking = hot magenta)
      const screenPulse = thinkingRef.current
        ? 0.9 + Math.sin(t * 14) * 0.45
        : 0.45 + Math.sin(t * 2.2) * 0.15;
      screenMat.emissiveIntensity = screenPulse;
      if (thinkingRef.current) {
        screenMat.emissive.setHex(0xe879f9);
        screenLight.color.setHex(0xe879f9);
        screenLight.intensity = 2.2 + Math.sin(t * 12) * 0.6;
        ledMat.emissiveIntensity = 1.6 + Math.sin(t * 10) * 0.5;
      } else {
        const accent = themeHex(themeRef.current);
        screenMat.emissive.setHex(themeRef.current === 'punk' ? 0x22d3ee : 0x7dd3fc);
        screenLight.color.setHex(themeRef.current === 'punk' ? 0x22d3ee : 0x7dd3fc);
        screenLight.intensity = 1.1 + Math.sin(t * 2) * 0.25;
        ledMat.color.setHex(accent);
        ledMat.emissive.setHex(accent);
        ledMat.emissiveIntensity = 1.1 + Math.sin(t * 3) * 0.2;
      }

      const swayY = Math.sin(t * 0.29) * 0.15 + Math.cos(t * 0.71) * 0.03;
      const swayX = Math.cos(t * 0.19) * 0.08 + Math.sin(t * 0.53) * 0.015;
      const swayZ = Math.sin(t * 0.13) * 0.06 + Math.cos(t * 0.37) * 0.012;

      const pitchGoal = themePitch(themeRef.current);
      pitchBias += (pitchGoal - pitchBias) * 0.05;

      modelRoot.rotation.y = rotY + swayY + spinAngle;
      modelRoot.rotation.x = swayX + pitchBias;
      modelRoot.rotation.z = swayZ;

      smoothMX += (mouseX - smoothMX) * 0.06;
      smoothMY += (mouseY - smoothMY) * 0.06;
      // Con spin activo, el mouse no pisa la rotación del eje
      if (!spinRef.current) {
        modelRoot.rotation.y += smoothMX * 0.35;
      }
      modelRoot.rotation.x += -smoothMY * 0.22;

      camera.position.copy(camPos);
      const look = new THREE.Vector3()
        .copy(lookPos)
        .add(new THREE.Vector3(modelRoot.position.x, 0, modelRoot.position.z));
      camera.lookAt(look);

      const colorHex = themeHex(themeRef.current);
      if (placeholder && placeholderMat) {
        placeholder.rotation.y = t * 2;
        placeholder.rotation.x = t * 0.5;
        placeholderMat.color.setHex(thinkingRef.current ? themeSecondaryHex(themeRef.current) : colorHex);
      }

      const particleColor = new THREE.Color();
      particleColor.setHex(themeParticleHex(themeRef.current));
      particleMat.color.lerp(particleColor, 0.08);

      let bloomTarget = 1;
      if (thinkingRef.current) {
        pointBlue.color.setHex(0xa855f7);
        pointBlue.intensity = 10;
        bloomTarget = 1.8 + Math.sin(t * 18) * 0.4;
      } else if (hoverRef.current) {
        pointBlue.color.setHex(colorHex);
        pointBlue.intensity = 8;
        bloomTarget = 1.5 + Math.sin(t * 6.5) * 0.25;
      } else {
        pointBlue.color.setHex(colorHex);
        pointBlue.intensity = 6;
        bloomTarget = 1 + Math.sin(t * 2) * 0.15;
      }
      bloomSmoothed += (bloomTarget - bloomSmoothed) * 0.08;
      bloomPass.strength = bloomSmoothed;

      const warp = warpRef.current || 1;
      const speedGoal = (thinkingRef.current ? 65 : hoverRef.current ? 4 : 1) * warp;
      speedSmoothed += (speedGoal - speedSmoothed) * 0.08;

      const pos = particleLines.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.z += p.speed * speedSmoothed * dt * 45;
        if (p.z > 8) {
          p.z = -55 - Math.random() * 10;
          p.x = (Math.random() - 0.5) * 28;
          p.y = (Math.random() - 0.5) * 28;
          p.speed = 0.05 + Math.random() * 0.15;
        }
        const streak = 0.4 + p.speed * speedSmoothed * 2.2;
        const base = i * 6;
        pos.array[base] = p.x;
        pos.array[base + 1] = p.y;
        pos.array[base + 2] = p.z;
        pos.array[base + 3] = p.x;
        pos.array[base + 4] = p.y;
        pos.array[base + 5] = p.z - streak;
      }
      pos.needsUpdate = true;

      const tiltGoal = themeRef.current === 'punk' ? Math.PI / 5 : 0;
      particleTilt += (tiltGoal - particleTilt) * 0.08;
      particleLines.rotation.x = particleTilt;
      particleLines.rotation.z = t * 0.02;

      composer.render();
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('click', onClick);
      el.removeEventListener('mousemove', onHover);
      composer.dispose();
      if (renderer.domElement && el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
      renderer.dispose();
      placeholderGeo.dispose();
      placeholderMat.dispose();
      particleMat.dispose();
      lineGeo.dispose();
      // cleanup
    };
  }, []);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      id="monolith-canvas-area"
    >
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
