import type { TemplateId } from "./templates";

export type DocStatus =
  | "Draft"
  | "Sent"
  | "Viewed"
  | "Paid"
  | "Submitted"
  | "Shared";

export interface DocRow {
  id: string;
  type: TemplateId;
  title: string;
  amount?: string;
  when: string;
  status: DocStatus;
  group: "Today" | "Yesterday" | "Earlier";
}

export const RECENT_DOCS: DocRow[] = [
  {
    id: "INV-2026-047",
    type: "invoice",
    title: "Invoice — Kitchen Reno, John Smith",
    amount: "$2,975.50",
    when: "2h ago",
    status: "Sent",
    group: "Today",
  },
  {
    id: "QTE-2026-019",
    type: "quote",
    title: "Quote — Bathroom Reno, Lisa Park",
    amount: "$4,200.00",
    when: "4h ago",
    status: "Viewed",
    group: "Today",
  },
  {
    id: "NDIS-2026-088",
    type: "ndis",
    title: "Care Note — Margaret Wilson physio",
    when: "Yesterday",
    status: "Submitted",
    group: "Yesterday",
  },
  {
    id: "MTG-2026-031",
    type: "meeting",
    title: "Meeting — Team standup summary",
    when: "Yesterday",
    status: "Shared",
    group: "Yesterday",
  },
  {
    id: "INV-2026-046",
    type: "invoice",
    title: "Invoice — Fence repair, David K.",
    amount: "$890.00",
    when: "Yesterday",
    status: "Paid",
    group: "Yesterday",
  },
];

export interface ClientRow {
  id: string;
  name: string;
  initials: string;
  meta: string;
  phone: string;
  tag?: string;
  accent: string; // hex for avatar gradient
}

export const CLIENTS: ClientRow[] = [
  { id: "c1", name: "John Smith", initials: "JS", meta: "8 documents · $7,890 total", phone: "0412 345 678", tag: "VIP", accent: "#6C3CE1" },
  { id: "c2", name: "Margaret Wilson", initials: "MW", meta: "12 care notes · NDIS", phone: "0423 456 789", tag: "NDIS", accent: "#10B981" },
  { id: "c3", name: "Lisa Park", initials: "LP", meta: "3 quotes · $9,400 pending", phone: "0434 567 890", accent: "#3B82F6" },
  { id: "c4", name: "David Kumar", initials: "DK", meta: "15 documents · $4,200 paid", phone: "0445 678 901", tag: "Regular", accent: "#F59E0B" },
  { id: "c5", name: "Sarah Chen", initials: "SC", meta: "5 documents · $2,800 total", phone: "0456 789 012", accent: "#EC4899" },
  { id: "c6", name: "Emily Wong", initials: "EW", meta: "1 document · New", phone: "0478 901 234", tag: "New", accent: "#06B6D4" },
];

export const STATUS_STYLES: Record<DocStatus, string> = {
  Draft: "bg-warning/10 text-warning",
  Sent: "bg-success/10 text-success",
  Viewed: "bg-info/10 text-info",
  Paid: "bg-success/10 text-success",
  Submitted: "bg-brand/10 text-brand",
  Shared: "bg-cyan/10 text-cyan",
};
