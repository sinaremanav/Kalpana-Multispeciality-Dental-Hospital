import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { serviceService } from '../../services/serviceService';
import { eventService } from '../../services/eventService';
import { contactService } from '../../services/contactService';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Briefcase,
  Sparkles,
  Inbox,
  ArrowRight,
  UserCheck,
  Eye,
} from 'lucide-react';

export const Dashboard = () => {
  const { profile, user, isAdmin, isDoctor } = useAuth();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    totalDoctors: 0,
    totalServices: 0,
    upcomingEvents: 0,
    unreadMessages: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        appointmentMetrics,
        appointmentsList,
        doctorsList,
        servicesList,
        eventsData,
        unreadCount,
        messagesList,
      ] = await Promise.all([
        appointmentService.getMetrics(),
        appointmentService.getAppointments({ status: 'all' }),
        doctorService.getDoctors(false),
        serviceService.getServices(false),
        eventService.getCategorizedEvents(),
        contactService.getUnreadCount(),
        contactService.getMessages('all'),
      ]);

      setStats({
        totalAppointments: appointmentMetrics.total,
        pendingAppointments: appointmentMetrics.pending,
        confirmedAppointments: appointmentMetrics.confirmed,
        totalDoctors: doctorsList.length,
        totalServices: servicesList.length,
        upcomingEvents: eventsData.upcoming.length,
        unreadMessages: unreadCount,
      });

      setRecentAppointments(appointmentsList.slice(0, 5));
      setRecentMessages(messagesList.slice(0, 4));
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Doctor';

  if (loading) {
    return <LoadingState message="Loading clinic administration metrics..." minHeight="min-h-[400px]" />;
  }

  if (error) {
    return <ErrorState title="Unable to load dashboard" message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#059669] to-[#047857] rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            {isAdmin ? 'System Administrator' : 'Doctor Portal'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            {isAdmin
              ? 'Real-time overview of your patient appointments, doctor availability, dental services, and inquiries.'
              : 'View and manage your patient appointments and update your personal clinical doctor profile.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/appointments"
            className="px-4 py-2.5 bg-white text-[#059669] hover:bg-blue-50 text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Appointments</span>
          </Link>
          {isDoctor && (
            <Link
              to="/admin/profile"
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>My Profile</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          title="Pending Appointments"
          value={stats.pendingAppointments}
          subtitle="Awaiting doctor confirmation"
          icon={Clock}
          color="amber"
          linkTo="/admin/appointments"
          index={0}
        />
        <DashboardCard
          title="Confirmed Appointments"
          value={stats.confirmedAppointments}
          subtitle="Ready for treatment"
          icon={CheckCircle2}
          color="emerald"
          linkTo="/admin/appointments"
          index={1}
        />
        <DashboardCard
          title="Total Appointments"
          value={stats.totalAppointments}
          subtitle="All patient bookings"
          icon={Calendar}
          color="blue"
          linkTo="/admin/appointments"
          index={2}
        />
        <DashboardCard
          title="Unread Messages"
          value={stats.unreadMessages}
          subtitle="Patient inquiries"
          icon={Inbox}
          color="rose"
          linkTo={isAdmin ? '/admin/messages' : null}
          index={3}
        />
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <DashboardCard
            title="Active Doctors"
            value={stats.totalDoctors}
            subtitle="Clinical specialists"
            icon={Users}
            color="purple"
            linkTo="/admin/doctors"
            index={4}
          />
          <DashboardCard
            title="Dental Services"
            value={stats.totalServices}
            subtitle="Active treatments"
            icon={Briefcase}
            color="blue"
            linkTo="/admin/services"
            index={5}
          />
          <DashboardCard
            title="Upcoming Camps"
            value={stats.upcomingEvents}
            subtitle="Community initiatives"
            icon={Sparkles}
            color="emerald"
            linkTo="/admin/events"
            index={6}
          />
        </div>
      )}

      {/* Two-column Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-saas">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Recent Appointments</h3>
              <p className="text-xs text-[#64748B]">Latest booking requests received</p>
            </div>
            <Link
              to="/admin/appointments"
              className="text-xs font-bold text-[#059669] hover:text-[#047857] flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No Appointments Yet"
              description="New appointment bookings submitted by patients will show up here."
            />
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A] truncate">{apt.patient_name}</h4>
                    <p className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                      <span>{apt.service_name || 'General Dental'}</span>
                      <span>•</span>
                      <span>{apt.appointment_date} ({apt.time_display || apt.appointment_time})</span>
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <StatusBadge status={apt.status} />
                    <Link
                      to="/admin/appointments"
                      className="p-1.5 text-[#64748B] hover:text-[#059669] hover:bg-[#F8FAFC] rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-saas">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Contact Inquiries</h3>
              <p className="text-xs text-[#64748B]">Messages from website visitors</p>
            </div>
            {isAdmin && (
              <Link
                to="/admin/messages"
                className="text-xs font-bold text-[#059669] hover:text-[#047857] flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentMessages.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No Inquiries"
              description="Questions submitted through the contact form will appear here."
            />
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="py-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-[#0F172A]">{msg.name}</h4>
                    <StatusBadge status={msg.status} />
                  </div>
                  <p className="text-xs text-[#475569] line-clamp-2">{msg.message}</p>
                  <span className="text-[10px] text-[#94A3B8] block mt-1">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
