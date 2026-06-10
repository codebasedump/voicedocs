"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "@/components/icons";

export function AddClient() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Could not add client.");
        setLoading(false);
        return;
      }
      setOpen(false);
      setLoading(false);
      router.refresh();
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-[10px] bg-brand px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-dark"
      >
        <Plus className="size-3.5" /> Add
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-t-3xl border border-line bg-surface p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-ink">Add client</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink/40 hover:text-ink">
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="space-y-3">
              {[
                { name: "name", label: "Name", placeholder: "John Smith", required: true },
                { name: "email", label: "Email", placeholder: "john@example.com", type: "email" },
                { name: "phone", label: "Phone", placeholder: "0412 345 678" },
                { name: "abn", label: "ABN (optional)", placeholder: "12 345 678 901" },
              ].map((f) => (
                <label key={f.name} className="block">
                  <span className="mb-1 block text-xs font-semibold text-ink/70">{f.label}</span>
                  <input
                    name={f.name}
                    type={f.type || "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </label>
              ))}
              {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                {loading && <Loader2 className="size-4 animate-spin" />} Save client
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
