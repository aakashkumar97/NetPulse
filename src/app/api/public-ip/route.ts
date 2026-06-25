import { NextRequest, NextResponse } from "next/server";

function stripV4MappedPrefix(ip: string): { ip: string; wasV6Mapped: boolean } {
  const match = ip.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
  if (match) return { ip: match[1], wasV6Mapped: true };
  return { ip, wasV6Mapped: false };
}

function isPrivateOrLocalIP(ip: string): boolean {
  if (!ip) return true;
  if (ip === "::1" || ip === "127.0.0.1") return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  if (ip.startsWith("fc") || ip.startsWith("fd")) return true; // IPv6 unique local
  if (ip.startsWith("fe80")) return true; // IPv6 link-local
  return false;
}

function isRealIPv6(ip: string): boolean {
  return ip.includes(":") && !isPrivateOrLocalIP(ip);
}

async function fetchWithTimeout(url: string, ms = 3000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchPublicIPv4(): Promise<string | null> {
  try {
    const data = await fetchWithTimeout("https://api.ipify.org?format=json");
    return data.ip ?? null;
  } catch {
    return null;
  }
}

async function fetchPublicIPv6(): Promise<string | null> {
  try {
    const data = await fetchWithTimeout("https://api6.ipify.org?format=json");
    return data.ip?.includes(":") ? data.ip : null; // only accept if truly IPv6
  } catch {
    return null; // no IPv6 connectivity — this is expected and fine
  }
}

export async function GET(request: NextRequest) {
  const forwardedHeader = request.headers.get("x-forwarded-for");
  const rawIp = forwardedHeader ? forwardedHeader.split(",")[0].trim() : "";
  const { ip: trimmedIp, wasV6Mapped } = stripV4MappedPrefix(rawIp);

  // Case 1: private/loopback (local dev) or no usable header at all
  if (!trimmedIp || isPrivateOrLocalIP(trimmedIp)) {
    const [ipv4, ipv6] = await Promise.all([
      fetchPublicIPv4(),
      fetchPublicIPv6(),
    ]);
    return NextResponse.json({ ip: ipv4 ?? "UNAVAILABLE", ipv6 });
  }

  // Case 2: "::ffff:1.2.3.4" — IPv6 wasn't really used, just show v4
  if (wasV6Mapped) {
    return NextResponse.json({ ip: trimmedIp, ipv6: null });
  }

  // Case 3: genuine public IPv6 — fetch v4 too and show both
  if (isRealIPv6(trimmedIp)) {
    const ipv4 = await fetchPublicIPv4();
    return NextResponse.json({ ip: ipv4 ?? "UNAVAILABLE", ipv6: trimmedIp });
  }

  // Case 4: genuine public IPv4 — just show it
  return NextResponse.json({ ip: trimmedIp, ipv6: null });
}
