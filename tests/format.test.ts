import { describe, it, expect } from "vitest";
import { money, initialsFrom, relativeTime } from "@/lib/format";

describe("format helpers", () => {
  it("formats AUD money", () => {
    expect(money(2975.5)).toBe("$2,975.50");
    expect(money(0)).toBe("$0.00");
    expect(money(undefined)).toBeUndefined();
  });

  it("derives initials", () => {
    expect(initialsFrom("John Smith")).toBe("JS");
    expect(initialsFrom("Madonna")).toBe("M");
    expect(initialsFrom(undefined, "alice@example.com")).toBe("A");
  });

  it("formats relative time", () => {
    expect(relativeTime(new Date())).toBe("Just now");
    expect(relativeTime(new Date(Date.now() - 2 * 3600_000))).toBe("2h ago");
  });
});
