'use client'
import { useState } from 'react'
import { MapPin, Globe, Clock, Phone, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.message) {
      toast.error('Name and message are required')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to send')
      setIsSuccess(true)
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20">
      {/* Header */}
      <div className="bg-forest-950 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-forest-300 font-body max-w-xl">
            Reach out for wholesale pricing, bulk orders, or any inquiries. We're here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h2 className="font-display font-bold text-forest-950 text-xl mb-6">Get in Touch</h2>
              
              {[
                {
                  icon: <MapPin size={18} className="text-forest-600" />,
                  label: 'Address',
                  value: 'Lahan-4, Hulaki Road\nSiraha, Nepal'
                },
                {
                  icon: <Globe size={18} className="text-forest-600" />,
                  label: 'Website',
                  value: 'monikamedicopltd.com.np'
                },
                {
                  icon: <Clock size={18} className="text-forest-600" />,
                  label: 'Hours',
                  value: 'Sunday – Friday\n9:00 AM – 6:00 PM'
                }
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4 mb-5 last:mb-0">
                  <div className="w-9 h-9 bg-forest-50 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-sans uppercase tracking-wider text-gray-400 mb-0.5">{item.label}</div>
                    <div className="text-forest-900 font-body text-sm whitespace-pre-line">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-forest-950 rounded-lg p-6 text-center">
              <div className="text-forest-400 text-sm font-body mb-2">For bulk orders</div>
              <div className="font-display text-white font-bold text-lg">Contact us directly</div>
              <div className="text-forest-400 text-xs font-body mt-1">Best pricing for wholesale quantities</div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-100 p-8">
              {isSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="text-forest-600 mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-forest-950 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 font-body mb-6">We'll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-forest-600 hover:text-forest-800 font-body text-sm underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold text-forest-950 mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-body text-gray-700 mb-1.5">
                          Name <span className="text-crimson-500">*</span>
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-body text-gray-700 mb-1.5">Phone</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          type="tel"
                          className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                          placeholder="+977 XXXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-body text-gray-700 mb-1.5">Email</label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body text-gray-700 mb-1.5">Subject</label>
                      <input
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400"
                        placeholder="Wholesale inquiry, product question..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body text-gray-700 mb-1.5">
                        Message <span className="text-crimson-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full border border-gray-200 rounded px-4 py-3 font-body text-sm focus:outline-none focus:border-forest-400 focus:ring-1 focus:ring-forest-400 resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center justify-center gap-2 w-full py-4 rounded font-display font-semibold text-lg transition-all ${
                        isSubmitting
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-forest-700 hover:bg-forest-600 text-white hover:shadow-lg'
                      }`}
                    >
                      <Send size={18} />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
