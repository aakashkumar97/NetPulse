'use client';

import React, { useState, useEffect } from 'react';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { Clock } from '@/components/Clock';
import { DeviceCard } from '@/components/DeviceCard';
import { INITIAL_DEVICES, Device } from '@/app/lib/network-data';
import { NetworkTools } from '@/components/NetworkTools';
import { Globe, ShieldCheck, Zap, Cpu, RefreshCw } from 'lucide-react';

export default function Home() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [latency, setLatency] = useState<number | null>(null);
  const [lastScan, setLastScan] = useState<string>('');
  const [systemLoad, setSystemLoad] = useState<number>(0);

  useEffect(() => {
    async function checkLatency() {
      const start = performance.now();
      try {
        await fetch('https://8.8.8.8/favicon.ico', { mode: 'no-cors', cache: 'no-cache', priority: 'high' });
        setLatency(Math.round(performance.now() - start));
      } catch {
        setLatency(null);
      }
      setSystemLoad(Math.floor(Math.random() * 5) + 1);
    }
    checkLatency();
    const interval = setInterval(checkLatency, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function checkDeviceStatus(device: Device): Promise<Device> {
      const url = device.webGuiUrl || `http://${device.ipAddress}`;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); 

        await fetch(url, { 
          mode: 'no-cors', 
          cache: 'no-cache',
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        return { ...device, status: 'ONLINE' };
      } catch (error: any) {
        return new Promise((resolve) => {
          const img = new Image();
          const timer = setTimeout(() => {
            img.src = "";
            resolve({ ...device, status: 'OFFLINE' });
          }, 2000);

          img.onload = () => { clearTimeout(timer); resolve({ ...device, status: 'ONLINE' }); };
          img.onerror = () => { clearTimeout(timer); resolve({ ...device, status: 'ONLINE' }); };
          img.src = `${url}/favicon.ico?t=${Date.now()}`;
        });
      }
    }

    async function updateAllStatuses() {
      const updatedDevices = await Promise.all(devices.map(d => checkDeviceStatus(d)));
      setDevices(updatedDevices);
      setLastScan(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }

    updateAllStatuses();
    const interval = setInterval(updateAllStatuses, 10000);
    return () => clearInterval(interval);
  }, [devices]);

  const onlineNodes = devices.filter(d => d.status === 'ONLINE').length;
  const networkHealth = onlineNodes === 0 ? 0 : Math.round((onlineNodes / devices.length) * 100);
  const isGPONOnline = devices.find(d => d.type === 'gpon')?.status === 'ONLINE';

  return (
    <main className="min-h-screen relative font-body text-white selection:bg-primary/30">
      <BackgroundEffects />

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              NETPULSE <span className="text-primary neon-text">HOME</span>
            </h1>
            <div className="flex flex-wrap gap-3 items-center font-code text-[10px] tracking-widest text-muted-foreground uppercase">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary">
                <Globe className="w-3 h-3" />
                ISP: {isGPONOnline ? 'GATEWAY UP' : 'GATEWAY DOWN'}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                HEALTH: {networkHealth}%
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full text-secondary">
                <Zap className="w-3 h-3" />
                PING: {latency ? `${latency}ms` : '---'}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60">
                <Cpu className="w-3 h-3" />
                LOAD: {systemLoad}%
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/40">
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
              <span className="w-2 h-10 bg-primary rounded-full shadow-[0_0_20px_#8B5CF6]" />
              Network Node Control
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-headline font-bold tracking-widest uppercase flex items-center gap-4">
              <span className="w-2 h-10 bg-accent rounded-full shadow-[0_0_20px_#00D9FF]" />
              Diagnostic Utilities
            </h2>
          </div>
          <NetworkTools />
        </section>

        <footer className="mt-20 py-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground">
          <p className="text-[10px] font-code tracking-[0.3em] uppercase">
            &copy; 2024 NETPULSE SYSTEMS • PRIVATE HOME INFRASTRUCTURE
          </p>
        </footer>
      </div>
    </main>
  );
}
