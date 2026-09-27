import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "How do I install Focus AI Pro in Google Chrome?",
      a: "Download the extension zip file, extract the folder, open chrome://extensions, turn ON 'Developer mode' in the top right, click 'Load unpacked' in the top left, and select your extracted Focus AI Pro folder!"
    },
    {
      q: "Does Focus AI Pro work on Brave, Edge, Arc, or Opera?",
      a: "Yes! Since Brave, Microsoft Edge, Arc, and Opera are all Chromium-based browsers, you can install unpacked extensions using the exact same steps in their respective extension manager pages."
    },
    {
      q: "Difference between Filter Mode: Blur and Filter Mode: Strict (Hide)?",
      a: "Blur Mode applies a soft CSS backdrop-blur overlay over off-intent recommendation cards on YouTube, allowing you to hover to inspect if needed. Strict (Hide) Mode completely removes non-matching cards from the DOM layout entirely for zero distraction."
    },
    {
      q: "Is my personal data safe? Where is my watchtime stored?",
      a: "100% safe! All intents, watchtime logs, and settings are saved exclusively in your browser's local storage (chrome.storage.local). No data ever leaves your device."
    },
    {
      q: "Why do I need to enable Developer Mode in Chrome?",
      a: "Developer mode allows Chrome to run local unpacked extension folders directly from your disk without requiring publishing on the Chrome Web Store."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-[#F8F7F4]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 bg-[#ECEAE4] border border-[#DFDDD6] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1C1917]">
            <HelpCircle className="w-4 h-4 text-[#D97706]" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-[#141312]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-[#ECEAE4] border border-[#DFDDD6] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 font-bold text-sm sm:text-base text-[#1C1917] flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#8C857B] transition-transform ${isOpen ? 'rotate-180 text-[#D97706]' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#524C44] leading-relaxed border-t border-[#DFDDD6] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
