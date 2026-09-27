import React, { useState } from 'react';
import { 
  Download, 
  MoreVertical, 
  Puzzle, 
  ToggleRight, 
  FolderInput, 
  Pin, 
  PlayCircle, 
  Sliders, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function InstallGuide({ onDownloadClick }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Download & Unzip Extension",
      shortTitle: "1. Download Zip",
      icon: Download,
      badge: "Step 1",
      description: "Click the Download button to get the Focus AI Pro extension zip file on your computer. Extract / unzip the folder to any location (e.g., Downloads or Desktop).",
      chromeLocation: "Local Storage / Downloads Folder",
      actionText: "Download Extension Zip",
      isDownloadAction: true,
      visual: (
        <div className="bg-[#1C1917] p-6 rounded-2xl border border-[#3D3731] text-[#F5F2EB] space-y-4">
          <div className="flex items-center gap-3 bg-[#2D2722] p-3 rounded-xl border border-[#3D3731]">
            <div className="w-10 h-10 bg-[#D97706] rounded-lg flex items-center justify-center font-bold text-[#1C1917]">
              📦
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-white">Focus-AI-Pro-v2.0.0.zip</div>
              <div className="text-xs text-[#8C857B]">Unzip to folder: /Focus AI Pro</div>
            </div>
          </div>
          <div className="text-xs text-[#A8A29E] space-y-1">
            <p>✔ Extracted contents include: <code className="text-[#10B981]">manifest.json</code>, <code className="text-[#10B981]">popup.html</code>, <code className="text-[#10B981]">content.js</code></p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Open Chrome Extensions Manager",
      shortTitle: "2. Open Extensions",
      icon: MoreVertical,
      badge: "Step 2",
      description: "In your Chrome browser, look at the top right corner and click the 3 vertical dots icon (⋮). Hover or click on 'Extensions', then click 'Manage Extensions' (or type chrome://extensions in the address bar).",
      chromeLocation: "Top Right Corner ➔ 3 Vertical Dots (⋮) ➔ Extensions ➔ Manage Extensions",
      visual: (
        <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3731] space-y-3 font-mono text-xs">
          <div className="bg-[#2D2722] p-3 rounded-xl border border-[#3D3731] space-y-2">
            <div className="flex items-center justify-between text-[#8C857B] pb-2 border-b border-[#3D3731]">
              <span>Chrome Browser Menu</span>
              <span className="text-[#D97706] font-bold">⋮ (3 Dots Icon)</span>
            </div>
            <div className="space-y-1 text-[#D6D3D1]">
              <div className="px-2 py-1 rounded hover:bg-[#3D3731]">New Tab</div>
              <div className="px-2 py-1 rounded bg-[#D97706]/20 border border-[#D97706]/40 text-white font-bold flex items-center justify-between">
                <span>Extensions ➔</span>
                <span className="text-[10px] bg-[#D97706] text-black px-1.5 rounded">CLICK</span>
              </div>
              <div className="pl-4 py-1 text-[#10B981] font-bold bg-[#10B981]/10 rounded">
                ↪ Manage Extensions
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Enable Developer Mode",
      shortTitle: "3. Developer Mode",
      icon: ToggleRight,
      badge: "Step 3",
      description: "Once redirected to the Extensions page (chrome://extensions), find the 'Developer mode' toggle switch in the top right corner and turn it ON.",
      chromeLocation: "chrome://extensions ➔ Top Right Corner ➔ Toggle Developer Mode [ON]",
      visual: (
        <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3731] space-y-4">
          <div className="flex items-center justify-between bg-[#2D2722] p-4 rounded-xl border border-[#3D3731]">
            <span className="font-heading font-bold text-sm text-white">Extensions Overview</span>
            <div className="flex items-center gap-3 bg-[#1C1917] px-3 py-1.5 rounded-lg border border-[#10B981]/50">
              <span className="text-xs font-semibold text-white">Developer mode</span>
              <div className="w-9 h-5 bg-[#10B981] rounded-full p-0.5 flex justify-end">
                <div className="w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#8C857B]">Turning this ON unlocks unpacked local extension loading.</p>
        </div>
      )
    },
    {
      id: 4,
      title: "Click 'Load Unpacked' & Select Folder",
      shortTitle: "4. Load Unpacked",
      icon: FolderInput,
      badge: "Step 4",
      description: "After turning on Developer mode, 3 options will appear at the top left corner: 'Load unpacked', 'Pack extension', and 'Update'. Click 'Load unpacked' and select your extracted Focus AI Pro folder.",
      chromeLocation: "chrome://extensions ➔ Top Left Corner ➔ Load Unpacked",
      visual: (
        <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3731] space-y-3">
          <div className="flex flex-wrap gap-2 pb-2">
            <button className="bg-[#D97706] text-white px-3 py-2 rounded-lg font-bold text-xs shadow border border-[#F59E0B]/50 flex items-center gap-1.5 animate-pulse">
              <FolderInput className="w-4 h-4" />
              <span>Load unpacked (CLICK HERE)</span>
            </button>
            <button className="bg-[#2D2722] text-[#8C857B] px-3 py-2 rounded-lg text-xs font-mono border border-[#3D3731]">
              Pack extension
            </button>
            <button className="bg-[#2D2722] text-[#8C857B] px-3 py-2 rounded-lg text-xs font-mono border border-[#3D3731]">
              Update
            </button>
          </div>
          <div className="bg-[#2D2722] p-3 rounded-xl border border-[#3D3731] text-xs text-[#10B981]">
            ✔ Select directory: <span className="font-mono text-white">/Focus AI Pro</span>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Pin Extension to Chrome Toolbar",
      shortTitle: "5. Pin Extension 🧩",
      icon: Pin,
      badge: "Step 5",
      description: "Congratulations! Focus AI Pro is now added to Chrome. Click the puzzle-piece logo (🧩) in the top-right toolbar next to your Google account icon, find Focus AI Pro, and click the Pin icon.",
      chromeLocation: "Chrome Top Toolbar ➔ Puzzle Icon (🧩) ➔ Pin Focus AI Pro",
      visual: (
        <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3731] space-y-3">
          <div className="flex items-center justify-between bg-[#2D2722] p-3 rounded-xl border border-[#3D3731]">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧩</span>
              <span className="font-bold text-sm text-white">Focus AI Pro</span>
            </div>
            <div className="bg-[#D97706] text-white p-1.5 rounded-lg flex items-center justify-center font-bold text-xs">
              📌 Pinned
            </div>
          </div>
          <p className="text-xs text-[#8C857B]">Pinning gives you instant 1-click access anytime on YouTube.</p>
        </div>
      )
    },
    {
      id: 6,
      title: "Open YouTube & Set Your Learning Intent",
      shortTitle: "6. Set Intent",
      icon: PlayCircle,
      badge: "Step 6",
      description: "Go to YouTube (youtube.com). Click the Focus AI Pro extension icon, enter your study topic or intent keywords (e.g., 'learn react', 'dsa python'), and press 'Enable Focus Mode' (or Save).",
      chromeLocation: "youtube.com ➔ Click Extension Icon ➔ Enter Intent Keywords ➔ Enable Focus Mode",
      visual: (
        <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3731] space-y-3">
          <div className="bg-[#2D2722] p-4 rounded-xl border border-[#3D3731] space-y-3">
            <div className="text-xs font-bold text-[#D97706] uppercase tracking-wider">Focus AI Pro Popup</div>
            <input 
              readOnly 
              value="learn react & javascript" 
              className="w-full bg-[#1C1917] border border-[#3D3731] rounded-lg px-3 py-2 text-xs text-white font-mono"
            />
            <div className="bg-[#2B2592] text-white font-bold text-xs py-2 rounded-lg text-center border border-[#4F46E5]">
              Enable Focus Mode (ACTIVE)
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Configure Filter Mode: Blur vs Strict (Hide)",
      shortTitle: "7. Blur / Hide",
      icon: Sliders,
      badge: "Step 7",
      description: "You can toggle filter intensity by clicking the 'Filter Mode: Blur' button to switch to 'Filter Mode: Strict (Hide)' and hit Save to see real-time updates on YouTube.",
      chromeLocation: "Extension Popup ➔ Toggle 'Filter Mode: Blur' / 'Strict (Hide)' ➔ Save",
      visual: (
        <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3731] space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#2D2722] p-3 rounded-xl border border-[#3D3731] text-center">
              <span className="font-bold text-white block mb-1">Blur Mode</span>
              <span className="text-[11px] text-[#8C857B]">Softly blurs off-intent videos</span>
            </div>
            <div className="bg-[#D97706]/20 p-3 rounded-xl border border-[#D97706]/40 text-center">
              <span className="font-bold text-[#D97706] block mb-1">Strict (Hide) Mode</span>
              <span className="text-[11px] text-white">Completely hides non-intent items</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Open Dashboard for Watchtime Analytics",
      shortTitle: "8. Dashboard & Privacy",
      icon: BarChart3,
      badge: "Step 8",
      description: "Click 'Open Dashboard' in the extension popup to analyze your watchtime focus score and session metrics. Rest assured: all data is strictly saved in Chrome local storage and never leaves your device.",
      chromeLocation: "Popup ➔ Open Dashboard (100% Local Storage Privacy)",
      visual: (
        <div className="bg-[#1C1917] p-5 rounded-2xl border border-[#3D3731] space-y-3">
          <div className="bg-[#2D2722] p-3 rounded-xl border border-[#3D3731] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Watchtime Analytics</div>
              <div className="text-[11px] text-[#10B981]">100% On-Device Storage</div>
            </div>
            <span className="bg-[#10B981]/20 text-[#10B981] font-mono text-xs px-2.5 py-1 rounded-full font-bold">
              88% Focus Score
            </span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="install-guide" className="py-20 bg-[#F8F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 bg-[#ECEAE4] border border-[#DFDDD6] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1C1917]">
            <Sparkles className="w-4 h-4 text-[#D97706]" />
            <span>Step-by-Step Installation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-[#141312]">
            How to Install & Use Focus AI Pro
          </h2>

          <p className="text-base sm:text-lg text-[#6B655B] font-medium">
            Setting up unpacked Chrome extensions takes under 60 seconds. Follow these simple steps to activate Focus AI Pro on your browser.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 scrollbar-none">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`whitespace-nowrap px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#1C1917] text-[#F8F5EF] border-[#3D3731] shadow-md'
                    : 'bg-[#ECEAE4] text-[#6B655B] hover:text-[#1C1917] border-[#DFDDD6]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D97706]' : 'text-[#8C857B]'}`} />
                <span>{step.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Highlight Block */}
        <div className="bg-[#ECEAE4] p-6 sm:p-10 rounded-3xl border border-[#DFDDD6] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="bg-[#1C1917] text-[#D97706] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border border-[#3D3731]">
                  {steps[activeStep].badge} of 8
                </span>
                <span className="text-xs font-mono text-[#6B655B] font-semibold">
                  {steps[activeStep].chromeLocation}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#141312] leading-tight">
                {steps[activeStep].title}
              </h3>

              <p className="text-base sm:text-lg text-[#47423B] leading-relaxed font-medium">
                {steps[activeStep].description}
              </p>

              {/* Action specific button */}
              {steps[activeStep].isDownloadAction && (
                <button
                  onClick={onDownloadClick}
                  className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#2D2722] text-[#F8F5EF] px-6 py-3 rounded-xl font-bold text-sm shadow border border-[#3D3731]"
                >
                  <Download className="w-4 h-4 text-[#D97706]" />
                  <span>Download Extension (.zip)</span>
                </button>
              )}

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-[#DFDDD6]">
                <button
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  disabled={activeStep === 0}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#FAF9F5] text-[#1C1917] disabled:opacity-30 border border-[#DFDDD6]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <button
                  onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                  disabled={activeStep === steps.length - 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#1C1917] text-white disabled:opacity-30 border border-[#3D3731]"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4 text-[#D97706]" />
                </button>
              </div>

            </div>

            {/* Right Visual Graphic Column */}
            <div className="lg:col-span-5">
              {steps[activeStep].visual}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
