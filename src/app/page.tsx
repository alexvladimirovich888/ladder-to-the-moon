"use client";

import dynamic from "next/dynamic";
import HUD from "@/components/ui/HUD";
import ProgressScale from "@/components/ui/ProgressScale";
import ContractBar from "@/components/ui/ContractBar";
import MilestonePulse from "@/components/ui/MilestonePulse";
import ZoomHint from "@/components/ui/ZoomHint";
import { useMarketCapLifecycle } from "@/hooks/useMarketCapLifecycle";
import { useDeviceQuality } from "@/hooks/useDeviceQuality";

const Scene = dynamic(() => import("@/components/scene/Scene"), { ssr: false });

export default function Home() {
  useMarketCapLifecycle();
  const quality = useDeviceQuality();

  return (
    <main className="app-root">
      <div className="scene-layer">
        <Scene quality={quality} />
      </div>

      <div className="ui-layer">
        <HUD />
        <ProgressScale />
        <ContractBar />
        <MilestonePulse />
        <ZoomHint />
      </div>
    </main>
  );
}
