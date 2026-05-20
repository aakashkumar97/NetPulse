'use client';

import React from 'react';
import { Gauge, Zap, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SpeedTest() {
  return (
    <div className="glass-card mb-12 relative overflow-hidden group border-primary/20">
      {/* Background Decorative Icon */}
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
        <Gauge className="w-48 h-48 text-primary" />
      </div>

      <div className="relative z-10 p-1">
        <div className="p-8 pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-headline font-bold flex items-center gap-3 uppercase tracking-tight">
                <Zap className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                High-Precision Bandwidth Analyzer
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Integrated diagnostic engine for saturating high-speed fiber connections. 
                Optimized for <span className="text-primary font-bold">300 Mbps+</span> throughput verification.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-code text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/10 w-fit px-3 py-1 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                SECURE MULTI-STREAM MEASUREMENT ACTIVE
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                asChild 
                variant="outline" 
                className="bg-primary/10 border-primary/30 hover:bg-primary hover:text-background hover:border-primary rounded-2xl h-12 px-6 text-[11px] font-headline font-bold tracking-widest transition-all duration-500 shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
              >
                <a href="https://www.speedtest.net/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  LAUNCH OOKLA CERTIFIED
                </a>
              </Button>
              <p className="text-[9px] text-center text-muted-foreground font-code opacity-60">
                *Ookla requires external verification
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Speedometer Frame */}
        <div className="w-full aspect-video md:aspect-[21/9] min-h-[500px] bg-black/40 rounded-b-[2.4rem] overflow-hidden border-t border-primary/10 relative">
          <iframe 
            src="https://openspeedtest.com/speedtest" 
            className="w-full h-full border-none scale-[1.01]"
            title="Precision Speedometer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}