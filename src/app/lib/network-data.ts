
export type Device = {
  id: string;
  name: string;
  ipAddress: string;
  status: 'ONLINE' | 'OFFLINE';
  manufacturer: string;
  model: string;
  firmware: string;
  mac: string;
  ssid?: string;
  type: 'router' | 'extender' | 'gpon';
};

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'router-1',
    name: 'Router',
    ipAddress: '192.168.1.1',
    status: 'ONLINE',
    manufacturer: 'Sercomm',
    model: 'JIDU6401',
    firmware: 'OpenWrt SNAPSHOT r33234+1-d2f0542c51',
    mac: 'F4:EC:22:9A:88:B1',
    ssid: 'SkyNet',
    type: 'router',
  },
  {
    id: 'extender-1',
    name: 'Extender',
    ipAddress: '192.168.1.2',
    status: 'ONLINE',
    manufacturer: 'Sercomm',
    model: 'JIDU6401',
    firmware: 'OpenWrt SNAPSHOT r33234+1-d2f0542c51',
    mac: 'A8:42:3F:12:D4:E5',
    ssid: 'SkyNet',
    type: 'extender',
  },
  {
    id: 'gpon-1',
    name: 'GPON',
    ipAddress: '192.168.100.1',
    status: 'ONLINE',
    manufacturer: 'Nokia',
    model: 'G-2425G-A',
    firmware: '3FE49362IJJK17(1.2203.417)',
    mac: '9C:71:0D:33:F4:A2',
    ssid: 'Akanksha Communication',
    type: 'gpon',
  },
];
