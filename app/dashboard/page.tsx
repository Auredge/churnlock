"use client";

import { createBrowserClient } from '@supabase/ssr';
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function DashboardContent() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({ agentName: "Sarah", companyName: "", customSolution: "A 20% discount" });
  const [negotiations, setNegotiations] = useState<any[]>([]);

  const searchParams = useSearchParams();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: settingsData } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (settingsData) {
          setSettings({
            agentName: settingsData.agent_name || "Sarah",
            companyName: settingsData.company_name || "",
            customSolution: settingsData.discount || "A 20% discount"
          });
        }

        // Ambil 100 negosiasi terakhir untuk dihitung statistiknya
        const { data: negoData } = await supabase
          .from('negotiations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);
        
        setNegotiations(negoData || []);
      }
    }
    fetchData();
  }, [supabase]);

  // LOGIKA HITUNG STATISTIK REAL
  const totalNegosiasi = negotiations.length;
  const savedNegosiasi = negotiations.filter(n => n.status === 'Saved').length;
  const revenueSaved = savedNegosiasi * 49; // Asumsi harga $49/bulan
  const successRate = totalNegosiasi > 0 ? Math.round((savedNegosiasi / totalNegosiasi) * 100) : 0;

  // Fungsi untuk update status di database
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Update di Supabase
    await supabase
      .from('negotiations')
      .update({ status: newStatus })
      .eq('id', id);

    // Update di UI agar langsung berubah tanpa refresh
    setNegotiations(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const fetchNegotiation = async (messageToNegotiate: string, email: string = "manual_test@churnlock.app") => {
    setLoading(true);
    setAiReply("");
    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: messageToNegotiate,
          agentName: settings.agentName,
          companyName: settings.companyName,
          customSolution: settings.customSolution
        }),
      });
      const data = await res.json();
      setAiReply(data.reply);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: newNego } = await supabase
          .from('negotiations')
          .insert({ 
            user_id: user.id, 
            customer_email: email,
            message: messageToNegotiate, 
            ai_reply: data.reply,
            status: 'Pending'
          })
          .select('*')
          .single();

        if (newNego) {
          setNegotiations(prev => [newNego, ...prev]);
        }
      }
    } catch (error) {
      setAiReply("Maaf, terjadi kesalahan saat menghubungi AI.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const email = searchParams.get('email') || "customer@unknown.com";
    const reason = searchParams.get('reason');
    
    if (reason) {
      const autoMessage = `I am ${email} and I want to cancel because ${reason}.`;
      setCustomerMessage(autoMessage);
      fetchNegotiation(autoMessage, email);
    }
  }, [searchParams]);

  const handleNegotiate = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNegotiation(customerMessage);
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

        {/* KARTU STATISTIK (SEKARANG DARI DATABASE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 text-sm mb-2">Revenue Saved</p>
            <h3 className="text-3xl font-bold text-green-500">${revenueSaved}</h3>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 text-sm mb-2">Churns Prevented</p>
            <h3 className="text-3xl font-bold text-purple-500">{savedNegosiasi}</h3>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <p className="text-zinc-400 text-sm mb-2">Success Rate</p>
            <h3 className="text-3xl font-bold text-blue-500">{successRate}%</h3>
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
                <th className="p-4">Reason for Churn</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th> {/* KOLOM BARU */}
              </tr>
            </thead>
            <tbody>
              {negotiations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-zinc-500">No negotiations yet. Try the chat below!</td>
                </tr>
              ) : (
                negotiations.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition">
                    <td className="p-4 text-sm font-medium text-white">{item.customer_email}</td>
                    <td className="p-4 text-sm text-zinc-400 max-w-xs truncate">{item.message}</td>
                    <td className="p-4">
                      {item.status === "Saved" ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">Saved</span>
                      ) : item.status === "Pending" ? (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">Pending</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">Lost</span>
                      )}
                    </td>
                    <td className="p-4 flex gap-2">
                      {item.status !== 'Saved' && (
                        <button onClick={() => handleUpdateStatus(item.id, 'Saved')} className="text-xs bg-green-600/20 text-green-400 hover:bg-green-600/40 px-2 py-1 rounded">Mark Saved</button>
                      )}
                      {item.status !== 'Lost' && (
                        <button onClick={() => handleUpdateStatus(item.id, 'Lost')} className="text-xs bg-red-600/20 text-red-400 hover:bg-red-600/40 px-2 py-1 rounded">Mark Lost</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen bg-zinc-950 items-center justify-center text-zinc-500">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}