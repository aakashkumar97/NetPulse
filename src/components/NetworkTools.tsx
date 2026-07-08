"use client";

import React from "react";
import {
  ExternalLink,
  Shield,
  Activity,
  Search,
  MapPin,
  Gauge,
} from "lucide-react";

export function NetworkTools() {
  const tools = [
    {
      name: "IP LOCATOR",
      description: "Check your current WAN IP address and geolocation.",
      url: "https://www.whatismyip.com/",
      icon: <MapPin className="w-5 h-5 text-[#3c8dbc]" />,
      tag: "IDENTITY",
    },
    {
      name: "SPEED TEST",
      description: "Modern, multi-stream bandwidth measurement.",
      url: "https://www.speedtest.net/",
      icon: <Gauge className="w-5 h-5 text-[#3c8dbc]" />,
      tag: "PERFORMANCE",
    },
    {
      name: "DNS LEAK TEST",
      description: "Verify if your DNS queries are leaking to your ISP.",
      url: "https://www.dnsleaktest.com/",
      icon: <Shield className="w-5 h-5 text-[#00a65a]" />,
      tag: "PRIVACY",
    },
    {
      name: "PING TEST",
      description: "Visual latency and jitter analyzer.",
      url: "https://ping.canbeuseful.com/",
      icon: <Activity className="w-5 h-5 text-[#dd4b39]" />,
      tag: "LATENCY",
    },
    {
      name: "MAC LOOKUP",
      description: "Identify hardware manufacturer from MAC address.",
      url: "https://macvendors.com/",
      icon: <Search className="w-5 h-5 text-[#3c8dbc]" />,
      tag: "HARDWARE",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <a
          key={tool.name}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card group p-6 hover:border-[#3c8dbc]/60 transition-all duration-150"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-sm bg-[#ecf5fc] dark:bg-[#1c2c3a] border border-[#d2e2ef] dark:border-[#2b4c63] flex items-center justify-center group-hover:bg-[#dbebf7] group-hover:dark:bg-[#233b4e] transition-colors">
              {tool.icon}
            </div>
            <span className="text-[9px] font-code tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-sm border border-[#e5e5e5] dark:border-[#3b3f46]">
              {tool.tag}
            </span>
          </div>

          <h3 className="text-lg font-headline font-bold mb-2 flex items-center gap-2 text-slate-800 dark:text-slate-200">
            {tool.name}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {tool.description}
          </p>
        </a>
      ))}
    </div>
  );
}
