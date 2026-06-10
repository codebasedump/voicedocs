import { Search, Users } from "@/components/icons";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ClientModel } from "@/lib/models/Client";
import { AddClient } from "@/components/AddClient";
import { initialsFrom, money } from "@/lib/format";

export const dynamic = "force-dynamic";

const AVATARS = ["#6C3CE1", "#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#06B6D4"];

export default async function ClientsPage() {
  const session = (await getSession())!;
  await connectDB();
  const clients = await ClientModel.find({ userId: session.userId }).sort({ name: 1 }).limit(500).lean();

  return (
    <div className="px-4 pt-6 sm:px-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">Clients</h1>
          <p className="mt-1 text-sm text-ink/50">
            {clients.length} {clients.length === 1 ? "client" : "clients"}
          </p>
        </div>
        <AddClient />
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink/40">
        <Search className="size-4" /> Search clients
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-bg">
            <Users className="size-5 text-brand" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">No clients yet</p>
          <p className="mt-1 text-xs text-ink/50">Add clients to attach them to invoices and track their history.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {clients.map((c, i) => {
            const accent = AVATARS[i % AVATARS.length];
            const spent = money(c.totalSpent as number | undefined);
            return (
              <div key={String(c._id)} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}
                >
                  {initialsFrom(c.name as string)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink">{c.name as string}</p>
                  <p className="mt-0.5 truncate text-[11px] text-ink/50">
                    {(c.email as string) || (c.phone as string) || "No contact details"}
                    {spent && spent !== "$0.00" ? ` · ${spent}` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
