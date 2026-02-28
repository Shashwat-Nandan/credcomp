export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatPercentage(value: number): string {
  return `${value}%`;
}

export function getIssuerDisplayName(slug: string): string {
  const names: Record<string, string> = {
    hdfc: "HDFC Bank",
    sbi: "SBI Card",
    icici: "ICICI Bank",
    axis: "Axis Bank",
    amex: "American Express",
    idfc: "IDFC FIRST Bank",
    au: "AU Small Finance Bank",
    kotak: "Kotak Mahindra Bank",
    indusind: "IndusInd Bank",
    rbl: "RBL Bank",
    hsbc: "HSBC",
    yes: "YES Bank",
    federal: "Federal Bank",
    sc: "Standard Chartered",
  };
  return names[slug] || capitalize(slug);
}

/** Returns CSS hex colors for issuer-specific gradients */
export function getIssuerGradient(issuer: string): [string, string] {
  const gradients: Record<string, [string, string]> = {
    hdfc:     ["#1e40af", "#2563eb"],  // blue
    sbi:      ["#312e81", "#7e22ce"],  // indigo → purple
    icici:    ["#ea580c", "#f59e0b"],  // orange → amber
    axis:     ["#881337", "#be185d"],  // burgundy → pink
    amex:     ["#0369a1", "#06b6d4"],  // sky → cyan
    idfc:     ["#b91c1c", "#f43f5e"],  // red → rose
    au:       ["#6d28d9", "#d946ef"],  // violet → fuchsia
    kotak:    ["#dc2626", "#f87171"],  // red
    indusind: ["#0f766e", "#10b981"],  // teal → emerald
    rbl:      ["#2563eb", "#38bdf8"],  // blue → sky
    hsbc:     ["#991b1b", "#dc2626"],  // dark red
    yes:      ["#1d4ed8", "#6366f1"],  // blue → indigo
    federal:  ["#ca8a04", "#fbbf24"],  // yellow → amber
    sc:       ["#15803d", "#14b8a6"],  // green → teal
  };
  return gradients[issuer] || ["#374151", "#6b7280"];
}
