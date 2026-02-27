import { clsx } from "clsx";

type StarRatingSize = "sm" | "md";

interface StarRatingProps {
  rating: number;
  showValue?: boolean;
  size?: StarRatingSize;
  className?: string;
}

const sizeMap: Record<StarRatingSize, { star: number; text: string }> = {
  sm: { star: 14, text: "text-xs" },
  md: { star: 18, text: "text-sm" },
};

function StarIcon({
  fill,
  size,
}: {
  fill: "full" | "half" | "empty";
  size: number;
}) {
  const id = `half-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {fill === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={
          fill === "full"
            ? "#f59e0b"
            : fill === "half"
              ? `url(#${id})`
              : "#d1d5db"
        }
      />
    </svg>
  );
}

export function StarRating({
  rating,
  showValue = true,
  size = "md",
  className,
}: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clamped);
  const hasHalf = clamped - fullStars >= 0.25 && clamped - fullStars < 0.75;
  const adjustedFull = clamped - fullStars >= 0.75 ? fullStars + 1 : fullStars;
  const emptyStars = 5 - adjustedFull - (hasHalf ? 1 : 0);
  const { star, text } = sizeMap[size];

  return (
    <div
      className={clsx("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`${clamped.toFixed(1)} out of 5 stars`}
    >
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: adjustedFull }, (_, i) => (
          <StarIcon key={`full-${i}`} fill="full" size={star} />
        ))}
        {hasHalf && <StarIcon fill="half" size={star} />}
        {Array.from({ length: emptyStars }, (_, i) => (
          <StarIcon key={`empty-${i}`} fill="empty" size={star} />
        ))}
      </span>
      {showValue && (
        <span className={clsx("font-medium text-text-muted", text)}>
          {clamped.toFixed(1)}
        </span>
      )}
    </div>
  );
}
