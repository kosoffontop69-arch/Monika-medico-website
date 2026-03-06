'use client'
import { useState, useEffect } from 'react'
import { Save, RefreshCw, Globe, CreditCard, Bell, Shield, Store } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

interface Setting { key: string; value: string; label: string; description: string; type: string }

const SECTIONS = [
  {
    title: 'Store Status',
    icon: Store,
    color: 'text-green-600',
    keys: ['site_open', 'maintenance_mode', 'announcement_active', 'announcement_text']
  },
  {
    title: 'Payment Methods',
    icon: CreditCard,
    color: 'text-blue-600',
    keys: ['cod_available', 'esewa_available', 'esewa_id', 'khalti_available', 'khalti_public_key', 'bank_transfer_available', 'bank_details']
  },
  {
    title: 'Contact & Notifications',
    icon: Bell,
    color: 'text-amber-600',
    keys: ['phone_number', 'whatsapp_number']
  },
  {
    title: 'Order Settings',
    icon: Globe,
    color: 'text-purple-600',
    keys: ['min_order_amount', 'delivery_charge']
  },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, Setting>>({})
  const [changes, setChanges] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/site-settings')
    const data: Setting[] = await res.json()
    const map = data.reduce((acc, s) => { acc[s.key] = s; return acc }, {} as Record<string, Setting>)
    setSettings(map)
    setLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  const getValue = (key: string) => changes[key] ?? settings[key]?.value ?? ''

  const handleChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }))
  }

  const handleToggle = (key: string) => {
    const current = getValue(key)
    handleChange(key, current === 'true' ? 'false' : 'true')
  }

  const saveAll = async () => {
    if (Object.keys(changes).length === 0) {
      toast('No changes to save')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes)
      })
      if (!res.ok) throw new Error()
      // apply changes to settings
      setSettings(prev => {
        const next = { ...prev }
        Object.entries(changes).forEach(([k, v]) => {
          if (next[k]) next[k] = { ...next[k], value: v }
        })
        return next
      })
      setChanges({})
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = Object.keys(changes).length > 0

  const renderField = (key: string) => {
    const setting = settings[key]
    if (!setting) return null
    const value = getValue(key)
    const changed = key in changes

    if (setting.type === 'boolean') {
      const isOn = value === 'true'
      const isWarning = (key === 'maintenance_mode' && isOn) || (key === 'site_open' && !isOn)
      return (
        <div key={key} className={clsx('flex items-center justify-between p-4 rounded-lg border transition-colors',
          isWarning ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100',
          changed && 'ring-2 ring-blue-200')}>
          <div>
            <div className="font-body font-semibold text-gray-900 text-sm">{setting.label}</div>
            <div className="text-gray-500 text-xs font-body mt-0.5">{setting.description}</div>
          </div>
          <button
            onClick={() => handleToggle(key)}
            className={clsx('relative w-12 h-6 rounded-full transition-colors flex-shrink-0',
              isOn ? 'bg-green-500' : 'bg-gray-300')}>
            <span className={clsx('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
              isOn ? 'translate-x-6' : 'translate-x-0.5')} />
          </button>
        </div>
      )
    }

    if (setting.type === 'textarea') {
      return (
        <div key={key} className={clsx('p-4 rounded-lg border bg-white', changed && 'ring-2 ring-blue-200 border-blue-200')}>
          <label className="block font-body font-semibold text-gray-900 text-sm mb-1">{setting.label}</label>
          <p className="text-gray-400 text-xs font-body mb-2">{setting.description}</p>
          <textarea
            value={value}
            onChange={e => handleChange(key, e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-body focus:outline-none focus:border-green-400 resize-none"
            placeholder={setting.description}
          />
        </div>
      )
    }

    return (
      <div key={key} className={clsx('p-4 rounded-lg border bg-white', changed && 'ring-2 ring-blue-200 border-blue-200')}>
        <label className="block font-body font-semibold text-gray-900 text-sm mb-1">{setting.label}</label>
        <p className="text-gray-400 text-xs font-body mb-2">{setting.description}</p>
        <input
          value={value}
          onChange={e => handleChange(key, e.target.value)}
          type={setting.type === 'number' ? 'number' : 'text'}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm font-body focus:outline-none focus:border-green-400"
          placeholder={`Enter ${setting.label.toLowerCase()}`}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm font-body">Manage store configuration, payments & more</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchSettings}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-body text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} />
            Refresh
          </button>
          <button onClick={saveAll} disabled={saving || !hasChanges}
            className={clsx('flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-display font-semibold transition-all',
              hasChanges && !saving
                ? 'bg-green-700 hover:bg-green-600 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed')}>
            <Save size={14} />
            {saving ? 'Saving...' : `Save${hasChanges ? ` (${Object.keys(changes).length})` : ''}`}
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm font-body text-blue-700 flex items-center justify-between">
          <span>⚠️ You have unsaved changes</span>
          <button onClick={() => setChanges({})} className="text-blue-500 hover:text-blue-700 underline text-xs">Discard</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400 font-body">Loading settings...</div>
      ) : (
        SECTIONS.map(section => {
          const Icon = section.icon
          const sectionSettings = section.keys.filter(k => settings[k])
          if (sectionSettings.length === 0) return null
          return (
            <div key={section.title} className="bg-gray-50 rounded-xl border border-gray-100 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className={section.color} />
                <h2 className="font-display font-bold text-gray-900">{section.title}</h2>
              </div>
              {section.keys.map(key => renderField(key))}
            </div>
          )
        })
      )}

      {/* Security section */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-red-500" />
          <h2 className="font-display font-bold text-gray-900">Admin Security</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <div className="font-body font-semibold text-gray-900 text-sm mb-1">Change Admin PIN</div>
          <p className="text-gray-400 text-xs font-body mb-3">Default PIN is admin123. Change it after first login.</p>
          <p className="text-amber-600 text-xs font-body bg-amber-50 p-3 rounded border border-amber-100">
            💡 To change the PIN, update the <code className="bg-amber-100 px-1 rounded">pin_hash</code> value in the <code className="bg-amber-100 px-1 rounded">admin_sessions</code> table directly in Supabase. Use a strong password.
          </p>
        </div>
      </div>
    </div>
  )
}
