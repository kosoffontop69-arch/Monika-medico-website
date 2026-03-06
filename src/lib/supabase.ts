import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role for admin operations
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
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
          created_at: string
          updated_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          customer_email: string | null
          customer_address: string
          items: any
          total_amount: number
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          subject: string | null
          message: string
          is_read: boolean
          created_at: string
        }
      }
    }
  }
}
