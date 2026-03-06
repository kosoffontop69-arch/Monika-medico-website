-- =====================================================
-- MIGRATION 002: Admin Panel, Payments & Site Settings
-- Run this in Supabase SQL Editor AFTER migration 001
-- =====================================================

-- Add payment info to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cod' 
    CHECK (payment_method IN ('cod', 'esewa', 'khalti', 'bank_transfer')),
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_address TEXT;

-- Site settings table (key-value store)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  label TEXT,
  description TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'boolean', 'number', 'textarea', 'color')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default site settings
INSERT INTO site_settings (key, value, label, description, type) VALUES
  ('site_open', 'true', 'Site Open', 'Toggle to close/open the store for orders', 'boolean'),
  ('maintenance_mode', 'false', 'Maintenance Mode', 'Show maintenance page to visitors', 'boolean'),
  ('announcement_text', '', 'Announcement Banner', 'Text shown in top announcement bar (leave empty to hide)', 'textarea'),
  ('announcement_active', 'false', 'Announcement Active', 'Show announcement banner', 'boolean'),
  ('whatsapp_number', '', 'WhatsApp Number', 'WhatsApp number for orders (e.g. 9779812345678)', 'text'),
  ('phone_number', '', 'Phone Number', 'Main contact phone number', 'text'),
  ('esewa_id', '', 'eSewa Merchant ID', 'Your eSewa merchant/business ID', 'text'),
  ('khalti_public_key', '', 'Khalti Public Key', 'Your Khalti public key for payments', 'text'),
  ('cod_available', 'true', 'Cash on Delivery', 'Enable COD payment option', 'boolean'),
  ('esewa_available', 'true', 'eSewa Payment', 'Enable eSewa payment option', 'boolean'),
  ('khalti_available', 'true', 'Khalti Payment', 'Enable Khalti payment option', 'boolean'),
  ('bank_transfer_available', 'false', 'Bank Transfer', 'Enable Bank Transfer payment option', 'boolean'),
  ('bank_details', '', 'Bank Transfer Details', 'Bank name, account number, account name', 'textarea'),
  ('min_order_amount', '0', 'Minimum Order Amount (Rs.)', 'Minimum order amount required', 'number'),
  ('delivery_charge', '0', 'Delivery Charge (Rs.)', 'Fixed delivery charge for all orders', 'number')
ON CONFLICT (key) DO NOTHING;

-- Admin users table (simple PIN-based for now)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pin_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin PIN (1234 - change immediately after setup)
-- This is a simple hash representation - in production use proper auth
INSERT INTO admin_sessions (pin_hash, is_active) VALUES ('admin123', true)
ON CONFLICT DO NOTHING;

-- Allow service role to manage everything
-- Products: full CRUD via service role (already set up)
-- Allow reading site settings publicly (for frontend)
CREATE POLICY IF NOT EXISTS "Site settings are publicly readable" 
  ON site_settings FOR SELECT USING (true);

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
