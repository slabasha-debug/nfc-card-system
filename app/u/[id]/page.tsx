'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Star } from 'lucide-react'; // Make sure to install: npm install lucide-react

export default function ReviewFunnel({ params }: { params: { id: string } }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [businessName, setBusinessName] = useState('Loading...');
  const [googleLink, setGoogleLink] = useState('');

  useEffect(() => {
    // 1. Fetch the business details when page loads
    const fetchBusiness = async () => {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        // We assume your 'profiles' table has columns: 'full_name' and 'website' (for the google link)
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', params.id) // matching the URL id to the username
            .single();

        if (data) {
            setBusinessName(data.full_name || 'Our Business');
            setGoogleLink(data.website || 'https://google.com'); // Fallback
        }
    };
    fetchBusiness();
  }, [params.id]);

  const handleRate = (star: number) => {
    setRating(star);
    if (star === 5) {
        // THE MAGIC: 5 Stars = Go to Google
        window.location.href = googleLink;
    }
  };

  const handleSubmit = async () => {
     // Here you would save the bad feedback to Supabase
     setSubmitted(true);
  };

  if (submitted) {
      return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
          <h1 className="text-2xl">Thank you for your feedback! We will improve.</h1>
      </div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Rate {businessName}</h1>
      
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star}
            onClick={() => handleRate(star)}
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
                  className="w-full p-4 rounded bg-gray-800 text-white border border-gray-700"
                  rows={4}
                  onChange={(e) => setFeedback(e.target.value)}
              />
              <button 
                  onClick={handleSubmit}
                  className="mt-4 w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200"
              >
                  Send Private Feedback
              </button>
          </div>
      )}
    </div>
  );
}
