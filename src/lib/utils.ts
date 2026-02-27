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
  };
  return names[slug] || capitalize(slug);
}
