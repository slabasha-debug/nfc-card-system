'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function OwnerDashboard({ params }: { params: { username: string } }) {
  const [stats, setStats] = useState({ total: 0, average: 0 });
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // 1. Get all feedback for this business
      const { data } = await supabase
        .from('feedback')
        .select('*')
        .eq('business_username', params.username)
        .order('created_at', { ascending: false });

      if (data) {
        setFeedbacks(data);
        const total = data.length;
        const avg = data.reduce((acc, curr) => acc + curr.rating, 0) / total || 0;
        setStats({ total, average: Number(avg.toFixed(1)) });
      }
    };
    fetchData();
  }, [params.username]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <h1 className="text-3xl font-bold mb-8 capitalize">{params.username}'s Dashboard</h1>
      
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm uppercase font-semibold">Total Interactions</p>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm uppercase font-semibold">Avg. Private Rating</p>
          <p className="text-4xl font-bold text-red-500">{stats.average} / 5</p>
          <p className="text-xs text-gray-400 mt-2">*Only reflects 1-4 star feedback</p>
        </div>
      </div>

      {/* FEEDBACK LIST */}
      <h2 className="text-xl font-bold mb-4">Customer Feedback (Caught)</h2>
      <div className="space-y-4">
        {feedbacks.map((f) => (
          <div key={f.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-yellow-600">Rating: {f.rating} ⭐</span>
              <span className="text-gray-400 text-sm">{new Date(f.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 italic">"{f.message}"</p>
          </div>
        ))}
        {feedbacks.length === 0 && <p className="text-gray-400">No feedback caught yet. Good job!</p>}
      </div>
    </div>
  );
}
