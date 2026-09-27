import React from 'react';
import { Download, Sparkles, Heart } from 'lucide-react';

export default function Footer({ onDownloadClick }) {
  return (
    <footer className="bg-[#1C1917] text-[#F5F2EB] py-12 border-t border-[#3D3731]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#3D3731]">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2D2722] text-[#D97706] rounded-xl flex items-center justify-center font-bold text-xl border border-[#3D3731]">
              🧩
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-white">Focus AI Pro</span>
              <p className="text-xs text-[#8C857B]">Intelligent Intent-Based YouTube Focus Chrome Extension</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-[#A8A29E]">
            <a href="#install-guide" className="hover:text-white transition-colors">How to Install</a>
            <a href="#interactive-demo" className="hover:text-white transition-colors">Live Simulator</a>
            <a href="#analytics" className="hover:text-white transition-colors">Analytics Portal</a>
            <a href="#google-upgrades" className="hover:text-white transition-colors">AI Roadmap</a>
            <a href="#privacy" className="hover:text-white transition-colors">100% Privacy</a>
          </div>

          <button
            onClick={onDownloadClick}
            className="flex items-center gap-2 bg-[#D97706] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-all border border-[#F59E0B]/30"
          >
            <Download className="w-4 h-4" />
            <span>Download Zip</span>
          </button>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C857B] gap-4">
          <p>© {new Date().getFullYear()} Focus AI Pro. 100% Free & Open Source. Stored locally on Chrome.</p>
          <p className="flex items-center gap-1">
            <span>Built with precision for seamless productivity</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
