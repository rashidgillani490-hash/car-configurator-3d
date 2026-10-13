import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function CameraRig({
  activePreset,
  autoRotate,
  onUserInteract
}) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const isTransitioningRef = useRef(false);
  const desiredPosRef = useRef(new THREE.Vector3(4.2, 1.85, 4.4));
  const desiredTargetRef = useRef(new THREE.Vector3(0, 0.45, 0));

  useEffect(() => {
    if (activePreset) {
      desiredPosRef.current.set(...activePreset.position);
      desiredTargetRef.current.set(...activePreset.target);
      isTransitioningRef.current = true;
    }
  }, [activePreset]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioningRef.current) {
      const step = Math.min(1, delta * 5.2);
      camera.position.lerp(desiredPosRef.current, step);
      controlsRef.current.target.lerp(desiredTargetRef.current, step);
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(desiredPosRef.current);
      const distTarget = controlsRef.current.target.distanceTo(desiredTargetRef.current);
      if (distPos < 0.03 && distTarget < 0.03) {
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={1.65}
      maxDistance={10.5}
      maxPolarAngle={Math.PI / 2 - 0.03}
      minPolarAngle={0.08}
      autoRotate={autoRotate && !isTransitioningRef.current}
      autoRotateSpeed={0.85}
      onStart={() => {
        isTransitioningRef.current = false;
        if (onUserInteract) onUserInteract();
      }}
    />
  );
}
