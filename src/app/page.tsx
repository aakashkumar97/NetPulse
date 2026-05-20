'use client';

import React, { useState, useEffect } from 'react';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { Clock } from '@/components/Clock';
import { DeviceCard } from '@/components/DeviceCard';
import { SpeedTest } from '@/components/SpeedTest';
import { INITIAL_DEVICES } from '@/app/lib/network-data';
import { Activity, Download, Upload, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [devices] = useState(INITIAL_DEVICES);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    async function checkLatency() {
      const start = performance.now();
      try {
        // High-priority ping to check backbone latency
        await fetch('https://8.8.8.8/favicon.ico', { 
          mode: 'no-cors', 
          cache: 'no-cache',
          priority: 'high'
        });
        const end = performance.now();
        setLatency(Math.round(end - start));
      } catch (error) {
        // Fallback to generic endpoint
        try {
          const s = performance.now();
          await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-cache' });
          setLatency(Math.round(performance.now() - s));
        } catch (e) {
          setLatency(null);
        }
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
                SYSTEM: ACTIVE
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                SECURITY: OPTIMAL
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary">
                <Zap className="w-3 h-3" />
                LATENCY: {latency ? `${latency}ms` : '---'}
              </span>
            </div>
          </div>
          <Clock />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { 
              label: 'NETWORK HEALTH', 
              value: latency ? 'OPTIMAL' : 'CHECKING...', 
              icon: <Activity className={latency ? "text-primary" : "text-rose-500"} />, 
              sub: latency ? `Ping: ${latency}ms` : 'Verifying Gateway' 
            },
            { 
              label: 'DOWNLOAD CAPACITY', 
              value: 'MONITORING', 
              icon: <Download className="text-primary" />, 
              sub: '300 Mbps+ Optimized' 
            },
            { 
              label: 'UPLOAD CAPACITY', 
              value: 'MONITORING', 
              icon: <Upload className="text-secondary" />, 
              sub: 'High-Concurrency Support' 
            }
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-8 flex items-center justify-between group cursor-default transition-all duration-300 hover:scale-[1.02] hover:border-primary/40">
              <div className="space-y-1">
                <p className="text-[10px] font-headline font-bold text-muted-foreground tracking-[0.2em] uppercase">{stat.label}</p>
                <p className="text-xl md:text-2xl font-headline font-black tracking-tight truncate max-w-[200px] md:max-w-none uppercase">{stat.value}</p>
                <p className="text-[10px] font-code text-primary/60">{stat.sub}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-[0_0_15px_rgba(0,217,255,0.1)]">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Speed Test Utility */}
        <SpeedTest />

        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-headline font-bold tracking-widest uppercase flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_#00D9FF]" />
              Infrastructure Map
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </section>

        <footer className="mt-20 py-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground">
          <p className="text-[10px] font-code tracking-[0.3em] uppercase">
            &copy; 2024 NETVIGIL SYSTEMS • SECURE ARCHITECTURE
          </p>
        </footer>
      </div>
    </main>
  );
}
