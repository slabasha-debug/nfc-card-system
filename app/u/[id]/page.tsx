'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Star } from 'lucide-react';

// Initialize Supabase ONCE outside the component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ReviewFunnel({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [businessName, setBusinessName] = useState('Loading...');
  const [googleLink, setGoogleLink] = useState('');

  useEffect(() => {
    const fetchBusiness = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', params.id)
        .single();

      if (data) {
        setBusinessName(data.full_name || 'Our Business');
        setGoogleLink(data.website || 'https://google.com');
      }
    };
    fetchBusiness();
  }, [params.id]);

  // NEW: Integrated handler that saves AND redirects
  const processReview = async (selectedRating: number) => {
    setRating(selectedRating);

    // If 5 stars, save it automatically and then redirect
    if (selectedRating === 5) {
      const { error } = await supabase.from('feedback').insert([
        {
          business_username: params.id,
          rating: 5,
          message: 'Redirected to Google',
        },
      ]);

      if (error) {
        console.error("Database Error:", error.message);
      }
      
      // Delay slightly so the database has a millisecond to breathe
      window.location.href = googleLink || 'https://share.google/nanUjX8N28JnoKvVo';
    }
  };

  const handleSubmitFeedback = async () => {
    const { error } = await supabase.from('feedback').insert([
      {
        business_username: params.id,
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
        <h1 className="text-2xl px-4 text-center">Thank you for your feedback! We will improve.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Rate {businessName}</h1>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => processReview(star)}
            className="transform hover:scale-110 transition-transform"
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
        <div className="w-full max-w-md animate-fade-in">
          <p className="mb-4 text-center text-gray-400">What can we do better?</p>
          <textarea
            className="w-full p-4 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-white"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us about your experience..."
          />
          <button
            onClick={handleSubmitFeedback}
            className="mt-4 w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200"
          >
            Send Private Feedback
          </button>
        </div>
      )}
    </div>
  );
}
