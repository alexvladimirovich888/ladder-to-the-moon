"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { LADDER_CONFIG } from "@/config";
import { useMarketCapStore } from "@/store/marketCapStore";
import { sceneRuntime } from "@/lib/sceneRuntime";

const { maxSteps, stepHeight, stepDepth, stepWidth, maxHeight } = LADDER_CONFIG;
const RAIL_OFFSET = stepWidth / 2 + 0.1;

const dummy = new THREE.Object3D();

export default function Ladder() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const leftRailRef = useRef<THREE.Mesh>(null);
  const rightRailRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const visibleProgress = useRef(0);
  const pulseRef = useRef(0);

  const stepGeometry = useMemo(
    () => new THREE.BoxGeometry(stepWidth, stepHeight * 0.16, stepDepth),
    []
  );

  useEffect(() => {
    const onMilestone = () => {
      pulseRef.current = 1;
      if (materialRef.current) {
        gsap.to(materialRef.current, {
          emissiveIntensity: 1.2,
          duration: 0.35,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        });
      }
    };
    window.addEventListener("milestone-reached", onMilestone);
    return () => window.removeEventListener("milestone-reached", onMilestone);
  }, []);

  useFrame((state, delta) => {
    const targetProgress = useMarketCapStore.getState().progress;
    visibleProgress.current = THREE.MathUtils.damp(
      visibleProgress.current,
      targetProgress,
      2.6,
      delta
    );
    sceneRuntime.visibleProgress = visibleProgress.current;
    sceneRuntime.ladderHeight = visibleProgress.current * maxHeight;

    const time = state.clock.elapsedTime;
    const stepsVisibleFloat = visibleProgress.current * maxSteps;
    const activeCount = Math.min(maxSteps, Math.max(1, Math.ceil(stepsVisibleFloat) + 1));

    const mesh = meshRef.current;
    if (mesh) {
      for (let i = 0; i < activeCount; i++) {
        const appear = THREE.MathUtils.clamp(stepsVisibleFloat - i, 0, 1);
        const baseY = i * stepHeight;
        const y = THREE.MathUtils.lerp(baseY - stepHeight * 0.7, baseY, appear);
        const sway = Math.sin(time * 0.35 + i * 0.25) * 0.025 * appear;

        dummy.position.set(sway, y, 0);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.set(1, 1, THREE.MathUtils.lerp(0.15, 1, appear));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.count = activeCount;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }

    const height = Math.max(0.05, visibleProgress.current * maxHeight);
    if (leftRailRef.current) {
      leftRailRef.current.scale.y = height;
      leftRailRef.current.position.y = height / 2 - stepHeight * 0.5;
    }
    if (rightRailRef.current) {
      rightRailRef.current.scale.y = height;
      rightRailRef.current.position.y = height / 2 - stepHeight * 0.5;
    }

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time * 0.09) * 0.008;
      groupRef.current.rotation.x = Math.cos(time * 0.07) * 0.006;
    }

    if (materialRef.current && pulseRef.current > 0) {
      pulseRef.current = Math.max(0, pulseRef.current - delta * 0.6);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.4, 0]}>
      <instancedMesh
        ref={meshRef}
        args={[stepGeometry, undefined, maxSteps]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          ref={materialRef}
          color="#d8a94a"
          metalness={0.92}
          roughness={0.28}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          emissive="#ffcf7a"
          emissiveIntensity={0.22}
        />
      </instancedMesh>
      <mesh ref={leftRailRef} position={[-RAIL_OFFSET, 0, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 1, 12]} />
        <meshStandardMaterial
          color="#c79640"
          metalness={0.85}
          roughness={0.3}
          emissive="#ffcf7a"
          emissiveIntensity={0.18}
        />
      </mesh>
      <mesh ref={rightRailRef} position={[RAIL_OFFSET, 0, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 1, 12]} />
        <meshStandardMaterial
          color="#c79640"
          metalness={0.85}
          roughness={0.3}
          emissive="#ffcf7a"
          emissiveIntensity={0.18}
        />
      </mesh>
    </group>
  );
}
