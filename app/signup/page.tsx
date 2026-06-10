import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AuthShell } from "@/components/AuthShell";
import { AuthForm } from "@/components/AuthForm";

export default async function SignupPage() {
  if (await getSession()) redirect("/dashboard");
  return (
    <AuthShell>
      <h1 className="text-center font-serif text-3xl font-bold text-ink">Create your account</h1>
      <p className="mb-7 mt-1.5 text-center text-sm text-ink/50">
        Start creating documents in 30 seconds · No card required
      </p>
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
