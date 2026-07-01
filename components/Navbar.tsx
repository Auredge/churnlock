export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-white transition-colors hover:text-neon-purple-light"
        >
          Churn<span className="text-neon-purple">Lock</span>
        </a>

        <a
          href="#sign-in"
          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-neon-purple/50 hover:text-white hover:shadow-neon"
        >
          Sign In
        </a>
      </nav>
    </header>
  );
}
