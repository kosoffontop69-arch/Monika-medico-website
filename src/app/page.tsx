import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/shop/ProductCard'
import { ArrowRight, Shield, Truck, Award, Phone, MapPin, Clock } from 'lucide-react'

async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .limit(8)
    .order('created_at', { ascending: false })
  return data || []
}

async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  return data || []
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories()
  ])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center hero-pattern overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-forest-600/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-crimson-900/20 blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-forest-800/50 border border-forest-700 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-forest-400 rounded-full animate-pulse" />
                <span className="text-forest-300 text-xs tracking-widest uppercase font-sans">Siraha District's Trusted Distributor</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Quality Medicines,
                <br />
                <span className="text-forest-400">Delivered with</span>
                <br />
                <em className="italic text-amber-300/90">Care & Trust</em>
              </h1>

              <p className="text-forest-300 text-lg leading-relaxed mb-10 max-w-xl font-body">
                Wholesale medicine distributors serving Siraha and beyond since years. 
                Authentic pharmaceutical products, medical devices, and surgical supplies — 
                all under one roof.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-forest-600 hover:bg-forest-500 text-white px-8 py-4 rounded font-display font-semibold tracking-wide transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
                >
                  Browse Products
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-forest-600 text-forest-300 hover:text-white hover:border-white px-8 py-4 rounded font-display font-semibold tracking-wide transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 animate-fade-in">
              {[
                { num: '1000+', label: 'Products', icon: '💊' },
                { num: '500+', label: 'Happy Clients', icon: '🏥' },
                { num: '10+', label: 'Years Experience', icon: '🎯' },
                { num: '24h', label: 'Fast Delivery', icon: '🚚' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-forest-900/50 border border-forest-800 rounded-lg p-6 text-center"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="font-display text-3xl font-bold text-white mb-1">{stat.num}</div>
                  <div className="text-forest-400 text-sm font-body">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-forest-950 mb-3">
              Our Categories
            </h2>
            <div className="w-16 h-0.5 bg-forest-500 mx-auto mb-4" />
            <p className="text-gray-600 font-body max-w-xl mx-auto">
              Browse our comprehensive range of pharmaceutical and medical products
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-lg border border-gray-100 hover:border-forest-300 hover:bg-forest-50 transition-all duration-300"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="font-display text-sm text-center text-forest-900 font-semibold leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 className="font-display text-4xl font-bold text-forest-950 mb-3">
                Featured Products
              </h2>
              <div className="w-16 h-0.5 bg-crimson-600" />
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-forest-600 hover:text-forest-800 font-display font-semibold text-sm transition-colors"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-forest-700 text-white px-6 py-3 rounded font-display font-semibold"
            >
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <Shield className="text-forest-600" size={32} />,
                title: 'Authentic Products',
                desc: 'All our products are sourced directly from authorized manufacturers and reputable distributors. 100% authentic guarantee.'
              },
              {
                icon: <Truck className="text-forest-600" size={32} />,
                title: 'Reliable Supply',
                desc: 'Consistent supply chain to ensure your medical needs are met without delays. Serving Siraha district and surrounding areas.'
              },
              {
                icon: <Award className="text-forest-600" size={32} />,
                title: 'Licensed Distributor',
                desc: 'Fully licensed and compliant pharmaceutical distributor operating under Nepal Drug Standards Authority guidelines.'
              }
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center text-center p-8">
                <div className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-forest-950 mb-3">{item.title}</h3>
                <p className="text-gray-600 font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact strip */}
      <section className="bg-forest-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <MapPin className="text-forest-400 flex-shrink-0" size={24} />
              <div>
                <div className="font-display text-white font-semibold mb-1">Visit Us</div>
                <div className="text-forest-400 font-body text-sm">Lahan-4, Hulaki Road<br />Siraha, Nepal</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <Phone className="text-forest-400 flex-shrink-0" size={24} />
              <div>
                <div className="font-display text-white font-semibold mb-1">Call / WhatsApp</div>
                <div className="text-forest-400 font-body text-sm">Contact us for wholesale<br />pricing & bulk orders</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <Clock className="text-forest-400 flex-shrink-0" size={24} />
              <div>
                <div className="font-display text-white font-semibold mb-1">Business Hours</div>
                <div className="text-forest-400 font-body text-sm">Sunday – Friday<br />9:00 AM – 6:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
