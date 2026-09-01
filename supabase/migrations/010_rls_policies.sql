-- 010_rls_policies.sql
-- Enable Row Level Security (RLS) across all application tables and set up strict access policies

-- 1. Helper function to check if current user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Helper function to check if current user is a Doctor
CREATE OR REPLACE FUNCTION public.is_doctor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'doctor'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ENABLE RLS ON ALL TABLES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 1. PROFILES POLICIES
-- ==============================================================================
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Users can update their own profile (cannot change role unless admin)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (
    public.is_admin() OR (
      auth.uid() = user_id AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Admins can insert/delete profiles
CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 2. DOCTORS POLICIES
-- ==============================================================================
-- Public can view active doctors; Admins and Doctors can view all
CREATE POLICY "Public can view active doctors"
  ON public.doctors FOR SELECT
  USING (is_active = true OR public.is_admin() OR auth.uid() = user_id);

-- Doctors can update only their own profile
CREATE POLICY "Doctors can update own doctor record"
  ON public.doctors FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Admins can insert/delete doctors
CREATE POLICY "Admins can insert doctors"
  ON public.doctors FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete doctors"
  ON public.doctors FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 3. SERVICES POLICIES
-- ==============================================================================
-- Public can view active services; Admins can view all
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT
  USING (is_active = true OR public.is_admin());

-- Admin full management on services
CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 4. APPOINTMENTS POLICIES
-- ==============================================================================
-- Anyone (public patients) can create an appointment request
CREATE POLICY "Public can submit appointment"
  ON public.appointments FOR INSERT
  WITH CHECK (true);

-- Admins can view all appointments; Doctors can view appointments assigned to them
CREATE POLICY "Admins and assigned doctors can view appointments"
  ON public.appointments FOR SELECT
  USING (
    public.is_admin() OR 
    (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()))
  );

-- Admins and assigned doctors can update appointment status
CREATE POLICY "Admins and assigned doctors can update appointments"
  ON public.appointments FOR UPDATE
  USING (
    public.is_admin() OR 
    (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()))
  )
  WITH CHECK (
    public.is_admin() OR 
    (doctor_id IN (SELECT id FROM public.doctors WHERE user_id = auth.uid()))
  );

-- Admins can delete appointments
CREATE POLICY "Admins can delete appointments"
  ON public.appointments FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 5. CONTACT MESSAGES POLICIES
-- ==============================================================================
-- Public can submit contact messages
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Only Admins can view contact messages
CREATE POLICY "Only admins can view contact messages"
  ON public.contact_messages FOR SELECT
  USING (public.is_admin());

-- Only Admins can update contact messages status
CREATE POLICY "Only admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only Admins can delete contact messages
CREATE POLICY "Only admins can delete contact messages"
  ON public.contact_messages FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 6. TESTIMONIALS POLICIES
-- ==============================================================================
-- Public can view published testimonials; Admins can view all
CREATE POLICY "Public can view published testimonials"
  ON public.testimonials FOR SELECT
  USING (is_published = true OR public.is_admin());

-- Admins can manage testimonials
CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 7. GALLERY POLICIES
-- ==============================================================================
-- Public can view published gallery items; Admins can view all
CREATE POLICY "Public can view published gallery"
  ON public.gallery FOR SELECT
  USING (is_published = true OR public.is_admin());

-- Admins can manage gallery
CREATE POLICY "Admins can insert gallery"
  ON public.gallery FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update gallery"
  ON public.gallery FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete gallery"
  ON public.gallery FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 8. EVENTS POLICIES
-- ==============================================================================
-- Public can view published events; Admins can view all
CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (is_published = true OR public.is_admin());

-- Admins can manage events
CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 9. CLINIC SETTINGS POLICIES
-- ==============================================================================
-- Everyone can read clinic settings
CREATE POLICY "Public can view clinic settings"
  ON public.clinic_settings FOR SELECT
  USING (true);

-- Only Admins can modify clinic settings
CREATE POLICY "Admins can insert clinic settings"
  ON public.clinic_settings FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update clinic settings"
  ON public.clinic_settings FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete clinic settings"
  ON public.clinic_settings FOR DELETE
  USING (public.is_admin());
