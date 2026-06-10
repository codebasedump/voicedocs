"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, User, Building2, Eye, EyeOff } from "@/components/icons";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch(`/api/auth/${isSignup ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Is the server running?");
      setLoading(false);
    }
  }

  const verb = isSignup ? "Sign up" : "Sign in";

  return (
    <div>
      {/* Social sign-in */}
      <div className="space-y-2.5">
        <SocialButton
          label={`${verb} with Google`}
          icon={<GoogleMark />}
          onClick={() => setNote("Google sign-in is coming soon — use email for now.")}
        />
        <SocialButton
          label={`${verb} with Microsoft`}
          icon={<MicrosoftMark />}
          onClick={() => setNote("Microsoft sign-in is coming soon — use email for now.")}
        />
      </div>

      {note && (
        <p className="mt-3 rounded-lg bg-brand-bg px-3 py-2 text-xs font-medium text-brand">{note}</p>
      )}

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink/40">or continue with email</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5">
        {isSignup && (
          <Field name="firstName" label="Full name" placeholder="John Smith" icon={User} />
        )}
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" icon={Mail} />

        {/* Password with show/hide */}
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink/70">Password</span>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/30" />
            <input
              name="password"
              type={showPw ? "text" : "password"}
              required
              placeholder={isSignup ? "At least 8 characters" : "••••••••"}
              className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>

        {isSignup && (
          <Field name="businessName" label="Business name (optional)" placeholder="Smith Plumbing" icon={Building2} required={false} />
        )}

        {!isSignup && (
          <div className="text-right">
            <button type="button" onClick={() => setNote("Password reset is coming soon.")} className="text-xs font-semibold text-brand">
              Forgot password?
            </button>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs font-medium text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-dark py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:opacity-95 disabled:opacity-60"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {isSignup ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand">Sign in</Link>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <Link href="/signup" className="font-semibold text-brand">Sign up for free</Link>
          </>
        )}
      </p>
    </div>
  );
}

function SocialButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-surface py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-2"
    >
      {icon}
      {label}
    </button>
  );
}

function Field({
  name,
  label,
  placeholder,
  icon: Icon,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  placeholder?: string;
  icon: typeof Mail;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-ink/70">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/30" />
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-3 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </label>
  );
}

function GoogleMark() {
  return (
    <svg className="size-4" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.4 36.3 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
      <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}
