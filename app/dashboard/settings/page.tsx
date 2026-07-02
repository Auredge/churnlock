"use client";

import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [agentName, setAgentName] = useState("Sarah");
  const [companyName, setCompanyName] = useState("");
  const [discount, setDiscount] = useState("20%");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
          setAgentName(data.agent_name || "Sarah");
          setCompanyName(data.company_name || "");
          setDiscount(data.discount || "20%");
        }
      }
    }
    fetchSettings();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessage("User not found.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('user_settings')
      .upsert({ 
        user_id: user.id, 
        agent_name: agentName, 
        company_name: companyName, 
        discount: discount 
      });

    if (error) {
      setMessage("Failed to save: " + error.message);
    } else {
      setMessage("Settings saved successfully! AI will use this persona.");
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
            <Link href="/dashboard" className="text-zinc-400 hover:text-white transition">Dashboard</Link>
            <Link href="/dashboard/customers" className="text-zinc-400 hover:text-white transition">Customers</Link>
            <Link href="/dashboard/settings" className="text-purple-400 font-medium">Settings</Link>
          </nav>
        </div>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm text-zinc-500 hover:text-red-500 transition text-left">
            Logout
          </button>
        </form>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-8">AI Settings</h2>
        
        <div className="max-w-md bg-zinc-900 p-8 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-sm mb-6">Customize how the AI introduces itself when negotiating with your customers.</p>
          
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g., John"
              />
            </div>
            
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g., Tokopedia"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Discount Offered</label>
              <input
                type="text"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g., 15%"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-medium disabled:opacity-50 mt-4"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>

            {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}