"use client";

import { createBrowserClient } from '@supabase/ssr';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State untuk menyimpan data settings
  const [settings, setSettings] = useState({ agentName: "Sarah", companyName: "", discount: "20%" });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Ambil data settings saat halaman dibuka
  useEffect(() => {
    async function fetchSettings() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (data) {
          setSettings({
            agentName: data.agent_name || "Sarah",
            companyName: data.company_name || "",
            discount: data.discount || "20%"
          });
        }
      }
    }
    fetchSettings();
  }, [supabase]);

  const negotiations = [
    { email: "budi@startup.com", plan: "Pro $49/mo", reason: "Too expensive", status: "Saved" },
    { email: "sarah@agency.io", plan: "Basic $19/mo", reason: "Missing features", status: "Lost" },
    { email: "mike@corp.com", plan: "Enterprise", reason: "Switching to competitor", status: "Saved" },
  ];

  const handleNegotiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiReply("");
    
    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Kita kirim data settings bersama pesan pelanggan
        body: JSON.stringify({ 
          message: customerMessage,
          agentName: settings.agentName,
          companyName: settings.companyName,
          discount: settings.discount
        }),
      });
      const data = await res.json();
      setAiReply(data.reply);
    } catch (error) {
      setAiReply("Maaf, terjadi kesalahan saat menghubungi AI.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-500 mb-8">ChurnLock</h1>
          <nav className="flex flex-col gap-4">
            <Link href="/dashboard" className="text-purple-400 font-medium">Dashboard</Link>
            <Link href="/dashboard/customers" className="text-zinc-400 hover:text-white transition">Customers</Link>
            <Link href="/dashboard/settings" className="text-zinc-400 hover:text-white transition">Settings</Link>
          </nav>
        </div>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm text-zinc-500 hover:text-red-500 transition text-left">
            Logout
          </button>
        </form>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

        {/* KARTU STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 text-sm mb-2">Revenue Saved</p>
            <h3 className="text-3xl font-bold text-green-500">$12,450</h3>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 text-sm mb-2">Churns Prevented</p>
            <h3 className="text-3xl font-bold text-purple-500">42</h3>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 text-sm mb-2">Success Rate</p>
            <h3 className="text-3xl font-bold text-blue-500">87%</h3>
          </div>
        </div>

        {/* TABEL NEGOSIASI */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-10">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="text-xl font-semibold">Recent Negotiations</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-zinc-800/50 text-zinc-400 text-sm">
              <tr>
                <th className="p-4">Customer Email</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Reason for Churn</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {negotiations.map((item, index) => (
                <tr key={index} className="border-b border-zinc-800/50 last:border-0">
                  <td className="p-4 text-sm">{item.email}</td>
                  <td className="p-4 text-sm text-zinc-400">{item.plan}</td>
                  <td className="p-4 text-sm text-zinc-400">{item.reason}</td>
                  <td className="p-4">
                    {item.status === "Saved" ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">Saved</span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">Lost</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* KOTAK UJI COBA AI NEGOTIATOR */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">🤖 Test AI Negotiator</h3>
          <p className="text-zinc-400 text-sm mb-4">
            AI is currently acting as: <span className="text-purple-500 font-bold">{settings.agentName}</span> from <span className="text-purple-500 font-bold">{settings.companyName || 'Your Company'}</span>. 
            <Link href="/dashboard/settings" className="text-blue-400 hover:underline ml-2">(Change)</Link>
          </p>
          
          <form onSubmit={handleNegotiate} className="flex gap-4 mb-4">
            <input
              type="text"
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="Contoh: Aplikasinya terlalu mahal, saya mau berhenti..."
              className="flex-1 p-3 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-medium disabled:opacity-50"
            >
              {loading ? "Negotiating..." : "Negotiate"}
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