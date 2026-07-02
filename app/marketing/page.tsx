export default function MarketingPage() {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center gap-10 p-10">
        
        {/* KOTAK 1: THUMBNAIL (240x240) */}
        <div className="w-[240px] h-[240px] bg-zinc-950 flex flex-col items-center justify-center rounded-xl border border-zinc-800 shrink-0">
          <span className="text-6xl mb-2">🔒</span>
          <h1 className="text-3xl font-bold text-purple-500">ChurnLock</h1>
        </div>
  
        {/* KOTAK 2: HERO IMAGE (1270x760) */}
        <div className="w-[1270px] h-[760px] bg-zinc-950 flex items-center justify-between p-24 rounded-xl border border-zinc-800 shrink-0">
          <div className="w-1/2 pr-10">
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
              Stop Losing Revenue to Churn.
            </h2>
            <p className="text-4xl text-purple-500 font-medium">
              Let AI save your canceling customers.
            </p>
          </div>
          <div className="w-[450px] bg-zinc-900 p-8 rounded-xl border border-zinc-800 space-y-4 shadow-2xl">
            <div>
              <div className="text-zinc-500 text-sm mb-1">Customer:</div>
              <div className="bg-zinc-800 p-4 rounded-lg text-white text-lg">I want to cancel my plan, it's too expensive.</div>
            </div>
            <div>
              <div className="text-green-500 text-sm mb-1">AI Sarah:</div>
              <div className="bg-zinc-800 p-4 rounded-lg text-white text-lg">I'm sorry to hear that. I can offer a 20% discount for 3 months. Would you stay?</div>
            </div>
          </div>
        </div>
  
        {/* KOTAK 3: FEATURES IMAGE (1270x760) */}
        <div className="w-[1270px] h-[760px] bg-zinc-950 flex items-center justify-center gap-8 p-20 rounded-xl border border-zinc-800 shrink-0">
          
          <div className="bg-zinc-900 p-10 rounded-xl border border-zinc-800 w-1/3 h-full flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-6">🛡️</div>
            <h3 className="text-3xl font-bold text-white mb-4">Real-Time Intercept</h3>
            <p className="text-zinc-400 text-lg">Catches customers the moment they click "Cancel Subscription" and opens a negotiation chat instantly.</p>
          </div>
  
          <div className="bg-zinc-900 p-10 rounded-xl border border-zinc-800 w-1/3 h-full flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-6">🤖</div>
            <h3 className="text-3xl font-bold text-white mb-4">AI Negotiation</h3>
            <p className="text-zinc-400 text-lg">Uses advanced AI to offer discounts, solutions, or onboarding help based on your custom strategy.</p>
          </div>
  
          <div className="bg-zinc-900 p-10 rounded-xl border border-zinc-800 w-1/3 h-full flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-6">📊</div>
            <h3 className="text-3xl font-bold text-white mb-4">Smart Analytics</h3>
            <p className="text-zinc-400 text-lg">Analyzes complaint texts automatically to score churn risk and identify reasons customers leave.</p>
          </div>
  
        </div>
  
      </div>
    );
  }