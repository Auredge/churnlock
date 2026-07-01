"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:border-neon-purple/50 hover:text-white hover:shadow-neon"
    >
      Logout
    </button>
  );
}
