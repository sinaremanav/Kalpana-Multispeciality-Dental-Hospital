-- ==============================================================================
-- KALPANA DENTAL CLINIC — ALL-IN-ONE COMPLETE SUPABASE SQL SCRIPT
-- Execute this single script in Supabase Dashboard -> SQL Editor -> Run
-- Project: https://wbcifzwxlboepvjumori.supabase.co
-- ==============================================================================

-- 1. Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'doctor' CHECK (role IN ('admin', 'doctor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'doctor')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience TEXT,
  bio TEXT,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON public.doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_is_active ON public.doctors(is_active);

DROP TRIGGER IF EXISTS set_doctors_updated_at ON public.doctors;
CREATE TRIGGER set_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2),
  price_display TEXT,
  image_url TEXT,
  icon TEXT DEFAULT 'Activity',
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON public.services(is_active);

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_email TEXT,
  patient_phone TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  doctor_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  time_display TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON public.appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

DROP TRIGGER IF EXISTS set_appointments_updated_at ON public.appointments;
CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  subject TEXT DEFAULT 'General Inquiry',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  treatment TEXT,
  location TEXT,
  message TEXT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON public.testimonials(rating);

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Clinic',
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_gallery_published ON public.gallery(is_published);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);

DROP TRIGGER IF EXISTS set_gallery_updated_at ON public.gallery;
CREATE TRIGGER set_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  location TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'Camp',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(is_published);

DROP TRIGGER IF EXISTS set_events_updated_at ON public.events;
CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. Clinic Settings Table
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

DROP TRIGGER IF EXISTS set_clinic_settings_updated_at ON public.clinic_settings;
CREATE TRIGGER set_clinic_settings_updated_at
  BEFORE UPDATE ON public.clinic_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- RLS HELPER FUNCTIONS & POLICIES
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_doctor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'doctor'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- Clean old policies if re-running
DO $$
BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
  -- Doctors
  DROP POLICY IF EXISTS "Public can view active doctors" ON public.doctors;
  DROP POLICY IF EXISTS "Doctors can update own doctor record" ON public.doctors;
  DROP POLICY IF EXISTS "Admins can insert doctors" ON public.doctors;
  DROP POLICY IF EXISTS "Admins can delete doctors" ON public.doctors;
  -- Services
  DROP POLICY IF EXISTS "Public can view active services" ON public.services;
  DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
  DROP POLICY IF EXISTS "Admins can update services" ON public.services;
  DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
  -- Appointments
  DROP POLICY IF EXISTS "Public can submit appointment" ON public.appointments;
  DROP POLICY IF EXISTS "Admins and assigned doctors can view appointments" ON public.appointments;
  DROP POLICY IF EXISTS "Admins and assigned doctors can update appointments" ON public.appointments;
  DROP POLICY IF EXISTS "Admins can delete appointments" ON public.appointments;
  -- Contact Messages
  DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
  DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;
  DROP POLICY IF EXISTS "Only admins can update contact messages" ON public.contact_messages;
  DROP POLICY IF EXISTS "Only admins can delete contact messages" ON public.contact_messages;
  -- Testimonials
  DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
  DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
  DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
  DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
  -- Gallery
  DROP POLICY IF EXISTS "Public can view published gallery" ON public.gallery;
  DROP POLICY IF EXISTS "Admins can insert gallery" ON public.gallery;
  DROP POLICY IF EXISTS "Admins can update gallery" ON public.gallery;
  DROP POLICY IF EXISTS "Admins can delete gallery" ON public.gallery;
  -- Events
  DROP POLICY IF EXISTS "Public can view published events" ON public.events;
  DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
  DROP POLICY IF EXISTS "Admins can update events" ON public.events;
  DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
  -- Clinic Settings
  DROP POLICY IF EXISTS "Public can view clinic settings" ON public.clinic_settings;
  DROP POLICY IF EXISTS "Admins can insert clinic settings" ON public.clinic_settings;
  DROP POLICY IF EXISTS "Admins can update clinic settings" ON public.clinic_settings;
  DROP POLICY IF EXISTS "Admins can delete clinic settings" ON public.clinic_settings;
END $$;

-- 1. Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (public.is_admin() OR (auth.uid() = user_id AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())));
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

-- 2. Doctors
CREATE POLICY "Public can view active doctors" ON public.doctors FOR SELECT USING (is_active = true OR public.is_admin() OR auth.uid() = user_id);
CREATE POLICY "Doctors can update own doctor record" ON public.doctors FOR UPDATE USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can insert doctors" ON public.doctors FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete doctors" ON public.doctors FOR DELETE USING (public.is_admin());

-- 3. Services
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE USING (public.is_admin());

-- 4. Appointments
CREATE POLICY "Public can submit appointment" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins and assigned doctors can view appointments" ON public.appointments FOR SELECT USING (public.is_admin() OR (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())));
CREATE POLICY "Admins and assigned doctors can update appointments" ON public.appointments FOR UPDATE USING (public.is_admin() OR (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()))) WITH CHECK (public.is_admin() OR (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid())));
CREATE POLICY "Admins can delete appointments" ON public.appointments FOR DELETE USING (public.is_admin());

-- 5. Contact Messages
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view contact messages" ON public.contact_messages FOR SELECT USING (public.is_admin());
CREATE POLICY "Only admins can update contact messages" ON public.contact_messages FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can delete contact messages" ON public.contact_messages FOR DELETE USING (public.is_admin());

-- 6. Testimonials
CREATE POLICY "Public can view published testimonials" ON public.testimonials FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (public.is_admin());

-- 7. Gallery
CREATE POLICY "Public can view published gallery" ON public.gallery FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins can insert gallery" ON public.gallery FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update gallery" ON public.gallery FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete gallery" ON public.gallery FOR DELETE USING (public.is_admin());

-- 8. Events
CREATE POLICY "Public can view published events" ON public.events FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (public.is_admin());

-- 9. Clinic Settings
CREATE POLICY "Public can view clinic settings" ON public.clinic_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert clinic settings" ON public.clinic_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update clinic settings" ON public.clinic_settings FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete clinic settings" ON public.clinic_settings FOR DELETE USING (public.is_admin());

-- ==============================================================================
-- SEED INITIAL CLINIC DATA
-- ==============================================================================
-- Clinic Settings
INSERT INTO public.clinic_settings (
  clinic_name, tagline, sub_tagline, phone, display_phone, email, address, landmark,
  opening_hours, whatsapp_number, google_maps_url, google_maps_embed, instagram_url, facebook_url,
  youtube_url, linkedin_url, about_text, logo_url, stats
)
VALUES (
  'Kalpana Multispeciality Dental Clinic',
  'Advanced & Painless Dental Care in Kopargaon',
  'Providing compassionate, modern, and personalized dental care led by Dr. Nikhil Hiralal Mahanubhav.',
  '+91 74472 26136',
  '+91 74472 26136 / +91 89995 77794',
  'contact@kalpanadental.com',
  'Gandhi Statue Near Sudesh Picture Palace, Main Road Kopargaon, Kopargaon Bet, Shirdi-423601, Maharashtra',
  'Near Sudesh Picture Palace & Gandhi Statue, Main Road Kopargaon',
  '{"weekdays": "Monday – Saturday: 9:00 AM – 8:00 PM", "sunday": "Sunday: By Prior Appointment Only"}'::jsonb,
  '917447226136',
  'https://www.google.com/maps?q=19.8808333,74.4790833',
  'https://maps.google.com/maps?q=19.8808333,74.4790833&hl=en&z=17&output=embed',
  'https://instagram.com',
  'https://facebook.com',
  'https://youtube.com',
  'https://linkedin.com',
  'Kalpana Multispeciality Dental Clinic is dedicated to providing painless, comprehensive dental treatments utilizing cutting-edge diagnostic technology and sterile clinical protocols in Kopargaon.',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=300',
  '{"experienceYears": "4+", "happyPatients": "8,000+", "proceduresDone": "15,000+", "satisfactionRate": "99.4%"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Doctors
INSERT INTO public.doctors (id, name, specialization, qualification, experience, bio, phone, email, image_url, is_active)
VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Dr. Nikhil Hiralal Mahanubhav',
  'Chief Dental Surgeon & Implantologist',
  'BDS, MDS (Oral & Maxillofacial Surgery)',
  '4+ Years Clinical Experience',
  'Specialist in painless root canal treatments, immediate dental implants, full mouth restorations, and advanced surgical procedures with precision and patient comfort.',
  '+91 74472 26136',
  'drnikhil@kalpanadental.com',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Dr. Kalpana Mahanubhav',
  'Senior Dental Consultant & Aesthetic Specialist',
  'BDS, Fellowship in Aesthetic Dentistry',
  '6+ Years Clinical Experience',
  'Dedicated to smile designing, cosmetic veneers, pediatric preventive dental therapy, and conservative tooth-preserving restorations.',
  '+91 89995 77794',
  'drkalpana@kalpanadental.com',
  'https://images.unsplash.com/photo-1594824813083-d9d63c5d6bc9?auto=format&fit=crop&q=80&w=800',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Services
INSERT INTO public.services (id, title, description, price, price_display, image_url, icon, features, is_active)
VALUES
(
  '33333333-3333-3333-3333-333333333001',
  'Root Canal Treatment (RCT)',
  'Precision single-sitting and multi-sitting painless rotary root canal therapy to relieve pain and salvage infected teeth.',
  2500.00,
  'From ₹2,500',
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600',
  'Activity',
  '["Single-visit rotary RCT", "Digital Apex Locator precision", "Rubber dam sterile isolation", "Pain-free local anesthesia"]'::jsonb,
  true
),
(
  '33333333-3333-3333-3333-333333333002',
  'Dental Implants & Prosthetics',
  'Permanent replacement for missing teeth using international titanium dental implants with natural chewing aesthetics.',
  18000.00,
  'From ₹18,000',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
  'ShieldCheck',
  '["Titanium grade implants", "Computer-guided placement", "Immediate tooth replacement options", "Lifetime durability"]'::jsonb,
  true
),
(
  '33333333-3333-3333-3333-333333333003',
  'Orthodontics & Clear Aligners',
  'Modern ceramic braces and invisible clear aligners for kids and adults to correct misaligned teeth and bite issues.',
  25000.00,
  'From ₹25,000',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
  'Sparkles',
  '["Invisible clear aligners", "Self-ligating metal braces", "Ceramic tooth-colored brackets", "Custom digital smile simulation"]'::jsonb,
  true
),
(
  '33333333-3333-3333-3333-333333333004',
  'Teeth Whitening & Smile Makeover',
  'Professional in-office laser whitening and cosmetic veneers to brighten smiles up to 8 shades in a single sitting.',
  4500.00,
  'From ₹4,500',
  'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600',
  'Smile',
  '["Laser teeth whitening", "Porcelain & composite veneers", "Enamel-safe brightening", "Long-lasting radiant results"]'::jsonb,
  true
),
(
  '33333333-3333-3333-3333-333333333005',
  'Ultrasonic Scaling & Polishing',
  'Gentle removal of plaque, stubborn tartar, and tea/coffee stains using high-frequency ultrasonic dental scaling.',
  800.00,
  'From ₹800',
  'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=600',
  'HeartHandshake',
  '["Painless ultrasonic vibrations", "Gum health restoration", "Fluoride enamel strengthening", "Stain removal & polish"]'::jsonb,
  true
),
(
  '33333333-3333-3333-3333-333333333006',
  'Pediatric Dental Care',
  'Specialized gentle dentistry for children, including preventive pit & fissure sealants, fluoride therapy, and cavity fillings.',
  1000.00,
  'From ₹1,000',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600',
  'Users',
  '["Child-friendly environment", "Preventive fluoride varnish", "Habit breaking appliances", "Gentle cavity treatment"]'::jsonb,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Testimonials
INSERT INTO public.testimonials (id, patient_name, rating, treatment, location, message, image_url, is_published)
VALUES
(
  '44444444-4444-4444-4444-444444444001',
  'Rameshwar Shinde',
  5,
  'Root Canal Treatment',
  'Kopargaon',
  'Had a completely painless root canal done by Dr. Nikhil. Very hygienic clinic and polite staff. Highly recommend for any dental emergency in Kopargaon.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  true
),
(
  '44444444-4444-4444-4444-444444444002',
  'Pooja Kulkarni',
  5,
  'Clear Aligners',
  'Shirdi',
  'Got my clear aligners from Kalpana Dental Clinic. The digital planning was transparent and results started showing within months!',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  true
),
(
  '44444444-4444-4444-4444-444444444003',
  'Sanjay Patil',
  5,
  'Dental Implants',
  'Rahata',
  'Doctor explained the procedure clearly and the dental implant placement was smooth. Eating comfortably now just like natural teeth.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Gallery
INSERT INTO public.gallery (id, title, description, image_url, category, is_published, display_order)
VALUES
(
  '55555555-5555-5555-5555-555555555001',
  'Modern Sterilized Operatory',
  'Ergonomic dental operatory chair equipped with computerized ultrasonic delivery unit.',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
  'Clinic',
  true,
  1
),
(
  '55555555-5555-5555-5555-555555555002',
  'High-Definition Digital RVG Sensor',
  'Instant low-radiation intraoral imaging for precise diagnostic root canal tracking.',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
  'Equipment',
  true,
  2
),
(
  '55555555-5555-5555-5555-555555555003',
  'Class-B Autoclave Sterilization Room',
  'Multi-tiered 100% sterile instrument packaging and hospital-grade decontamination.',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
  'Clinic',
  true,
  3
),
(
  '55555555-5555-5555-5555-555555555004',
  'Smile Transformation Result',
  'Porcelain ceramic veneer makeover for fractured anterior teeth.',
  'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
  'Smiles',
  true,
  4
),
(
  '55555555-5555-5555-5555-555555555005',
  'Rotary Endodontic System',
  'Advanced apex locator and cordless rotary micro-motor for painless single-sitting RCT.',
  'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
  'Equipment',
  true,
  5
)
ON CONFLICT (id) DO NOTHING;

-- Events
INSERT INTO public.events (id, title, description, event_date, start_time, end_time, location, image_url, category, is_published)
VALUES
(
  '66666666-6666-6666-6666-666666666001',
  'Free Dental Screening & Oral Cancer Checkup Camp',
  'Comprehensive oral checkup, tooth decay diagnosis, digital RVG screening, and free consultation for all community residents.',
  CURRENT_DATE + INTERVAL '14 days',
  '09:30:00',
  '16:00:00',
  'Kalpana Dental Clinic, Near Gandhi Statue, Main Road Kopargaon',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
  'Camp',
  true
),
(
  '66666666-6666-6666-6666-666666666002',
  'School Oral Hygiene & Healthy Smiles Awareness Workshop',
  'Interactive dental hygiene demonstration, proper brushing technique workshop, and free dental kits distribution for children.',
  CURRENT_DATE + INTERVAL '28 days',
  '10:00:00',
  '13:30:00',
  'Kopargaon High School Auditorium, Kopargaon',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
  'Workshop',
  true
),
(
  '66666666-6666-6666-6666-666666666003',
  'Senior Citizens Geriatric Denture Camp',
  'Specialized screening camp for complete and partial dentures, soft-tissue oral health assessment, and denture relining.',
  CURRENT_DATE - INTERVAL '20 days',
  '10:00:00',
  '15:00:00',
  'Community Hall, Shirdi Road, Kopargaon',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
  'Camp',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- STORAGE SETUP (Run in SQL Editor or setup in Dashboard -> Storage)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'clinic-images',
  'clinic-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Public Read Access on clinic-images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated Users can upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated Users can update images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated Users can delete images" ON storage.objects;
END $$;

CREATE POLICY "Public Read Access on clinic-images" ON storage.objects FOR SELECT USING (bucket_id = 'clinic-images');
CREATE POLICY "Authenticated Users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'clinic-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Users can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'clinic-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated Users can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'clinic-images' AND auth.role() = 'authenticated');

-- ==============================================================================
-- 13. ADMIN & STAFF USERS WITH BCRYPT HASHED PASSWORD STORAGE
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role has full access to admin_users" ON public.admin_users;
CREATE POLICY "Service role has full access to admin_users"
  ON public.admin_users FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon reading for login verification" ON public.admin_users;
CREATE POLICY "Allow anon reading for login verification"
  ON public.admin_users FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow anon inserting new admin_users" ON public.admin_users;
CREATE POLICY "Allow anon inserting new admin_users"
  ON public.admin_users FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Seed initial admin user with cryptographically hashed password using Bcrypt (Blowfish salt factor 10)
-- Default Password: Admin@123
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

