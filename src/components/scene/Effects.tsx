"use client";

import { useEffect, useRef } from "react";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import gsap from "gsap";

interface EffectsProps {
  quality?: "high" | "low";
}

export default function Effects({ quality = "high" }: EffectsProps) {
  const bloomRef = useRef<any>(null);

  useEffect(() => {
    const onTargetReached = () => {
      if (!bloomRef.current) return;
      gsap.to(bloomRef.current, {
        intensity: 2.6,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    };
    window.addEventListener("target-reached", onTargetReached);
    return () => window.removeEventListener("target-reached", onTargetReached);
  }, []);

  return (
    <EffectComposer multisampling={quality === "high" ? 4 : 0} enableNormalPass={false}>
      {quality === "high" ? (
        <Bloom
          ref={bloomRef}
          intensity={0.85}
          luminanceThreshold={0.22}
          luminanceSmoothing={0.35}
          mipmapBlur
          blendFunction={BlendFunction.ADD}
        />
      ) : (
        <Bloom
          ref={bloomRef}
          intensity={0.5}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.3}
          blendFunction={BlendFunction.ADD}
        />
      )}
      <Vignette eskil={false} offset={0.15} darkness={0.9} />
    </EffectComposer>
  );
}
