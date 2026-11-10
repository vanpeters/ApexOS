export interface PpaRepository {
  id: string;
  name: string;
  ppaIdentifier: string; // e.g. "ppa:lutris-team/lutris" or custom repo URL
  sourceLine: string; // e.g. "deb [arch=amd64 signed-by=...] https://..."
  keyringPath: string;
  gpgKeyUrl?: string;
  description: string;
  category: 'ai' | 'ide' | 'gaming' | 'system' | 'custom';
  enabled: boolean;
  requiredPackages: string[];
  officialUrl?: string;
  maintainer?: string;
}

export interface PackageItem {
  id: string;
  name: string;
  version: string;
  description: string;
  size: string;
  category: 'ai' | 'ide' | 'gaming' | 'system' | 'drivers';
  ppaId: string;
  installed: boolean;
  binaryCmd: string;
  iconName: string;
}

export interface DistroPreset {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  author?: string;
  repositories: PpaRepository[];
  packages: PackageItem[];
  kernelVariant: 'linux-xanmod-gaming' | 'linux-generic-6.11' | 'linux-lowlatency';
  desktopEnvironment: 'gnome-47' | 'kde-plasma-6' | 'xfce-4.18';
  enableZram: boolean;
  enableWineStaging: boolean;
  enableKvmVirtualization: boolean;
  enableGamemode: boolean;
  isDefault?: boolean;
}

export interface DistroConfiguration {
  distroName: string;
  version: string;
  baseUbuntuVersion: '24.04-lts' | '22.04-lts';
  codename: string;
  desktopEnvironment: 'gnome-47' | 'kde-plasma-6' | 'xfce-4.18';
  kernelVariant: 'linux-xanmod-gaming' | 'linux-generic-6.11' | 'linux-lowlatency';
  architecture: 'amd64' | 'arm64';
  hostname: string;
  defaultUsername: string;
  repositories: PpaRepository[];
  packages: PackageItem[];
  enableZram: boolean;
  enableWineStaging: boolean;
  enableKvmVirtualization: boolean;
  enableGamemode: boolean;
  presets: DistroPreset[];
  activePresetId?: string;
}

export type ActiveAppId =
  | 'distro-builder'
  | 'terminal'
  | 'gemini'
  | 'claude'
  | 'chatgpt'
  | 'android-studio'
  | 'lutris'
  | 'package-manager'
  | 'synaptic'
  | 'hardinfo'
  | 'apache2'
  | 'file-manager'
  | 'system-settings'
  | 'thunar'
  | 'steam'
  | 'q4wine'
  | 'mangoapp'
  | 'cmatrix'
  | 'tdfsb'
  | 'system-dashboard'
  | 'display-manager'
  | 'python-compiler';

export interface WindowState {
  id: ActiveAppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}
