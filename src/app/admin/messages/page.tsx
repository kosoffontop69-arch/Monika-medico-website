'use client'
import { useState, useEffect } from 'react'
import { Mail, MailOpen, Trash2, Phone, Clock } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/messages')
    setMessages(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const markRead = async (id: string, is_read: boolean) => {
    await fetch('/api/admin/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_read })
    })
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read } : m))
  }

  const deleteMsg = async (id: string) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      setMessages(prev => prev.filter(m => m.id !== id))
      toast.success('Message deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm font-body">
          {messages.length} total · <span className="text-green-700 font-semibold">{unreadCount} unread</span>
        </p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-100 p-10 text-center text-gray-400 font-body">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-400 font-body">No messages yet</p>
          </div>
        ) : messages.map(msg => (
          <div key={msg.id} className={clsx('bg-white rounded-lg border overflow-hidden transition-all',
            !msg.is_read ? 'border-green-200 shadow-sm' : 'border-gray-100')}>
            <div className="flex items-start gap-4 p-5 cursor-pointer"
              onClick={() => {
                setExpanded(expanded === msg.id ? null : msg.id)
                if (!msg.is_read) markRead(msg.id, true)
              }}>
              <div className={clsx('mt-0.5 flex-shrink-0', !msg.is_read ? 'text-green-600' : 'text-gray-300')}>
                {msg.is_read ? <MailOpen size={18} /> : <Mail size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-body font-semibold text-gray-900">{msg.name}</span>
                  {!msg.is_read && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                  {msg.subject && <span className="text-xs text-gray-400 font-body">— {msg.subject}</span>}
                </div>
                <p className="text-sm text-gray-500 font-body mt-0.5 truncate">{msg.message}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-body">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(msg.created_at).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.phone && <span className="flex items-center gap-1"><Phone size={11} /> {msg.phone}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={e => { e.stopPropagation(); markRead(msg.id, !msg.is_read) }}
                  className="p-1.5 text-gray-300 hover:text-blue-500 rounded hover:bg-blue-50 transition-colors"
                  title={msg.is_read ? 'Mark unread' : 'Mark read'}
                >
                  {msg.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); deleteMsg(msg.id) }}
                  className="p-1.5 text-gray-300 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {expanded === msg.id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 space-y-3">
                <div className="bg-white rounded border border-gray-100 p-4">
                  <p className="text-sm font-body text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
                <div className="flex gap-4 text-sm font-body text-gray-500">
                  {msg.email && (
                    <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a>
                  )}
                  {msg.phone && (
                    <a href={`tel:${msg.phone}`} className="text-blue-600 hover:underline">{msg.phone}</a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
