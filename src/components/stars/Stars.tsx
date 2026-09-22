"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stars as DreiStars } from "@react-three/drei";
import { createNebulaTexture } from "@/lib/proceduralTextures";

interface StarsProps {
  quality?: "high" | "low";
}

export default function Stars({ quality = "high" }: StarsProps) {
  const brightStarsRef = useRef<THREE.Points>(null);
  const nebulaTexture = useMemo(() => createNebulaTexture(), []);

  const brightStarsGeometry = useMemo(() => {
    const count = quality === "high" ? 220 : 90;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 140 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.6 + 40;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [quality]);

  useFrame((_, delta) => {
    if (brightStarsRef.current) {
      brightStarsRef.current.rotation.y += delta * 0.004;
    }
  });

  return (
    <group>
      <DreiStars
        radius={220}
        depth={80}
        count={quality === "high" ? 6000 : 2200}
        factor={4}
        saturation={0}
        fade
        speed={0.4}
      />
      <points ref={brightStarsRef} geometry={brightStarsGeometry}>
        <pointsMaterial
          color="#eaf3ff"
          size={1.4}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>
      {/* Subtle nebula backdrop */}
      <mesh position={[-40, 40, -160]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[220, 220]} />
        <meshBasicMaterial
          map={nebulaTexture}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[60, 90, -200]} rotation={[0, -0.4, 0]}>
        <planeGeometry args={[260, 260]} />
        <meshBasicMaterial
          map={nebulaTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#8fa0ff"
        />
      </mesh>
    </group>
  );
}
