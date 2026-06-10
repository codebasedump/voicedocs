import { money } from "@/lib/format";

export interface DocBusiness {
  name?: string;
  abn?: string;
  address?: string;
  paymentTerms?: string;
  bankBsb?: string;
  bankAccount?: string;
}

export interface DocData {
  summary?: string;
  items?: { description: string; qty: number; unitPrice: number; amount: number }[];
  totals?: { subtotal: number; gst: number; total: number };
  sections?: { heading: string; body: string }[];
  business?: DocBusiness;
  notes?: string;
}

export interface DocLike {
  type: string;
  title: string;
  clientName?: string;
  currency?: string;
  totalAmount?: number;
  data?: DocData;
}

/** Renders a generated document — invoice/quote table or sectioned text. */
export function DocumentView({ doc }: { doc: DocLike }) {
  const currency = doc.currency || "AUD";
  const data = doc.data || {};
  const isMoney = Array.isArray(data.items);
  const biz = data.business || {};
  const bizLine = [biz.name || "Your business", biz.abn ? `ABN ${biz.abn}` : null]
    .filter(Boolean)
    .join(" · ");
  const hasBank = biz.bankBsb || biz.bankAccount;

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-brand pb-3">
        <div>
          <h3 className="font-serif text-lg font-bold uppercase text-brand">{doc.title}</h3>
          <p className="mt-0.5 text-[10px] text-ink/50">{bizLine}</p>
          {biz.address && <p className="text-[10px] text-ink/40">{biz.address}</p>}
        </div>
        {doc.clientName && (
          <div className="text-right">
            <p className="text-[9px] font-bold tracking-wide text-ink/40">PREPARED FOR</p>
            <p className="text-xs font-semibold text-ink">{doc.clientName}</p>
          </div>
        )}
      </div>

      {/* Money documents → line items table */}
      {isMoney ? (
        <div className="mt-3">
          <div className="flex border-b border-line py-1.5 text-[10px] font-bold text-ink/40">
            <span className="flex-[2]">Item</span>
            <span className="flex-1 text-right">Qty</span>
            <span className="flex-1 text-right">Amount</span>
          </div>
          {data.items!.map((l, i) => (
            <div key={i} className="flex border-b border-line py-1.5 text-[11px] text-ink">
              <span className="flex-[2]">{l.description}</span>
              <span className="flex-1 text-right text-ink/50">{l.qty}</span>
              <span className="flex-1 text-right font-semibold">{money(l.amount, currency)}</span>
            </div>
          ))}
          {data.totals && (
            <div className="mt-2 flex flex-col items-end gap-0.5 text-[11px]">
              <div className="flex gap-4">
                <span className="text-ink/50">Subtotal</span>
                <span className="font-semibold">{money(data.totals.subtotal, currency)}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-ink/50">GST 10%</span>
                <span className="font-semibold">{money(data.totals.gst, currency)}</span>
              </div>
              <div className="mt-1 flex gap-4 border-t-2 border-brand pt-1.5">
                <span className="text-xs font-bold text-brand">TOTAL {currency}</span>
                <span className="font-serif text-base font-extrabold text-brand">
                  {money(data.totals.total, currency)}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Text documents → sections */
        <div className="mt-4 space-y-4">
          {(data.sections ?? [{ heading: "Summary", body: data.summary ?? "" }]).map((s, i) => (
            <div key={i}>
              <p className="text-[10px] font-bold uppercase tracking-wide text-brand">{s.heading}</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink/80">{s.body}</p>
            </div>
          ))}
        </div>
      )}

      {isMoney && (biz.paymentTerms || hasBank) && (
        <div className="mt-4 rounded-xl bg-surface-2 p-3 text-[10px] text-ink/60">
          <p className="font-bold text-ink/70">Payment details</p>
          {biz.paymentTerms && <p className="mt-0.5">Terms: {biz.paymentTerms}</p>}
          {hasBank && (
            <p>
              Bank transfer: BSB {biz.bankBsb || "—"} · Acct {biz.bankAccount || "—"}
            </p>
          )}
        </div>
      )}

      {data.notes && <p className="mt-4 text-[10px] italic text-ink/40">{data.notes}</p>}
    </div>
  );
}
