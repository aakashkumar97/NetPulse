export type WirelessSettings = {
  ssid: string;
  password?: string;
  channel: string;
  bandwidth: string;
  transmitPower: 'Low' | 'Medium' | 'High';
};

export type Device = {
  id: string;
  name: string;
  ipAddress: string;
  webGuiUrl?: string;
  status: 'ONLINE' | 'OFFLINE';
  manufacturer: string;
  model: string;
  firmware: string;
  mac: string;
  type: 'router' | 'extender' | 'gpon';
  username?: string;
  adminPassword?: string;
  wireless24?: WirelessSettings;
  wireless5?: WirelessSettings;
  description?: string;
};

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'gpon-1',
    name: 'Home Gateway',
    ipAddress: '192.168.100.1',
    webGuiUrl: 'http://192.168.100.1',
    status: 'OFFLINE',
    manufacturer: 'Nokia',
    model: 'G-2425G-A',
    firmware: '3FE49362IJJK17(1.2203.417)',
    mac: '24:0B:88:44:5B:90',
    type: 'gpon',
    description: 'Main ISP Entry Node Converting fiber optic signals into internet connectivity',
    username: 'AdminGPON',
    adminPassword: 'ALC#FGU',
    wireless24: {
      ssid: 'Akanksha Communication',
      password: 'Infinity@123',
      channel: '1',
      bandwidth: '20 MHz',
      transmitPower: 'High',
    }
  },
  {
    id: 'router-1',
    name: 'Router',
    ipAddress: '192.168.7.1',
    webGuiUrl: 'http://192.168.7.1',
    status: 'OFFLINE',
    manufacturer: 'Sercomm',
    model: 'JIDU6401',
    firmware: 'OpenWrt SNAPSHOT r33234+1-d2f0542c51',
    mac: '9C:D4:A6:E8:65:FA',
    type: 'router',
    description: 'Primary router handling internet, DHCP, and main network traffic',
    username: 'root',
    adminPassword: 'Admin@123',
    wireless24: {
      ssid: 'SkyNet',
      password: '#0m3!nt3rn3t',
      channel: '11',
      bandwidth: '20 MHz',
      transmitPower: 'High',
    },
    wireless5: {
      ssid: 'SkyNet',
      password: '#0m3!nt3rn3t',
      channel: '149',
      bandwidth: '80 MHz',
      transmitPower: 'High',
    },
  },
  {
    id: 'extender-1',
    name: 'Extender',
    ipAddress: '192.168.7.2',
    webGuiUrl: 'http://192.168.7.2',
    status: 'OFFLINE',
    manufacturer: 'Sercomm',
    model: 'JIDU6401',
    firmware: 'OpenWrt SNAPSHOT r33234+1-d2f0542c51',
    mac: '9C:D4:A6:07:CF:8C',
    type: 'extender',
    description: 'Wi-Fi extender to expand coverage and improve signal strength',
    username: 'root',
    adminPassword: 'Admin@123',
    wireless24: {
      ssid: 'SkyNet',
      password: '#0m3!nt3rn3t',
      channel: '6',
      bandwidth: '20 MHz',
      transmitPower: 'High',
    },
    wireless5: {
      ssid: 'SkyNet',
      password: '#0m3!nt3rn3t',
      channel: '36',
      bandwidth: '80 MHz',
      transmitPower: 'High',
    },
  },
];