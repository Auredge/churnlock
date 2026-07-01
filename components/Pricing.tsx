const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Untuk startup",
    features: ["1 user", "100 negosiasi/bulan"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Untuk tim",
    features: ["5 users", "2000 negosiasi/bulan"],
    cta: "Start Free Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Untuk organisasi besar",
    features: ["Unlimited users", "Unlimited negosiasi"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-neon-purple-light">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple, transparent{" "}
            <span className="text-gradient">pricing</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Start free and scale as your business grows. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 backdrop-blur-sm transition-all ${
                plan.highlighted
                  ? "border-neon-purple bg-surface/80 shadow-neon-lg lg:scale-105"
                  : "border-white/5 bg-surface/60 hover:border-neon-purple/20"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neon-purple px-4 py-1 text-xs font-semibold text-white shadow-neon">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{plan.description}</p>
              </div>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-gray-400">{plan.period}</span>
                )}
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 shrink-0 text-neon-purple"
                      aria-hidden
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#start-trial"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-neon-purple text-white shadow-neon hover:bg-neon-purple-light hover:shadow-neon-lg"
                    : "border border-white/10 text-gray-300 hover:border-neon-purple/50 hover:text-white"
                }`}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
