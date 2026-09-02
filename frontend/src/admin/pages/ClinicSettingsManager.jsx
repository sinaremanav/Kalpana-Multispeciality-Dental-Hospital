import React, { useState, useEffect } from 'react';
import { clinicService } from '../../services/clinicService';
import ImageUploader from '../components/ImageUploader';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Button from '../../components/Button';
import { Settings, Save, CheckCircle2, Building, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';

export const ClinicSettingsManager = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    clinicName: '',
    tagline: '',
    subTagline: '',
    phone: '',
    displayPhone: '',
    whatsappNumber: '',
    email: '',
    address: '',
    landmark: '',
    workingHoursWeekdays: '',
    workingHoursSunday: '',
    googleMapsUrl: '',
    googleMapsEmbed: '',
    instagramUrl: '',
    facebookUrl: '',
    youtubeUrl: '',
    linkedinUrl: '',
    aboutText: '',
    logoUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clinicService.getClinicSettings();
      setSettings(data);
      setFormData({
        clinicName: data.clinicName || '',
        tagline: data.tagline || '',
        subTagline: data.subTagline || '',
        phone: data.phone || '',
        displayPhone: data.displayPhone || '',
        whatsappNumber: data.whatsappNumber || '',
        email: data.email || '',
        address: data.address || '',
        landmark: data.landmark || '',
        workingHoursWeekdays: data.workingHours?.weekdays || 'Monday – Saturday: 9:00 AM – 8:00 PM',
        workingHoursSunday: data.workingHours?.sunday || 'Sunday: By Prior Appointment Only',
        googleMapsUrl: data.googleMapsUrl || '',
        googleMapsEmbed: data.googleMapsEmbed || '',
        instagramUrl: data.socials?.instagram || '',
        facebookUrl: data.socials?.facebook || '',
        youtubeUrl: data.socials?.youtube || '',
        linkedinUrl: data.socials?.linkedin || '',
        aboutText: data.aboutText || '',
        logoUrl: data.logoUrl || '',
      });
    } catch (err) {
      console.error('Error loading clinic settings:', err);
      setError(err.message || 'Unable to load clinic configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setError(null);

    const payload = {
      clinicName: formData.clinicName,
      tagline: formData.tagline,
      subTagline: formData.subTagline,
      phone: formData.phone,
      displayPhone: formData.displayPhone,
      whatsappNumber: formData.whatsappNumber,
      email: formData.email,
      address: formData.address,
      landmark: formData.landmark,
      workingHours: {
        weekdays: formData.workingHoursWeekdays,
        sunday: formData.workingHoursSunday,
      },
      socials: {
        instagram: formData.instagramUrl,
        facebook: formData.facebookUrl,
        youtube: formData.youtubeUrl,
        linkedin: formData.linkedinUrl,
      },
      googleMapsUrl: formData.googleMapsUrl,
      googleMapsEmbed: formData.googleMapsEmbed,
      aboutText: formData.aboutText,
      logoUrl: formData.logoUrl,
    };

    try {
      await clinicService.updateClinicSettings(settings?.id, payload);
      setSuccessMessage('Clinic settings updated successfully! Public pages will reflect changes immediately.');
      setTimeout(() => setSuccessMessage(''), 4000);
      await fetchSettings();
    } catch (err) {
      console.error('Error saving clinic settings:', err);
      setError(err.message || 'Failed to update settings in Supabase');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading clinic configuration..." minHeight="min-h-[400px]" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          Clinic Settings & Information
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B]">
          Configure clinic branding, contact phone numbers, operating hours, and location for the entire website
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-saas space-y-8">
        {/* Section 1: General Info */}
        <div>
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2 mb-4 pb-2 border-b border-[#F1F5F9]">
            <Building className="w-4 h-4 text-[#059669]" />
            Clinic Branding & Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Clinic Name *
              </label>
              <input
                type="text"
                required
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Advanced & Painless Dental Care in Kopargaon"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Sub-Tagline / Hero Description
              </label>
              <input
                type="text"
                value={formData.subTagline}
                onChange={(e) => setFormData({ ...formData, subTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Phone */}
        <div>
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2 mb-4 pb-2 border-b border-[#F1F5F9]">
            <Phone className="w-4 h-4 text-[#059669]" />
            Contact & WhatsApp
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Primary Phone *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 94211 46623"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Display Phone String
              </label>
              <input
                type="text"
                value={formData.displayPhone}
                onChange={(e) => setFormData({ ...formData, displayPhone: e.target.value })}
                placeholder="+91 94211 46623 / +91 89995 77794"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                WhatsApp Number (Digits only with country code) *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="919421146623"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@kalpanadental.com"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Operating Hours & Location */}
        <div>
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2 mb-4 pb-2 border-b border-[#F1F5F9]">
            <Clock className="w-4 h-4 text-[#059669]" />
            Location & Operating Hours
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                  Full Physical Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Gandhi Statue Near Sudesh Picture Palace, Main Road Kopargaon, Maharashtra"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                  Landmark
                </label>
                <textarea
                  rows={2}
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="Near Sudesh Picture Palace & Gandhi Statue"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                  Weekday Hours
                </label>
                <input
                  type="text"
                  value={formData.workingHoursWeekdays}
                  onChange={(e) => setFormData({ ...formData, workingHoursWeekdays: e.target.value })}
                  placeholder="Monday – Saturday: 9:00 AM – 8:00 PM"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                  Sunday Hours
                </label>
                <input
                  type="text"
                  value={formData.workingHoursSunday}
                  onChange={(e) => setFormData({ ...formData, workingHoursSunday: e.target.value })}
                  placeholder="Sunday: By Prior Appointment Only"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Google Maps Link (Direct Direction URL)
              </label>
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                placeholder="https://www.google.com/maps?q=19.8808333,74.4790833"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Social Media Links */}
        <div>
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2 mb-4 pb-2 border-b border-[#F1F5F9]">
            <Globe className="w-4 h-4 text-[#059669]" />
            Social Media Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/kalpanadental"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                Facebook Profile URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/kalpanadental"
                className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F1F5F9] flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            disabled={saving}
          >
            {saving ? 'Saving Settings...' : 'Save Clinic Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClinicSettingsManager;
