'use client';

import React, { useState, useEffect } from 'react';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { Clock } from '@/components/Clock';
import { DeviceCard } from '@/components/DeviceCard';
import { INITIAL_DEVICES, Device } from '@/app/lib/network-data';
import { NetworkTools } from '@/components/NetworkTools';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const [devices] = useState<Device[]>(INITIAL_DEVICES);
  const [lastSync, setLastSync] = useState<string>('');

  // Last sync timestamp update - Runs on mount and every 15s
  useEffect(() => {
    async function updateSync() {
      setLastSync(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      }));
    }
    
    updateSync();
    const interval = setInterval(updateSync, 15000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen relative font-body text-slate-300 selection:bg-primary/30">
      <BackgroundEffects />

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tighter text-slate-200 uppercase">
              NETPULSE <span className="text-primary neon-text font-bold">HOME</span>
            </h1>
            <div className="flex flex-wrap gap-3 items-center font-code text-[10px] tracking-widest text-muted-foreground uppercase">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/30">
                <RefreshCw className="w-3 h-3" />
                LAST SYNC: {lastSync || 'CHECKING...'}
              </span>
            </div>
          </div>
          <Clock />
        </header>

        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-headline font-bold tracking-widest uppercase flex items-center gap-4">
              <span className="w-2 h-10 bg-primary/80 rounded-full shadow-[0_0_15px_#8B5CF666]" />
              Network Node Control
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-headline font-bold tracking-widest uppercase flex items-center gap-4">
              <span className="w-2 h-10 bg-accent/80 rounded-full shadow-[0_0_15px_#00D9FF66]" />
              Infrastructure Utilities
            </h2>
          </div>
          <NetworkTools />
        </section>

        <footer className="mt-20 py-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground">
          <p className="text-[10px] font-code tracking-[0.3em] uppercase">
            &copy; 2026 NETPULSE SYSTEMS • PRIVATE HOME INFRASTRUCTURE
          </p>
        </footer>
      </div>
    </main>
  );
}
