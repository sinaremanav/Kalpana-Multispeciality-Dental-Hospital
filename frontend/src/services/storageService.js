import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const BUCKET_NAME = 'clinic-images';

export const storageService = {
  /**
   * Upload an image file to Supabase Storage
   * @param {File} file - The file to upload
   * @param {string} folder - 'doctors' | 'gallery' | 'events' | 'services'
   * @returns {Promise<string>} Public URL of the uploaded image
   */
  async uploadImage(file, folder = 'gallery') {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Unable to upload image.');
    }

    if (!file) {
      throw new Error('No file selected for upload.');
    }

    // Validate size (e.g. 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('Image size must be less than 5MB.');
    }

    // Sanitize file name
    const fileExt = file.name.split('.').pop();
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Retrieve public URL
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Delete image from storage if needed
   */
  async deleteImage(filePathOrUrl) {
    if (!isSupabaseConfigured || !filePathOrUrl) return;

    // Extract path from full Supabase URL if needed
    let path = filePathOrUrl;
    if (filePathOrUrl.includes(BUCKET_NAME)) {
      const parts = filePathOrUrl.split(`${BUCKET_NAME}/`);
      if (parts[1]) path = parts[1];
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error) {
      console.warn('Storage delete error:', error.message);
    }
  },
};

export default storageService;
