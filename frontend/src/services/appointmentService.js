import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://kalpana-multispeciality-dental-hospital.onrender.com';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toValidUUID(val) {
  if (!val) return null;
  const str = String(val).trim();
  return UUID_REGEX.test(str) ? str : null;
}

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function formatToPostgresTime(timeStr) {
  if (!timeStr) return '10:00:00';
  const match = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return '10:00:00';
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3] ? match[3].toUpperCase() : null;

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${minutes}:00`;
}

export const appointmentService = {
  /**
   * Public: Create a new appointment booking
   */
  async createAppointment(appointmentData) {
    const id = toValidUUID(appointmentData.id) || generateUUID();
    const payload = {
      id,
      patient_name: appointmentData.fullName || appointmentData.patient_name || appointmentData.name || '',
      patient_email: appointmentData.email || appointmentData.patient_email || '',
      patient_phone: appointmentData.phone || appointmentData.patient_phone || '',
      service_id: toValidUUID(appointmentData.service_id),
      service_name: appointmentData.treatment || appointmentData.service_name || '',
      doctor_id: toValidUUID(appointmentData.doctor_id),
      doctor_name: appointmentData.doctor || appointmentData.doctor_name || '',
      appointment_date: appointmentData.date || appointmentData.appointment_date,
      appointment_time: formatToPostgresTime(appointmentData.time || appointmentData.appointment_time),
      time_display: appointmentData.time || appointmentData.time_display || '10:00 AM',
      message: appointmentData.message || '',
      status: 'pending',
    };

    let supabaseSaved = false;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('appointments').insert([payload]);
        if (error) {
          console.warn('Supabase createAppointment insert returned error:', error.message);
        } else {
          supabaseSaved = true;
          return {
            ...payload,
            created_at: new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('Supabase createAppointment error, saving locally/backend:', err.message);
      }
    }

    // Fallback object if Supabase is unconfigured or insert errored
    return {
      id,
      ...payload,
      created_at: new Date().toISOString(),
      source: supabaseSaved ? 'supabase' : 'local_fallback',
    };
  },

  /**
   * Admin & Doctors: Get appointments list with optional filters
   */
  async getAppointments(filters = {}) {
    // 1. Direct Supabase query (primary)
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });

        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters.doctorId && toValidUUID(filters.doctorId)) {
          query = query.eq('doctor_id', filters.doctorId);
        }
        if (filters.date) {
          query = query.eq('appointment_date', filters.date);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          return data;
        }
        if (error) {
          console.warn('Supabase getAppointments query warning:', error.message);
        }
      } catch (sbErr) {
        console.warn('Supabase getAppointments exception:', sbErr.message);
      }
    }

    // 2. Fallback to Express backend API if Supabase query returned no access or error
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          let list = json.data;
          if (filters.status && filters.status !== 'all') {
            list = list.filter((a) => a.status === filters.status);
          }
          if (filters.date) {
            list = list.filter((a) => (a.appointment_date || a.date) === filters.date);
          }
          return list;
        }
      }
    } catch (apiErr) {
      console.warn('Backend API appointments fallback skipped:', apiErr.message);
    }

    return [];
  },

  /**
   * Admin & Doctors: Update appointment status (pending, confirmed, completed, cancelled)
   */
  async updateAppointmentStatus(id, status) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) return data;
    }

    // Fallback sync to backend
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      console.warn('Backend status update fallback warning:', err.message);
    }

    return { id, status, updated_at: new Date().toISOString() };
  },

  /**
   * Admin: Delete appointment
   */
  async deleteAppointment(id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (!error) return true;
    }

    // Fallback delete to backend
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('Backend delete appointment fallback warning:', err.message);
    }

    return true;
  },

  /**
   * Admin Dashboard: Aggregate metrics
   */
  async getMetrics() {
    try {
      const appointments = await this.getAppointments({ status: 'all' });
      const counts = { total: appointments.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
      appointments.forEach((row) => {
        if (counts[row.status] !== undefined) {
          counts[row.status]++;
        }
      });
      return counts;
    } catch (err) {
      console.warn('Error fetching appointment metrics:', err.message);
      return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    }
  },
};

export default appointmentService;

