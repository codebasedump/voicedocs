import { Mic, Calculator, Sparkles, type IconType } from "@/components/icons";

const FEATURES: { icon: IconType; title: string; desc: string }[] = [
  {
    icon: Mic,
    title: "Speak it, get the document",
    desc: "Talk for 30 seconds — AI returns a finished invoice, care note or report.",
  },
  {
    icon: Calculator,
    title: "Australian-first compliance",
    desc: "ABN, GST and NDIS-compliant formats built in. No fiddling.",
  },
  {
    icon: Sparkles,
    title: "8 document types, one app",
    desc: "Invoices, quotes, clinical notes, meeting summaries and more.",
  },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1">
      {/* Left brand panel (desktop only) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[linear-gradient(150deg,#6c3ce1_0%,#5b2fcc_55%,#3f2192_100%)] p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-brand-light/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-0 size-72 rounded-full bg-white/10 blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-white/15 font-serif text-xl font-extrabold ring-1 ring-white/20">
            V
          </span>
          <span className="font-serif text-xl">
            Voice<span className="text-brand-light">Docs</span>
          </span>
        </div>

        {/* Headline + features */}
        <div className="relative">
          <h2 className="max-w-md font-serif text-4xl font-extrabold leading-tight">
            Speak it.
            <br />
            Get the document.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            The AI document platform for Australian tradies, NDIS providers and small
            businesses. Turn your voice into finished paperwork in seconds.
          </p>

          <div className="mt-9 space-y-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/15">
                  <f.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="mt-0.5 max-w-xs text-xs leading-relaxed text-white/65">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/45">
          🇦🇺 Built in Australia by Hoffstee · © 2026 VoiceDocs
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center bg-surface px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
