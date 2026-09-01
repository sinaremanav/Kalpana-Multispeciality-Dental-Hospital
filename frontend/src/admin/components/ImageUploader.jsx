import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

export const ImageUploader = ({
  value,
  onChange,
  folder = 'gallery',
  label = 'Image',
  helpText = 'Upload a JPG, PNG, or WebP image (max 5MB), or enter an image URL.',
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase Storage is not connected. Enter an image URL manually in the URL tab.');
      }
      const publicUrl = await storageService.uploadImage(file, folder);
      onChange(publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
              activeTab === 'upload' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-[#64748B]'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
              activeTab === 'url' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-[#64748B]'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] rounded-xl cursor-pointer bg-[#F8FAFC] transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-2" />
                <span className="text-xs font-semibold text-[#2563EB]">Uploading to Storage...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <UploadCloud className="w-8 h-8 text-[#64748B] mb-2" />
                <span className="text-xs font-bold text-[#0F172A]">Click to upload image</span>
                <span className="text-[11px] text-[#64748B] mt-0.5">JPG, PNG, WebP up to 5MB</span>
              </div>
            )}
          </div>

          {/* Preview */}
          {value && (
            <div className="relative w-24 h-24 rounded-xl border border-[#E2E8F0] overflow-hidden bg-white shrink-0 shadow-xs">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            {value && (
              <div className="w-10 h-10 rounded-lg border border-[#E2E8F0] overflow-hidden bg-white shrink-0">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{uploadError}</span>
        </div>
      )}

      <p className="text-[11px] text-[#64748B]">{helpText}</p>
    </div>
  );
};

export default ImageUploader;
