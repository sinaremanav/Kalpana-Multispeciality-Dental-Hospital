import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { testimonialsData as fallbackTestimonials } from '../data/testimonials';

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

// Local cache key for offline/instant review updates
const LOCAL_STORAGE_KEY = 'kalpana_patient_reviews';

const getLocalReviews = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalReviews = (reviews) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.warn('Failed to save reviews to localStorage:', err);
  }
};

export const testimonialService = {
  /**
   * Get testimonials (optionally published only)
   */
  async getTestimonials(onlyPublished = true) {
    let list = [];

    // 1. Try Supabase
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (onlyPublished) {
          query = query.or('is_published.eq.true,is_approved.eq.true');
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          list = data;
        }
      } catch (err) {
        console.warn('Supabase getTestimonials error:', err.message);
      }
    }

    // 2. Try Backend REST API if Supabase didn't return data
    if (list.length === 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/testimonials${onlyPublished ? '' : '?all=true'}`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
            list = json.data;
          }
        }
      } catch (backendErr) {
        console.warn('Backend testimonials fetch fallback:', backendErr.message);
      }
    }

    // 3. Merge with any local reviews added in current session
    const local = getLocalReviews();
    if (local.length > 0) {
      const existingIds = new Set(list.map((t) => String(t.id)));
      const filteredLocal = local.filter((t) => {
        if (existingIds.has(String(t.id))) return false;
        if (onlyPublished) return t.is_published === true;
        return true;
      });
      list = [...filteredLocal, ...list];
    }

    // 4. Fallback if still empty
    if (list.length === 0) {
      list = fallbackTestimonials;
    }

    const filteredList = onlyPublished
      ? list.filter((t) => t.is_published !== false)
      : list;

    return filteredList.map((t) => {
      const name = t.patient_name || t.name || 'Anonymous Patient';
      const reviewText = t.message || t.review || t.comment || '';
      const avatarUrl =
        t.image_url ||
        t.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff&bold=true`;

      return {
        ...t,
        id: t.id,
        name,
        patient_name: name,
        review: reviewText,
        message: reviewText,
        comment: reviewText,
        rating: Math.min(5, Math.max(1, Number(t.rating) || 5)),
        treatment: t.treatment || 'General Dentistry',
        location: t.location || 'Kopargaon',
        avatar: avatarUrl,
        image_url: avatarUrl,
        is_published: t.is_published !== undefined ? Boolean(t.is_published) : false,
      };
    });
  },

  /**
   * Submit new review (Patients: default pending moderation; Admin: can pass is_published: true)
   */
  async createTestimonial(data) {
    const patientName = (data.patient_name || data.name || '').trim();
    const reviewText = (data.message || data.review || data.comment || '').trim();
    const rating = Math.min(5, Math.max(1, Number(data.rating) || 5));
    const treatment = (data.treatment || 'General Dentistry').trim();
    const location = (data.location || 'Kopargaon').trim();
    const isPublished =
      data.is_published !== undefined ? Boolean(data.is_published) : false;

    const newId =
      data.id ||
      (typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `rev_${Date.now()}`);

    const avatarUrl =
      data.image_url ||
      data.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName || 'Patient')}&background=059669&color=fff&bold=true`;

    const payload = {
      id: newId,
      patient_name: patientName,
      name: patientName,
      rating,
      treatment,
      location,
      message: reviewText,
      comment: reviewText,
      review: reviewText,
      image_url: avatarUrl,
      avatar: avatarUrl,
      is_published: isPublished,
      created_at: new Date().toISOString(),
    };

    // 1. Persist to Supabase if available
    if (isSupabaseConfigured) {
      try {
        const { data: inserted, error } = await supabase
          .from('testimonials')
          .insert([payload])
          .select()
          .single();
        if (!error && inserted) {
          payload.id = inserted.id;
        }
      } catch (err) {
        console.warn('Supabase testimonial insert warning:', err.message);
      }
    }

    // 2. Sync to Backend REST API
    fetch(`${API_BASE_URL}/api/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn('Backend API testimonial sync warning:', err.message);
    });

    // 3. Save to local storage cache so it persists immediately across refreshes
    const currentLocal = getLocalReviews();
    saveLocalReviews([payload, ...currentLocal]);

    return payload;
  },

  /**
   * Admin: Update testimonial
   */
  async updateTestimonial(id, data) {
    const payload = {
      patient_name: data.patient_name || data.name,
      rating: Number(data.rating) || 5,
      treatment: data.treatment,
      location: data.location,
      message: data.message || data.review || data.comment,
      image_url: data.image_url || data.avatar,
      updated_at: new Date().toISOString(),
    };
    if (data.is_published !== undefined) {
      payload.is_published = data.is_published;
    }

    if (isSupabaseConfigured) {
      try {
        const { data: updated, error } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', id)
          .select()
          .single();
        if (!error && updated) return updated;
      } catch (err) {
        console.warn('Supabase updateTestimonial warning:', err.message);
      }
    }

    // Update in local storage
    const currentLocal = getLocalReviews();
    const updatedLocal = currentLocal.map((t) =>
      String(t.id) === String(id) ? { ...t, ...payload } : t
    );
    saveLocalReviews(updatedLocal);

    return { id, ...payload };
  },

  /**
   * Admin: Toggle publish
   */
  async toggleTestimonialPublish(id, isPublished) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .update({ is_published: isPublished, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase toggleTestimonialPublish warning:', err.message);
      }
    }

    // Update backend API
    fetch(`${API_BASE_URL}/api/testimonials/${id}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: isPublished }),
    }).catch(() => {});

    // Update in local cache
    const currentLocal = getLocalReviews();
    saveLocalReviews(
      currentLocal.map((t) =>
        String(t.id) === String(id) ? { ...t, is_published: isPublished } : t
      )
    );

    return { id, is_published: isPublished };
  },

  /**
   * Admin: Delete testimonial
   */
  async deleteTestimonial(id) {
    // 1. Delete from Supabase
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) {
          console.warn('Supabase deleteTestimonial warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase delete exception:', err.message);
      }
    }

    // 2. Delete from Backend REST API
    try {
      await fetch(`${API_BASE_URL}/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.warn('Backend delete testimonial warning:', err.message);
    }

    // 3. Remove from local storage cache
    const currentLocal = getLocalReviews();
    const filtered = currentLocal.filter((t) => String(t.id) !== String(id));
    saveLocalReviews(filtered);

    return true;
  },
};

export default testimonialService;
