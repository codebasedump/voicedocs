"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "@/components/icons";

export interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  abn?: string;
  businessAddress?: string;
  paymentTerms?: string;
  bankBsb?: string;
  bankAccount?: string;
}

const EDITABLE: (keyof Profile)[] = [
  "firstName", "lastName", "phone",
  "businessName", "abn", "businessAddress",
  "paymentTerms", "bankBsb", "bankAccount",
];

export function SettingsClient({ user }: { user: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(() => {
    const init: Profile = {};
    for (const k of EDITABLE) init[k] = user[k] ?? "";
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSaved(false);
  };

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Could not save changes.");
        setSaving(false);
        return;
      }
      setSaving(false);
      setSaved(true);
      router.refresh();
    } catch {
      setError("Network error.");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card title="PERSONAL INFO">
        <Grid>
          <Field label="First name" value={form.firstName} onChange={set("firstName")} />
          <Field label="Last name" value={form.lastName} onChange={set("lastName")} />
          <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="0412 345 678" />
          <Field label="Email" value={user.email} disabled hint="Contact support to change" />
        </Grid>
      </Card>

      <Card title="BUSINESS DETAILS" subtitle="Appears on your invoices & quotes">
        <Grid>
          <Field label="Business name" value={form.businessName} onChange={set("businessName")} placeholder="Hoffstee" />
          <Field label="ABN" value={form.abn} onChange={set("abn")} placeholder="12 345 678 901" />
        </Grid>
        <Field label="Business address" value={form.businessAddress} onChange={set("businessAddress")} placeholder="Leeton NSW 2705" />
      </Card>

      <Card title="INVOICE PAYMENT DETAILS" subtitle="Shown on invoices so clients can pay you">
        <Grid>
          <Field label="Payment terms" value={form.paymentTerms} onChange={set("paymentTerms")} placeholder="14 days" />
          <Field label="Bank BSB" value={form.bankBsb} onChange={set("bankBsb")} placeholder="062-000" />
        </Grid>
        <Field label="Bank account number" value={form.bankAccount} onChange={set("bankAccount")} placeholder="1234 5678" />
      </Card>

      {/* Save bar */}
      <div className="sticky bottom-24 z-10 flex items-center justify-end gap-3 md:bottom-4">
        {error && <span className="text-xs font-medium text-danger">{error}</span>}
        {saved && !error && (
          <span className="flex items-center gap-1 text-xs font-semibold text-success">
            <Check className="size-4" /> Saved
          </span>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:opacity-60"
        >
          {saving && <Loader2 className="size-4 animate-spin" />} Save changes
        </button>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-[10px] font-bold tracking-wide text-ink/40">{title}</p>
      {subtitle && <p className="mb-3 mt-0.5 text-xs text-ink/50">{subtitle}</p>}
      <div className={subtitle ? "space-y-3" : "mt-3 space-y-3"}>{children}</div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  hint,
}: {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink/70">{label}</span>
      <input
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
      />
      {hint && <span className="mt-1 block text-[10px] text-ink/40">{hint}</span>}
    </label>
  );
}
