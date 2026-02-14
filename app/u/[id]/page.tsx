
import { supabase } from '@/lib/supabase'
import { logScan } from '@/app/actions'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Twitter, Linkedin, Globe, Mail, Phone, Share2 } from 'lucide-react'

// Force dynamic rendering to ensure analytics runs on every request
export const dynamic = 'force-dynamic'

interface Props {
    params: Promise<{ id: string }>
}

export default async function UserProfile({ params }: Props) {
    // Await params safely
    const { id: username } = await params

    // 1. Fetch User Data with fallback
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

    if (error || !user) {
        // console.error('User not found or error:', error)
        // Return simple fallback UI instead of notFound() to prevent build failure during static analysis
        return (
            <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">User Not Found</h1>
                    <p className="text-neutral-500 mt-2">The profile you are looking for does not exist.</p>
                </div>
            </main>
        )
    }

    // 2. Log the scan (Analytics) - Fire and forget
    // Safe to call here as user exists
    await logScan(user.id) // Analytics enabled safely

    // Parse social links if stored as JSON string, or use as object if JSONB
    const socialLinks = typeof user.social_links === 'string'
        ? JSON.parse(user.social_links)
        : user.social_links || {}

    return (
        <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">

                {/* Header / Banner area could go here */}
                <div className="h-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-700 via-neutral-900 to-neutral-950"></div>

                <div className="px-6 pb-8 -mt-16 flex flex-col items-center text-center">
                    {/* Profile Image */}
                    <div className="relative w-32 h-32 rounded-full border-4 border-neutral-900 shadow-xl overflow-hidden bg-neutral-800">
                        {user.avatar_url ? (
                            <Image
                                src={user.avatar_url}
                                alt={user.full_name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-neutral-500">
                                {user.full_name?.charAt(0) || '?'}
                            </div>
                        )}
                    </div>

                    {/* Name & Title */}
                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">{user.full_name}</h1>
                    <p className="text-neutral-400 font-medium text-sm mt-1 uppercase tracking-wider">{user.job_title}</p>

                    {/* Bio */}
                    {user.bio && (
                        <p className="mt-4 text-neutral-300 text-sm leading-relaxed max-w-xs mx-auto">
                            {user.bio}
                        </p>
                    )}

                    {/* Action Buttons */}
                    <div className="w-full mt-8 space-y-3">
                        {/* Contact Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 bg-white text-neutral-950 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors">
                                <Mail className="w-4 h-4" /> Email
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-white text-neutral-950 py-3 rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-colors">
                                <Phone className="w-4 h-4" /> Call
                            </button>
                        </div>

                        <button className="w-full flex items-center justify-center gap-2 bg-neutral-800 text-white py-3 rounded-xl font-medium text-sm hover:bg-neutral-700 transition-colors border border-neutral-700">
                            <Share2 className="w-4 h-4" /> Save Contact
                        </button>
                    </div>

                    {/* Social Links */}
                    <div className="mt-8 flex items-center justify-center gap-6">
                        {socialLinks.twitter && (
                            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                                <Twitter className="w-6 h-6" />
                            </a>
                        )}
                        {socialLinks.linkedin && (
                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        )}
                        {socialLinks.website && (
                            <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                                <Globe className="w-6 h-6" />
                            </a>
                        )}
                    </div>

                    <div className="mt-12 text-neutral-600 text-xs">
                        Scan to Connect
                    </div>
                </div>
            </div>
        </main>
    )
}
