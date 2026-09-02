import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import ImageUploader from '../components/ImageUploader';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import { Plus, Edit2, Trash2, Power, Calendar, Clock, MapPin } from 'lucide-react';

export const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    start_time: '09:00',
    end_time: '14:00',
    location: '',
    image_url: '',
    category: 'Camp',
    is_published: true,
  });
  const [saving, setSaving] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await eventService.getEvents(false);
      setEvents(list);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Unable to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      start_time: '09:30',
      end_time: '16:00',
      location: 'Kalpana Dental Clinic, Kopargaon',
      image_url: '',
      category: 'Camp',
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingEvent(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      event_date: item.event_date || '',
      start_time: item.start_time ? item.start_time.substring(0, 5) : '09:30',
      end_time: item.end_time ? item.end_time.substring(0, 5) : '',
      location: item.location || '',
      image_url: item.image_url || item.image || '',
      category: item.category || 'Camp',
      is_published: item.is_published !== undefined ? item.is_published : true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.event_date || !formData.location.trim()) {
      alert('Title, date, and location are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, formData);
      } else {
        await eventService.createEvent(formData);
      }
      setIsModalOpen(false);
      await fetchEvents();
    } catch (err) {
      alert(`Failed to save event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      await eventService.toggleEventPublish(item.id, !item.is_published);
      await fetchEvents();
    } catch (err) {
      alert(`Failed to toggle publish status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await eventService.deleteEvent(deletingId);
      setDeletingId(null);
      await fetchEvents();
    } catch (err) {
      alert(`Failed to delete event: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Event / Camp Title',
      render: (row) => (
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-[#E2E8F0]">
            <img
              src={
                row.image_url ||
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200'
              }
              alt={row.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-[#0F172A] block leading-snug">{row.title}</span>
            <span className="text-xs text-[#059669] font-semibold">{row.category || 'Camp'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Schedule & Location',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-[#0F172A] block flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#059669]" />
            {row.event_date}
          </span>
          <span className="text-[#64748B] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#64748B]" />
            <span className="truncate max-w-[200px]">{row.location}</span>
          </span>
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
            title={row.is_published ? 'Unpublish Event' : 'Publish Event'}
            className={`p-2 rounded-lg transition-colors ${
              row.is_published ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit Event"
            className="p-2 text-[#059669] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeletingId(row.id)}
            title="Delete Event"
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingState message="Loading clinic events & camps..." minHeight="min-h-[400px]" />;
  }

  if (error) {
    return <ErrorState title="Unable to load events" message={error} onRetry={fetchEvents} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Events & Camps Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Schedule community dental screening camps, hygiene awareness drives, and public workshops
          </p>
        </div>
        <Button onClick={handleOpenAdd} variant="primary" size="md" icon={Plus}>
          Create New Event
        </Button>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={events}
        emptyTitle="No Events Scheduled"
        emptyDescription="Create your first community camp or clinical workshop."
        emptyActionLabel="Create Event"
        onEmptyAction={handleOpenAdd}
      />

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Create New Event / Camp'}
        subtitle="Specify event timing, screening location, and description"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Free Dental Screening & Oral Cancer Checkup Camp"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Event Date *
              </label>
              <input
                type="date"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Event Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Kalpana Dental Clinic, Kopargaon"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
              >
                <option value="Camp">Dental Camp</option>
                <option value="Workshop">Workshop & Awareness</option>
                <option value="Screening">School Screening</option>
                <option value="Seminar">Clinical Seminar</option>
              </select>
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
              placeholder="Provide details about what services are provided, who should attend, free screenings..."
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
            />
          </div>

          <ImageUploader
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder="events"
            label="Event Banner Photo"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="event_pub"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="rounded border-[#CBD5E1] text-[#059669] focus:ring-[#059669] w-4 h-4"
            />
            <label htmlFor="event_pub" className="text-xs font-bold text-[#0F172A] cursor-pointer">
              Published (Visible on public Events page)
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
              {saving ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Event"
        message="Are you sure you want to remove this event record?"
        confirmText="Delete Event"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default EventsManager;
