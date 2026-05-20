'use client';

import React, { useState } from 'react';
import { Device } from '@/app/lib/network-data';
import { MoreVertical, Network, Wifi, Server, ExternalLink, Eye, EyeOff, Lock, User } from 'lucide-react';
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
    router: <Network className="w-10 h-10 text-primary" />,
    extender: <Wifi className="w-10 h-10 text-primary" />,
    gpon: <Server className="w-10 h-10 text-primary" />,
  };

  const currentPass = device.wireless24?.password || device.wireless5?.password;

  return (
    <div className="glass-card group p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]">
      {/* Top Controls */}
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-6 right-6 p-2 rounded-2xl bg-white/5 border border-primary/10 hover:bg-primary/20 transition-colors z-20"
      >
        <MoreVertical className="w-5 h-5 text-primary" />
      </button>

      {/* Icon Box */}
      <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 animate-pulse-glow group-hover:scale-110 transition-transform">
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
        className="w-full font-headline tracking-widest bg-white/5 border-primary/30 hover:bg-primary/10 hover:border-primary text-primary transition-all rounded-2xl h-12"
      >
        <a href={device.webGuiUrl || `http://${device.ipAddress}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          LAUNCH ADMIN
        </a>
      </Button>

      {/* Info Panel Overlay - Fully Opaque Background */}
      <div className={cn(
        "absolute inset-0 bg-[#0a0f25] z-50 p-8 flex flex-col transition-all duration-300 rounded-[inherit]",
        showInfo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
      )}>
        <h4 className="text-xl font-headline font-bold text-primary mb-4 text-center underline decoration-primary/30 underline-offset-8 shrink-0">
          {device.name.toUpperCase()} SYSTEM INFO
        </h4>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-left">
                <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Firmware</p>
                <p className="text-[10px] text-primary truncate">{device.firmware}</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-left">
                <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">MAC ADDR</p>
                <p className="text-[10px] text-primary truncate font-code uppercase">{device.mac}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/10 rounded-2xl">
              <User className="w-3 h-3 text-primary/60" />
              <span className="text-[10px] text-muted-foreground">Admin:</span>
              <span className="text-[10px] text-primary font-code">{device.username || 'N/A'}</span>
              <Separator orientation="vertical" className="h-3 bg-primary/20" />
              <Lock className="w-3 h-3 text-primary/60" />
              <span className="text-[10px] text-primary font-code">{device.adminPassword || '••••'}</span>
            </div>
          </div>

          {device.wireless24 && (
            <div className="p-4 bg-white/5 border border-primary/10 rounded-2xl text-left space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-primary/20 text-[8px] text-primary font-bold rounded-bl-xl">2.4GHz</div>
              <p className="text-[10px] font-bold text-white truncate pr-10">{device.wireless24.ssid}</p>
              <div className="grid grid-cols-3 gap-2 text-[9px]">
                <div><span className="text-muted-foreground">CH:</span> <span className="text-primary">{device.wireless24.channel}</span></div>
                <div><span className="text-muted-foreground">BW:</span> <span className="text-primary">{device.wireless24.bandwidth}</span></div>
                <div><span className="text-muted-foreground">PWR:</span> <span className={cn(
                  device.wireless24.transmitPower === 'High' ? "text-rose-400" : "text-emerald-400"
                )}>{device.wireless24.transmitPower}</span></div>
              </div>
            </div>
          )}

          {device.wireless5 ? (
            <div className="p-4 bg-white/5 border border-secondary/20 rounded-2xl text-left space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-secondary/20 text-[8px] text-secondary font-bold rounded-bl-xl">5GHz</div>
              <p className="text-[10px] font-bold text-white pr-10">{device.wireless5.ssid}</p>
              <div className="grid grid-cols-3 gap-2 text-[9px]">
                <div><span className="text-muted-foreground">CH:</span> <span className="text-secondary">{device.wireless5.channel}</span></div>
                <div><span className="text-muted-foreground">BW:</span> <span className="text-secondary">{device.wireless5.bandwidth}</span></div>
                <div><span className="text-muted-foreground">PWR:</span> <span className="text-secondary">{device.wireless5.transmitPower}</span></div>
              </div>
            </div>
          ) : (
            device.type !== 'gpon' && <div className="p-2 text-[8px] text-muted-foreground italic text-center">5GHz Interface Disabled</div>
          )}

          {currentPass && (
            <div className="flex justify-between items-center p-3 bg-primary/10 border border-primary/20 rounded-2xl text-xs font-medium">
              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">WiFi PASS</span>
              <div className="flex items-center gap-2">
                <span className="text-primary tracking-widest font-code text-sm">
                  {showPassword ? currentPass : '••••••••'}
                </span>
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
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
          className="mt-6 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 rounded-2xl font-headline shrink-0 h-12"
        >
          CLOSE PROTOCOL
        </Button>
      </div>
    </div>
  );
}
