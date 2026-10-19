import React from 'react';
import { Plane, Users, Fuel, Gauge, ArrowUpRight, Box } from 'lucide-react';

interface FleetRatesSectionProps {
  onSelectJet: (jetId: string) => void;
  onOpen3DViewer: () => void;
}

export const FLEET_MODELS = [
  {
    id: 'light',
    name: 'Citation CJ4+ Gen2',
    category: 'Light Jet',
    passengers: '6 - 8 Passengers',
    range: '2,165 nm',
    speed: 'Mach 0.77',
    cabinHeight: '4.8 ft',
    hourlyRate: 4800,
    description: 'Perfect for regional hops and business retreats, combining agile runway access with executive seating.',
    features: ['Fold-out executive tables', 'High-speed Ka-band WiFi', 'Enclosed lavatory', 'Short runway capable'],
  },
  {
    id: 'super-mid',
    name: 'SkyElite Challenger 650X',
    category: 'Super-Midsize Jet',
    passengers: '9 - 12 Passengers',
    range: '4,000 nm',
    speed: 'Mach 0.82',
    cabinHeight: '6.1 ft stand-up',
    hourlyRate: 7200,
    popular: true,
    description: 'Our flagship super-midsize with an expansive wide-body cabin, full galley, and coast-to-coast transcontinental reach.',
    features: ['Direct transcontinental range', 'Full gourmet galley', 'True stand-up cabin', 'Ultra-quiet acoustics'],
  },
  {
    id: 'ultra',
    name: 'Global 7500 Express',
    category: 'Ultra Long Range',
    passengers: '14 - 19 Passengers',
    range: '7,700 nm',
    speed: 'Mach 0.90',
    cabinHeight: '6.3 ft master suite',
    hourlyRate: 11500,
    description: 'Four true living spaces including an aft stateroom with permanent bed and en-suite shower for ultra-long-haul journeys.',
    features: ['Four distinct living zones', 'Master suite & shower', 'Crew rest compartment', 'Intercontinental non-stop'],
  },
];

export const FleetRatesSection: React.FC<FleetRatesSectionProps> = ({ onSelectJet, onOpen3DViewer }) => {
  return (
    <section id="rates" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase block mb-3">
              Fleet & Rates
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
              Transparent, guaranteed <span className="font-semibold text-[#202A36]">hourly access</span>.
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={onOpen3DViewer}
              className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Box className="w-4 h-4 text-[#202A36]" />
              <span>Launch 3D Aircraft Studio</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FLEET_MODELS.map((jet) => (
            <div
              key={jet.id}
              className={`bg-white rounded-3xl p-8 border flex flex-col justify-between transition-all duration-300 ${
                jet.popular
                  ? 'border-[#202A36] shadow-xl relative ring-1 ring-[#202A36]'
                  : 'border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              {jet.popular && (
                <div className="absolute -top-3 left-8 px-3 py-1 bg-[#202A36] text-white text-[11px] font-semibold tracking-wider uppercase rounded-full">
                  Most Requested
                </div>
              )}

              <div>
                <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1">
                  {jet.category}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{jet.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">{jet.description}</p>

                <div className="space-y-3 py-4 border-y border-gray-100 text-xs text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" /> Capacity
                    </span>
                    <span className="font-semibold text-gray-900">{jet.passengers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Fuel className="w-4 h-4" /> Max Range
                    </span>
                    <span className="font-semibold text-gray-900">{jet.range}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Gauge className="w-4 h-4" /> Max Cruise Speed
                    </span>
                    <span className="font-semibold text-gray-900">{jet.speed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <Plane className="w-4 h-4" /> Cabin Height
                    </span>
                    <span className="font-semibold text-gray-900">{jet.cabinHeight}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-1.5">
                  {jet.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#202A36]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-gray-400 uppercase">Charter Rate</div>
                  <div className="text-2xl font-bold text-[#202A36]">
                    ${jet.hourlyRate.toLocaleString()}
                    <span className="text-xs font-normal text-gray-500"> / hr</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectJet(jet.id)}
                  className="px-4 py-2 rounded-full bg-[#202A36] text-white hover:bg-[#1a2229] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Book Jet</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
