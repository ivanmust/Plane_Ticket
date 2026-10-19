import React from 'react';
import { Compass, Award, Clock, Globe } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase block mb-3">
              Our Heritage & Philosophy
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 mb-6">
              Aviation reimagined for those who value <span className="font-semibold text-[#202A36]">every second</span>.
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              Founded on the belief that private aviation should be both uncompromisingly luxurious and intuitively accessible, SkyElite unites industry-leading safety standards with state-of-the-art avionics.
            </p>
            <p className="text-base text-gray-600 leading-relaxed mb-8">
              Whether you are bridging continents for board meetings, whisking your family to St. Moritz, or requiring an immediate 4-hour departure, our fleet of Bombardier, Gulfstream, and Cessna aircraft stands primed worldwide.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <div>
                <div className="text-3xl font-bold text-[#202A36] tracking-tight">99.8%</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Dispatch Reliability</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#202A36] tracking-tight">4,800+</div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Airports Accessible</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-between h-56">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#202A36]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Time Sovereignty</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bypass commercial terminal queues. Board within 12 minutes of arriving at the private tarmac.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-between h-56">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#202A36]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Platinum Standards</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Dual-captain crews with an average of 8,500+ flight hours and bi-annual simulator drills.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-between h-56">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#202A36]">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Global Range</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Direct non-stop links between New York and London, Tokyo and San Francisco, or Dubai and Paris.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col justify-between h-56">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#202A36]">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Bespoke Concierge</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  From Michelin-starred catering to helicopter apron transfers directly to your final destination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
