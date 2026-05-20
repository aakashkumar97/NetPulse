'use client';

import React, { useState, useEffect } from 'react';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { Clock } from '@/components/Clock';
import { DeviceCard } from '@/components/DeviceCard';
import { SpeedTest } from '@/components/SpeedTest';
import { INITIAL_DEVICES } from '@/app/lib/network-data';
import { Activity, Globe, Building2, Network, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [devices] = useState(INITIAL_DEVICES);
  const [ipData, setIpData] = useState({ ip: 'DETECTING...', isp: 'FETCHING...' });
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    async function fetchNetworkInfo() {
      // Primary attempt using ipwho.is which provides IP and ISP in one call
      try {
        const res = await fetch('https://ipwho.is/', { cache: 'no-cache' });
        const data = await res.json();
        if (data && data.success) {
          setIpData({ 
            ip: data.ip, 
            isp: data.connection?.isp || data.connection?.org || 'DETECTED ISP' 
          });
          return;
        }
      } catch (e) {
        console.warn('Primary IP fetch failed, trying fallback...');
      }

      // Fallback: Just get the IP from ipify if everything else fails
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        if (data && data.ip) {
          setIpData({ ip: data.ip, isp: 'ISP PROTECTED' });
        }
      } catch (e) {
        setIpData({ ip: 'PRIVATE_NODE', isp: 'SECURE_TUNNEL' });
      }
    }
    
    fetchNetworkInfo();
  }, []);

  useEffect(() => {
    async function checkLatency() {
      const start = performance.now();
      try {
        // High availability endpoint for latency check
        await fetch('https://www.google.com/favicon.ico', { 
          mode: 'no-cors', 
          cache: 'no-cache',
          priority: 'high'
        });
        const end = performance.now();
        setLatency(Math.round(end - start));
      } catch (error) {
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
                SYSTEM: ACTIVE
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                FIREWALL: OPTIMAL
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
              label: 'NETWORK STATUS', 
              value: latency ? 'ONLINE' : 'OFFLINE', 
              icon: <Globe className={latency ? "text-primary" : "text-rose-500"} />, 
              sub: latency ? `Latency: ${latency}ms` : 'Connectivity issue' 
            },
            { 
              label: 'PUBLIC IP', 
              value: ipData.ip, 
              icon: <Network className="text-primary" />, 
              sub: 'Detected Node' 
            },
            { 
              label: 'ISP PROVIDER', 
              value: ipData.isp, 
              icon: <Building2 className="text-primary" />, 
              sub: 'Active Gateway' 
            }
          ].map((stat, idx) => (
            <div key={idx} className="glass-card p-6 flex items-center justify-between group cursor-default transition-all duration-300 hover:scale-[1.02] hover:border-primary/40">
              <div className="space-y-1">
                <p className="text-[10px] font-headline font-bold text-muted-foreground tracking-[0.2em] uppercase">{stat.label}</p>
                <p className="text-xl md:text-2xl font-headline font-black tracking-tight truncate max-w-[200px] md:max-w-none">{stat.value}</p>
                <p className="text-[10px] font-code text-primary/60">{stat.sub}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
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
