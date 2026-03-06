import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser client (for client components)
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server client (for server components, reads cookies)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {}
      },
    },
  })
}

// Service role client (for admin API routes only)
export function createAdminSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
