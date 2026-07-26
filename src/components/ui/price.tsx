import { formatVnd } from "@/lib/commerce";

export function Price({
  value,
  compareAt,
}: {
  value: number;
  compareAt?: number;
}) {
  return (
    <span className="price">
      <span>{formatVnd(value)}</span>
      {compareAt && compareAt > value ? (
        <del aria-label={`Giá cũ ${formatVnd(compareAt)}`}>
          {formatVnd(compareAt)}
        </del>
      ) : null}
    </span>
  );
}
