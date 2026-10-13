import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getBrakeRotorTexture } from '../../utils/proceduralTextures';

export default function WheelAssembly({
  position = [0, 0, 0],
  isLeft = true,
  isFront = false,
  wheelStyle = 'forged-10',
  rimFinish,
  caliperColor = '#e9ff00',
  driveSpeed = 0,
  steerAngle = 0
}) {
  const spinGroupRef = useRef();
  const steerGroupRef = useRef();
  const rotorTexture = useMemo(() => getBrakeRotorTexture(), []);

  useFrame((_, delta) => {
    if (spinGroupRef.current && driveSpeed > 0) {
      spinGroupRef.current.rotation.x += delta * driveSpeed * 12;
    }
    if (steerGroupRef.current && isFront) {
      steerGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        steerGroupRef.current.rotation.y,
        steerAngle,
        0.1
      );
    }
  });

  const rimColor = rimFinish?.hex || '#d4b46a';
  const rimMetalness = rimFinish?.metalness ?? 0.9;
  const rimRoughness = rimFinish?.roughness ?? 0.2;

  const radius = isFront ? 0.365 : 0.385;
  const width = isFront ? 0.28 : 0.33;
  const rimRadius = radius * 0.72;
  const sideFlip = isLeft ? 1 : -1;

  // Precalculate spoke angles
  const tenSpokes = useMemo(() => Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2), []);
  const fiveSpokes = useMemo(() => Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2), []);
  const twentyFourFins = useMemo(() => Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2), []);
  const sixHex = useMemo(() => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2), []);

  return (
    <group position={position} ref={steerGroupRef}>
      {/* Stationary Brake Caliper (Does NOT spin with wheel) */}
      <group
        position={[sideFlip * 0.03, 0.04, isFront ? -0.14 : 0.14]}
        rotation={[isFront ? 0.45 : -0.45, 0, 0]}
      >
        <mesh castShadow>
          <boxGeometry args={[0.095, 0.19, 0.11]} />
          <meshPhysicalMaterial
            color={caliperColor}
            metalness={0.45}
            roughness={0.2}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
          />
        </mesh>
        {/* Caliper Bridge Bolts */}
        <mesh position={[sideFlip * 0.05, 0.04, 0.02]}>
          <boxGeometry args={[0.015, 0.12, 0.04]} />
          <meshStandardMaterial color="#111318" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Spinning Wheel, Tire & Brake Rotor Assembly */}
      <group ref={spinGroupRef}>
        {/* Rubber Tire Tread Cylinder */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius, width * 0.86, 48, 1, false]} />
          <meshStandardMaterial
            color="#121417"
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>

        {/* Outer & Inner Rounded Tire Sidewalls */}
        <mesh
          position={[sideFlip * (width * 0.38), 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        >
          <torusGeometry args={[radius * 0.85, radius * 0.155, 20, 48]} />
          <meshStandardMaterial color="#15181c" roughness={0.78} metalness={0.12} />
        </mesh>
        <mesh
          position={[-sideFlip * (width * 0.38), 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry args={[radius * 0.85, radius * 0.155, 16, 40]} />
          <meshStandardMaterial color="#15181c" roughness={0.82} metalness={0.1} />
        </mesh>

        {/* Outer Alloy Rim Lip Ring */}
        <mesh
          position={[sideFlip * (width * 0.43), 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry args={[rimRadius, 0.018, 16, 48]} />
          <meshPhysicalMaterial
            color={rimColor}
            metalness={rimMetalness}
            roughness={rimRoughness}
            clearcoat={0.8}
          />
        </mesh>

        {/* Deep Alloy Rim Barrel (Open Cylinder) */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[rimRadius, rimRadius * 0.95, width * 0.82, 40, 1, true]} />
          <meshPhysicalMaterial
            color={rimColor}
            metalness={rimMetalness}
            roughness={rimRoughness}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Cross-Drilled Carbon-Ceramic Brake Rotor */}
        <mesh position={[sideFlip * 0.015, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[rimRadius * 0.78, rimRadius * 0.78, 0.025, 36]} />
          <meshStandardMaterial
            map={rotorTexture}
            color="#9aa1ac"
            metalness={0.75}
            roughness={0.32}
          />
        </mesh>

        {/* Rotor Center Hat */}
        <mesh position={[sideFlip * 0.045, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[rimRadius * 0.32, rimRadius * 0.36, 0.05, 24]} />
          <meshStandardMaterial color="#22252b" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* STYLE 1: 10-Spoke Forged Mag (Split V-Spokes) */}
        {wheelStyle === 'forged-10' && (
          <group position={[sideFlip * (width * 0.34), 0, 0]}>
            {tenSpokes.map((angle, idx) => {
              const splay = idx % 2 === 0 ? 0.14 : -0.14;
              return (
                <group key={idx} rotation={[angle, 0, 0]}>
                  <mesh
                    position={[0, rimRadius * 0.52, 0]}
                    rotation={[splay, 0, sideFlip * -0.12]}
                  >
                    <boxGeometry args={[0.022, rimRadius * 0.88, 0.022]} />
                    <meshPhysicalMaterial
                      color={rimColor}
                      metalness={rimMetalness}
                      roughness={rimRoughness}
                      clearcoat={0.9}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}

        {/* STYLE 2: Aero Turbofan Disc */}
        {wheelStyle === 'turbofan' && (
          <group position={[sideFlip * (width * 0.39), 0, 0]}>
            {/* Main Aero Carbon Cone Cover */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[rimRadius * 0.94, rimRadius * 0.86, 0.022, 40]} />
              <meshPhysicalMaterial
                color="#161920"
                metalness={0.65}
                roughness={0.22}
                clearcoat={1.0}
              />
            </mesh>
            {/* Outer Accent Telemetry Ring */}
            <mesh position={[sideFlip * 0.014, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[rimRadius * 0.82, 0.008, 12, 48]} />
              <meshStandardMaterial
                color={caliperColor}
                emissive={caliperColor}
                emissiveIntensity={0.5}
              />
            </mesh>
            {/* 24 Radial Directional Cooling Fins */}
            {twentyFourFins.map((angle, idx) => (
              <group key={idx} rotation={[angle, 0, 0]}>
                <mesh
                  position={[sideFlip * 0.012, rimRadius * 0.62, 0]}
                  rotation={[0.35, 0, 0]}
                >
                  <boxGeometry args={[0.016, rimRadius * 0.42, 0.01]} />
                  <meshPhysicalMaterial
                    color={rimColor}
                    metalness={rimMetalness}
                    roughness={rimRoughness}
                  />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* STYLE 3: 5-Twin Deep Concave Track Rim */}
        {wheelStyle === 'track-5' && (
          <group position={[sideFlip * (width * 0.31), 0, 0]}>
            {fiveSpokes.map((angle, idx) => (
              <group key={idx} rotation={[angle, 0, 0]}>
                <mesh
                  position={[0, rimRadius * 0.5, 0.024]}
                  rotation={[0.06, 0, sideFlip * -0.18]}
                >
                  <boxGeometry args={[0.028, rimRadius * 0.88, 0.024]} />
                  <meshPhysicalMaterial
                    color={rimColor}
                    metalness={rimMetalness}
                    roughness={rimRoughness}
                    clearcoat={0.85}
                  />
                </mesh>
                <mesh
                  position={[0, rimRadius * 0.5, -0.024]}
                  rotation={[-0.06, 0, sideFlip * -0.18]}
                >
                  <boxGeometry args={[0.028, rimRadius * 0.88, 0.024]} />
                  <meshPhysicalMaterial
                    color={rimColor}
                    metalness={rimMetalness}
                    roughness={rimRoughness}
                    clearcoat={0.85}
                  />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* STYLE 4: Cyber Hex-Matrix Forged Rim */}
        {wheelStyle === 'cyber-hex' && (
          <group position={[sideFlip * (width * 0.35), 0, 0]}>
            {sixHex.map((angle, idx) => (
              <group key={idx} rotation={[angle, 0, 0]}>
                {/* Primary Y Fork */}
                <mesh
                  position={[0, rimRadius * 0.48, 0.025]}
                  rotation={[0.25, 0, sideFlip * -0.1]}
                >
                  <boxGeometry args={[0.022, rimRadius * 0.82, 0.018]} />
                  <meshPhysicalMaterial
                    color={rimColor}
                    metalness={rimMetalness}
                    roughness={rimRoughness}
                  />
                </mesh>
                <mesh
                  position={[0, rimRadius * 0.48, -0.025]}
                  rotation={[-0.25, 0, sideFlip * -0.1]}
                >
                  <boxGeometry args={[0.022, rimRadius * 0.82, 0.018]} />
                  <meshPhysicalMaterial
                    color={rimColor}
                    metalness={rimMetalness}
                    roughness={rimRoughness}
                  />
                </mesh>
                {/* Hex Crossbar */}
                <mesh position={[sideFlip * 0.01, rimRadius * 0.54, 0]}>
                  <boxGeometry args={[0.018, 0.018, 0.095]} />
                  <meshStandardMaterial color="#14171f" metalness={0.8} roughness={0.2} />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* Centerlock Hub & Anodized Lock Nut */}
        <mesh
          position={[sideFlip * (width * 0.37), 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.068, 0.075, 0.05, 24]} />
          <meshPhysicalMaterial
            color="#16181d"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh
          position={[sideFlip * (width * 0.405), 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.036, 0.042, 0.025, 6]} />
          <meshPhysicalMaterial
            color={caliperColor}
            metalness={0.75}
            roughness={0.2}
            clearcoat={1.0}
          />
        </mesh>
      </group>
    </group>
  );
}
