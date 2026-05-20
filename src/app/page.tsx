'use client';

import React, { useState, useEffect } from 'react';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { Clock } from '@/components/Clock';
import { DeviceCard } from '@/components/DeviceCard';
import { INITIAL_DEVICES, Device } from '@/app/lib/network-data';
import { NetworkTools } from '@/components/NetworkTools';
import { ShieldCheck, RefreshCw, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [internetStatus, setInternetStatus] = useState<'CHECKING' | 'ONLINE' | 'OFFLINE'>('CHECKING');
  const [latency, setLatency] = useState<number | null>(null);
  const [lastScan, setLastScan] = useState<string>('');

  // Internet Status & Latency Check
  useEffect(() => {
    async function checkInternet() {
      const start = performance.now();
      try {
        // Checking connectivity via fetch with no-cors
        await fetch('https://8.8.8.8/favicon.ico', { mode: 'no-cors', cache: 'no-cache', priority: 'high' });
        setLatency(Math.round(performance.now() - start));
        setInternetStatus('ONLINE');
      } catch {
        setLatency(null);
        setInternetStatus('OFFLINE');
      }
    }
    
    checkInternet();
    const interval = setInterval(checkInternet, 15000); // 15s sync for internet
    return () => clearInterval(interval);
  }, []);

  // Device Accessibility IP Check Logic
  useEffect(() => {
    async function checkDeviceStatus(device: Device): Promise<Device> {
      const url = `http://${device.ipAddress}`;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 

        await fetch(url, { 
          mode: 'no-cors', 
          cache: 'no-cache',
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        return { ...device, status: 'ONLINE' };
      } catch (error) {
        return { ...device, status: 'OFFLINE' }; 
      }
    }

    async function updateAllStatuses() {
      const updatedDevices = await Promise.all(devices.map(d => checkDeviceStatus(d)));
      setDevices(updatedDevices);
      setLastScan(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      }));
    }

    updateAllStatuses();
    const interval = setInterval(updateAllStatuses, 15000); 
    return () => clearInterval(interval);
  }, []);

  const onlineNodes = devices.filter(d => d.status === 'ONLINE').length;
  const networkHealth = Math.round((onlineNodes / devices.length) * 100);

  return (
    <main className="min-h-screen relative font-body text-slate-300 selection:bg-primary/30">
      <BackgroundEffects />

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tighter text-slate-200 uppercase">
              NETPULSE <span className="text-primary neon-text">HOME</span>
            </h1>
            <div className="flex flex-wrap gap-3 items-center font-code text-[10px] tracking-widest text-muted-foreground uppercase">
              <span className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 border rounded-full transition-colors duration-500",
                internetStatus === 'ONLINE' ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400/80" : 
                internetStatus === 'OFFLINE' ? "bg-rose-500/5 border-rose-500/10 text-rose-400/80" :
                "bg-amber-500/5 border-amber-500/10 text-amber-400/80"
              )}>
                <Wifi className="w-3 h-3" />
                INTERNET: {internetStatus} {latency ? `(${latency}ms)` : ''}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-emerald-400/80">
                <ShieldCheck className="w-3 h-3" />
                NODE HEALTH: {networkHealth}%
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/30">
                <RefreshCw className="w-3 h-3" />
                SYNC: {lastScan || '--:--:--'}
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
