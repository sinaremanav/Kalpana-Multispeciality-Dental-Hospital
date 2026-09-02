import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Clock3,
  Trash2,
  Eye,
  MessageCircle,
  Filter,
} from 'lucide-react';

export const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Details Modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Delete Dialog
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await appointmentService.getAppointments({ status: statusFilter });
      setAppointments(list);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Unable to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(id, newStatus);
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment((prev) => ({ ...prev, status: newStatus }));
      }
      await fetchAppointments();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await appointmentService.deleteAppointment(deletingId);
      setDeletingId(null);
      if (selectedAppointment?.id === deletingId) {
        setIsDetailsOpen(false);
      }
      await fetchAppointments();
    } catch (err) {
      alert(`Failed to delete appointment: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredData = appointments.filter((apt) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      apt.patient_name?.toLowerCase().includes(query) ||
      apt.patient_phone?.includes(query) ||
      apt.service_name?.toLowerCase().includes(query) ||
      apt.doctor_name?.toLowerCase().includes(query)
    );
  });

  const columns = [
    {
      header: 'Patient Details',
      render: (row) => (
        <div>
          <span className="font-bold text-[#0F172A] block">{row.patient_name}</span>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#059669]" />
              {row.patient_phone}
            </span>
            {row.patient_email && (
              <span className="hidden sm:inline text-slate-400">| {row.patient_email}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Service & Doctor',
      render: (row) => (
        <div className="text-xs">
          <span className="font-bold text-[#0F172A] block">{row.service_name || 'General Dental'}</span>
          <span className="text-[#059669] font-semibold">{row.doctor_name || 'Assigned Specialist'}</span>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      render: (row) => (
        <div className="text-xs">
          <span className="font-bold text-[#0F172A] block flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#059669]" />
            {row.appointment_date}
          </span>
          <span className="text-[#64748B] flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {row.time_display || row.appointment_time}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className="text-xs font-semibold px-2 py-1 border border-[#CBD5E1] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#059669]"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => {
              setSelectedAppointment(row);
              setIsDetailsOpen(true);
            }}
            title="View Details"
            className="p-1.5 text-[#059669] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDeletingId(row.id)}
            title="Delete Appointment"
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Appointments Management
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Review patient booking requests, confirm schedules, and update consultation statuses
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, phone, doctor..."
            className="w-full px-3.5 py-2 text-xs border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
              statusFilter === status
                ? 'bg-[#059669] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] bg-white border border-[#E2E8F0]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      {error ? (
        <ErrorState title="Unable to load appointments" message={error} onRetry={fetchAppointments} />
      ) : (
        <AdminTable
          columns={columns}
          data={filteredData}
          loading={loading}
          emptyTitle="No Appointments Found"
          emptyDescription="No patient appointment bookings match the selected status filter."
        />
      )}

      {/* Appointment Details Modal */}
      <AdminModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Appointment Details"
        subtitle={`Booking Ref: ${selectedAppointment?.id}`}
      >
        {selectedAppointment && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  {selectedAppointment.patient_name}
                </h3>
                <span className="text-xs text-[#64748B]">
                  Booked on {new Date(selectedAppointment.created_at).toLocaleDateString()}
                </span>
              </div>
              <StatusBadge status={selectedAppointment.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-xl space-y-1.5 border border-[#E2E8F0]">
                <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] block">
                  Patient Info
                </span>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#059669]" />
                  <a href={`tel:${selectedAppointment.patient_phone}`} className="font-semibold text-[#059669]">
                    {selectedAppointment.patient_phone}
                  </a>
                </p>
                {selectedAppointment.patient_email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>{selectedAppointment.patient_email}</span>
                  </p>
                )}
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl space-y-1.5 border border-[#E2E8F0]">
                <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] block">
                  Clinical Details
                </span>
                <p>
                  <strong className="text-[#64748B]">Treatment:</strong>{' '}
                  <span className="font-bold text-[#0F172A]">{selectedAppointment.service_name}</span>
                </p>
                <p>
                  <strong className="text-[#64748B]">Doctor:</strong>{' '}
                  <span className="font-bold text-[#059669]">{selectedAppointment.doctor_name}</span>
                </p>
                <p>
                  <strong className="text-[#64748B]">Schedule:</strong>{' '}
                  <span>{selectedAppointment.appointment_date} @ {selectedAppointment.time_display || selectedAppointment.appointment_time}</span>
                </p>
              </div>
            </div>

            {selectedAppointment.message && (
              <div className="p-3.5 bg-blue-50/50 border border-emerald-100 rounded-xl text-xs">
                <span className="font-bold text-[#0F172A] block mb-1">Patient Note:</span>
                <p className="text-[#475569] leading-relaxed">{selectedAppointment.message}</p>
              </div>
            )}

            {/* Quick Status Toggle */}
            <div className="pt-3 border-t border-[#F1F5F9] space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Change Status
              </span>
              <div className="flex flex-wrap gap-2">
                {['pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedAppointment.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                      selectedAppointment.status === st
                        ? 'bg-[#059669] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp Direct Reply */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${selectedAppointment.patient_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedAppointment.patient_name}, regarding your appointment booking at Kalpana Dental Clinic for ${selectedAppointment.service_name} on ${selectedAppointment.appointment_date} at ${selectedAppointment.time_display || selectedAppointment.appointment_time}: Your appointment is ${selectedAppointment.status.toUpperCase()}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Patient on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Appointment"
        message="Are you sure you want to permanently delete this appointment record?"
        confirmText="Delete Appointment"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default AppointmentsManager;
