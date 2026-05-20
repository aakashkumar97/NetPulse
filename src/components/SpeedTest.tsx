'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Gauge, Download, Play, RefreshCcw, Wifi, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export function SpeedTest() {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const runSpeedTest = async () => {
    if (testing) return;
    
    setTesting(true);
    setProgress(0);
    setDownloadSpeed(null);
    
    const startTime = performance.now();
    const testDuration = 8000; // 8 seconds test
    let bytesDownloaded = 0;
    
    // We'll fetch multiple times to get a steady reading
    // Using high-res images from Picsum as sample data
    const urls = [
      'https://picsum.photos/seed/speed1/3000/3000',
      'https://picsum.photos/seed/speed2/3500/3500',
      'https://picsum.photos/seed/speed3/4000/4000'
    ];

    abortControllerRef.current = new AbortController();

    try {
      const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const p = Math.min((elapsed / testDuration) * 100, 95);
        setProgress(p);
      }, 100);

      for (const url of urls) {
        if (performance.now() - startTime > testDuration) break;

        const response = await fetch(url, { 
          cache: 'no-store',
          signal: abortControllerRef.current.signal 
        });
        
        const reader = response.body?.getReader();
        if (!reader) continue;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          bytesDownloaded += value.length;
          
          const currentTime = performance.now();
          const elapsedSeconds = (currentTime - startTime) / 1000;
          const currentMbps = (bytesDownloaded * 8) / (elapsedSeconds * 1000000);
          
          // Smoothed real-time update
          if (elapsedSeconds > 1) {
            setDownloadSpeed(currentMbps);
          }
          
          if (currentTime - startTime > testDuration) {
            abortControllerRef.current.abort();
            break;
          }
        }
      }

      clearInterval(interval);
      setProgress(100);
      
      const finalTime = performance.now();
      const totalSeconds = (finalTime - startTime) / 1000;
      const finalMbps = (bytesDownloaded * 8) / (totalSeconds * 1000000);
      
      const roundedMbps = Math.round(finalMbps * 10) / 10;
      setDownloadSpeed(roundedMbps);
      setHistory(prev => [roundedMbps, ...prev].slice(0, 5));

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Speed test failed:', error);
      }
    } finally {
      setTesting(false);
      setProgress(100);
    }
  };

  return (
    <div className="glass-card p-8 mb-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Gauge className="w-32 h-32 text-primary" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
        {/* Gauge Visual */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={690}
              strokeDashoffset={690 - (690 * progress) / 100}
              strokeLinecap="round"
              className="text-primary transition-all duration-300 ease-out drop-shadow-[0_0_8px_rgba(0,217,255,0.6)]"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {testing ? (
              <>
                <div className="text-4xl font-headline font-black text-white animate-pulse">
                  {downloadSpeed ? downloadSpeed.toFixed(1) : '...'}
                </div>
                <div className="text-[10px] font-code text-primary tracking-widest mt-1">MBPS</div>
              </>
            ) : downloadSpeed ? (
              <>
                <div className="text-5xl font-headline font-black text-primary neon-text">
                  {downloadSpeed}
                </div>
                <div className="text-[10px] font-code text-primary/60 tracking-widest mt-1 uppercase">Download Mbps</div>
              </>
            ) : (
              <div className="space-y-2">
                <Wifi className="w-10 h-10 text-primary/40 mx-auto" />
                <p className="text-[10px] font-code text-muted-foreground tracking-widest uppercase">Ready to Scan</p>
              </div>
            )}
          </div>
        </div>

        {/* Info & Controls */}
        <div className="flex-1 space-y-6 w-full">
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary" />
              BANDWIDTH ANALYZER
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Measure real-time network throughput and packet delivery performance across the local gateway.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-primary/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-primary/60">
                <Download className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Peak Download</span>
              </div>
              <p className="text-xl font-headline font-bold">
                {downloadSpeed ? `${downloadSpeed} Mbps` : '---'}
              </p>
            </div>
            <div className="p-4 bg-white/5 border border-primary/10 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-primary/60">
                <RefreshCcw className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Test Status</span>
              </div>
              <p className={cn(
                "text-xl font-headline font-bold",
                testing ? "text-primary animate-pulse" : "text-emerald-400"
              )}>
                {testing ? 'ACTIVE' : 'IDLE'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-code text-muted-foreground tracking-widest uppercase">System Progress</span>
              <span className="text-[10px] font-code text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-primary/10" />
            
            <Button 
              onClick={runSpeedTest} 
              disabled={testing}
              className="w-full h-12 rounded-2xl bg-primary text-background font-headline font-bold tracking-widest hover:bg-primary/80 transition-all shadow-[0_0_20px_rgba(0,217,255,0.2)]"
            >
              {testing ? (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                  ANALYZING STREAM...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  INITIATE SPEED TEST
                </>
              )}
            </Button>
          </div>
          
          {history.length > 0 && (
            <div className="pt-4 border-t border-primary/10">
              <p className="text-[10px] font-code text-muted-foreground tracking-widest uppercase mb-3">Recent Protocol History</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {history.map((val, i) => (
                  <div key={i} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary whitespace-nowrap">
                    {val} Mbps
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
