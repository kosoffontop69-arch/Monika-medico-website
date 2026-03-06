import { createServerClient } from '@/lib/supabase'
import { AdminOrdersTable } from '@/components/admin/AdminOrdersTable'
import { Package, ShoppingBag, MessageSquare, TrendingUp } from 'lucide-react'

async function getStats() {
  const supabase = createServerClient()
  const [orders, products, messages] = await Promise.all([
    supabase.from('orders').select('id, total_amount, status, created_at').order('created_at', { ascending: false }),
    supabase.from('products').select('id').eq('is_active', true),
    supabase.from('contact_messages').select('id, is_read'),
  ])

  const totalRevenue = (orders.data || []).reduce((sum: number, o: any) => sum + Number(o.total_amount), 0)
  const pendingOrders = (orders.data || []).filter((o: any) => o.status === 'pending').length
  const unreadMessages = (messages.data || []).filter((m: any) => !m.is_read).length

  return {
    orders: orders.data || [],
    totalProducts: products.data?.length || 0,
    totalRevenue,
    pendingOrders,
    unreadMessages,
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="bg-forest-950 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-forest-300 font-body">Monika Medico Pvt. Ltd.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            {
              icon: <ShoppingBag size={24} className="text-forest-600" />,
              label: 'Total Orders',
              value: stats.orders.length,
              sub: `${stats.pendingOrders} pending`
            },
            {
              icon: <TrendingUp size={24} className="text-forest-600" />,
              label: 'Total Revenue',
              value: `Rs. ${stats.totalRevenue.toFixed(0)}`,
              sub: 'All time'
            },
            {
              icon: <Package size={24} className="text-forest-600" />,
              label: 'Active Products',
              value: stats.totalProducts,
              sub: 'In catalog'
            },
            {
              icon: <MessageSquare size={24} className="text-forest-600" />,
              label: 'Messages',
              value: stats.unreadMessages,
              sub: 'Unread'
            },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-forest-50 rounded-full flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className="text-gray-500 text-sm font-body">{stat.label}</span>
              </div>
              <div className="font-display font-bold text-2xl text-forest-950">{stat.value}</div>
              <div className="text-gray-400 text-xs font-body mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="font-display text-xl font-bold text-forest-950 mb-6">Recent Orders</h2>
          <AdminOrdersTable orders={stats.orders} />
        </div>
      </div>
    </div>
  )
}
