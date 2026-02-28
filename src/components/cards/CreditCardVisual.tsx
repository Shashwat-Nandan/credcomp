"use client";

import { CardNetwork } from "@/types";
import { getIssuerDisplayName, getIssuerGradient } from "@/lib/utils";
import { NETWORK_LABELS } from "@/lib/constants";
import { useState } from "react";

interface CreditCardVisualProps {
  name: string;
  issuer: string;
  network: CardNetwork;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}

function ChipSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 50 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="48"
        height="38"
        rx="5"
        fill="#c5a852"
        stroke="#b8972e"
        strokeWidth="1"
      />
      <rect x="1" y="15" width="48" height="2" fill="#b8972e" opacity="0.5" />
      <rect x="1" y="23" width="48" height="2" fill="#b8972e" opacity="0.5" />
      <rect x="18" y="1" width="2" height="38" fill="#b8972e" opacity="0.5" />
      <rect x="30" y="1" width="2" height="38" fill="#b8972e" opacity="0.5" />
    </svg>
  );
}

function ContactlessSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        fill="white"
        fillOpacity="0.15"
      />
      <path
        d="M8.5 16.5a7.5 7.5 0 0 1 0-9"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M11 14.5a4.5 4.5 0 0 1 0-5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M13.5 13a2 2 0 0 1 0-2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

function NetworkLogo({ network }: { network: CardNetwork }) {
  switch (network) {
    case "visa":
      return (
        <span className="font-bold italic tracking-tight text-white drop-shadow-sm">
          VISA
        </span>
      );
    case "mastercard":
      return (
        <span className="flex items-center gap-0">
          <span className="inline-block h-5 w-5 rounded-full bg-[#eb001b] opacity-90" />
          <span className="-ml-2 inline-block h-5 w-5 rounded-full bg-[#f79e1b] opacity-90" />
        </span>
      );
    case "amex":
      return (
        <span className="text-[0.55em] font-bold leading-tight tracking-wide text-white drop-shadow-sm">
          AMERICAN
          <br />
          EXPRESS
        </span>
      );
    case "rupay":
      return (
        <span className="font-bold tracking-tight text-white drop-shadow-sm">
          <span className="text-green-300">Ru</span>Pay
        </span>
      );
    case "dinersclub":
      return (
        <span className="flex items-center gap-1">
          <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
            <circle
              cx="10"
              cy="10"
              r="9"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              opacity="0.8"
            />
            <circle
              cx="10"
              cy="10"
              r="5"
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
          <span className="text-[0.5em] font-semibold leading-tight text-white drop-shadow-sm">
            DINERS
            <br />
            CLUB
          </span>
        </span>
      );
    default:
      return (
        <span className="text-xs font-semibold text-white/80">
          {NETWORK_LABELS[network] ?? network}
        </span>
      );
  }
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function CreditCardVisual({
  name,
  issuer,
  network,
  imageUrl,
  size = "md",
}: CreditCardVisualProps) {
  const [from, to] = getIssuerGradient(issuer);
  const [imgError, setImgError] = useState(false);
  const showImage = imageUrl && !imgError;

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg ${sizeClasses[size]}`}
      style={{ aspectRatio: "86 / 54" }}
    >
      {/* Gradient background (always rendered behind image) */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${from} 0%, ${to} 60%, ${from}cc 100%)`,
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Sheen / light reflection effect */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
        }}
      />

      {/* Card image overlay */}
      {showImage && (
        <img
          src={imageUrl}
          alt={`${name} card`}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      )}

      {/* Card content - always shown (visible when no image, or as overlay on image) */}
      {!showImage && (
        <div className="relative flex h-full flex-col justify-between p-[8%]">
          {/* Top row: chip + contactless */}
          <div className="flex items-start justify-between">
            <ChipSvg className="h-[22%] w-auto" />
            <ContactlessSvg className="h-[16%] w-auto" />
          </div>

          {/* Card number dots */}
          <div className="flex gap-[6%] opacity-40">
            {[0, 1, 2, 3].map((group) => (
              <div key={group} className="flex gap-[3px]">
                {[0, 1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className="inline-block h-[4px] w-[4px] rounded-full bg-white"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Bottom row: card name/issuer + network logo */}
          <div className="flex items-end justify-between">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[0.85em] font-semibold leading-tight text-white drop-shadow-sm">
                {name}
              </div>
              <div className="mt-[2px] truncate text-[0.65em] text-white/60">
                {getIssuerDisplayName(issuer)}
              </div>
            </div>
            <div className="ml-2 flex-shrink-0 text-[1em]">
              <NetworkLogo network={network} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
