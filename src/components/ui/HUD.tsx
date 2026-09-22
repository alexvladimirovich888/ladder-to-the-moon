"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SITE_CONFIG } from "@/config";

export default function HUD() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  return (
    <div ref={rootRef} className="hud">
      <h1 className="hud__title">
        LADDER
        <br />
        TO THE MOON
      </h1>
      <p className="hud__subtitle">{SITE_CONFIG.subtitle}</p>
    </div>
  );
}
