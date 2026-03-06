'use client'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cartStore'
import { ArrowLeft, CheckCircle, Banknote, Smartphone, Building2, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

type PaymentMethod = 'cod' | 'esewa' | 'khalti' | 'bank_transfer'

interface PaymentOption {
  id: PaymentMethod
  label: string
  description: string
  icon: string
  color: string
  available_key: string
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: '💵',
    color: 'border-green-300 bg-green-50',
    available_key: 'cod_available'
  },
  {
    id: 'esewa',
    label: 'eSewa',
    description: 'Pay via eSewa digital wallet',
    icon: '🟢',
    color: 'border-emerald-300 bg-emerald-50',
    available_key: 'esewa_available'
  },
  {
    id: 'khalti',
    label: 'Khalti',
    description: 'Pay via Khalti digital wallet',
    icon: '🟣',
    color: 'border-purple-300 bg-purple-50',
    available_key: 'khalti_available'
  },
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    description: 'Direct bank / mobile banking transfer',
    icon: '🏦',
    color: 'border-blue-300 bg-blue-50',
    available_key: 'bank_transfer_available'
  }
]

export function CheckoutForm({ onBack }: { onBack: () => void }) {
  const { items, totalPrice, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    notes: '',
  })

  useEffect(() => {
    fetch('/api/payment/options')
      .then(r => r.json())
      .then(data => setSiteSettings(data))
      .catch(() => {})
  }, [])

  const availableOptions = PAYMENT_OPTIONS.filter(opt =>
    siteSettings[opt.available_key] !== 'false'
  )

  const deliveryCharge = Number(siteSettings['delivery_charge'] || 0)
  const total = totalPrice() + deliveryCharge

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
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
          items: items.map(i => ({
            id: i.id, name: i.name, price: i.price,
            quantity: i.quantity, unit: i.unit
          })),
          total_amount: total,
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
    const selectedOption = PAYMENT_OPTIONS.find(o => o.id === paymentMethod)!
    return (
      <div className="max-w-lg mx-auto text-center py-10">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="font-display text-3xl font-bold text-forest-950 mb-3">Order Placed!</h2>
        <p className="text-gray-600 font-body mb-2">
          Thank you! We'll contact you shortly to confirm your order.
        </p>
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm font-body">
            <span className="text-gray-500">Order ID</span>
            <span className="font-mono text-gray-700">{orderId.slice(0, 12)}...</span>
          </div>
          <div className="flex justify-between text-sm font-body">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold text-gray-900">{selectedOption.icon} {selectedOption.label}</span>
          </div>
          <div className="flex justify-between text-sm font-body">
            <span className="text-gray-500">Total</span>
            <span className="font-display font-bold text-forest-800">Rs. {total.toFixed(0)}</span>
          </div>
        </div>

        {/* Payment instructions */}
        {paymentMethod === 'esewa' && siteSettings['esewa_id'] && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 text-left">
            <div className="font-display font-bold text-emerald-800 mb-2">📲 eSewa Payment Instructions</div>
            <p className="text-emerald-700 text-sm font-body">
              Send Rs. {total.toFixed(0)} to eSewa ID: <strong>{siteSettings['esewa_id']}</strong>
            </p>
            <p className="text-emerald-600 text-xs font-body mt-1">After payment, share your screenshot on WhatsApp/phone to confirm.</p>
          </div>
        )}
        {paymentMethod === 'khalti' && siteSettings['khalti_public_key'] && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 text-left">
            <div className="font-display font-bold text-purple-800 mb-2">📲 Khalti Payment Instructions</div>
            <p className="text-purple-700 text-sm font-body">
              Send Rs. {total.toFixed(0)} via Khalti to the merchant account.
            </p>
            <p className="text-purple-600 text-xs font-body mt-1">After payment, share your screenshot to confirm your order.</p>
          </div>
        )}
        {paymentMethod === 'bank_transfer' && siteSettings['bank_details'] && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <div className="font-display font-bold text-blue-800 mb-2">🏦 Bank Transfer Details</div>
            <p className="text-blue-700 text-sm font-body whitespace-pre-line">{siteSettings['bank_details']}</p>
            <p className="text-blue-600 text-xs font-body mt-2">Amount: <strong>Rs. {total.toFixed(0)}</strong> — Share payment receipt to confirm order.</p>
          </div>
        )}

        {siteSettings['whatsapp_number'] && (
          <a
            href={`https://wa.me/${siteSettings['whatsapp_number']}?text=Hi, I just placed order ${orderId.slice(0, 8)} for Rs. ${total.toFixed(0)} via ${selectedOption.label}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-display font-semibold mb-4 transition-colors"
          >
            💬 Confirm on WhatsApp
          </a>
        )}

        <div className="mt-2">
          <a href="/products" className="inline-flex items-center gap-2 text-forest-700 hover:text-forest-900 font-display font-semibold">
            Continue Shopping →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack}
        className="flex items-center gap-2 text-forest-600 hover:text-forest-800 font-body text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Cart
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery details */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-display text-xl font-bold text-forest-950 mb-5 flex items-center gap-2">
            <Truck size={20} className="text-forest-600" /> Delivery Details
          </h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input name="customer_name" value={form.customer_name} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400"
                  placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input name="customer_phone" value={form.customer_phone} onChange={handleChange} required type="tel"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400"
                  placeholder="+977 XXXXXXXXXX" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email</label>
              <input name="customer_email" value={form.customer_email} onChange={handleChange} type="email"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400"
                placeholder="optional@email.com" />
            </div>
            <div>
              <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <input name="customer_address" value={form.customer_address} onChange={handleChange} required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400"
                placeholder="Ward, Street, City/Village" />
            </div>
            <div>
              <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} 
                className="w-full border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 resize-none"
                placeholder="Special instructions..." />
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-display text-xl font-bold text-forest-950 mb-5 flex items-center gap-2">
            <Banknote size={20} className="text-forest-600" /> Payment Method
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {availableOptions.map(option => (
              <label
                key={option.id}
                className={clsx(
                  'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
                  paymentMethod === option.id
                    ? option.color + ' border-opacity-100'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                )}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={option.id}
                  checked={paymentMethod === option.id}
                  onChange={() => setPaymentMethod(option.id)}
                  className="mt-0.5 accent-green-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{option.icon}</span>
                    <span className="font-display font-bold text-gray-900 text-sm">{option.label}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-body">{option.description}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Payment info hints */}
          {paymentMethod === 'esewa' && (
            <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-sm font-body text-emerald-700">
              💡 You'll receive eSewa payment details after placing your order.
            </div>
          )}
          {paymentMethod === 'khalti' && (
            <div className="mt-4 bg-purple-50 border border-purple-100 rounded-lg p-3 text-sm font-body text-purple-700">
              💡 You'll receive Khalti payment details after placing your order.
            </div>
          )}
          {paymentMethod === 'bank_transfer' && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm font-body text-blue-700">
              💡 Bank transfer details will be shown after you confirm your order.
            </div>
          )}
          {paymentMethod === 'cod' && (
            <div className="mt-4 bg-green-50 border border-green-100 rounded-lg p-3 text-sm font-body text-green-700">
              💵 Pay cash when your order is delivered.
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-display text-xl font-bold text-forest-950 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm font-body">
                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                <span className="font-semibold text-gray-900">Rs. {(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="flex justify-between text-sm font-body text-gray-500">
              <span>Subtotal</span>
              <span>Rs. {totalPrice().toFixed(0)}</span>
            </div>
            {deliveryCharge > 0 && (
              <div className="flex justify-between text-sm font-body text-gray-500">
                <span>Delivery</span>
                <span>Rs. {deliveryCharge.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between font-display font-bold text-lg text-gray-900 pt-1 border-t border-gray-100">
              <span>Total</span>
              <span className="text-forest-800">Rs. {total.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting}
          className={clsx('w-full py-4 rounded-xl font-display font-bold text-lg transition-all flex items-center justify-center gap-2',
            isSubmitting
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-forest-700 hover:bg-forest-600 text-white hover:shadow-lg')}>
          {isSubmitting ? 'Placing Order...' : `Confirm Order · Rs. ${total.toFixed(0)}`}
        </button>
      </form>
    </div>
  )
}
