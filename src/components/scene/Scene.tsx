"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Earth from "@/components/earth/Earth";
import Moon from "@/components/moon/Moon";
import Ladder from "@/components/ladder/Ladder";
import Stars from "@/components/stars/Stars";
import ParticleTrail from "@/components/particles/ParticleTrail";
import AtmosphericDust from "@/components/particles/AtmosphericDust";
import CameraRig from "./CameraRig";
import Effects from "./Effects";
import type { DeviceQuality } from "@/hooks/useDeviceQuality";

interface SceneProps {
  quality: DeviceQuality;
}

export default function Scene({ quality }: SceneProps) {
  const dpr: [number, number] = quality === "high" ? [1, 1.8] : [1, 1.2];

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 50, near: 0.1, far: 600, position: [0, 4, 26] }}
      shadows
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <color attach="background" args={["#01030a"]} />
      <fog attach="fog" args={["#01030a", 80, 420]} />

      <ambientLight intensity={0.42} color="#5c74a8" />
      <hemisphereLight args={["#7692d6", "#03050c", 0.55]} />
      <pointLight position={[0, -6, 10]} intensity={0.9} color="#3f7bd6" distance={40} />
      <directionalLight position={[-8, 20, 14]} intensity={0.5} color="#cfe0ff" />
      <directionalLight position={[4, 8, 20]} intensity={0.7} color="#8fb4ff" />

      <Suspense fallback={null}>
        <Earth />
        <Ladder />
        <Moon />
        <Stars quality={quality} />
        <ParticleTrail count={quality === "high" ? 260 : 100} />
        <AtmosphericDust count={quality === "high" ? 400 : 150} />
        <CameraRig />
        <Effects quality={quality} />
      </Suspense>
    </Canvas>
  );
}
