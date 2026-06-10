import Link from "next/link";
import {
  Mic,
  Bell,
  Search,
  Plus,
  Users,
  ChevronRight,
  ArrowUpRight,
  FileText,
  DollarSign,
  Clock,
} from "@/components/icons";
import { TEMPLATES } from "@/lib/templates";
import { StatusBadge } from "@/components/StatusBadge";
import type { DocStatus } from "@/lib/mock";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/lib/models/Document";
import { UserModel } from "@/lib/models/User";
import { relativeTime, money } from "@/lib/format";

export const dynamic = "force-dynamic";

const PLAN_LIMIT: Record<string, number> = { free: 5, pro: 50, business: Infinity };
const QUICK_CHIPS = TEMPLATES.slice(0, 3);

export default async function Dashboard() {
  const session = (await getSession())!; // layout guarantees a session
  await connectDB();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [recent, monthCount, allDocs, user] = await Promise.all([
    DocumentModel.find({ userId: session.userId }).sort({ createdAt: -1 }).limit(5).lean(),
    DocumentModel.countDocuments({ userId: session.userId, createdAt: { $gte: startOfMonth } }),
    DocumentModel.find({ userId: session.userId }).select("totalAmount").lean(),
    UserModel.findById(session.userId).select("plan firstName").lean(),
  ]);

  const revenue = allDocs.reduce((sum, d: { totalAmount?: number }) => sum + (d.totalAmount || 0), 0);
  const hoursSaved = (allDocs.length * 0.4).toFixed(1);
  const plan = (user as { plan?: string })?.plan ?? "free";
  const limit = PLAN_LIMIT[plan] ?? 5;
  const pct = limit === Infinity ? 0 : Math.min(100, Math.round((monthCount / limit) * 100));

  const STATS = [
    { label: "Documents this month", value: String(monthCount), trend: monthCount > 0 ? `${monthCount} total` : "Get started", icon: FileText },
    { label: "Revenue tracked", value: money(revenue) ?? "$0", trend: revenue > 0 ? "AUD" : "—", icon: DollarSign },
    { label: "Hours saved", value: `${hoursSaved}h`, trend: "≈ admin time", icon: Clock },
  ];

  return (
    <div className="px-4 pb-4 pt-6 sm:px-8">
      {/* Top bar */}
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-ink/50">Welcome back</p>
          <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">
            {session.firstName || "there"} <span className="align-middle">👋</span>
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink/40 sm:flex">
            <Search className="size-4" /> Search…
          </div>
          <button aria-label="Notifications" className="relative flex size-10 items-center justify-center rounded-xl border border-line bg-surface text-ink/60 transition hover:bg-surface-2">
            <Bell className="size-4" />
          </button>
        </div>
      </header>

      {/* Hero stat band */}
      <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#6c3ce1_0%,#5b2fcc_55%,#3f2192_100%)] p-5 shadow-xl shadow-brand/20 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-brand-light/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 size-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid gap-3 sm:grid-cols-3 sm:gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 text-white">
                  <s.icon className="size-4.5" />
                </span>
                <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white/80">
                  <ArrowUpRight className="size-3" /> {s.trend}
                </span>
              </div>
              <p className="mt-3 font-serif text-2xl font-extrabold text-white">{s.value}</p>
              <p className="text-[11px] text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Record CTA + usage */}
      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-6 lg:col-span-2">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brand/5 blur-2xl" />
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <Link href="/templates" aria-label="Start recording" className="relative grid place-items-center">
              <span className="absolute inline-flex size-20 animate-ping rounded-full bg-brand/20" />
              <span className="relative flex size-[72px] items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light shadow-lg shadow-brand/40 transition hover:scale-105">
                <Mic className="size-8 text-white" />
              </span>
            </Link>
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-xl font-bold text-ink">Create with your voice</h2>
              <p className="mt-1 text-sm text-ink/50">Speak naturally — AI formats a finished document in seconds.</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {QUICK_CHIPS.map((t) => (
                  <Link key={t.id} href={`/record?template=${t.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-brand/40 hover:text-brand">
                    <t.icon className={`size-3.5 ${t.accent}`} /> {t.short}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink">This month</p>
            <span className="rounded-full bg-brand-bg px-2 py-0.5 text-[10px] font-bold capitalize text-brand">{plan} ✨</span>
          </div>
          <div className="mt-3">
            <div className="flex items-end justify-between">
              <p className="font-serif text-2xl font-extrabold text-ink">
                {monthCount}
                <span className="text-base text-ink/40">/{limit === Infinity ? "∞" : limit}</span>
              </p>
              <p className="text-[11px] text-ink/50">documents</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/templates" className="flex items-center gap-2 rounded-xl bg-brand px-3 py-2.5 text-xs font-bold text-white transition hover:bg-brand-dark">
              <Plus className="size-4" /> New doc
            </Link>
            <Link href="/clients" className="flex items-center gap-2 rounded-xl border border-line px-3 py-2.5 text-xs font-bold text-ink/70 transition hover:bg-surface-2">
              <Users className="size-4" /> Clients
            </Link>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">Templates</h2>
          <Link href="/templates" className="text-xs font-semibold text-brand">Browse all</Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {TEMPLATES.slice(0, 6).map((t) => (
            <Link key={t.id} href={`/record?template=${t.id}`} className="group rounded-2xl border border-line bg-surface p-3.5 text-center transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5">
              <span className={`mx-auto flex size-10 items-center justify-center rounded-xl ${t.tint} transition group-hover:scale-110`}>
                <t.icon className={`size-5 ${t.accent}`} />
              </span>
              <p className="mt-2 text-[11px] font-semibold text-ink">{t.short}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent documents */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">Recent documents</h2>
          <Link href="/documents" className="flex items-center gap-1 text-xs font-semibold text-brand">
            View all <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-bg">
              <Mic className="size-5 text-brand" />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink">No documents yet</p>
            <p className="mt-1 text-xs text-ink/50">Tap a template and speak — your first document lands here.</p>
            <Link href="/templates" className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white">
              Create your first document
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            {recent.map((d, i) => {
              const tpl = TEMPLATES.find((t) => t.id === d.type) ?? TEMPLATES[0];
              const amt = money(d.totalAmount as number | undefined, (d.currency as string) || "AUD");
              return (
                <Link
                  key={String(d._id)}
                  href="/documents"
                  className={`flex items-center gap-3 px-4 py-3.5 transition hover:bg-surface-2 ${i < recent.length - 1 ? "border-b border-line" : ""}`}
                >
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
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
