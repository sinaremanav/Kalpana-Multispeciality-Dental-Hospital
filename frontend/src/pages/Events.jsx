import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import SectionTitle from '../components/SectionTitle';
import CTASection from '../components/CTASection';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import SEO from '../components/SEO';
import { eventService } from '../services/eventService';
import { Calendar, Sparkles } from 'lucide-react';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState({ upcoming: [], past: [], all: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const categorized = await eventService.getCategorizedEvents();
      setEvents(categorized);
    } catch (err) {
      console.error('Failed to load events:', err);
      setError(err.message || 'Unable to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const displayedEvents =
    activeTab === 'upcoming'
      ? events.upcoming
      : activeTab === 'past'
      ? events.past
      : events.all;

  return (
    <div className="pt-20">
      <SEO
        page="events"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Camps & Events", url: "/events" },
        ]}
      />

      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] rounded-full border border-[#D1FAE5]">
            <Sparkles className="w-3.5 h-3.5" />
            Community Healthcare & Camps
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Dental Camps & Events
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Join our free community dental screening camps, oral hygiene awareness workshops, and healthcare initiatives.
          </p>

          {/* Filter Tabs */}
          <div className="inline-flex items-center gap-1 p-1 bg-white rounded-xl shadow-saas mt-8 border border-[#E2E8F0]">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              Upcoming Camps ({events.upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'past'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              Past Initiatives ({events.past.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              All Events ({events.all.length})
            </button>
          </div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="py-20 md:py-24 bg-white min-h-[400px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingState message="Loading clinic events and camps..." minHeight="min-h-[300px]" />
          ) : error ? (
            <ErrorState
              title="Unable to load events"
              message={error}
              onRetry={fetchEvents}
            />
          ) : displayedEvents.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title={
                activeTab === 'upcoming'
                  ? 'No Upcoming Events Scheduled'
                  : activeTab === 'past'
                  ? 'No Past Events Recorded'
                  : 'No Events Found'
              }
              description={
                activeTab === 'upcoming'
                  ? 'Stay tuned! We will be announcing new community dental screening camps and workshops shortly.'
                  : 'Past healthcare events will be recorded here.'
              }
              actionLabel="Contact Clinic for Camp Inquiries"
              actionTo="/contact"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  isPast={new Date(event.event_date) < new Date(new Date().toDateString())}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Events;
