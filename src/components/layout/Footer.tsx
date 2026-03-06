import Link from 'next/link'
import { MapPin, Globe, Clock, Facebook } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-forest-950 text-forest-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 100 100" className="w-10 h-10">
                <polygon points="30,80 50,30 70,80" fill="#c11010" opacity="0.9"/>
                <polygon points="45,80 65,25 85,80" fill="#3d8040" opacity="0.9"/>
                <polygon points="50,80 58,60 66,80" fill="#1a2744" opacity="0.9"/>
              </svg>
              <div>
                <div className="font-display text-white font-semibold text-lg">Monika Medico</div>
                <div className="text-forest-400 text-xs tracking-widest uppercase">Pvt. Ltd.</div>
              </div>
            </div>
            <p className="text-forest-400 text-sm leading-relaxed font-body">
              Wholesale medicine distributors and medical supply store serving Siraha district and beyond. 
              Committed to authentic products and reliable service.
            </p>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 mt-4 rounded border border-forest-700 text-forest-400 hover:text-white hover:border-forest-400 transition-all"
            >
              <Facebook size={16} />
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white text-sm font-semibold tracking-widest uppercase mb-5">
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {['Home', 'Products', 'Cart', 'Contact Us'].map(item => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-forest-400 hover:text-forest-100 text-sm font-body transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-white text-sm font-semibold tracking-widest uppercase mb-5">
              Categories
            </h4>
            <div className="flex flex-col gap-3">
              {['Tablets & Capsules', 'Medical Devices', 'Surgical Supplies', 'Injectables', 'Diagnostics'].map(cat => (
                <Link
                  key={cat}
                  href={`/products?category=${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                  className="text-forest-400 hover:text-forest-100 text-sm font-body transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-white text-sm font-semibold tracking-widest uppercase mb-5">
              Contact
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-forest-400 mt-0.5 flex-shrink-0" />
                <span className="text-forest-400 text-sm font-body">Lahan-4, Hulaki Road, Siraha, Nepal</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={15} className="text-forest-400 flex-shrink-0" />
                <a
                  href="https://monikamedicopltd.com.np"
                  className="text-amber-400/80 hover:text-amber-300 text-sm font-body transition-colors"
                >
                  monikamedicopltd.com.np
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={15} className="text-forest-400 flex-shrink-0" />
                <span className="text-forest-400 text-sm font-body">Sun–Fri: 9am–6pm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-forest-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-forest-500 text-xs font-body">
            © 2026 Monika Medico Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-forest-500 text-xs font-body">
            Lahan, Siraha, Nepal
          </p>
        </div>
      </div>
    </footer>
  )
}
