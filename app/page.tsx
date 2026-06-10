import Link from "next/link";
import {
  Mic, Brain, Send, Star, Check, Sparkles, Calculator, FileText, Lock, Clock,
  Users, Building2, Stethoscope, ClipboardList, ChevronRight,
} from "@/components/icons";
import { Logo } from "@/components/Logo";
import { TEMPLATES } from "@/lib/templates";

const NAV = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Why us", href: "#why" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const STEPS = [
  { n: "1", icon: Mic, title: "Speak", desc: "Tap record and describe what you did, in your own words." },
  { n: "2", icon: Brain, title: "AI creates", desc: "The AI structures, formats and calculates everything for you." },
  { n: "3", icon: Send, title: "Send", desc: "Email, SMS or download as PDF — professionally formatted." },
];

const FEATURES = [
  { icon: Mic, title: "Voice-first", desc: "No forms, no typing. Just talk for 30 seconds and you’re done." },
  { icon: Sparkles, title: "AI formatting", desc: "Finished, professional documents — not raw transcripts." },
  { icon: Calculator, title: "Australian GST & ABN", desc: "Tax invoices with correct GST (10%), ABN and ATO-ready format." },
  { icon: FileText, title: "8+ document types", desc: "Invoices, quotes, NDIS notes, SOAP, reports, emails & more." },
  { icon: Lock, title: "Private & secure", desc: "Your data is encrypted and stored in Australia. Yours only." },
  { icon: Clock, title: "Save 5–10 hrs/week", desc: "Stop doing paperwork at night. Reclaim your evenings." },
];

const PERSONAS = [
  { icon: Building2, title: "Tradies", desc: "Invoice on-site before you leave the job. GST and ABN sorted." },
  { icon: ClipboardList, title: "NDIS providers", desc: "Compliant progress notes in seconds, not 30 minutes a shift." },
  { icon: Stethoscope, title: "Allied health", desc: "Dictate SOAP clinical notes between patients." },
  { icon: Users, title: "Small business", desc: "Quotes, meeting summaries and emails — all by voice." },
];

const COMPARISON = {
  competitors: ["Billio", "VoiceInvoicer", "Invoyce", "EasyInvoice"],
  rows: [
    { feature: "Voice → Invoice", vals: [true, true, true, true], us: true },
    { feature: "Voice → Quote", vals: [false, true, true, true], us: true },
    { feature: "Voice → Care Notes", vals: [false, false, false, false], us: true },
    { feature: "Voice → Meeting Notes", vals: [false, false, false, false], us: true },
    { feature: "Voice → Reports", vals: [false, false, false, false], us: true },
    { feature: "Voice → Clinical Notes", vals: [false, false, false, false], us: true },
    { feature: "Custom templates", vals: [false, false, false, false], us: true },
    { feature: "NDIS compliant", vals: [false, false, false, false], us: true },
    { feature: "Australian GST/ABN", vals: [false, "Some", false, true], us: true },
    { feature: "PWA (no download)", vals: [false, false, false, true], us: true },
  ],
};

const PLANS = [
  { name: "Free", price: "$0", period: "forever", features: ["5 documents / month", "Core templates", "PDF export", "Email delivery"], cta: "Get started", highlight: false },
  { name: "Pro", price: "$14.99", period: "/month", features: ["50 documents / month", "All templates", "Custom branding & ABN", "SMS + email delivery", "DOCX + PDF export", "Xero integration"], cta: "Start free trial", highlight: true },
  { name: "Business", price: "$29.99", period: "/month", features: ["Unlimited documents", "Team (5 users)", "Custom templates", "API access", "Xero + MYOB", "Priority support"], cta: "Start free trial", highlight: false },
];

const FAQS = [
  { q: "Do I need to download an app?", a: "No. VoiceDocs is a Progressive Web App — it works in your browser on any phone, tablet or computer, and you can ‘install’ it to your home screen with one tap. No app store needed." },
  { q: "Is it accurate for Australian tax invoices?", a: "Yes. Invoices include your ABN, correct GST at 10%, line items, totals and payment details, formatted to ATO standards." },
  { q: "What about NDIS and clinical notes?", a: "We have purpose-built templates that follow NDIS Practice Standards and the SOAP clinical format. It documents observations only — it is not medical advice." },
  { q: "Is my data private?", a: "Your documents are scoped to your account, encrypted in transit and at rest, and stored in Australia (AWS Sydney). Only you can see your data." },
  { q: "Can I try it for free?", a: "Yes — the Free plan gives you 5 documents a month with no credit card. Upgrade only when you’re saving real time." },
];

function Tick({ on }: { on: boolean | string }) {
  if (on === true) return <Check className="mx-auto size-4 text-success" />;
  if (on === false) return <span className="text-ink/25">—</span>;
  return <span className="text-[10px] font-semibold text-warning">{on}</span>;
}

export default function Landing() {
  return (
    <div className="flex-1 bg-canvas">
      {/* ───── Nav ───── */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Logo />
          <div className="hidden items-center gap-7 lg:flex">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-ink/60 transition hover:text-ink">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold text-ink sm:block">Sign in</Link>
            <Link href="/signup" className="rounded-[10px] bg-brand px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark">
              Get started free
            </Link>
          </div>
        </nav>
      </header>

      {/* ───── Hero ───── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-brand-bg px-5 py-20 sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute -right-32 -top-20 size-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 size-96 rounded-full bg-brand-light/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <span className="inline-block rounded-full border border-brand/30 bg-brand-bg px-3 py-1 text-[11px] font-bold tracking-wide text-brand">
              🇦🇺 BUILT IN AUSTRALIA
            </span>
            <h1 className="mx-auto mt-5 max-w-xl font-serif text-4xl font-extrabold leading-[1.1] text-ink sm:text-6xl lg:mx-0">
              Speak it.<br /><span className="text-brand">Get the document.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink/60 sm:text-lg lg:mx-0">
              Turn your voice into invoices, care notes, quotes and reports in seconds. The AI handles
              the formatting, GST and structure — you just talk.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-[10px] bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand/30 transition hover:bg-brand-dark">
                <Mic className="size-4" /> Try free — no card
              </Link>
              <a href="#how" className="rounded-[10px] border border-line bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-brand/40">
                See how it works
              </a>
            </div>
            <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-ink/50 lg:justify-start">
              <span className="flex text-warning">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3.5 fill-warning" />)}</span>
              Loved by tradies, NDIS providers &amp; small businesses
            </p>
          </div>

          {/* Hero visual — a sample invoice card */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand/20 to-brand-light/10 blur-2xl" />
            <div className="relative rounded-2xl border border-line bg-surface p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b-2 border-brand pb-3">
                <div>
                  <p className="font-serif text-base font-bold text-brand">TAX INVOICE</p>
                  <p className="text-[10px] text-ink/50">Hoffstee · ABN 12 345 678 901</p>
                </div>
                <span className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">Sent</span>
              </div>
              {[["Labour — Kitchen reno", "$2,040.00"], ["Tiles (porcelain)", "$420.00"], ["Plumbing fittings", "$180.00"]].map(([d, a]) => (
                <div key={d} className="flex justify-between border-b border-line py-1.5 text-[11px] text-ink">
                  <span>{d}</span><span className="font-semibold">{a}</span>
                </div>
              ))}
              <div className="mt-2 flex flex-col items-end gap-0.5 text-[11px]">
                <span className="text-ink/50">GST 10% &nbsp; $270.50</span>
                <span className="font-serif text-base font-extrabold text-brand">TOTAL $2,975.50</span>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand-bg px-3 py-2">
                <Mic className="size-3.5 text-brand" />
                <span className="text-[10px] text-ink/60">Created from 84 seconds of voice</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Stats bar ───── */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 sm:px-8">
          {[["8+", "document types"], ["~60s", "to a finished doc"], ["10 hrs", "saved per week"], ["🇦🇺", "Australian-first"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="font-serif text-2xl font-extrabold text-brand">{v}</p>
              <p className="mt-0.5 text-xs text-ink/55">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section id="how" className="scroll-mt-20 px-5 py-20 sm:px-8">
        <p className="text-center text-[11px] font-bold tracking-[1px] text-brand">HOW IT WORKS</p>
        <h2 className="mt-2 text-center font-serif text-3xl font-bold text-ink sm:text-4xl">3 steps. 30 seconds.</h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light text-white shadow-lg shadow-brand/30">
                <s.icon className="size-7" />
              </div>
              <p className="mt-4 text-xs font-bold text-brand">STEP {s.n}</p>
              <h3 className="mt-1 font-serif text-xl font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="scroll-mt-20 bg-surface px-5 py-20 sm:px-8">
        <p className="text-center text-[11px] font-bold tracking-[1px] text-brand">WHY VOICEDOCS</p>
        <h2 className="mt-2 text-center font-serif text-3xl font-bold text-ink sm:text-4xl">Everything you need, nothing you don’t</h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-line bg-canvas p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-bg text-brand">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Templates ───── */}
      <section id="templates" className="scroll-mt-20 px-5 py-20 sm:px-8">
        <p className="text-center text-[11px] font-bold tracking-[1px] text-brand">DOCUMENT TYPES</p>
        <h2 className="mt-2 text-center font-serif text-3xl font-bold text-ink sm:text-4xl">8 document types — one app</h2>
        <p className="mt-2 text-center text-sm text-ink/60">More added every month</p>
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="rounded-2xl border border-line bg-surface p-5 text-center transition hover:-translate-y-0.5 hover:border-brand/40">
              <div className={`mx-auto flex size-11 items-center justify-center rounded-xl ${t.tint}`}>
                <t.icon className={`size-5 ${t.accent}`} />
              </div>
              <p className="mt-2 text-xs font-bold text-ink">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Personas ───── */}
      <section className="bg-surface px-5 py-20 sm:px-8">
        <h2 className="text-center font-serif text-3xl font-bold text-ink sm:text-4xl">Built for the people who hate paperwork</h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-line bg-canvas p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-bg text-brand">
                <p.icon className="size-6" />
              </div>
              <h3 className="mt-3 text-base font-bold text-ink">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Comparison ───── */}
      <section id="why" className="scroll-mt-20 px-5 py-20 sm:px-8">
        <p className="text-center text-[11px] font-bold tracking-[1px] text-brand">HOW WE COMPARE</p>
        <h2 className="mt-2 text-center font-serif text-3xl font-bold text-ink sm:text-4xl">Others do invoices. We do everything.</h2>
        <div className="mx-auto mt-10 max-w-4xl overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] border-collapse bg-surface text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="p-3 text-left text-xs font-bold text-ink/50">Feature</th>
                {COMPARISON.competitors.map((c) => (
                  <th key={c} className="p-3 text-center text-xs font-semibold text-ink/50">{c}</th>
                ))}
                <th className="bg-brand-bg p-3 text-center text-xs font-extrabold text-brand">VoiceDocs</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.rows.map((r) => (
                <tr key={r.feature} className="border-b border-line last:border-0">
                  <td className="p-3 text-left text-xs font-medium text-ink">{r.feature}</td>
                  {r.vals.map((v, i) => (
                    <td key={i} className="p-3 text-center"><Tick on={v} /></td>
                  ))}
                  <td className="bg-brand-bg/50 p-3 text-center"><Tick on={r.us} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ───── Pricing ───── */}
      <section id="pricing" className="scroll-mt-20 bg-surface px-5 py-20 sm:px-8">
        <p className="text-center text-[11px] font-bold tracking-[1px] text-brand">PRICING</p>
        <h2 className="mt-2 text-center font-serif text-3xl font-bold text-ink sm:text-4xl">Simple, honest pricing</h2>
        <p className="mt-2 text-center text-sm text-ink/60">Start free. Annual plans save 20%.</p>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`relative rounded-2xl p-6 ${p.highlight ? "bg-gradient-to-br from-brand to-brand-dark text-white shadow-xl shadow-brand/30" : "border border-line bg-canvas text-ink"}`}>
              {p.highlight && <span className="absolute -top-2 right-5 rounded-md bg-warning px-2.5 py-1 text-[10px] font-bold text-white">MOST POPULAR</span>}
              <p className="text-lg font-bold">{p.name}</p>
              <p className="mt-2"><span className="font-serif text-4xl font-extrabold">{p.price}</span><span className="text-sm opacity-60"> {p.period}</span></p>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`size-4 ${p.highlight ? "text-brand-light" : "text-success"}`} />
                    <span className="opacity-90">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`mt-6 block rounded-[10px] py-3 text-center text-sm font-bold transition ${p.highlight ? "bg-white/20 text-white hover:bg-white/30" : "bg-brand-bg text-brand hover:bg-brand/15"}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="scroll-mt-20 px-5 py-20 sm:px-8">
        <p className="text-center text-[11px] font-bold tracking-[1px] text-brand">FAQ</p>
        <h2 className="mt-2 text-center font-serif text-3xl font-bold text-ink sm:text-4xl">Questions, answered</h2>
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-surface p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-ink">
                {f.q}
                <ChevronRight className="size-4 text-ink/40 transition group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="px-5 py-20 sm:px-8">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-10 text-center text-white sm:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-brand-light/30 blur-3xl" />
          <h2 className="relative font-serif text-3xl font-extrabold sm:text-4xl">Stop typing paperwork tonight.</h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm text-white/70">Create your first document in under two minutes. Free to start, no card required.</p>
          <Link href="/signup" className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-brand shadow-xl transition hover:opacity-95">
            <Mic className="size-4" /> Get started free
          </Link>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-line bg-surface px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <Logo size="sm" />
            <p className="mt-2 text-xs text-ink/50">Speak it. Get the document.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-ink/50">
            {NAV.map((l) => <a key={l.href} href={l.href} className="hover:text-ink">{l.label}</a>)}
            <Link href="/login" className="hover:text-ink">Sign in</Link>
          </div>
        </div>
        <p className="mt-8 text-center text-[11px] text-ink/40">🇦🇺 Built in Leeton, NSW by Hoffstee · © 2026 VoiceDocs</p>
      </footer>
    </div>
  );
}
