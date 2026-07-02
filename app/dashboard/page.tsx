"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ message: customerMessage }),
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
            <h3 className="text-3xl