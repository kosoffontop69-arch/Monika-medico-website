'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const supabase = createBrowserSupabaseClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-14 h-14">
              <polygon points="30,80 50,30 70,80" fill="#c11010" opacity="0.9"/>
              <polygon points="45,80 65,25 85,80" fill="#3d8040" opacity="0.9"/>
              <polygon points="50,80 58,60 66,80" fill="#1a2744" opacity="0.9"/>
            </svg>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mt-4 mb-1">Reset Password</h1>
          <p className="text-forest-400 font-body text-sm">We'll send you a reset link</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="text-forest-600 mx-auto mb-4" />
              <h3 className="font-display font-bold text-gray-900 text-xl mb-2">Email Sent!</h3>
              <p className="text-gray-500 font-body text-sm mb-6">Check your inbox for a password reset link.</p>
              <Link href="/login" className="text-forest-700 hover:text-forest-900 font-body font-semibold text-sm">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100"
                      placeholder="your@email.com" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-forest-700 hover:bg-forest-600 text-white py-3.5 rounded-xl font-display font-bold transition-all disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <Link href="/login" className="flex items-center justify-center gap-2 mt-5 text-gray-400 hover:text-gray-600 text-sm font-body transition-colors">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
