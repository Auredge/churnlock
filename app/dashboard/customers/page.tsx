"use client";

import Link from "next/link";

export default function CustomersPage() {
  // Data dummy pelanggan yang berpotensi churn
  const atRiskCustomers = [
    { email: "alex@techcorp.com", plan: "Enterprise ($499/mo)", risk: "92%", reason: "No login in 30 days", status: "Critical" },
    { email: "cole@startup.com", plan: "Pro ($49/mo)", risk: "85%", reason: "Too many support tickets", status: "High Risk" },
    { email: "sarah@agency.io", plan: "Basic ($19/mo)", risk: "60%", reason: "Downgraded plan recently", status: "Medium Risk" },
    { email: "mike@corp.com", plan: "Pro ($49/mo)", risk: "45%", reason: "Low feature adoption", status: "Monitoring" },
  ];

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
          <button className="bg-zinc-800 hover:bg-zinc-700 text-sm px-4 py-2 rounded text-zinc-400 cursor-not-allowed">
            Connect Stripe (Soon)
          </button>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Churn Predictions</h3>
            <span className="text-xs text-zinc-500">Updated 5 mins ago</span>
          </div>
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
              {atRiskCustomers.map((item, index) => (
                <tr key={index} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition">
                  <td className="p-4 text-sm font-medium text-white">{item.email}</td>
                  <td className="p-4 text-sm text-zinc-400">{item.plan}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${parseInt(item.risk) > 80 ? 'bg-red-500' : parseInt(item.risk) > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                          style={{ width: `${item.risk}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-zinc-300">{item.risk}</span>
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
        </div>

        <div className="mt-6 bg-zinc-900/50 border border-dashed border-zinc-700 p-6 rounded-xl text-center">
          <p className="text-zinc-400 text-sm">
            🚀 <span className="font-bold text-white">Pro Tip:</span> In the full version, ChurnLock automatically intercepts these customers when they visit the cancellation page. You won't have to lift a finger!
          </p>
        </div>

      </main>
    </div>
  );
}