/**
 * Main API Service Adapter for Kalpana Dental Clinic
 * Integrates direct Supabase service clients with Express backend on Render.
 */

import { doctorService } from './doctorService';
import { serviceService } from './serviceService';
import { appointmentService } from './appointmentService';
import { eventService } from './eventService';
import { testimonialService } from './testimonialService';
import { galleryService } from './galleryService';
import { clinicService } from './clinicService';
import { contactService } from './contactService';
import { authService } from './authService';
import { storageService } from './storageService';
import { faqData } from '../data/faq';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://kalpana-multispeciality-dental-hospital.onrender.com';

export const apiService = {
  // Base URL
  baseUrl: API_BASE_URL,

  // Clinic & Global Settings
  getClinicInfo: () => clinicService.getClinicSettings(),

  // Services
  getServices: (onlyActive = true) => serviceService.getServices(onlyActive),

  // Doctors
  getDoctors: (onlyActive = true) => doctorService.getDoctors(onlyActive),

  // Gallery
  getGallery: (onlyPublished = true) => galleryService.getGallery(onlyPublished),

  // Testimonials
  getTestimonials: (onlyPublished = true) => testimonialService.getTestimonials(onlyPublished),

  // Events
  getEvents: (onlyPublished = true) => eventService.getEvents(onlyPublished),
  getCategorizedEvents: () => eventService.getCategorizedEvents(),

  // FAQs
  getFAQ: async () => ({ success: true, data: faqData }),

  // Appointments
  createAppointment: async (appointmentData) => {
    // 1. Direct Supabase database persist (instant, no cold-start delay)
    const record = await appointmentService.createAppointment(appointmentData);

    // 2. Asynchronous sync to Render Backend API if available
    fetch(`${API_BASE_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...appointmentData, id: record?.id }),
    }).catch((err) => {
      console.warn('Backend API appointment sync skipped:', err.message);
    });

    const clinic = await clinicService.getClinicSettings();
    const whatsappNumber = clinic.whatsappNumber || '917447226136';

    const whatsappText = `Hello Doctor,

I would like to book an appointment.

Name: ${appointmentData.fullName || appointmentData.patient_name}
Phone: ${appointmentData.phone || appointmentData.patient_phone}
Email: ${appointmentData.email || 'N/A'}
Preferred Date: ${appointmentData.date || appointmentData.appointment_date}
Preferred Time: ${appointmentData.time || appointmentData.time_display || '10:00 AM'}
Treatment: ${appointmentData.treatment || appointmentData.service_name}
Preferred Doctor: ${appointmentData.doctor || appointmentData.doctor_name || clinic.doctorName}

Additional Message:
${appointmentData.message || 'None'}

Thank you.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

    return {
      success: true,
      message: 'Appointment request received successfully and saved to clinic schedule!',
      appointment: record,
      whatsappUrl,
    };
  },

  // Contact Inquiries
  sendContactMessage: async (contactData) => {
    // 1. Direct Supabase database persist (instant)
    const record = await contactService.sendContactMessage(contactData);

    // 2. Asynchronous sync to Render Backend API if available
    fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...contactData, id: record?.id }),
    }).catch((err) => {
      console.warn('Backend API contact sync skipped:', err.message);
    });

    const clinic = await clinicService.getClinicSettings();
    const whatsappNumber = clinic.whatsappNumber || '917447226136';

    const whatsappText = `Hello Doctor,

I have a query from your website contact page.

Name: ${contactData.name}
Phone: ${contactData.phone}
Email: ${contactData.email || 'N/A'}
Subject: ${contactData.subject || 'General Inquiry'}
Message: ${contactData.message}`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

    return {
      success: true,
      message: 'Contact inquiry recorded successfully!',
      inquiry: record,
      whatsappUrl,
    };
  },

  // Health check
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API health check failed:', err.message);
    }
    return {
      status: 'offline_fallback',
      timestamp: new Date().toISOString(),
    };
  },
};

export {
  doctorService,
  serviceService,
  appointmentService,
  eventService,
  testimonialService,
  galleryService,
  clinicService,
  contactService,
  authService,
  storageService,
};

export default apiService;
