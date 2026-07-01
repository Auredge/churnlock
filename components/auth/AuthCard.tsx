import Link from "next/link";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-neon-purple/10 blur-[120px]"
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-block text-xl font-bold tracking-tight text-white transition-colors hover:text-neon-purple-light"
        >
          Churn<span className="text-neon-purple">Lock</span>
        </Link>

        <div className="rounded-2xl border border-white/5 bg-surface/80 p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
