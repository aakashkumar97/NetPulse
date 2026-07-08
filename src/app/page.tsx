"use client";

import React, { useState, useEffect, useRef } from "react";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Clock } from "@/components/Clock";
import { DeviceCard } from "@/components/DeviceCard";
import { INITIAL_DEVICES, Device } from "@/app/lib/network-data";
import { NetworkTools } from "@/components/NetworkTools";
import { Activity, RefreshCw, Globe, Wifi, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [devices] = useState<Device[]>(INITIAL_DEVICES);
  const [lastSync, setLastSync] = useState<string>("");
  const [publicIP, setPublicIP] = useState<string>("LOADING...");
  const [publicIPv6, setPublicIPv6] = useState<string | null>(null);
  const [isp, setIsp] = useState<string>("LOADING...");
  const [internetStatus, setInternetStatus] = useState<
    "CHECKING" | "ONLINE" | "OFFLINE"
  >("CHECKING");
  const [ipLoading, setIpLoading] = useState(true);

  // Theme support
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const initialTheme = systemPrefersDark ? "dark" : "light";
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", systemPrefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Ref to track previous internet status for transition detection
  const prevStatusRef = useRef<"CHECKING" | "ONLINE" | "OFFLINE">("CHECKING");

  // Fetch public IP address and ISP information
  const fetchPublicIP = async () => {
    setIpLoading(true);
    try {
      const response = await fetch("/api/public-ip", { cache: "no-cache" });
      const data = await response.json();
      setPublicIP(data.ip);
      setPublicIPv6(data.ipv6 ?? null);
      setIsp(data.isp ?? "UNKNOWN");
    } catch (error) {
      setPublicIP("UNAVAILABLE");
      setIsp("UNAVAILABLE");
      setPublicIPv6(null);
    } finally {
      setIpLoading(false);
    }
  };

  // Check internet connectivity and update sync timestamp
  useEffect(() => {
    async function checkConnectivity() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await fetch("https://www.google.com/favicon.ico", {
          mode: "no-cors",
          cache: "no-cache",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const shouldFetch =
          prevStatusRef.current === "OFFLINE" ||
          prevStatusRef.current === "CHECKING";
        prevStatusRef.current = "ONLINE";
        setInternetStatus("ONLINE");

        if (shouldFetch) {
          // Fetch IP/ISP on initial load (CHECKING) or when recovering from OFFLINE
          fetchPublicIP();
        }
      } catch {
        prevStatusRef.current = "OFFLINE";
        setInternetStatus("OFFLINE");
        // Immediately clear IP/ISP when going offline
        setPublicIP("UNAVAILABLE");
        setIsp("UNAVAILABLE");
        setPublicIPv6(null);
        setIpLoading(false);
      }

      setLastSync(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    }

    checkConnectivity();
    const interval = setInterval(checkConnectivity, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen relative font-body text-slate-800 dark:text-slate-200 bg-background selection:bg-primary/20">
      <BackgroundEffects />

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tighter text-slate-800 dark:text-slate-200 uppercase">
              NETPULSE <span className="text-[#3c8dbc] font-bold">HOME</span>
            </h1>
            <div className="flex flex-wrap gap-3 items-center font-code text-[10px] tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              <span
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 border rounded-full transition-colors duration-500",
                  internetStatus === "ONLINE"
                    ? "bg-[#00a65a]/10 border-[#00a65a]/30 text-[#00a65a]"
                    : internetStatus === "OFFLINE"
                      ? "bg-[#dd4b39]/10 border-[#dd4b39]/30 text-[#dd4b39]"
                      : "bg-[#f39c12]/10 border-[#f39c12]/30 text-[#f39c12]",
                )}
              >
                <Activity className="w-3 h-3" />
                INTERNET: {internetStatus}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-slate-600 dark:text-slate-400">
                <RefreshCw className="w-3 h-3 text-[#3c8dbc]" />
                LAST SYNC: {lastSync || "CHECKING..."}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ecf5fc] dark:bg-[#1c2c3a] border border-[#d2e2ef] dark:border-[#2b4c63] rounded-full text-[#3c8dbc]">
                <Globe className="w-3 h-3" />
                PUBLIC IP: {publicIP}
                {publicIPv6 && (
                  <span className="ml-1">/ IPv6: {publicIPv6}</span>
                )}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-full text-slate-600 dark:text-slate-400">
                <Wifi className="w-3 h-3 text-[#3c8dbc]" />
                ISP: {isp}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <Clock />
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 bg-card hover:bg-muted text-slate-800 dark:text-slate-200 border border-border rounded transition-all duration-150 text-[10px] font-semibold uppercase tracking-wider mt-2"
              title="Toggle Theme"
            >
              {mounted && theme === "dark" ? (
                <>
                  <Sun className="w-3 h-3 text-amber-500" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </header>

        {/* Network Nodes Grid */}
        <section className="mb-10">
          <div className="border-b border-border pb-2 mb-6">
            <h2 className="text-xl font-headline font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Network Control Nodes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </section>

        {/* Utilities */}
        <section className="mt-12">
          <div className="border-b border-border pb-2 mb-6">
            <h2 className="text-xl font-headline font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Infrastructure Utilities
            </h2>
          </div>
          <NetworkTools />
        </section>

        {/* Footer */}
        <footer className="mt-16 py-6 border-t border-border flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs">
          <p className="font-code tracking-wider">
            &copy; 2026 NETPULSE SYSTEMS • PRIVATE HOME INFRASTRUCTURE
          </p>
          <p className="font-code tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            VERSION: 2.0.3
          </p>
        </footer>
      </div>
    </main>
  );
}
