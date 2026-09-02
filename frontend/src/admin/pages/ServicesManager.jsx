import React, { useState, useEffect } from 'react';
import { serviceService } from '../../services/serviceService';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import ImageUploader from '../components/ImageUploader';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import { Plus, Edit2, Trash2, Power, Briefcase, IndianRupee } from 'lucide-react';

export const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    price_display: '',
    image_url: '',
    icon: 'Activity',
    features: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  // Delete Dialog
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await serviceService.getServices(false);
      setServices(list);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Unable to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      price_display: '',
      image_url: '',
      icon: 'Activity',
      features: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    const feats = Array.isArray(service.features)
      ? service.features.join('\n')
      : service.features || '';

    setFormData({
      title: service.title || '',
      description: service.description || service.fullDesc || '',
      price: service.price || '',
      price_display: service.price_display || service.priceRange || '',
      image_url: service.image_url || service.image || '',
      icon: service.icon || 'Activity',
      features: feats,
      is_active: service.is_active !== undefined ? service.is_active : true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Title and description are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await serviceService.updateService(editingService.id, formData);
      } else {
        await serviceService.createService(formData);
      }
      setIsModalOpen(false);
      await fetchServices();
    } catch (err) {
      alert(`Failed to save service: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await serviceService.toggleServiceActive(service.id, !service.is_active);
      await fetchServices();
    } catch (err) {
      alert(`Failed to update service status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await serviceService.deleteService(deletingId);
      setDeletingId(null);
      await fetchServices();
    } catch (err) {
      alert(`Failed to delete service: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Service / Treatment',
      render: (row) => (
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0]">
            <img
              src={row.image_url || row.image || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=200'}
              alt={row.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-[#0F172A] block leading-snug">{row.title}</span>
            <p className="text-xs text-[#64748B] line-clamp-1 max-w-sm mt-0.5">
              {row.description || row.shortDesc}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Pricing',
      render: (row) => (
        <div className="text-xs">
          <span className="font-bold text-[#059669] block">
            {row.price_display || row.priceRange || (row.price ? `₹${row.price}` : 'Consultation')}
          </span>
          {row.price && <span className="text-[11px] text-[#64748B]">Base: ₹{row.price}</span>}
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
            title={row.is_active ? 'Deactivate Treatment' : 'Activate Treatment'}
            className={`p-2 rounded-lg transition-colors ${
              row.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Treatment"
            className="p-2 text-[#059669] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingId(row.id)}
            title="Delete Service"
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingState message="Loading dental services..." minHeight="min-h-[400px]" />;
  }

  if (error) {
    return <ErrorState title="Unable to load services" message={error} onRetry={fetchServices} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Services & Treatments</h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Manage clinical dental procedures, pricing displays, and features shown to patients
          </p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" size="md" icon={Plus}>
          Add New Service
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={services}
        emptyTitle="No Services Found"
        emptyDescription="Add your first dental procedure or treatment to the catalog."
        emptyActionLabel="Add Service"
        onEmptyAction={handleOpenAdd}
      />

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Treatment' : 'Add New Dental Service'}
        subtitle="Configure procedure information and patient price display"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Treatment Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Root Canal Treatment (RCT)"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Base Numeric Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2500"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Display Price Tag
              </label>
              <input
                type="text"
                value={formData.price_display}
                onChange={(e) => setFormData({ ...formData, price_display: e.target.value })}
                placeholder="From ₹2,500 / Per Tooth"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Clinical explanation of procedure, benefits, and patient comfort..."
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Key Features / Highlights (One per line)
            </label>
            <textarea
              rows={3}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Single-visit rotary RCT&#10;Digital Apex Locator precision&#10;Rubber dam sterile isolation"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>

          <ImageUploader
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder="services"
            label="Service Cover Image"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="service_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-[#CBD5E1] text-[#059669] focus:ring-[#059669] w-4 h-4"
            />
            <label htmlFor="service_active" className="text-xs font-bold text-[#0F172A] cursor-pointer">
              Active (Visible on public Services page)
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
              {saving ? 'Saving...' : editingService ? 'Save Changes' : 'Create Service'}
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Service"
        message="Are you sure you want to remove this dental service? This will remove it from the patient catalog."
        confirmText="Delete Service"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default ServicesManager;
