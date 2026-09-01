-- 011_seed_data.sql
-- Seed safe demo data matching Kalpana Dental Clinic initial catalog

-- 1. Clinic Settings Seed
INSERT INTO public.clinic_settings (
  clinic_name, tagline, sub_tagline, phone, display_phone, email, address, landmark,
  opening_hours, whatsapp_number, google_maps_url, google_maps_embed, instagram_url, facebook_url,
  youtube_url, linkedin_url, about_text, logo_url, stats
)
VALUES (
  'Kalpana Multispeciality Dental Clinic',
  'Advanced & Painless Dental Care in Kopargaon',
  'Providing compassionate, modern, and personalized dental care led by Dr. Nikhil Hiralal Mahanubhav.',
  '+91 94211 46623',
  '+91 94211 46623 / +91 89995 77794',
  'contact@kalpanadental.com',
  'Gandhi Statue Near Sudesh Picture Palace, Main Road Kopargaon, Kopargaon Bet, Shirdi-423601, Maharashtra',
  'Near Sudesh Picture Palace & Gandhi Statue, Main Road Kopargaon',
  '{"weekdays": "Monday – Saturday: 9:00 AM – 8:00 PM", "sunday": "Sunday: By Prior Appointment Only"}'::jsonb,
  '919421146623',
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

-- 2. Doctors Seed
INSERT INTO public.doctors (id, name, specialization, qualification, experience, bio, phone, email, image_url, is_active)
VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Dr. Nikhil Hiralal Mahanubhav',
  'Chief Dental Surgeon & Implantologist',
  'BDS, MDS (Oral & Maxillofacial Surgery)',
  '4+ Years Clinical Experience',
  'Specialist in painless root canal treatments, immediate dental implants, full mouth restorations, and advanced surgical procedures with precision and patient comfort.',
  '+91 94211 46623',
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

-- 3. Services Seed
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

-- 4. Testimonials Seed
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

-- 5. Gallery Seed
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

-- 6. Events Seed
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
