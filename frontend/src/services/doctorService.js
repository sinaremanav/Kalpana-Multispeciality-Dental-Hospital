import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { doctorsData as fallbackDoctors } from '../data/doctors';

export const doctorService = {
  /**
   * Get all doctors (optionally only active ones for public pages)
   */
  async getDoctors(onlyActive = true) {
    if (!isSupabaseConfigured) {
      return onlyActive ? fallbackDoctors : fallbackDoctors;
    }

    try {
      let query = supabase.from('doctors').select('*').order('created_at', { ascending: true });
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        return fallbackDoctors;
      }
      return data;
    } catch (err) {
      console.warn('Supabase getDoctors error, falling back to local data:', err.message);
      return fallbackDoctors;
    }
  },

  /**
   * Get doctor by ID
   */
  async getDoctorById(id) {
    if (!isSupabaseConfigured) {
      return fallbackDoctors.find((d) => d.id === id || String(d.id) === String(id)) || null;
    }
    const { data, error } = await supabase.from('doctors').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  /**
   * Get doctor record linked to a Supabase auth user_id
   */
  async getDoctorByUserId(userId) {
    if (!isSupabaseConfigured || !userId) return null;
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching doctor by userId:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Admin: Add a new doctor
   */
  async createDoctor(doctorData) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      name: doctorData.name,
      specialization: doctorData.specialization,
      qualification: doctorData.qualification,
      experience: doctorData.experience || '',
      bio: doctorData.bio || '',
      phone: doctorData.phone || '',
      email: doctorData.email || '',
      image_url: doctorData.image_url || doctorData.image || '',
      is_active: doctorData.is_active !== undefined ? doctorData.is_active : true,
      user_id: doctorData.user_id || null,
    };

    const { data, error } = await supabase.from('doctors').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  /**
   * Admin or Doctor: Update doctor record
   */
  async updateDoctor(id, doctorData) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      name: doctorData.name,
      specialization: doctorData.specialization,
      qualification: doctorData.qualification,
      experience: doctorData.experience,
      bio: doctorData.bio,
      phone: doctorData.phone,
      email: doctorData.email,
      image_url: doctorData.image_url || doctorData.image,
      updated_at: new Date().toISOString(),
    };
    if (doctorData.is_active !== undefined) {
      payload.is_active = doctorData.is_active;
    }
    if (doctorData.user_id !== undefined) {
      payload.user_id = doctorData.user_id;
    }

    const { data, error } = await supabase
      .from('doctors')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Toggle active status
   */
  async toggleDoctorActive(id, isActive) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('doctors')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Delete doctor record
   */
  async deleteDoctor(id) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

export default doctorService;
