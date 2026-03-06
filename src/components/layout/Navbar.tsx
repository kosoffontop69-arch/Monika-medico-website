'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Menu, X, Phone } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore(s => s.totalItems())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-forest-950 shadow-lg py-3' : 'bg-forest-950/95 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              {/* SVG Logo recreation */}
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
              <Link
                key={l.href}
                href={l.href}
                className="text-forest-200 hover:text-white font-body text-sm tracking-wide hover-underline transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+977"
              className="hidden md:flex items-center gap-2 text-forest-300 hover:text-forest-100 text-sm transition-colors"
            >
              <Phone size={14} />
              <span className="font-body">Sun–Fri: 9am–6pm</span>
            </a>

            <Link
              href="/cart"
              className="relative p-2 text-forest-200 hover:text-white transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-crimson-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse-slow">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-forest-200 hover:text-white p-1"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-forest-800 pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsOpen(false)}
                  className="text-forest-200 hover:text-white font-body py-1"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
