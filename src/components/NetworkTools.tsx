'use client';

import React from 'react';
import { ExternalLink, Globe, Shield, Activity, Zap, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NetworkTools() {
  const tools = [
    {
      name: 'PUBLIC IP LOCATOR',
      description: 'Check your current WAN IP address and geolocation.',
      url: 'https://www.whatismyip.com/',
      icon: <Globe className="w-5 h-5 text-primary" />,
      tag: 'IDENTITY'
    },
    {
      name: 'CLOUDFLARE SPEED',
      description: 'Modern, multi-stream bandwidth measurement.',
      url: 'https://speed.cloudflare.com/',
      icon: <Zap className="w-5 h-5 text-accent" />,
      tag: 'PERFORMANCE'
    },
    {
      name: 'DNS LEAK TEST',
      description: 'Verify if your DNS queries are leaking to your ISP.',
      url: 'https://www.dnsleaktest.com/',
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      tag: 'PRIVACY'
    },
    {
      name: 'PING.CAN TEST',
      description: 'Visual latency and jitter analyzer.',
      url: 'https://ping.canbeuseful.com/',
      icon: <Activity className="w-5 h-5 text-rose-400" />,
      tag: 'LATENCY'
    },
    {
      name: 'MAC LOOKUP',
      description: 'Identify hardware manufacturer from MAC address.',
      url: 'https://macvendors.com/',
      icon: <Search className="w-5 h-5 text-secondary" />,
      tag: 'HARDWARE'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <a 
          key={tool.name} 
          href={tool.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="glass-card group p-6 hover:border-primary/40 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              {tool.icon}
            </div>
            <span className="text-[9px] font-code tracking-widest text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
              {tool.tag}
            </span>
          </div>
          
          <h3 className="text-lg font-headline font-bold mb-2 flex items-center gap-2">
            {tool.name}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tool.description}
          </p>
        </a>
      ))}
    </div>
  );
}
