'use server'


import { headers } from 'next/headers'

import { supabase } from '@/lib/supabase'

export async function logScan(userId: string) {
    try {
        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for') || '127.0.0.1'
        const userAgent = headersList.get('user-agent') || 'Unknown'
        const country = headersList.get('x-vercel-ip-country') || 'Unknown'

        // Detect device type roughly
        const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent)
        const deviceType = isMobile ? 'Mobile' : 'Desktop'

        const { error } = await supabase.from('scans').insert({
            user_id: userId,
            ip_address: ip,
            country: country,
            device_type: deviceType,
            user_agent: userAgent,
        })

        if (error) {
            console.error('Error logging scan:', error)
        }
    } catch (err) {
        console.error('Unexpected error logging scan:', err)
    }
}
