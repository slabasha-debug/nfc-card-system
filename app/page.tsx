
import Link from 'next/link'
import { Zap, Shield, BarChart3, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black">
      {/* Nav */}
      <nav className="border-b border-neutral-900/50 backdrop-blur-md fixed top-0 w-full z-10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter">NFC<span className="text-neutral-500">PRO</span></div>
          <Link href="/login" className="text-sm font-medium hover:text-neutral-400 transition-colors">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-32 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-400 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          New Analytics Engine 2.0
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent pb-2">
          The Last Business Card You'll Ever Need.
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Instantly share your contact info, social links, and portfolio with a single tap. Track every interaction with powerful real-time analytics.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-neutral-200 transition-all flex items-center gap-2">
            Get Started <ChevronRight className="w-4 h-4" />
          </button>
          <button className="px-8 py-4 rounded-full font-bold border border-neutral-800 hover:border-neutral-600 transition-all">
            View Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-neutral-900/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon={<Zap className="w-6 h-6 text-white" />}
              title="Instant Share"
              desc="No apps required. Just tap your card to any smartphone to share your profile instantly."
            />
            <Feature
              icon={<BarChart3 className="w-6 h-6 text-white" />}
              title="Real-Time Analytics"
              desc="Track who views your profile, where they are from, and what devices they use."
            />
            <Feature
              icon={<Shield className="w-6 h-6 text-white" />}
              title="Premium Design"
              desc="A minimal, high-end digital profile that reflects your professional brand."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-900 text-center text-neutral-600 text-sm">
        <p>&copy; 2024 NFC PRO. All rights reserved.</p>
      </footer>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-neutral-400 leading-relaxed">{desc}</p>
    </div>
  )
}
