"use client";

import { createBrowserClient } from '@supabase/ssr';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk form tambah customer
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState("Pro $49/mo");
  const [newRisk, setNewRisk] = useState(80);
  const [newReason, setNewReason] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fungsi untuk mengambil data customer dari database
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

  // Fungsi untuk menyimpan customer baru ke database
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('customers')
      .insert({ 
        user_id: user.id, 
        email: newEmail, 
        plan: newPlan, 
        risk_score: newRisk, 
        reason: newReason 
      });

    if (!error) {
      setNewEmail("");
      setNewReason("");
      setShowForm(false);
      fetchCustomers(); // Refresh tabel
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

        {/* FORM TAMBAH CUSTOMER (Muncul jika tombol diklik) */}
        {showForm && (
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-6">
            <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Risk Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newRisk}
                  onChange={(e) => setNewRisk(parseInt(e.target.value))}
                  className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-1 block">Reason for Churn</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full p-2 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Too expensive"
                />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-medium text-sm">
                  Save to Database
                </button>
              </div>
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
              No customers yet. Click "+ Add Customer" to add your first at-risk customer!
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-zinc-800/50 text-zinc-400 text-sm">
                <tr>
                  <th className="p-4">Customer Email</th>
                  <th className="p-4">Current Plan</th>
                  <th className="p-4">Churn Risk</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Action</th>
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
                    <td className="p-4">
                      <Link 
                        href="/dashboard" 
                        className="text-xs bg-purple-600/20 text-purple-400 hover:bg-purple-600/40 px-3 py-1 rounded font-medium transition"
                      >
                        Run AI Negotiator
                      </Link>
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