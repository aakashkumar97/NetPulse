
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
    ipAddress: '192.168.7.1',
    status: 'ONLINE',
    manufacturer: 'TP-Link',
    model: 'Archer AX55',
    firmware: 'OpenWrt 23.05.2',
    mac: 'F4:EC:22:9A:88:B1',
    ssid: 'Aakash_5G',
    type: 'router',
  },
  {
    id: 'extender-1',
    name: 'Extender',
    ipAddress: '192.168.7.2',
    status: 'ONLINE',
    manufacturer: 'TP-Link',
    model: 'RE700X',
    firmware: 'Stock Firmware v1.2',
    mac: 'A8:42:3F:12:D4:E5',
    ssid: 'Aakash_EXT',
    type: 'extender',
  },
  {
    id: 'gpon-1',
    name: 'GPON',
    ipAddress: '192.168.100.1',
    status: 'ONLINE',
    manufacturer: 'Nokia',
    model: 'G-2425G-A',
    firmware: 'V3.2.1-SR4',
    mac: '9C:71:0D:33:F4:A2',
    ssid: 'Fiber_Home',
    type: 'gpon',
  },
];
