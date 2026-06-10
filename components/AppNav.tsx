"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Users, Settings, Mic, type IconType } from "@/components/icons";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/settings", label: "Profile", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/** A tooltip shown to the right on hover (used by the icon rail) */
function Tip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-[115%] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md bg-night px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
      {label}
    </span>
  );
}

function RailLink({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: IconType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`group relative flex size-11 items-center justify-center rounded-xl transition ${
        active ? "bg-brand text-white shadow-lg shadow-brand/30" : "text-ink/55 hover:bg-surface-2 hover:text-ink"
      }`}
    >
      <Icon className="size-5" />
      <Tip label={label} />
    </Link>
  );
}

/** Desktop icon-only rail */
export function Sidebar({ initials = "MD" }: { initials?: string }) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-[76px] shrink-0 flex-col items-center border-r border-line bg-surface py-5 md:flex">
      <Link
        href="/dashboard"
        aria-label="VoiceDocs home"
        className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light font-serif text-xl font-extrabold text-white shadow-lg shadow-brand/30"
      >
        V
      </Link>

      <Link
        href="/templates"
        aria-label="New recording"
        className="group relative mt-7 flex size-12 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/40 transition hover:scale-105"
      >
        <Mic className="size-5" />
        <Tip label="New recording" />
      </Link>

      <nav className="mt-6 flex flex-col items-center gap-2">
        {NAV.map((n) => (
          <RailLink key={n.href} href={n.href} label={n.label} Icon={n.icon} active={isActive(pathname, n.href)} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-3">
        <div className="group relative">
          <ThemeToggle />
          <Tip label="Theme" />
        </div>
        <div className="flex size-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
          {initials}
        </div>
      </div>
    </aside>
  );
}

function Tab({ href, label, Icon, active }: { href: string; label: string; Icon: IconType; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-0.5 ${active ? "text-brand" : "text-ink/45"}`}
    >
      <Icon className="size-5" />
      <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
    </Link>
  );
}

/** Mobile bottom tab bar with a centred record button */
export function BottomNav() {
  const pathname = usePathname();
  const [left, right] = [NAV.slice(0, 2), NAV.slice(2)];
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 flex items-center rounded-2xl border border-line bg-surface/95 px-2 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.10)] backdrop-blur md:hidden">
      {left.map((n) => (
        <Tab key={n.href} href={n.href} label={n.label} Icon={n.icon} active={isActive(pathname, n.href)} />
      ))}
      <div className="flex flex-1 justify-center">
        <Link
          href="/templates"
          aria-label="New document"
          className="-mt-8 flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/40 ring-4 ring-canvas"
        >
          <Mic className="size-6" />
        </Link>
      </div>
      {right.map((n) => (
        <Tab key={n.href} href={n.href} label={n.label} Icon={n.icon} active={isActive(pathname, n.href)} />
      ))}
    </nav>
  );
}
