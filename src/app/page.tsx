'use client';

import React, { useState, useEffect } from 'react';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { Clock } from '@/components/Clock';
import { DeviceCard } from '@/components/DeviceCard';
import { INITIAL_DEVICES } from '@/app/lib/network-data';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [devices] = useState(INITIAL_DEVICES);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    async function checkLatency() {
      const start = performance.now();
      try {
        await fetch('https://8.8.8.8/favicon.ico', { mode: 'no-cors', cache: 'no-cache', priority: 'high' });
        setLatency(Math.round(performance.now() - start));
      } catch {
        setLatency(null);
      }
    }
    checkLatency();
    const interval = setInterval(checkLatency, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen relative font-body text-white selection:bg-primary/30">
      <BackgroundEffects />

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              NETVIGIL <span className="text-primary neon-text">AI</span>
            </h1>
            <div className="flex flex-wrap gap-4 items-center font-code text-xs tracking-widest text-muted-foreground uppercase">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary">
                <Activity className="w-3 h-3" />
                TOPOLOGY: ACTIVE
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                NODES: 03
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary">
                <Zap className="w-3 h-3" />
                PING: {latency ? `${latency}ms` : '---'}
              </span>
            </div>
          </div>
          <Clock />
        </header>

        {/* Device Infrastructure Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-headline font-bold tracking-widest uppercase flex items-center gap-4">
              <span className="w-2 h-10 bg-primary rounded-full shadow-[0_0_20px_#00D9FF]" />
              Network Node Control
            </h2>
            <div className="hidden md:flex gap-4 font-code text-[10px] text-muted-foreground uppercase tracking-widest bg-white/5 px-6 py-2 border border-white/5 rounded-full">
              <span>ONU: 192.168.100.1</span>
              <span className="text-primary opacity-50">•</span>
              <span>Router: 192.168.7.1</span>
              <span className="text-primary opacity-50">•</span>
              <span>Extndr: 192.168.7.2</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </section>

        <footer className="mt-20 py-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground">
          <p className="text-[10px] font-code tracking-[0.3em] uppercase">
            &copy; 2024 NETVIGIL SYSTEMS • MULTI-GATEWAY INFRASTRUCTURE
          </p>
        </footer>
      </div>
    </main>
  );
}
