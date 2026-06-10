import { getTemplate } from "./templates";
import { computeTotals } from "./calc";

export interface GeneratedDoc {
  type: string;
  title: string;
  clientName?: string;
  currency: string;
  totalAmount?: number;
  /** Flexible payload. Invoice/quote use `items` + `totals`; others use `sections`. */
  data: {
    summary?: string;
    items?: { description: string; qty: number; unitPrice: number; amount: number }[];
    totals?: { subtotal: number; gst: number; total: number };
    sections?: { heading: string; body: string }[];
    notes?: string;
  };
}

const MONEY_DOCS = new Set(["invoice", "quote"]);

function sectionGuide(templateId: string): string {
  switch (templateId) {
    case "ndis":
      return "Sections: Participant details, Goals addressed, Observations, Actions taken, Recommendations.";
    case "meeting":
      return "Sections: Attendees, Key decisions, Action items, Next steps.";
    case "soap":
      return "Sections: Subjective, Objective, Assessment, Plan.";
    case "report":
      return "Sections: Summary, Findings, Recommendations, Sign-off.";
    case "email":
      return "Sections: Subject, Body. Keep it professional and concise.";
    case "contract":
      return "Sections: Parties, Key terms, Obligations, Plain-English summary.";
    default:
      return "Sections: Summary, Details.";
  }
}

function buildSystemPrompt(templateId: string): string {
  const tpl = getTemplate(templateId);
  if (MONEY_DOCS.has(templateId)) {
    return [
      `You are an expert Australian bookkeeper creating a ${tpl.name}.`,
      `Extract line items, quantities and prices from the user's spoken description.`,
      `Apply Australian GST at 10%. Amounts in AUD.`,
      `Respond with ONLY valid minified JSON (no markdown, no commentary) of this exact shape:`,
      `{"title":string,"clientName":string,"currency":"AUD","items":[{"description":string,"qty":number,"unitPrice":number,"amount":number}],"totals":{"subtotal":number,"gst":number,"total":number},"totalAmount":number,"notes":string}`,
      `Rules: amount = qty*unitPrice; subtotal = sum(amount); gst = round(subtotal*0.1, 2); total = subtotal+gst; totalAmount = total.`,
    ].join(" ");
  }
  return [
    `You are a professional assistant creating a ${tpl.name} from a spoken description.`,
    sectionGuide(templateId),
    `Use clear, professional Australian English. Do not invent facts not implied by the input.`,
    `Respond with ONLY valid minified JSON (no markdown, no commentary) of this exact shape:`,
    `{"title":string,"clientName":string,"sections":[{"heading":string,"body":string}]}`,
  ].join(" ");
}

function extractJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error("Model did not return valid JSON");
  }
}

/** Deterministic fallback so the app works without an API key. */
function mockGenerate(templateId: string, transcript: string): GeneratedDoc {
  const tpl = getTemplate(templateId);
  const clean = transcript.trim();
  const today = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });

  if (MONEY_DOCS.has(templateId)) {
    // naive: sum any $ amounts mentioned
    const amounts = [...clean.matchAll(/\$?\s?(\d+(?:\.\d{1,2})?)/g)].map((m) => parseFloat(m[1]));
    const subtotal = amounts.length ? amounts.reduce((a, b) => a + b, 0) : 0;
    const items = [
      { description: clean.slice(0, 80) || "Services as described", qty: 1, unitPrice: subtotal, amount: subtotal },
    ];
    const totals = computeTotals(items);
    return {
      type: templateId,
      title: `${tpl.name} — ${today}`,
      currency: "AUD",
      totalAmount: totals.total,
      data: {
        summary: clean || "Created from voice.",
        items,
        totals,
        notes: "Generated offline (no AI key set). Add ANTHROPIC_API_KEY for full AI formatting.",
      },
    };
  }

  return {
    type: templateId,
    title: `${tpl.name} — ${today}`,
    currency: "AUD",
    data: {
      sections: [
        { heading: "Summary", body: clean || "Created from voice." },
        { heading: "Note", body: "Generated offline (no AI key set). Add ANTHROPIC_API_KEY for full AI formatting." },
      ],
    },
  };
}

/** Generate a structured document from a transcript. Uses Claude if a key is
 *  configured, otherwise a deterministic mock so the flow always works. */
export async function generateDocument(
  templateId: string,
  transcript: string
): Promise<GeneratedDoc> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return mockGenerate(templateId, transcript);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system: buildSystemPrompt(templateId),
        messages: [{ role: "user", content: transcript || "(no speech captured)" }],
      }),
    });
    if (!res.ok) throw new Error(`Claude API ${res.status}`);
    const json = await res.json();
    const text: string = json?.content?.[0]?.text ?? "";
    const parsed = extractJson(text) as Partial<GeneratedDoc> & {
      items?: GeneratedDoc["data"]["items"];
      totals?: GeneratedDoc["data"]["totals"];
      sections?: GeneratedDoc["data"]["sections"];
      notes?: string;
    };

    return {
      type: templateId,
      title: parsed.title || getTemplate(templateId).name,
      clientName: parsed.clientName || undefined,
      currency: parsed.currency || "AUD",
      totalAmount: parsed.totalAmount,
      data: {
        items: parsed.items,
        totals: parsed.totals,
        sections: parsed.sections,
        notes: parsed.notes,
      },
    };
  } catch {
    // Any failure → graceful fallback so the user still gets a document.
    return mockGenerate(templateId, transcript);
  }
}
