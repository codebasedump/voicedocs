import {
  FileText,
  Calculator,
  ClipboardList,
  CalendarCheck,
  Stethoscope,
  Building2,
  Mail,
  ScrollText,
  type IconType,
} from "@/components/icons";

export type TemplateId =
  | "invoice"
  | "quote"
  | "ndis"
  | "meeting"
  | "soap"
  | "report"
  | "email"
  | "contract";

export interface DocTemplate {
  id: TemplateId;
  name: string;
  short: string;
  description: string;
  icon: IconType;
  /** Tailwind brand-ish accent token used for tints */
  accent: string; // e.g. "text-brand"
  tint: string; // e.g. "bg-brand/10"
  popular?: boolean;
}

export const TEMPLATES: DocTemplate[] = [
  {
    id: "invoice",
    name: "Tax Invoice",
    short: "Invoice",
    description: "ABN, GST, line items & payment details",
    icon: FileText,
    accent: "text-brand",
    tint: "bg-brand/10",
    popular: true,
  },
  {
    id: "quote",
    name: "Quote / Estimate",
    short: "Quote",
    description: "Pricing, terms, valid for 30 days",
    icon: Calculator,
    accent: "text-cyan",
    tint: "bg-cyan/10",
  },
  {
    id: "ndis",
    name: "NDIS Progress Note",
    short: "Care Note",
    description: "Goal-based, NDIS Practice Standards compliant",
    icon: ClipboardList,
    accent: "text-success",
    tint: "bg-success/10",
  },
  {
    id: "meeting",
    name: "Meeting Summary",
    short: "Meeting",
    description: "Decisions, action items & attendees",
    icon: CalendarCheck,
    accent: "text-info",
    tint: "bg-info/10",
  },
  {
    id: "soap",
    name: "Clinical SOAP Notes",
    short: "Clinical",
    description: "Subjective, Objective, Assessment, Plan",
    icon: Stethoscope,
    accent: "text-danger",
    tint: "bg-danger/10",
  },
  {
    id: "report",
    name: "Site / Inspection Report",
    short: "Report",
    description: "Findings, recommendations & sign-off",
    icon: Building2,
    accent: "text-warning",
    tint: "bg-warning/10",
  },
  {
    id: "email",
    name: "Professional Email",
    short: "Email",
    description: "Formal, well-structured business email",
    icon: Mail,
    accent: "text-pink",
    tint: "bg-pink/10",
  },
  {
    id: "contract",
    name: "Contract Summary",
    short: "Contract",
    description: "Key terms in plain English",
    icon: ScrollText,
    accent: "text-brand-light",
    tint: "bg-brand-light/10",
  },
];

export const getTemplate = (id: string) =>
  TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
