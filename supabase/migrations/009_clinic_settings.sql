-- 009_clinic_settings.sql
-- Global Clinic Configuration & Contact Settings
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name TEXT NOT NULL,
  tagline TEXT,
  sub_tagline TEXT,
  phone TEXT NOT NULL,
  display_phone TEXT,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  landmark TEXT,
  opening_hours JSONB NOT NULL DEFAULT '{"weekdays": "Monday – Saturday: 9:00 AM – 8:00 PM", "sunday": "Sunday: By Prior Appointment Only"}'::jsonb,
  whatsapp_number TEXT NOT NULL,
  google_maps_url TEXT,
  google_maps_embed TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  about_text TEXT,
  logo_url TEXT,
  stats JSONB DEFAULT '{"experienceYears": "4+", "happyPatients": "8,000+", "proceduresDone": "15,000+", "satisfactionRate": "99.4%"}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER set_clinic_settings_updated_at
  BEFORE UPDATE ON public.clinic_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
