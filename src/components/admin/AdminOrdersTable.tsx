'use client'
import { useState } from 'react'
import { clsx } from 'clsx'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-forest-50 text-forest-700 border-forest-200',
  cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
}

export function AdminOrdersTable({ orders }: { orders: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (!orders.length) {
    return <p className="text-gray-400 font-body text-sm text-center py-8">No orders yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {['Order ID', 'Date', 'Customer', 'Total', 'Status'].map(h => (
              <th key={h} className="text-left py-3 px-3 font-display text-forest-800 text-xs uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <>
              <tr
                key={order.id}
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                className="border-b border-gray-50 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-3 font-sans text-xs text-gray-400">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="py-3 px-3 font-body text-gray-600 text-xs">
                  {new Date(order.created_at).toLocaleDateString('en-NP')}
                </td>
                <td className="py-3 px-3 font-body text-forest-900">{order.customer_name || '—'}</td>
                <td className="py-3 px-3 font-display font-bold text-forest-800">
                  Rs. {Number(order.total_amount).toFixed(0)}
                </td>
                <td className="py-3 px-3">
                  <span className={clsx(
                    'text-xs px-2 py-1 rounded border font-sans capitalize',
                    STATUS_STYLES[order.status] || STATUS_STYLES.pending
                  )}>
                    {order.status}
                  </span>
                </td>
              </tr>
              {expandedId === order.id && (
                <tr key={`${order.id}-expanded`} className="bg-stone-50">
                  <td colSpan={5} className="px-4 py-4">
                    <div className="text-xs font-body space-y-1 text-gray-600">
                      <p><strong>Phone:</strong> {order.customer_phone}</p>
                      {order.customer_email && <p><strong>Email:</strong> {order.customer_email}</p>}
                      <p><strong>Address:</strong> {order.customer_address}</p>
                      {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}
