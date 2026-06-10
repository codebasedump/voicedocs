"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Brain, Check, Loader2, ArrowLeft, Download, Pencil, Sparkles } from "@/components/icons";
import { getTemplate } from "@/lib/templates";
import { DocumentView, type DocLike } from "@/components/DocumentView";

const STEPS = [
  "Voice transcribed",
  "Understanding your words",
  "Extracting details",
  "Formatting document",
  "Finalising",
];

interface Capture {
  templateId: string;
  transcript: string;
  seconds: number;
}

export function PreviewFlow({ templateId }: { templateId: string }) {
  const tpl = getTemplate(templateId);
  const [phase, setPhase] = useState<"processing" | "done" | "error">("processing");
  const [step, setStep] = useState(0);
  const [doc, setDoc] = useState<DocLike | null>(null);
  const [capture, setCapture] = useState<Capture | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<DocLike | null>(null);

  // Kick off generation once.
  useEffect(() => {
    const raw = sessionStorage.getItem("vd:capture");
    if (!raw) {
      setError("No recording found. Please record again.");
      setPhase("error");
      return;
    }
    const cap: Capture = JSON.parse(raw);
    setCapture(cap);

    fetch("/api/documents/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: cap.templateId,
        transcript: cap.transcript,
        durationSec: cap.seconds,
      }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Generation failed");
        resultRef.current = json.data as DocLike;
      })
      .catch((e) => {
        setError(e.message || "Something went wrong while creating your document.");
        setPhase("error");
      });
  }, []);

  // Animate the steps; reveal once the steps finish AND the result is ready.
  useEffect(() => {
    if (phase !== "processing") return;
    if (step < STEPS.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 450);
      return () => clearTimeout(t);
    }
    // steps done — wait for the result
    const poll = setInterval(() => {
      if (resultRef.current) {
        clearInterval(poll);
        setDoc(resultRef.current);
        setPhase("done");
      }
    }, 150);
    return () => clearInterval(poll);
  }, [step, phase]);

  const dur = capture?.seconds ?? 0;
  const durLabel = `${Math.floor(dur / 60)}:${String(dur % 60).padStart(2, "0")}`;

  if (phase === "error") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-night px-8 text-center text-white">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-danger/20 text-danger">
          <Brain className="size-8" />
        </span>
        <p className="max-w-xs text-sm text-white/70">{error}</p>
        <div className="flex gap-3">
          <Link href="/templates" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white">
            Record again
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/80">
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "processing") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-night px-8 text-white">
        <span className="flex size-[88px] items-center justify-center rounded-3xl bg-gradient-to-br from-brand to-brand-light shadow-lg shadow-brand/40">
          <Brain className="size-10" />
        </span>
        <h2 className="mt-5 font-serif text-2xl font-bold">Creating your {tpl.short.toLowerCase()}…</h2>
        <p className="mt-1.5 text-xs text-white/35">AI is formatting &amp; calculating</p>
        <div className="mt-7 w-full max-w-xs space-y-2.5">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s} className={`flex items-center gap-3 transition-opacity ${done || active ? "opacity-100" : "opacity-25"}`}>
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full ${done ? "bg-success" : active ? "bg-brand" : "bg-white/10"}`}>
                  {done ? <Check className="size-3" /> : active ? <Loader2 className="size-3 animate-spin" /> : null}
                </span>
                <span className={`text-xs ${done ? "text-white/70" : active ? "text-brand-light" : "text-white/20"}`}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // phase === "done"
  return (
    <div className="px-4 pt-6 sm:px-8">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-1 text-sm text-ink/50">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <div className="flex gap-2">
          <Link href="/documents" className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white">
            <Check className="size-3.5" /> Saved
          </Link>
          <button className="flex items-center gap-1.5 rounded-lg bg-success-bg px-3 py-2 text-xs font-bold text-success" title="PDF export coming soon">
            <Download className="size-3.5" /> PDF
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-info-bg px-3 py-2 text-xs font-bold text-info" title="Inline editing coming soon">
            <Pencil className="size-3.5" /> Edit
          </button>
        </div>
      </div>

      {doc && <DocumentView doc={doc} />}

      <div className="mt-3 flex items-start gap-3 rounded-xl border-l-4 border-brand bg-brand-bg px-4 py-3">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand">Created from {durLabel} of voice · saved to your documents</p>
          <p className="mt-0.5 line-clamp-2 text-[11px] text-ink/50">
            {capture?.transcript ? `“${capture.transcript}”` : "Generated from your recording."}
          </p>
        </div>
      </div>
    </div>
  );
}
