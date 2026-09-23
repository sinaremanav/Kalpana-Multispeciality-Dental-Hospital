import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import ImageUploader from '../components/ImageUploader';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import { Plus, Edit2, Trash2, Power, Users, Phone, Mail } from 'lucide-react';

export const DoctorsManager = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    bio: '',
    phone: '',
    email: '',
    image_url: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Confirm Delete Dialog
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await doctorService.getDoctors(false);
      setDoctors(list);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.message || 'Unable to load doctors list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialization: '',
      qualification: '',
      experience: '',
      bio: '',
      phone: '',
      email: '',
      image_url: '',
      is_active: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      experience: doctor.experience || '',
      bio: doctor.bio || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      image_url: doctor.image_url || doctor.image || '',
      is_active: doctor.is_active !== undefined ? doctor.is_active : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Doctor name is required';
    if (!formData.specialization.trim()) errs.specialization = 'Specialization is required';
    if (!formData.qualification.trim()) errs.qualification = 'Qualification is required';
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSaving(true);
    try {
      if (editingDoctor) {
        await doctorService.updateDoctor(editingDoctor.id, formData);
      } else {
        await doctorService.createDoctor(formData);
      }
      setIsModalOpen(false);
      await fetchDoctors();
    } catch (err) {
      alert(`Failed to save doctor: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (doctor) => {
    try {
      await doctorService.toggleDoctorActive(doctor.id, !doctor.is_active);
      await fetchDoctors();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await doctorService.deleteDoctor(deletingId);
      setDeletingId(null);
      await fetchDoctors();
    } catch (err) {
      alert(`Failed to delete doctor: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Doctor',
      render: (row) => (
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0]">
            <img
              src={row.image_url || row.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-[#0F172A] block">{row.name}</span>
            <span className="text-xs text-[#059669] font-semibold">{row.specialization}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Qualification',
      render: (row) => (
        <div>
          <span className="text-xs font-semibold text-[#0F172A] block">{row.qualification}</span>
          <span className="text-[11px] text-[#64748B]">{row.experience || 'Experienced'}</span>
        </div>
      ),
    },
    {
      header: 'Contact',
      render: (row) => (
        <div className="text-xs text-[#475569] space-y-0.5">
          {row.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#059669]" />
              <span>{row.phone}</span>
            </div>
          )}
          {row.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-[#64748B]" />
              <span>{row.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <StatusBadge status={row.is_active ? 'active' : 'inactive'} />
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleToggleActive(row)}
            title={row.is_active ? 'Deactivate Doctor' : 'Activate Doctor'}
            className={`p-2 rounded-lg transition-colors ${
              row.is_active
                ? 'text-amber-600 hover:bg-amber-50'
                : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Doctor Details"
            className="p-2 text-[#059669] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingId(row.id)}
            title="Delete Doctor"
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingState message="Loading doctors directory..." minHeight="min-h-[400px]" />;
  }

  if (error) {
    return <ErrorState title="Unable to load doctors" message={error} onRetry={fetchDoctors} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Doctors Management</h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Add, update credentials, upload photos, and manage active clinical specialists
          </p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" size="md" icon={Plus}>
          Add New Doctor
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={doctors}
        emptyTitle="No Doctors Configured"
        emptyDescription="Get started by adding clinical specialists to your team."
        emptyActionLabel="Add Doctor"
        onEmptyAction={handleOpenAdd}
      />

      {/* Add / Edit Doctor Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
        subtitle="Manage doctor credentials and clinical bio"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Nikhil Hiralal Mahanubhav"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
              {formErrors.name && <span className="text-xs text-rose-600 mt-1">{formErrors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Specialization *
              </label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Chief Dental Surgeon & Implantologist"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
              {formErrors.specialization && (
                <span className="text-xs text-rose-600 mt-1">{formErrors.specialization}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Degrees & Qualification *
              </label>
              <input
                type="text"
                required
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="BDS, MDS (Oral Surgery)"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
              {formErrors.qualification && (
                <span className="text-xs text-rose-600 mt-1">{formErrors.qualification}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="4+ Years Clinical Experience"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 74472 26136"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="doctor@kalpanadental.com"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Professional Biography
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Detailed description of clinical specialization, patient care approach..."
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>

          {/* Image Uploader */}
          <ImageUploader
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder="doctors"
            label="Doctor Profile Photo"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-[#CBD5E1] text-[#059669] focus:ring-[#059669] w-4 h-4"
            />
            <label htmlFor="is_active" className="text-xs font-bold text-[#0F172A] cursor-pointer">
              Active (Visible on public Doctors page)
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
              {saving ? 'Saving Doctor...' : editingDoctor ? 'Save Changes' : 'Create Doctor'}
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Doctor"
        message="Are you sure you want to remove this doctor? This action cannot be undone."
        confirmText="Delete Doctor"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default DoctorsManager;
