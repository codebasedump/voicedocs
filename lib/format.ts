/** Shared formatting helpers (server + client safe). */

export function relativeTime(d: Date | string): string {
  const date = new Date(d);
  const diff = Date.now() - date.getTime();
  const m = 60_000, h = 3_600_000, day = 86_400_000;
  if (diff < m) return "Just now";
  if (diff < h) return `${Math.floor(diff / m)}m ago`;
  if (diff < day) return `${Math.floor(diff / h)}h ago`;
  if (diff < 2 * day) return "Yesterday";
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

export function money(n?: number | null, currency = "AUD"): string | undefined {
  if (n == null) return undefined;
  return new Intl.NumberFormat("en-AU", { style: "currency", currency }).format(n);
}

export function initialsFrom(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (email?.[0] ?? "U").toUpperCase();
}
