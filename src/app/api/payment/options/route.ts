import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', [
      'cod_available', 'esewa_available', 'khalti_available', 
      'bank_transfer_available', 'esewa_id', 'khalti_public_key',
      'bank_details', 'delivery_charge', 'min_order_amount',
      'whatsapp_number', 'site_open', 'maintenance_mode'
    ])

  const result = (data || []).reduce((acc: any, s) => {
    acc[s.key] = s.value
    return acc
  }, {})

  return NextResponse.json(result)
}
