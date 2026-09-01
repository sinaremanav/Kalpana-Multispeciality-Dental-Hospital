import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { galleryData as fallbackGallery } from '../data/gallery';

export const galleryService = {
  /**
   * Get gallery items
   */
  async getGallery(onlyPublished = true) {
    if (!isSupabaseConfigured) {
      return fallbackGallery;
    }

    try {
      let query = supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (onlyPublished) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        return fallbackGallery;
      }
      return data.map((item) => ({
        ...item,
        image: item.image_url || item.image,
        desc: item.description || item.desc,
      }));
    } catch (err) {
      console.warn('Supabase getGallery error, using fallback:', err.message);
      return fallbackGallery;
    }
  },

  /**
   * Admin: Add gallery photo
   */
  async createGalleryItem(data) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      title: data.title,
      description: data.description || data.desc || '',
      image_url: data.image_url || data.image,
      category: data.category || 'Clinic',
      is_published: data.is_published !== undefined ? data.is_published : true,
      display_order: data.display_order || 0,
    };

    const { data: inserted, error } = await supabase.from('gallery').insert([payload]).select().single();
    if (error) throw error;
    return inserted;
  },

  /**
   * Admin: Update gallery item
   */
  async updateGalleryItem(id, data) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      title: data.title,
      description: data.description || data.desc,
      image_url: data.image_url || data.image,
      category: data.category,
      display_order: data.display_order,
      updated_at: new Date().toISOString(),
    };
    if (data.is_published !== undefined) {
      payload.is_published = data.is_published;
    }

    const { data: updated, error } = await supabase
      .from('gallery')
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
  async toggleGalleryPublish(id, isPublished) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('gallery')
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Delete gallery item
   */
  async deleteGalleryItem(id) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

export default galleryService;
