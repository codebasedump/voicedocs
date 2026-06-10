import { Moon, CreditCard } from "@/components/icons";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/lib/models/User";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { SettingsClient, type Profile } from "@/components/SettingsClient";
import { initialsFrom } from "@/lib/format";

export const dynamic = "force-dynamic";

const PLAN_LABEL: Record<string, string> = {
  free: "Free · 5 docs/mo",
  pro: "Pro · $14.99/mo",
  business: "Business · $29.99/mo",
};

export default async function SettingsPage() {
  const session = (await getSession())!;
  await connectDB();
  const user = (await UserModel.findById(session.userId)
    .select("firstName lastName email phone businessName abn businessAddress paymentTerms bankBsb bankAccount plan")
    .lean()) as (Profile & { plan?: string }) | null;

  const profile: Profile = user ?? {};
  const plan = user?.plan ?? "free";
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Your account";

  return (
    <div className="px-4 pt-6 sm:px-8">
      <h1 className="mb-4 font-serif text-2xl font-bold text-ink">Settings</h1>

      {/* Profile header */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <span className="flex size-[52px] items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white">
          {initialsFrom(fullName, profile.email)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{fullName}</p>
          <p className="truncate text-[11px] text-ink/50">{profile.email}</p>
          <span className="mt-1 inline-block rounded bg-brand-bg px-2 py-0.5 text-[10px] font-bold capitalize text-brand">
            {plan} plan ✨
          </span>
        </div>
      </div>

      {/* Editable settings (saves to DB) */}
      <SettingsClient user={profile} />

      {/* Appearance */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
        <Moon className="size-4 text-ink/60" />
        <p className="flex-1 text-sm font-medium text-ink">Dark mode</p>
        <ThemeToggle variant="switch" />
      </div>

      {/* Billing (read-only for now) */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
        <CreditCard className="size-4 text-ink/60" />
        <div className="flex-1">
          <p className="text-sm font-medium text-ink">Subscription</p>
          <p className="text-[11px] text-ink/50">{PLAN_LABEL[plan] ?? plan}</p>
        </div>
        <span className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink/40">Billing soon</span>
      </div>

      {/* Sign out */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
        <LogoutButton />
      </div>
    </div>
  );
}
