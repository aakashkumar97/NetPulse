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
    name: 'Nokia ONU (Main)',
    ipAddress: '192.168.100.1',
    webGuiUrl: 'http://192.168.100.1',
    status: 'ONLINE',
    manufacturer: 'Nokia',
    model: 'G-2425G-A',
    firmware: 'Stock (ISP Managed)',
    mac: '24:0B:88:44:5B:90',
    type: 'gpon',
    description: 'Main ISP Entry Node • Guest Network & Shop Access',
    username: 'AdminGPON',
    adminPassword: 'ALC#FGU',
  },
  {
    id: 'router-1',
    name: 'OpenWRT Home Router',
    ipAddress: '192.168.7.1',
    webGuiUrl: 'http://192.168.7.1',
    status: 'ONLINE',
    manufacturer: 'Sercomm/Custom',
    model: 'Main Home Router',
    firmware: 'OpenWrt 23.05.x',
    mac: '9C:D4:A6:E8:65:FA',
    type: 'router',
    description: 'Home Core Gateway • Connected to ONU LAN 1',
    username: 'root',
    adminPassword: 'Admin@123',
    wireless24: {
      ssid: 'SkyNet_2.4G',
      password: '...',
      channel: '11',
      bandwidth: '20 MHz',
      transmitPower: 'High',
    },
    wireless5: {
      ssid: 'SkyNet_5G',
      password: '...',
      channel: '149',
      bandwidth: '80 MHz',
      transmitPower: 'High',
    },
  },
  {
    id: 'extender-1',
    name: 'OpenWRT Extender',
    ipAddress: '192.168.7.2',
    webGuiUrl: 'http://192.168.7.2',
    status: 'ONLINE',
    manufacturer: 'Sercomm/Custom',
    model: 'WiFi Extender',
    firmware: 'OpenWrt (AP Mode)',
    mac: '9C:D4:A6:07:CF:8C',
    type: 'extender',
    description: 'Roaming AP • LAN-to-LAN via Main Router',
    username: 'root',
    adminPassword: 'Admin@123',
  },
];
