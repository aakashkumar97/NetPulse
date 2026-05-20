'use client';

import React, { useState } from 'react';
import { Device } from '@/app/lib/network-data';
import { Info, Network, Wifi, Server, ExternalLink, Eye, EyeOff, Lock, User, Terminal, Router } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const icons = {
    router: <Router className="w-10 h-10 text-primary" />,
    extender: <Wifi className="w-10 h-10 text-primary" />,
    gpon: <Server className="w-10 h-10 text-primary" />,
  };

  const currentPass = device.wireless24?.password || device.wireless5?.password;

  return (
    <div className="glass-card group p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] relative border-white/5">
      {/* Top Controls */}
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-6 right-6 p-2 rounded-2xl bg-white/5 border border-primary/10 hover:bg-primary/20 transition-colors z-20"
        title="View Details"
      >
        <Info className="w-5 h-5 text-primary" />
      </button>

      {/* Icon Box */}
      <div className="w-24 h-24 rounded-[2rem] bg-primary/5 border border-primary/20 flex items-center justify-center mb-6 animate-pulse-glow group-hover:scale-110 transition-transform">
        <div className="drop-shadow-[0_0_15px_rgba(0,217,255,0.8)]">
          {icons[device.type]}
        </div>
      </div>

      <h3 className="text-2xl font-headline font-bold mb-1 tracking-tight">{device.name}</h3>
      <p className="font-code text-[10px] text-primary/60 mb-2 tracking-[0.2em] uppercase">{device.model}</p>
      
      {device.description && (
        <p className="text-[10px] text-muted-foreground/80 mb-4 font-body leading-relaxed max-w-[200px]">
          {device.description}
        </p>
      )}

      <div className="font-code text-sm text-primary mb-6 py-1.5 px-4 bg-primary/5 border border-primary/10 rounded-full tracking-wider">
        {device.ipAddress}
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-2 mb-8 text-xs font-bold tracking-widest uppercase">
        <div className={cn(
          "w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px]",
          device.status === 'ONLINE' ? "bg-emerald-400 shadow-emerald-400" : "bg-rose-400 shadow-rose-400"
        )} />
        <span className={device.status === 'ONLINE' ? "text-emerald-400" : "text-rose-400"}>
          {device.status}
        </span>
      </div>

      <Button 
        asChild 
        variant="outline" 
        className="w-full font-headline tracking-widest bg-primary/10 border-primary/30 hover:bg-primary hover:text-black hover:border-primary transition-all rounded-2xl h-14"
      >
        <a href={device.webGuiUrl} target="_blank" rel="noopener noreferrer">
          <Terminal className="mr-2 h-4 w-4" />
          LAUNCH ADMIN
        </a>
      </Button>

      {/* Info Panel Overlay - Opaque and sharp-corner fix applied via glass-card parent class rounding */}
      <div className={cn(
        "absolute inset-0 bg-[#050816] z-50 p-8 flex flex-col transition-all duration-500 rounded-[2.5rem] border-2 border-primary/50",
        showInfo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
      )}>
        <h4 className="text-xl font-headline font-bold text-primary mb-6 text-center tracking-[0.1em] uppercase">
          Node Protocols
        </h4>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Architecture</p>
              <p className="text-xs text-white font-medium">{device.manufacturer} - {device.model}</p>
            </div>
            
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left">
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Firmware OS</p>
              <p className="text-xs text-primary font-code truncate">{device.firmware}</p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground uppercase font-bold">Admin Credentials</span>
                <Lock className="w-3 h-3 text-primary/40" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-primary/60" />
                  <span className="text-[10px] text-primary font-code">{device.username || 'admin'}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-primary/20" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-primary font-code">{device.adminPassword || '••••'}</span>
                </div>
              </div>
            </div>
          </div>

          {currentPass && (
            <div className="p-4 bg-white/5 border border-primary/20 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-muted-foreground text-[9px] uppercase font-bold tracking-widest">WiFi Key</span>
                <Wifi className="w-3 h-3 text-primary/60" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary tracking-widest font-code text-sm">
                  {showPassword ? currentPass : '••••••••'}
                </span>
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        <Button 
          onClick={() => {
            setShowInfo(false);
            setShowPassword(false);
          }}
          className="mt-6 bg-primary/5 border border-primary/30 text-primary hover:bg-primary/20 rounded-2xl font-headline shrink-0 h-14 tracking-widest"
        >
          CLOSE PROTOCOL
        </Button>
      </div>
    </div>
  );
}
