import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar, BottomNav } from "@/components/AppNav";

function initialsFrom(name?: string, email?: string) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (email?.[0] ?? "U").toUpperCase();
}

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) redirect("/login");

  const initials = initialsFrom(session.firstName, session.email);

  return (
    <div className="flex min-h-screen flex-1 bg-canvas">
      <Sidebar initials={initials} />
      <main className="mx-auto w-full max-w-5xl flex-1 pb-28 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
