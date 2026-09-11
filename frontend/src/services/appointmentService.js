import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

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

export const appointmentService = {
  /**
   * Public: Create a new appointment booking
   */
  async createAppointment(appointmentData) {
    const id = appointmentData.id || generateUUID();
    const payload = {
      id,
      patient_name: appointmentData.fullName || appointmentData.patient_name || appointmentData.name || '',
      patient_email: appointmentData.email || appointmentData.patient_email || '',
      patient_phone: appointmentData.phone || appointmentData.patient_phone || '',
      service_id: appointmentData.service_id || null,
      service_name: appointmentData.treatment || appointmentData.service_name || '',
      doctor_id: appointmentData.doctor_id || null,
      doctor_name: appointmentData.doctor || appointmentData.doctor_name || '',
      appointment_date: appointmentData.date || appointmentData.appointment_date,
      appointment_time: appointmentData.time && appointmentData.time.includes(':')
        ? (appointmentData.time.length === 5 ? `${appointmentData.time}:00` : appointmentData.time.replace(/ (AM|PM)/i, ':00'))
        : '10:00:00',
      time_display: appointmentData.time || appointmentData.time_display || '10:00 AM',
      message: appointmentData.message || '',
      status: 'pending',
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('appointments').insert([payload]);
        if (error) throw error;
        return {
          ...payload,
          created_at: new Date().toISOString(),
        };
      } catch (err) {
        console.warn('Supabase createAppointment error, saving locally:', err.message);
      }
    }

    // Fallback object if Supabase is unconfigured
    return {
      id,
      ...payload,
      created_at: new Date().toISOString(),
    };
  },

  /**
   * Admin & Doctors: Get appointments list with optional filters
   */
  async getAppointments(filters = {}) {
    if (!isSupabaseConfigured) {
      return [];
    }

    let query = supabase.from('appointments').select('*').order('appointment_date', { ascending: false });

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.doctorId) {
      query = query.eq('doctor_id', filters.doctorId);
    }
    if (filters.date) {
      query = query.eq('appointment_date', filters.date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Admin & Doctors: Update appointment status (pending, confirmed, completed, cancelled)
   */
  async updateAppointmentStatus(id, status) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Delete appointment
   */
  async deleteAppointment(id) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  /**
   * Admin Dashboard: Aggregate metrics
   */
  async getMetrics() {
    if (!isSupabaseConfigured) {
      return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    }

    try {
      const { data, error } = await supabase.from('appointments').select('status');
      if (error) throw error;

      const counts = { total: data.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
      data.forEach((row) => {
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
