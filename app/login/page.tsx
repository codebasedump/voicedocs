import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AuthShell } from "@/components/AuthShell";
import { AuthForm } from "@/components/AuthForm";

export default async function LoginPage() {
  if (await getSession()) redirect("/dashboard");
  return (
    <AuthShell>
      <h1 className="text-center font-serif text-3xl font-bold text-ink">Welcome back</h1>
      <p className="mb-7 mt-1.5 text-center text-sm text-ink/50">
        Sign in to your account to continue
      </p>
      <AuthForm mode="login" />
    </AuthShell>
  );
}
