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
};

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'gpon-1',
    name: 'Nokia ONT',
    ipAddress: '192.178.100.1',
    webGuiUrl: 'http://gpon.net',
    status: 'ONLINE',
    manufacturer: 'Nokia',
    model: 'G-2425G-A',
    firmware: '3FE49362IJJK17(1.2203.417)',
    mac: '24:0B:88:44:5B:90',
    type: 'gpon',
    username: 'AdminGPON',
    adminPassword: 'ALC#FGU',
    wireless24: {
      ssid: 'Akanksha Communication',
      password: 'Infinity@123',
      channel: '1',
      bandwidth: '20 MHz',
      transmitPower: 'Low',
    },
  },
  {
    id: 'router-1',
    name: 'Router',
    ipAddress: '192.178.7.1',
    webGuiUrl: 'http://router.net',
    status: 'ONLINE',
    manufacturer: 'Sercomm',
    model: 'JIDU6401',
    firmware: 'OpenWrt SNAPSHOT r33234+1-d2f0542c51',
    mac: '9C:D4:A6:E8:65:FA',
    type: 'router',
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
    name: 'Extndr',
    ipAddress: '192.178.7.2',
    webGuiUrl: 'http://extndr.net',
    status: 'ONLINE',
    manufacturer: 'Sercomm',
    model: 'JIDU6401',
    firmware: 'OpenWrt SNAPSHOT r33234+1-d2f0542c51',
    mac: '9C:D4:A6:07:CF:8C',
    type: 'extender',
    username: 'root',
    adminPassword: 'Admin@123',
    wireless24: {
      ssid: 'SkyNet',
      password: '#0m3!nt3rn3t',
      channel: '6',
      bandwidth: '20 MHz',
      transmitPower: 'Medium',
    },
    wireless5: {
      ssid: 'SkyNet',
      password: '#0m3!nt3rn3t',
      channel: '44',
      bandwidth: '80 MHz',
      transmitPower: 'Medium',
    },
  },
];
