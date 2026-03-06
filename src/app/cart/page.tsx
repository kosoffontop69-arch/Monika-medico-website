'use client'
import { useCartStore } from '@/lib/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { CheckoutForm } from '@/components/shop/CheckoutForm'
import { useState } from 'react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCartStore()
  const [showCheckout, setShowCheckout] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="font-display text-3xl font-bold text-forest-950 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 font-body mb-8">Start browsing our products to add items</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-forest-700 text-white px-8 py-4 rounded font-display font-semibold hover:bg-forest-600 transition-colors"
          >
            Browse Products
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="bg-forest-950 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white mb-1">Your Cart</h1>
          <p className="text-forest-300 font-body">{totalItems()} item{totalItems() !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {showCheckout ? (
          <CheckoutForm onBack={() => setShowCheckout(false)} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-100 p-5 flex gap-4">
                  <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">💊</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-forest-950 mb-1 leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-xs font-body mb-3">per {item.unit}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-4 py-1.5 font-display font-bold text-forest-900 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-display font-bold text-forest-800">
                          Rs. {(item.price * item.quantity).toFixed(0)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-crimson-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-100 p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold text-forest-950 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm font-body">
                      <span className="text-gray-600 truncate flex-1">{item.name} × {item.quantity}</span>
                      <span className="text-forest-900 font-semibold ml-3">Rs. {(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display font-bold text-forest-950 text-lg">Total</span>
                    <span className="font-display font-bold text-forest-800 text-2xl">
                      Rs. {totalPrice().toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-body mt-1">Bulk pricing available — contact us</p>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-forest-700 hover:bg-forest-600 text-white py-4 rounded font-display font-semibold text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Place Order
                  <ArrowRight size={18} />
                </button>

                <Link
                  href="/products"
                  className="block text-center mt-3 text-forest-600 hover:text-forest-800 text-sm font-body transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
