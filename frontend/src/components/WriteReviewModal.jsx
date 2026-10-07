import React, { useState } from 'react';
import { Star, X, CheckCircle2, Loader2, Sparkles, User, MapPin, Stethoscope } from 'lucide-react';
import { testimonialService } from '../services/testimonialService';

const TREATMENTS = [
  'RCT (Root Canal) Treatment',
  'Teeth Cleaning & Scaling',
  'Dental Implants',
  'Fixed Prosthodontics & Crowns',
  'Braces & Clear Aligners',
  'Teeth Whitening',
  'Painless Tooth Extraction',
  'Cosmetic Dentistry',
  'Pediatric Dental Care',
  'General Consultation & Checkup',
];

const RATING_LABELS = {
  5: 'Outstanding & Painless Treatment (5/5)',
  4: 'Very Good Experience (4/5)',
  3: 'Satisfactory Care (3/5)',
  2: 'Fair Experience (2/5)',
  1: 'Needs Improvement (1/5)',
};

export const WriteReviewModal = ({ isOpen, onClose, onReviewAdded }) => {
  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [treatment, setTreatment] = useState('RCT (Root Canal) Treatment');
  const [customTreatment, setCustomTreatment] = useState('');
  const [location, setLocation] = useState('Kopargaon');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMsg('Please write at least 10 characters describing your experience.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const selectedTreatment =
        treatment === 'Other' && customTreatment.trim()
          ? customTreatment.trim()
          : treatment;

      const reviewData = {
        patient_name: patientName.trim(),
        name: patientName.trim(),
        rating,
        treatment: selectedTreatment,
        location: location.trim() || 'Kopargaon',
        message: message.trim(),
        comment: message.trim(),
        is_published: false, // Default to unpublished so admin can review and approve
      };

      const result = await testimonialService.createTestimonial(reviewData);

      setSuccess(true);
      if (onReviewAdded) {
        onReviewAdded(result);
      }

      setTimeout(() => {
        setSuccess(false);
        setPatientName('');
        setMessage('');
        setCustomTreatment('');
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setErrorMsg(err.message || 'Unable to submit review right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#059669] mx-auto flex items-center justify-center border-2 border-[#A7F3D0]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pending Admin Approval</span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">
              Thank You for Your Feedback!
            </h3>
            <p className="text-[#475569] text-sm max-w-sm mx-auto leading-relaxed">
              Your review has been successfully submitted to the clinic team. Once verified and approved by the administrator, it will be published to the public website.
            </p>
            <div className="flex items-center justify-center gap-1 text-amber-400 pt-1">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] border border-[#D1FAE5]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Patient Experience</span>
              </span>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight mt-2">
                Share Your Experience
              </h2>
              <p className="text-[#64748B] text-xs sm:text-sm mt-1">
                Rate your consultation or treatment with Dr. Nikhil Hiralal Mahanubhav at Kalpana Dental Hospital.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-2">
                  Your Overall Rating *
                </label>
                <div className="flex items-center gap-1.5 mb-1.5">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isFilled =
                      hoverRating >= starValue || (!hoverRating && rating >= starValue);
                    return (
                      <button
                        type="button"
                        key={starValue}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-120 cursor-pointer focus:outline-none"
                        aria-label={`Rate ${starValue} stars`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 stroke-[1.5]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-semibold text-[#059669]">
                  {RATING_LABELS[hoverRating || rating]}
                </p>
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Rameshwar Shinde"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              </div>

              {/* Treatment and Location in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                    Treatment Received
                  </label>
                  <div className="relative">
                    <Stethoscope className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={treatment}
                      onChange={(e) => setTreatment(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#CBD5E1] text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    >
                      {TREATMENTS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                      <option value="Other">Other Procedure</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                    Location / City
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Kopargaon / Shirdi"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                    />
                  </div>
                </div>
              </div>

              {treatment === 'Other' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                    Specify Procedure
                  </label>
                  <input
                    type="text"
                    value={customTreatment}
                    onChange={(e) => setCustomTreatment(e.target.value)}
                    placeholder="Enter treatment name"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              )}

              {/* Review Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                  Your Feedback / Comment *
                </label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your treatment experience, clinic hygiene, doctor's explanation, pain level..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 fill-white" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default WriteReviewModal;
