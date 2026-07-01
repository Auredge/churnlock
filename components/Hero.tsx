export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16">
      <div className="mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-4 py-1.5 text-sm text-neon-purple-light">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-purple opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-purple" />
          </span>
          AI-Powered Churn Prevention
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Lock In Your Revenue.{" "}
          <span className="text-gradient">
            Stop Churn Instantly with AI.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 sm:text-xl">
          ChurnLock acts as your automated customer success manager, negotiating
          with unhappy customers in real-time before they click cancel.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#start-trial"
            className="inline-flex w-full items-center justify-center rounded-xl bg-neon-purple px-8 py-3.5 text-base font-semibold text-white shadow-neon transition-all hover:bg-neon-purple-light hover:shadow-neon-lg sm:w-auto"
          >
            Start Free Trial
          </a>
          <a
            href="#watch-demo"
            className="inline-flex w-full items-center justify-center rounded-xl border border-neon-purple/60 bg-transparent px-8 py-3.5 text-base font-semibold text-neon-purple-light transition-all hover:border-neon-purple hover:bg-neon-purple/10 sm:w-auto"
          >
            Watch Demo
          </a>
        </div>
      </div>
    </section>
  );
}
