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
    return null; // no IPv6 connectivity — expected and fine
  }
}

async function fetchISP(ip: string): Promise<string | null> {
  try {
    // Note: ip-api.com's free tier is HTTP only — fine here since this
    // request happens server-side, not in the browser.
    const data = await fetchWithTimeout(
      `http://ip-api.com/json/${ip}?fields=status,isp,org,as`,
    );
    if (data.status !== "success") return null;
    return data.isp || data.org || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const forwardedHeader = request.headers.get("x-forwarded-for");
  const rawIp = forwardedHeader ? forwardedHeader.split(",")[0].trim() : "";
  const { ip: trimmedIp, wasV6Mapped } = stripV4MappedPrefix(rawIp);

  let finalIPv4: string | null = null;
  let finalIPv6: string | null = null;

  if (!trimmedIp || isPrivateOrLocalIP(trimmedIp)) {
    // Local dev / private network — look up the real public IP(s)
    const [ipv4, ipv6] = await Promise.all([
      fetchPublicIPv4(),
      fetchPublicIPv6(),
    ]);
    finalIPv4 = ipv4;
    finalIPv6 = ipv6;
  } else if (wasV6Mapped) {
    finalIPv4 = trimmedIp;
  } else if (isRealIPv6(trimmedIp)) {
    finalIPv4 = await fetchPublicIPv4();
    finalIPv6 = trimmedIp;
  } else {
    finalIPv4 = trimmedIp;
  }

  const isp = finalIPv4 ? await fetchISP(finalIPv4) : null;

  return NextResponse.json({
    ip: finalIPv4 ?? "UNAVAILABLE",
    ipv6: finalIPv6,
    isp: isp ?? "UNKNOWN",
  });
}
