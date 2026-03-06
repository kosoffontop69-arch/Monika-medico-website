'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  original_price?: number | null
  image_url?: string | null
  unit: string
  requires_prescription: boolean
  stock_quantity: number
  manufacturer?: string | null
  categories?: { name: string; slug: string } | null
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const isOutOfStock = product.stock_quantity === 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.requires_prescription) {
      toast.error('This product requires a prescription. Please contact us.')
      return
    }
    if (isOutOfStock) {
      toast.error('Out of stock')
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || null,
      unit: product.unit,
      requires_prescription: product.requires_prescription,
    })
    toast.success(`${product.name} added to cart`)
  }

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <div className="product-card bg-white rounded-lg overflow-hidden border border-gray-100 group cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-50 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              💊
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && (
              <span className="bg-crimson-600 text-white text-xs px-2 py-0.5 rounded font-sans font-bold">
                -{discount}%
              </span>
            )}
            {product.requires_prescription && (
              <span className="rx-badge">Rx</span>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          {product.categories && (
            <span className="text-forest-600 text-xs font-sans uppercase tracking-wider mb-1">
              {product.categories.name}
            </span>
          )}
          <h3 className="font-display font-semibold text-forest-950 text-sm leading-snug mb-2 flex-1 line-clamp-2">
            {product.name}
          </h3>
          {product.manufacturer && (
            <span className="text-gray-400 text-xs font-body mb-3">{product.manufacturer}</span>
          )}

          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="font-display font-bold text-forest-800 text-lg">
                Rs. {product.price.toFixed(0)}
              </span>
              {product.original_price && (
                <span className="text-gray-400 text-xs line-through ml-2 font-body">
                  Rs. {product.original_price.toFixed(0)}
                </span>
              )}
              <div className="text-gray-400 text-xs font-body">per {product.unit}</div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={clsx(
                'p-2 rounded transition-all duration-200',
                isOutOfStock
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : product.requires_prescription
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200'
                  : 'bg-forest-600 text-white hover:bg-forest-700 hover:scale-105'
              )}
            >
              {product.requires_prescription ? (
                <AlertCircle size={18} />
              ) : (
                <ShoppingCart size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
