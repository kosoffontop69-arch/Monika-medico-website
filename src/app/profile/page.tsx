'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { createBrowserSupabaseClient } from '@/lib/supabase-auth'
import { User, Phone, Mail, MapPin, Package, LogOut, Edit2, Save, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 border-amber-200',
  confirmed:  'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-gray-50 text-gray-500 border-gray-200',
}

const PAYMENT_ICONS: Record<string, string> = {
  cod: '💵', esewa: '🟢', khalti: '🟣', bank_transfer: '🏦'
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const supabase = createBrowserSupabaseClient()
  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
    if (user) {
      setProfile({
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || '',
      })
      fetchOrders()
    }
  }, [user, loading])

  const fetchOrders = async () => {
    setOrdersLoading(true)
    const res = await fetch('/api/user/orders')
    if (res.ok) {
      setOrders(await res.json())
    }
    setOrdersLoading(false)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
      }
    })
    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated!')
      setEditing(false)
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    toast.success('Signed out')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
        <div className="text-gray-400 font-body">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url
  const initials = (profile.full_name || user.email || 'U')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      {/* Header */}
      <div className="bg-forest-950 pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-forest-700 flex items-center justify-center flex-shrink-0 border-4 border-forest-600">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-bold text-white text-2xl">{initials}</span>
              )}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">
                {profile.full_name || 'My Account'}
              </h1>
              <p className="text-forest-400 font-body text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-forest-700 text-forest-200 text-xs px-2 py-0.5 rounded font-body">
                  {user.app_metadata?.provider === 'google' ? '🔵 Google Account' : '📧 Email Account'}
                </span>
              </div>
            </div>
            <button onClick={handleSignOut}
              className="ml-auto flex items-center gap-2 text-forest-400 hover:text-white font-body text-sm transition-colors border border-forest-700 hover:border-forest-500 px-4 py-2 rounded-lg">
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h2 className="font-display font-bold text-gray-900">Profile Information</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-forest-600 hover:text-forest-800 text-sm font-body transition-colors">
                <Edit2 size={14} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)}
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm font-body px-3 py-1.5 border border-gray-200 rounded-lg">
                  <X size={13} /> Cancel
                </button>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="flex items-center gap-1 bg-forest-700 hover:bg-forest-600 text-white text-sm font-body px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                  <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">
            {[
              { key: 'full_name', label: 'Full Name', icon: User, placeholder: 'Your full name' },
              { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+977 XXXXXXXXXX' },
            ].map(field => {
              const Icon = field.icon
              return (
                <div key={field.key}>
                  <label className="block text-xs font-body font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    {field.label}
                  </label>
                  {editing ? (
                    <input
                      value={(profile as any)[field.key]}
                      onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-100"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-800 font-body text-sm">
                      <Icon size={15} className="text-gray-400" />
                      {(profile as any)[field.key] || <span className="text-gray-300 italic">Not set</span>}
                    </div>
                  )}
                </div>
              )
            })}

            <div className="sm:col-span-2">
              <label className="block text-xs font-body font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Default Delivery Address
              </label>
              {editing ? (
                <input
                  value={profile.address}
                  onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-100"
                  placeholder="Ward, Street, City"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-800 font-body text-sm">
                  <MapPin size={15} className="text-gray-400" />
                  {profile.address || <span className="text-gray-300 italic">Not set</span>}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-body font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</label>
              <div className="flex items-center gap-2 text-gray-800 font-body text-sm">
                <Mail size={15} className="text-gray-400" />
                {user.email}
                {user.email_confirmed_at && (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded">Verified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h2 className="font-display font-bold text-gray-900">Order History</h2>
            <span className="text-gray-400 text-sm font-body">{orders.length} orders</span>
          </div>

          <div className="divide-y divide-gray-50">
            {ordersLoading ? (
              <div className="p-10 text-center text-gray-400 font-body">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-400 font-body mb-4">No orders yet</p>
                <Link href="/products"
                  className="inline-flex items-center gap-2 bg-forest-700 text-white px-6 py-2.5 rounded-lg font-display font-semibold text-sm hover:bg-forest-600 transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : orders.map(order => (
              <div key={order.id}>
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-forest-50 rounded-lg flex items-center justify-center">
                      <Package size={18} className="text-forest-600" />
                    </div>
                    <div>
                      <div className="font-body font-semibold text-gray-900 text-sm">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-400 font-body">
                        {new Date(order.created_at).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{PAYMENT_ICONS[order.payment_method || 'cod']} {(order.payment_method || 'COD').toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className={clsx('text-xs px-2.5 py-1 rounded border capitalize', ORDER_STATUS_COLORS[order.status])}>
                      {order.status}
                    </span>
                    <span className="font-display font-bold text-gray-900">Rs. {Number(order.total_amount).toFixed(0)}</span>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                    <div className="mt-3 space-y-2">
                      {(Array.isArray(order.items) ? order.items : []).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm font-body text-gray-600">
                          <span>{item.name} × {item.quantity} {item.unit}</span>
                          <span className="font-semibold">Rs. {(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-display font-bold text-gray-900 text-sm">
                        <span>Total</span>
                        <span>Rs. {Number(order.total_amount).toFixed(0)}</span>
                      </div>
                    </div>
                    {order.customer_address && (
                      <p className="text-xs text-gray-400 font-body mt-2">📍 {order.customer_address}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/products"
            className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:border-forest-300 hover:shadow-sm transition-all">
            <div className="text-2xl mb-2">💊</div>
            <div className="font-display font-semibold text-gray-900 text-sm">Browse Products</div>
          </Link>
          <Link href="/contact"
            className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:border-forest-300 hover:shadow-sm transition-all">
            <div className="text-2xl mb-2">💬</div>
            <div className="font-display font-semibold text-gray-900 text-sm">Contact Support</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
