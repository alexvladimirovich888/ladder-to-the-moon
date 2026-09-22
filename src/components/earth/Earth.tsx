"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createEarthTexture } from "@/lib/proceduralTextures";

/**
 * Small rocky planet surface at the base of the ladder.
 */
export default function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => createEarthTexture(1024), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group position={[0, -9, 0]}>
      <mesh ref={meshRef} receiveShadow castShadow>
        <sphereGeometry args={[9.4, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.72}
          metalness={0.05}
          emissive="#04101f"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Faint atmospheric rim */}
      <mesh scale={1.035}>
        <sphereGeometry args={[9.4, 32, 32]} />
        <meshBasicMaterial
          color="#6ec6ff"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
