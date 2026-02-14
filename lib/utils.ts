
/**
 * Helper to get country from IP address.
 * In a real Vercel deployment, we get this from headers.
 */
export async function getCountryFromIP(ip: string): Promise<string> {
    try {
        // Using a free IP API for MVP demonstration if header is missing
        const res = await fetch(`http://ip-api.com/json/${ip}`)
        const data = await res.json()
        return data.country || 'Unknown'
    } catch (error) {
        console.error('Error fetching country:', error)
        return 'Unknown'
    }
}
