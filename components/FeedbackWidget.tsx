"use client";

import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('feedback').insert({ 
        user_id: user.id, 
        content: feedback 
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFeedback("");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tombol Melayang */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl shadow-purple-600/50 flex items-center gap-2 font-medium transition-transform hover:scale-105"
        >
          <span className="text-xl">💬</span>
        </button>
      )}

      {/* Kotak Popup Feedback */}
      {isOpen && (
        <div className="w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-lg font-semibold text-white">Thank you!</h3>
              <p className="text-zinc-400 text-sm mt-1">Your feedback means a lot to us.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Product Feedback</h3>
                <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
              </div>
              <p className="text-zinc-400 text-sm mb-3">What can we do to make ChurnLock better?</p>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 bg-zinc-800 rounded border border-zinc-700 text-white focus:outline-none focus:border-purple-500 min-h-[100px] text-sm"
                  placeholder="Type your ideas, bug reports, or thoughts here..."
                  required
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium text-sm disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Feedback"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}