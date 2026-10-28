import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { servicesData as fallbackServices } from '../data/services';

const SERVICES_CACHE_KEY = 'kalpana_services_cache_v1';

export const serviceService = {
  /**
   * Get all services with Network-First, Cache-Fallback Strategy
   */
  async getServices(onlyActive = true) {
    if (!isSupabaseConfigured) {
      try {
        const cached = localStorage.getItem(SERVICES_CACHE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {}
      return fallbackServices;
    }

    try {
      let query = supabase.from('services').select('*').order('created_at', { ascending: true });
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        return fallbackServices;
      }
      // Normalize features and price display
      const normalized = data.map((item) => ({
        ...item,
        priceRange: item.price_display || (item.price ? `₹${item.price}` : 'Consultation'),
        features: Array.isArray(item.features) ? item.features : [],
        fullDesc: item.description,
        shortDesc: item.description,
      }));

      // Cache for offline resilience
      try {
        localStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(normalized));
      } catch {}

      return normalized;
    } catch (err) {
      console.warn('Supabase getServices error, falling back to local cache/data:', err.message);
      try {
        const cached = localStorage.getItem(SERVICES_CACHE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {}
      return fallbackServices;
    }
  },

  /**
   * Get service by ID
   */
  async getServiceById(id) {
    if (!isSupabaseConfigured) {
      return fallbackServices.find((s) => s.id === id || String(s.id) === String(id)) || null;
    }
    const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  /**
   * Admin: Add new dental service
   */
  async createService(serviceData) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      title: serviceData.title,
      description: serviceData.description || serviceData.fullDesc || '',
      price: serviceData.price ? Number(serviceData.price) : null,
      price_display: serviceData.price_display || serviceData.priceRange || (serviceData.price ? `₹${serviceData.price}` : 'Consultation'),
      image_url: serviceData.image_url || serviceData.image || '',
      icon: serviceData.icon || 'Activity',
      features: Array.isArray(serviceData.features)
        ? serviceData.features
        : (serviceData.features || '').split('\n').filter(Boolean),
      is_active: serviceData.is_active !== undefined ? serviceData.is_active : true,
    };

    const { data, error } = await supabase.from('services').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  /**
   * Admin: Update dental service
   */
  async updateService(id, serviceData) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      title: serviceData.title,
      description: serviceData.description || serviceData.fullDesc,
      price: serviceData.price !== undefined ? (serviceData.price ? Number(serviceData.price) : null) : undefined,
      price_display: serviceData.price_display || serviceData.priceRange,
      image_url: serviceData.image_url || serviceData.image,
      icon: serviceData.icon,
      updated_at: new Date().toISOString(),
    };
    if (serviceData.features !== undefined) {
      payload.features = Array.isArray(serviceData.features)
        ? serviceData.features
        : (serviceData.features || '').split('\n').filter(Boolean);
    }
    if (serviceData.is_active !== undefined) {
      payload.is_active = serviceData.is_active;
    }

    const { data, error } = await supabase
      .from('services')
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
  async toggleServiceActive(id, isActive) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('services')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Delete service
   */
  async deleteService(id) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

export default serviceService;
