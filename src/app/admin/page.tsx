import { createServerClient } from '@/lib/supabase'
import { Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData() {
  const supabase = createServerClient()
  const [orders, products, messages, settings] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('products').select('id, name, stock_quantity, is_active, price').order('stock_quantity'),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('site_settings').select('*'),
  ])

  const allOrders = orders.data || []
  const today = new Date(); today.setHours(0,0,0,0)
  const todayOrders = allOrders.filter(o => new Date(o.created_at) >= today)
  const totalRevenue = allOrders.filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total_amount), 0)
  const todayRevenue = todayOrders.reduce((s, o) => s + Number(o.total_amount), 0)

  const statusCounts = allOrders.reduce((acc: any, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1; return acc
  }, {})

  const lowStock = (products.data || []).filter(p => p.stock_quantity <= 10 && p.is_active)

  const settingsMap = (settings.data || []).reduce((acc: any, s) => {
    acc[s.key] = s.value; return acc
  }, {})

  return {
    allOrders: allOrders.slice(0, 8),
    totalOrders: allOrders.length,
    todayOrders: todayOrders.length,
    todayRevenue,
    totalRevenue,
    statusCounts,
    totalProducts: products.data?.length || 0,
    lowStock: lowStock.slice(0, 5),
    messages: messages.data || [],
    unreadMessages: (messages.data || []).filter(m => !m.is_read).length,
    siteOpen: settingsMap['site_open'] !== 'false',
    maintenanceMode: settingsMap['maintenance_mode'] === 'true',
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  const statusConfig: Record<string, { color: string; label: string }> = {
    pending:    { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Pending' },
    confirmed:  { color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Confirmed' },
    processing: { color: 'text-purple-600 bg-purple-50 border-purple-200', label: 'Processing' },
    delivered:  { color: 'text-green-600 bg-green-50 border-green-200', label: 'Delivered' },
    cancelled:  { color: 'text-gray-500 bg-gray-50 border-gray-200', label: 'Cancelled' },
  }

  return (
    <div className="space-y-6">
      {/* Site status banner */}
      {(data.maintenanceMode || !data.siteOpen) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
          <span className="text-amber-700 font-body text-sm">
            {data.maintenanceMode
              ? '⚠️ Maintenance mode is ON — visitors see maintenance page'
              : '⚠️ Store is CLOSED — orders are disabled'}
          </span>
          <Link href="/admin/settings" className="ml-auto text-amber-700 hover:text-amber-900 text-sm font-semibold underline">
            Fix in Settings
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: data.todayOrders, sub: `Rs. ${data.todayRevenue.toFixed(0)} today`, icon: '📦', accent: 'border-l-green-500' },
          { label: 'Total Revenue', value: `Rs. ${data.totalRevenue.toLocaleString()}`, sub: `${data.totalOrders} total orders`, icon: '💰', accent: 'border-l-amber-500' },
          { label: 'Active Products', value: data.totalProducts, sub: `${data.lowStock.length} low stock`, icon: '💊', accent: 'border-l-blue-500' },
          { label: 'Unread Messages', value: data.unreadMessages, sub: 'Contact inquiries', icon: '✉️', accent: 'border-l-red-500' },
        ].map(card => (
          <div key={card.label} className={`bg-white rounded-lg border border-gray-100 border-l-4 ${card.accent} p-5`}>
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="font-display font-bold text-2xl text-gray-900 mb-0.5">{card.value}</div>
            <div className="text-gray-500 text-xs font-body">{card.label}</div>
            <div className="text-gray-400 text-xs font-body mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(statusConfig).map(([status, cfg]) => (
          <Link key={status} href={`/admin/orders?status=${status}`}
            className={`flex flex-col items-center gap-1 p-4 rounded-lg border ${cfg.color} hover:opacity-80 transition-opacity text-center`}>
            <div className="font-display font-bold text-xl">{data.statusCounts[status] || 0}</div>
            <div className="text-xs font-body">{cfg.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-gray-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-green-700 hover:text-green-900 text-xs font-body flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {data.allOrders.length === 0 ? (
              <p className="text-gray-400 text-sm font-body text-center py-6">No orders yet</p>
            ) : data.allOrders.map((order: any) => {
              const cfg = statusConfig[order.status] || statusConfig.pending
              return (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="font-body text-sm text-gray-900 font-medium">{order.customer_name}</div>
                    <div className="text-xs text-gray-400 font-body">
                      {new Date(order.created_at).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      {' · '}{(order.payment_method || 'cod').toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-sm text-gray-800">Rs. {Number(order.total_amount).toFixed(0)}</div>
                    <span className={`text-xs px-2 py-0.5 rounded border ${cfg.color}`}>{order.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          {/* Low stock */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-900">Low Stock ⚠️</h3>
              <Link href="/admin/products" className="text-green-700 text-xs font-body flex items-center gap-1">
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            {data.lowStock.length === 0 ? (
              <p className="text-gray-400 text-sm font-body">All well-stocked ✅</p>
            ) : data.lowStock.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm font-body text-gray-800 truncate flex-1">{p.name}</span>
                <span className={`text-xs font-bold ml-3 ${p.stock_quantity === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                  {p.stock_quantity === 0 ? 'OUT' : `${p.stock_quantity}`}
                </span>
              </div>
            ))}
          </div>

          {/* Recent messages */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-gray-900">Messages</h3>
              <Link href="/admin/messages" className="text-green-700 text-xs font-body flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {data.messages.length === 0 ? (
              <p className="text-gray-400 text-sm font-body">No messages yet</p>
            ) : data.messages.slice(0, 4).map((m: any) => (
              <div key={m.id} className="py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  {!m.is_read && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
                  <span className="font-body text-sm text-gray-900 font-medium">{m.name}</span>
                </div>
                <p className="text-xs text-gray-400 font-body truncate mt-0.5">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
