'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ScanChartProps {
    data: any[]
}

export default function ScanChart({ data }: ScanChartProps) {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-neutral-500">No data available</div>
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#525252"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#525252"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#fff" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}
