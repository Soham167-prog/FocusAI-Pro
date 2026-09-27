import React, { useState } from 'react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { Download, FileCode, Check, ShieldCheck, Sparkles, FolderArchive, HardDrive, Terminal } from 'lucide-react';
import { EXTENSION_FILES } from '../data/extensionFiles';

export default function DownloadSection({ downloadRef }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const handleZipDownload = async () => {
    try {
      setDownloading(true);
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti non-critical err:', err);
      }

      const zip = new JSZip();
      
      // Add all extension files to zip root
      Object.entries(EXTENSION_FILES).forEach(([filename, content]) => {
        zip.file(filename, content);
      });

      // Generate blob
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Trigger download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Focus-AI-Pro-v2.0.0.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 5000);
    } catch (error) {
      console.error('Failed to generate zip:', error);
      setDownloading(false);
    }
  };

  return (
    <section id="download" ref={downloadRef} className="py-16 bg-[#ECEAE4] border-y border-[#DFDDD6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#1C1917] rounded-3xl p-6 sm:p-10 text-[#F5F2EB] shadow-2xl border border-[#3D3731] relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#2D2722] border border-[#3D3731] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#D97706]">
                <FolderArchive className="w-4 h-4" />
                <span>Ready for Chrome, Brave & Edge</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
                Download Focus AI Pro Extension Zip
              </h2>

              <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
                Click below to download the unpacked extension package formatted for instant Chrome installation. No registration, no ads, no trackers.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleZipDownload}
                  disabled={downloading}
                  className="flex items-center justify-center gap-3 bg-[#D97706] hover:bg-[#EA580C] text-white px-8 py-4 rounded-2xl font-extrabold text-base shadow-lg transition-all active:scale-95 border border-[#F59E0B]/30 disabled:opacity-50"
                >
                  {downloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Packaging Zip...</span>
                    </>
                  ) : downloadDone ? (
                    <>
                      <Check className="w-5 h-5 text-white" />
                      <span>Downloaded! Check Downloads Folder</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 text-white" />
                      <span>Download Focus-AI-Pro-v2.0.0.zip</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#8C857B] pt-2">
                <span className="flex items-center gap-1 text-[#10B981]">
                  <ShieldCheck className="w-4 h-4" />
                  100% Free & Open Source
                </span>
                <span>•</span>
                <span>9 Files Bundled</span>
                <span>•</span>
                <span>~320 KB</span>
              </div>
            </div>

            {/* Right File Manifest Block */}
            <div className="lg:col-span-5 bg-[#2D2722] rounded-2xl p-5 border border-[#3D3731] space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#3D3731]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] flex items-center gap-1.5">
                  <FileCode className="w-4 h-4" />
                  Package Contents
                </span>
                <span className="text-xs font-mono text-[#A8A29E]">Manifest V3</span>
              </div>

              <ul className="space-y-2 font-mono text-xs text-[#D6D3D1]">
                <li className="flex items-center justify-between bg-[#1C1917] p-2 rounded border border-[#3D3731]">
                  <span className="text-white font-semibold">manifest.json</span>
                  <span className="text-[#8C857B]">Extension Config</span>
                </li>
                <li className="flex items-center justify-between bg-[#1C1917] p-2 rounded border border-[#3D3731]">
                  <span className="text-[#10B981] font-semibold">content.js</span>
                  <span className="text-[#8C857B]">YouTube DOM Engine</span>
                </li>
                <li className="flex items-center justify-between bg-[#1C1917] p-2 rounded border border-[#3D3731]">
                  <span className="text-[#D97706] font-semibold">focus-core.js</span>
                  <span className="text-[#8C857B]">AI Scoring Logic</span>
                </li>
                <li className="flex items-center justify-between bg-[#1C1917] p-2 rounded border border-[#3D3731]">
                  <span className="text-white font-semibold">popup.html & popup.js</span>
                  <span className="text-[#8C857B]">Intent Controller</span>
                </li>
                <li className="flex items-center justify-between bg-[#1C1917] p-2 rounded border border-[#3D3731]">
                  <span className="text-white font-semibold">dashboard.html & .js</span>
                  <span className="text-[#8C857B]">Watchtime Analytics</span>
                </li>
              </ul>

              <div className="pt-2 text-[11px] text-[#8C857B] text-center">
                Fully compatible with Chrome, Brave, Edge, Arc & Opera.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
