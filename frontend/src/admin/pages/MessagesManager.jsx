import React, { useState, useEffect } from 'react';
import { contactService } from '../../services/contactService';
import AdminTable from '../components/AdminTable';
import AdminModal from '../components/AdminModal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import {
  Inbox,
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Eye,
  Trash2,
  CheckCircle,
} from 'lucide-react';

export const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Details Modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Delete Dialog
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await contactService.getMessages(statusFilter);
      setMessages(list);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Unable to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await contactService.updateMessageStatus(id, newStatus);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
      }
      await fetchMessages();
    } catch (err) {
      alert(`Failed to update message status: ${err.message}`);
    }
  };

  const handleOpenDetails = async (msg) => {
    setSelectedMessage(msg);
    setIsDetailsOpen(true);
    if (msg.status === 'unread') {
      await handleStatusChange(msg.id, 'read');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await contactService.deleteMessage(deletingId);
      setDeletingId(null);
      if (selectedMessage?.id === deletingId) {
        setIsDetailsOpen(false);
      }
      await fetchMessages();
    } catch (err) {
      alert(`Failed to delete message: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Sender Information',
      render: (row) => (
        <div>
          <span className={`font-bold block ${row.status === 'unread' ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
            {row.name}
          </span>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#2563EB]" />
              {row.phone}
            </span>
            {row.email && (
              <span className="hidden sm:inline text-slate-400">| {row.email}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Subject & Message',
      render: (row) => (
        <div className="text-xs max-w-sm">
          <span className="font-bold text-[#0F172A] block">{row.subject || 'General Inquiry'}</span>
          <p className="text-[#64748B] line-clamp-1 mt-0.5">{row.message}</p>
        </div>
      ),
    },
    {
      header: 'Received Date',
      render: (row) => (
        <span className="text-xs text-[#64748B]">
          {new Date(row.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
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
            className="text-xs font-semibold px-2 py-1 border border-[#CBD5E1] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>

          <button
            onClick={() => handleOpenDetails(row)}
            title="Read Inquiry"
            className="p-1.5 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDeletingId(row.id)}
            title="Delete Message"
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
            Contact Messages & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Review patient questions submitted via the public contact form and respond via WhatsApp or Email
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
        {['all', 'unread', 'read', 'replied'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
              statusFilter === status
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A] bg-white border border-[#E2E8F0]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      {error ? (
        <ErrorState title="Unable to load messages" message={error} onRetry={fetchMessages} />
      ) : (
        <AdminTable
          columns={columns}
          data={messages}
          loading={loading}
          emptyTitle="No Contact Inquiries"
          emptyDescription="No patient inquiry messages found in this category."
        />
      )}

      {/* Details Modal */}
      <AdminModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Contact Inquiry Details"
        subtitle={`Inquiry Ref: ${selectedMessage?.id}`}
      >
        {selectedMessage && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">{selectedMessage.name}</h3>
                <span className="text-xs text-[#64748B]">
                  Received on {new Date(selectedMessage.created_at).toLocaleString()}
                </span>
              </div>
              <StatusBadge status={selectedMessage.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-xl space-y-1.5 border border-[#E2E8F0]">
                <strong className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] block">
                  Sender Contact
                </strong>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                  <a href={`tel:${selectedMessage.phone}`} className="font-semibold text-[#2563EB]">
                    {selectedMessage.phone}
                  </a>
                </p>
                {selectedMessage.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#64748B]" />
                    <a href={`mailto:${selectedMessage.email}`} className="text-[#64748B] hover:text-[#2563EB]">
                      {selectedMessage.email}
                    </a>
                  </p>
                )}
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl space-y-1.5 border border-[#E2E8F0]">
                <strong className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] block">
                  Subject
                </strong>
                <p className="font-semibold text-[#0F172A]">{selectedMessage.subject || 'General Inquiry'}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                Full Inquiry Message:
              </span>
              <p className="text-sm text-[#0F172A] whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>

            {/* Quick Status */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#64748B]">Mark As:</span>
                {['unread', 'read', 'replied'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedMessage.id, st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                      selectedMessage.status === st
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedMessage.name}, thank you for contacting Kalpana Dental Clinic regarding "${selectedMessage.subject || 'your inquiry'}". How can we assist you further?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reply via WhatsApp</span>
              </a>

              {selectedMessage.email && (
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Inquiry at Kalpana Dental Clinic')}`}
                  onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                  className="py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
              )}
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Delete Message"
        message="Are you sure you want to permanently delete this contact message?"
        confirmText="Delete Message"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default MessagesManager;
