export type WirelessSettings = {
  ssid: string;
  password?: string;
  channel: string;
  bandwidth: string;
  transmitPower: "Low" | "Medium" | "High";
};

export type Device = {
  id: string;
  name: string;
  ipAddress: string;
  webGuiUrl?: string;
  manufacturer: string;
  model: string;
  firmware: string;
  mac: string;
  type: "router" | "extender" | "modem";
  username?: string;
  adminPassword?: string;
  wireless24?: WirelessSettings;
  wireless5?: WirelessSettings;
  description?: string;
};

export const INITIAL_DEVICES: Device[] = [
  {
    id: "modem-1",
    name: "Home Gateway",
    ipAddress: "192.168.100.1",
    webGuiUrl: "http://192.168.100.1",
    manufacturer: "China Mobile",
    model: "GS2101-XP",
    firmware: "	V9.0.7",
    mac: "A8:41:22:BA:8D:F0",
    type: "modem",
    description:
      "Main ISP Entry Node converting fiber optic signals into internet connectivity.",
    username: "superadmin",
    adminPassword: "Admin@123",
    wireless24: {
      ssid: "Akanksha Communication",
      password: "Infinity@123",
      channel: "1",
      bandwidth: "20/40 MHz",
      transmitPower: "High",
    },
    wireless5: {
      ssid: "Akanksha Communication",
      password: "Infinity@123",
      channel: "165",
      bandwidth: "20/40/80 MHz",
      transmitPower: "High",
    },
  },
  {
    id: "router-1",
    name: "Router",
    ipAddress: "192.168.10.1",
    webGuiUrl: "http://192.168.10.1",
    manufacturer: "Sercomm",
    model: "JIDU6401 AX6000",
    firmware: "OpenWrt 25.12.5 r33051-f5dae5ece4",
    mac: "9C:D4:A6:E8:65:FA",
    type: "router",
    description:
      "Primary router handling internet, DHCP, and main network traffic.",
    username: "root",
    adminPassword: "Admin@123",
    wireless24: {
      ssid: "SkyNet",
      password: "#0m3!nt3rn3t",
      channel: "11",
      bandwidth: "20 MHz",
      transmitPower: "High",
    },
    wireless5: {
      ssid: "SkyNet",
      password: "#0m3!nt3rn3t",
      channel: "149",
      bandwidth: "80 MHz",
      transmitPower: "High",
    },
  },
  {
    id: "extender-1",
    name: "Extender",
    ipAddress: "192.168.10.2",
    webGuiUrl: "http://192.168.10.2",
    manufacturer: "Sercomm",
    model: "JIDU6401 AX6000",
    firmware: "OpenWrt 25.12.5 r33051-f5dae5ece4",
    mac: "9C:D4:A6:07:CF:8C",
    type: "extender",
    description:
      "Wi-Fi extender expands coverage and improves roaming signal strength.",
    username: "root",
    adminPassword: "Admin@123",
    wireless24: {
      ssid: "SkyNet",
      password: "#0m3!nt3rn3t",
      channel: "6",
      bandwidth: "20 MHz",
      transmitPower: "High",
    },
    wireless5: {
      ssid: "SkyNet",
      password: "#0m3!nt3rn3t",
      channel: "36",
      bandwidth: "80 MHz",
      transmitPower: "High",
    },
  },
];
