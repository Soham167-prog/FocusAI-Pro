import React from 'react';
import { BarChart3, Clock, Target, Shield, CheckCircle, PieChart, Activity } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section id="analytics" className="py-20 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#ECEAE4] border border-[#DFDDD6] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1C1917]">
              <BarChart3 className="w-4 h-4 text-[#D97706]" />
              <span>Built-in Analytics Engine</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-[#141312] leading-tight">
              Visualize Your YouTube Intent & Watchtime
            </h2>

            <p className="text-base sm:text-lg text-[#6B655B] font-medium leading-relaxed">
              Focus AI Pro logs every session directly into your browser's local storage. Track your study ratio, monitor distraction attempts, and analyze top learned topics.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#ECEAE4] border border-[#DFDDD6]">
                <Clock className="w-5 h-5 text-[#D97706] mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#1C1917]">Focused Watchtime Ratio</h4>
                  <p className="text-xs text-[#6B655B]">Know exactly how many minutes were spent on your intended study goals vs off-topic tangents.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#ECEAE4] border border-[#DFDDD6]">
                <Activity className="w-5 h-5 text-[#10B981] mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#1C1917]">Distraction Index</h4>
                  <p className="text-xs text-[#6B655B]">Quantifies how hard the YouTube recommendation engine tried to pull you off track.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#ECEAE4] border border-[#DFDDD6]">
                <Shield className="w-5 h-5 text-[#6366F1] mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#1C1917]">100% Private & Offline</h4>
                  <p className="text-xs text-[#6B655B]">Zero telemetry. Analytics stay exclusively inside your browser's chrome.storage.local.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Dashboard Mock Card */}
          <div className="lg:col-span-7 bg-[#1C1917] p-6 sm:p-8 rounded-3xl border border-[#3D3731] shadow-2xl text-white space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#3D3731]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D97706] text-black rounded-xl font-bold flex items-center justify-center text-lg">
                  📊
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-white">Watchtime Analytics Dashboard</h3>
                  <p className="text-xs text-[#8C857B]">Focus AI Pro Internal Portal (dashboard.html)</p>
                </div>
              </div>
              <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 px-3 py-1 rounded-full text-xs font-bold font-mono">
                LOCAL STORAGE
              </span>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#2D2722] p-4 rounded-2xl border border-[#3D3731]">
                <span className="text-xs text-[#8C857B] block font-semibold">Focus Ratio</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#10B981] font-mono">86.4%</span>
              </div>
              <div className="bg-[#2D2722] p-4 rounded-2xl border border-[#3D3731]">
                <span className="text-xs text-[#8C857B] block font-semibold">Intent Time</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#D97706] font-mono">4.2 hrs</span>
              </div>
              <div className="bg-[#2D2722] p-4 rounded-2xl border border-[#3D3731]">
                <span className="text-xs text-[#8C857B] block font-semibold">Distractions</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">189 hidden</span>
              </div>
            </div>

            {/* Mock Chart Visual */}
            <div className="bg-[#0F0E0D] p-5 rounded-2xl border border-[#3D3731] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#A8A29E]">
                <span className="font-bold">Weekly Study Intent Distribution</span>
                <span className="font-mono text-[#D97706]">Mon - Sun</span>
              </div>

              {/* Bar visualization */}
              <div className="space-y-2 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-mono text-[#D6D3D1] mb-1">
                    <span>React JS & Frontend (Intent)</span>
                    <span className="text-[#10B981] font-bold">45%</span>
                  </div>
                  <div className="w-full h-3 bg-[#2D2722] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] w-[45%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-[#D6D3D1] mb-1">
                    <span>Python & DSA (Intent)</span>
                    <span className="text-[#D97706] font-bold">41%</span>
                  </div>
                  <div className="w-full h-3 bg-[#2D2722] rounded-full overflow-hidden">
                    <div className="h-full bg-[#D97706] w-[41%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-[#D6D3D1] mb-1">
                    <span>Unrelated Recommendations (Filtered)</span>
                    <span className="text-[#EF4444] font-bold">14%</span>
                  </div>
                  <div className="w-full h-3 bg-[#2D2722] rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4444] w-[14%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
