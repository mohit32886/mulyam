-- Migration: Secure RLS Policies
-- This migration replaces the "allow all" policies with proper authentication-based policies
-- Run this AFTER setting up Supabase Auth users

-- ============================================
-- DROP OLD INSECURE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Allow all for products" ON products;
DROP POLICY IF EXISTS "Allow all for coupons" ON coupons;
DROP POLICY IF EXISTS "Allow all for banners" ON banners;
DROP POLICY IF EXISTS "Allow all for settings" ON settings;
DROP POLICY IF EXISTS "Allow all for activity_log" ON activity_log;
DROP POLICY IF EXISTS "Allow all for featured_products" ON featured_products;

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
-- SETUP INSTRUCTIONS
-- ============================================
-- 1. Create an admin user in Supabase Auth:
--    - Go to Authentication > Users in Supabase Dashboard
--    - Click "Add user" > "Create new user"
--    - Enter admin email and password
--
-- 2. (Optional) For role-based access, create a profiles table:
--    CREATE TABLE profiles (
--      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--      role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
--      created_at TIMESTAMPTZ DEFAULT NOW()
--    );
--
--    Then update policies to check profile role:
--    ... USING (
--      EXISTS (
--        SELECT 1 FROM profiles
--        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
--      )
--    )
