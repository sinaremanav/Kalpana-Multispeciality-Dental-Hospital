import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Briefcase,
  Sparkles,
  MessageSquareQuote,
  Image,
  Inbox,
  Settings,
  UserCheck,
  X,
} from 'lucide-react';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { isAdmin, isDoctor, role } = useAuth();

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Doctors', path: '/admin/doctors', icon: Users },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Events & Camps', path: '/admin/events', icon: Sparkles },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Gallery', path: '/admin/gallery', icon: Image },
    { label: 'Messages', path: '/admin/messages', icon: Inbox },
    { label: 'Clinic Settings', path: '/admin/settings', icon: Settings },
    { label: 'My Profile', path: '/admin/profile', icon: UserCheck },
  ];

  const doctorNavItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'My Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'My Doctor Profile', path: '/admin/profile', icon: UserCheck },
  ];

  const items = isAdmin ? adminNavItems : doctorNavItems;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#0F172A]/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E2E8F0] transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col justify-between p-4">
          <div>
            {/* Mobile Header in Sidebar */}
            <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-[#E2E8F0]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Navigation Menu
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-3 mb-2">
              {isAdmin ? 'Clinic Administration' : 'Doctor Portal'}
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#059669] text-white shadow-xs'
                          : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-center">
            <span className="text-[11px] font-bold text-[#0F172A] block">
              Kalpana Dental Clinic
            </span>
            <span className="text-[10px] text-[#64748B] block mt-0.5">
              Supabase v2 Protected
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
