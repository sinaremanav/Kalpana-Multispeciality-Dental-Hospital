/**
 * API Service for connecting frontend React application with Node.js/Express Backend API.
 */

const API_BASE_URL = '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`API call to ${endpoint} failed, using local fallback if available:`, error.message);
    throw error;
  }
}

export const apiService = {
  // Health check
  checkHealth: () => fetchAPI('/health'),

  // Get clinic configuration
  getClinicInfo: () => fetchAPI('/clinic'),

  // Get clinic services
  getServices: () => fetchAPI('/services'),

  // Get doctors list
  getDoctors: () => fetchAPI('/doctors'),

  // Get gallery items
  getGallery: () => fetchAPI('/gallery'),

  // Get testimonials
  getTestimonials: () => fetchAPI('/testimonials'),

  // Get FAQs
  getFAQ: () => fetchAPI('/faq'),

  // Submit appointment request
  createAppointment: (appointmentData) =>
    fetchAPI('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),

  // Submit contact message inquiry
  sendContactMessage: (contactData) =>
    fetchAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),
};

export default apiService;
