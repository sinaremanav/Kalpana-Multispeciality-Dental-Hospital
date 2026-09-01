import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const fallbackEvents = [
  {
    id: '66666666-6666-6666-6666-666666666001',
    title: 'Free Dental Screening & Oral Cancer Checkup Camp',
    description: 'Comprehensive oral checkup, tooth decay diagnosis, digital RVG screening, and free consultation for all community residents.',
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '09:30:00',
    end_time: '16:00:00',
    location: 'Kalpana Dental Clinic, Near Gandhi Statue, Main Road Kopargaon',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    category: 'Camp',
    is_published: true,
  },
  {
    id: '66666666-6666-6666-6666-666666666002',
    title: 'School Oral Hygiene & Healthy Smiles Awareness Workshop',
    description: 'Interactive dental hygiene demonstration, proper brushing technique workshop, and free dental kits distribution for children.',
    event_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '10:00:00',
    end_time: '13:30:00',
    location: 'Kopargaon High School Auditorium, Kopargaon',
    image_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    category: 'Workshop',
    is_published: true,
  },
  {
    id: '66666666-6666-6666-6666-666666666003',
    title: 'Senior Citizens Geriatric Denture Camp',
    description: 'Specialized screening camp for complete and partial dentures, soft-tissue oral health assessment, and denture relining.',
    event_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_time: '10:00:00',
    end_time: '15:00:00',
    location: 'Community Hall, Shirdi Road, Kopargaon',
    image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    category: 'Camp',
    is_published: true,
  },
];

export const eventService = {
  /**
   * Get all events (optionally only published)
   */
  async getEvents(onlyPublished = true) {
    if (!isSupabaseConfigured) {
      return onlyPublished ? fallbackEvents.filter((e) => e.is_published) : fallbackEvents;
    }

    try {
      let query = supabase.from('events').select('*').order('event_date', { ascending: false });
      if (onlyPublished) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        return onlyPublished ? fallbackEvents.filter((e) => e.is_published) : fallbackEvents;
      }
      return data;
    } catch (err) {
      console.warn('Supabase getEvents error, falling back to local data:', err.message);
      return onlyPublished ? fallbackEvents.filter((e) => e.is_published) : fallbackEvents;
    }
  },

  /**
   * Separate events into upcoming and past
   */
  async getCategorizedEvents() {
    const events = await this.getEvents(true);
    const today = new Date().toISOString().split('T')[0];

    const upcoming = events
      .filter((e) => e.event_date >= today)
      .sort((a, b) => (a.event_date > b.event_date ? 1 : -1));

    const past = events
      .filter((e) => e.event_date < today)
      .sort((a, b) => (a.event_date < b.event_date ? 1 : -1));

    return { upcoming, past, all: events };
  },

  /**
   * Admin: Create event
   */
  async createEvent(eventData) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.event_date || eventData.date,
      start_time: eventData.start_time || '09:00:00',
      end_time: eventData.end_time || null,
      location: eventData.location,
      image_url: eventData.image_url || eventData.image || '',
      category: eventData.category || 'Camp',
      is_published: eventData.is_published !== undefined ? eventData.is_published : true,
    };

    const { data, error } = await supabase.from('events').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  /**
   * Admin: Update event
   */
  async updateEvent(id, eventData) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const payload = {
      title: eventData.title,
      description: eventData.description,
      event_date: eventData.event_date || eventData.date,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      location: eventData.location,
      image_url: eventData.image_url || eventData.image,
      category: eventData.category,
      updated_at: new Date().toISOString(),
    };
    if (eventData.is_published !== undefined) {
      payload.is_published = eventData.is_published;
    }

    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Toggle publish
   */
  async toggleEventPublish(id, isPublished) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('events')
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Delete event
   */
  async deleteEvent(id) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};

export default eventService;
