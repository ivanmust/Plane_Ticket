/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X, Box } from 'lucide-react';
import { ThreeJetViewer } from './components/ThreeJetViewer';
import { BookingModal } from './components/BookingModal';
import { StorySection } from './components/StorySection';
import { FleetRatesSection } from './components/FleetRatesSection';
import { BenefitsSection } from './components/BenefitsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedJetCategory, setSelectedJetCategory] = useState<string>('super-mid');
  const [show3DViewerModal, setShow3DViewerModal] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (sectionId === 'start') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNow = (jetId?: string) => {
    if (jetId) {
      setSelectedJetCategory(jetId);
    }
    setIsBookingOpen(true);
  };

  const handleDiscover = () => {
    // Open the 3D interactive studio or scroll to story
    setShow3DViewerModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero section */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
        />

        {/* Subtle contrast grading overlay that preserves clarity while ensuring text readability */}
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />

        {/* Content wrapper */}
        <div className="relative h-full flex flex-col z-10">
          {/* Navigation Bar */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-7xl mx-auto px-8 py-6"
          >
            <div className="flex items-center justify-between">
              {/* Brand name "SkyElite" on the left */}
              <button
                onClick={() => handleNavClick('start')}
                className="text-2xl font-semibold text-gray-900 tracking-tight cursor-pointer text-left focus:outline-none"
              >
                SkyElite
              </button>

              {/* Desktop menu items (hidden on mobile, visible md:flex) */}
              <div className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => handleNavClick('start')}
                  className="text-gray-900 hover:text-gray-700 transition-colors font-medium text-sm cursor-pointer"
                >
                  Start
                </button>
                <button
                  onClick={() => handleNavClick('story')}
                  className="text-gray-900 hover:text-gray-700 transition-colors font-medium text-sm cursor-pointer"
                >
                  Story
                </button>
                <button
                  onClick={() => handleNavClick('rates')}
                  className="text-gray-900 hover:text-gray-700 transition-colors font-medium text-sm cursor-pointer"
                >
                  Rates
                </button>
                <button
                  onClick={() => handleNavClick('benefits')}
                  className="text-gray-900 hover:text-gray-700 transition-colors font-medium text-sm cursor-pointer"
                >
                  Benefits
                </button>
                <button
                  onClick={() => handleNavClick('faq')}
                  className="text-gray-900 hover:text-gray-700 transition-colors font-medium text-sm cursor-pointer"
                >
                  FAQ
                </button>
                <button
                  onClick={() => setShow3DViewerModal(true)}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white text-gray-900 hover:text-gray-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  title="Experience 3D Jet Studio"
                >
                  <Box className="w-3.5 h-3.5 text-[#202A36]" />
                  <span>3D View</span>
                </button>
              </div>

              {/* Mobile hamburger menu button using Lucide React icons (Menu/X) */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle navigation menu"
                  className="p-2 rounded-xl text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-6 py-5 border border-gray-100 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
                <button
                  onClick={() => handleNavClick('start')}
                  className="text-left text-gray-900 hover:text-gray-700 transition-colors font-medium text-base py-1"
                >
                  Start
                </button>
                <button
                  onClick={() => handleNavClick('story')}
                  className="text-left text-gray-900 hover:text-gray-700 transition-colors font-medium text-base py-1"
                >
                  Story
                </button>
                <button
                  onClick={() => handleNavClick('rates')}
                  className="text-left text-gray-900 hover:text-gray-700 transition-colors font-medium text-base py-1"
                >
                  Rates
                </button>
                <button
                  onClick={() => handleNavClick('benefits')}
                  className="text-left text-gray-900 hover:text-gray-700 transition-colors font-medium text-base py-1"
                >
                  Benefits
                </button>
                <button
                  onClick={() => handleNavClick('faq')}
                  className="text-left text-gray-900 hover:text-gray-700 transition-colors font-medium text-base py-1"
                >
                  FAQ
                </button>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShow3DViewerModal(true);
                    }}
                    className="flex-1 py-2 px-3 rounded-full bg-gray-200 text-gray-800 text-xs font-semibold hover:bg-gray-300 transition-colors text-center"
                  >
                    3D Aircraft
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleBookNow();
                    }}
                    className="flex-1 py-2 px-3 rounded-full bg-[#202A36] text-white text-xs font-semibold hover:bg-[#1a2229] transition-colors text-center"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            )}
          </motion.nav>

          {/* Main content area */}
          <main className="flex-1 flex items-center justify-center">
            {/* Hero Content (centered, -mt-80 to pull up) with subtle luxury fade-in animation */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center -mt-80 px-4 select-none"
            >
              {/* Small uppercase label: "PRIVATE JETS" */}
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm font-semibold text-gray-600 tracking-wider mb-4 uppercase"
              >
                PRIVATE JETS
              </motion.span>

              {/* Large two-line heading with overlapping effect */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                {/* Line 1: "Premium." */}
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal text-gray-500 leading-none tracking-tighter">
                  Premium.
                </h1>
                {/* Line 2: "Accessible." (same size, color: #202A36, negative margin-top: -12px for overlap) */}
                <span
                  className="text-6xl md:text-7xl lg:text-8xl font-normal leading-none tracking-tighter text-[#202A36] -mt-[12px]"
                >
                  Accessible.
                </span>
              </motion.div>

              {/* Subtitle: "Your dedication deserves recognition." */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mt-4"
              >
                Your dedication deserves recognition.
              </motion.p>

              {/* Two call-to-action buttons (gap-4, centered) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 justify-center"
              >
                {/* "Discover" button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDiscover}
                  className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 font-medium hover:bg-gray-400 transition-colors cursor-pointer text-sm md:text-base shadow-xs"
                >
                  Discover
                </motion.button>

                {/* "Book Now" button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBookNow()}
                  className="px-4 py-2 rounded-full text-white bg-[#202A36] hover:bg-[#1a2229] transition-colors cursor-pointer text-sm md:text-base shadow-xs"
                >
                  Book Now
                </motion.button>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </section>

      {/* Supporting Rich Content Sections */}
      <StorySection />
      <FleetRatesSection
        onSelectJet={handleBookNow}
        onOpen3DViewer={() => setShow3DViewerModal(true)}
      />
      <BenefitsSection />
      <FaqSection />
      <Footer
        onOpenBooking={() => handleBookNow()}
        onOpen3DViewer={() => setShow3DViewerModal(true)}
      />

      {/* 3D Interactive Private Jet Experience Modal */}
      {show3DViewerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-6xl bg-[#f1f4f8] rounded-3xl overflow-hidden shadow-2xl border border-gray-300">
            <ThreeJetViewer onClose={() => setShow3DViewerModal(false)} isModal={true} />
          </div>
        </div>
      )}

      {/* Luxury Flight Estimator & Reservation Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialJetCategory={selectedJetCategory}
      />
    </div>
  );
}
