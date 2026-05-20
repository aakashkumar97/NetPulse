'use client';

import React, { useState } from 'react';
import { Device } from '@/app/lib/network-data';
import { Info, Wifi, Server, Terminal, Router as RouterIcon, Shield, Cpu, Lock, User, Eye, EyeOff, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const icons = {
    router: <RouterIcon className="w-10 h-10 text-primary" />,
    extender: <Wifi className="w-10 h-10 text-primary" />,
    gpon: <Server className="w-10 h-10 text-primary" />,
  };

  const ssid = device.wireless24?.ssid || device.wireless5?.ssid || 'N/A';
  const wifiPass = device.wireless24?.password || device.wireless5?.password || 'N/A';
  
  const wifiQrString = `WIFI:S:${ssid};T:WPA;P:${wifiPass};;`;
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(wifiQrString)}&size=300&margin=2&ecLevel=M`;

  return (
    <div className="glass-card group p-8 flex flex-col items-center text-center transition-all duration-300 relative border-white/5 h-full min-h-[500px]">
      {/* Info Icon Button - Clean Style */}
      <button 
        onClick={() => {
          setShowInfo(!showInfo);
          setShowQR(false);
        }}
        className="absolute top-6 right-6 p-1 z-20 transition-all opacity-40 hover:opacity-100"
        title="Device Information"
      >
        <Info className="w-6 h-6 text-primary" />
      </button>

      {/* Icon Box */}
      <div className="w-24 h-24 rounded-[2rem] bg-primary/5 border border-primary/20 flex items-center justify-center mb-6">
        <div className="drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]">
          {icons[device.type]}
        </div>
      </div>

      <h3 className="text-3xl font-headline font-bold mb-2 tracking-tight">{device.name}</h3>
      
      <div className="flex flex-col items-center gap-1.5 mb-3">
        <span className="font-code text-xs tracking-[0.2em] uppercase text-primary/80">{device.manufacturer}</span>
        <span className="font-code text-[11px] tracking-[0.1em] text-muted-foreground">{device.ipAddress}</span>
      </div>
      
      {device.description && (
        <p className="text-xs text-muted-foreground/80 mb-4 font-body leading-relaxed max-w-[240px]">
          {device.description}
        </p>
      )}

      {/* Status Indicators */}
      <div className="flex items-center gap-2 mb-6 text-xs font-bold tracking-widest uppercase">
        <div className={cn(
          "w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px]",
          device.status === 'ONLINE' ? "bg-emerald-400 shadow-emerald-400" : "bg-rose-400 shadow-rose-400"
        )} />
        <span className={device.status === 'ONLINE' ? "text-emerald-400" : "text-rose-400"}>
          {device.status}
        </span>
      </div>

      {/* Button Container */}
      <div className="mt-auto w-full space-y-3">
        <Button 
          onClick={() => {
            setShowQR(true);
            setShowInfo(false);
          }}
          variant="outline" 
          className="w-full font-headline tracking-widest bg-white/5 border-white/10 hover:bg-primary/10 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-500 rounded-2xl h-11 text-xs"
        >
          <QrCode className="mr-2 h-4 w-4 text-primary group-hover:animate-pulse" />
          SHOW WIFI QR
        </Button>

        <Button 
          asChild 
          variant="outline" 
          className="w-full font-headline tracking-widest bg-primary/10 border-primary/30 hover:bg-primary hover:text-background hover:border-primary transition-all duration-500 rounded-2xl h-12 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
        >
          <a href={device.webGuiUrl} target="_blank" rel="noopener noreferrer">
            <Terminal className="mr-2 h-4 w-4" />
            LAUNCH ADMIN
          </a>
        </Button>
      </div>

      {/* Info Panel Overlay */}
      <div className={cn(
        "absolute inset-0 bg-[#050816] z-50 p-10 pb-12 flex flex-col transition-all duration-500 rounded-[2.5rem] border-2 border-primary/50",
        showInfo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
      )}>
        <h4 className="text-xl font-headline font-bold text-primary mb-8 text-center tracking-[0.1em] uppercase">
          Device Info
        </h4>
        
        <div className="flex-1 space-y-5 text-left overflow-y-auto pr-2 scrollbar-hide">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
              <Shield className="w-3 h-3 text-primary/40" />
              Manufacturer
            </div>
            <p className="text-sm text-white font-medium pl-5">{device.manufacturer}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
              <Cpu className="w-3 h-3 text-primary/40" />
              Hardware Model
            </div>
            <p className="text-sm text-white font-medium pl-5">{device.model}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
              <Terminal className="w-3 h-3 text-primary/40" />
              Firmware Version
            </div>
            <p className="text-sm text-white font-medium pl-5 break-all">{device.firmware}</p>
          </div>

          <div className="pt-4 border-t border-primary/10 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                <User className="w-3 h-3 text-primary/40" />
                Admin Username
              </div>
              <p className="text-sm text-white font-medium pl-5">{device.username || 'admin'}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
                  <Lock className="w-3 h-3 text-primary/40" />
                  Admin Password
                </div>
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-sm text-primary font-code pl-5 tracking-widest">
                {showPassword ? (device.adminPassword || 'N/A') : '••••••••'}
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => {
            setShowInfo(false);
            setShowPassword(false);
          }}
          className="mt-6 bg-primary/5 border border-primary/30 text-primary hover:bg-primary/20 rounded-2xl font-headline shrink-0 h-12 tracking-widest"
        >
          BACK
        </Button>
      </div>

      {/* QR Panel Overlay */}
      <div className={cn(
        "absolute inset-0 bg-[#050816] z-50 p-10 pb-12 flex flex-col transition-all duration-500 rounded-[2.5rem] border-2 border-primary/50",
        showQR ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
      )}>
        <h4 className="text-xl font-headline font-bold text-primary mb-6 text-center tracking-[0.1em] uppercase">
          Scan to Connect
        </h4>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="bg-white p-4 rounded-3xl shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <img 
              src={qrCodeUrl} 
              alt="WiFi QR Code" 
              className="w-40 h-40 rounded-xl"
            />
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm font-headline text-white tracking-wide">{ssid}</p>
            <p className="text-[12px] font-code text-primary font-bold tracking-widest uppercase">
              KEY: {wifiPass}
            </p>
          </div>
        </div>

        <Button 
          onClick={() => setShowQR(false)}
          className="mt-6 bg-primary/5 border border-primary/30 text-primary hover:bg-primary/20 rounded-2xl font-headline shrink-0 h-12 tracking-widest"
        >
          CLOSE QR
        </Button>
      </div>
    </div>
  );
}
