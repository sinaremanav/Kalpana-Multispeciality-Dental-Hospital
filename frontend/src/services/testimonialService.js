import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { testimonialsData as fallbackTestimonials } from '../data/testimonials';

export const testimonialService = {
  /**
   * Get testimonials (optionally published only)
   */
  async getTestimonials(onlyPublished = true) {
    if (!isSupabaseConfigured) {
      return fallbackTestimonials;
    }

    try {
      let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (onlyPublished) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        return fallbackTestimonials;
      }
      return data.map((t) => ({
        ...t,
        name: t.patient_name || t.name,
        review: t.message || t.review,
        avatar: t.image_url || t.avatar,
      }));
    } catch (err) {
      console.warn('Supabase getTestimonials error, using fallback:', err.message);
      return fallbackTestimonials;
    }
  },

  /**
   * Admin: Create testimonial
   */
  async createTestimonial(data) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      patient_name: data.patient_name || data.name,
      rating: Number(data.rating) || 5,
      treatment: data.treatment || '',
      location: data.location || '',
      message: data.message || data.review || '',
      image_url: data.image_url || data.avatar || '',
      is_published: data.is_published !== undefined ? data.is_published : true,
    };

    const { data: inserted, error } = await supabase.from('testimonials').insert([payload]).select().single();
    if (error) throw error;
    return inserted;
  },

  /**
   * Admin: Update testimonial
   */
  async updateTestimonial(id, data) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      patient_name: data.patient_name || data.name,
      rating: Number(data.rating),
      treatment: data.treatment,
      location: data.location,
      message: data.message || data.review,
      image_url: data.image_url || data.avatar,
      updated_at: new Date().toISOString(),
    };
    if (data.is_published !== undefined) {
      payload.is_published = data.is_published;
    }

    const { data: updated, error } = await supabase
      .from('testimonials')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  },

  /**
   * Admin: Toggle publish
   */
  async toggleTestimonialPublish(id, isPublished) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('testimonials')
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Delete testimonial
   */
  async deleteTestimonial(id) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

export default testimonialService;
