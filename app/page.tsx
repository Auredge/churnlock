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
        body: JSON.stringify({ message: customerMessage }),
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
      <nav className="flex justify-between items-center p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-purple-500">ChurnLock</h1>
        <Link href="/login" className="text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded transition">
          Sign In
        </Link>
      </nav>

      {/* HERO + DEMO SECTION */}
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
        <div id="demo" className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 p-8 text-left shadow-2xl">
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
              <span className="text-green-400 font-bold text-sm">AI ChurnLock:</span>
              <br />
              {aiReply}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}