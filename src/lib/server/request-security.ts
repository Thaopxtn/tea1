import "server-only";

const DEFAULT_MAX_BYTES = 64 * 1024;

export class RequestValidationError extends Error {}

export async function readJsonBody(
  request: Request,
  maxBytes = DEFAULT_MAX_BYTES,
): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) {
    throw new RequestValidationError("Content-Type phải là application/json.");
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestValidationError("Yêu cầu vượt quá kích thước cho phép.");
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new RequestValidationError("Yêu cầu vượt quá kích thước cho phép.");
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new RequestValidationError("JSON không hợp lệ.");
  }
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const allowedOrigins = new Set([new URL(request.url).origin]);
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      allowedOrigins.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    }
    return allowedOrigins.has(new URL(origin).origin);
  } catch {
    return false;
  }
}

export function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0];
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    forwarded?.trim() ??
    "unknown"
  ).slice(0, 128);
}
