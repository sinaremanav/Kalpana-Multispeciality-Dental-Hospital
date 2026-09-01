import React, { useState, useEffect } from 'react';
import { testimonialService } from '../../services/testimonialService';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import ImageUploader from '../components/ImageUploader';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import { Plus, Edit2, Trash2, Power, Star, MessageSquareQuote } from 'lucide-react';

export const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    patient_name: '',
    rating: 5,
    treatment: '',
    location: '',
    message: '',
    image_url: '',
    is_published: true,
  });
  const [saving, setSaving] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await testimonialService.getTestimonials(false);
      setTestimonials(list);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err.message || 'Unable to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingTestimonial(null);
    setFormData({
      patient_name: '',
      rating: 5,
      treatment: 'Root Canal Treatment',
      location: 'Kopargaon',
      message: '',
      image_url: '',
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingTestimonial(item);
    setFormData({
      patient_name: item.patient_name || item.name || '',
      rating: item.rating || 5,
      treatment: item.treatment || '',
      location: item.location || '',
      message: item.message || item.review || '',
      image_url: item.image_url || item.avatar || '',
      is_published: item.is_published !== undefined ? item.is_published : true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.patient_name.trim() || !formData.message.trim()) {
      alert('Patient name and review message are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingTestimonial) {
        await testimonialService.updateTestimonial(editingTestimonial.id, formData);
      } else {
        await testimonialService.createTestimonial(formData);
      }
      setIsModalOpen(false);
      await fetchTestimonials();
    } catch (err) {
      alert(`Failed to save testimonial: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      await testimonialService.toggleTestimonialPublish(item.id, !item.is_published);
      await fetchTestimonials();
    } catch (err) {
      alert(`Failed to update publish state: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await testimonialService.deleteTestimonial(deletingId);
      setDeletingId(null);
      await fetchTestimonials();
    } catch (err) {
      alert(`Failed to delete testimonial: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Patient Review',
      render: (row) => (
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0] mt-0.5">
            <img
              src={
                row.image_url ||
                row.avatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
              }
              alt={row.patient_name || row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-[#0F172A] block">{row.patient_name || row.name}</span>
            <span className="text-xs text-[#2563EB] font-semibold block">
              {row.treatment} {row.location ? `• ${row.location}` : ''}
            </span>
            <p className="text-xs text-[#475569] line-clamp-2 mt-1 italic">
              "{row.message || row.review}"
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-1">
          {[...Array(row.rating || 5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs font-bold text-[#0F172A] ml-1">{row.rating || 5}.0</span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <StatusBadge status={row.is_published ? 'published' : 'unpublished'} />
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleTogglePublish(row)}
            title={row.is_published ? 'Unpublish Testimonial' : 'Publish Testimonial'}
            className={`p-2 rounded-lg transition-colors ${
              row.is_published ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Testimonial"
            className="p-2 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingId(row.id)}
            title="Delete Testimonial"
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingState message="Loading patient reviews..." minHeight="min-h-[400px]" />;
  }

  if (error) {
    return <ErrorState title="Unable to load testimonials" message={error} onRetry={fetchTestimonials} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Patient Testimonials
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Manage patient reviews, 5-star ratings, and feedback displayed on the public website
          </p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" size="md" icon={Plus}>
          Add Testimonial
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={testimonials}
        emptyTitle="No Reviews Recorded"
        emptyDescription="Add verified patient stories to showcase on the website."
        emptyActionLabel="Add Testimonial"
        onEmptyAction={handleOpenAdd}
      />

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTestimonial ? 'Edit Patient Review' : 'Add New Testimonial'}
        subtitle="Manage verified patient feedback and star rating"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                required
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                placeholder="Rameshwar Shinde"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Star Rating
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Treatment Undertaken
              </label>
              <input
                type="text"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                placeholder="Root Canal Treatment"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Location / City
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Kopargaon"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Patient Review Feedback *
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe clinical experience, painless treatment, hygiene..."
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <ImageUploader
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder="gallery"
            label="Patient Photo (Optional)"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="test_pub"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] w-4 h-4"
            />
            <label htmlFor="test_pub" className="text-xs font-bold text-[#0F172A] cursor-pointer">
              Published (Visible on public Testimonials page)
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
              {saving ? 'Saving...' : editingTestimonial ? 'Save Changes' : 'Create Testimonial'}
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Testimonial"
        message="Are you sure you want to remove this patient review?"
        confirmText="Delete Testimonial"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default TestimonialsManager;
