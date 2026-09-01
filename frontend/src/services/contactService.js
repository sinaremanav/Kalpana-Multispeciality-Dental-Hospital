import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const contactService = {
  /**
   * Public: Send contact message inquiry
   */
  async sendContactMessage(formData) {
    const payload = {
      name: formData.name,
      email: formData.email || '',
      phone: formData.phone,
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
      status: 'unread',
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('contact_messages').insert([payload]).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase sendContactMessage error, fallback recorded:', err.message);
      }
    }

    return {
      id: `INQ-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
    };
  },

  /**
   * Admin: Get all contact messages
   */
  async getMessages(statusFilter = 'all') {
    if (!isSupabaseConfigured) return [];

    let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (statusFilter && statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Admin: Update message status (unread, read, replied)
   */
  async updateMessageStatus(id, status) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Admin: Delete message
   */
  async deleteMessage(id) {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  /**
   * Admin Dashboard: Get unread count
   */
  async getUnreadCount() {
    if (!isSupabaseConfigured) return 0;
    try {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.warn('Error fetching unread messages count:', err.message);
      return 0;
    }
  },
};

export default contactService;
