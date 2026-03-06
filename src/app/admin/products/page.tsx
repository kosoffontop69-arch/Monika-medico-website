'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, AlertCircle, X, Save } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  category_id: string | null
  image_url: string | null
  stock_quantity: number
  unit: string
  manufacturer: string | null
  requires_prescription: boolean
  is_active: boolean
  categories?: { name: string } | null
}

interface Category { id: string; name: string; slug: string }

const EMPTY_FORM = {
  name: '', slug: '', description: '', price: '', original_price: '',
  category_id: '', image_url: '', stock_quantity: '0', unit: 'strip',
  manufacturer: '', requires_prescription: false, is_active: true
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [pRes, cRes] = await Promise.all([
      fetch('/api/admin/products'),
      fetch('/api/admin/products?type=categories')
    ])
    const [pData, cData] = await Promise.all([pRes.json(), cRes.json()])
    setProducts(pData)
    setCategories(cData)
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditProduct(p)
    setForm({
      name: p.name, slug: p.slug, description: p.description || '',
      price: p.price, original_price: p.original_price || '',
      category_id: p.category_id || '', image_url: p.image_url || '',
      stock_quantity: p.stock_quantity, unit: p.unit,
      manufacturer: p.manufacturer || '',
      requires_prescription: p.requires_prescription,
      is_active: p.is_active
    })
    setShowModal(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    if (name === 'name' && !editProduct) {
      setForm((f: any) => ({
        ...f, name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }))
    } else {
      setForm((f: any) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const method = editProduct ? 'PUT' : 'POST'
      const body = {
        ...form,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        stock_quantity: parseInt(form.stock_quantity),
        id: editProduct?.id
      }
      const res = await fetch('/api/admin/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error(await res.text())
      toast.success(editProduct ? 'Product updated!' : 'Product added!')
      setShowModal(false)
      fetchData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      if (!res.ok) throw new Error()
      toast.success('Product deleted')
      setDeleteId(null)
      fetchData()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleToggleActive = async (p: Product) => {
    try {
      await fetch('/api/admin/products', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...p, category_id: p.category_id, is_active: !p.is_active, id: p.id })
      })
      fetchData()
    } catch { toast.error('Failed') }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.manufacturer || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm font-body">{products.length} total products</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-display font-semibold text-sm transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm font-body focus:outline-none focus:border-green-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Rx', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-display text-xs uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400 font-body">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400 font-body">No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-body font-medium text-gray-900 max-w-[200px] truncate">{p.name}</div>
                    {p.manufacturer && <div className="text-xs text-gray-400">{p.manufacturer}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-body text-xs">{p.categories?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="font-display font-bold text-gray-900">Rs. {p.price}</div>
                    {p.original_price && <div className="text-xs text-gray-400 line-through">Rs. {p.original_price}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-xs font-bold px-2 py-1 rounded',
                      p.stock_quantity === 0 ? 'bg-red-50 text-red-600' :
                      p.stock_quantity <= 10 ? 'bg-amber-50 text-amber-600' :
                      'bg-green-50 text-green-700'
                    )}>
                      {p.stock_quantity} {p.unit}s
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.requires_prescription ? (
                      <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded font-bold">Rx</span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleActive(p)}
                      className={clsx('flex items-center gap-1.5 text-xs px-2 py-1 rounded border transition-colors',
                        p.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'
                      )}>
                      {p.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                      {p.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-display font-bold text-xl text-gray-900">
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400" placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Slug *</label>
                  <input name="slug" value={form.slug} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Category</label>
                  <select name="category_id" value={form.category_id} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400 bg-white">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Price (Rs.) *</label>
                  <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Original Price (Rs.)</label>
                  <input name="original_price" value={form.original_price} onChange={handleChange} type="number" step="0.01" min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400" placeholder="For showing discount" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Stock Quantity *</label>
                  <input name="stock_quantity" value={form.stock_quantity} onChange={handleChange} required type="number" min="0"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400" />
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Unit</label>
                  <select name="unit" value={form.unit} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400 bg-white">
                    {['strip', 'piece', 'box', 'bottle', 'roll', 'pack', 'vial', 'tube'].map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Manufacturer</label>
                  <input name="manufacturer" value={form.manufacturer} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Image URL</label>
                  <input name="image_url" value={form.image_url} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400" placeholder="https://..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 font-body text-sm focus:outline-none focus:border-green-400 resize-none" />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="requires_prescription" checked={form.requires_prescription} onChange={handleChange} className="w-4 h-4 accent-red-600" />
                    <span className="text-sm font-body text-gray-700">Requires Prescription</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 accent-green-600" />
                    <span className="text-sm font-body text-gray-700">Active / Visible</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-lg font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-display font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
                  <Save size={16} />
                  {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900">Delete Product?</h3>
                <p className="text-gray-500 text-sm font-body">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg font-body text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-body text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
