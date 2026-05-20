'use client';

import React, { useState } from 'react';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { Clock } from '@/components/Clock';
import { DeviceCard } from '@/components/DeviceCard';
import { TroubleshootingTool } from '@/components/TroubleshootingTool';
import { INITIAL_DEVICES } from '@/app/lib/network-data';
import { Shield, Activity, Globe, Wifi, Settings, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [devices] = useState(INITIAL_DEVICES);

  return (
    <main className="min-h-screen relative font-body text-white selection:bg-primary/30">
      <BackgroundEffects />

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        {/* Header Section */}
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
                FIREWALL: OPTIMAL
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary">
                <Zap className="w-3 h-3" />
                LATENCY: 12ms
              </span>
            </div>
          </div>
          <Clock />
        </header>

        {/* Top Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'NETWORK STATUS', value: 'ONLINE', icon: <Globe className="text-primary" />, sub: 'Uptime: 99.9%' },
            { label: 'CONNECTED NODES', value: devices.length.toString(), icon: <Wifi className="text-primary" />, sub: '1 Reserved' },
            { label: 'THREAT PROTECTION', value: 'VERIFIED', icon: <Shield className="text-primary" />, sub: '24h Scan Clean' }
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-6 flex items-center justify-between group cursor-default">
              <div className="space-y-1">
                <p className="text-[10px] font-headline font-bold text-muted-foreground tracking-[0.2em] uppercase">{stat.label}</p>
                <p className="text-3xl font-headline font-black tracking-tight">{stat.value}</p>
                <p className="text-[10px] font-code text-primary/60">{stat.sub}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Device Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-headline font-bold tracking-widest uppercase flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_#00D9FF]" />
              Infrastructure Map
            </h2>
            <button className="text-[10px] font-headline font-bold text-primary tracking-widest hover:underline decoration-primary/30 underline-offset-4">
              POLL ALL NODES
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </section>

        {/* AI Tool Section */}
        <TroubleshootingTool devices={devices} />

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground">
          <p className="text-[10px] font-code tracking-[0.3em] uppercase">
            &copy; 2024 NETVIGIL SYSTEMS • SECURE ARCHITECTURE
          </p>
          <div className="flex gap-8 text-[10px] font-headline font-bold tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">ACCESS LOGS</a>
            <a href="#" className="hover:text-primary transition-colors">CONFIG REPO</a>
            <a href="#" className="hover:text-primary transition-colors">SUPPORT</a>
          </div>
        </footer>
      </div>
    </main>
  );
}