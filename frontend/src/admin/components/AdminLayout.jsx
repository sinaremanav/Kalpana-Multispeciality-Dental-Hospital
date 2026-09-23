import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { isSupabaseConfigured } from '../../lib/supabaseClient';
import { AlertCircle } from 'lucide-react';
import SEO from '../../components/SEO';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      <SEO title="Admin Portal | Kalpana Multispeciality Dental Hospital" noIndex={true} />
      <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {!isSupabaseConfigured && (
        <div className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>
            Supabase is running in offline preview mode. Add <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in your frontend .env file to enable live sync.
          </span>
        </div>
      )}

      <div className="flex-1 flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
