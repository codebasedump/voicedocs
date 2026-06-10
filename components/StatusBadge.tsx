import { STATUS_STYLES, type DocStatus } from "@/lib/mock";

export function StatusBadge({ status }: { status: DocStatus }) {
  return (
    <span
      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLES[status]}`}
    >
      {status === "Paid" ? "Paid ✓" : status}
    </span>
  );
}
