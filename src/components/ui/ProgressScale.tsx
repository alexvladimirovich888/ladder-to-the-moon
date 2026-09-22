"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MILESTONES, TOKEN_CONFIG } from "@/config";
import { formatCurrency, formatMilestoneLabel } from "@/lib/format";
import { useMarketCapStore } from "@/store/marketCapStore";

const TICKS = [...MILESTONES].reverse();

export default function ProgressScale() {
  const marketCap = useMarketCapStore((s) => s.marketCap);
  const progress = useMarketCapStore((s) => s.progress);

  const numberRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tween = useRef({ value: 0, percent: 0 });

  useEffect(() => {
    gsap.to(tween.current, {
      value: marketCap,
      percent: progress * 100,
      duration: 0.4,
      ease: "power1.out",
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.textContent = formatCurrency(tween.current.value);
        }
        if (percentRef.current) {
          percentRef.current.textContent = `${tween.current.percent.toFixed(1)}%`;
        }
        if (lineRef.current) {
          lineRef.current.style.height = `${tween.current.percent}%`;
        }
      },
    });
  }, [marketCap, progress]);

  useEffect(() => {
    const onMilestone = () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { boxShadow: "0 0 0 rgba(140,180,255,0)" },
        {
          boxShadow: "0 0 34px rgba(140,180,255,0.55)",
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        }
      );
    };
    window.addEventListener("milestone-reached", onMilestone);
    return () => window.removeEventListener("milestone-reached", onMilestone);
  }, []);

  return (
    <div className="scale-panel" ref={containerRef}>
      <div className="scale-panel__stats">
        <span className="scale-panel__label">MARKET CAP</span>
        <div className="scale-panel__value" ref={numberRef}>
          $0
        </div>
        <span className="scale-panel__label scale-panel__label--target">TARGET</span>
        <div className="scale-panel__target">{formatCurrency(TOKEN_CONFIG.targetMarketCap)}</div>
        <div className="scale-panel__percent" ref={percentRef}>
          0.0%
        </div>
      </div>

      <div className="scale-track">
        <div className="scale-track__fill" ref={lineRef} />
        {TICKS.map((value) => (
          <div key={value} className="scale-tick">
            <span className="scale-tick__label">{formatMilestoneLabel(value)}</span>
            <span className="scale-tick__mark" />
          </div>
        ))}
      </div>
    </div>
  );
}
