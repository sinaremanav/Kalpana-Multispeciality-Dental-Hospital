import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, LogOut, ExternalLink, Menu, User, ShieldCheck } from 'lucide-react';

export const AdminNavbar = ({ onToggleSidebar }) => {
  const { user, profile, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Sidebar Toggle + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#0F172A] leading-tight block">
                Kalpana Dental Clinic
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] block">
                Management Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right: User Role & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#475569] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors border border-[#E2E8F0]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>

          {/* User Badge */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 sm:border-l border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] flex items-center justify-center font-bold text-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-[#0F172A] block leading-tight">
                {displayName}
              </span>
              <span
                className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                  role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {role || 'Doctor'}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 text-[#64748B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
