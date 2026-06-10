import Link from "next/link";
import { Search, FileText } from "@/components/icons";
import { TEMPLATES } from "@/lib/templates";
import { StatusBadge } from "@/components/StatusBadge";
import type { DocStatus } from "@/lib/mock";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/lib/models/Document";
import { relativeTime, money } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const session = (await getSession())!;
  await connectDB();

  const all = await DocumentModel.find({ userId: session.userId }).sort({ createdAt: -1 }).limit(200).lean();
  const docs = type ? all.filter((d) => d.type === type) : all;

  // counts per type for the filter chips
  const counts: Record<string, number> = {};
  for (const d of all) counts[d.type as string] = (counts[d.type as string] || 0) + 1;

  const filters = [
    { id: undefined, label: `All (${all.length})` },
    ...TEMPLATES.filter((t) => counts[t.id]).map((t) => ({ id: t.id, label: `${t.short} (${counts[t.id]})` })),
  ];

  return (
    <div className="px-4 pt-6 sm:px-8">
      <div className="mb-4">
        <h1 className="font-serif text-2xl font-bold text-ink">My documents</h1>
        <p className="mt-1 text-sm text-ink/50">
          {all.length} {all.length === 1 ? "document" : "documents"} total
        </p>
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink/40">
        <Search className="size-4" /> Search documents
      </div>

      {/* Filter chips */}
      {all.length > 0 && (
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => {
            const active = f.id === type || (!f.id && !type);
            return (
              <Link
                key={f.label}
                href={f.id ? `/documents?type=${f.id}` : "/documents"}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${active ? "bg-brand text-white" : "border border-line bg-surface text-ink/60"}`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      )}

      {docs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-bg">
            <FileText className="size-5 text-brand" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">
            {all.length === 0 ? "No documents yet" : "Nothing in this category"}
          </p>
          <p className="mt-1 text-xs text-ink/50">Record your voice and your documents will appear here.</p>
          <Link href="/templates" className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white">
            Create a document
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {docs.map((d, i) => {
            const tpl = TEMPLATES.find((t) => t.id === d.type) ?? TEMPLATES[0];
            const amt = money(d.totalAmount as number | undefined, (d.currency as string) || "AUD");
            return (
              <div key={String(d._id)} className={`flex items-center gap-3 px-4 py-3.5 ${i < docs.length - 1 ? "border-b border-line" : ""}`}>
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tpl.tint}`}>
                  <tpl.icon className={`size-5 ${tpl.accent}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{d.title as string}</p>
                  <p className="mt-0.5 text-[11px] text-ink/50">
                    {relativeTime(d.createdAt as Date)}
                    {amt ? ` · ${amt}` : ""}
                  </p>
                </div>
                <StatusBadge status={(d.status as DocStatus) || "Draft"} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
