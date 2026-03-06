'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/cartStore'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function CheckoutForm({ onBack }: { onBack: () => void }) {
  const { items, totalPrice, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name || !form.customer_phone || !form.customer_address) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({
            id: i.id, name: i.name, price: i.price, quantity: i.quantity, unit: i.unit
          })),
          total_amount: totalPrice(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order failed')

      setOrderId(data.id)
      setIsSuccess(true)
      clearCart()
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-forest-600" />
        </div>
        <h2 className="font-display text-3xl font-bold text-forest-950 mb-3">Order Placed!</h2>
        <p className="text-gray-600 font-body mb-2">
          Thank you for your order. Our team will contact you shortly to confirm.
        </p>
        <p className="text-gray-400 text-sm font-body mb-8">Order ID: {orderId}</p>
        <a
          href="/products"
          className="inline-flex items-center gap-2 bg-forest-700 text-white px-8 py-4 rounded font-display font-semibold hover:bg-forest-600 transition-colors"
        >
          Continue Shopping
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-forest-600 hover:text-forest-800 font-body text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Cart
      </button>

      <div className="bg-white rounded-lg border border-gray-100 p-8">
        <h2 className="font-display text-2xl font-bold text-forest-950 mb-6">Delivery Details</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-body text-gray-700 mb-1.5">
                Full Name <span className="text-crimson-500">*</span>
              </label>
              <input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-body text-gray-700 mb-1.5">
                Phone Number <span className="text-crimson-500">*</span>
              </label>
              <input
                name="customer_phone"
                value={form.customer_phone}
                onChange={handleChange}
                required
                type="tel"
                className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                placeholder="+977 XXXXXXXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-body text-gray-700 mb-1.5">Email Address</label>
            <input
              name="customer_email"
              value={form.customer_email}
              onChange={handleChange}
              type="email"
              className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
              placeholder="optional@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-body text-gray-700 mb-1.5">
              Delivery Address <span className="text-crimson-500">*</span>
            </label>
            <input
              name="customer_address"
              value={form.customer_address}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
              placeholder="Full delivery address"
            />
          </div>

          <div>
            <label className="block text-sm font-body text-gray-700 mb-1.5">Special Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400 resize-none"
              placeholder="Any special instructions or notes..."
            />
          </div>

          {/* Order summary */}
          <div className="bg-forest-50 border border-forest-100 rounded p-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-forest-700">{items.length} item{items.length !== 1 ? 's' : ''}</span>
              <span className="font-display font-bold text-forest-800 text-lg">
                Rs. {totalPrice().toFixed(0)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded font-display font-semibold text-lg transition-all ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-forest-700 hover:bg-forest-600 text-white hover:shadow-lg'
            }`}
          >
            {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
          </button>
        </form>
      </div>
    </div>
  )
}
