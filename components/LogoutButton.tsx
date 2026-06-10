"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "@/components/icons";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="flex w-full items-center gap-3 px-4 py-3 text-left"
    >
      <LogOut className="size-4 text-danger" />
      <span className="text-sm font-medium text-danger">Sign out</span>
    </button>
  );
}
