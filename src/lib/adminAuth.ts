/**
 * Xác thực admin tối giản: 1 mật khẩu dùng chung (biến môi trường ADMIN_PASSWORD),
 * phiên đăng nhập là 1 cookie ký bằng HMAC-SHA256 (SESSION_SECRET), có hạn dùng.
 * Dùng Web Crypto API (crypto.subtle) thay vì module "crypto" của Node để chạy được
 * cả ở middleware (Edge runtime) lẫn Server Actions (Node runtime).
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 ngày

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(data: string): Promise<string> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Thiếu biến môi trường SESSION_SECRET");
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toHex(signature);
}

export async function createSessionToken(): Promise<{ token: string; maxAgeSeconds: number }> {
  const expires = Date.now() + SESSION_TTL_MS;
  const signature = await hmac(String(expires));
  return { token: `${expires}.${signature}`, maxAgeSeconds: SESSION_TTL_MS / 1000 };
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expiresStr, signature] = token.split(".");
  if (!expiresStr || !signature) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const expected = await hmac(expiresStr);
  return expected === signature;
}
