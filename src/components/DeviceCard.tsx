"use client";

import React, { useState, useRef } from "react";
import { Device } from "@/app/lib/network-data";
import {
  Wifi,
  EthernetPort,
  Terminal,
  Router as RouterIcon,
  Shield,
  Cpu,
  Lock,
  User,
  QrCode,
  Fingerprint,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrOrigin, setQrOrigin] = useState("center center");
  const cardRef = useRef<HTMLDivElement>(null);
  const qrBtnRef = useRef<HTMLButtonElement>(null);

  const handleShowQR = () => {
    if (qrBtnRef.current && cardRef.current) {
      const btnRect = qrBtnRef.current.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      const x = btnRect.left + btnRect.width / 2 - cardRect.left;
      const y = btnRect.top + btnRect.height / 2 - cardRect.top;
      setQrOrigin(`${x}px ${y}px`);
    }
    setShowQR(true);
  };

  const icons = {
    router: <RouterIcon className="w-10 h-10 text-[#3c8dbc]" />,
    extender: <Wifi className="w-10 h-10 text-[#3c8dbc]" />,
    modem: <EthernetPort className="w-10 h-10 text-[#3c8dbc]" />,
  };

  const ssid = device.wireless24?.ssid || device.wireless5?.ssid || "N/A";
  const wifiPass =
    device.wireless24?.password || device.wireless5?.password || "N/A";

  const wifiQrString = `WIFI:S:${ssid};T:WPA;P:${wifiPass};;`;
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(wifiQrString)}&size=300&margin=2&ecLevel=M`;

  return (
    <div
      ref={cardRef}
      className="glass-card group p-6 flex flex-col items-center text-center relative h-full min-h-[400px] overflow-hidden"
    >
      <div className="w-20 h-20 rounded-sm bg-[#ecf5fc] dark:bg-[#1c2c3a] border border-[#d2e2ef] dark:border-[#2b4c63] flex items-center justify-center mb-4">
        <div>{icons[device.type]}</div>
      </div>

      <h3 className="text-2xl font-headline font-bold mb-1 tracking-tight text-slate-800 dark:text-slate-200">
        {device.name}
      </h3>

      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="font-code text-[12px] font-medium tracking-[0.2em] uppercase text-[#3c8dbc]/90">
          {device.manufacturer}
        </span>
        <span className="font-code text-[12px] font-medium tracking-[0.1em] text-slate-500 dark:text-slate-400">
          {device.ipAddress}
        </span>
      </div>

      {device.description && (
        <p className="text-[13px] text-slate-600 dark:text-slate-400 font-medium mb-8 font-body leading-relaxed max-w-[220px] line-clamp-2">
          {device.description}
        </p>
      )}

      <div className="mt-auto w-full space-y-2">
        <button
          onClick={() => {
            setShowInfo(true);
            setShowQR(false);
          }}
          className="w-full flex items-center justify-center font-headline font-medium tracking-widest bg-[#3c8dbc] text-white border border-[#357fa9] hover:bg-[#367fa9] transition-all duration-150 rounded-sm h-9 text-[10px]"
        >
          DEVICE INFO
        </button>

        <a
          href={device.webGuiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center font-headline font-medium tracking-widest bg-[#00a65a] text-white border border-[#008d4c] hover:bg-[#008d4c] transition-all duration-150 rounded-sm h-9 text-[10px]"
        >
          <Terminal className="mr-2 h-3.5 w-3.5" />
          LAUNCH ADMIN
        </a>
      </div>

      {/* Info Slide-over */}
      <div
        className={cn(
          "absolute inset-0 bg-card z-50 p-6 flex flex-col transition-all duration-500 rounded-sm border border-border",
          showInfo
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-full pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-headline font-bold text-[#3c8dbc] tracking-[0.1em] uppercase">
            Device Info
          </h4>
          <button
            onClick={() => setShowInfo(false)}
            className="p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-150"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 text-left overflow-y-auto pr-1 scrollbar-hide">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[8px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">
              <Shield className="w-2.5 h-2.5 text-[#3c8dbc]/40" />
              Manufacturer
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium pl-4">
              {device.manufacturer}
            </p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[8px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">
              <Cpu className="w-2.5 h-2.5 text-[#3c8dbc]/40" />
              Hardware Model
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium pl-4">
              {device.model}
            </p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[8px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">
              <Terminal className="w-2.5 h-2.5 text-[#3c8dbc]/40" />
              Firmware
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium pl-4 break-all">
              {device.firmware}
            </p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[8px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">
              <Fingerprint className="w-2.5 h-2.5 text-[#3c8dbc]/40" />
              MAC Address
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium pl-4 break-all font-code">
              {device.mac}
            </p>
          </div>

          <div className="pt-3 border-t border-border space-y-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-[8px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">
                <User className="w-2.5 h-2.5 text-[#3c8dbc]/40" />
                Username
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium pl-4">
                {device.username || "admin"}
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-[8px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">
                <Lock className="w-2.5 h-2.5 text-[#3c8dbc]/40" />
                Password
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium pl-4 tracking-widest">
                {device.adminPassword || "N/A"}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border space-y-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-[8px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">
                <Wifi className="w-2.5 h-2.5 text-[#3c8dbc]/40" />
                Wi-Fi SSID
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium pl-4">
                {ssid}
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[8px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">
                  <Lock className="w-2.5 h-2.5 text-[#3c8dbc]/40" />
                  Wi-Fi Password
                </div>
                <button
                  ref={qrBtnRef}
                  onClick={handleShowQR}
                  className="p-1 hover:text-[#3c8dbc] transition-colors duration-150"
                  title="Show WiFi QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 hover:text-[#3c8dbc] transition-colors duration-150" />
                </button>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium pl-4 tracking-widest">
                {wifiPass}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Zoom-in overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-card z-50 p-6 flex flex-col rounded-sm border border-border",
          "transition-[transform,opacity] duration-500",
          showQR
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-0 pointer-events-none",
        )}
        style={{
          transformOrigin: qrOrigin,
          transitionTimingFunction: showQR
            ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "cubic-bezier(0.4, 0, 1, 1)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-headline font-bold text-[#3c8dbc] tracking-[0.1em] uppercase">
            Scan to Connect
          </h4>
          <button
            onClick={() => setShowQR(false)}
            className="p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-150"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className={cn(
              "bg-white p-3 border border-border rounded-sm transition-[transform,opacity] duration-500",
              showQR ? "opacity-100 scale-100" : "opacity-0 scale-50",
            )}
            style={{
              transitionDelay: showQR ? "80ms" : "0ms",
              transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <img
              src={qrCodeUrl}
              alt="WiFi QR Code"
              className="w-40 h-40 rounded-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
