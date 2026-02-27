import { clsx } from "clsx";

type BadgeVariant = "default" | "success" | "warning" | "accent" | "outline";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-100 text-gray-800": variant === "default",
          "bg-emerald-100 text-emerald-800": variant === "success",
          "bg-amber-100 text-amber-800": variant === "warning",
          "bg-red-100 text-red-800": variant === "accent",
          "border border-gray-300 text-gray-700": variant === "outline",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
