import { CardNetwork } from "@/types";
import { getIssuerDisplayName } from "@/lib/utils";
import { NETWORK_LABELS } from "@/lib/constants";

interface CardImageProps {
  name: string;
  issuer: string;
  network: CardNetwork;
  className?: string;
}

const ISSUER_COLORS: Record<string, { from: string; to: string; chip: string }> = {
  hdfc: { from: "#004b87", to: "#002f6c", chip: "#ffd700" },
  sbi: { from: "#22409a", to: "#1a2f6e", chip: "#ffffff" },
  icici: { from: "#f58220", to: "#b85a10", chip: "#ffffff" },
  axis: { from: "#97144d", to: "#6e0f39", chip: "#ffd700" },
  amex: { from: "#006fcf", to: "#004a8f", chip: "#ffffff" },
  idfc: { from: "#9c1d26", to: "#6d151b", chip: "#ffd700" },
  au: { from: "#6b2fa0", to: "#4a1f70", chip: "#ffffff" },
};

const DEFAULT_COLORS = { from: "#1a1a2e", to: "#16213e", chip: "#ffd700" };

export function CardImage({ name, issuer, network, className = "" }: CardImageProps) {
  const colors = ISSUER_COLORS[issuer] ?? DEFAULT_COLORS;
  const issuerName = getIssuerDisplayName(issuer);
  const networkName = NETWORK_LABELS[network] ?? network;

  // Split card name for display — show last 1-2 words as the prominent name
  const words = name.split(" ");
  const prominentName = words.length > 2 ? words.slice(-2).join(" ") : words.slice(-1)[0];

  return (
    <svg
      viewBox="0 0 340 214"
      className={className}
      role="img"
      aria-label={`${name} credit card`}
    >
      <defs>
        <linearGradient id={`bg-${issuer}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
        <linearGradient id={`chip-${issuer}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.chip} />
          <stop offset="100%" stopColor={colors.chip} stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Card body */}
      <rect width="340" height="214" rx="16" fill={`url(#bg-${issuer})`} />

      {/* Subtle pattern overlay */}
      <circle cx="300" cy="40" r="120" fill="white" opacity="0.03" />
      <circle cx="320" cy="60" r="80" fill="white" opacity="0.04" />

      {/* Chip */}
      <rect x="30" y="70" width="45" height="34" rx="6" fill={`url(#chip-${issuer})`} opacity="0.9" />
      <line x1="30" y1="82" x2="75" y2="82" stroke={colors.to} strokeWidth="0.5" opacity="0.3" />
      <line x1="30" y1="92" x2="75" y2="92" stroke={colors.to} strokeWidth="0.5" opacity="0.3" />
      <line x1="52" y1="70" x2="52" y2="104" stroke={colors.to} strokeWidth="0.5" opacity="0.3" />

      {/* Contactless icon */}
      <g transform="translate(90, 75)" opacity="0.5">
        <path d="M0 12 Q4 8 4 4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M3 12 Q7 7 7 2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M6 12 Q10 6 10 0" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Issuer name */}
      <text x="30" y="40" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="700" fill="white" opacity="0.9">
        {issuerName}
      </text>

      {/* Card name */}
      <text x="30" y="150" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="700" fill="white" letterSpacing="1">
        {prominentName}
      </text>

      {/* Card number placeholder */}
      <text x="30" y="180" fontFamily="monospace" fontSize="11" fill="white" opacity="0.4" letterSpacing="2">
        •••• •••• •••• ••••
      </text>

      {/* Network name */}
      <text x="310" y="196" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="600" fill="white" opacity="0.7" textAnchor="end">
        {networkName}
      </text>
    </svg>
  );
}
