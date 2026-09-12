-- 013_users_password_hash.sql
-- Enable pgcrypto for cryptographic functions and Blowfish-based Bcrypt hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Admin & Staff Users Table with Bcrypt Hashed Password Storage
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'doctor' CHECK (role IN ('admin', 'doctor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Helper trigger for automatic updated_at timestamp
DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow service role and server backend full access
DROP POLICY IF EXISTS "Service role has full access to admin_users" ON public.admin_users;
CREATE POLICY "Service role has full access to admin_users"
  ON public.admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon/authenticated to read their own user record or verify email during auth
DROP POLICY IF EXISTS "Allow anon reading for login verification" ON public.admin_users;
CREATE POLICY "Allow anon reading for login verification"
  ON public.admin_users
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anon inserting new admin_users" ON public.admin_users;
CREATE POLICY "Allow anon inserting new admin_users"
  ON public.admin_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated user to update their own profile" ON public.admin_users;
CREATE POLICY "Allow authenticated user to update their own profile"
  ON public.admin_users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Seed initial admin user with cryptographically hashed password using Bcrypt (Blowfish salt factor 10)
-- Password for initial login: Admin@123
INSERT INTO public.admin_users (
  full_name,
  email,
  password_hash,
  role,
  is_active
)
VALUES (
  'Dr. Nikhil Hiralal Mahanubhav',
  'admin@kalpanadental.com',
  crypt('Admin@123', gen_salt('bf', 10)),
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;
