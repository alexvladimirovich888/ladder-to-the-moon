"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { createCraterTexture } from "@/lib/proceduralTextures";
import { useMarketCapStore } from "@/store/marketCapStore";
import { LADDER_CONFIG } from "@/config";

const MOON_Y = LADDER_CONFIG.maxHeight + 6;

export default function Moon() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const progress = useMarketCapStore((s) => s.progress);

  const texture = useMemo(
    () =>
      createCraterTexture({
        base: "#c9c9d4",
        shadow: "#7d7d8c",
        highlight: "#ffffff",
        craterCount: 140,
      }),
    []
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.015;
    }
    if (lightRef.current) {
      const targetIntensity = 1.4 + progress * 2.4;
      lightRef.current.intensity = THREE.MathUtils.damp(
        lightRef.current.intensity,
        targetIntensity,
        2,
        delta
      );
    }
    if (materialRef.current) {
      const targetEmissive = 0.05 + progress * 0.35;
      materialRef.current.emissiveIntensity = THREE.MathUtils.damp(
        materialRef.current.emissiveIntensity,
        targetEmissive,
        2,
        delta
      );
    }
  });

  useEffect(() => {
    const onTargetReached = () => {
      if (!materialRef.current || !lightRef.current) return;
      const tl = gsap.timeline();
      tl.to(materialRef.current, { emissiveIntensity: 1.4, duration: 0.6, ease: "power2.out" })
        .to(lightRef.current, { intensity: 7, duration: 0.6, ease: "power2.out" }, "<")
        .to(materialRef.current, { emissiveIntensity: 0.4, duration: 1.6, ease: "power2.inOut" })
        .to(lightRef.current, { intensity: 3.8, duration: 1.6, ease: "power2.inOut" }, "<");
    };
    window.addEventListener("target-reached", onTargetReached);
    return () => window.removeEventListener("target-reached", onTargetReached);
  }, []);

  return (
    <group position={[0, MOON_Y, -18]}>
      <directionalLight
        ref={lightRef}
        position={[6, 4, 8]}
        intensity={1.4}
        color="#e8f1ff"
        castShadow
      />
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[13, 96, 96]} />
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          roughness={0.92}
          metalness={0.02}
          emissive="#dfe8ff"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Atmospheric rim glow */}
      <mesh scale={1.05}>
        <sphereGeometry args={[13, 48, 48]} />
        <meshBasicMaterial
          color="#bcd4ff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export { MOON_Y };
