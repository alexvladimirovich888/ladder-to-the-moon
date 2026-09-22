"use client";

import { useEffect } from "react";
import { startMarketCapService, stopMarketCapService } from "@/services/marketcap";

export function useMarketCapLifecycle() {
  useEffect(() => {
    startMarketCapService();
    return () => stopMarketCapService();
  }, []);
}
