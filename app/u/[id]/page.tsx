'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Star } from 'lucide-react';

export default function ReviewFunnel({ params }: { params: Promise<{ id: string }> }) {
  // 1. Unwrap params (Required for Next.js 15)
  const resolvedParams = use(params);
  const businessId = resolvedParams.id;

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [businessName, setBusinessName] = useState('Loading...');
  const [googleLink, setGoogleLink] = useState('');

  // 2. Safely initialize Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // We only create the client if the variables actually exist
  const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey) 
    : null;

  useEffect(() => {
    if (!supabase) {
      console.error("Environment variables are missing! Check Vercel settings.");
      return;
    }

    const fetchBusiness = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', businessId)
        .single();

      if (data) {
        setBusinessName(data.full_name || 'Our Business');
        setGoogleLink(data.website || 'https://google.com');
      }
    };
    fetchBusiness();
  }, [businessId, supabase]);

  const processReview = async (selectedRating: number) => {
    setRating(selectedRating);

    if (!supabase) {
      alert("System configuration error. Please try again later.");
      return;
    }

    if (selectedRating === 5) {
      // Save 5-star review to DB first
      await supabase.from('feedback').insert([
        {
          business_username: businessId,
          rating: 5,
          message: '5-star auto-redirect',
        },
      ]);
      
      // Then redirect
      window.location.href = googleLink || 'https://google.com';
    }
  };

  const handleSubmitFeedback = async () => {
    if (!supabase) return;

    const { error } = await supabase.from('feedback').insert([
      {
        business_username: businessId,
        rating: rating,
        message: feedback,
      },
    ]);

    if (!error) {
      setSubmitted(true);
    } else {
      console.error(error);
      alert("Error saving: " + error.message);
    }
  };

  if (submitted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-2xl px-4 text-center">Thank you! Your feedback helps us improve.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* If Supabase is missing, show a warning to you (the developer) */}
      {!supabase && (
        <div className="bg-red-600 text-white p-2 mb-4 rounded text-xs">
          Developer Error: NEXT_PUBLIC_SUPABASE_URL is missing.
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 text-center">Rate {businessName}</h1>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => processReview(star)}
            className="transform hover:scale-110 transition-transform active:scale-95"
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
            className="w-full p-4 rounded bg-gray-800 text-white border border-gray-700"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="How can we improve?"
          />
          <button
            onClick={handleSubmitFeedback}
            className="mt-4 w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
