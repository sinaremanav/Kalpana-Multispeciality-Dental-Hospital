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

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Kalpana Dental Clinic API',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/clinic
router.get('/clinic', (req, res) => {
  res.status(200).json({ success: true, data: clinicConfig });
});

// GET /api/services
router.get('/services', (req, res) => {
  res.status(200).json({ success: true, data: servicesData });
});

// GET /api/doctors
router.get('/doctors', (req, res) => {
  res.status(200).json({ success: true, data: doctorsData });
});

// GET /api/gallery
router.get('/gallery', (req, res) => {
  res.status(200).json({ success: true, data: galleryData });
});

// GET /api/testimonials
router.get('/testimonials', (req, res) => {
  res.status(200).json({ success: true, data: testimonialsData });
});

// GET /api/faq
router.get('/faq', (req, res) => {
  res.status(200).json({ success: true, data: faqData });
});

// POST /api/appointments
router.post('/appointments', (req, res) => {
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

  appointmentsStore.push(newAppointment);

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
    appointment: newAppointment,
    whatsappUrl,
  });
});

// POST /api/contact
router.post('/contact', (req, res) => {
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

  contactInquiriesStore.push(newInquiry);

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
    inquiry: newInquiry,
    whatsappUrl,
  });
});

export default router;
