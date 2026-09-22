"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneRuntime } from "@/lib/sceneRuntime";

const lookAtTarget = new THREE.Vector3();
const desiredPosition = new THREE.Vector3();

const ZOOM_MIN = -6;
const ZOOM_MAX = 190;
const INTRO_DISTANCE = 165;
const INTRO_DURATION = 3.6;

export default function CameraRig() {
  const { camera, pointer, gl } = useThree();
  const dolly = useRef(0);
  const targetZoom = useRef(0);
  const appliedZoom = useRef(0);
  const pinchDistance = useRef<number | null>(null);
  const introStart = useRef<number | null>(null);

  useEffect(() => {
    const el = gl.domElement;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoom.current = THREE.MathUtils.clamp(
        targetZoom.current + e.deltaY * 0.08,
        ZOOM_MIN,
        ZOOM_MAX
      );
    };

    const getPinchDistance = (touches: TouchList) => {
      const [a, b] = [touches[0], touches[1]];
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const distance = getPinchDistance(e.touches);
      if (pinchDistance.current !== null) {
        const delta = pinchDistance.current - distance;
        targetZoom.current = THREE.MathUtils.clamp(
          targetZoom.current + delta * 0.35,
          ZOOM_MIN,
          ZOOM_MAX
        );
      }
      pinchDistance.current = distance;
    };

    const onTouchEnd = () => {
      pinchDistance.current = null;
    };

    const onDoubleClick = () => {
      targetZoom.current = 0;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("dblclick", onDoubleClick);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("dblclick", onDoubleClick);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const progress = sceneRuntime.visibleProgress;
    const time = state.clock.elapsedTime;

    if (introStart.current === null) introStart.current = time;
    const introT = THREE.MathUtils.clamp(
      (time - introStart.current) / INTRO_DURATION,
      0,
      1
    );
    const introEase = 1 - Math.pow(1 - introT, 3);
    const introOffset = INTRO_DISTANCE * (1 - introEase);

    dolly.current = THREE.MathUtils.damp(dolly.current, progress, 0.8, delta);
    appliedZoom.current = THREE.MathUtils.damp(
      appliedZoom.current,
      targetZoom.current,
      2.2,
      delta
    );
    sceneRuntime.userZoom = appliedZoom.current / ZOOM_MAX;

    const baseZ = 26 + dolly.current * 104 + appliedZoom.current + introOffset;
    const baseY = 4 + dolly.current * 40 + appliedZoom.current * 0.34 + introOffset * 0.34;

    const idleX = Math.sin(time * 0.06) * 1.2;
    const idleY = Math.cos(time * 0.05) * 0.6;

    const parallaxX = pointer.x * 1.4;
    const parallaxY = pointer.y * 0.8;

    desiredPosition.set(
      idleX + parallaxX,
      baseY + idleY + parallaxY,
      baseZ
    );

    camera.position.lerp(desiredPosition, 1 - Math.pow(0.001, delta));

    lookAtTarget.set(
      0,
      6 + dolly.current * 34 + appliedZoom.current * 0.16 + introOffset * 0.16,
      0
    );
    camera.lookAt(lookAtTarget);
  });

  return null;
}
