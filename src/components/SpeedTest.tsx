'use client';

import React from 'react';
import { Gauge, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SpeedTest() {
  return (
    <div className="glass-card mb-12 relative overflow-hidden group border-primary/20">
      {/* Background Decorative Icon */}
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Gauge className="w-48 h-48 text-primary" />
      </div>

      <div className="relative z-10 p-1">
        <div className="p-8 pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-headline font-bold flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]" />
                HIGH-PRECISION BANDWIDTH ANALYZER
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Integrated multi-stream diagnostic engine for saturating high-speed fiber connections. 
                Optimized for 300 Mbps+ throughput verification.
              </p>
            </div>
            <Button 
              asChild 
              variant="outline" 
              className="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary rounded-xl h-10 px-4 text-xs font-bold tracking-widest whitespace-nowrap"
            >
              <a href="https://www.speedtest.net/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-3 w-3" />
                OPEN OOKLA SPEEDTEST
              </a>
            </Button>
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
          {/* Overlay to blend the bottom slightly if needed, but the widget is quite clean */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
