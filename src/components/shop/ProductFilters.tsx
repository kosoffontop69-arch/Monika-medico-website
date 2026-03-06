'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { clsx } from 'clsx'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
}

export function ProductFilters({
  categories,
  activeCategory,
  activeSearch,
}: {
  categories: Category[]
  activeCategory?: string
  activeSearch?: string
}) {
  const router = useRouter()
  const [search, setSearch] = useState(activeSearch || '')

  const updateFilters = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    if (updates.category) params.set('category', updates.category)
    if (updates.search) params.set('search', updates.search)
    router.push(`/products?${params.toString()}`)
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search, category: activeCategory })
  }

  const clearFilters = () => {
    setSearch('')
    router.push('/products')
  }

  const hasFilters = activeCategory || activeSearch

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-100 p-5">
        <h3 className="font-display font-semibold text-forest-950 mb-4">Search</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm font-body focus:outline-none focus:border-forest-400"
          />
          <button
            type="submit"
            className="bg-forest-700 text-white px-3 py-2 rounded hover:bg-forest-600 transition-colors"
          >
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg border border-gray-100 p-5">
        <h3 className="font-display font-semibold text-forest-950 mb-4">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateFilters({ search: activeSearch })}
            className={clsx(
              'w-full text-left px-3 py-2 rounded text-sm font-body transition-colors',
              !activeCategory
                ? 'bg-forest-700 text-white font-semibold'
                : 'text-gray-600 hover:bg-forest-50 hover:text-forest-800'
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilters({ category: cat.slug, search: activeSearch })}
              className={clsx(
                'w-full text-left px-3 py-2 rounded text-sm font-body transition-colors flex items-center gap-2',
                activeCategory === cat.slug
                  ? 'bg-forest-700 text-white font-semibold'
                  : 'text-gray-600 hover:bg-forest-50 hover:text-forest-800'
              )}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 border border-crimson-200 text-crimson-600 hover:bg-crimson-50 px-4 py-2 rounded text-sm font-body transition-colors"
        >
          <X size={14} />
          Clear Filters
        </button>
      )}
    </div>
  )
}
