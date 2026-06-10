import { describe, it, expect, vi } from "vitest";

// `lib/auth` imports next/headers (only used by getSession at request time).
// Stub it so the module imports cleanly in a plain Node test.
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
} from "@/lib/auth";

describe("auth — passwords", () => {
  it("hashes and verifies a password", async () => {
    const hash = await hashPassword("Voicedocs2026");
    expect(hash).not.toBe("Voicedocs2026"); // never store plaintext
    expect(await verifyPassword("Voicedocs2026", hash)).toBe(true);
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });
});

describe("auth — JWT session tokens", () => {
  it("signs and verifies a token round-trip", () => {
    const token = signToken({ userId: "abc123", email: "a@b.com", firstName: "Al" });
    const payload = verifyToken(token);
    expect(payload?.userId).toBe("abc123");
    expect(payload?.email).toBe("a@b.com");
  });

  it("rejects a tampered/invalid token", () => {
    expect(verifyToken("not-a-real-token")).toBeNull();
  });
});
