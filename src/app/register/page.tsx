'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase-auth'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          phone: form.phone,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl p-10 shadow-2xl">
            <div className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-forest-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-forest-950 mb-3">Check Your Email</h2>
            <p className="text-gray-600 font-body mb-2">
              We sent a confirmation link to
            </p>
            <p className="text-forest-700 font-bold font-body mb-6">{form.email}</p>
            <p className="text-gray-400 text-sm font-body mb-6">
              Click the link in the email to activate your account. Check your spam folder if you don't see it.
            </p>
            <Link href="/login"
              className="inline-flex items-center gap-2 bg-forest-700 hover:bg-forest-600 text-white px-8 py-3 rounded-xl font-display font-bold transition-colors">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 flex items-center justify-center px-4 py-8 pt-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-14 h-14">
              <polygon points="30,80 50,30 70,80" fill="#c11010" opacity="0.9"/>
              <polygon points="45,80 65,25 85,80" fill="#3d8040" opacity="0.9"/>
              <polygon points="50,80 58,60 66,80" fill="#1a2744" opacity="0.9"/>
            </svg>
            <div>
              <div className="font-display text-white font-bold text-xl">Monika Medico</div>
              <div className="text-forest-400 text-xs tracking-widest uppercase">Pvt. Ltd.</div>
            </div>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mt-6 mb-1">Create Account</h1>
          <p className="text-forest-400 font-body text-sm">Join Monika Medico today</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 rounded-xl py-3.5 font-body font-semibold text-gray-700 transition-all mb-6 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-400 text-xs font-body uppercase tracking-wider">or email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="full_name" value={form.full_name} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100"
                    placeholder="Your full name" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="email" value={form.email} onChange={handleChange} required type="email"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100"
                    placeholder="you@example.com" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="phone" value={form.phone} onChange={handleChange} type="tel"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100"
                    placeholder="+977 XXXXXXXXXX" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="password" value={form.password} onChange={handleChange} required
                    type={showPw ? 'text' : 'password'} minLength={6}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-100"
                    placeholder="Min 6 chars" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-body font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Confirm</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input name="confirm_password" value={form.confirm_password} onChange={handleChange} required
                    type={showPw ? 'text' : 'password'}
                    className={`w-full border rounded-xl pl-10 pr-4 py-3 font-body text-sm focus:outline-none focus:ring-2 ${
                      form.confirm_password && form.password !== form.confirm_password
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-gray-200 focus:border-forest-400 focus:ring-forest-100'
                    }`}
                    placeholder="Repeat password" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-forest-700 hover:bg-forest-600 text-white py-3.5 rounded-xl font-display font-bold text-base flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 mt-2">
              {loading ? 'Creating account...' : (<>Create Account <ArrowRight size={18} /></>)}
            </button>
          </form>

          <p className="text-center text-sm font-body text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-forest-700 hover:text-forest-900 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
