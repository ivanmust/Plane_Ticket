import React from 'react';
import { Plane, Shield, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpen3DViewer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpen3DViewer }) => {
  return (
    <footer className="bg-[#1a222d] text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-semibold tracking-tight text-white">SkyElite</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Private aviation engineered to the highest echelon of safety, discretion, and operational excellence.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>ARG/US Platinum Certified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase block mb-4">
              Aviation Services
            </span>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#rates" className="hover:text-white transition-colors">On-Demand Charter</a></li>
              <li><a href="#rates" className="hover:text-white transition-colors">SkyElite 25-Hour Jet Card</a></li>
              <li><a href="#rates" className="hover:text-white transition-colors">Fractional Ownership</a></li>
              <li>
                <button onClick={onOpen3DViewer} className="hover:text-white transition-colors cursor-pointer text-left">
                  3D Aircraft Interactive Studio
                </button>
              </li>
              <li><a href="#benefits" className="hover:text-white transition-colors">Corporate Flight Department</a></li>
            </ul>
          </div>

          {/* Fleet Hubs */}
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase block mb-4">
              Primary Hubs
            </span>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-500" /> Teterboro (TEB) • New York</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-500" /> Van Nuys (VNY) • Los Angeles</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-500" /> Farnborough (FAB) • London</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-500" /> Le Bourget (LBG) • Paris</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-500" /> Al Maktoum (DWC) • Dubai</li>
            </ul>
          </div>

          {/* Flight Operations */}
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase block mb-4">
              24/7 Flight Dispatch
            </span>
            <div className="space-y-3 text-xs text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-mono text-gray-200">+1 (800) 582-7593</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>concierge@skyelite-aviation.com</span>
              </div>
            </div>
            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 px-4 rounded-full bg-white text-[#202A36] font-semibold text-xs hover:bg-gray-100 transition-colors cursor-pointer text-center"
            >
              Request Aircraft Dispatch
            </button>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <div>
            © {new Date().getFullYear()} SkyElite Aviation Worldwide Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Carriage</span>
            <span className="hover:text-gray-400 cursor-pointer">Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
