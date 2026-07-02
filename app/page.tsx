"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNegotiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiReply("");
    
    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: customerMessage,
          agentName: "Sarah",
          companyName: "ChurnLock",
          customSolution: "A 20% discount for the next 3 months"
        }),
      });
      const data = await res.json();
      setAiReply(data.reply);
    } catch (error) {
      setAiReply("Maaf, terjadi kesalahan.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-6 border-b border-zinc-800 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-500">ChurnLock</h1>
        <Link href="/login" className="text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded transition">
          Sign In
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Lock In Your Revenue. <br/>
          <span className="text-purple-500">Stop Churn Instantly</span> with AI.
        </h2>
        <p className="text-lg text-zinc-400 mb-8 max-w-2xl">
          ChurnLock acts as your automated customer success manager, negotiating with unhappy customers in real-time before they click cancel.
        </p>
        
        <div className="flex gap-4 mb-16">
          <Link href="/login" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded font-medium">
            Start Free Trial
          </Link>
          <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="border border-zinc-700 hover:bg-zinc-800 px-6 py-3 rounded font-medium">
            Try Live Demo
          </button>
        </div>

        {/* KOTAK DEMO LIVE */}
        <div id="demo" className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-left shadow-2xl mb-24">
          <h3 className="text-xl font-semibold mb-2 text-purple-400">🤖 Try ChurnLock AI Live</h3>
          <p className="text-zinc-400 text-sm mb-4">
            Type a customer complaint as if they are trying to cancel their subscription:
          </p>
          
          <form onSubmit={handleNegotiate} className="flex flex-col gap-3 mb-4">
            <input
              type="text"
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="e.g., Your app is too expensive, I want to cancel my plan."
              className="p-3 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-medium disabled:opacity-50 transition"
            >
              {loading ? "Negotiating..." : "Negotiate with AI"}
            </button>
          </form>

          {aiReply && (
            <div className="p-4 bg-zinc-800/50 rounded border border-zinc-700 text-zinc-200 whitespace-pre-wrap">
              <span className="text-green-400 font-bold text-sm">AI Sarah:</span>
              <br />
              {aiReply}
            </div>
          )}
        </div>

        {/* DUMMY STATS */}
        <div className="w-full max-w-4xl mb-24">
          <h3 className="text-3xl font-bold mb-10 text-center">Trusted by Modern SaaS Companies</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold text-green-500">$2.4M+</h4>
              <p className="text-zinc-400 mt-2">Revenue Saved from Churn</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-purple-500">87%</h4>
              <p className="text-zinc-400 mt-2">Average Success Rate</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-blue-500">&lt; 2s</h4>
              <p className="text-zinc-400 mt-2">AI Response Time</p>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="w-full max-w-5xl mb-24">
          <h3 className="text-3xl font-bold mb-10 text-center">Everything you need to stop churn</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="text-purple-500 text-2xl mb-4">🛡️</div>
              <h4 className="text-xl font-semibold mb-2">Real-Time Intercept</h4>
              <p className="text-zinc-400 text-sm">Catches customers the moment they click "Cancel Subscription" and opens a negotiation chat instantly.</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="text-purple-500 text-2xl mb-4">🤖</div>
              <h4 className="text-xl font-semibold mb-2">AI Negotiation</h4>
              <p className="text-zinc-400 text-sm">Uses advanced AI to offer discounts, solutions, or onboarding help based on your custom retention strategy.</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <div className="text-purple-500 text-2xl mb-4">📊</div>
              <h4 className="text-xl font-semibold mb-2">Smart Analytics</h4>
              <p className="text-zinc-400 text-sm">Analyzes complaint texts automatically to score churn risk and identify the top reasons customers leave.</p>
            </div>
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="w-full max-w-3xl mb-24">
          <h3 className="text-3xl font-bold mb-10 text-center">Simple, transparent pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Starter */}
            <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 flex flex-col">
              <h4 className="text-xl font-semibold mb-2">Starter</h4>
              <p className="text-zinc-400 text-sm mb-6">For early-stage startups</p>
              <p className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-zinc-500">/mo</span></p>
              <ul className="text-zinc-400 text-sm space-y-2 mb-8 flex-grow">
                <li>✅ 100 AI Negotiations/mo</li>
                <li>✅ 1 Team Member</li>
                <li>✅ Basic Churn Analytics</li>
              </ul>
              <Link href="/login" className="text-center border border-zinc-700 hover:bg-zinc-800 px-4 py-2 rounded font-medium transition">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-zinc-900 p-8 rounded-xl border-2 border-purple-600 flex flex-col relative shadow-2xl md:scale-105">
              <span className="absolute top-0 right-0 bg-purple-600 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">MOST POPULAR</span>
              <h4 className="text-xl font-semibold mb-2">Pro</h4>
              <p className="text-zinc-400 text-sm mb-6">For growing SaaS teams</p>
              <p className="text-4xl font-bold mb-6">$49<span className="text-lg font-normal text-zinc-500">/mo</span></p>
              <ul className="text-zinc-400 text-sm space-y-2 mb-8 flex-grow">
                <li>✅ 1,000 AI Negotiations/mo</li>
                <li>✅ 5 Team Members</li>
                <li>✅ AI Risk Scoring & Analytics</li>
                <li>✅ Custom AI Strategies</li>
              </ul>
              <Link href="/login" className="text-center bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded font-medium transition">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm">
        <p>© 2026 ChurnLock. All rights reserved.</p>
      </footer>
    </div>
  );
}