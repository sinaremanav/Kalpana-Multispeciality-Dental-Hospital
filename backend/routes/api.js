import express from 'express';
import {
  clinicConfig,
  doctorsData,
  servicesData,
  galleryData,
  testimonialsData,
  faqData,
  appointmentsStore,
  contactInquiriesStore,
} from '../data/index.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const router = express.Router();

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

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Kalpana Dental Clinic API',
    database: isSupabaseConfigured ? 'supabase_connected' : 'in_memory_fallback',
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
        return res.status(200).json({ success: true, data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase clinic fetch failed, using fallback:', err.message);
    }
  }
  return res.status(200).json({ success: true, data: clinicConfig, source: 'local' });
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
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('⚠️ Supabase testimonials fetch failed, using fallback:', err.message);
    }
  }
  return res.status(200).json({ success: true, data: testimonialsData, source: 'local' });
});

// GET /api/faq
router.get('/faq', (req, res) => {
  res.status(200).json({ success: true, data: faqData, source: 'local' });
});

// POST /api/appointments
router.post('/appointments', async (req, res) => {
  const { fullName, phone, email, date, time, treatment, doctor, message } = req.body || {};

  if (!fullName || !phone || !date || !treatment) {
    return res.status(400).json({
      success: false,
      message: 'Missing required appointment fields (fullName, phone, date, treatment).',
    });
  }

  const newAppointment = {
    id: `APT-${Date.now()}`,
    fullName,
    phone,
    email: email || '',
    date,
    time: time || '10:00 AM',
    treatment,
    doctor: doctor || clinicConfig.doctorName,
    message: message || '',
    createdAt: new Date().toISOString(),
    status: 'PENDING_CONFIRMATION',
  };

  // Always keep in-memory record
  appointmentsStore.push(newAppointment);

  // If Supabase is configured, also persist directly to PostgreSQL appointments table
  let supabaseRecord = null;
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_name: fullName,
            patient_phone: phone,
            patient_email: email || null,
            appointment_date: date,
            appointment_time: formatToPostgresTime(time),
            time_display: time || '10:00 AM',
            service_name: treatment,
            doctor_name: doctor || clinicConfig.doctorName,
            message: message || '',
            status: 'pending',
          },
        ])
        .select()
        .maybeSingle();

      if (error) {
        console.warn('⚠️ Failed to save appointment in Supabase:', error.message);
      } else {
        supabaseRecord = data;
      }
    } catch (err) {
      console.error('⚠️ Supabase appointment insert exception:', err.message);
    }
  }

  // Format WhatsApp message payload
  const whatsappText = `Hello Doctor,

I would like to book an appointment.

Name: ${fullName}
Phone: ${phone}
Email: ${email || 'N/A'}
Preferred Date: ${date}
Preferred Time: ${time || '10:00 AM'}
Treatment: ${treatment}
Preferred Doctor: ${doctor || clinicConfig.doctorName}

Additional Message:
${message || 'None'}

Thank you.`;

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return res.status(201).json({
    success: true,
    message: 'Appointment request received successfully!',
    appointment: supabaseRecord || newAppointment,
    whatsappUrl,
  });
});

// POST /api/contact
router.post('/contact', async (req, res) => {
  const { name, phone, email, subject, message } = req.body || {};

  if (!name || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: 'Missing required contact fields (name, phone, message).',
    });
  }

  const newInquiry = {
    id: `INQ-${Date.now()}`,
    name,
    phone,
    email: email || '',
    subject: subject || 'General Inquiry',
    message,
    createdAt: new Date().toISOString(),
  };

  // Always keep in-memory record
  contactInquiriesStore.push(newInquiry);

  // If Supabase is configured, also persist directly to PostgreSQL contact_messages table
  let supabaseRecord = null;
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name,
            phone,
            email: email || null,
            subject: subject || 'General Inquiry',
            message,
            status: 'unread',
          },
        ])
        .select()
        .maybeSingle();

      if (error) {
        console.warn('⚠️ Failed to save contact inquiry in Supabase:', error.message);
      } else {
        supabaseRecord = data;
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

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return res.status(201).json({
    success: true,
    message: 'Contact inquiry recorded successfully!',
    inquiry: supabaseRecord || newInquiry,
    whatsappUrl,
  });
});

export default router;
