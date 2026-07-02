"use client";

import { createBrowserClient } from '@supabase/ssr';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState("Pro $49/mo");
  const [complaint, setComplaint] = useState("");
  
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedRisk, setAnalyzedRisk] = useState<number | null>(null);
  const [analyzedReason, setAnalyzedReason] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function fetchCustomers() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('risk_score', { ascending: false });
      
      setCustomers(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalyzedRisk(null);
    setAnalyzedReason("");

    try {
      const res = await fetch("/api/analyze-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint }),
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setAnalyzedRisk(data.risk_score);
      setAnalyzedReason(data.reason);
    } catch (error) {
      alert("Failed to analyze complaint.");
    }
    setAnalyzing(false);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || analyzedRisk === null) return;

    const { error } = await supabase
      .from('customers')
      .insert({ 
        user_id: user.id, 
        email: newEmail, 
        plan: newPlan, 
        risk_score: analyzedRisk, 
        reason: analyzedReason 
      });

    if (!error) {
      setNewEmail("");
      setComplaint("");
      setAnalyzedRisk(null);
      setAnalyzedReason("");
      setShowForm(false);
      fetchCustomers(); 
    }
  };

  // FUNGSI DELETE BARU DI SINI
  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (!error) {
        fetchCustomers(); // Refresh tabel setelah dihapus
      } else {
        alert("Failed to delete customer.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-500 mb-8">ChurnLock</h1>
          <nav className="flex flex-col gap-4">
            <Link href="/dashboard" className="text-zinc-400 hover:text-white transition">Dashboard</Link>
            <Link href="/dashboard/customers" className="text-purple-400 font-medium">Customers</Link>
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">At-Risk Customers</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-600 hover:bg-purple-700 text-sm px-4 py-2 rounded font-medium transition"
          >
            {showForm ? "Cancel" : "+ Add Customer"}
          </button>
        </div>

        {/* FORM AI ANALYZE */}
        {showForm && (
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-6">
            <form onSubmit={handleSaveCustomer} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Customer Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
                    placeholder="customer@company.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option>Basic $19/mo</option>
                    <option>Pro $49/mo</option>
                    <option>Enterprise $499/mo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Paste Customer's Complaint Here</label>
                <textarea
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500 min-h-[100px]"
                  placeholder="e.g., I am very disappointed. Your app keeps crashing when I try to export files, and I am paying $49/month for this! I want to cancel."
                />
              </div>

              <button 
                type="button" 
                onClick={handleAnalyze} 
                disabled={!complaint || analyzing}
                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded font-medium text-sm disabled:opacity-50 w-fit"
              >
                {analyzing ? "🤖 AI Analyzing..." : "✨ Analyze with AI"}
              </button>

              {analyzedRisk !== null && (
                <div className="bg-zinc-800/50 border border-purple-500/30 p-4 rounded flex flex-col gap-2">
                  <p className="text-sm text-zinc-400">AI Analysis Result:</p>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-zinc-500">Risk Score:</span>
                      <p className={`text-xl font-bold ${analyzedRisk > 80 ? 'text-red-500' : analyzedRisk > 50 ? 'text-yellow-500' : 'text-blue-500'}`}>
                        {analyzedRisk}%
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500">Reason:</span>
                      <p className="text-md font-medium text-white">{analyzedReason}</p>
                    </div>
                  </div>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium text-sm w-fit mt-2">
                    Save to Database
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TABEL CUSTOMER */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="text-xl font-semibold">Churn Predictions</h3>
          </div>
          
          {loading ? (
            <div className="p-10 text-center text-zinc-500">Loading data from database...</div>
          ) : customers.length === 0 ? (
            <div className="p-10 text-center text-zinc-500">
              No customers yet. Click "+ Add Customer" to let AI analyze your first complaint!
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-zinc-800/50 text-zinc-400 text-sm">
                <tr>
                  <th className="p-4">Customer Email</th>
                  <th className="p-4">Current Plan</th>
                  <th className="p-4">Churn Risk</th>
                  <th className="p-4">Reason (Analyzed by AI)</th>
                  <th className="p-4">Actions</th> {/* UBAH JADI ACTIONS */}
                </tr>
              </thead>
              <tbody>
                {customers.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition">
                    <td className="p-4 text-sm font-medium text-white">{item.email}</td>
                    <td className="p-4 text-sm text-zinc-400">{item.plan}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.risk_score > 80 ? 'bg-red-500' : item.risk_score > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                            style={{ width: `${item.risk_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-zinc-300">{item.risk_score}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-zinc-400">{item.reason}</td>
                    <td className="p-4 flex gap-2">
                   <Link 
                     href={`/dashboard?email=${encodeURIComponent(item.email)}&reason=${encodeURIComponent(item.reason)}`} 
                     className="text-xs bg-purple-600/20 text-purple-400 hover:bg-purple-600/40 px-3 py-1 rounded font-medium transition"
                   >
                     Run AI Negotiator
                   </Link>
                      {/* TOMBOL DELETE BARU DI SINI */}
                      <button 
                        onClick={() => handleDeleteCustomer(item.id)}
                        className="text-xs bg-red-600/20 text-red-400 hover:bg-red-600/40 px-3 py-1 rounded font-medium transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}