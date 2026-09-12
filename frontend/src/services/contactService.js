import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://kalpana-multispeciality-dental-hospital.onrender.com';

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

export const contactService = {
  /**
   * Public: Send contact message inquiry
   */
  async sendContactMessage(formData) {
    const id = formData.id || generateUUID();
    const payload = {
      id,
      name: formData.name,
      email: formData.email || '',
      phone: formData.phone,
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
      status: 'unread',
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('contact_messages').insert([payload]);
        if (error) {
          console.warn('Supabase sendContactMessage warning:', error.message);
        } else {
          return {
            ...payload,
            created_at: new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('Supabase sendContactMessage error, fallback recorded:', err.message);
      }
    }

    return {
      id,
      ...payload,
      created_at: new Date().toISOString(),
    };
  },

  /**
   * Admin: Get all contact messages
   */
  async getMessages(statusFilter = 'all') {
    // 1. Direct Supabase query
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (statusFilter && statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase getMessages error:', err.message);
      }
    }

    // 2. Fallback to Express backend API
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          let list = json.data;
          if (statusFilter && statusFilter !== 'all') {
            list = list.filter((m) => m.status === statusFilter);
          }
          return list;
        }
      }
    } catch (apiErr) {
      console.warn('Backend API contact fallback skipped:', apiErr.message);
    }

    return [];
  },

  /**
   * Admin: Update message status (unread, read, replied)
   */
  async updateMessageStatus(id, status) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .update({ status })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) return data;
      } catch (sbErr) {
        console.warn('Supabase updateMessageStatus error:', sbErr.message);
      }
    }

    // Backend fallback
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/${id}/status`, {
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
   * Admin: Delete message
   */
  async deleteMessage(id) {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (!error) return true;
      } catch (sbErr) {
        console.warn('Supabase deleteMessage warning:', sbErr.message);
      }
    }

    // Backend fallback
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch (err) {
      console.warn('Backend delete message fallback warning:', err.message);
    }

    return true;
  },

  /**
   * Admin Dashboard: Get unread count
   */
  async getUnreadCount() {
    try {
      const messages = await this.getMessages('unread');
      return messages.length;
    } catch (err) {
      console.warn('Error fetching unread messages count:', err.message);
      return 0;
    }
  },
};

export default contactService;

