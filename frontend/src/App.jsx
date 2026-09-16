import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { AuthProvider } from './admin/context/AuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Doctors from './pages/Doctors';
import Services from './pages/Services';
import Events from './pages/Events';
import GalleryPage from './pages/GalleryPage';
import Testimonials from './pages/Testimonials';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import ReviewsAndFAQs from './pages/ReviewsAndFAQs';

// Admin Portal Pages & Layout
import AdminLayout from './admin/components/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import DoctorsManager from './admin/pages/DoctorsManager';
import DoctorProfile from './admin/pages/DoctorProfile';
import ServicesManager from './admin/pages/ServicesManager';
import AppointmentsManager from './admin/pages/AppointmentsManager';
import EventsManager from './admin/pages/EventsManager';
import TestimonialsManager from './admin/pages/TestimonialsManager';
import GalleryManager from './admin/pages/GalleryManager';
import MessagesManager from './admin/pages/MessagesManager';
import ClinicSettingsManager from './admin/pages/ClinicSettingsManager';

// Scroll to top automatically on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// Wrapper for Public Pages
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF8] dark:bg-[#120C22] text-[#24153F] dark:text-[#F8F3FF] antialiased font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ScrollToTop />
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/doctors" element={<PublicLayout><Doctors /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
        <Route path="/reviews-faqs" element={<PublicLayout><ReviewsAndFAQs /></PublicLayout>} />
        <Route path="/testimonials" element={<PublicLayout><ReviewsAndFAQs /></PublicLayout>} />
        <Route path="/faqs" element={<PublicLayout><ReviewsAndFAQs /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/appointment" element={<PublicLayout><Appointment /></PublicLayout>} />

        {/* Admin Login Routes & Friendly Aliases */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/staff" element={<Navigate to="/admin/login" replace />} />

        {/* Protected Admin Portal Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<AppointmentsManager />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route
            path="doctors"
            element={
              <ProtectedRoute requiredRole="admin">
                <DoctorsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="services"
            element={
              <ProtectedRoute requiredRole="admin">
                <ServicesManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="events"
            element={
              <ProtectedRoute requiredRole="admin">
                <EventsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="testimonials"
            element={
              <ProtectedRoute requiredRole="admin">
                <TestimonialsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="gallery"
            element={
              <ProtectedRoute requiredRole="admin">
                <GalleryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="messages"
            element={
              <ProtectedRoute requiredRole="admin">
                <MessagesManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute requiredRole="admin">
                <ClinicSettingsManager />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
      </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
