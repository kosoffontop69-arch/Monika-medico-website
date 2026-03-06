import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { ArrowLeft, Shield, Package, Tag, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export async function generateStaticParams() {
  const { data } = await supabase.from('products').select('slug').eq('is_active', true)
  return (data || []).map(p => ({ slug: p.slug }))
}

async function getProduct(slug: string) {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8 text-sm font-body">
          <Link href="/products" className="flex items-center gap-1 text-forest-600 hover:text-forest-800 transition-colors">
            <ArrowLeft size={14} />
            All Products
          </Link>
          {product.categories && (
            <>
              <span className="text-gray-300">/</span>
              <Link href={`/products?category=${product.categories.slug}`} className="text-forest-600 hover:text-forest-800">
                {product.categories.name}
              </Link>
            </>
          )}
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden aspect-square">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl bg-gray-50">
                💊
              </div>
            )}
            {discount && (
              <div className="absolute top-4 left-4 bg-crimson-600 text-white text-sm px-3 py-1 rounded font-bold">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.categories && (
              <Link
                href={`/products?category=${product.categories.slug}`}
                className="text-forest-600 text-sm font-sans uppercase tracking-wider hover:text-forest-800 transition-colors"
              >
                {product.categories.name}
              </Link>
            )}

            <h1 className="font-display text-3xl font-bold text-forest-950 mt-2 mb-4">
              {product.name}
            </h1>

            {product.requires_prescription && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded p-3 mb-5">
                <AlertCircle size={16} className="text-amber-600 flex-shrink-0" />
                <span className="text-amber-700 text-sm font-body">
                  This product requires a valid prescription from a licensed practitioner.
                </span>
              </div>
            )}

            {product.description && (
              <p className="text-gray-600 font-body leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Price */}
            <div className="bg-forest-50 border border-forest-100 rounded-lg p-5 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-forest-800">
                  Rs. {product.price.toFixed(2)}
                </span>
                <span className="text-gray-500 font-body text-sm">per {product.unit}</span>
              </div>
              {product.original_price && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 line-through font-body text-sm">
                    Rs. {product.original_price.toFixed(2)}
                  </span>
                  <span className="text-crimson-600 text-sm font-bold">Save {discount}%</span>
                </div>
              )}
            </div>

            {/* Meta info */}
            <div className="space-y-3 mb-8">
              {product.manufacturer && (
                <div className="flex items-center gap-3 text-sm">
                  <Tag size={15} className="text-forest-500" />
                  <span className="text-gray-500 font-body">Manufacturer:</span>
                  <span className="text-forest-900 font-body font-medium">{product.manufacturer}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Package size={15} className="text-forest-500" />
                <span className="text-gray-500 font-body">Stock:</span>
                <span className={`font-body font-medium ${product.stock_quantity > 0 ? 'text-forest-700' : 'text-crimson-600'}`}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={15} className="text-forest-500" />
                <span className="text-gray-500 font-body">Authenticity:</span>
                <span className="text-forest-700 font-body font-medium">100% Guaranteed</span>
              </div>
            </div>

            {/* Add to cart */}
            <AddToCartButton product={product} />

            {/* Help */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-gray-500 text-sm font-body">
                Need bulk pricing or have questions?{' '}
                <Link href="/contact" className="text-forest-600 hover:text-forest-800 font-semibold">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
