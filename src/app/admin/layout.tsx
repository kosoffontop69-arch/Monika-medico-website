'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Package, ShoppingBag, MessageSquare,
  Settings, LogOut, Menu, X, ChevronRight, AlertCircle,
  Activity, Store
} from 'lucide-react'
import { clsx } from 'clsx'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const ok = sessionStorage.getItem('admin_authed')
    if (ok === 'true') setAuthed(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === 'admin123') {
      sessionStorage.setItem('admin_authed', 'true')
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect PIN. Default is admin123')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authed')
    setAuthed(false)
    router.push('/admin')
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <polygon points="30,80 50,30 70,80" fill="#c11010" opacity="0.9"/>
                <polygon points="45,80 65,25 85,80" fill="#3d8040" opacity="0.9"/>
                <polygon points="50,80 58,60 66,80" fill="#1a2744" opacity="0.9"/>
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-forest-400 text-sm font-body mt-1">Monika Medico Pvt. Ltd.</p>
          </div>

          <form onSubmit={handleLogin} className="bg-forest-900 border border-forest-800 rounded-xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-body text-forest-300 mb-2">Admin PIN</label>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter PIN"
                className="w-full bg-forest-950 border border-forest-700 rounded-lg px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-forest-400 tracking-widest text-center text-xl"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-crimson-400 text-sm font-body">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-forest-600 hover:bg-forest-500 text-white py-3 rounded-lg font-display font-semibold transition-colors"
            >
              Login
            </button>
            <p className="text-forest-600 text-xs text-center font-body">Default PIN: admin123 — change in Settings</p>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-forest-950 flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-forest-800">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-9 h-9 flex-shrink-0">
              <polygon points="30,80 50,30 70,80" fill="#c11010" opacity="0.9"/>
              <polygon points="45,80 65,25 85,80" fill="#3d8040" opacity="0.9"/>
              <polygon points="50,80 58,60 66,80" fill="#1a2744" opacity="0.9"/>
            </svg>
            <div>
              <div className="font-display text-white font-semibold text-sm">Monika Medico</div>
              <div className="text-forest-500 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-all',
                  active
                    ? 'bg-forest-700 text-white font-semibold'
                    : 'text-forest-400 hover:text-white hover:bg-forest-800'
                )}
              >
                <Icon size={18} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-forest-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-forest-400 hover:text-white hover:bg-forest-800 text-sm font-body transition-all"
          >
            <Store size={16} />
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-forest-400 hover:text-crimson-400 hover:bg-forest-800 text-sm font-body transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <h2 className="font-display font-bold text-forest-950 text-lg capitalize">
              {NAV_ITEMS.find(n => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-forest-500 rounded-full animate-pulse" />
            <span className="text-forest-600 text-xs font-body">Live</span>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
