import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/shop/ProductCard'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { Search } from 'lucide-react'

interface SearchParams {
  category?: string
  search?: string
  prescription?: string
}

async function getProducts(params: SearchParams) {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .order('name')

  if (params.category) {
    query = query.eq('categories.slug', params.category)
  }
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }
  if (params.prescription === 'false') {
    query = query.eq('requires_prescription', false)
  }

  const { data } = await query
  return data || []
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('*').order('name')
  return data || []
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories()
  ])

  // Filter by category client-side too (Supabase join filter workaround)
  const filteredProducts = searchParams.category
    ? products.filter((p: any) => p.categories?.slug === searchParams.category)
    : products

  const activeCategory = categories.find((c) => c.slug === searchParams.category)

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      {/* Header */}
      <div className="bg-forest-950 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            {activeCategory ? activeCategory.name : 'All Products'}
          </h1>
          <p className="text-forest-300 font-body">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters
              categories={categories}
              activeCategory={searchParams.category}
              activeSearch={searchParams.search}
            />
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl text-forest-900 mb-2">No products found</h3>
                <p className="text-gray-500 font-body">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
