const footerLinks = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 sm:flex-row sm:justify-between">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-white transition-colors hover:text-neon-purple-light"
        >
          Churn<span className="text-neon-purple">Lock</span>
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-400 transition-colors hover:text-neon-purple-light"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <p className="mx-auto mt-8 max-w-6xl text-center text-sm text-gray-500">
        &copy; 2026 ChurnLock. All rights reserved.
      </p>
    </footer>
  );
}
