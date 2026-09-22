"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LADDER_CONFIG } from "@/config";
import { sceneRuntime } from "@/lib/sceneRuntime";

interface ParticleTrailProps {
  count?: number;
}

/**
 * Slow-moving light particles drifting upward alongside the ladder.
 */
export default function ParticleTrail({ count = 260 }: ParticleTrailProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, speeds, radii, angles } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const radii = new Float32Array(count);
    const angles = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      radii[i] = 2.6 + Math.random() * 2.2;
      angles[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.4 + Math.random() * 0.8;

      const y = Math.random() * LADDER_CONFIG.maxHeight;
      positions[i * 3] = radii[i] * Math.cos(angles[i]);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radii[i] * Math.sin(angles[i]);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, speeds, radii, angles };
  }, [count]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    const height = Math.max(2, sceneRuntime.ladderHeight);
    const positions = points.geometry.attributes.position as THREE.BufferAttribute;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      let y = positions.getY(i) + speeds[i] * delta * 2.2;
      if (y > height) y = 0;

      const angle = angles[i] + time * 0.05;
      const x = radii[i] * Math.cos(angle);
      const z = radii[i] * Math.sin(angle);

      positions.setXYZ(i, x, y, z);
    }
    positions.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#ffd98a"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
