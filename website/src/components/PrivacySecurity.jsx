import React from 'react';
import { ShieldCheck, Lock, HardDrive, EyeOff, ServerOff, FileCheck } from 'lucide-react';

export default function PrivacySecurity() {
  return (
    <section id="privacy" className="py-20 bg-[#ECEAE4] border-y border-[#DFDDD6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#1C1917] rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-[#3D3731] relative overflow-hidden">
          
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#2D2722] border border-[#3D3731] px-4 py-1.5 rounded-full text-xs font-bold text-[#10B981]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% On-Device Local Storage</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-white leading-tight">
              Your Data Stays on Your Machine. Period.
            </h2>

            <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
              Focus AI Pro does not have a backend server, database, or analytics API. Every intent keyword, filter preference, and watchtime metric is stored locally inside your browser via <code className="text-[#D97706] font-mono">chrome.storage.local</code>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              
              <div className="bg-[#2D2722] p-5 rounded-2xl border border-[#3D3731] space-y-2">
                <HardDrive className="w-6 h-6 text-[#10B981]" />
                <h4 className="font-bold text-sm text-white">Zero Remote Servers</h4>
                <p className="text-xs text-[#8C857B]">No external API calls are made when filtering videos or logging watchtime.</p>
              </div>

              <div className="bg-[#2D2722] p-5 rounded-2xl border border-[#3D3731] space-y-2">
                <ServerOff className="w-6 h-6 text-[#D97706]" />
                <h4 className="font-bold text-sm text-white">No Tracking or Telemetry</h4>
                <p className="text-xs text-[#8C857B]">We do not collect browsing history, YouTube URLs, or personal intent logs.</p>
              </div>

              <div className="bg-[#2D2722] p-5 rounded-2xl border border-[#3D3731] space-y-2">
                <FileCheck className="w-6 h-6 text-[#6366F1]" />
                <h4 className="font-bold text-sm text-white">Transparent & Open Source</h4>
                <p className="text-xs text-[#8C857B]">Inspect every line of code inside content.js, popup.js, and focus-core.js yourself.</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
