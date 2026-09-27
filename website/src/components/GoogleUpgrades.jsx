import React from 'react';
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  BarChart3, 
  Pin, 
  Target, 
  ArrowUpRight,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';

export default function GoogleUpgrades() {
  const proTips = [
    {
      title: "Multi-Keyword Intent Precision",
      tag: "Pro Tip #1",
      icon: Target,
      color: "border-[#D97706] bg-[#D97706]/10 text-[#D97706]",
      description: "Combine specific skill & topic keywords (e.g., 'react hooks state tutorial' or 'python dsa binary tree') in the intent box for razor-sharp video relevance matching.",
      benefit: "Maximizes focus score & eliminates edge-case clickbait"
    },
    {
      title: "One-Click Extension Toolbar Pinning",
      tag: "Pro Tip #2",
      icon: Pin,
      color: "border-[#10B981] bg-[#10B981]/10 text-[#10B981]",
      description: "Click the Chrome 🧩 puzzle piece icon and pin Focus AI Pro directly to your browser toolbar. This lets you toggle Focus Mode or update your intent in under 2 seconds.",
      benefit: "Instant 1-click access anytime on YouTube"
    },
    {
      title: "Strict (Hide) Mode for Deep Work Sprints",
      tag: "Pro Tip #3",
      icon: SlidersHorizontal,
      color: "border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]",
      description: "Switch from Filter Mode: Blur to Filter Mode: Strict (Hide) during high-stakes study sprints. Off-intent recommendations are completely removed from the page DOM.",
      benefit: "Zero visual distraction on your screen"
    },
    {
      title: "Audit Weekly Focus on the Dashboard",
      tag: "Pro Tip #4",
      icon: BarChart3,
      color: "border-[#EC4899] bg-[#EC4899]/10 text-[#EC4899]",
      description: "Click 'Open Dashboard' inside the popup to inspect your focus watchtime percentage, distraction metrics, and top learned topics logged in your local storage.",
      benefit: "Stay accountable to your learning targets"
    }
  ];

  return (
    <section id="google-upgrades" className="py-20 bg-[#1C1917] text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#2D2722] border border-[#3D3731] px-4 py-1.5 rounded-full text-xs font-bold text-[#D97706]">
            <Sparkles className="w-4 h-4" />
            <span>Power-User Experience Guide</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-white">
            Supercharge Your Focus Experience
          </h2>

          <p className="text-base sm:text-lg text-[#A8A29E] font-medium leading-relaxed">
            Get the absolute maximum productivity out of Focus AI Pro with these simple power-user tips and configuration settings.
          </p>
        </div>

        {/* Pro Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proTips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div 
                key={idx} 
                className="bg-[#2D2722] p-6 sm:p-8 rounded-3xl border border-[#3D3731] hover:border-[#D97706]/50 transition-all duration-300 space-y-4 group shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl border ${tip.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold font-mono uppercase tracking-wider text-[#A8A29E] bg-[#1C1917] px-3 py-1 rounded-full border border-[#3D3731]">
                    {tip.tag}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white group-hover:text-[#D97706] transition-colors">
                  {tip.title}
                </h3>

                <p className="text-sm sm:text-base text-[#D6D3D1] leading-relaxed">
                  {tip.description}
                </p>

                <div className="pt-4 border-t border-[#3D3731] flex items-center justify-between text-xs font-mono text-[#10B981]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    {tip.benefit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
