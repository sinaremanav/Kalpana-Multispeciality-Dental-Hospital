import express from 'express';
import crypto from 'node:crypto';
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
router.post('/testimonials', async (req, res) => {
  const patientName = req.body?.patient_name || req.body?.name;
  const rating = Math.min(5, Math.max(1, Number(req.body?.rating) || 5));
  const treatment = req.body?.treatment || 'General Consultation';
  const location = req.body?.location || 'Kopargaon';
  const message = req.body?.message || req.body?.review || req.body?.comment;
  const imageUrl =
    req.body?.image_url ||
    req.body?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName || 'Patient')}&background=059669&color=fff&bold=true`;
  // Default to unpublished (pending admin moderation) unless explicitly set by admin
  const isPublished =
    req.body?.is_published !== undefined ? Boolean(req.body.is_published) : false;

  if (!patientName || !message) {
    return res.status(400).json({
      success: false,
      message: 'Patient name and review message are required.',
    });
  }

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
router.post('/appointments', async (req, res) => {
  const patientName = req.body?.fullName || req.body?.patient_name || req.body?.name;
  const patientPhone = req.body?.phone || req.body?.patient_phone;
  const patientEmail = req.body?.email || req.body?.patient_email || '';
  const appointmentDate = req.body?.date || req.body?.appointment_date;
  const appointmentTime = req.body?.time || req.body?.appointment_time || '10:00 AM';
  const serviceName = req.body?.treatment || req.body?.service_name || req.body?.service;
  const doctorName = req.body?.doctor || req.body?.doctor_name || clinicConfig.doctorName;
  const message = req.body?.message || '';

  if (!patientName || !patientPhone || !appointmentDate || !serviceName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required appointment fields (patient name, phone, date, treatment).',
    });
  }

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

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return res.status(201).json({
    success: true,
    message: 'Appointment request received successfully and saved to clinic database!',
    appointment: supabaseRecord || newAppointment,
    whatsappUrl,
  });
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
router.post('/contact', async (req, res) => {
  const { name, phone, email, subject, message } = req.body || {};

  if (!name || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: 'Missing required contact fields (name, phone, message).',
    });
  }

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

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return res.status(201).json({
    success: true,
    message: 'Contact inquiry recorded successfully and saved to clinic database!',
    inquiry: supabaseRecord || newInquiry,
    whatsappUrl,
  });
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
