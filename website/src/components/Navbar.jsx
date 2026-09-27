import React, { useState, useEffect } from 'react';
import { Puzzle, Download, Sparkles, Shield, PlayCircle, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onDownloadClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#F8F7F4]/90 backdrop-blur-md border-b border-[#E2DFD7]' : 'bg-[#F8F7F4]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand Block */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-[#1C1917] text-[#F5F2EB] rounded-xl flex items-center justify-center font-bold text-xl shadow-md border border-[#3D3731] group-hover:scale-105 transition-transform">
              <span className="text-xl">🧩</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-[#141312]">
                  Focus AI Pro
                </span>
                <span className="bg-[#2D2722] text-[#F8F5EF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-[#6B655B] font-medium hidden sm:block">YouTube Intent & Focus Extension</p>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#ECEAE4] p-1.5 rounded-2xl border border-[#DFDDD6]">
            <a 
              href="#install-guide" 
              className="px-4 py-2 text-sm font-semibold text-[#2D2926] hover:bg-[#FAF9F5] rounded-xl transition-all"
            >
              How to Install
            </a>
            <a 
              href="#interactive-demo" 
              className="px-4 py-2 text-sm font-semibold text-[#2D2926] hover:bg-[#FAF9F5] rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Live Simulator</span>
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-ping"></span>
            </a>
            <a 
              href="#analytics" 
              className="px-4 py-2 text-sm font-semibold text-[#2D2926] hover:bg-[#FAF9F5] rounded-xl transition-all"
            >
              Dashboard
            </a>
            <a 
              href="#google-upgrades" 
              className="px-4 py-2 text-sm font-semibold text-[#2D2926] hover:bg-[#FAF9F5] rounded-xl transition-all flex items-center gap-1"
            >
              <span>Pro Tips</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            </a>
            <a 
              href="#privacy" 
              className="px-4 py-2 text-sm font-semibold text-[#2D2926] hover:bg-[#FAF9F5] rounded-xl transition-all"
            >
              Privacy
            </a>
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onDownloadClick}
              className="flex items-center gap-2 bg-[#1C1917] hover:bg-[#2D2722] text-[#F8F5EF] px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 border border-[#3D3731]"
            >
              <Download className="w-4 h-4 text-[#D97706]" />
              <span>Download Extension</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onDownloadClick}
              className="bg-[#1C1917] text-[#F5F2EB] p-2 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Download className="w-4 h-4 text-[#D97706]" />
            </button>
            <button 
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 text-[#1C1917] bg-[#ECEAE4] rounded-lg"
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenu && (
          <div className="md:hidden bg-[#ECEAE4] border-t border-[#DFDDD6] p-4 rounded-2xl mb-4 space-y-2">
            <a 
              onClick={() => setMobileMenu(false)}
              href="#install-guide" 
              className="block px-4 py-2.5 text-sm font-semibold text-[#1C1917] hover:bg-[#FAF9F5] rounded-xl"
            >
              How to Install
            </a>
            <a 
              onClick={() => setMobileMenu(false)}
              href="#interactive-demo" 
              className="block px-4 py-2.5 text-sm font-semibold text-[#1C1917] hover:bg-[#FAF9F5] rounded-xl"
            >
              Live YouTube Simulator
            </a>
            <a 
              onClick={() => setMobileMenu(false)}
              href="#analytics" 
              className="block px-4 py-2.5 text-sm font-semibold text-[#1C1917] hover:bg-[#FAF9F5] rounded-xl"
            >
              Watchtime Dashboard
            </a>
            <a 
              onClick={() => setMobileMenu(false)}
              href="#google-upgrades" 
              className="block px-4 py-2.5 text-sm font-semibold text-[#1C1917] hover:bg-[#FAF9F5] rounded-xl"
            >
              Google AI Upgrades
            </a>
            <a 
              onClick={() => setMobileMenu(false)}
              href="#privacy" 
              className="block px-4 py-2.5 text-sm font-semibold text-[#1C1917] hover:bg-[#FAF9F5] rounded-xl"
            >
              100% On-Device Privacy
            </a>
            <button
              onClick={() => { setMobileMenu(false); onDownloadClick(); }}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#1C1917] text-[#F8F5EF] py-3 rounded-xl font-bold text-sm shadow"
            >
              <Download className="w-4 h-4 text-[#D97706]" />
              <span>Download Extension Zip</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
