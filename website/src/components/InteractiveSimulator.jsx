import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Sliders, 
  Eye, 
  EyeOff, 
  Check, 
  RefreshCw, 
  Save, 
  LayoutDashboard,
  Zap,
  Info
} from 'lucide-react';

export default function InteractiveSimulator({ simulatorRef }) {
  // Simulator state
  const [intentInput, setIntentInput] = useState('learn react');
  const [activeIntent, setActiveIntent] = useState('learn react');
  const [focusMode, setFocusMode] = useState(true);
  const [filterMode, setFilterMode] = useState('blur'); // 'blur' or 'strict'
  const [showDashboardMock, setShowDashboardMock] = useState(false);

  // Mock videos dataset
  const sampleVideos = [
    {
      id: 1,
      title: "React JS Full Course 2026 for Beginners — Build 5 Apps",
      channel: "CodeWithTech",
      views: "1.4M views",
      keywords: ["learn", "react", "js", "course", "beginners", "apps", "coding"],
      icon: "⚛️",
      bg: "bg-[#1E293B]"
    },
    {
      id: 2,
      title: "Top 10 Craziest Gaming Moments & Pranks (Must Watch!)",
      channel: "GamerVibe",
      views: "3.8M views",
      keywords: ["gaming", "moments", "pranks", "funny", "comedy"],
      icon: "🎮",
      bg: "bg-[#451A03]"
    },
    {
      id: 3,
      title: "JavaScript Async/Await & Promises Explained Step-by-Step",
      channel: "JS Mastery",
      views: "890K views",
      keywords: ["javascript", "js", "async", "await", "promises", "explained", "learn"],
      icon: "💻",
      bg: "bg-[#1E1B4B]"
    },
    {
      id: 4,
      title: "SHOCKING celebrity drama & gossip you won't believe",
      channel: "PopGoss",
      views: "2.1M views",
      keywords: ["celebrity", "drama", "gossip", "shocking", "news"],
      icon: "🍿",
      bg: "bg-[#701A75]"
    },
    {
      id: 5,
      title: "Data Structures & Algorithms in Python — Complete Tutorial",
      channel: "AlgoGuru",
      views: "640K views",
      keywords: ["python", "dsa", "algorithms", "data structures", "learn", "tutorial"],
      icon: "🐍",
      bg: "bg-[#064E3B]"
    },
    {
      id: 6,
      title: "I Spent 24 Hours in a Secret Underground Bunker!",
      channel: "MrVlog",
      views: "12M views",
      keywords: ["vlog", "bunker", "secret", "funny", "challenge"],
      icon: "🚀",
      bg: "bg-[#881337]"
    }
  ];

  // Helper score calculator matching focus-core.js
  const calculateMatch = (video) => {
    if (!activeIntent.trim()) return 100;
    const intentTokens = activeIntent.toLowerCase().split(/\s+/).filter(Boolean);
    const videoText = (video.title + " " + video.keywords.join(" ")).toLowerCase();
    
    let matches = 0;
    intentTokens.forEach(token => {
      if (videoText.includes(token)) matches++;
    });

    if (intentTokens.length === 0) return 100;
    const percentage = Math.round((matches / intentTokens.length) * 100);
    return percentage;
  };

  const handleSave = () => {
    setActiveIntent(intentInput.trim());
    setFocusMode(true);
  };

  return (
    <section id="interactive-demo" ref={simulatorRef} className="py-20 bg-[#ECEAE4] border-y border-[#DFDDD6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 bg-[#FAF9F5] border border-[#DFDDD6] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1C1917]">
            <Zap className="w-4 h-4 text-[#D97706]" />
            <span>Live Interactive Demo</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-[#141312]">
            Test Focus AI Pro Live Simulator
          </h2>

          <p className="text-base sm:text-lg text-[#6B655B] font-medium">
            Type your study intent in the extension popup simulator below and watch how YouTube content dynamically adapts in real-time.
          </p>
        </div>

        {/* Main Grid: Left Popup Controller, Right YouTube Mock Window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Extension Popup Simulator */}
          <div className="lg:col-span-4 bg-[#1C1917] p-6 rounded-3xl border border-[#3D3731] shadow-2xl text-[#F5F2EB] flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#3D3731]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#2D2722] rounded-xl flex items-center justify-center text-lg border border-[#3D3731]">
                    🧩
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-base text-white">Focus AI Pro</h4>
                    <span className="text-[11px] text-[#D97706] font-mono">Chrome Extension Popup</span>
                  </div>
                </div>

                <div className={`w-3 h-3 rounded-full ${focusMode ? 'bg-[#10B981] animate-ping' : 'bg-[#EF4444]'}`}></div>
              </div>

              {/* Toggle Focus Mode Button */}
              <div>
                <label className="text-xs font-bold text-[#A8A29E] block mb-1.5 uppercase tracking-wider">
                  1. Focus Engine State
                </label>
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all border flex items-center justify-center gap-2 ${
                    focusMode
                      ? 'bg-[#2B2592] text-white border-[#4F46E5] shadow'
                      : 'bg-[#2D2722] text-[#A8A29E] border-[#3D3731]'
                  }`}
                >
                  {focusMode ? (
                    <>
                      <EyeOff className="w-4 h-4 text-[#10B981]" />
                      <span>Focus Mode Enabled</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 text-[#EF4444]" />
                      <span>Enable Focus Mode</span>
                    </>
                  )}
                </button>
              </div>

              {/* Toggle Filter Mode: Blur vs Strict */}
              <div>
                <label className="text-xs font-bold text-[#A8A29E] block mb-1.5 uppercase tracking-wider">
                  2. Filter Mode (Blur vs Strict)
                </label>
                <button
                  onClick={() => setFilterMode(filterMode === 'blur' ? 'strict' : 'blur')}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all border flex items-center justify-center gap-2 ${
                    filterMode === 'strict'
                      ? 'bg-[#D97706] text-white border-[#F59E0B]'
                      : 'bg-[#2D2722] text-[#D6D3D1] border-[#3D3731]'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>
                    {filterMode === 'strict' ? 'Filter Mode: Strict (Hide)' : 'Filter Mode: Blur'}
                  </span>
                </button>
              </div>

              {/* Intent Input & Save Button */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#A8A29E] block uppercase tracking-wider">
                  3. Set Session Intent Keywords
                </label>
                <input
                  type="text"
                  value={intentInput}
                  onChange={(e) => setIntentInput(e.target.value)}
                  placeholder="e.g. learn js, python, dsa"
                  className="w-full bg-[#0F0E0D] border border-[#3D3731] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D97706] font-mono"
                />
                
                <button
                  onClick={handleSave}
                  className="w-full bg-[#2B2592] hover:bg-[#3730A3] text-white py-3 rounded-xl font-bold text-sm border border-[#4F46E5] shadow flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <Save className="w-4 h-4 text-[#10B981]" />
                  <span>Save & Apply Intent</span>
                </button>
              </div>

              {/* Quick Sample Intents */}
              <div className="pt-1 space-y-1.5">
                <span className="text-[11px] text-[#8C857B] block">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['learn react', 'python dsa', 'javascript', 'gaming'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setIntentInput(preset);
                        setActiveIntent(preset);
                        setFocusMode(true);
                      }}
                      className="bg-[#2D2722] hover:bg-[#3D3731] text-xs px-2.5 py-1 rounded-lg text-[#D6D3D1] border border-[#3D3731]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Dashboard Button */}
            <div className="pt-6 border-t border-[#3D3731]">
              <button
                onClick={() => setShowDashboardMock(!showDashboardMock)}
                className="w-full bg-[#2D2722] hover:bg-[#3D3731] text-[#E8DED1] py-2.5 rounded-xl font-bold text-xs border border-[#3D3731] flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#D97706]" />
                <span>{showDashboardMock ? 'Close Watchtime Dashboard' : 'Open Dashboard'}</span>
              </button>
            </div>

          </div>

          {/* Right: Simulated YouTube Feed Window */}
          <div className="lg:col-span-8 bg-[#1C1917] rounded-3xl p-5 border border-[#3D3731] shadow-2xl space-y-4">
            
            {/* YouTube Navbar Simulation */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#3D3731] gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EF4444] flex items-center justify-center text-white font-extrabold text-xs">
                  ▶
                </div>
                <span className="font-heading font-extrabold text-lg text-white">YouTube Simulator</span>
              </div>

              {/* Active Filter Pill */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8C857B]">Active Intent:</span>
                <span className="bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30 px-3 py-1 rounded-full font-mono font-bold">
                  "{activeIntent || 'All Videos'}"
                </span>
              </div>
            </div>

            {/* Dashboard Mock Overlay if Toggled */}
            {showDashboardMock ? (
              <div className="bg-[#0F0E0D] rounded-2xl p-6 border border-[#3D3731] space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-extrabold text-lg text-white">Watchtime Analytics Dashboard</h4>
                  <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-2.5 py-1 rounded-full font-bold">
                    100% Local Storage
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#1C1917] p-4 rounded-xl border border-[#3D3731]">
                    <span className="text-xs text-[#8C857B] block font-semibold">Focused Watchtime</span>
                    <span className="text-2xl font-bold text-[#10B981] font-mono">87.5%</span>
                  </div>
                  <div className="bg-[#1C1917] p-4 rounded-xl border border-[#3D3731]">
                    <span className="text-xs text-[#8C857B] block font-semibold">Distractions Filtered</span>
                    <span className="text-2xl font-bold text-[#D97706] font-mono">142 Videos</span>
                  </div>
                  <div className="bg-[#1C1917] p-4 rounded-xl border border-[#3D3731]">
                    <span className="text-xs text-[#8C857B] block font-semibold">Saved Study Time</span>
                    <span className="text-2xl font-bold text-white font-mono">3.2 Hours</span>
                  </div>
                </div>

                <p className="text-xs text-[#8C857B] text-center">
                  Click 'Open Dashboard' in the extension popup to view this tab anytime on your computer.
                </p>
              </div>
            ) : (
              /* Video Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sampleVideos.map((video) => {
                  const matchScore = calculateMatch(video);
                  const isMatching = matchScore >= 40;
                  const isBlurred = focusMode && !isMatching && filterMode === 'blur';
                  const isHidden = focusMode && !isMatching && filterMode === 'strict';

                  if (isHidden) {
                    return (
                      <div 
                        key={video.id} 
                        className="bg-[#2D2722]/40 border border-dashed border-[#3D3731] rounded-2xl p-4 text-center text-xs text-[#8C857B] flex items-center justify-center"
                      >
                        🚫 Filtered in Strict Mode (Low Intent Match)
                      </div>
                    );
                  }

                  return (
                    <div
                      key={video.id}
                      className={`bg-[#0F0E0D] rounded-2xl p-3 border transition-all duration-300 relative ${
                        isMatching
                          ? 'border-[#10B981]/50 shadow-md'
                          : isBlurred
                          ? 'border-[#EF4444]/30'
                          : 'border-[#3D3731]'
                      }`}
                    >
                      {/* Video Thumbnail Box */}
                      <div className={`aspect-video rounded-xl ${video.bg} relative flex items-center justify-center overflow-hidden`}>
                        <span className="text-4xl">{video.icon}</span>

                        {/* Match score badge */}
                        <div className="absolute top-2 right-2">
                          {isMatching ? (
                            <span className="bg-[#10B981] text-black text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                              {matchScore}% MATCH
                            </span>
                          ) : (
                            <span className="bg-[#EF4444] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                              {matchScore}% OFF-INTENT
                            </span>
                          )}
                        </div>

                        {/* Blur overlay if focus mode active and blurred */}
                        {isBlurred && (
                          <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-3 text-center">
                            <EyeOff className="w-6 h-6 text-[#EF4444] mb-1" />
                            <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2.5 py-1 rounded shadow">
                              BLURRED (Off-Intent)
                            </span>
                            <span className="text-[10px] text-[#D6D3D1] mt-1">Hover to inspect</span>
                          </div>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="mt-3 space-y-1">
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                          {video.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-[#8C857B]">
                          <span>{video.channel}</span>
                          <span>{video.views}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-2 text-[11px] text-[#8C857B] text-center">
              💡 Live simulation matches logic inside <code className="text-[#D97706]">focus-core.js</code>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
