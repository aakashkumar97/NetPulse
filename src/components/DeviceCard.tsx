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
    <div className="glass-card group p-6 flex flex-col items-center text-center transition-all duration-500 relative border-white/5 h-full min-h-[400px]">
      {/* Info Icon Button */}
      <button 
        onClick={() => {
          setShowInfo(!showInfo);
          setShowQR(false);
        }}
        className="absolute top-4 right-4 p-1 z-20 transition-all duration-300 opacity-30 hover:opacity-100 hover:scale-110"
        title="Device Information"
      >
        <Info className="w-5 h-5 text-primary" />
      </button>

      {/* Icon Box */}
      <div className="w-20 h-20 rounded-[1.5rem] bg-primary/5 border border-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-500">
        <div className="drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]">
          {icons[device.type]}
        </div>
      </div>

      <h3 className="text-2xl font-headline font-bold mb-1 tracking-tight text-slate-200">{device.name}</h3>
      
      <div className="flex flex-col items-center gap-1 mb-3">
        <span className="font-code text-[12px] font-bold tracking-[0.2em] uppercase text-primary/70">{device.manufacturer}</span>
        <span className="font-code text-[12px] font-bold tracking-[0.1em] text-muted-foreground">{device.ipAddress}</span>
      </div>
      
      {device.description && (
        <p className="text-[12px] text-muted-foreground font-medium mb-4 font-body leading-relaxed max-w-[220px] line-clamp-2">
          {device.description}
        </p>
      )}

      {/* Status Indicators */}
      <div className="flex items-center gap-2 mb-6 text-[10px] font-bold tracking-widest uppercase">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full animate-pulse",
          device.status === 'ONLINE' ? "bg-emerald-400/80 shadow-[0_0_5px_rgba(52,211,153,0.4)]" : "bg-rose-400/80 shadow-[0_0_5px_rgba(251,113,133,0.4)]"
        )} />
        <span className={device.status === 'ONLINE' ? "text-emerald-400/80" : "text-rose-400/80"}>
          {device.status}
        </span>
      </div>

      {/* Button Container */}
      <div className="mt-auto w-full space-y-2">
        <Button 
          onClick={() => {
            setShowQR(true);
            setShowInfo(false);
          }}
          variant="outline" 
          className="w-full font-headline font-bold tracking-widest bg-white/5 border-white/10 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all duration-500 rounded-xl h-10 text-[10px]"
        >
          <QrCode className="mr-2 h-3.5 w-3.5 text-primary" />
          SHOW WIFI QR
        </Button>

        <Button 
          asChild 
          variant="outline" 
          className="w-full font-headline font-bold tracking-widest bg-primary/5 border-primary/20 hover:bg-primary hover:text-background hover:border-primary transition-all duration-500 rounded-xl h-10 text-[10px]"
        >
          <a href={device.webGuiUrl} target="_blank" rel="noopener noreferrer">
            <Terminal className="mr-2 h-3.5 w-3.5" />
            LAUNCH ADMIN
          </a>
        </Button>
      </div>

      {/* Info Panel Overlay */}
      <div className={cn(
        "absolute inset-0 bg-[#06091a] z-50 p-6 flex flex-col transition-all duration-500 rounded-[2.5rem] border-2 border-primary/30",
        showInfo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
      )}>
        <h4 className="text-lg font-headline font-bold text-primary/90 mb-6 text-center tracking-[0.1em] uppercase">
          Device Info
        </h4>
        
        <div className="flex-1 space-y-4 text-left overflow-y-auto pr-1 scrollbar-hide">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
              <Shield className="w-2.5 h-2.5 text-primary/30" />
              Manufacturer
            </div>
            <p className="text-xs text-slate-300 font-bold pl-4">{device.manufacturer}</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
              <Cpu className="w-2.5 h-2.5 text-primary/30" />
              Hardware Model
            </div>
            <p className="text-xs text-slate-300 font-bold pl-4">{device.model}</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
              <Terminal className="w-2.5 h-2.5 text-primary/30" />
              Firmware
            </div>
            <p className="text-xs text-slate-300 font-medium pl-4 break-all">{device.firmware}</p>
          </div>

          <div className="pt-3 border-t border-primary/5 space-y-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
                <User className="w-2.5 h-2.5 text-primary/30" />
                Username
              </div>
              <p className="text-xs text-slate-300 font-medium pl-4">{device.username || 'admin'}</p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
                  <Lock className="w-2.5 h-2.5 text-primary/30" />
                  Password
                </div>
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:text-primary transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-xs text-slate-300 font-medium pl-4 tracking-widest">
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
          className="mt-4 bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-background rounded-xl font-headline font-bold h-10 text-[10px] tracking-widest transition-all duration-500 shrink-0"
        >
          BACK
        </Button>
      </div>

      {/* QR Panel Overlay */}
      <div className={cn(
        "absolute inset-0 bg-[#06091a] z-50 p-6 flex flex-col transition-all duration-500 rounded-[2.5rem] border-2 border-primary/30",
        showQR ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"
      )}>
        <h4 className="text-lg font-headline font-bold text-primary/90 mb-4 text-center tracking-[0.1em] uppercase">
          Scan to Connect
        </h4>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="bg-white/90 p-3 rounded-2xl">
            <img 
              src={qrCodeUrl} 
              alt="WiFi QR Code" 
              className="w-32 h-32 rounded-lg opacity-90"
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-headline font-bold text-slate-300 tracking-wide">{ssid}</p>
            <p className="text-xs font-headline font-bold text-slate-300 tracking-wide">
              {wifiPass}
            </p>
          </div>
        </div>

        <Button 
          onClick={() => setShowQR(false)}
          className="mt-4 bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-background rounded-xl font-headline font-bold h-10 text-[10px] tracking-widest transition-all duration-500 shrink-0"
        >
          CLOSE QR
        </Button>
      </div>
    </div>
  );
}