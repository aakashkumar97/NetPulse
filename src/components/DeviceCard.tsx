
'use client';

import React, { useState } from 'react';
import { Device } from '@/app/lib/network-data';
import { MoreVertical, Network, Wifi, Server, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [showInfo, setShowInfo] = useState(false);

  const icons = {
    router: <Network className="w-10 h-10 text-primary" />,
    extender: <Wifi className="w-10 h-10 text-primary" />,
    gpon: <Server className="w-10 h-10 text-primary" />,
  };

  return (
    <div className="glass-card group p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]">
      {/* Top Controls */}
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-primary/10 hover:bg-primary/20 transition-colors z-20"
      >
        <MoreVertical className="w-5 h-5 text-primary" />
      </button>

      {/* Icon Box */}
      <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 animate-pulse-glow group-hover:scale-110 transition-transform">
        <div className="drop-shadow-[0_0_15px_rgba(0,217,255,0.8)]">
          {icons[device.type]}
        </div>
      </div>

      <h3 className="text-2xl font-headline font-bold mb-1 tracking-tight">{device.name}</h3>
      <p className="font-code text-[10px] text-primary/60 mb-1 tracking-[0.2em] uppercase">{device.model}</p>
      <p className="font-code text-sm text-muted-foreground mb-6 tracking-wider">{device.ipAddress}</p>

      {/* Status */}
      <div className="flex items-center gap-2 mb-8 text-sm font-medium tracking-widest">
        <div className={cn(
          "w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px]",
          device.status === 'ONLINE' ? "bg-emerald-400 shadow-emerald-400" : "bg-rose-400 shadow-rose-400"
        )} />
        <span className={device.status === 'ONLINE' ? "text-emerald-400" : "text-rose-400"}>
          {device.status}
        </span>
      </div>

      <Button 
        asChild 
        variant="outline" 
        className="w-full font-headline tracking-widest bg-white/5 border-primary/30 hover:bg-primary/10 hover:border-primary text-primary transition-all rounded-xl"
      >
        <a href={`http://${device.ipAddress}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          LAUNCH ADMIN
        </a>
      </Button>

      {/* Info Panel Overlay */}
      <div className={cn(
        "absolute inset-0 bg-background/95 backdrop-blur-2xl z-10 p-8 flex flex-col justify-center gap-3 transition-all duration-300",
        showInfo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
      )}>
        <h4 className="text-xl font-headline font-bold text-primary mb-2 text-center underline decoration-primary/30 underline-offset-8">
          {device.name.toUpperCase()} SYSTEM INFO
        </h4>
        
        {[
          { label: 'Manufacturer', value: device.manufacturer },
          { label: 'Model', value: device.model },
          { label: 'Firmware', value: device.firmware },
          { label: 'MAC Address', value: device.mac },
          { label: 'SSID', value: device.ssid || 'N/A' },
          { label: 'Security', value: 'WPA3/WPA2' }
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-primary/5 rounded-xl text-xs font-medium">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="text-primary tracking-wide">{item.value}</span>
          </div>
        ))}

        <Button 
          onClick={() => setShowInfo(false)}
          className="mt-4 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 rounded-xl font-headline"
        >
          CLOSE PROTOCOL
        </Button>
      </div>
    </div>
  );
}
