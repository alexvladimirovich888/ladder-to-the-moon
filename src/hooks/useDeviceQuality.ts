"use client";

import { useEffect, useState } from "react";

export type DeviceQuality = "high" | "low";

/**
 * Cheap heuristic to scale down particle counts and postprocessing on
 * mobile / low-power devices to keep frame rate high.
 */
export function useDeviceQuality(): DeviceQuality {
  const [quality, setQuality] = useState<DeviceQuality>("high");

  useEffect(() => {
    const isSmallScreen = window.innerWidth < 820;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isLowConcurrency = (navigator.hardwareConcurrency ?? 8) <= 4;

    if (isSmallScreen || isCoarsePointer || isLowConcurrency) {
      setQuality("low");
    }
  }, []);

  return quality;
}
