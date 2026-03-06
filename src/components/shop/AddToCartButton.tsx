'use client'
import { useState } from 'react'
import { ShoppingCart, Plus, Minus, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  image_url?: string | null
  unit: string
  requires_prescription: boolean
  stock_quantity: number
}

export function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const { addItem, items, updateQuantity } = useCartStore()

  const existingItem = items.find(i => i.id === product.id)
  const isOutOfStock = product.stock_quantity === 0

  const handleAdd = () => {
    if (product.requires_prescription) {
      toast.error('Prescription required. Please contact us directly.')
      return
    }
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url || null,
        unit: product.unit,
        requires_prescription: product.requires_prescription,
      })
    }
    toast.success(`Added ${qty} × ${product.name} to cart`)
  }

  if (product.requires_prescription) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 p-4 rounded">
          <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm font-body">
            This is a prescription-only medication. Contact us via phone or visit in person with your prescription.
          </p>
        </div>
        <a
          href="tel:+977"
          className="block text-center bg-amber-600 hover:bg-amber-700 text-white py-3 rounded font-display font-semibold transition-colors"
        >
          Call to Order
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      {!existingItem && (
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm font-body">Quantity:</span>
          <div className="flex items-center border border-gray-200 rounded overflow-hidden">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="px-4 py-2 font-display font-semibold text-forest-900">{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {existingItem ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-forest-300 rounded overflow-hidden">
            <button
              onClick={() => updateQuantity(product.id, existingItem.quantity - 1)}
              className="px-4 py-3 bg-forest-50 hover:bg-forest-100 transition-colors"
            >
              <Minus size={16} className="text-forest-700" />
            </button>
            <span className="px-6 py-3 font-display font-bold text-forest-900">{existingItem.quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, existingItem.quantity + 1)}
              className="px-4 py-3 bg-forest-50 hover:bg-forest-100 transition-colors"
            >
              <Plus size={16} className="text-forest-700" />
            </button>
          </div>
          <span className="text-forest-600 text-sm font-body">In cart</span>
        </div>
      ) : (
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded font-display font-semibold text-lg transition-all duration-200 ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-forest-700 hover:bg-forest-600 text-white hover:shadow-lg hover:translate-y-[-1px]'
          }`}
        >
          <ShoppingCart size={20} />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      )}
    </div>
  )
}
