import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { getCarbonFiberTextures } from '../../utils/proceduralTextures';
import { CAR_HOTSPOTS } from '../../data/carConfigData';

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);

// Pivot points in RootNode_2 space (meters)
const LEFT_DOOR_PIVOT = new THREE.Vector3(0.86, 0.70, 0.93);
const RIGHT_DOOR_PIVOT = new THREE.Vector3(-0.86, 0.70, 0.93);
const HOOD_PIVOT = new THREE.Vector3(0, 1.03, 0.93);

function applyPivotRotation(node, pivot, axis, angle) {
  if (!node || !node.userData.initStored) return;
  const qRot = new THREE.Quaternion().setFromAxisAngle(axis, angle);
  node.position
    .copy(node.userData.pos0)
    .sub(pivot)
    .applyQuaternion(qRot)
    .add(pivot);
  node.quaternion.copy(qRot).multiply(node.userData.quat0);
}

/**
 * Generates an F90 LCI "L-Blade" DRL 3D tube curve
 */
function createLciBladeGeometry(xStart, xEnd, yBottom, yTop, zFront, zBack, isLeft) {
  const s = isLeft ? 1 : -1;
  const cornerX = xStart + (xEnd - xStart) * 0.78;
  const cornerZ = zFront - (zFront - zBack) * 0.65;

  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(s * xStart, yBottom, zFront),
      new THREE.Vector3(s * ((xStart + cornerX) * 0.5), yBottom, (zFront + cornerZ) * 0.5),
      new THREE.Vector3(s * cornerX, yBottom + 0.004, cornerZ),
      new THREE.Vector3(s * xEnd, yTop, zBack)
    ],
    false,
    'catmullrom',
    0.15
  );

  return new THREE.TubeGeometry(curve, 28, 0.0065, 8, false);
}

export default function SupercarModel({
  carModel,
  paintColor,
  materialFinish,
  trimPackage,
  wheelStyle,
  rimFinish,
  caliperColor,
  windowTint,
  doorsOpen,
  wingDeployed, // Used for opening the S63 V8 Power-Dome Hood on the BMW M5
  headlightsOn,
  driveMode,
  showHotspots,
  activeHotspot,
  onSelectHotspot
}) {
  const gltf = useGLTF('/models/bmw_m5.glb');
  const carRootRef = useRef();
  const flowLinesRef = useRef();

  // Animated state refs for smooth damping
  const animState = useRef({
    doorAngle: 0,
    hoodAngle: 0
  });

  const carbonTextures = useMemo(() => getCarbonFiberTextures(), []);

  // Pre-build the 4 F90 LCI Dual L-Blade DRL Tube Geometries (Inner + Outer on Left & Right)
  const lciBlades = useMemo(() => {
    return {
      leftInner: createLciBladeGeometry(0.48, 0.61, 0.682, 0.728, 2.26, 2.18, true),
      leftOuter: createLciBladeGeometry(0.64, 0.79, 0.688, 0.742, 2.20, 2.09, true),
      rightInner: createLciBladeGeometry(0.48, 0.61, 0.682, 0.728, 2.26, 2.18, false),
      rightOuter: createLciBladeGeometry(0.64, 0.79, 0.688, 0.742, 2.20, 2.09, false)
    };
  }, []);

  // Clone GLTF Scene & collect references to animated nodes and customizable materials
  const {
    clonedScene,
    leftDoorNodes,
    rightDoorNodes,
    hoodNodes,
    wheelSpinGroups
  } = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const lDoors = [];
    const rDoors = [];
    const hoods = [];
    const wheels = [];

    // First clone all materials so we can safely customize them in real-time
    const matCache = new Map();
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          const origMat = obj.material;
          if (!matCache.has(origMat.uuid)) {
            // Upgrade key exterior materials to MeshPhysicalMaterial for clearcoat/sheen
            const mName = origMat.name || '';
            if (
              mName.includes('CarPaint') ||
              mName.includes('Rim_') ||
              mName.includes('MAT_Details_Hub') ||
              mName.includes('Glass_Window') ||
              mName.includes('Grille') ||
              mName.includes('PlasticSmoothBlack')
            ) {
              const physMat = new THREE.MeshPhysicalMaterial({
                name: mName,
                color: origMat.color ? origMat.color.clone() : new THREE.Color('#111'),
                map: origMat.map || null,
                normalMap: origMat.normalMap || null,
                roughnessMap: origMat.roughnessMap || null,
                metalnessMap: origMat.metalnessMap || null,
                metalness: origMat.metalness ?? 0.5,
                roughness: origMat.roughness ?? 0.3,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                transparent: origMat.transparent || false,
                opacity: origMat.opacity ?? 1.0
              });
              matCache.set(origMat.uuid, physMat);
            } else {
              matCache.set(origMat.uuid, origMat.clone());
            }
          }
          obj.material = matCache.get(origMat.uuid);
        }
      }
    });

    // Locate RootNode_2 children for doors, mirrors, hood, and wheels
    scene.traverse((node) => {
      const name = node.name || '';

      // Store initial transform for movable body assemblies
      const storeInit = (n) => {
        if (!n.userData.initStored) {
          n.userData.pos0 = n.position.clone();
          n.userData.quat0 = n.quaternion.clone();
          n.userData.initStored = true;
        }
      };

      // Left Front Door + Left Door Glass + Left Wing Mirror
      if (
        (name.startsWith('b:DoorL6_') ||
          name.startsWith('b:DoorL_Glass4_') ||
          name.startsWith('b:MirrorL6_') ||
          name.startsWith('b:MirrorBaseL6_')) &&
        node.parent?.name === 'RootNode_2'
      ) {
        storeInit(node);
        lDoors.push(node);
      }

      // Right Front Door + Right Door Glass + Right Wing Mirror
      if (
        (name.startsWith('b:DoorR6_') ||
          name.startsWith('b:DoorR_Glass4_') ||
          name.startsWith('b:MirrorR6_') ||
          name.startsWith('b:MirrorBaseR6_')) &&
        node.parent?.name === 'RootNode_2'
      ) {
        storeInit(node);
        rDoors.push(node);
      }

      // BMW M5 Power-Dome Hood
      if (name.startsWith('b:Hood6_') && node.parent?.name === 'RootNode_2') {
        storeInit(node);
        hoods.push(node);
      }

      // 4 Wheel Assemblies (Separate spinning rim/tire/rotor children from stationary brake caliper)
      if (name.startsWith('3DWheel ')) {
        const isRight = name.includes('Front R') || name.includes('Rear R');
        const spinChildren = [];
        node.children.forEach((child) => {
          const cName = child.name || '';
          // Keep brake caliper stationary; spin tires, rims, center caps, and brake discs
          if (!cName.includes('SM_Brake_')) {
            spinChildren.push(child);
          }
        });
        wheels.push({ node, isRight, spinChildren });
      }
    });

    return {
      clonedScene: scene,
      leftDoorNodes: lDoors,
      rightDoorNodes: rDoors,
      hoodNodes: hoods,
      wheelSpinGroups: wheels
    };
  }, [gltf.scene]);

  // Apply real-time material customizations whenever config changes
  useEffect(() => {
    if (!clonedScene) return;

    const isCarbonBody = Boolean(materialFinish?.useCarbonTexture);
    const isCarbonTrim = Boolean(trimPackage?.useCarbonTexture);
    const wheelMode = wheelStyle?.mode || 'mono';

    clonedScene.traverse((obj) => {
      if (!obj.isMesh || !obj.material) return;
      const mat = obj.material;
      const mName = mat.name || '';
      const meshName = obj.name || '';
      const parentName = obj.parent?.name || '';

      // 1. BMW M5 EXTERIOR BODY PAINT (bM_CarPaint_Max1)
      if (mName.includes('bM_CarPaint_Max1')) {
        mat.color.set(paintColor.hex);
        mat.metalness = materialFinish.metalness;
        mat.roughness = materialFinish.roughness;
        mat.clearcoat = materialFinish.clearcoat;
        mat.clearcoatRoughness = materialFinish.clearcoatRoughness;
        mat.sheen = materialFinish.sheen || 0;
        mat.sheenColor = new THREE.Color(paintColor.hex);
        mat.envMapIntensity = 1.8;
        mat.map = isCarbonBody ? carbonTextures.map : null;
        mat.bumpMap = isCarbonBody ? carbonTextures.bumpMap : null;
        mat.bumpScale = isCarbonBody ? 0.004 : 0;
        mat.needsUpdate = true;
      }

      // 2. M CARBON ROOF, DIFFUSER, SPOILER, KIDNEY GRILLE & EXTERIOR TRIM
      if (
        mName.includes('bM_CarPaint_Trim_CarbonA_Max1') ||
        mName.includes('bM_CarPaint_Trim_PlasticSmoothBlack_Max1') ||
        mName.includes('bM_GrilleA_Max1') ||
        parentName.includes('Spoiler6') ||
        parentName.includes('Splitter6') ||
        meshName.includes('Spoiler6')
      ) {
        // Always keep Carbon Roof with carbon texture or chosen trim package
        const useCarbon = mName.includes('CarbonA') || isCarbonTrim;
        mat.color.set(trimPackage.hex);
        mat.metalness = trimPackage.metalness;
        mat.roughness = trimPackage.roughness;
        mat.clearcoat = useCarbon ? 0.95 : 0.7;
        mat.clearcoatRoughness = 0.08;
        mat.map = useCarbon ? carbonTextures.map : null;
        mat.bumpMap = useCarbon ? carbonTextures.bumpMap : null;
        mat.bumpScale = useCarbon ? 0.005 : 0;
        mat.needsUpdate = true;
      }

      // 3. 20" FORGED 789M / 810M WHEELS (Multi-Zone Rim Materials)
      if (
        mName.includes('bM_Rim_Main_Max1') ||
        mName.includes('bM_Rim_NoTint_Max1') ||
        mName.includes('bM_Rim_Secondary_Max1')
      ) {
        if (wheelMode === 'bicolor') {
          // Bi-Color: Dark Orbit Grey inner pockets + bright diamond-cut machined face
          if (mName.includes('bM_Rim_Main_Max1')) {
            mat.color.set('#1a1d24');
            mat.metalness = 0.85;
            mat.roughness = 0.22;
          } else {
            mat.color.set(rimFinish.hex);
            mat.metalness = 0.96;
            mat.roughness = 0.1;
          }
        } else if (wheelMode === 'dark-tint') {
          if (mName.includes('bM_Rim_Main_Max1')) {
            mat.color.set('#0a0c10');
            mat.metalness = 0.88;
            mat.roughness = 0.14;
          } else {
            mat.color.set(rimFinish.hex).multiplyScalar(0.65);
            mat.metalness = 0.92;
            mat.roughness = 0.15;
          }
        } else if (wheelMode === 'cs-spec') {
          // M5 CS Motorsport satin forged finish
          mat.color.set(rimFinish.hex);
          mat.metalness = rimFinish.metalness;
          mat.roughness = Math.max(0.18, rimFinish.roughness);
        } else {
          // Monoblock uniform finish (e.g. Jet Black High-Gloss Stealth)
          mat.color.set(rimFinish.hex);
          mat.metalness = rimFinish.metalness;
          mat.roughness = rimFinish.roughness;
        }
        mat.clearcoat = 0.9;
        mat.clearcoatRoughness = 0.08;
        mat.envMapIntensity = 1.7;
        mat.needsUpdate = true;
      }

      // 4. 6-PISTON M COMPOUND / CARBON-CERAMIC BRAKE CALIPERS (bMAT_Details_Hub1)
      if (mName.includes('bMAT_Details_Hub1')) {
        mat.color.set(caliperColor);
        mat.metalness = 0.55;
        mat.roughness = 0.18;
        mat.clearcoat = 1.0;
        mat.clearcoatRoughness = 0.06;
        mat.needsUpdate = true;
      }

      // 5. CROSS-DRILLED BRAKE DISCS (bMAT_Details_Disk1)
      if (mName.includes('bMAT_Details_Disk1')) {
        mat.color.set('#a3aab5');
        mat.metalness = 0.82;
        mat.roughness = 0.28;
        mat.needsUpdate = true;
      }

      // 6. TINTED WINDOWS & GREENHOUSE GLASS (bM_Glass_WindowFront_Low1)
      if (mName.includes('bM_Glass_WindowFront_Low1')) {
        mat.color.set(windowTint.color);
        mat.transparent = true;
        mat.opacity = windowTint.opacity;
        mat.metalness = 0.2;
        mat.roughness = 0.04;
        mat.clearcoat = 1.0;
        mat.envMapIntensity = 2.2;
        mat.needsUpdate = true;
      }

      // 7. SHADOWLINE GLOSS BLACK WINDOW SURROUND & KIDNEY GRILLE SURROUND
      if (
        mName.includes('bM_Glass_WindowSurroundFront_Low1') ||
        mName.includes('bM_Opaque_PaintSolidBlack_Max1')
      ) {
        mat.color.set('#080a0e');
        mat.metalness = 0.8;
        mat.roughness = 0.12;
        mat.needsUpdate = true;
      }

      // 8. QUAD M SPORT EXHAUST TIPS (Nickel Smooth / Chrome)
      if (
        mName.includes('bM_Opaque_NickelSmooth_Max1') ||
        mName.includes('bM_Opaque_NickelRough_Max1')
      ) {
        // Dark chrome / black titanium exhaust tips on Stealth & CS
        mat.color.set(trimPackage.id === 'shadowline-black' ? '#252932' : '#9aa3b2');
        mat.metalness = 0.95;
        mat.roughness = 0.16;
        mat.needsUpdate = true;
      }

      // 9. HEADLIGHT & TAILLIGHT EMISSIVES
      if (mName.includes('bM_LightGlassNormal_OuterRed_Low1') || mName.includes('bM_LightGlass_Red_Low1')) {
        mat.color.set('#d90429');
        if (mat.emissive) {
          mat.emissive.set('#ff0a36');
          mat.emissiveIntensity = headlightsOn ? 2.8 : 0.4;
        }
        mat.needsUpdate = true;
      }

      // Front side amber reflector marker (visible on front fender in user's photo!)
      if (mName.includes('bM_LightGlass_Orange_Low1')) {
        mat.color.set('#ff7b00');
        if (mat.emissive) {
          mat.emissive.set('#ff6a00');
          mat.emissiveIntensity = headlightsOn ? 1.4 : 0.2;
        }
        mat.needsUpdate = true;
      }
    });
  }, [
    clonedScene,
    paintColor,
    materialFinish,
    trimPackage,
    wheelStyle,
    rimFinish,
    caliperColor,
    windowTint,
    headlightsOn,
    carbonTextures
  ]);

  // Animate Doors, S63 V8 Hood, Spinning Wheels & Wind-Tunnel Streamlines
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle road/engine vibration in Wind Tunnel / Rolling Road mode
    if (carRootRef.current) {
      const targetY = driveMode ? Math.sin(t * 30) * 0.0025 : 0;
      const targetPitch = driveMode ? -0.005 : 0;
      carRootRef.current.position.y = THREE.MathUtils.lerp(
        carRootRef.current.position.y,
        targetY,
        0.15
      );
      carRootRef.current.rotation.x = THREE.MathUtils.lerp(
        carRootRef.current.rotation.x,
        targetPitch,
        0.1
      );
    }

    // Smoothly interpolate Front Saloon Doors angle
    const targetDoor = doorsOpen ? 0.88 : 0;
    animState.current.doorAngle = THREE.MathUtils.lerp(
      animState.current.doorAngle,
      targetDoor,
      Math.min(1, delta * 5.5)
    );

    const dAngle = animState.current.doorAngle;
    leftDoorNodes.forEach((node) => {
      applyPivotRotation(node, LEFT_DOOR_PIVOT, Y_AXIS, -dAngle);
    });
    rightDoorNodes.forEach((node) => {
      applyPivotRotation(node, RIGHT_DOOR_PIVOT, Y_AXIS, dAngle);
    });

    // Smoothly interpolate S63 V8 Power-Dome Hood angle
    const targetHood = wingDeployed ? -0.62 : 0;
    animState.current.hoodAngle = THREE.MathUtils.lerp(
      animState.current.hoodAngle,
      targetHood,
      Math.min(1, delta * 5.0)
    );
    const hAngle = animState.current.hoodAngle;
    hoodNodes.forEach((node) => {
      applyPivotRotation(node, HOOD_PIVOT, X_AXIS, hAngle);
    });

    // Spin the 4 BMW M5 Forged Wheels & Cross-Drilled Brake Discs (Keeping Brake Calipers Fixed!)
    if (driveMode) {
      const spinDelta = delta * 18;
      wheelSpinGroups.forEach(({ isRight, spinChildren }) => {
        const dir = isRight ? -1 : 1;
        spinChildren.forEach((child) => {
          child.rotation.x += dir * spinDelta;
        });
      });
    }

    // Pulse Wind-Tunnel Aero Lines
    if (flowLinesRef.current && driveMode) {
      flowLinesRef.current.children.forEach((child, idx) => {
        if (child.material) {
          child.material.opacity = 0.35 + Math.sin(t * 6 + idx * 1.2) * 0.22;
        }
      });
    }
  });

  const drlColor = carModel?.drlColor || '#f3f7b5';

  return (
    <group ref={carRootRef}>
      {/* ============================================================
          1. HIGH-POLY 3D BMW M5 F90 MODEL (SCALED TO 1:1 METERS)
         ============================================================ */}
      <group scale={100}>
        <primitive object={clonedScene} />
      </group>

      {/* ============================================================
          2. ICONIC F90 LCI DUAL "L-BLADE" LASER DRLs & HEADLIGHT BEAMS
         ============================================================ */}
      <group>
        {/* Left & Right Dual L-Blade Hockey-Stick DRLs */}
        {[
          lciBlades.leftInner,
          lciBlades.leftOuter,
          lciBlades.rightInner,
          lciBlades.rightOuter
        ].map((geom, idx) => (
          <mesh key={idx} geometry={geom}>
            <meshStandardMaterial
              color={headlightsOn ? '#ffffff' : '#2a2e38'}
              emissive={drlColor}
              emissiveIntensity={headlightsOn ? 4.5 : 0.15}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* LCI Laser Projector Core Points */}
        {headlightsOn &&
          [
            [0.54, 0.715, 2.21],
            [0.71, 0.722, 2.14],
            [-0.54, 0.715, 2.21],
            [-0.71, 0.722, 2.14]
          ].map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[0.016, 12, 12]} />
              <meshBasicMaterial color={drlColor} />
            </mesh>
          ))}

        {/* Real Headlight Spotlights Illuminating the Showroom Floor */}
        {headlightsOn && (
          <>
            <spotLight
              position={[0.64, 0.71, 2.32]}
              angle={0.5}
              penumbra={0.7}
              intensity={4.5}
              distance={14}
              color={drlColor}
            />
            <spotLight
              position={[-0.64, 0.71, 2.32]}
              angle={0.5}
              penumbra={0.7}
              intensity={4.5}
              distance={14}
              color={drlColor}
            />
          </>
        )}

        {/* 3D LCI Rear Halo LED Taillight Glow Bars */}
        {headlightsOn &&
          [1, -1].map((side) => (
            <group key={side} position={[side * 0.68, 0.89, -2.31]} rotation={[0, side * -0.22, 0]}>
              <mesh>
                <boxGeometry args={[0.26, 0.018, 0.025]} />
                <meshStandardMaterial
                  color="#ff0a36"
                  emissive="#ff0a36"
                  emissiveIntensity={4.5}
                />
              </mesh>
              <mesh position={[0, -0.032, 0]}>
                <boxGeometry args={[0.24, 0.014, 0.025]} />
                <meshStandardMaterial
                  color="#ff0a36"
                  emissive="#ff0a36"
                  emissiveIntensity={3.8}
                />
              </mesh>
            </group>
          ))}
      </group>

      {/* ============================================================
          3. WIND-TUNNEL AERODYNAMIC STREAMLINES (WHEN DRIVE MODE ON)
         ============================================================ */}
      {driveMode && (
        <group ref={flowLinesRef}>
          {[-0.55, -0.22, 0, 0.22, 0.55].map((xOffset, idx) => {
            const curve = new THREE.CatmullRomCurve3([
              new THREE.Vector3(xOffset, 0.35, 2.95),
              new THREE.Vector3(xOffset * 0.95, 0.85, 1.85),
              new THREE.Vector3(xOffset * 0.9, 1.02, 0.85),
              new THREE.Vector3(xOffset * 0.86, 1.52, -0.15),
              new THREE.Vector3(xOffset * 0.88, 1.44, -1.25),
              new THREE.Vector3(xOffset * 0.92, 1.08, -2.42),
              new THREE.Vector3(xOffset * 1.02, 0.95, -3.5)
            ]);
            const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.008, 8, false);
            return (
              <mesh key={idx} geometry={tubeGeom}>
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.45} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* ============================================================
          4. INTERACTIVE 3D BMW M5 ENGINEERING HOTSPOTS
         ============================================================ */}
      {showHotspots &&
        CAR_HOTSPOTS.map((spot) => {
          const isSelected = activeHotspot?.id === spot.id;
          return (
            <Html
              key={spot.id}
              position={spot.position}
              center
              distanceFactor={6}
              zIndexRange={[20, 0]}
            >
              <div className="relative group select-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot(spot);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border ${
                    isSelected
                      ? 'bg-cyan-400 text-black border-white scale-125 shadow-[0_0_20px_rgba(34,211,238,0.9)]'
                      : 'bg-black/80 text-cyan-400 border-cyan-400/70 hover:scale-110 hover:bg-cyan-500 hover:text-black shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-ping absolute" />
                  <span className="w-2 h-2 rounded-full bg-current relative" />
                </button>

                {isSelected && (
                  <div className="absolute left-9 top-1/2 -translate-y-1/2 w-64 p-3 rounded-xl bg-[#0a0e17]/95 backdrop-blur-xl border border-cyan-500/40 text-left shadow-2xl pointer-events-none animate-fadeIn">
                    <div className="text-[10px] font-display uppercase tracking-widest text-cyan-400 mb-0.5">
                      BMW M Engineering
                    </div>
                    <div className="text-xs font-semibold text-white mb-1">
                      {spot.label}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {spot.detail}
                    </p>
                  </div>
                )}
              </div>
            </Html>
          );
        })}
    </group>
  );
}

useGLTF.preload('/models/bmw_m5.glb');
