"use client";

import { useState } from "react";
import { TOKEN_CONFIG } from "@/config";

export default function ContractBar() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(TOKEN_CONFIG.contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="contract-bar">
      <div className="contract-bar__info">
        <span className="contract-bar__label">CONTRACT</span>
        <span className="contract-bar__address">{TOKEN_CONFIG.contractAddress}</span>
      </div>
      <div className="contract-bar__actions">
        <button className="contract-bar__btn" onClick={handleCopy} type="button">
          {copied ? "COPIED" : "COPY"}
        </button>
        <a
          className="contract-bar__btn contract-bar__btn--primary"
          href={TOKEN_CONFIG.axiomUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          VIEW ON AXIOM
        </a>
      </div>
    </div>
  );
}
