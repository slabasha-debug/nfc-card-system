'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Link2, Loader2 } from 'lucide-react'

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // For MVP we just use Magic Link
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/dashboard`
            }
        })

        if (error) {
            alert(error.message)
        } else {
            setSent(true)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center space-y-6">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto flex items-center justify-center text-black">
                    <Link2 className="w-6 h-6" />
                </div>

                <h1 className="text-2xl font-bold text-white tracking-tight">Access Dashboard</h1>

                {sent ? (
                    <div className="bg-emerald-900/20 text-emerald-400 p-4 rounded-xl text-sm border border-emerald-900/50">
                        Check your email for the magic link to sign in.
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-neutral-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-neutral-950 py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Sending...' : 'Send Magic Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
