import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-neon-purple/10 blur-[120px]"
      />

      <header className="relative border-b border-white/5 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white transition-colors hover:text-neon-purple-light"
          >
            Churn<span className="text-neon-purple">Lock</span>
          </Link>
          <LogoutButton />
        </nav>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-4 py-1.5 text-sm text-neon-purple-light">
          Dashboard
        </div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Welcome to{" "}
          <span className="text-gradient">ChurnLock Dashboard</span>
        </h1>
        <p className="mt-4 max-w-md text-gray-400">
          Signed in as{" "}
          <span className="text-neon-purple-light">{user.email}</span>
        </p>
      </main>
    </div>
  );
}
