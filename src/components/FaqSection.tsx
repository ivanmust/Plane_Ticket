import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does SkyElite ensure flight safety and pilot certification?',
      a: 'All SkyElite flights adhere to Part 135 FAA and EASA standards with ARG/US Platinum and Wyvern Wingman ratings. Our flight decks are always crewed by two Type-rated Captains with rigorous bi-annual simulator check-rides, maintaining safety standards well exceeding commercial airline averages.',
    },
    {
      q: 'How quickly can an aircraft be dispatched for an urgent flight?',
      a: 'Through our dynamic floating fleet, we guarantee aircraft readiness within 4 hours of signed contract across primary metropolitan areas in North America and Western Europe. For pre-funded Jet Card members, callout times can be as prompt as 2 hours.',
    },
    {
      q: 'Are there hidden repositioning fees or empty-leg penalties?',
      a: 'None. SkyElite operates on a locked, fixed hourly rate structure with zero ferry fees or repositioning charges within our designated Primary Operating Areas. De-icing, fuel, and standard landing permits are fully inclusive.',
    },
    {
      q: 'Can I bring my pets into the passenger cabin?',
      a: 'Yes, unconditionally. Pets travel alongside you in the cabin without crates. Our concierge can arrange bespoke pet dining and veterinary clearance documentation for international border crossings.',
    },
    {
      q: 'What is the policy for flight cancellation or itinerary changes?',
      a: 'Members may cancel or alter departure times with as little as 24 hours notice without penalty on standard domestic routes, ensuring your private schedule stays as agile as your business demands.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase block mb-3">
            Common Inquiries
          </span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-4">
            Frequently Asked <span className="font-semibold text-[#202A36]">Questions</span>
          </h2>
          <p className="text-sm text-gray-600">
            Clear, straightforward answers about our charter operations, safety, and policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-gray-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
