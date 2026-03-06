import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Monika Medico Pvt. Ltd. — Wholesale Medicine Distributors',
  description: 'Wholesale medicine distributors and medical supply store serving Siraha district and beyond. Authentic products, reliable service.',
  keywords: 'medicine, wholesale, Siraha, Nepal, medical supplies, pharmacy, Monika Medico',
  openGraph: {
    title: 'Monika Medico Pvt. Ltd.',
    description: 'Wholesale medicine distributors and medical supply store in Siraha, Nepal.',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e4220',
              color: '#faf8f2',
              fontFamily: 'Lora, Georgia, serif',
              borderRadius: '4px',
            },
            success: {
              iconTheme: { primary: '#5fa062', secondary: '#faf8f2' }
            },
            error: {
              iconTheme: { primary: '#c11010', secondary: '#faf8f2' },
              style: { background: '#6b0f0f', color: '#fff' }
            }
          }}
        />
      </body>
    </html>
  )
}
