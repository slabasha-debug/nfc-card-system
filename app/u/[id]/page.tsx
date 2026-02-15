'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Star } from 'lucide-react';

export default function ReviewFunnel({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const businessId = resolvedParams.id;

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [businessName, setBusinessName] = useState('Loading...');
  const [googleLink, setGoogleLink] = useState('');

  // 1. Get the strings from the environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // 2. ONLY initialize if the URL is valid. This prevents the "Uncaught Error"
  const isConfigured = supabaseUrl.startsWith('http');
  const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null;

  useEffect(() => {
    if (!supabase) return;

    const fetchBusiness = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', businessId)
          .single();

        if (data) {
          setBusinessName(data.full_name || 'Our Business');
          setGoogleLink(data.website || 'https://google.com');
        }
      } catch (e) {
        console.error("Database connection failed", e);
      }
    };
    fetchBusiness();
  }, [businessId, supabase]);

  const processReview = async (selectedRating: number) => {
    setRating(selectedRating);
    if (!supabase) return;

    if (selectedRating === 5) {
      // Save 5-star review
      await supabase.from('feedback').insert([
        { business_username: businessId, rating: 5, message: '5-star auto-redirect' }
      ]);
      window.location.href = googleLink || 'https://google.com';
    }
  };

  const handleSubmitFeedback = async () => {
    if (!supabase) return;
    const { error } = await supabase.from('feedback').insert([
      { business_username: businessId, rating: rating, message: feedback }
    ]);
    if (!error) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white p-6">
        <h1 className="text-2xl text-center">Thank you! Your feedback helps us improve.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* 3. DIAGNOSTIC BOX: If this shows up, your Vercel Settings are the problem */}
      {!isConfigured && (
        <div className="bg-red-900 border-2 border-red-500 p-6 rounded-xl max-w-sm text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Configuration Missing</h2>
          <p className="text-sm opacity-90 mb-4">
            The app cannot find <strong>NEXT_PUBLIC_SUPABASE_URL</strong>.
          </p>
          <div className="text-left bg-black p-3 rounded text-xs font-mono">
            Value found: "{supabaseUrl || 'EMPTY'}"
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 text-center">Rate {businessName}</h1>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => processReview(star)}
            className="transform hover:scale-110 active:scale-90 transition-all"
          >
            <Star
              size={48}
              fill={star <= rating ? "#FFD700" : "none"}
              color={star <= rating ? "#FFD700" : "#4B5563"}
            />
          </button>
        ))}
      </div>

      {rating > 0 && rating < 5 && (
        <div className="w-full max-w-md">
          <textarea
            className="w-full p-4 rounded bg-gray-900 border border-gray-700 text-white"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what we can improve..."
          />
          <button
            onClick={handleSubmitFeedback}
            className="mt-4 w-full bg-white text-black font-bold py-3 rounded"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
