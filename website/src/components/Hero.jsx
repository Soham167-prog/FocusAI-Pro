import React, { useState, useEffect } from 'react';
import { Download, Play, Eye, EyeOff, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Hero({ onDownloadClick, onExploreDemo }) {
  const [activeTab, setActiveTab] = useState('after');

  // Typewriter + backspacing state
  const thoughts = [
    "Stop doomscrolling YouTube recommendations.",
    "Filter out clickbait & mindless shorts.",
    "Study without algorithm distractions.",
    "Reclaim your YouTube attention with Intent-Based AI Focus."
  ];

  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [typingSpeed, setTypingSpeed] = useState(70);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % thoughts.length;
      const fullText = thoughts[i];

      if (isDeleting) {
        setTypedText(fullText.substring(0, typedText.length - 1));
        setTypingSpeed(30); // Faster backspacing
      } else {
        setTypedText(fullText.substring(0, typedText.length + 1));
        setTypingSpeed(70); // Normal typing speed
      }

      if (!isDeleting && typedText === fullText) {
        // Pause at end of sentence
        setTimeout(() => setIsDeleting(true), 2200);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(100);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed, thoughts]);

  return (
    <section className="pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Announcement Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECEAE4] border border-[#DFDDD6] text-xs sm:text-sm font-semibold text-[#1C1917] shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-[#EA580C] animate-pulse"></span>
            <span>Focus AI Pro 2.0 is Live</span>
            <span className="text-[#8C857B]">•</span>
            <span className="text-[#D97706] font-bold">100% Free & Open Source</span>
          </div>
        </div>

        {/* Hero Headline & Dynamic Animated Typewriter Thought */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="min-h-[140px] sm:min-h-[160px] flex items-center justify-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#141312] leading-[1.12] font-heading">
              <span className="text-[#141312]">{typedText}</span>
              <span className="inline-block w-1.5 h-8 sm:h-12 ml-1 bg-[#D97706] animate-pulse align-middle"></span>
            </h1>
          </div>
          
          <p className="text-lg sm:text-xl text-[#524C44] font-medium max-w-2xl mx-auto leading-relaxed">
            Stop losing hours to YouTube algorithm recommendations. Tell Focus AI Pro what you want to learn, and watch distractions disappear instantly.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onDownloadClick}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1C1917] hover:bg-[#2D2722] text-[#F8F5EF] px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-2xl transition-all active:scale-98 border border-[#3D3731]"
            >
              <Download className="w-5 h-5 text-[#D97706]" />
              <span>Download Extension Zip</span>
            </button>

            <a
              href="#interactive-demo"
              onClick={onExploreDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ECEAE4] hover:bg-[#E2DFD6] text-[#1C1917] px-8 py-4 rounded-2xl font-bold text-base border border-[#DFDDD6] transition-all"
            >
              <Play className="w-4 h-4 fill-current text-[#1C1917]" />
              <span>Try Live Simulator</span>
            </a>

            <a
              href="#install-guide"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent hover:bg-[#ECEAE4]/50 text-[#6B655B] hover:text-[#1C1917] px-6 py-4 rounded-2xl font-semibold text-sm transition-all"
            >
              <span>View Installation Guide</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Feature Badges */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm font-semibold text-[#6B655B]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>No Login Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Chrome Local Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Blur & Strict Hide Modes</span>
            </div>
          </div>
        </div>

        {/* Hero Color Block Visual Mockup */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="bg-[#1C1917] p-3 sm:p-5 rounded-3xl shadow-2xl border border-[#3D3731]">
            
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between pb-3 px-2 border-b border-[#3D3731]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                <span className="text-xs font-mono text-[#8C857B] ml-2 hidden sm:inline-block">https://www.youtube.com</span>
              </div>

              {/* View Toggle Pill */}
              <div className="flex bg-[#2D2722] p-1 rounded-xl border border-[#3D3731] text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('before')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'before' ? 'bg-[#3D3731] text-white shadow' : 'text-[#A8A29E] hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Before Focus AI</span>
                </button>
                <button
                  onClick={() => setActiveTab('after')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'after' ? 'bg-[#D97706] text-white shadow' : 'text-[#A8A29E] hover:text-white'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5 text-white" />
                  <span>With Focus AI Pro</span>
                </button>
              </div>
            </div>

            {/* Mock YouTube Content Window */}
            <div className="mt-4 bg-[#0F0E0D] rounded-2xl p-4 sm:p-6 overflow-hidden">
              
              {/* Header Active Intent Banner */}
              <div className="bg-[#2D2722] border border-[#3D3731] p-3 sm:p-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D97706] text-white flex items-center justify-center font-bold text-sm">
                    🧩
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[#D97706] uppercase tracking-wider block font-bold">Active Intent Filter</span>
                    <span className="text-sm sm:text-base font-bold text-white">"learn react & javascript"</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 px-2.5 py-1 rounded-full font-bold">
                    Focus Mode: ON
                  </span>
                  <span className="bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/30 px-2.5 py-1 rounded-full font-bold">
                    Filter: Blur
                  </span>
                </div>
              </div>

              {/* YouTube Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Matching Video 1 */}
                <div className="bg-[#1C1917] rounded-xl overflow-hidden border border-[#10B981]/40 shadow-sm relative group">
                  <div className="aspect-video bg-[#2D2722] relative flex items-center justify-center">
                    <span className="text-3xl">⚛️</span>
                    <span className="absolute top-2 right-2 bg-[#10B981] text-black text-[10px] font-extrabold px-2 py-0.5 rounded">
                      98% MATCH
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white line-clamp-2">React JS Full Course 2026 for Beginners</h4>
                    <p className="text-[11px] text-[#A8A29E] mt-1">Code Academy • 2.4M views</p>
                  </div>
                </div>

                {/* Non-matching Distraction 1 */}
                <div className={`bg-[#1C1917] rounded-xl overflow-hidden border border-[#3D3731] relative transition-all duration-500 ${
                  activeTab === 'after' ? 'filter blur-sm opacity-40 hover:blur-none hover:opacity-100' : ''
                }`}>
                  <div className="aspect-video bg-[#362615] relative flex items-center justify-center">
                    <span className="text-3xl">🎮</span>
                    {activeTab === 'after' && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center">
                        <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                          BLURRED (Distraction)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-[#E8E6E3] line-clamp-2">Ultimate Gaming Fails & Funny Clips #42</h4>
                    <p className="text-[11px] text-[#8C857B] mt-1">GamerZone • 5.1M views</p>
                  </div>
                </div>

                {/* Matching Video 2 */}
                <div className="bg-[#1C1917] rounded-xl overflow-hidden border border-[#10B981]/40 shadow-sm relative">
                  <div className="aspect-video bg-[#2D2722] relative flex items-center justify-center">
                    <span className="text-3xl">💻</span>
                    <span className="absolute top-2 right-2 bg-[#10B981] text-black text-[10px] font-extrabold px-2 py-0.5 rounded">
                      92% MATCH
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white line-clamp-2">Build 5 Real World JavaScript Projects</h4>
                    <p className="text-[11px] text-[#A8A29E] mt-1">DevLab • 890K views</p>
                  </div>
                </div>

              </div>

              {/* Status footer inside visual card */}
              <div className="mt-4 pt-3 border-t border-[#2D2722] flex items-center justify-between text-xs text-[#8C857B]">
                <span>Showing 2 relevant study videos • 1 distraction filtered</span>
                <span className="text-[#D97706] font-medium">Click toggle buttons above to test states</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
