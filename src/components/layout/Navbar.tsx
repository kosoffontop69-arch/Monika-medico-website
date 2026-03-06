'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Menu, X, Phone, User, LogOut, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const totalItems = useCartStore(s => s.totalItems())
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    router.push('/')
    toast.success('Signed out successfully')
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/contact', label: 'Contact' },
  ]

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-forest-950 shadow-lg py-3' : 'bg-forest-950/95 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="30,80 50,30 70,80" fill="#c11010" opacity="0.9"/>
                <polygon points="45,80 65,25 85,80" fill="#3d8040" opacity="0.9"/>
                <polygon points="50,80 58,60 66,80" fill="#1a2744" opacity="0.9"/>
              </svg>
            </div>
            <div>
              <div className="font-display text-white font-semibold text-lg leading-tight tracking-wide">
                Monika Medico
              </div>
              <div className="text-forest-300 text-xs tracking-widest uppercase">Pvt. Ltd.</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className="text-forest-200 hover:text-white font-body text-sm tracking-wide hover-underline transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a href="tel:+977"
              className="hidden md:flex items-center gap-2 text-forest-300 hover:text-forest-100 text-sm transition-colors">
              <Phone size={14} />
              <span className="font-body">9am–6pm</span>
            </a>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-forest-200 hover:text-white transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-crimson-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse-slow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth section */}
            {!loading && (
              user ? (
                /* Logged in - avatar dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 bg-forest-800 hover:bg-forest-700 rounded-full pl-1 pr-3 py-1 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-forest-600 flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-xs font-bold">{initials}</span>
                      )}
                    </div>
                    <span className="text-forest-200 text-xs font-body hidden sm:block max-w-[80px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown size={12} className="text-forest-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <div className="font-body font-semibold text-gray-900 text-sm truncate">{displayName}</div>
                        <div className="text-gray-400 text-xs font-body truncate">{user.email}</div>
                      </div>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-body text-gray-700 hover:bg-gray-50 transition-colors">
                        <User size={15} className="text-gray-400" />
                        My Profile & Orders
                      </Link>
                      <button onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-body text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Not logged in - login/register buttons */
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login"
                    className="text-forest-300 hover:text-white text-sm font-body transition-colors px-3 py-1.5">
                    Sign In
                  </Link>
                  <Link href="/register"
                    className="bg-forest-600 hover:bg-forest-500 text-white text-sm font-body px-4 py-1.5 rounded-lg transition-colors">
                    Register
                  </Link>
                </div>
              )
            )}

            <button onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-forest-200 hover:text-white p-1">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-forest-800 pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)}
                  className="text-forest-200 hover:text-white font-body py-1">{l.label}</Link>
              ))}
              {!loading && (user ? (
                <>
                  <Link href="/profile" onClick={() => setIsOpen(false)}
                    className="text-forest-200 hover:text-white font-body py-1 flex items-center gap-2">
                    <User size={15} /> My Profile
                  </Link>
                  <button onClick={handleSignOut}
                    className="text-red-400 hover:text-red-300 font-body py-1 text-left flex items-center gap-2">
                    <LogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}
                    className="flex-1 text-center border border-forest-600 text-forest-300 py-2 rounded-lg font-body text-sm">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}
                    className="flex-1 text-center bg-forest-600 text-white py-2 rounded-lg font-body text-sm">
                    Register
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
