-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'piece',
  manufacturer TEXT,
  requires_prescription BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Tablets & Capsules', 'tablets-capsules', 'Oral solid dosage forms including tablets, capsules, and pills', '💊'),
  ('Medical Devices', 'medical-devices', 'Diagnostic and therapeutic medical equipment', '🩺'),
  ('Surgical Supplies', 'surgical-supplies', 'Surgical tools, gloves, masks, and sterile supplies', '🩹'),
  ('Injectables', 'injectables', 'Injectable medications, IV fluids, and syringes', '💉'),
  ('Diagnostics', 'diagnostics', 'Test kits, reagents, and diagnostic equipment', '🔬'),
  ('Personal Care', 'personal-care', 'Health and wellness personal care products', '🏥')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, price, original_price, category_id, image_url, stock_quantity, unit, manufacturer, requires_prescription) VALUES
  ('Paracetamol 500mg (Strip of 10)', 'paracetamol-500mg', 'Effective pain relief and fever reducer. Suitable for adults and children over 12.', 25.00, 30.00, (SELECT id FROM categories WHERE slug='tablets-capsules'), 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 500, 'strip', 'Generic', false),
  ('Amoxicillin 250mg Capsules', 'amoxicillin-250mg', 'Broad-spectrum antibiotic for bacterial infections. Prescription required.', 85.00, NULL, (SELECT id FROM categories WHERE slug='tablets-capsules'), 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400', 200, 'strip', 'Cipla', true),
  ('Digital Blood Pressure Monitor', 'bp-monitor-digital', 'Automatic upper arm blood pressure monitor with large LCD display. Clinically validated.', 2500.00, 3000.00, (SELECT id FROM categories WHERE slug='medical-devices'), 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 50, 'piece', 'Omron', false),
  ('Blood Glucose Meter', 'glucose-meter', 'Fast and accurate blood glucose monitoring system. Includes 10 test strips.', 1800.00, 2200.00, (SELECT id FROM categories WHERE slug='diagnostics'), 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400', 30, 'piece', 'Accu-Chek', false),
  ('Surgical Gloves (Box of 100)', 'surgical-gloves-100', 'Latex-free nitrile examination gloves. Powder-free, sterile, ambidextrous.', 450.00, 500.00, (SELECT id FROM categories WHERE slug='surgical-supplies'), 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400', 200, 'box', 'Ansell', false),
  ('Normal Saline IV 500ml', 'normal-saline-500ml', '0.9% Sodium Chloride Injection USP. Sterile isotonic solution for intravenous use.', 120.00, NULL, (SELECT id FROM categories WHERE slug='injectables'), 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400', 300, 'bottle', 'Baxter', true),
  ('Surgical Mask N95 (Box of 20)', 'n95-mask-20', 'NIOSH-approved N95 respirator masks. High filtration efficiency.', 650.00, 700.00, (SELECT id FROM categories WHERE slug='surgical-supplies'), 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400', 150, 'box', '3M', false),
  ('Vitamin C 1000mg Tablets', 'vitamin-c-1000mg', 'High-potency Vitamin C with bioflavonoids. Immune support and antioxidant protection.', 350.00, 400.00, (SELECT id FROM categories WHERE slug='tablets-capsules'), 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400', 400, 'bottle', 'NOW Foods', false),
  ('Digital Thermometer', 'digital-thermometer', 'Fast-reading digital oral/rectal/axillary thermometer. 60-second reading.', 380.00, 450.00, (SELECT id FROM categories WHERE slug='medical-devices'), 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 100, 'piece', 'Braun', false),
  ('Pregnancy Test Kit', 'pregnancy-test-kit', 'Highly sensitive rapid test. 99% accuracy from day of missed period.', 150.00, NULL, (SELECT id FROM categories WHERE slug='diagnostics'), 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400', 250, 'piece', 'Clearblue', false),
  ('Bandage Crepe 10cm', 'bandage-crepe-10cm', 'Conforming cotton crepe bandage for wound support and compression.', 45.00, 55.00, (SELECT id FROM categories WHERE slug='surgical-supplies'), 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400', 500, 'roll', 'BSN Medical', false),
  ('Metformin 500mg Tablets', 'metformin-500mg', 'Oral antidiabetic medication. Prescription required. For Type 2 Diabetes management.', 95.00, NULL, (SELECT id FROM categories WHERE slug='tablets-capsules'), 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400', 180, 'strip', 'Sun Pharma', true)
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can read products and categories
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (true);

-- Anyone can create orders
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

-- Anyone can create contact messages
CREATE POLICY "Anyone can create contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
