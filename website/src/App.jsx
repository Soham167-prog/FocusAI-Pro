import React, { useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DownloadSection from './components/DownloadSection';
import InstallGuide from './components/InstallGuide';
import InteractiveSimulator from './components/InteractiveSimulator';
import DashboardPreview from './components/DashboardPreview';
import GoogleUpgrades from './components/GoogleUpgrades';
import PrivacySecurity from './components/PrivacySecurity';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  const downloadRef = useRef(null);
  const simulatorRef = useRef(null);

  const scrollToDownload = () => {
    downloadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#141312] selection:bg-[#2C2621] selection:text-[#E8DED1]">
      <Navbar onDownloadClick={scrollToDownload} />
      
      <main>
        <Hero 
          onDownloadClick={scrollToDownload} 
          onExploreDemo={scrollToSimulator} 
        />
        
        <DownloadSection downloadRef={downloadRef} />
        
        <InstallGuide onDownloadClick={scrollToDownload} />
        
        <InteractiveSimulator simulatorRef={simulatorRef} />
        
        <DashboardPreview />
        
        <GoogleUpgrades />
        
        <PrivacySecurity />
        
        <FAQ />
      </main>

      <Footer onDownloadClick={scrollToDownload} />
    </div>
  );
}
