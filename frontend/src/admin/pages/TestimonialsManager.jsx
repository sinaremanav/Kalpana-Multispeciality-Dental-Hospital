import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { testimonialService } from '../../services/testimonialService';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import ImageUploader from '../components/ImageUploader';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  MessageSquareQuote,
  CheckCircle2,
  EyeOff,
  Clock,
  Search,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const TestimonialsManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTab, setFilterTab] = useState(initialTab); // 'all' | 'pending' | 'published'
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState(null);

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

  const showNotice = (message, type = 'success') => {
    setActionNotice({ message, type });
    setTimeout(() => {
      setActionNotice(null);
    }, 4000);
  };

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
        showNotice(`Updated review for ${formData.patient_name}`);
      } else {
        await testimonialService.createTestimonial(formData);
        showNotice(`Created new review for ${formData.patient_name}`);
      }
      setIsModalOpen(false);
      await fetchTestimonials();
    } catch (err) {
      alert(`Failed to save testimonial: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (item) => {
    try {
      await testimonialService.toggleTestimonialPublish(item.id, true);
      setTestimonials((prev) =>
        prev.map((t) => (String(t.id) === String(item.id) ? { ...t, is_published: true } : t))
      );
      showNotice(`Approved & published review from ${item.patient_name || item.name} to public website!`);
    } catch (err) {
      alert(`Failed to approve review: ${err.message}`);
    }
  };

  const handleUnpublish = async (item) => {
    try {
      await testimonialService.toggleTestimonialPublish(item.id, false);
      setTestimonials((prev) =>
        prev.map((t) => (String(t.id) === String(item.id) ? { ...t, is_published: false } : t))
      );
      showNotice(`Moved review from ${item.patient_name || item.name} to pending moderation.`, 'info');
    } catch (err) {
      alert(`Failed to unpublish review: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await testimonialService.deleteTestimonial(deletingId);
      setTestimonials((prev) => prev.filter((t) => String(t.id) !== String(deletingId)));
      setDeletingId(null);
      showNotice('Review deleted successfully.');
    } catch (err) {
      alert(`Failed to delete testimonial: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Counts
  const pendingCount = testimonials.filter((t) => !t.is_published).length;
  const publishedCount = testimonials.filter((t) => t.is_published).length;

  // Filter & Search
  const filteredTestimonials = testimonials.filter((item) => {
    // Tab filter
    if (filterTab === 'pending' && item.is_published) return false;
    if (filterTab === 'published' && !item.is_published) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (item.patient_name || item.name || '').toLowerCase();
      const message = (item.message || item.review || item.comment || '').toLowerCase();
      const treatment = (item.treatment || '').toLowerCase();
      const location = (item.location || '').toLowerCase();
      return name.includes(q) || message.includes(q) || treatment.includes(q) || location.includes(q);
    }

    return true;
  });

  const columns = [
    {
      header: 'Patient & Feedback',
      render: (row) => (
        <div className="flex items-start gap-3 max-w-md">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0] mt-0.5">
            <img
              src={
                row.image_url ||
                row.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(row.patient_name || row.name || 'Patient')}&background=059669&color=fff&bold=true`
              }
              alt={row.patient_name || row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F172A]">{row.patient_name || row.name}</span>
              {!row.is_published && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Clock className="w-3 h-3" />
                  <span>Awaiting Moderation</span>
                </span>
              )}
            </div>
            <span className="text-xs text-[#059669] font-semibold block">
              {row.treatment} {row.location ? `• ${row.location}` : ''}
            </span>
            <p className="text-xs text-[#475569] line-clamp-2 mt-1 italic">
              "{row.message || row.review}"
            </p>
            {row.created_at && (
              <span className="text-[10px] text-[#94A3B8] block mt-1">
                Submitted: {new Date(row.created_at).toLocaleDateString()}
              </span>
            )}
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
        <div>
          {row.is_published ? (
            <StatusBadge status="published" />
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-200">
              Pending Approval
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Moderation & Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {/* Quick Approve or Unpublish */}
          {!row.is_published ? (
            <button
              onClick={() => handleApprove(row)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Approve & upload to public website"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve & Publish</span>
            </button>
          ) : (
            <button
              onClick={() => handleUnpublish(row)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 transition-colors cursor-pointer"
              title="Unpublish (hide from public website)"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Unpublish</span>
            </button>
          )}

          {/* Edit */}
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Testimonial"
            className="p-1.5 text-[#64748B] hover:text-[#059669] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => setDeletingId(row.id)}
            title="Delete Testimonial"
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
            Patient Reviews Moderation
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Review patient submissions, approve them to publish publicly, or remove unwanted reviews.
          </p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" size="md" icon={Plus}>
          Add Review
        </Button>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm font-semibold transition-all ${
            actionNotice.type === 'success'
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs font-bold hover:underline ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Pending Reviews Alert Banner */}
      {pendingCount > 0 && filterTab !== 'pending' && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {pendingCount} Patient Review{pendingCount > 1 ? 's' : ''} Awaiting Approval
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                New reviews have been submitted by patients. Review them and click <strong>Approve & Publish</strong> to make them visible on the public website.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFilterTab('pending');
              setSearchParams({ tab: 'pending' });
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Review Pending</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-800 text-white text-[10px]">
              {pendingCount}
            </span>
          </button>
        </div>
      )}

      {/* Filter Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setFilterTab('all');
              setSearchParams({});
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'all'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>All Reviews</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterTab === 'all' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {testimonials.length}
            </span>
          </button>

          <button
            onClick={() => {
              setFilterTab('pending');
              setSearchParams({ tab: 'pending' });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>Pending Approval</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterTab === 'pending'
                  ? 'bg-amber-800 text-white'
                  : pendingCount > 0
                  ? 'bg-amber-100 text-amber-800 font-extrabold'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => {
              setFilterTab('published');
              setSearchParams({ tab: 'published' });
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTab === 'published'
                ? 'bg-[#059669] text-white shadow-xs'
                : 'text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            <span>Published</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterTab === 'published' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {publishedCount}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews or patients..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#059669]"
          />
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredTestimonials}
        emptyTitle={
          filterTab === 'pending'
            ? 'No Pending Reviews'
            : filterTab === 'published'
            ? 'No Published Reviews'
            : 'No Reviews Recorded'
        }
        emptyDescription={
          filterTab === 'pending'
            ? 'Great job! All patient reviews have been reviewed and approved.'
            : 'Add verified patient stories to showcase on the website.'
        }
        emptyActionLabel="Add Review"
        onEmptyAction={handleOpenAdd}
      />

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTestimonial ? 'Edit Patient Review' : 'Add New Patient Review'}
        subtitle="Manage verified patient feedback, moderation status, and star rating"
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
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Star Rating
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
                <option value={2}>★★☆☆☆ (2 Stars)</option>
                <option value={1}>★☆☆☆☆ (1 Star)</option>
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
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
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
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
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
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>

          <ImageUploader
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder="gallery"
            label="Patient Photo (Optional)"
          />

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
            <input
              type="checkbox"
              id="test_pub"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded border-[#CBD5E1] text-[#059669] focus:ring-[#059669] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="test_pub" className="text-xs font-bold text-[#0F172A] cursor-pointer">
              Published & Visible on Public Website
              <span className="block text-[11px] font-normal text-[#64748B]">
                Uncheck to keep as a pending draft awaiting moderation
              </span>
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
              {saving ? 'Saving...' : editingTestimonial ? 'Save Changes' : 'Create Review'}
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Patient Review"
        message="Are you sure you want to permanently delete this review? This action cannot be undone."
        confirmText="Delete Review"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default TestimonialsManager;
