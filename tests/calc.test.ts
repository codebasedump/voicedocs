import { describe, it, expect } from "vitest";
import { computeTotals, lineAmount, GST_RATE } from "@/lib/calc";

describe("calc — Australian GST math", () => {
  it("GST rate is 10%", () => {
    expect(GST_RATE).toBe(0.1);
  });

  it("lineAmount = qty × unit price", () => {
    expect(lineAmount(24, 85)).toBe(2040);
    expect(lineAmount(3, 19.99)).toBe(59.97);
  });

  it("computes subtotal, GST and total (matches the sample kitchen-reno invoice)", () => {
    const items = [
      { description: "Labour", qty: 24, unitPrice: 85, amount: 2040 },
      { description: "Tiles", qty: 1, unitPrice: 420, amount: 420 },
      { description: "Plumbing", qty: 1, unitPrice: 180, amount: 180 },
      { description: "Silicone & grout", qty: 1, unitPrice: 65, amount: 65 },
    ];
    expect(computeTotals(items)).toEqual({ subtotal: 2705, gst: 270.5, total: 2975.5 });
  });

  it("handles an empty invoice", () => {
    expect(computeTotals([])).toEqual({ subtotal: 0, gst: 0, total: 0 });
  });

  it("rounds to 2 decimal places", () => {
    const items = [{ description: "x", qty: 1, unitPrice: 33.33, amount: 33.33 }];
    const t = computeTotals(items);
    expect(t.gst).toBe(3.33);
    expect(t.total).toBe(36.66);
  });
});
