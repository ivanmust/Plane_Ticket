import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, RotateCw, Eye, Sparkles, X, Compass } from 'lucide-react';

interface ThreeJetViewerProps {
  onClose?: () => void;
  isModal?: boolean;
}

type FinishColor = {
  name: string;
  hullColor: number;
  accentColor: number;
  metalness: number;
  roughness: number;
  clearcoat: number;
  badgeHex: string;
};

const FINISHES: FinishColor[] = [
  {
    name: 'Obsidian Midnight',
    hullColor: 0x181c24,
    accentColor: 0x0f131a,
    metalness: 0.85,
    roughness: 0.18,
    clearcoat: 0.9,
    badgeHex: '#181c24',
  },
  {
    name: 'Pure Alpine',
    hullColor: 0xf5f7fa,
    accentColor: 0x202a36,
    metalness: 0.3,
    roughness: 0.22,
    clearcoat: 0.95,
    badgeHex: '#f5f7fa',
  },
  {
    name: 'Titanium Champagne',
    hullColor: 0xc8bcad,
    accentColor: 0x423c35,
    metalness: 0.8,
    roughness: 0.25,
    clearcoat: 0.85,
    badgeHex: '#c8bcad',
  },
  {
    name: 'Aero Navy',
    hullColor: 0x1a2639,
    accentColor: 0xd4af37,
    metalness: 0.75,
    roughness: 0.2,
    clearcoat: 0.9,
    badgeHex: '#1a2639',
  },
];

// Pre-allocate reusable scratch objects outside the tick loop for 60fps zero-GC
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _currLookAt = new THREE.Vector3(0, 0, 0);

export const ThreeJetViewer: React.FC<ThreeJetViewerProps> = ({ onClose, isModal = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFinish, setSelectedFinish] = useState<number>(0);
  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [cameraPreset, setCameraPreset] = useState<'cinematic' | 'front' | 'wing' | 'top'>('cinematic');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);

  // References to procedural sub-parts for exploded view animation
  const jetPartsRef = useRef<{
    fuselage: THREE.Mesh;
    cockpitGlass: THREE.Mesh;
    wings: THREE.Mesh;
    wingletLeft: THREE.Mesh;
    wingletRight: THREE.Mesh;
    engineLeft: THREE.Group;
    engineRight: THREE.Group;
    tailFin: THREE.Mesh;
    tTailWing: THREE.Mesh;
    windowsGroup: THREE.Group;
    shadowPlane: THREE.Mesh;
  } | null>(null);

  const materialsRef = useRef<{
    hullMat: THREE.MeshPhysicalMaterial;
    accentMat: THREE.MeshPhysicalMaterial;
    glassMat: THREE.MeshPhysicalMaterial;
    engineIntakeMat: THREE.MeshStandardMaterial;
    engineCoreMat: THREE.MeshStandardMaterial;
  } | null>(null);

  const interactionRef = useRef({
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    rotX: 0.2,
    rotY: -0.6,
    targetRotX: 0.2,
    targetRotY: -0.6,
    explodedVal: 0,
    targetExplodedVal: 0,
    autoRotateSpeed: 0.003,
  });

  // Sync state into ref for tick loop
  useEffect(() => {
    interactionRef.current.targetExplodedVal = explodedFactor;
  }, [explodedFactor]);

  // Update materials when finish changes
  useEffect(() => {
    if (!materialsRef.current) return;
    const finish = FINISHES[selectedFinish];
    const { hullMat, accentMat } = materialsRef.current;

    hullMat.color.setHex(finish.hullColor);
    hullMat.metalness = finish.metalness;
    hullMat.roughness = finish.roughness;
    hullMat.clearcoat = finish.clearcoat;

    accentMat.color.setHex(finish.accentColor);
    accentMat.metalness = finish.metalness * 0.9;
    accentMat.roughness = finish.roughness * 1.1;
  }, [selectedFinish]);

  // Set camera target based on preset
  useEffect(() => {
    switch (cameraPreset) {
      case 'cinematic':
        _targetCamPos.set(14, 6, 16);
        _targetLookAt.set(0, 0, 0);
        break;
      case 'front':
        _targetCamPos.set(0, 2, 22);
        _targetLookAt.set(0, 0.5, 0);
        break;
      case 'wing':
        _targetCamPos.set(19, 3, 2);
        _targetLookAt.set(0, 0, 0);
        break;
      case 'top':
        _targetCamPos.set(0, 24, 4);
        _targetLookAt.set(0, 0, 0);
        break;
    }
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f4f8);
    scene.fog = new THREE.FogExp2(0xf1f4f8, 0.015);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(14, 6, 16);
    _targetCamPos.copy(camera.position);

    // 2. Renderer with ACESFilmicToneMapping & SRGBColorSpace
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig: Warm Key Light + Cool Hemisphere Fill + Accent Rim
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    keyLight.position.set(12, 18, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 50;
    const d = 12;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xdfe7f2, 0x94a3b8, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xcfd8dc, 1.4);
    rimLight.position.set(-14, 8, -12);
    scene.add(rimLight);

    // 5. Procedural Materials
    const initialFinish = FINISHES[0];
    const hullMat = new THREE.MeshPhysicalMaterial({
      color: initialFinish.hullColor,
      metalness: initialFinish.metalness,
      roughness: initialFinish.roughness,
      clearcoat: initialFinish.clearcoat,
      clearcoatRoughness: 0.1,
    });

    const accentMat = new THREE.MeshPhysicalMaterial({
      color: initialFinish.accentColor,
      metalness: 0.75,
      roughness: 0.22,
      clearcoat: 0.8,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x111625,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.7,
      ior: 1.52,
      thickness: 0.4,
      transparent: true,
      opacity: 0.85,
    });

    const engineIntakeMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      metalness: 0.9,
      roughness: 0.2,
    });

    const engineCoreMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // golden turbine fan blades
      metalness: 0.8,
      roughness: 0.3,
    });

    materialsRef.current = {
      hullMat,
      accentMat,
      glassMat,
      engineIntakeMat,
      engineCoreMat,
    };

    // 6. Build Composite 3-12 Part Procedural Jet Model (THREE.Group)
    const jetGroup = new THREE.Group();
    jetGroup.position.set(0, 1.8, 0);

    // Part 1: Fuselage (Aerodynamic slender fuselage)
    // Create lofted fuselage with LatheGeometry or procedural points
    const fuselagePoints: THREE.Vector2[] = [];
    const fuselageLength = 16;
    for (let i = 0; i <= 36; i++) {
      const t = i / 36; // 0 (nose) to 1 (tail)
      const z = (0.5 - t) * fuselageLength;
      let r = 0;
      if (t < 0.15) {
        // Nose taper
        r = Math.sin((t / 0.15) * (Math.PI / 2)) * 0.95;
      } else if (t < 0.65) {
        // Main cabin body
        r = 0.95 + Math.sin(((t - 0.15) / 0.5) * Math.PI) * 0.08;
      } else {
        // Rear taper to tail cone
        const tailT = (t - 0.65) / 0.35;
        r = (1 - tailT) * 0.95 + 0.12 * Math.cos(tailT * 0.5);
      }
      fuselagePoints.push(new THREE.Vector2(Math.max(0.01, r), z));
    }
    const fuselageGeo = new THREE.LatheGeometry(fuselagePoints, 32);
    // Orient fuselage along Z axis (nose pointing +Z)
    fuselageGeo.rotateX(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeo, hullMat);
    fuselage.castShadow = true;
    fuselage.receiveShadow = true;
    jetGroup.add(fuselage);

    // Part 2: Cockpit Glass Canopy
    const cockpitGeo = new THREE.SphereGeometry(0.96, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.38);
    cockpitGeo.scale(0.85, 0.45, 1.8);
    cockpitGeo.rotateX(-0.1);
    const cockpitGlass = new THREE.Mesh(cockpitGeo, glassMat);
    cockpitGlass.position.set(0, 0.65, 4.3);
    jetGroup.add(cockpitGlass);

    // Part 3: Swept Main Wings (Extruded aerodynamic profile with dihedral)
    const wingShape = new THREE.Shape();
    // Half wing profile: Root to wingtip with sweepback
    wingShape.moveTo(0, -1.8);
    wingShape.lineTo(10.8, -4.8);
    wingShape.lineTo(10.5, -5.3);
    wingShape.lineTo(0, -3.8);
    wingShape.closePath();

    const wingExtrudeSettings = {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);
    wingGeo.center();
    wingGeo.rotateX(-Math.PI / 2);

    // Left & Right Wings (combined into one symmetrical mesh)
    const wingsCombinedGeo = new THREE.BufferGeometry();
    const wingLeft = wingGeo.clone();
    wingLeft.rotateZ(0.04); // slight positive dihedral
    const wingRight = wingGeo.clone();
    wingRight.scale(-1, 1, 1);
    wingRight.rotateZ(-0.04);

    // Grouping wings mesh
    const wingsGroup = new THREE.Group();
    const wingLMesh = new THREE.Mesh(wingLeft, hullMat);
    const wingRMesh = new THREE.Mesh(wingRight, hullMat);
    wingLMesh.castShadow = true;
    wingRMesh.castShadow = true;
    wingsGroup.add(wingLMesh);
    wingsGroup.add(wingRMesh);
    wingsGroup.position.set(0, -0.15, 0.5);
    jetGroup.add(wingsGroup);

    // Part 4 & 5: Cant-angle Winglets (left & right)
    const wingletShape = new THREE.Shape();
    wingletShape.moveTo(0, 0);
    wingletShape.lineTo(0.3, 1.4);
    wingletShape.lineTo(0.8, 1.3);
    wingletShape.lineTo(0.6, 0);
    wingletShape.closePath();

    const wingletExtrude = new THREE.ExtrudeGeometry(wingletShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });

    const wingletLeft = new THREE.Mesh(wingletExtrude, accentMat);
    wingletLeft.position.set(10.6, 0.05, -5.2);
    wingletLeft.rotation.set(0.1, 0, -0.35);
    wingletLeft.castShadow = true;
    jetGroup.add(wingletLeft);

    const wingletRight = new THREE.Mesh(wingletExtrude.clone(), accentMat);
    wingletRight.position.set(-10.6, 0.05, -5.2);
    wingletRight.rotation.set(0.1, 0, 0.35);
    wingletRight.scale.set(-1, 1, 1);
    wingletRight.castShadow = true;
    jetGroup.add(wingletRight);

    // Part 6 & 7: Twin Turbofan Jet Engines
    const createEngine = (isRight: boolean) => {
      const engineGroup = new THREE.Group();

      // Outer nacelle cylinder with curve
      const nacelleGeo = new THREE.CylinderGeometry(0.55, 0.48, 3.4, 28);
      nacelleGeo.rotateX(Math.PI / 2);
      const nacelle = new THREE.Mesh(nacelleGeo, hullMat);
      nacelle.castShadow = true;
      engineGroup.add(nacelle);

      // Intake ring (front chrome/accent lip)
      const intakeRingGeo = new THREE.TorusGeometry(0.54, 0.08, 16, 28);
      const intakeRing = new THREE.Mesh(intakeRingGeo, accentMat);
      intakeRing.position.set(0, 0, 1.7);
      engineGroup.add(intakeRing);

      // Interior dark intake tunnel
      const interiorGeo = new THREE.CylinderGeometry(0.48, 0.4, 1.2, 24);
      interiorGeo.rotateX(Math.PI / 2);
      const interior = new THREE.Mesh(interiorGeo, engineIntakeMat);
      interior.position.set(0, 0, 1.1);
      engineGroup.add(interior);

      // Turbine fan spinner
      const fanSpinnerGeo = new THREE.ConeGeometry(0.18, 0.5, 18);
      fanSpinnerGeo.rotateX(Math.PI / 2);
      const fanSpinner = new THREE.Mesh(fanSpinnerGeo, engineCoreMat);
      fanSpinner.position.set(0, 0, 1.15);
      engineGroup.add(fanSpinner);

      // Exhaust nozzle cone
      const exhaustGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.8, 24);
      exhaustGeo.rotateX(Math.PI / 2);
      const exhaust = new THREE.Mesh(exhaustGeo, engineIntakeMat);
      exhaust.position.set(0, 0, -1.9);
      engineGroup.add(exhaust);

      // Engine pylon connecting nacelle to fuselage
      const pylonGeo = new THREE.BoxGeometry(0.12, 0.28, 1.6);
      pylonGeo.rotateZ(isRight ? -0.3 : 0.3);
      const pylon = new THREE.Mesh(pylonGeo, accentMat);
      pylon.position.set(isRight ? 0.42 : -0.42, 0.15, -0.2);
      engineGroup.add(pylon);

      return engineGroup;
    };

    const engineLeft = createEngine(false);
    engineLeft.position.set(-1.65, 0.45, -3.2);
    jetGroup.add(engineLeft);

    const engineRight = createEngine(true);
    engineRight.position.set(1.65, 0.45, -3.2);
    jetGroup.add(engineRight);

    // Part 8: Vertical Tail Fin (Swept Fin)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(-2.2, 3.8);
    finShape.lineTo(-1.2, 3.8);
    finShape.lineTo(1.8, 0);
    finShape.closePath();

    const finExtrude = new THREE.ExtrudeGeometry(finShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });
    finExtrude.center();
    finExtrude.rotateY(Math.PI / 2);
    const tailFin = new THREE.Mesh(finExtrude, hullMat);
    tailFin.position.set(0, 2.3, -5.6);
    tailFin.castShadow = true;
    jetGroup.add(tailFin);

    // Part 9: Horizontal T-Tail Wing (Top of vertical stabilizer)
    const tTailShape = new THREE.Shape();
    tTailShape.moveTo(-3.2, -0.8);
    tTailShape.lineTo(0, 0.4);
    tTailShape.lineTo(3.2, -0.8);
    tTailShape.lineTo(2.8, -1.3);
    tTailShape.lineTo(0, -0.3);
    tTailShape.lineTo(-2.8, -1.3);
    tTailShape.closePath();

    const tTailExtrude = new THREE.ExtrudeGeometry(tTailShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    tTailExtrude.center();
    tTailExtrude.rotateX(Math.PI / 2);
    const tTailWing = new THREE.Mesh(tTailExtrude, hullMat);
    tTailWing.position.set(0, 4.2, -6.6);
    tTailWing.castShadow = true;
    jetGroup.add(tTailWing);

    // Part 10: Luxury Passenger Windows (Array of flush cabin portholes)
    const windowsGroup = new THREE.Group();
    const windowGeo = new THREE.CapsuleGeometry(0.12, 0.18, 4, 8);
    windowGeo.rotateZ(Math.PI / 2);

    for (let i = 0; i < 9; i++) {
      const zPos = 3.2 - i * 0.72;
      // Left window
      const winL = new THREE.Mesh(windowGeo, glassMat);
      winL.position.set(-0.95, 0.25, zPos);
      winL.rotation.y = -Math.PI / 2;
      windowsGroup.add(winL);

      // Right window
      const winR = new THREE.Mesh(windowGeo, glassMat);
      winR.position.set(0.95, 0.25, zPos);
      winR.rotation.y = Math.PI / 2;
      windowsGroup.add(winR);
    }
    jetGroup.add(windowsGroup);

    // Part 11: Ground Radial Contact Shadow Plane (Never looks floating!)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 20, 128, 128, 120);
      grad.addColorStop(0, 'rgba(20, 30, 45, 0.45)');
      grad.addColorStop(0.5, 'rgba(20, 30, 45, 0.2)');
      grad.addColorStop(1, 'rgba(20, 30, 45, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(22, 22),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.8;
    jetGroup.add(shadowPlane);

    scene.add(jetGroup);

    jetPartsRef.current = {
      fuselage,
      cockpitGlass,
      wings: wingLMesh, // reference for exploded view
      wingletLeft,
      wingletRight,
      engineLeft,
      engineRight,
      tailFin,
      tTailWing,
      windowsGroup,
      shadowPlane,
    };

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // Mouse / Touch Interaction for smooth Orbit rotation
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      interactionRef.current.isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      interactionRef.current.prevMouseX = clientX;
      interactionRef.current.prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactionRef.current.isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - interactionRef.current.prevMouseX;
      const deltaY = clientY - interactionRef.current.prevMouseY;
      interactionRef.current.prevMouseX = clientX;
      interactionRef.current.prevMouseY = clientY;

      interactionRef.current.targetRotY += deltaX * 0.008;
      interactionRef.current.targetRotX = Math.max(
        -0.4,
        Math.min(0.9, interactionRef.current.targetRotX + deltaY * 0.008)
      );
    };

    const onPointerUp = () => {
      interactionRef.current.isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 7. Lossless 60fps Loop with Exponential Damping (THREE.MathUtils.damp)
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);

      // Auto rotation when idle
      if (autoRotate && !interactionRef.current.isDragging) {
        interactionRef.current.targetRotY += interactionRef.current.autoRotateSpeed;
      }

      // Smooth damped rotation
      interactionRef.current.rotX = THREE.MathUtils.damp(
        interactionRef.current.rotX,
        interactionRef.current.targetRotX,
        8,
        dt
      );
      interactionRef.current.rotY = THREE.MathUtils.damp(
        interactionRef.current.rotY,
        interactionRef.current.targetRotY,
        8,
        dt
      );

      jetGroup.rotation.x = interactionRef.current.rotX;
      jetGroup.rotation.y = interactionRef.current.rotY;

      // Smooth camera position damping
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 5, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 5, dt);

      _currLookAt.x = THREE.MathUtils.damp(_currLookAt.x, _targetLookAt.x, 5, dt);
      _currLookAt.y = THREE.MathUtils.damp(_currLookAt.y, _targetLookAt.y, 5, dt);
      _currLookAt.z = THREE.MathUtils.damp(_currLookAt.z, _targetLookAt.z, 5, dt);
      camera.lookAt(_currLookAt);

      // Exploded View kinematics: smoothly separate components outward
      interactionRef.current.explodedVal = THREE.MathUtils.damp(
        interactionRef.current.explodedVal,
        interactionRef.current.targetExplodedVal,
        6,
        dt
      );
      const ev = interactionRef.current.explodedVal;

      if (jetPartsRef.current) {
        cockpitGlass.position.y = 0.65 + ev * 1.5;
        wingsGroup.position.y = -0.15 - ev * 1.2;
        wingsGroup.scale.set(1 + ev * 0.15, 1, 1 + ev * 0.15);

        engineLeft.position.x = -1.65 - ev * 2.2;
        engineLeft.position.y = 0.45 + ev * 0.8;

        engineRight.position.x = 1.65 + ev * 2.2;
        engineRight.position.y = 0.45 + ev * 0.8;

        tailFin.position.y = 2.3 + ev * 1.8;
        tTailWing.position.y = 4.2 + ev * 3.2;

        wingletLeft.position.x = 10.6 + ev * 1.5;
        wingletRight.position.x = -10.6 - ev * 1.5;

        windowsGroup.position.y = ev * 0.6;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      domElement.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      if (domElement && domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
    };
  }, [autoRotate]);

  return (
    <div className={`relative w-full ${isModal ? 'h-[90vh]' : 'h-screen'} bg-[#f1f4f8] overflow-hidden select-none`}>
      {/* 3D WebGL Canvas isolated mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top minimal badge and close button (zero side clutter) */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
        <div className="pointer-events-auto bg-white/90 text-[#202a36] px-4 py-2 rounded-full shadow-md border border-gray-200/80 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#202a36]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-gray-500">Interactive 3D Craft</span>
          <span className="text-xs font-bold text-gray-900">SkyElite Challenger 650X</span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close 3D View"
            className="pointer-events-auto p-2.5 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-md border border-gray-200/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Center hint when idle */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <p className="text-xs font-medium text-gray-500 bg-white/80 px-3 py-1 rounded-full shadow-xs">
          Drag to orbit • Pinch or scroll to zoom
        </p>
      </div>

      {/* Sleek Ergonomic Bottom Control Dock pinned to bottom center (<= 15% viewport footprint) */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[840px] z-20 transition-transform duration-300 ${
          controlsCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Collapse / Expand Toggle Button */}
        <div className="flex justify-center -mb-2 relative z-30">
          <button
            onClick={() => setControlsCollapsed(!controlsCollapsed)}
            className="px-4 py-1 rounded-t-xl bg-[#202a36] text-white text-xs font-medium shadow-md flex items-center gap-1.5 hover:bg-[#1a2229] transition-colors cursor-pointer"
          >
            {controlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show Aircraft Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Unified Bottom Control Dock Surface */}
        <div className="bg-[#202a36] text-white rounded-2xl p-4 shadow-2xl border border-gray-700/60">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* 1. Paint Finishes */}
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block mb-1.5">
                Exterior Livery
              </span>
              <div className="flex items-center gap-2">
                {FINISHES.map((finish, idx) => (
                  <button
                    key={finish.name}
                    onClick={() => setSelectedFinish(idx)}
                    title={finish.name}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      selectedFinish === idx ? 'scale-115 border-white shadow-sm' : 'border-gray-500/50 hover:scale-105'
                    }`}
                    style={{ backgroundColor: finish.badgeHex }}
                  />
                ))}
              </div>
            </div>

            {/* 2. Exploded Engineering View Slider */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-1.5">
                <span>Exploded View</span>
                <span className="text-gray-300 font-mono">{Math.round(explodedFactor * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedFactor}
                onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* 3. Camera Angles & Auto-Rotate Toggle */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-gray-800/80 p-1 rounded-xl">
                <button
                  onClick={() => setCameraPreset('cinematic')}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    cameraPreset === 'cinematic' ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Cinematic Angle"
                >
                  Orbit
                </button>
                <button
                  onClick={() => setCameraPreset('front')}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    cameraPreset === 'front' ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Cockpit View"
                >
                  Nose
                </button>
                <button
                  onClick={() => setCameraPreset('wing')}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    cameraPreset === 'wing' ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Wing Profile"
                >
                  Wing
                </button>
                <button
                  onClick={() => setCameraPreset('top')}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    cameraPreset === 'top' ? 'bg-white text-gray-900 font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                  title="Top Plan"
                >
                  Plan
                </button>
              </div>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  autoRotate ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white bg-gray-800/80'
                }`}
                title={autoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
              >
                <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
