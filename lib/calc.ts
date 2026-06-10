/** Pure money helpers — easy to unit-test, no I/O. */

export interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export const GST_RATE = 0.1; // Australian GST = 10%

/** Compute subtotal, GST (10%) and total from line items (Australian rules). */
export function computeTotals(items: LineItem[]): {
  subtotal: number;
  gst: number;
  total: number;
} {
  const subtotal = round2(items.reduce((sum, i) => sum + (i.amount || 0), 0));
  const gst = round2(subtotal * GST_RATE);
  const total = round2(subtotal + gst);
  return { subtotal, gst, total };
}

/** A line item's amount is qty × unit price. */
export function lineAmount(qty: number, unitPrice: number): number {
  return round2(qty * unitPrice);
}
