export const ADMIN_COOKIE = "moc_suong_admin";

type AdminSession = {
  email: string;
  role: "ADMIN";
  expiresAt: number;
};

const encoder = new TextEncoder();

const toBase64Url = (value: Uint8Array | string) => {
  const bytes = typeof value === "string" ? encoder.encode(value) : value;
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
};

const fromBase64Url = (value: string) => {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

async function signature(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(payload)),
  );
}

export function getAdminSecret() {
  const secret = process.env.AUTH_SECRET ?? "";
  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("AUTH_SECRET phải có ít nhất 32 ký tự trong production.");
  }
  return secret;
}

export async function createAdminToken(email: string, secret: string) {
  if (secret.length < 32) throw new Error("AUTH_SECRET chưa đủ mạnh.");
  const session: AdminSession = {
    email,
    role: "ADMIN",
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  };
  const payload = toBase64Url(JSON.stringify(session));
  const signed = await signature(payload, secret);
  return `${payload}.${toBase64Url(signed)}`;
}

export async function verifyAdminToken(
  token: string | undefined,
  secret: string,
) {
  if (!token || secret.length < 32) return null;
  const [payload, providedSignature, extra] = token.split(".");
  if (!payload || !providedSignature || extra) return null;

  try {
    const expected = await signature(payload, secret);
    const actual = fromBase64Url(providedSignature);
    if (expected.length !== actual.length) return null;

    let mismatch = 0;
    expected.forEach((byte, index) => {
      mismatch |= byte ^ actual[index];
    });
    if (mismatch !== 0) return null;

    const decoded = new TextDecoder().decode(fromBase64Url(payload));
    const session = JSON.parse(decoded) as Partial<AdminSession>;
    if (
      session.role !== "ADMIN" ||
      typeof session.email !== "string" ||
      !session.email ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }
    return session as AdminSession;
  } catch {
    return null;
  }
}
