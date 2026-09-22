"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function ZoomHint() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const tl = gsap.timeline({ delay: 1.6 });
    tl.fromTo(ref.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(ref.current, { opacity: 0, duration: 1, ease: "power2.in", delay: 3.2 });
  }, []);

  return (
    <div ref={ref} className="zoom-hint">
      SCROLL TO ZOOM OUT · DOUBLE-CLICK TO RESET
    </div>
  );
}
