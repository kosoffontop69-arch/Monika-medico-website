'use client'
import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronDown, ChevronUp, Phone, MapPin, Package } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

const STATUSES = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 border-amber-200',
  confirmed:  'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
  cancelled:  'bg-gray-50 text-gray-500 border-gray-200',
}

const PAYMENT_COLORS: Record<string, string> = {
  pending:  'bg-amber-50 text-amber-600',
  paid:     'bg-green-50 text-green-700',
  failed:   'bg-red-50 text-red-600',
  refunded: 'bg-gray-50 text-gray-500',
}

const PAYMENT_METHOD_ICONS: Record<string, string> = {
  cod: '💵', esewa: '🟢', khalti: '🟣', bank_transfer: '🏦'
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/admin/orders?${params}`)
    setOrders(await res.json())
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const updateStatus = async (id: string, field: 'status' | 'payment_status', value: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, [field]: value })
      })
      if (!res.ok) throw new Error()
      setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = orders.filter(o =>
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone?.includes(search) ||
    o.id.includes(search)
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm font-body">{orders.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, ID..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm font-body focus:outline-none focus:border-green-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setStatusFilter('')}
            className={clsx('px-3 py-2 rounded-lg text-xs font-body border transition-colors',
              !statusFilter ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400')}>
            All
          </button>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s === statusFilter ? '' : s)}
              className={clsx('px-3 py-2 rounded-lg text-xs font-body border transition-colors capitalize',
                statusFilter === s ? STATUS_COLORS[s] + ' font-semibold' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-100 p-10 text-center text-gray-400 font-body">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 p-10 text-center text-gray-400 font-body">No orders found</div>
        ) : filtered.map(order => (
          <div key={order.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            {/* Order header */}
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-body font-semibold text-gray-900">{order.customer_name}</span>
                  <span className="text-xs text-gray-400 font-mono">{order.id.slice(0, 8)}...</span>
                  <span className="text-xs">
                    {PAYMENT_METHOD_ICONS[order.payment_method || 'cod']} {(order.payment_method || 'cod').toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-body mt-0.5">
                  {new Date(order.created_at).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-display font-bold text-gray-900">Rs. {Number(order.total_amount).toFixed(0)}</div>
                  <span className={clsx('text-xs px-2 py-0.5 rounded', PAYMENT_COLORS[order.payment_status || 'pending'])}>
                    {order.payment_status || 'pending'}
                  </span>
                </div>
                <span className={clsx('text-xs px-2.5 py-1 rounded border capitalize font-body', STATUS_COLORS[order.status])}>
                  {order.status}
                </span>
                {expandedId === order.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>

            {/* Expanded details */}
            {expandedId === order.id && (
              <div className="border-t border-gray-100 px-5 py-5 bg-gray-50 space-y-5">
                {/* Customer info */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 font-body">Phone</div>
                      <a href={`tel:${order.customer_phone}`} className="text-sm font-body text-blue-600 hover:underline">{order.customer_phone}</a>
                    </div>
                  </div>
                  {order.customer_email && (
                    <div className="flex items-start gap-2">
                      <div>
                        <div className="text-xs text-gray-400 font-body">Email</div>
                        <span className="text-sm font-body text-gray-700">{order.customer_email}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400 font-body">Address</div>
                      <span className="text-sm font-body text-gray-700">{order.customer_address}</span>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                {order.items && (
                  <div>
                    <div className="text-xs font-body font-semibold text-gray-500 uppercase tracking-wider mb-2">Items Ordered</div>
                    <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
                      {(Array.isArray(order.items) ? order.items : []).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <Package size={14} className="text-gray-400" />
                            <span className="font-body text-sm text-gray-800">{item.name}</span>
                            <span className="text-xs text-gray-400">× {item.quantity} {item.unit}</span>
                          </div>
                          <span className="font-display font-bold text-sm text-gray-900">
                            Rs. {(item.price * item.quantity).toFixed(0)}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between px-4 py-2.5 bg-gray-50">
                        <span className="font-display font-bold text-sm text-gray-900">Total</span>
                        <span className="font-display font-bold text-sm text-green-800">Rs. {Number(order.total_amount).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {order.notes && (
                  <div className="bg-amber-50 border border-amber-100 rounded p-3 text-sm font-body text-amber-700">
                    📝 {order.notes}
                  </div>
                )}

                {/* Status controls */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-body font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Status</label>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map(s => (
                        <button key={s} onClick={() => updateStatus(order.id, 'status', s)}
                          disabled={updatingId === order.id}
                          className={clsx('px-3 py-1.5 rounded border text-xs font-body capitalize transition-colors',
                            order.status === s
                              ? STATUS_COLORS[s] + ' font-semibold'
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400')}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment Status</label>
                    <div className="flex flex-wrap gap-2">
                      {PAYMENT_STATUSES.map(s => (
                        <button key={s} onClick={() => updateStatus(order.id, 'payment_status', s)}
                          disabled={updatingId === order.id}
                          className={clsx('px-3 py-1.5 rounded text-xs font-body capitalize transition-colors',
                            order.payment_status === s
                              ? PAYMENT_COLORS[s] + ' font-semibold'
                              : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400')}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
