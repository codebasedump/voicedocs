import Link from "next/link";
import { ChevronRight } from "@/components/icons";
import { TEMPLATES } from "@/lib/templates";

export default function TemplatesPage() {
  return (
    <div className="px-4 pt-6 sm:px-8">
      <div className="mb-5">
        <h1 className="font-serif text-2xl text-ink">Choose a template</h1>
        <p className="mt-1 text-sm text-ink/50">What type of document do you want to create?</p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {TEMPLATES.map((t) => (
          <Link
            key={t.id}
            href={`/record?template=${t.id}`}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand/40 hover:shadow-sm"
          >
            <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${t.tint}`}>
              <t.icon className={`size-[22px] ${t.accent}`} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-ink">{t.name}</p>
                {t.popular && (
                  <span className="rounded bg-brand-bg px-1.5 py-0.5 text-[9px] font-bold text-brand">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-ink/50">{t.description}</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-ink/30" />
          </Link>
        ))}
      </div>
    </div>
  );
}
