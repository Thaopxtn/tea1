import { Star } from "lucide-react";

export function Rating({
  value,
  count,
  demo = true,
}: {
  value: number;
  count: number;
  demo?: boolean;
}) {
  return (
    <span
      className="rating"
      aria-label={`${value.toFixed(1)} trên 5, ${count} đánh giá${demo ? " demo" : ""}`}
    >
      <Star aria-hidden="true" size={15} fill="currentColor" />
      <span>{value.toFixed(1)}</span>
      <span className="muted">
        ({count}
        {demo ? " demo" : ""})
      </span>
    </span>
  );
}
