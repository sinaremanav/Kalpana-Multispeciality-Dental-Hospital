import express from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import {
  clinicConfig,
  doctorsData,
  servicesData,
  galleryData,
  testimonialsData,
  testimonialsStore,
  faqData,
  appointmentsStore,
  contactInquiriesStore,
} from '../data/index.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const router = express.Router();

// Zod Validation Schemas
const appointmentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  patient_name: z.string().min(2, 'Patient name must be at least 2 characters').optional(),
  phone: z.string().min(7, 'Please provide a valid contact number').optional(),
  patient_phone: z.string().min(7, 'Please provide a valid contact number').optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  patient_email: z.string().email('Invalid email address').optional().or(z.literal('')),
  date: z.string().min(4, 'Appointment date is required').optional(),
  appointment_date: z.string().min(4, 'Appointment date is required').optional(),
  time: z.string().optional(),
  appointment_time: z.string().optional(),
  treatment: z.string().min(2, 'Treatment selection is required').optional(),
  service_name: z.string().min(2, 'Treatment selection is required').optional(),
  doctor: z.string().optional(),
  doctor_name: z.string().optional(),
  message: z.string().optional(),
}).refine((data) => Boolean(data.fullName || data.patient_name), {
  message: 'Patient name is required.',
  path: ['fullName'],
}).refine((data) => Boolean(data.phone || data.patient_phone), {
  message: 'Valid phone number is required.',
  path: ['phone'],
}).refine((data) => Boolean(data.date || data.appointment_date), {
  message: 'Appointment date is required.',
  path: ['date'],
});

const testimonialSchema = z.object({
  patient_name: z.string().min(2, 'Patient name must be at least 2 characters').optional(),
  name: z.string().min(2, 'Patient name must be at least 2 characters').optional(),
  rating: z.coerce.number().min(1).max(5).default(5),
  treatment: z.string().optional(),
  location: z.string().optional(),
  message: z.string().min(5, 'Review message must be at least 5 characters').optional(),
  review: z.string().min(5, 'Review message must be at least 5 characters').optional(),
  comment: z.string().min(5, 'Review message must be at least 5 characters').optional(),
  image_url: z.string().optional(),
  avatar: z.string().optional(),
  is_published: z.boolean().optional(),
}).refine((data) => Boolean(data.patient_name || data.name), {
  message: 'Patient name is required.',
  path: ['patient_name'],
}).refine((data) => Boolean(data.message || data.review || data.comment), {
  message: 'Review message is required.',
  path: ['message'],
});

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(7, 'Please provide a valid phone number'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

// Helper to convert time like "10:30 AM" or "10:00" to valid Postgres TIME "HH:MM:SS"
function formatToPostgresTime(timeStr) {
  if (!timeStr) return '10:00:00';
  const match = timeStr.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return '10:00:00';
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3] ? match[3].toUpperCase() : null;

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${minutes}:00`;
}

// Health check and telemetry metrics endpoint
router.get('/health', (req, res) => {
  const memory = process.memoryUsage();
  res.status(200).json({
    status: 'online',
    service: 'Kalpana Dental Clinic API',
    database: isSupabaseConfigured ? 'supabase_connected' : 'in_memory_fallback',
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsage: {
      heapUsedMB: Math.round(memory.heapUsed / 1024 / 1024),
      rssMB: Math.round(memory.rss / 1024 / 1024),
    },
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/clinic
router.get('/clinic', async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const normalized = {
          ...clinicConfig,
          id: data.id,
          clinicName: data.clinic_name || clinicConfig.clinicName,
          clinic_name: data.clinic_name || clinicConfig.clinicName,
          tagline: data.tagline !== undefined ? data.tagline : clinicConfig.tagline,
          subTagline: data.sub_tagline || clinicConfig.subTagline,
          sub_tagline: data.sub_tagline || clinicConfig.subTagline,
          phone: data.phone || clinicConfig.phone,
          displayPhone: data.display_phone || data.phone || clinicConfig.displayPhone,
          display_phone: data.display_phone || data.phone || clinicConfig.displayPhone,
          whatsappNumber: data.whatsapp_number || clinicConfig.whatsappNumber,
          whatsapp_number: data.whatsapp_number || clinicConfig.whatsappNumber,
          email: data.email || clinicConfig.email,
          address: data.address || clinicConfig.address,
          landmark: data.landmark || clinicConfig.landmark,
          workingHours: data.opening_hours || clinicConfig.workingHours,
          opening_hours: data.opening_hours || clinicConfig.workingHours,
          socials: {
            facebook: data.facebook_url || clinicConfig.socials?.facebook || 'https://facebook.com',
            instagram: data.instagram_url || clinicConfig.socials?.instagram || 'https://instagram.com',
            youtube: data.youtube_url || clinicConfig.socials?.youtube || 'https://youtube.com',
            linkedin: data.linkedin_url || clinicConfig.socials?.linkedin || 'https://linkedin.com',
          },
          googleMapsUrl: data.google_maps_url || clinicConfig.googleMapsUrl,
          googleMapsEmbed: data.google_maps_embed || clinicConfig.googleMapsEmbed,
          aboutText: data.about_text || '',
          logoUrl: data.logo_url || null,
          stats: data.stats || clinicConfig.stats,
        };
        return res.status(200).json({ success: true, data: normalized, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase clinic fetch failed, using fallback:', err.message);
    }
  }
  return res.status(200).json({ success: true, data: clinicConfig, source: 'local' });
});

// PUT /api/clinic - Update clinic settings
router.put('/clinic', async (req, res, next) => {
  try {
    const data = req.body || {};

    const payload = {
      clinic_name: data.clinicName || data.clinic_name || clinicConfig.clinicName,
      tagline: data.tagline !== undefined ? data.tagline : clinicConfig.tagline,
      sub_tagline: data.subTagline || data.sub_tagline || clinicConfig.subTagline,
      phone: data.phone || clinicConfig.phone,
      display_phone: data.displayPhone || data.display_phone || clinicConfig.displayPhone,
      email: data.email || clinicConfig.email,
      address: data.address || clinicConfig.address,
      landmark: data.landmark || clinicConfig.landmark,
      opening_hours: data.workingHours || data.opening_hours || clinicConfig.workingHours,
      whatsapp_number: data.whatsappNumber || data.whatsapp_number || clinicConfig.whatsappNumber,
      google_maps_url: data.googleMapsUrl || data.google_maps_url || clinicConfig.googleMapsUrl,
      google_maps_embed: data.googleMapsEmbed || data.google_maps_embed || clinicConfig.googleMapsEmbed,
      instagram_url: data.socials?.instagram || data.instagram_url || clinicConfig.socials?.instagram,
      facebook_url: data.socials?.facebook || data.facebook_url || clinicConfig.socials?.facebook,
      youtube_url: data.socials?.youtube || data.youtube_url || clinicConfig.socials?.youtube,
      linkedin_url: data.socials?.linkedin || data.linkedin_url || clinicConfig.socials?.linkedin,
      about_text: data.aboutText || data.about_text || '',
      logo_url: data.logoUrl || data.logo_url || null,
      stats: data.stats || clinicConfig.stats,
      updated_at: new Date().toISOString(),
    };

    // Update in-memory clinicConfig so subsequent GET /api/clinic returns the updated settings immediately
    Object.assign(clinicConfig, {
      clinicName: payload.clinic_name,
      tagline: payload.tagline,
      subTagline: payload.sub_tagline,
      phone: payload.phone,
      displayPhone: payload.display_phone,
      whatsappNumber: payload.whatsapp_number,
      email: payload.email,
      address: payload.address,
      landmark: payload.landmark,
      workingHours: payload.opening_hours,
      socials: {
        facebook: payload.facebook_url,
        instagram: payload.instagram_url,
        youtube: payload.youtube_url,
        linkedin: payload.linkedin_url,
      },
      googleMapsUrl: payload.google_maps_url,
      googleMapsEmbed: payload.google_maps_embed,
      aboutText: payload.about_text,
      logoUrl: payload.logo_url,
      stats: payload.stats,
    });

    // If Supabase is configured, attempt to update clinic_settings
    let savedToSupabase = false;
    if (isSupabaseConfigured) {
      try {
        // Authenticate backend session as admin to satisfy Row Level Security (RLS)
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          await supabase.auth.signInWithPassword({
            email: 'admin@kalpanadental.com',
            password: process.env.ADMIN_SEED_PASSWORD || 'Admin@123',
          });
        }

        const { data: existing } = await supabase
          .from('clinic_settings')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (existing?.id) {
          const { data: updatedRows, error: updateErr } = await supabase
            .from('clinic_settings')
            .update(payload)
            .eq('id', existing.id)
            .select();
          if (!updateErr && updatedRows && updatedRows.length > 0) {
            savedToSupabase = true;
          } else if (updateErr) {
            console.warn('⚠️ Supabase clinic_settings update note:', updateErr.message);
          }
        } else {
          const { data: insertedRows, error: insertErr } = await supabase
            .from('clinic_settings')
            .insert([payload])
            .select();
          if (!insertErr && insertedRows && insertedRows.length > 0) {
            savedToSupabase = true;
          } else if (insertErr) {
            console.warn('⚠️ Supabase clinic_settings insert note:', insertErr.message);
          }
        }
      } catch (sbErr) {
        console.warn('⚠️ Supabase clinic_settings exception:', sbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Clinic settings updated successfully.',
      data: clinicConfig,
      storage: savedToSupabase ? 'supabase' : 'server_store',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/services
router.get('/services', async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase services fetch failed, using fallback:', err.message);
    }
  }
  return res.status(200).json({ success: true, data: servicesData, source: 'local' });
});

// GET /api/doctors
router.get('/doctors', async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase doctors fetch failed, using fallback:', err.message);
    }
  }
  return res.status(200).json({ success: true, data: doctorsData, source: 'local' });
});

// GET /api/gallery
router.get('/gallery', async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase gallery fetch failed, using fallback:', err.message);
    }
  }
  return res.status(200).json({ success: true, data: galleryData, source: 'local' });
});

// GET /api/testimonials
router.get('/testimonials', async (req, res) => {
  const onlyPublished = req.query.all !== 'true';
  let list = [];

  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (onlyPublished) {
        query = query.or('is_published.eq.true,is_approved.eq.true');
      }
      const { data, error } = await query;

      if (!error && Array.isArray(data)) {
        list = [...data];
      }
    } catch (err) {
      console.warn('⚠️ Supabase testimonials fetch failed, using fallback:', err.message);
    }
  }

  // Seamlessly merge with testimonialsStore so newly added/moderated reviews reflect immediately
  const memoryList = onlyPublished
    ? testimonialsStore.filter((t) => t.is_published !== false)
    : testimonialsStore;

  const existingIds = new Set(list.map((t) => String(t.id)));
  for (const item of memoryList) {
    if (!existingIds.has(String(item.id))) {
      list.unshift(item);
    } else {
      // Sync published status from memory store if updated
      const found = list.find((t) => String(t.id) === String(item.id));
      if (found && item.is_published !== undefined) {
        found.is_published = item.is_published;
      }
    }
  }

  if (list.length === 0) {
    list = memoryList;
  }

  // Filter once more if onlyPublished
  const finalList = onlyPublished
    ? list.filter((t) => t.is_published !== false)
    : list;

  return res.status(200).json({ success: true, data: finalList, source: 'active_store' });
});

// POST /api/testimonials - Patient submits a new review
router.post('/testimonials', async (req, res, next) => {
  try {
    const validated = testimonialSchema.parse(req.body);
    const patientName = validated.patient_name || validated.name;
    const rating = Math.min(5, Math.max(1, Number(validated.rating) || 5));
    const treatment = validated.treatment || 'General Consultation';
    const location = validated.location || 'Kopargaon';
    const message = validated.message || validated.review || validated.comment;
    const imageUrl =
      validated.image_url ||
      validated.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName || 'Patient')}&background=059669&color=fff&bold=true`;
    // Default to unpublished (pending admin moderation) unless explicitly set by admin
    const isPublished =
      validated.is_published !== undefined ? Boolean(validated.is_published) : false;

    const newTestimonial = {
      id: crypto.randomUUID(),
      patient_name: patientName.trim(),
    name: patientName.trim(),
    rating,
    treatment: treatment.trim(),
    location: location.trim(),
    message: message.trim(),
    comment: message.trim(),
    review: message.trim(),
    image_url: imageUrl,
    avatar: imageUrl,
    is_published: isPublished,
    is_approved: isPublished,
    created_at: new Date().toISOString(),
  };

  // Add to in-memory store
  testimonialsStore.unshift(newTestimonial);

  // If Supabase is configured, persist to database
  let savedToDb = false;
  if (isSupabaseConfigured) {
    try {
      const payload = {
        id: newTestimonial.id,
        patient_name: newTestimonial.patient_name,
        rating: newTestimonial.rating,
        treatment: newTestimonial.treatment,
        location: newTestimonial.location,
        message: newTestimonial.message,
        image_url: newTestimonial.image_url,
        is_published: newTestimonial.is_published,
        created_at: newTestimonial.created_at,
      };

      const { data, error } = await supabase.from('testimonials').insert([payload]).select().single();
      if (!error && data) {
        savedToDb = true;
      } else if (error) {
        console.warn('⚠️ Supabase testimonial insert warning:', error.message);
      }
    } catch (err) {
      console.warn('⚠️ Supabase testimonial insert exception:', err.message);
    }
  }

  return res.status(201).json({
    success: true,
    message: 'Thank you! Your review has been submitted successfully.',
    data: newTestimonial,
    storage: savedToDb ? 'supabase' : 'local_store',
  });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/testimonials/:id - Admin deletes a review
router.delete('/testimonials/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Testimonial ID is required.' });
  }

  // Remove from in-memory store
  const index = testimonialsStore.findIndex(
    (t) => String(t.id) === String(id) || t.id === Number(id)
  );
  if (index !== -1) {
    testimonialsStore.splice(index, 1);
  }

  // Remove from Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        console.warn('⚠️ Supabase delete testimonial warning:', error.message);
      }
    } catch (err) {
      console.warn('⚠️ Supabase delete testimonial exception:', err.message);
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Review deleted successfully.',
    id,
  });
});

// PATCH /api/testimonials/:id/publish - Admin toggle publish
router.patch('/testimonials/:id/publish', async (req, res) => {
  const { id } = req.params;
  const { is_published } = req.body || {};

  const item = testimonialsStore.find(
    (t) => String(t.id) === String(id) || t.id === Number(id)
  );
  if (item) {
    item.is_published = Boolean(is_published);
    item.updated_at = new Date().toISOString();
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('testimonials')
        .update({ is_published: Boolean(is_published), updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.warn('⚠️ Supabase update testimonial publish exception:', err.message);
    }
  }

  return res.status(200).json({
    success: true,
    message: 'Publish status updated.',
    data: item,
  });
});

// GET /api/faq
router.get('/faq', (req, res) => {
  res.status(200).json({ success: true, data: faqData, source: 'local' });
});

// GET /api/appointments
router.get('/appointments', async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return res.status(200).json({ success: true, data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase get appointments failed:', err.message);
    }
  }
  return res.status(200).json({ success: true, data: appointmentsStore, source: 'memory' });
});

// POST /api/appointments
router.post('/appointments', async (req, res, next) => {
  try {
    const validated = appointmentSchema.parse(req.body);
    const patientName = validated.fullName || validated.patient_name;
    const patientPhone = validated.phone || validated.patient_phone;
    const patientEmail = validated.email || validated.patient_email || '';
    const appointmentDate = validated.date || validated.appointment_date;
    const appointmentTime = validated.time || validated.appointment_time || '10:00 AM';
    const serviceName = validated.treatment || validated.service_name || 'General Dental Consultation';
    const doctorName = validated.doctor || validated.doctor_name || clinicConfig.doctorName;
    const message = validated.message || '';

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const toValidUUID = (val) => (typeof val === 'string' && UUID_REGEX.test(val.trim()) ? val.trim() : null);

  const appointmentId = toValidUUID(req.body?.id) || crypto.randomUUID();

  const newAppointment = {
    id: appointmentId,
    patient_name: patientName,
    patient_phone: patientPhone,
    patient_email: patientEmail,
    appointment_date: appointmentDate,
    appointment_time: formatToPostgresTime(appointmentTime),
    time_display: appointmentTime,
    service_name: serviceName,
    doctor_name: doctorName,
    message,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  // Always keep in-memory record
  appointmentsStore.unshift(newAppointment);

  // If Supabase is configured, persist directly to PostgreSQL appointments table
  let supabaseRecord = null;
  if (isSupabaseConfigured) {
    try {
      const appointmentPayload = {
        id: appointmentId,
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_email: patientEmail || null,
        service_id: toValidUUID(req.body?.service_id),
        doctor_id: toValidUUID(req.body?.doctor_id),
        appointment_date: appointmentDate,
        appointment_time: formatToPostgresTime(appointmentTime),
        time_display: appointmentTime,
        service_name: serviceName,
        doctor_name: doctorName,
        message,
        status: 'pending',
      };

      const { error } = await supabase
        .from('appointments')
        .insert([appointmentPayload]);

      if (error) {
        console.warn('⚠️ Failed to save appointment in Supabase:', error.message);
      } else {
        supabaseRecord = { ...appointmentPayload, created_at: new Date().toISOString() };
      }
    } catch (err) {
      console.error('⚠️ Supabase appointment insert exception:', err.message);
    }
  }

  // Format optional WhatsApp message URL
  const whatsappText = `Hello Doctor,

I would like to book an appointment.

Name: ${patientName}
Phone: ${patientPhone}
Email: ${patientEmail || 'N/A'}
Preferred Date: ${appointmentDate}
Preferred Time: ${appointmentTime}
Treatment: ${serviceName}
Preferred Doctor: ${doctorName}

Additional Message:
${message || 'None'}

Thank you.`;

  const cleanPhone = String(clinicConfig.whatsappNumber || '917447226136').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(whatsappText)}`;

  return res.status(201).json({
    success: true,
    message: 'Appointment request received successfully and saved to clinic database!',
    appointment: supabaseRecord || newAppointment,
    whatsappUrl,
  });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/appointments/:id/status
router.patch('/appointments/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  const apt = appointmentsStore.find((a) => a.id === id);
  if (apt) {
    apt.status = status;
    apt.updated_at = new Date().toISOString();
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.warn('⚠️ Supabase update appointment status warning:', err.message);
    }
  }

  return res.status(200).json({ success: true, message: 'Status updated.', data: apt });
});

// DELETE /api/appointments/:id
router.delete('/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const index = appointmentsStore.findIndex((a) => a.id === id);
  if (index !== -1) {
    appointmentsStore.splice(index, 1);
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from('appointments').delete().eq('id', id);
    } catch (err) {
      console.warn('⚠️ Supabase delete appointment warning:', err.message);
    }
  }

  return res.status(200).json({ success: true, message: 'Appointment deleted.' });
});

// GET /api/contact
router.get('/contact', async (req, res) => {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return res.status(200).json({ success: true, data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase get contact messages failed:', err.message);
    }
  }
  return res.status(200).json({ success: true, data: contactInquiriesStore, source: 'memory' });
});

// POST /api/contact
router.post('/contact', async (req, res, next) => {
  try {
    const validated = contactSchema.parse(req.body);
    const { name, phone, email, subject, message } = validated;

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const toValidUUID = (val) => (typeof val === 'string' && UUID_REGEX.test(val.trim()) ? val.trim() : null);

  const contactId = toValidUUID(req.body?.id) || crypto.randomUUID();

  const newInquiry = {
    id: contactId,
    name,
    phone,
    email: email || '',
    subject: subject || 'General Inquiry',
    message,
    createdAt: new Date().toISOString(),
    status: 'unread',
  };

  // Always keep in-memory record
  contactInquiriesStore.unshift(newInquiry);

  // If Supabase is configured, persist directly to PostgreSQL contact_messages table
  let supabaseRecord = null;
  if (isSupabaseConfigured) {
    try {
      const contactPayload = {
        id: contactId,
        name,
        phone,
        email: email || null,
        subject: subject || 'General Inquiry',
        message,
        status: 'unread',
      };

      const { error } = await supabase
        .from('contact_messages')
        .insert([contactPayload]);

      if (error) {
        console.warn('⚠️ Failed to save contact inquiry in Supabase:', error.message);
      } else {
        supabaseRecord = { ...contactPayload, created_at: new Date().toISOString() };
      }
    } catch (err) {
      console.error('⚠️ Supabase contact inquiry insert exception:', err.message);
    }
  }

  const whatsappText = `Hello Doctor,

I have a query from your website contact page.

Name: ${name}
Phone: ${phone}
Email: ${email || 'N/A'}
Subject: ${subject || 'General Inquiry'}
Message: ${message}`;

  const cleanPhone = String(clinicConfig.whatsappNumber || '917447226136').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(whatsappText)}`;

  return res.status(201).json({
    success: true,
    message: 'Contact inquiry recorded successfully and saved to clinic database!',
    inquiry: supabaseRecord || newInquiry,
    whatsappUrl,
  });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/contact/:id/status
router.patch('/contact/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required.' });
  }

  const item = contactInquiriesStore.find((c) => c.id === id);
  if (item) {
    item.status = status;
    item.updated_at = new Date().toISOString();
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.warn('⚠️ Supabase update contact status warning:', err.message);
    }
  }

  return res.status(200).json({ success: true, message: 'Status updated.', data: item });
});

// DELETE /api/contact/:id
router.delete('/contact/:id', async (req, res) => {
  const { id } = req.params;
  const index = contactInquiriesStore.findIndex((c) => c.id === id);
  if (index !== -1) {
    contactInquiriesStore.splice(index, 1);
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from('contact_messages').delete().eq('id', id);
    } catch (err) {
      console.warn('⚠️ Supabase delete contact message warning:', err.message);
    }
  }

  return res.status(200).json({ success: true, message: 'Message deleted.' });
});

export default router;
