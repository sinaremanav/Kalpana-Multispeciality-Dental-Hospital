import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { clinicConfig as fallbackConfig } from '../config/clinicConfig';

export const clinicService = {
  /**
   * Get global clinic settings
   */
  async getClinicSettings() {
    if (!isSupabaseConfigured) {
      return fallbackConfig;
    }

    try {
      const { data, error } = await supabase.from('clinic_settings').select('*').limit(1).maybeSingle();
      if (error) throw error;
      if (!data) return fallbackConfig;

      return {
        id: data.id,
        clinicName: data.clinic_name || fallbackConfig.clinicName,
        tagline: data.tagline || fallbackConfig.tagline,
        subTagline: data.sub_tagline || fallbackConfig.subTagline,
        doctorName: fallbackConfig.doctorName,
        doctorDegree: fallbackConfig.doctorDegree,
        doctorExperience: fallbackConfig.doctorExperience,
        registrationNo: fallbackConfig.registrationNo,
        phone: data.phone || fallbackConfig.phone,
        displayPhone: data.display_phone || data.phone || fallbackConfig.displayPhone,
        whatsappNumber: data.whatsapp_number || fallbackConfig.whatsappNumber,
        email: data.email || fallbackConfig.email,
        address: data.address || fallbackConfig.address,
        landmark: data.landmark || fallbackConfig.landmark,
        workingHours: data.opening_hours || fallbackConfig.workingHours,
        socials: {
          facebook: data.facebook_url || fallbackConfig.socials.facebook,
          instagram: data.instagram_url || fallbackConfig.socials.instagram,
          youtube: data.youtube_url || fallbackConfig.socials.youtube,
          linkedin: data.linkedin_url || fallbackConfig.socials.linkedin,
        },
        googleMapsUrl: data.google_maps_url || fallbackConfig.googleMapsUrl,
        googleMapsEmbed: data.google_maps_embed || fallbackConfig.googleMapsEmbed,
        aboutText: data.about_text,
        logoUrl: data.logo_url,
        stats: data.stats || fallbackConfig.stats,
      };
    } catch (err) {
      console.warn('Supabase getClinicSettings error, using fallback:', err.message);
      return fallbackConfig;
    }
  },

  /**
   * Admin: Update clinic settings
   */
  async updateClinicSettings(id, data) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');

    const payload = {
      clinic_name: data.clinicName || data.clinic_name,
      tagline: data.tagline,
      sub_tagline: data.subTagline || data.sub_tagline,
      phone: data.phone,
      display_phone: data.displayPhone || data.display_phone,
      email: data.email,
      address: data.address,
      landmark: data.landmark,
      opening_hours: data.workingHours || data.opening_hours,
      whatsapp_number: data.whatsappNumber || data.whatsapp_number,
      google_maps_url: data.googleMapsUrl || data.google_maps_url,
      google_maps_embed: data.googleMapsEmbed || data.google_maps_embed,
      instagram_url: data.socials?.instagram || data.instagram_url,
      facebook_url: data.socials?.facebook || data.facebook_url,
      youtube_url: data.socials?.youtube || data.youtube_url,
      linkedin_url: data.socials?.linkedin || data.linkedin_url,
      about_text: data.aboutText || data.about_text,
      logo_url: data.logoUrl || data.logo_url,
      stats: data.stats,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
      const { data: updated, error } = await supabase
        .from('clinic_settings')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      result = updated;
    } else {
      const { data: inserted, error } = await supabase
        .from('clinic_settings')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      result = inserted;
    }

    return result;
  },
};

export default clinicService;
