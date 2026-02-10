-- Mulyam Jewels Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  collection TEXT NOT NULL CHECK (collection IN ('diva', 'mini', 'paws', 'bond')),
  category TEXT NOT NULL,
  description TEXT,
  short_description TEXT,

  -- Pricing
  price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER,
  cost_price INTEGER,
  discount INTEGER,

  -- Product details
  color TEXT DEFAULT 'Gold',
  material TEXT DEFAULT 'Stainless Steel',
  plating TEXT DEFAULT '18K Gold Plated',
  size TEXT,
  weight TEXT,
  sku TEXT UNIQUE,

  -- Images (stored as JSON array)
  images JSONB DEFAULT '[]'::jsonb,

  -- Status flags
  in_stock BOOLEAN DEFAULT true,
  is_live BOOLEAN DEFAULT true,
  is_bestseller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 10,
  tag TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_live ON products(is_live);

-- ============================================
-- COUPONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'freeShipping')),
  value INTEGER NOT NULL DEFAULT 0,

  -- Constraints
  min_order INTEGER DEFAULT 0,
  max_discount INTEGER,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,

  -- Validity
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);

-- ============================================
-- BANNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subtitle TEXT,

  -- Link
  link_url TEXT,
  link_text TEXT DEFAULT 'Shop Now',

  -- Appearance
  position TEXT DEFAULT 'hero' CHECK (position IN ('hero', 'announcement', 'collection', 'sidebar')),
  background_color TEXT DEFAULT '#D4A574',
  text_color TEXT DEFAULT '#FFFFFF',
  image TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);

-- ============================================
-- SETTINGS TABLE (Key-Value Store)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACTIVITY LOG TABLE (Time Machine)
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,

  -- Activity details
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'product', 'coupon', 'banner', 'settings'
  entity_id TEXT,

  -- Change data
  label TEXT NOT NULL,
  detail TEXT,
  previous_data JSONB,
  new_data JSONB,

  -- Metadata
  user_name TEXT DEFAULT 'Admin',
  can_revert BOOLEAN DEFAULT false,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_action_type ON activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_type ON activity_log(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);

-- ============================================
-- FEATURED PRODUCTS TABLE (for homepage sections)
-- ============================================
CREATE TABLE IF NOT EXISTS featured_products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  section TEXT NOT NULL, -- 'bestsellers', 'new_arrivals', etc.
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_featured_section ON featured_products(section);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PUBLIC READ POLICIES (for storefront)
-- ============================================
-- Anyone can read live products
CREATE POLICY "Public can read live products" ON products
  FOR SELECT USING (is_live = true);

-- Anyone can read active banners
CREATE POLICY "Public can read active banners" ON banners
  FOR SELECT USING (is_active = true);

-- Anyone can read active coupons (for validation)
CREATE POLICY "Public can read active coupons" ON coupons
  FOR SELECT USING (is_active = true);

-- ============================================
-- AUTHENTICATED ADMIN POLICIES
-- ============================================
-- Authenticated users can do everything with products
CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can do everything with coupons
CREATE POLICY "Authenticated users can manage coupons" ON coupons
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can do everything with banners
CREATE POLICY "Authenticated users can manage banners" ON banners
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can do everything with settings
CREATE POLICY "Authenticated users can manage settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can do everything with activity_log
CREATE POLICY "Authenticated users can manage activity_log" ON activity_log
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can do everything with featured_products
CREATE POLICY "Authenticated users can manage featured_products" ON featured_products
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DONE!
-- ============================================
