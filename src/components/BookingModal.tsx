import React, { useState } from 'react';
import { X, Plane, Calendar, Users, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialJetCategory?: string;
}

interface Airport {
  code: string;
  name: string;
  city: string;
}

const AIRPORTS: Airport[] = [
  { code: 'TEB', name: 'Teterboro Airport', city: 'New York / NJ, USA' },
  { code: 'VNY', name: 'Van Nuys Airport', city: 'Los Angeles, USA' },
  { code: 'OPF', name: 'Miami-Opa Locka Executive', city: 'Miami, USA' },
  { code: 'FAB', name: 'Farnborough Airport', city: 'London, UK' },
  { code: 'LBG', name: 'Le Bourget Airport', city: 'Paris, France' },
  { code: 'NCE', name: 'Nice Côte d’Azur', city: 'Nice / Cannes, France' },
  { code: 'GVA', name: 'Geneva Airport', city: 'Geneva, Switzerland' },
  { code: 'DWC', name: 'Al Maktoum International', city: 'Dubai, UAE' },
];

const JET_CLASSES = [
  {
    id: 'light',
    name: 'Citation CJ4+ (Light)',
    capacity: '6-8 Pax',
    range: '2,165 nm',
    speed: '451 kts',
    hourlyRate: 4800,
  },
  {
    id: 'super-mid',
    name: 'Challenger 350 (Super-Mid)',
    capacity: '9-10 Pax',
    range: '3,200 nm',
    speed: '470 kts',
    hourlyRate: 7200,
  },
  {
    id: 'ultra',
    name: 'Global 7500 (Ultra Long Range)',
    capacity: '14-19 Pax',
    range: '7,700 nm',
    speed: '516 kts',
    hourlyRate: 11500,
  },
];

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialJetCategory }) => {
  const [departure, setDeparture] = useState('TEB');
  const [arrival, setArrival] = useState('VNY');
  const [date, setDate] = useState('2026-10-25');
  const [passengers, setPassengers] = useState(4);
  const [selectedJet, setSelectedJet] = useState(
    initialJetCategory || 'super-mid'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const activeJet = JET_CLASSES.find((j) => j.id === selectedJet) || JET_CLASSES[1];

  // Rough distance calculation simulation
  const estFlightHours = departure === arrival ? 1.5 : (departure === 'TEB' && arrival === 'VNY') || (departure === 'VNY' && arrival === 'TEB') ? 5.2 : 3.5;
  const estimatedCost = Math.round(estFlightHours * activeJet.hourlyRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#202A36] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Plane className="w-5 h-5 text-gray-200" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Reserve SkyElite Charter</h2>
              <p className="text-xs text-gray-300">Guaranteed 4-hour callout • Private FBO Terminal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close booking modal"
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Flight Reservation Initiated</h3>
              <p className="text-sm text-gray-600 max-w-md mb-6">
                Thank you, <span className="font-semibold text-gray-900">{name || 'Guest'}</span>. Your dedicated SkyElite Flight Concierge has received your request and will contact you at <span className="font-semibold text-gray-900">{email || phone || 'your contact'}</span> within 15 minutes with tail assignment details.
              </p>

              <div className="w-full bg-gray-50 rounded-2xl p-4 text-left border border-gray-200/80 mb-6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Route:</span>
                  <span className="font-semibold text-gray-900">{departure} → {arrival}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Aircraft Class:</span>
                  <span className="font-semibold text-gray-900">{activeJet.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Scheduled Departure:</span>
                  <span className="font-semibold text-gray-900">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Total:</span>
                  <span className="font-bold text-[#202A36] text-sm">${estimatedCost.toLocaleString()} USD</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-[#202A36] text-white hover:bg-[#1a2229] transition-colors font-medium text-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Departure & Arrival */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Departure Airport
                  </label>
                  <select
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                  >
                    {AIRPORTS.map((apt) => (
                      <option key={apt.code} value={apt.code}>
                        {apt.code} - {apt.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Arrival Airport
                  </label>
                  <select
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                  >
                    {AIRPORTS.map((apt) => (
                      <option key={apt.code} value={apt.code}>
                        {apt.code} - {apt.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Passengers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>Flight Date</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    <span>Passengers</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max="19"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                    />
                    <span className="text-xs text-gray-500 whitespace-nowrap">Guests</span>
                  </div>
                </div>
              </div>

              {/* Aircraft Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Select Fleet Tier
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {JET_CLASSES.map((jet) => {
                    const isSelected = selectedJet === jet.id;
                    return (
                      <button
                        type="button"
                        key={jet.id}
                        onClick={() => setSelectedJet(jet.id)}
                        className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#202A36] bg-[#202A36]/5 ring-1 ring-[#202A36]'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-xs font-semibold text-gray-900 mb-1">{jet.name}</div>
                        <div className="text-[11px] text-gray-500">{jet.capacity} • {jet.range}</div>
                        <div className="mt-2 text-xs font-bold text-[#202A36]">
                          ${jet.hourlyRate.toLocaleString()}<span className="font-normal text-[10px] text-gray-500">/hr</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Cost Estimate Preview */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Estimated Duration</div>
                  <div className="text-sm font-semibold text-gray-900">{estFlightHours} hrs direct flight</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Estimated Charter Cost</div>
                  <div className="text-lg font-bold text-[#202A36]">${estimatedCost.toLocaleString()} USD</div>
                </div>
              </div>

              {/* Passenger Contact Information */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider block">
                  Passenger / Representative Contact
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Corporate or Personal Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Direct Phone / WhatsApp (Optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                />
              </div>

              {/* Safety Assurance & Submit */}
              <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ARG/US Platinum & Wyvern Wingman Certified</span>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Instant Confirmation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
