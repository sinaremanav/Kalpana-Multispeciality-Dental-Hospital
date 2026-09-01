import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { authService } from '../../services/authService';
import ImageUploader from '../components/ImageUploader';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import { CheckCircle2, User, Save, ShieldCheck, Mail, Phone, Award } from 'lucide-react';

export const DoctorProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [doctorRecord, setDoctorRecord] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    bio: '',
    phone: '',
    email: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const fetchDoctorProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user) return;

      // 1. Try to find doctor record linked to user_id
      let doc = await doctorService.getDoctorByUserId(user.id);

      // 2. If not found by user_id, try matching by email or fetch first doctor
      if (!doc && user.email) {
        const allDocs = await doctorService.getDoctors(false);
        doc = allDocs.find((d) => d.email?.toLowerCase() === user.email.toLowerCase()) || allDocs[0];
      }

      if (doc) {
        setDoctorRecord(doc);
        setFormData({
          name: doc.name || profile?.full_name || '',
          specialization: doc.specialization || '',
          qualification: doc.qualification || '',
          experience: doc.experience || '',
          bio: doc.bio || '',
          phone: doc.phone || '',
          email: doc.email || user.email || '',
          image_url: doc.image_url || doc.image || '',
        });
      } else {
        setFormData({
          name: profile?.full_name || user.email?.split('@')[0] || '',
          specialization: 'Dental Surgeon',
          qualification: 'BDS',
          experience: '',
          bio: '',
          phone: '',
          email: user.email || '',
          image_url: '',
        });
      }
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
      setError(err.message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setError(null);

    try {
      // 1. Update user profile name
      if (user) {
        await authService.updateProfile(user.id, { full_name: formData.name });
        await refreshProfile();
      }

      // 2. Update or create doctor record strictly for this user
      if (doctorRecord) {
        await doctorService.updateDoctor(doctorRecord.id, {
          ...formData,
          user_id: user?.id,
        });
      } else {
        const created = await doctorService.createDoctor({
          ...formData,
          user_id: user?.id,
        });
        setDoctorRecord(created);
      }

      setSuccessMessage('Your doctor profile has been updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error saving doctor profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your clinical profile..." minHeight="min-h-[400px]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          My Clinical Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Update your public profile, qualifications, clinical biography, and contact details
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm font-semibold text-emerald-800 flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm font-semibold text-rose-800 flex items-center gap-2.5">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-saas space-y-6">
        {/* Doctor Header Preview */}
        <div className="flex items-center gap-5 pb-6 border-b border-[#F1F5F9]">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-[#E2E8F0] overflow-hidden shrink-0">
            <img
              src={
                formData.image_url ||
                'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300'
              }
              alt="Doctor Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">{formData.name || 'Doctor'}</h3>
            <span className="text-xs font-semibold text-[#2563EB] block">
              {formData.specialization || 'Clinical Specialist'}
            </span>
            <span className="text-[11px] text-[#64748B] block mt-0.5">
              Account: {user?.email}
            </span>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Dr. Nikhil Hiralal Mahanubhav"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Specialization *
            </label>
            <input
              type="text"
              required
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="Chief Dental Surgeon & Implantologist"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Degrees & Qualifications *
            </label>
            <input
              type="text"
              required
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="BDS, MDS (Oral & Maxillofacial Surgery)"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Clinical Experience
            </label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="4+ Years Clinical Experience"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Contact Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 94211 46623"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="doctor@kalpanadental.com"
              className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
            Clinical Biography & Patient Care Philosophy
          </label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Describe your surgical experience, background, painless techniques..."
            className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        {/* Profile Image Uploader */}
        <ImageUploader
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
          folder="doctors"
          label="Profile Photo"
          helpText="Upload a professional doctor photo (JPG, PNG, WebP)."
        />

        <div className="pt-4 border-t border-[#F1F5F9] flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            disabled={saving}
          >
            {saving ? 'Updating Profile...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DoctorProfile;
