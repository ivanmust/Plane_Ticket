import React from 'react';
import { Shield, Sparkles, Dog, Utensils, Zap, HeartHandshake } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'Guaranteed 4-Hour Callout',
      description: 'Your aircraft is wheels-up in as little as 240 minutes from your initial inquiry, anywhere across North America and Europe.',
    },
    {
      icon: Shield,
      title: 'De-Icing & Fuel Protection',
      description: 'Zero surprise invoices. Unlike conventional brokers, SkyElite includes winter de-icing and variable fuel surcharges in your fixed rate.',
    },
    {
      icon: Utensils,
      title: 'Michelin-Caliber Dining',
      description: 'Every flight includes customized culinary experiences prepared by partner private chefs, paired with sommelier-curated grand crus.',
    },
    {
      icon: Dog,
      title: 'Unrestricted Pet Travel',
      description: 'Your four-legged companions travel right by your side in the cabin on bespoke orthopedic bedding with veterinary-approved amenities.',
    },
    {
      icon: Sparkles,
      title: 'Direct Tarmac Valet',
      description: 'Chauffeured vehicle transfers right to the aircraft boarding stairs. Your luggage transitions from trunk to hold without touchpoints.',
    },
    {
      icon: HeartHandshake,
      title: 'Dedicated Aviation Concierge',
      description: 'A single, dedicated aviation director assigned to your account 24/7/365 to handle permits, customs, ground transport, and yacht tenders.',
    },
  ];

  return (
    <section id="benefits" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase block mb-3">
            The SkyElite Advantage
          </span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-4">
            Curated privileges designed for <span className="font-semibold text-[#202A36]">frictionless living</span>.
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Every flight is an orchestrated symphony of discretion, precision, and bespoke luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-[#202A36] shadow-xs flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
