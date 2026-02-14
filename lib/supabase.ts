
import { createClient } from '@supabase/supabase-js'

const getSupabaseClient = () => {
    try {
        const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
        const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

        // Validate URL format properly
        const isValidUrl = (url: string | undefined): boolean => {
            if (!url) return false
            try {
                const u = new URL(url)
                return u.protocol === 'http:' || u.protocol === 'https:'
            } catch {
                return false
            }
        }

        const supabaseUrl = isValidUrl(envUrl) ? envUrl! : 'https://placeholder.supabase.co'
        const supabaseAnonKey = (envKey && envKey.length > 0) ? envKey : 'placeholder'

        return createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
        console.warn('Supabase client initialization failed, using fallback.', error)
        // Absolute fallback that is guaranteed to work
        return createClient('https://placeholder.supabase.co', 'placeholder')
    }
}

export const supabase = getSupabaseClient()
