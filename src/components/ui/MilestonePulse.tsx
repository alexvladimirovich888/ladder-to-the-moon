"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { formatMilestoneLabel } from "@/lib/format";

export default function MilestonePulse() {
  const [toast, setToast] = useState<string | null>(null);
  const [reached, setReached] = useState(false);
  const flashRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const reachedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMilestone = (e: Event) => {
      const detail = (e as CustomEvent).detail as { milestone: number };
      if (!detail || detail.milestone <= 0) return;
      setToast(formatMilestoneLabel(detail.milestone));
    };
    window.addEventListener("milestone-reached", onMilestone);
    return () => window.removeEventListener("milestone-reached", onMilestone);
  }, []);

  useEffect(() => {
    if (!toast || !toastRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      toastRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    ).to(toastRef.current, { opacity: 0, duration: 0.6, delay: 1.4, ease: "power2.in" });
  }, [toast]);

  useEffect(() => {
    const onTargetReached = () => {
      setReached(true);
      if (flashRef.current) {
        gsap.fromTo(
          flashRef.current,
          { opacity: 0.9 },
          { opacity: 0, duration: 1.8, ease: "power2.out" }
        );
      }
    };
    window.addEventListener("target-reached", onTargetReached);
    return () => window.removeEventListener("target-reached", onTargetReached);
  }, []);

  useEffect(() => {
    if (!reached || !reachedRef.current) return;
    gsap.fromTo(
      reachedRef.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, [reached]);

  return (
    <>
      <div ref={flashRef} className="cinematic-flash" />
      {toast && (
        <div ref={toastRef} className="milestone-toast">
          {toast} MARKET CAP REACHED
        </div>
      )}
      {reached && (
        <div ref={reachedRef} className="reached-banner">
          THE MOON IS REACHED
        </div>
      )}
    </>
  );
}
