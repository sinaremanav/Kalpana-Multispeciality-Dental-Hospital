import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import ImageUploader from '../components/ImageUploader';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import { Plus, Edit2, Trash2, Power, Image as ImageIcon, ZoomIn } from 'lucide-react';

export const GalleryManager = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'Clinic',
    display_order: 0,
    is_published: true,
  });
  const [saving, setSaving] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await galleryService.getGallery(false);
      setGallery(list);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError(err.message || 'Unable to load gallery photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'Clinic',
      display_order: (gallery.length || 0) + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || item.desc || '',
      image_url: item.image_url || item.image || '',
      category: item.category || 'Clinic',
      display_order: item.display_order || 0,
      is_published: item.is_published !== undefined ? item.is_published : true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image_url) {
      alert('Photo title and an image file or URL are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await galleryService.updateGalleryItem(editingItem.id, formData);
      } else {
        await galleryService.createGalleryItem(formData);
      }
      setIsModalOpen(false);
      await fetchGallery();
    } catch (err) {
      alert(`Failed to save gallery photo: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      await galleryService.toggleGalleryPublish(item.id, !item.is_published);
      await fetchGallery();
    } catch (err) {
      alert(`Failed to update publish state: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await galleryService.deleteGalleryItem(deletingId);
      setDeletingId(null);
      await fetchGallery();
    } catch (err) {
      alert(`Failed to delete gallery item: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading clinic gallery photos..." minHeight="min-h-[400px]" />;
  }

  if (error) {
    return <ErrorState title="Unable to load gallery" message={error} onRetry={fetchGallery} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Clinic Gallery & Facility Photos
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Upload operatory pictures, sterilization units, diagnostic equipment, and smile transformations
          </p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" size="md" icon={Plus}>
          Upload Photo
        </Button>
      </div>

      {/* Gallery Cards Grid */}
      {gallery.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E2E8F0] shadow-saas">
          <ImageIcon className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0F172A]">No Gallery Photos Uploaded</h3>
          <p className="text-xs text-[#64748B] mt-1 mb-5">
            Start uploading clinic facility pictures to show prospective patients.
          </p>
          <Button onClick={handleOpenAdd} variant="primary" size="sm">
            Upload First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-saas hover:shadow-saas-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-[#F1F5F9] overflow-hidden">
                  <img
                    src={item.image_url || item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#0F172A]/80 text-white text-[11px] font-bold backdrop-blur-xs">
                      {item.category || 'Clinic'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={item.is_published ? 'published' : 'unpublished'} />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-bold text-[#0F172A] leading-snug">{item.title}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 mt-1">
                    {item.description || item.desc || 'No description provided'}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#94A3B8]">
                  Order: #{item.display_order || 0}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    title={item.is_published ? 'Unpublish' : 'Publish'}
                    className={`p-1.5 rounded-lg transition-colors ${
                      item.is_published
                        ? 'text-amber-600 hover:bg-amber-50'
                        : 'text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Details"
                    className="p-1.5 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    title="Delete Photo"
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Gallery Photo' : 'Upload New Gallery Photo'}
        subtitle="Manage photo metadata, category, and storage upload"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Photo Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Modern Sterilized Operatory"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="Clinic">Clinic & Hospital</option>
                <option value="Equipment">Diagnostic Equipment</option>
                <option value="Treatments">Treatments</option>
                <option value="Smiles">Restored Smiles</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Display Order Number
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the facility or operatory setup shown in the photo..."
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Storage Image Upload */}
          <ImageUploader
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder="gallery"
            label="Photo File *"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="gal_pub"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] w-4 h-4"
            />
            <label htmlFor="gal_pub" className="text-xs font-bold text-[#0F172A] cursor-pointer">
              Published (Visible on public Gallery page)
            </label>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={saving}
            >
              {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Upload to Gallery'}
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Photo"
        message="Are you sure you want to remove this photo from the gallery?"
        confirmText="Delete Photo"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default GalleryManager;
