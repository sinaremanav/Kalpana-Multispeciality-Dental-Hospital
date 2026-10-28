import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { clinicConfig as fallbackConfig } from '../config/clinicConfig';

const CLINIC_CACHE_KEY = 'kalpana_clinic_settings_v2';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return import.meta.env.DEV ? '' : 'http://localhost:5000';
    }
  }
  return (
    import.meta.env.VITE_API_URL ||
    'https://kalpana-multispeciality-dental-hospital.onrender.com'
  );
};

const API_BASE_URL = getApiBaseUrl();

const getLocalClinicSettings = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CLINIC_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveLocalClinicSettings = (settings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CLINIC_CACHE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save clinic settings to localStorage:', err);
  }
};

const normalizeClinicData = (data, base = fallbackConfig) => {
  if (!data) return base;
  return {
    id: data.id || base.id || '28e5ee69-dfb3-497c-8062-417af8f9a75b',
    clinicName: data.clinic_name || data.clinicName || base.clinicName,
    tagline: data.tagline !== undefined ? data.tagline : base.tagline,
    subTagline: data.sub_tagline || data.subTagline || base.subTagline,
    doctorName: data.doctorName || base.doctorName,
    doctorDegree: data.doctorDegree || base.doctorDegree,
    doctorExperience: data.doctorExperience || base.doctorExperience,
    registrationNo: data.registrationNo || base.registrationNo,
    phone: data.phone || base.phone,
    displayPhone: data.display_phone || data.displayPhone || data.phone || base.displayPhone,
    whatsappNumber: data.whatsapp_number || data.whatsappNumber || base.whatsappNumber,
    email: data.email || base.email,
    address: data.address || base.address,
    landmark: data.landmark || base.landmark,
    workingHours: data.opening_hours || data.workingHours || base.workingHours,
    socials: {
      facebook: data.facebook_url || data.socials?.facebook || base.socials?.facebook || 'https://facebook.com',
      instagram: data.instagram_url || data.socials?.instagram || base.socials?.instagram || 'https://instagram.com',
      youtube: data.youtube_url || data.socials?.youtube || base.socials?.youtube || 'https://youtube.com',
      linkedin: data.linkedin_url || data.socials?.linkedin || base.socials?.linkedin || 'https://linkedin.com',
    },
    googleMapsUrl: data.google_maps_url || data.googleMapsUrl || base.googleMapsUrl,
    googleMapsEmbed: data.google_maps_embed || data.googleMapsEmbed || base.googleMapsEmbed,
    aboutText: data.about_text || data.aboutText || base.aboutText || null,
    logoUrl: data.logo_url || data.logoUrl || base.logoUrl || null,
    stats: data.stats || base.stats,
  };
};

export const clinicService = {
  /**
   * Get global clinic settings (Network-first with local cache fallback)
   */
  async getClinicSettings() {
    const cached = getLocalClinicSettings();

    // 1. Try Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('clinic_settings')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          const normalized = normalizeClinicData(data, cached || fallbackConfig);
          // If we had a locally updated version, merge to ensure latest admin edits aren't lost
          const finalResult = cached ? { ...normalized, ...cached } : normalized;
          saveLocalClinicSettings(finalResult);
          return finalResult;
        }
      } catch (err) {
        console.warn('Supabase getClinicSettings notice:', err.message);
      }
    }

    // 2. Try Backend REST API
    try {
      const res = await fetch(`${API_BASE_URL}/api/clinic`);
      if (res.ok) {
        const result = await res.json();
        if (result?.data) {
          const normalized = normalizeClinicData(result.data, cached || fallbackConfig);
          const finalResult = cached ? { ...normalized, ...cached } : normalized;
          saveLocalClinicSettings(finalResult);
          return finalResult;
        }
      }
    } catch (err) {
      console.warn('Backend getClinicSettings notice:', err.message);
    }

    // 3. Fallback to localStorage or default config
    return cached ? normalizeClinicData(cached, fallbackConfig) : fallbackConfig;
  },

  /**
   * Admin: Update clinic settings with multi-tier persistence
   */
  async updateClinicSettings(id, data) {
    const current = getLocalClinicSettings() || fallbackConfig;
    const normalized = normalizeClinicData(
      {
        ...current,
        ...data,
        id: id || current.id,
      },
      current
    );

    // 1. Immediately update localStorage so changes persist across all tabs and reloads
    saveLocalClinicSettings(normalized);

    // 2. Broadcast realtime update event across entire React app
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('clinic_settings_updated', { detail: normalized })
      );
    }

    // 3. Sync to Backend REST API (with admin JWT if available)
    const token =
      (typeof localStorage !== 'undefined' &&
        (localStorage.getItem('admin_token') || localStorage.getItem('token'))) ||
      '';

    try {
      fetch(`${API_BASE_URL}/api/clinic`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(normalized),
      }).catch((err) => {
        console.warn('Backend API clinic settings sync notice:', err.message);
      });
    } catch (err) {
      console.warn('Failed to dispatch backend update:', err);
    }

    // 4. Also attempt direct Supabase update if configured
    if (isSupabaseConfigured) {
      try {
        const payload = {
          clinic_name: normalized.clinicName,
          tagline: normalized.tagline,
          sub_tagline: normalized.subTagline,
          phone: normalized.phone,
          display_phone: normalized.displayPhone,
          email: normalized.email,
          address: normalized.address,
          landmark: normalized.landmark,
          opening_hours: normalized.workingHours,
          whatsapp_number: normalized.whatsappNumber,
          google_maps_url: normalized.googleMapsUrl,
          google_maps_embed: normalized.googleMapsEmbed,
          instagram_url: normalized.socials?.instagram,
          facebook_url: normalized.socials?.facebook,
          youtube_url: normalized.socials?.youtube,
          linkedin_url: normalized.socials?.linkedin,
          about_text: normalized.aboutText,
          logo_url: normalized.logoUrl,
          stats: normalized.stats,
          updated_at: new Date().toISOString(),
        };

        const targetId = id || normalized.id;
        if (targetId) {
          await supabase.from('clinic_settings').update(payload).eq('id', targetId);
        } else {
          await supabase.from('clinic_settings').insert([payload]);
        }
      } catch (sbErr) {
        console.warn('Direct Supabase update notice:', sbErr.message);
      }
    }

    return normalized;
  },
};

export default clinicService;
