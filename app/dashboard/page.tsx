'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const ScanChart = dynamic(() => import('@/components/ScanChart'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-neutral-500">Loading chart...</div>
})
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowUpRight, Smartphone, Monitor } from 'lucide-react'



export default function Dashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        thisWeek: 0,
        mobile: 0,
        desktop: 0
    })
    const [recentScans, setRecentScans] = useState<any[]>([])
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }

            // 1. Fetch total scans
            const { count: total, error: totalError } = await supabase
                .from('scans')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)

            // 2. Fetch recent scans
            const { data: recent, error: recentError } = await supabase
                .from('scans')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5)

            // 3. Simple aggregation for chart (last 7 days)
            const { data: weeklyData } = await supabase
                .from('scans')
                .select('created_at, device_type')
                .eq('user_id', user.id)
                .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

            // Process weekly data
            const mobileCount = weeklyData?.filter(s => s.device_type === 'Mobile').length || 0
            const desktopCount = weeklyData?.filter(s => s.device_type === 'Desktop').length || 0

            // Mock chart data generation from actual timestamps
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            const chartMap = new Array(7).fill(0).map((_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - (6 - i))
                return { name: days[d.getDay()], count: 0, date: d.toISOString().split('T')[0] }
            })

            weeklyData?.forEach(scan => {
                const date = scan.created_at.split('T')[0]
                const day = chartMap.find(d => d.date === date)
                if (day) day.count++
            })

            setStats({
                total: total || 0,
                thisWeek: weeklyData?.length || 0,
                mobile: mobileCount,
                desktop: desktopCount
            })
            setRecentScans(recent || [])
            setChartData(chartMap)
            setLoading(false)
        }

        fetchData()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                        <p className="text-neutral-400 mt-2">Overview of your NFC card performance.</p>
                    </div>
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-sm text-neutral-500 hover:text-white transition-colors">
                        Sign Out
                    </button>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-neutral-900 border-neutral-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-400">Total Scans</CardTitle>
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-neutral-500 mt-1">Lifetime views</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-neutral-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-400">This Week</CardTitle>
                            <div className="text-emerald-500 text-xs font-bold">Live</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.thisWeek}</div>
                            <p className="text-xs text-neutral-500 mt-1">Last 7 days</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-neutral-900 border-neutral-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-400">Device Split</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm mt-1">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-blue-400" />
                                    <span>{stats.mobile} Mobile</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-purple-400" />
                                    <span>{stats.desktop} Desktop</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Main Chart */}
                    <Card className="bg-neutral-900 border-neutral-800 text-white col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Weekly Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ScanChart data={chartData} />
                        </CardContent>
                    </Card>

                    {/* Recent Scans List */}
                    <Card className="bg-neutral-900 border-neutral-800 text-white col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Recent Scans</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentScans.length === 0 ? (
                                    <p className="text-neutral-500 text-sm">No recent scans.</p>
                                ) : (
                                    recentScans.map((scan) => (
                                        <div key={scan.id} className="flex items-center justify-between border-b border-neutral-800 pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                                                    {scan.device_type === 'Mobile' ? (
                                                        <Smartphone className="w-4 h-4 text-neutral-400" />
                                                    ) : (
                                                        <Monitor className="w-4 h-4 text-neutral-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{scan.country || 'Unknown Location'}</p>
                                                    <p className="text-xs text-neutral-500">{new Date(scan.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-neutral-500 font-mono">
                                                {scan.ip_address}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
