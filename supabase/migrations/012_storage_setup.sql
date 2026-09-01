-- 012_storage_setup.sql
-- Create and configure Supabase Storage bucket: clinic-images
-- (You can run this in the Supabase SQL Editor or create the bucket 'clinic-images' in Supabase Dashboard > Storage)

-- 1. Create the bucket if not already existing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'clinic-images',
  'clinic-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage RLS Policies for clinic-images bucket
-- Allow public to view any image in clinic-images bucket
CREATE POLICY "Public Read Access on clinic-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clinic-images');

-- Allow authenticated admins and doctors to upload images
CREATE POLICY "Authenticated Users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'clinic-images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to update images
CREATE POLICY "Authenticated Users can update images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'clinic-images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated admins and doctors to delete images
CREATE POLICY "Authenticated Users can delete images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'clinic-images' AND
    auth.role() = 'authenticated'
  );
