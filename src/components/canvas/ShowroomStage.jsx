import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';

export default function ShowroomStage({
  studioEnv,
  driveMode,
  caliperColor
}) {
  const tunnelArchesRef = useRef();
  const roadStripsRef = useRef();

  // Animate tunnel arches and road speed strips when Drive / Wind Tunnel Mode is active
  useFrame((_, delta) => {
    if (driveMode) {
      if (tunnelArchesRef.current) {
        tunnelArchesRef.current.children.forEach((arch) => {
          arch.position.z -= delta * 14;
          if (arch.position.z < -12) {
            arch.position.z += 24;
          }
        });
      }
      if (roadStripsRef.current) {
        roadStripsRef.current.children.forEach((strip) => {
          strip.position.z -= delta * 18;
          if (strip.position.z < -10) {
            strip.position.z += 20;
          }
        });
      }
    }
  });

  const accent = studioEnv?.accentLight || '#38bdf8';
  const secondary = studioEnv?.secondaryLight || '#f43f5e';

  return (
    <group>
      {/* Background & Atmospheric Fog */}
      <color attach="background" args={[studioEnv.bgHex]} />
      <fog attach="fog" args={[studioEnv.fogHex, 10, 28]} />

      {/* Base Studio Lighting */}
      <ambientLight intensity={studioEnv.ambientIntensity} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-6, 6, -5]}
        intensity={1.2}
        color={accent}
      />
      <pointLight
        position={[0, 4.5, 0]}
        intensity={1.6}
        color="#ffffff"
        distance={15}
      />
      <pointLight
        position={[4, 1.5, -3]}
        intensity={2.0}
        color={secondary}
        distance={12}
      />

      {/* Procedural HDR Automotive Studio Reflection Environment */}
      <Environment resolution={512}>
        {/* Main Overhead Softbox Strip */}
        <Lightformer
          intensity={3.2}
          rotation-x={Math.PI / 2}
          position={[0, 5, 0]}
          scale={[12, 3.5, 1]}
          color="#ffffff"
        />
        {/* Left & Right Rim Reflection Softboxes */}
        <Lightformer
          intensity={2.4}
          rotation-y={Math.PI / 2}
          position={[-6, 2, 0]}
          scale={[12, 1.4, 1]}
          color={accent}
        />
        <Lightformer
          intensity={2.4}
          rotation-y={-Math.PI / 2}
          position={[6, 2, 0]}
          scale={[12, 1.4, 1]}
          color={secondary}
        />
        {/* Front & Rear Horizon Fill Strips */}
        <Lightformer
          intensity={1.8}
          position={[0, 1.8, 7]}
          scale={[8, 1.2, 1]}
          color="#e2e8f0"
        />
        <Lightformer
          intensity={2.2}
          position={[0, 2.2, -7]}
          scale={[8, 1.2, 1]}
          color={accent}
        />
      </Environment>

      {/* Physical Studio Overhead Light Canopy Rig in 3D Scene */}
      <group position={[0, 4.4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.2, 2.6]} />
          <meshBasicMaterial color="#f8fafc" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7.5, 2.9]} />
          <meshStandardMaterial color="#11141c" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Dynamic Studio Light Arches (Scrolls in Drive / Wind Tunnel Mode) */}
      <group ref={tunnelArchesRef}>
        {[-9, -5, -1, 3, 7, 11].map((zPos, idx) => (
          <group key={idx} position={[0, 0, zPos]}>
            {/* Left Vertical Light Pillar */}
            <mesh position={[4.2, 1.8, 0]} rotation={[0, 0, 0.18]}>
              <boxGeometry args={[0.06, 3.8, 0.08]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? accent : secondary}
                emissive={idx % 2 === 0 ? accent : secondary}
                emissiveIntensity={2.2}
              />
            </mesh>
            {/* Right Vertical Light Pillar */}
            <mesh position={[-4.2, 1.8, 0]} rotation={[0, 0, -0.18]}>
              <boxGeometry args={[0.06, 3.8, 0.08]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? accent : secondary}
                emissive={idx % 2 === 0 ? accent : secondary}
                emissiveIntensity={2.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Showroom Turntable Platform Ring (When Stationary) */}
      {!driveMode && (
        <group position={[0, 0.005, 0]}>
          {/* Outer Glowing Turntable Perimeter Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.82, 2.86, 96]} />
            <meshBasicMaterial color={accent} transparent opacity={0.75} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
            <ringGeometry args={[2.35, 2.365, 96]} />
            <meshBasicMaterial color={caliperColor} transparent opacity={0.35} />
          </mesh>
        </group>
      )}

      {/* High-Speed Rolling Road Lane Strips (When Drive Mode Active) */}
      <group ref={roadStripsRef} visible={driveMode}>
        {[-8, -4, 0, 4, 8].map((zPos, i) => (
          <group key={i} position={[0, 0.01, zPos]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.65, 0, 0]}>
              <planeGeometry args={[0.05, 1.6]} />
              <meshBasicMaterial color={accent} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.65, 0, 0]}>
              <planeGeometry args={[0.05, 1.6]} />
              <meshBasicMaterial color={accent} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Soft Contact Shadows directly underneath the car chassis & tires */}
      <ContactShadows
        position={[0, 0.008, 0]}
        opacity={0.85}
        scale={10}
        blur={1.8}
        far={2.5}
        resolution={512}
        color="#000000"
      />

      {/* Mirror-Reflective Luxury Showroom Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={45}
          roughness={0.55}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={studioEnv.bgHex === '#07090e' ? '#0b0e16' : '#0d0b14'}
          metalness={0.65}
        />
      </mesh>
    </group>
  );
}
