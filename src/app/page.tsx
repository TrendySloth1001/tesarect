"use client";

import Hyperspeed from "@/components/Hyperspeed";
import { hyperspeedPresets } from "@/components/HyperSpeedPresets";
import Portfolio from "@/components/Portfolio";

export default function Home() {
  return (
    <>
      {/* Background Animation */}
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        background: '#000000'
      }}>
        <Hyperspeed
          effectOptions={hyperspeedPresets.six}
        />
      </div>
      
      {/* Portfolio Content */}
      <Portfolio />
    </>
  );
}
