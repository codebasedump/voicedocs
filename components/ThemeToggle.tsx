"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "@/components/icons";

export function ThemeToggle({
  variant = "icon",
}: {
  variant?: "icon" | "switch";
}) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("vd-theme", next ? "dark" : "light");
    } catch {}
  };

  // Avoid hydration mismatch: render a neutral placeholder until mounted.
  if (!mounted) {
    return variant === "switch" ? (
      <span className="inline-block h-7 w-12 rounded-full bg-surface-2" />
    ) : (
      <span className="inline-block size-9 rounded-xl bg-surface-2" />
    );
  }

  if (variant === "switch") {
    return (
      <button
        onClick={toggle}
        role="switch"
        aria-checked={dark}
        aria-label="Toggle dark mode"
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          dark ? "bg-brand" : "bg-surface-2"
        }`}
      >
        <span
          className={`flex size-5 items-center justify-center rounded-full bg-white text-night shadow transition-transform ${
            dark ? "translate-x-6" : "translate-x-1"
          }`}
        >
          {dark ? <Moon className="size-3" /> : <Sun className="size-3" />}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex size-9 items-center justify-center rounded-xl border border-line text-ink/70 transition hover:bg-surface-2"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
