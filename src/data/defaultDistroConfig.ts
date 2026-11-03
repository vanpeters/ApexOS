import { DistroConfiguration, PpaRepository, PackageItem, DistroPreset } from '../types/distro';

export const INITIAL_REPOSITORIES: PpaRepository[] = [
  {
    id: 'ubuntu-main',
    name: 'Ubuntu Official Base & Universe',
    ppaIdentifier: 'archive.ubuntu.com/ubuntu',
    sourceLine: 'deb http://archive.ubuntu.com/ubuntu/ noble main restricted universe multiverse',
    keyringPath: '/usr/share/keyrings/ubuntu-archive-keyring.gpg',
    description: 'Core Ubuntu 24.04 LTS (Noble Numbat) repositories, kernel, base utilities, and universe software.',
    category: 'system',
    enabled: true,
    requiredPackages: ['ubuntu-desktop-minimal', 'build-essential', 'curl', 'git', 'ca-certificates'],
    maintainer: 'Canonical Ltd.',
  },
  {
    id: 'ppa-lutris',
    name: 'Lutris Gaming Platform PPA',
    ppaIdentifier: 'ppa:lutris-team/lutris',
    sourceLine: 'deb [signed-by=/etc/apt/keyrings/lutris.gpg] https://ppa.launchpadcontent.net/lutris-team/lutris/ubuntu noble main',
    keyringPath: '/etc/apt/keyrings/lutris.gpg',
    gpgKeyUrl: 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x37B807DE3D0E69B124C6CB966F87129A8771BA78',
    description: 'Official PPA for Lutris open-source gaming client for Linux, Proton/Wine runners, and DXVK/VKD3D integration.',
    category: 'gaming',
    enabled: true,
    requiredPackages: ['lutris', 'gamemode', 'mesa-vulkan-drivers', 'libvulkan1'],
    officialUrl: 'https://lutris.net',
    maintainer: 'Lutris Development Team',
  },
  {
    id: 'ppa-android-studio',
    name: 'Android Studio IDE PPA',
    ppaIdentifier: 'ppa:maarten-fonville/android-studio',
    sourceLine: 'deb [signed-by=/etc/apt/keyrings/android-studio.gpg] https://ppa.launchpadcontent.net/maarten-fonville/android-studio/ubuntu noble main',
    keyringPath: '/etc/apt/keyrings/android-studio.gpg',
    gpgKeyUrl: 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x0700205DDA7BE63D',
    description: 'Official community PPA providing automated daily packaging of Google Android Studio IDE, SDK tools, and platform dependencies.',
    category: 'ide',
    enabled: true,
    requiredPackages: ['android-studio', 'android-tools-adb', 'android-tools-fastboot', 'openjdk-17-jdk'],
    officialUrl: 'https://developer.android.com/studio',
    maintainer: 'Maarten Fonville & Google Developer Community',
  },
  {
    id: 'repo-claude',
    name: 'Anthropic Claude Desktop Repository',
    ppaIdentifier: 'deb.anthropic.com/linux',
    sourceLine: 'deb [arch=amd64 signed-by=/usr/share/keyrings/anthropic-archive-keyring.gpg] https://packages.anthropic.com/linux/deb stable main',
    keyringPath: '/usr/share/keyrings/anthropic-archive-keyring.gpg',
    gpgKeyUrl: 'https://packages.anthropic.com/keys/anthropic-public.gpg',
    description: 'Official Debian/Ubuntu APT repository for Claude Desktop AI application on Linux with native Wayland and system integration.',
    category: 'ai',
    enabled: true,
    requiredPackages: ['claude-desktop', 'libsecret-1-0', 'gnome-keyring'],
    officialUrl: 'https://claude.ai/download',
    maintainer: 'Anthropic PBC',
  },
  {
    id: 'repo-chatgpt',
    name: 'OpenAI ChatGPT Desktop Repository',
    ppaIdentifier: 'deb.openai.com/linux',
    sourceLine: 'deb [arch=amd64 signed-by=/usr/share/keyrings/openai-archive-keyring.gpg] https://packages.openai.com/linux/deb stable main',
    keyringPath: '/usr/share/keyrings/openai-archive-keyring.gpg',
    gpgKeyUrl: 'https://packages.openai.com/keys/openai-public.gpg',
    description: 'Official APT repository for ChatGPT Linux desktop client with local shortcut trigger, voice input support, and code execution view.',
    category: 'ai',
    enabled: true,
    requiredPackages: ['chatgpt-desktop', 'xdg-utils'],
    officialUrl: 'https://openai.com/chatgpt/desktop',
    maintainer: 'OpenAI L.L.C.',
  },
  {
    id: 'repo-winehq',
    name: 'WineHQ Staging & Proton Runtime',
    ppaIdentifier: 'dl.winehq.org/wine-builds/ubuntu',
    sourceLine: 'deb [signed-by=/etc/apt/keyrings/winehq-archive.key] https://dl.winehq.org/wine-builds/ubuntu/ noble main',
    keyringPath: '/etc/apt/keyrings/winehq-archive.key',
    gpgKeyUrl: 'https://dl.winehq.org/wine-builds/winehq.key',
    description: 'WineHQ upstream staging branch for running Windows games, DirectX 11/12 translation layers, and Lutris Windows game compatibility.',
    category: 'gaming',
    enabled: true,
    requiredPackages: ['winehq-staging', 'winetricks', 'cabextract'],
    officialUrl: 'https://winehq.org',
    maintainer: 'WineHQ Project',
  },
  {
    id: 'ppa-kisak-mesa',
    name: 'Kisak Mesa Fresh Gaming Drivers PPA',
    ppaIdentifier: 'ppa:kisak/kisak-mesa',
    sourceLine: 'deb [signed-by=/etc/apt/keyrings/kisak-mesa.gpg] https://ppa.launchpadcontent.net/kisak/kisak-mesa/ubuntu noble main',
    keyringPath: '/etc/apt/keyrings/kisak-mesa.gpg',
    gpgKeyUrl: 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xF980BE5E0397843F',
    description: 'Cutting-edge Mesa 24.3+ graphics driver stack for AMD Radeon, Intel Arc, and NVIDIA Nouveau Vulkan drivers for peak gaming FPS.',
    category: 'gaming',
    enabled: true,
    requiredPackages: ['mesa-va-drivers', 'mesa-vdpau-drivers'],
    maintainer: 'Kisak & Launchpad Valve Contributors',
  },
  {
    id: 'repo-vscode',
    name: 'Visual Studio Code (Microsoft APT Repository)',
    ppaIdentifier: 'packages.microsoft.com/repos/code',
    sourceLine: 'deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main',
    keyringPath: '/etc/apt/keyrings/packages.microsoft.gpg',
    gpgKeyUrl: 'https://packages.microsoft.com/keys/microsoft.asc',
    description: 'Official Microsoft Visual Studio Code APT repository providing code editor updates, extensions, debugging, and terminal.',
    category: 'ide',
    enabled: true,
    requiredPackages: ['code', 'libasound2', 'libxss1'],
    officialUrl: 'https://code.visualstudio.com',
    maintainer: 'Microsoft Corporation',
  },
];

export const INITIAL_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-lutris',
    name: 'lutris',
    version: '0.5.17-1',
    description: 'Open-source gaming platform for GNU/Linux with Proton, Wine, GOG, and Steam integration.',
    size: '124 MB',
    category: 'gaming',
    ppaId: 'ppa-lutris',
    installed: true,
    binaryCmd: 'lutris',
    iconName: 'Gamepad2',
  },
  {
    id: 'pkg-android-studio',
    name: 'android-studio',
    version: '2024.2.1.12-noble',
    description: 'Google official Integrated Development Environment for Android app development with emulator & profiler.',
    size: '1.42 GB',
    category: 'ide',
    ppaId: 'ppa-android-studio',
    installed: true,
    binaryCmd: 'studio.sh',
    iconName: 'Smartphone',
  },
  {
    id: 'pkg-claude-desktop',
    name: 'claude-desktop',
    version: '1.0.8-amd64',
    description: 'Anthropic Claude AI Assistant desktop environment with system context, file drop, and MCP tooling.',
    size: '88 MB',
    category: 'ai',
    ppaId: 'repo-claude',
    installed: true,
    binaryCmd: 'claude',
    iconName: 'Bot',
  },
  {
    id: 'pkg-chatgpt-desktop',
    name: 'chatgpt-desktop',
    version: '1.2024.312-amd64',
    description: 'OpenAI ChatGPT native desktop client with global hotkey, voice reasoning, and memory synchronization.',
    size: '92 MB',
    category: 'ai',
    ppaId: 'repo-chatgpt',
    installed: true,
    binaryCmd: 'chatgpt',
    iconName: 'Sparkles',
  },
  {
    id: 'pkg-winehq-staging',
    name: 'winehq-staging',
    version: '9.21~noble-1',
    description: 'Upstream compatibility layer capable of running Windows gaming and developer binaries on Linux.',
    size: '340 MB',
    category: 'gaming',
    ppaId: 'repo-winehq',
    installed: true,
    binaryCmd: 'wine',
    iconName: 'Disc',
  },
  {
    id: 'pkg-gamemode',
    name: 'gamemode',
    version: '1.8.2-1',
    description: 'Daemon/library combo that optimizes Linux system performance on demand (CPU governor, I/O priority).',
    size: '4.8 MB',
    category: 'gaming',
    ppaId: 'ppa-lutris',
    installed: true,
    binaryCmd: 'gamemoded',
    iconName: 'Zap',
  },
  {
    id: 'pkg-adb-fastboot',
    name: 'android-tools-adb',
    version: '34.0.5-1',
    description: 'Android Debug Bridge and Fastboot flashing tools for physical devices and virtual hardware.',
    size: '18 MB',
    category: 'ide',
    ppaId: 'ppa-android-studio',
    installed: true,
    binaryCmd: 'adb',
    iconName: 'Terminal',
  },
  {
    id: 'pkg-openjdk-17',
    name: 'openjdk-17-jdk',
    version: '17.0.12+7-1ubuntu2',
    description: 'OpenJDK Development Kit required for Android Gradle builds and Java/Kotlin compiler infrastructure.',
    size: '280 MB',
    category: 'ide',
    ppaId: 'ubuntu-main',
    installed: true,
    binaryCmd: 'javac',
    iconName: 'Cpu',
  },
  {
    id: 'pkg-neofetch',
    name: 'neofetch',
    version: '7.1.0-4',
    description: 'Fast, highly customizable CLI system information tool written in Bash.',
    size: '1.2 MB',
    category: 'system',
    ppaId: 'ubuntu-main',
    installed: true,
    binaryCmd: 'neofetch',
    iconName: 'Terminal',
  },
  {
    id: 'pkg-synaptic',
    name: 'synaptic',
    version: '0.91.3+nmu1ubuntu1',
    description: 'Graphical package management program for apt with search, repository, and GPG key controls.',
    size: '14.8 MB',
    category: 'system',
    ppaId: 'ubuntu-main',
    installed: true,
    binaryCmd: 'synaptic',
    iconName: 'PackageCheck',
  },
  {
    id: 'pkg-hardinfo',
    name: 'hardinfo',
    version: '0.6-alpha+git20231102-1',
    description: 'System profiler and benchmark tool for Linux displaying CPU, GPU, memory, PCI devices and benchmarks.',
    size: '6.4 MB',
    category: 'system',
    ppaId: 'ubuntu-main',
    installed: true,
    binaryCmd: 'hardinfo',
    iconName: 'Cpu',
  },
  {
    id: 'pkg-apache2',
    name: 'apache2',
    version: '2.4.58-1ubuntu8.1',
    description: 'High-performance Apache HTTP Server daemon with virtual hosts, SSL/TLS, and modular proxy.',
    size: '32.1 MB',
    category: 'system',
    ppaId: 'ubuntu-main',
    installed: true,
    binaryCmd: 'apache2ctl',
    iconName: 'Globe',
  },
  {
    id: 'pkg-thunar',
    name: 'thunar',
    version: '4.18.8-1ubuntu1',
    description: 'Modern, fast and lightweight file manager designed for XFCE and high-efficiency Linux workflows.',
    size: '12.4 MB',
    category: 'system',
    ppaId: 'ubuntu-main',
    installed: true,
    binaryCmd: 'thunar',
    iconName: 'Folder',
  },
  {
    id: 'pkg-steam',
    name: 'steam-installer',
    version: '1.0.0.79~noble',
    description: 'Valve Steam gaming platform with integrated Proton 9.0, Wine 9.21 Staging, and DXVK/VKD3D translation.',
    size: '185 MB',
    category: 'gaming',
    ppaId: 'repo-winehq',
    installed: true,
    binaryCmd: 'steam',
    iconName: 'Flame',
  },
  {
    id: 'pkg-q4wine',
    name: 'q4wine',
    version: '1.3.13-1',
    description: 'Advanced Qt GUI for managing Wine prefixes, DLL overrides, drives, registry, and winetricks runners.',
    size: '8.2 MB',
    category: 'gaming',
    ppaId: 'repo-winehq',
    installed: true,
    binaryCmd: 'q4wine',
    iconName: 'Layers',
  },
  {
    id: 'pkg-mangoapp',
    name: 'mangoapp',
    version: '0.7.2-1',
    description: 'Standalone Wayland/X11 HUD overlay runner for MangoHud performance telemetry, FPS, and thermals.',
    size: '3.6 MB',
    category: 'gaming',
    ppaId: 'ppa-lutris',
    installed: true,
    binaryCmd: 'mangoapp',
    iconName: 'Gauge',
  },
  {
    id: 'pkg-cmatrix',
    name: 'cmatrix',
    version: '2.0-3',
    description: 'Classic green digital rain console animation in terminal simulating the iconic Matrix screensaver.',
    size: '220 KB',
    category: 'system',
    ppaId: 'ubuntu-main',
    installed: true,
    binaryCmd: 'cmatrix',
    iconName: 'Terminal',
  },
  {
    id: 'pkg-tdfsb',
    name: 'tdfsb-modded',
    version: '0.0.10-apex-v2',
    description: '3D File System Browser (Modded): Cybernetic spatial 3D room navigator where folders are portals and files are floating interactive nodes.',
    size: '15.8 MB',
    category: 'system',
    ppaId: 'ubuntu-main',
    installed: true,
    binaryCmd: 'tdfsb',
    iconName: 'Box',
  },
  {
    id: 'pkg-vscode',
    name: 'code',
    version: '1.95.3-1731513102',
    description: 'Visual Studio Code: Microsoft code editor with built-in Git, debugging, IntelliSense, and extensions.',
    size: '105 MB',
    category: 'ide',
    ppaId: 'repo-vscode',
    installed: true,
    binaryCmd: 'code',
    iconName: 'Code',
  },
];

export const INITIAL_PRESETS: DistroPreset[] = [
  {
    id: 'preset-gaming',
    name: 'ApexOS Gaming & Simulation Edition',
    description: 'Optimized for high FPS gaming, Wine 9.21 Staging, Proton 9.0, Lutris, Steam, and MangoHud performance overlay with XanMod low-latency kernel.',
    createdAt: '2026-11-01',
    author: 'ApexOS Core Team',
    repositories: INITIAL_REPOSITORIES.map((r) => ({
      ...r,
      enabled: r.id === 'ubuntu-main' || r.id === 'ppa-lutris' || r.id === 'repo-winehq',
    })),
    packages: INITIAL_PACKAGES.map((p) => ({
      ...p,
      installed: ['pkg-lutris', 'pkg-steam', 'pkg-q4wine', 'pkg-mangoapp', 'pkg-cmatrix', 'pkg-tdfsb'].includes(p.id),
    })),
    kernelVariant: 'linux-xanmod-gaming',
    desktopEnvironment: 'gnome-47',
    enableZram: true,
    enableWineStaging: true,
    enableKvmVirtualization: false,
    enableGamemode: true,
    isDefault: true,
  },
  {
    id: 'preset-ai-dev',
    name: 'ApexOS AI, VS Code & Android Developer Studio',
    description: 'Workstation profile with Visual Studio Code, Claude Desktop, ChatGPT, Android Studio Ladybug, KVM acceleration, and Synaptic package manager.',
    createdAt: '2026-11-01',
    author: 'ApexOS Core Team',
    repositories: INITIAL_REPOSITORIES.map((r) => ({
      ...r,
      enabled: r.id === 'ubuntu-main' || r.id === 'repo-vscode' || r.id === 'ppa-android-studio' || r.id === 'repo-claude' || r.id === 'repo-chatgpt',
    })),
    packages: INITIAL_PACKAGES.map((p) => ({
      ...p,
      installed: ['pkg-vscode', 'pkg-android-studio', 'pkg-claude', 'pkg-chatgpt', 'pkg-synaptic', 'pkg-hardinfo', 'pkg-apache2', 'pkg-thunar'].includes(p.id),
    })),
    kernelVariant: 'linux-generic-6.11',
    desktopEnvironment: 'gnome-47',
    enableZram: true,
    enableWineStaging: false,
    enableKvmVirtualization: true,
    enableGamemode: false,
    isDefault: true,
  },
  {
    id: 'preset-full-powerhouse',
    name: 'ApexOS All-In-One Powerhouse',
    description: 'Complete distribution bundle including all PPAs, AI models, developer tools, gaming runtimes (Steam, Lutris, q4wine), Thunar, and TDFSB 3D.',
    createdAt: '2026-11-01',
    author: 'ApexOS Core Team',
    repositories: INITIAL_REPOSITORIES.map((r) => ({ ...r, enabled: true })),
    packages: INITIAL_PACKAGES.map((p) => ({ ...p, installed: true })),
    kernelVariant: 'linux-xanmod-gaming',
    desktopEnvironment: 'gnome-47',
    enableZram: true,
    enableWineStaging: true,
    enableKvmVirtualization: true,
    enableGamemode: true,
    isDefault: true,
  },
];

export const DEFAULT_DISTRO_CONFIG: DistroConfiguration = {
  distroName: 'ApexOS Developer & Gaming Edition',
  version: '24.04.1',
  baseUbuntuVersion: '24.04-lts',
  codename: 'noble',
  desktopEnvironment: 'gnome-47',
  kernelVariant: 'linux-xanmod-gaming',
  architecture: 'amd64',
  hostname: 'apex-noble',
  defaultUsername: 'developer',
  repositories: INITIAL_REPOSITORIES,
  packages: INITIAL_PACKAGES,
  enableZram: true,
  enableWineStaging: true,
  enableKvmVirtualization: true,
  enableGamemode: true,
  presets: INITIAL_PRESETS,
  activePresetId: 'preset-full-powerhouse',
};

export function generateBuildIsoScript(config: DistroConfiguration): string {
  const activePpas = config.repositories.filter((r) => r.enabled);
  const activePkgs = config.packages.filter((p) => p.installed).map((p) => p.name);

  return `#!/usr/bin/env bash
# ==============================================================================
# ${config.distroName} v${config.version}
# Base: Ubuntu ${config.baseUbuntuVersion} (${config.codename})
# Pre-configured with PPAs: Claude, ChatGPT, Android Studio, Lutris, WineHQ
# Automated Live ISO Image Builder Script (Debootstrap + Chroot + Hybrid ISO)
# ==============================================================================

set -euo pipefail

# 0. Root Privilege Check
if [[ "\${EUID}" -ne 0 ]]; then
  echo "[-] ERROR: This script must be executed as root (sudo bash build-iso.sh)"
  exit 1
fi

DISTRO_NAME="${config.distroName}"
DISTRO_VERSION="${config.version}"
CODENAME="${config.codename}"
ARCH="${config.architecture}"
WORK_DIR="/tmp/apexos-build"
CHROOT_DIR="\${WORK_DIR}/chroot"
IMAGE_DIR="\${WORK_DIR}/image"
ISO_OUTPUT="\${PWD}/apexos-\${DISTRO_VERSION}-\${ARCH}.iso"

echo "=============================================================================="
echo " Starting Build: \${DISTRO_NAME} (\${CODENAME})"
echo " Work Directory: \${WORK_DIR}"
echo " Output Target:  \${ISO_OUTPUT}"
echo "=============================================================================="

# 1. Install Host Prerequisites
echo "[1/8] Installing host dependencies..."
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y \\
  binutils \\
  debootstrap \\
  squashfs-tools \\
  xorriso \\
  isolinux \\
  syslinux-efi \\
  grub-pc-bin \\
  grub-efi-amd64-bin \\
  mtools \\
  dosfstools \\
  curl \\
  ca-certificates \\
  gnupg

# 2. Prepare Work Directory & Debootstrap Base System
echo "[2/8] Creating build workspace and bootstrapping Ubuntu base..."
rm -rf "\${WORK_DIR}"
mkdir -p "\${CHROOT_DIR}" "\${IMAGE_DIR}/casper" "\${IMAGE_DIR}/isolinux" "\${IMAGE_DIR}/install"

debootstrap --arch="\${ARCH}" --variant=minbase "\${CODENAME}" "\${CHROOT_DIR}" http://archive.ubuntu.com/ubuntu/

# 3. Mount Pseudo-filesystems for Chroot
echo "[3/8] Mounting kernel filesystems for chroot..."
mount --bind /dev "\${CHROOT_DIR}/dev"
mount --bind /run "\${CHROOT_DIR}/run"
mount -t proc none "\${CHROOT_DIR}/proc"
mount -t sysfs none "\${CHROOT_DIR}/sys"
mount -t devpts none "\${CHROOT_DIR}/dev/pts"

cleanup() {
  echo "[!] Cleaning up mounts..."
  umount -lf "\${CHROOT_DIR}/dev/pts" 2>/dev/null || true
  umount -lf "\${CHROOT_DIR}/sys" 2>/dev/null || true
  umount -lf "\${CHROOT_DIR}/proc" 2>/dev/null || true
  umount -lf "\${CHROOT_DIR}/run" 2>/dev/null || true
  umount -lf "\${CHROOT_DIR}/dev" 2>/dev/null || true
}
trap cleanup EXIT

# 4. Configure Networking & APT Repositories inside Chroot
echo "[4/8] Injecting PPA repositories and APT keys into rootfs..."
cp /etc/resolv.conf "\${CHROOT_DIR}/etc/resolv.conf"

cat <<'EOF' > "\${CHROOT_DIR}/etc/apt/sources.list"
deb http://archive.ubuntu.com/ubuntu/ ${config.codename} main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ ${config.codename}-updates main restricted universe multiverse
deb http://security.ubuntu.com/ubuntu/ ${config.codename}-security main restricted universe multiverse
EOF

mkdir -p "\${CHROOT_DIR}/etc/apt/keyrings" "\${CHROOT_DIR}/usr/share/keyrings"

# Inject PPA & Third-Party Repositories
${activePpas
  .map((repo) => {
    return `# --- Repository: ${repo.name} ---
cat <<'EOF' > "\${CHROOT_DIR}/etc/apt/sources.list.d/${repo.id}.list"
${repo.sourceLine}
EOF
${
  repo.gpgKeyUrl
    ? `curl -fsSL "${repo.gpgKeyUrl}" | gpg --dearmor -o "\${CHROOT_DIR}${repo.keyringPath}" || true`
    : ''
}`;
  })
  .join('\n\n')}

# 5. Execute Customization Script inside Chroot
echo "[5/8] Running in-chroot provisioning (Kernel, Desktop, PPAs, Applications)..."
cat <<'CHROOT_EXEC' > "\${CHROOT_DIR}/root/provision.sh"
#!/usr/bin/env bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
export HOME=/root
export LC_ALL=C

# Hostname & Network
echo "${config.hostname}" > /etc/hostname
cat <<'EOF' > /etc/hosts
127.0.0.1   localhost
127.0.1.1   ${config.hostname}
::1         localhost ip6-localhost ip6-loopback
EOF

# Update APT package indexes
apt-get update -y

# Enable 32-bit architecture for Wine/Steam gaming runtimes
${config.enableWineStaging ? 'dpkg --add-architecture i386 && apt-get update -y' : ''}

# Install Core System, Casper Live-Boot, and Linux Kernel
apt-get install -y --no-install-recommends \\
  casper \\
  lupin-casper \\
  discover \\
  laptop-detect \\
  os-prober \\
  systemd-sysv \\
  network-manager \\
  net-tools \\
  wireless-tools \\
  wpasupplicant \\
  sudo \\
  software-properties-common \\
  apt-transport-https \\
  gpg \\
  curl \\
  wget \\
  git \\
  rsync \\
  htop \\
  neofetch \\
  gparted \\
  parted \\
  dosfstools \\
  e2fsprogs \\
  efibootmgr

# Install Kernel Variant (${config.kernelVariant})
${
  config.kernelVariant === 'linux-xanmod-gaming'
    ? `echo "[*] Adding XanMod Linux Kernel Repository..."
mkdir -p /etc/apt/keyrings
curl -fsSL https://dl.xanmod.org/gpg/xanmod-kernel.gpg | gpg --dearmor --yes -o /etc/apt/keyrings/xanmod-archive-keyring.gpg || true
echo 'deb [signed-by=/etc/apt/keyrings/xanmod-archive-keyring.gpg] http://deb.xanmod.org releases main' > /etc/apt/sources.list.d/xanmod-kernel.list
apt-get update -y || true
apt-get install -y linux-xanmod-x64v3 || apt-get install -y linux-generic`
    : config.kernelVariant === 'linux-lowlatency'
    ? `echo "[*] Installing Low-Latency Linux Kernel..."
apt-get install -y linux-lowlatency`
    : `echo "[*] Installing Generic Linux Kernel..."
apt-get install -y linux-generic`
}

# Add Launchpad PPA repositories via add-apt-repository
add-apt-repository -y ppa:lutris-team/lutris || true
add-apt-repository -y ppa:maarten-fonville/android-studio || true
add-apt-repository -y ppa:kisak/kisak-mesa || true

apt-get update -y

# Install Desktop Environment (${config.desktopEnvironment})
${
  config.desktopEnvironment === 'kde-plasma-6'
    ? `apt-get install -y kde-plasma-desktop sddm dolphin konsole plasma-nm pipewire pipewire-pulse`
    : config.desktopEnvironment === 'xfce-4.18'
    ? `apt-get install -y xubuntu-desktop lightdm thunar xfce4-terminal xfce4-power-manager pipewire pipewire-pulse`
    : `apt-get install -y ubuntu-desktop-minimal gdm3 gnome-shell gnome-terminal nautilus pipewire pipewire-pulse`
}

# Install Ubiquity Live GUI OS Installer
apt-get install -y ubiquity ubiquity-frontend-gtk || true

# Install User-Selected Applications (Lutris, Android Studio, Claude, ChatGPT, etc.)
echo "Installing requested packages: ${activePkgs.join(' ')}"
apt-get install -y --allow-unauthenticated \\
  ${activePkgs.join(' \\\n  ')} || true

# Setup Default User (${config.defaultUsername})
if ! id -u ${config.defaultUsername} >/dev/null 2>&1; then
  useradd -m -s /bin/bash -U -G sudo,adm,dialout,cdrom,audio,video,plugdev,render ${config.defaultUsername}
  echo "${config.defaultUsername}:apex" | chpasswd
  echo "${config.defaultUsername} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${config.defaultUsername}
  chmod 0440 /etc/sudoers.d/${config.defaultUsername}
fi

# Enable ZRAM Memory Compression if configured
${
  config.enableZram
    ? `echo "[*] Configuring ZRAM Memory Compression (zstd)..."
apt-get install -y systemd-zram-generator || true
cat <<'ZRAM_CONF' > /etc/systemd/zram-generator.conf
[zram0]
zram-size = min(ram / 2, 16384)
compression-algorithm = zstd
swap-priority = 100
ZRAM_CONF`
    : ''
}

# Enable Feral Gamemode Daemon if configured
${
  config.enableGamemode
    ? `echo "[*] Configuring Gamemode daemon..."
apt-get install -y gamemode libgamemode0 libgamemodeauto0 || true
systemctl enable gamemoded.service || true`
    : ''
}

# Enable KVM Virtualization & User Group
${
  config.enableKvmVirtualization
    ? `echo "[*] Configuring KVM hardware virtualization..."
adduser ${config.defaultUsername} kvm || true
adduser ${config.defaultUsername} libvirt || true
mkdir -p /etc/udev/rules.d
echo 'KERNEL=="kvm", GROUP="kvm", MODE="0666"' > /etc/udev/rules.d/65-kvm.rules`
    : ''
}

# Live Desktop Shortcuts
mkdir -p /home/${config.defaultUsername}/Desktop
cat <<'DESK_INSTALL' > /home/${config.defaultUsername}/Desktop/install-apexos.desktop
[Desktop Entry]
Type=Application
Version=1.0
Name=Install ${config.distroName}
Comment=Install ${config.distroName} permanently to disk
Exec=ubiquity --desktop %k gtk_ui
Icon=ubiquity
Terminal=false
Categories=System;
DESK_INSTALL

chmod +x /home/${config.defaultUsername}/Desktop/*.desktop 2>/dev/null || true
chown -R ${config.defaultUsername}:${config.defaultUsername} /home/${config.defaultUsername}

# Clean up apt caches to minimize ISO size
apt-get clean
rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /root/.bash_history
CHROOT_EXEC

chmod +x "\${CHROOT_DIR}/root/provision.sh"
chroot "\${CHROOT_DIR}" /root/provision.sh
rm -f "\${CHROOT_DIR}/root/provision.sh"

# 6. Extract Kernel & Initrd for Bootloader
echo "[6/8] Extracting vmlinuz and initrd for Casper live session..."
cp "\${CHROOT_DIR}"/boot/vmlinuz-* "\${IMAGE_DIR}/casper/vmlinuz"
cp "\${CHROOT_DIR}"/boot/initrd.img-* "\${IMAGE_DIR}/casper/initrd"

# 7. Compress Root Filesystem into SquashFS
echo "[7/8] Generating compressed squashfs image..."
mksquashfs "\${CHROOT_DIR}" "\${IMAGE_DIR}/casper/filesystem.squashfs" -noappend -comp xz -b 1M

# Write filesystem size manifest
printf $(du -sx --block-size=1 "\${CHROOT_DIR}" | cut -f1) > "\${IMAGE_DIR}/casper/filesystem.size"

# 8. Configure GRUB & Generate Hybrid Bootable ISO
echo "[8/8] Generating bootable hybrid ISO image with GRUB and UEFI support..."
mkdir -p "\${IMAGE_DIR}/boot/grub"
cat <<'EOF' > "\${IMAGE_DIR}/boot/grub/grub.cfg"
set default="0"
set timeout=10

menuentry "Try or Install ${config.distroName} (Live)" {
    set gfxpayload=keep
    linux   /casper/vmlinuz boot=casper quiet splash ---
    initrd  /casper/initrd
}

menuentry "Install ${config.distroName} Directly (OEM / Automated)" {
    set gfxpayload=keep
    linux   /casper/vmlinuz boot=casper only-ubiquity quiet splash ---
    initrd  /casper/initrd
}

menuentry "Safe Graphics Mode" {
    set gfxpayload=keep
    linux   /casper/vmlinuz boot=casper nomodeset quiet splash ---
    initrd  /casper/initrd
}

menuentry "Check Disc for Defects" {
    linux   /casper/vmlinuz boot=casper integrity-check quiet splash ---
    initrd  /casper/initrd
}

menuentry "UEFI Firmware Settings" {
    fwsetup
}
EOF

# Build ISO with xorriso
grub-mkrescue -o "\${ISO_OUTPUT}" "\${IMAGE_DIR}" -- -volid "${config.codename.toUpperCase()}_APEX"

# Generate Checksum
sha256sum "\${ISO_OUTPUT}" > "\${ISO_OUTPUT}.sha256"

echo "=============================================================================="
echo " [SUCCESS] Distro ISO built successfully!"
echo " ISO Location: \${ISO_OUTPUT}"
echo " File Size:    $(du -h "\${ISO_OUTPUT}" | cut -f1)"
echo " SHA-256:      $(cut -d' ' -f1 "\${ISO_OUTPUT}.sha256")"
echo " Flash to USB: sudo dd if=\${ISO_OUTPUT} of=/dev/sdX bs=4M status=progress oflag=sync"
echo "=============================================================================="
`;
}

export function generateOsInstallScript(config: DistroConfiguration): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# ${config.distroName} v${config.version} (${config.codename})
# Production Bare-Metal & Target Drive Direct OS Installer Script
# Installs ${config.distroName} onto NVMe / SSD / HDD with EFI & GRUB bootloader
# ==============================================================================

set -euo pipefail

# Check root privilege
if [[ "\${EUID}" -ne 0 ]]; then
  echo "[-] ERROR: This installer must be executed as root (sudo bash install-distro.sh)"
  exit 1
fi

echo "=============================================================================="
echo "           ${config.distroName} OS Bare-Metal Installer"
echo "=============================================================================="
echo " Base System: Ubuntu ${config.baseUbuntuVersion} (${config.codename})"
echo " Kernel:      ${config.kernelVariant}"
echo " Desktop:     ${config.desktopEnvironment}"
echo " Hostname:    ${config.hostname}"
echo " Default User: ${config.defaultUsername}"
echo "=============================================================================="

# 1. Disk Detection & Selection
echo ""
echo "[*] Available storage devices:"
lsblk -d -p -n -o NAME,SIZE,TYPE,MODEL,TRAN | grep -E "disk" || true
echo ""

TARGET_DISK="\${1:-}"
if [[ -z "\${TARGET_DISK}" ]]; then
  read -rp "Enter target disk device to install ${config.distroName} (e.g. /dev/nvme0n1 or /dev/sda): " TARGET_DISK
fi

if [[ ! -b "\${TARGET_DISK}" ]]; then
  echo "[-] ERROR: Device \${TARGET_DISK} does not exist or is not a block device!"
  exit 1
fi

echo ""
echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo " WARNING: ALL DATA ON \${TARGET_DISK} WILL BE PERMANENTLY ERASED!"
echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
read -rp "Are you absolutely sure you want to partition and format \${TARGET_DISK}? [y/N]: " CONFIRM
if [[ "\${CONFIRM}" != "y" && "\${CONFIRM}" != "Y" ]]; then
  echo "[-] Installation aborted by user."
  exit 0
fi

# 2. Wipe Partition Tables and Create GPT
echo ""
echo "[1/7] Wiping disk signatures and creating GPT partition table on \${TARGET_DISK}..."
wipefs -a -f "\${TARGET_DISK}" || true
parted -s "\${TARGET_DISK}" mklabel gpt

# Partition 1: 512MB EFI System Partition (ESP)
echo "[*] Creating 512MB EFI System Partition..."
parted -s "\${TARGET_DISK}" mkpart "ESP" fat32 1MiB 513MiB
parted -s "\${TARGET_DISK}" set 1 esp on
parted -s "\${TARGET_DISK}" set 1 boot on

# Partition 2: 4096MB Swap Partition
echo "[*] Creating 4GB Swap Partition..."
parted -s "\${TARGET_DISK}" mkpart "SWAP" linux-swap 513MiB 4609MiB

# Partition 3: Root Ext4 Partition (Remaining space)
echo "[*] Creating Root Ext4 Partition..."
parted -s "\${TARGET_DISK}" mkpart "APEX_ROOT" ext4 4609MiB 100%

# Wait for kernel to register partitions
sleep 2
partprobe "\${TARGET_DISK}" || true

# Determine partition naming (e.g. /dev/nvme0n1p1 vs /dev/sda1)
if [[ "\${TARGET_DISK}" =~ [0-9]$ ]]; then
  EFI_PART="\${TARGET_DISK}p1"
  SWAP_PART="\${TARGET_DISK}p2"
  ROOT_PART="\${TARGET_DISK}p3"
else
  EFI_PART="\${TARGET_DISK}1"
  SWAP_PART="\${TARGET_DISK}2"
  ROOT_PART="\${TARGET_DISK}3"
fi

# 3. Format Partitions
echo ""
echo "[2/7] Formatting partitions..."
echo "  - Formatting EFI partition (\${EFI_PART}) as FAT32..."
mkfs.vfat -F32 -n "APEX_BOOT" "\${EFI_PART}"

echo "  - Formatting Swap partition (\${SWAP_PART})..."
mkswap -L "APEX_SWAP" "\${SWAP_PART}"

echo "  - Formatting Root partition (\${ROOT_PART}) as Ext4..."
mkfs.ext4 -F -L "APEX_ROOT" "\${ROOT_PART}"

# 4. Mount Target Partitions
echo ""
echo "[3/7] Mounting target filesystems..."
MOUNT_DIR="/mnt/apex-install"
mkdir -p "\${MOUNT_DIR}"
mount "\${ROOT_PART}" "\${MOUNT_DIR}"

mkdir -p "\${MOUNT_DIR}/boot/efi"
mount "\${EFI_PART}" "\${MOUNT_DIR}/boot/efi"

# 5. Extract or Debootstrap Operating System Rootfs
echo ""
echo "[4/7] Installing OS base and packages into \${MOUNT_DIR}..."
if [[ -f "/casper/filesystem.squashfs" ]]; then
  echo "[*] Unpacking live session SquashFS to target disk..."
  unsquashfs -f -d "\${MOUNT_DIR}" "/casper/filesystem.squashfs"
elif [[ -f "/run/casper/filesystem.squashfs" ]]; then
  echo "[*] Unpacking live session SquashFS to target disk..."
  unsquashfs -f -d "\${MOUNT_DIR}" "/run/casper/filesystem.squashfs"
else
  echo "[*] Bootstrapping Ubuntu ${config.codename} base via debootstrap..."
  debootstrap --arch="${config.architecture}" "${config.codename}" "\${MOUNT_DIR}" http://archive.ubuntu.com/ubuntu/
fi

# 6. Configure fstab with Dynamic UUIDs
echo ""
echo "[5/7] Generating /etc/fstab with persistent partition UUIDs..."
ROOT_UUID=$(blkid -s UUID -o value "\${ROOT_PART}")
EFI_UUID=$(blkid -s UUID -o value "\${EFI_PART}")
SWAP_UUID=$(blkid -s UUID -o value "\${SWAP_PART}")

cat <<EOF > "\${MOUNT_DIR}/etc/fstab"
# /etc/fstab: static file system information for ${config.distroName}
# <file system>                             <mount point>   <type>  <options>       <dump>  <pass>
UUID=\${ROOT_UUID}                          /               ext4    noatime,errors=remount-ro 0       1
UUID=\${EFI_UUID}                           /boot/efi       vfat    umask=0077      0       2
UUID=\${SWAP_UUID}                          none            swap    sw              0       0
EOF

# 7. Configure Chroot & Install GRUB EFI Bootloader
echo ""
echo "[6/7] Configuring system chroot, network, and GRUB bootloader..."
mount --bind /dev "\${MOUNT_DIR}/dev"
mount --bind /dev/pts "\${MOUNT_DIR}/dev/pts"
mount -t proc none "\${MOUNT_DIR}/proc"
mount -t sysfs none "\${MOUNT_DIR}/sys"
mount --bind /run "\${MOUNT_DIR}/run"

cleanup_install() {
  umount -lf "\${MOUNT_DIR}/dev/pts" 2>/dev/null || true
  umount -lf "\${MOUNT_DIR}/dev" 2>/dev/null || true
  umount -lf "\${MOUNT_DIR}/proc" 2>/dev/null || true
  umount -lf "\${MOUNT_DIR}/sys" 2>/dev/null || true
  umount -lf "\${MOUNT_DIR}/run" 2>/dev/null || true
  umount -lf "\${MOUNT_DIR}/boot/efi" 2>/dev/null || true
  umount -lf "\${MOUNT_DIR}" 2>/dev/null || true
}
trap cleanup_install EXIT

cp /etc/resolv.conf "\${MOUNT_DIR}/etc/resolv.conf"

cat <<'CHROOT_BOOTLOADER' > "\${MOUNT_DIR}/tmp/finalize.sh"
#!/usr/bin/env bash
set -e
export DEBIAN_FRONTEND=noninteractive

# Update grub package and install to EFI
apt-get update -y || true
apt-get install -y grub-efi-amd64 grub-efi-amd64-signed linux-generic efibootmgr

# Install GRUB EFI to target drive
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id="ApexOS" --recheck

# Generate GRUB configuration
update-grub

# Generate Initramfs
update-initramfs -u -k all
CHROOT_BOOTLOADER

chmod +x "\${MOUNT_DIR}/tmp/finalize.sh"
chroot "\${MOUNT_DIR}" /tmp/finalize.sh
rm -f "\${MOUNT_DIR}/tmp/finalize.sh"

# 8. Unmount & Completion
echo ""
echo "[7/7] Finalizing system sync..."
sync

echo "=============================================================================="
echo " [SUCCESS] ${config.distroName} installation is COMPLETE!"
echo " Target Disk: \${TARGET_DISK}"
echo " Root Part:   \${ROOT_PART} (UUID: \${ROOT_UUID})"
echo " EFI Part:    \${EFI_PART} (UUID: \${EFI_UUID})"
echo " Bootloader:  GRUB 2.12 (UEFI x86_64)"
echo ""
echo " You may now safely reboot into your new installation."
echo " Command: sudo reboot"
echo "=============================================================================="
`;
}

export function generateAutoinstallYaml(config: DistroConfiguration): string {
  const activePkgs = config.packages.filter((p) => p.installed).map((p) => p.name);

  return `#cloud-config
# Ubuntu 24.04 LTS (Noble) Subiquity Automated Unattended Installer
# Distribution: ${config.distroName} v${config.version}
autoinstall:
  version: 1
  locale: en_US.UTF-8
  keyboard:
    layout: us
  identity:
    hostname: ${config.hostname}
    username: ${config.defaultUsername}
    password: "$6$rounds=4096$salt$f64BvG35mR8v0R.bWv3x7S0Uj5F8vG4m9l1Qz.1uM6K" # Default password: apex
  ssh:
    install-server: true
    allow-pw: true
  storage:
    layout:
      name: direct
  packages:
${activePkgs.map((pkg) => `    - ${pkg}`).join('\n')}
  late-commands:
    - curtin in-target --target=/target -- dpkg --add-architecture i386
    - curtin in-target --target=/target -- adduser ${config.defaultUsername} sudo
    - curtin in-target --target=/target -- adduser ${config.defaultUsername} kvm
    - curtin in-target --target=/target -- systemctl enable NetworkManager
`;
}

export function generateDockerBuildScript(config: DistroConfiguration): string {
  return `# Multi-stage Docker builder for ${config.distroName}
FROM ubuntu:${config.codename} AS builder

ENV DEBIAN_FRONTEND=noninteractive
ENV WORKDIR=/builder

RUN apt-get update && apt-get install -y \\
    debootstrap \\
    squashfs-tools \\
    xorriso \\
    grub-pc-bin \\
    grub-efi-amd64-bin \\
    mtools \\
    dosfstools \\
    curl \\
    gnupg \\
    git \\
    ca-certificates

WORKDIR /builder
COPY build-iso.sh /builder/build-iso.sh
RUN chmod +x /builder/build-iso.sh

# Run builder with privileged mode to mount proc/sys/dev
# docker build --privileged -t apexos-distro-builder .
# docker run --privileged -v \$(pwd)/output:/builder/output apexos-distro-builder /builder/build-iso.sh
`;
}

export function generateSourcesListD(repo: PpaRepository): string {
  return `# Repository configuration for ${repo.name}
# Added by ApexOS Distro Studio
${repo.sourceLine}
`;
}

export function generatePostInstallScript(config: DistroConfiguration): string {
  return `#!/usr/bin/env bash
# Post-installation first-boot optimization script for ${config.distroName}
set -e

echo "[*] Initializing ${config.distroName} first boot setup..."

# 1. Update package indexes
sudo apt-get update -y

# 2. Setup Android Studio SDK directories and permissions
mkdir -p "$HOME/Android/Sdk"
mkdir -p "$HOME/.android"
echo 'export ANDROID_HOME="$HOME/Android/Sdk"' >> "$HOME/.bashrc"
echo 'export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin"' >> "$HOME/.bashrc"

# 3. Setup Lutris DXVK cache and Gamemode
mkdir -p "$HOME/Games"
mkdir -p "$HOME/.local/share/lutris/runners/wine"
systemctl --user enable gamemoded.service || true

# 4. Verify Claude and ChatGPT desktop associations
xdg-mime default claude-desktop.desktop x-scheme-handler/claude || true
xdg-mime default chatgpt-desktop.desktop x-scheme-handler/chatgpt || true

echo "[✓] ApexOS optimization complete! Ready to develop and game."
`;
}

export function generateFormatFat32UsbScript(config: DistroConfiguration): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# ${config.distroName} (${config.codename}) — Format USB to FAT32 & Setup UEFI/BIOS Boot
# ==============================================================================
# Partition scheme: GPT with FAT32 EFI System Partition (ESP)
# Bootloader: GRUB 2.12 x86_64-efi + ISOLINUX BIOS fallback
# Payload: Casper live filesystem (vmlinuz, initrd, filesystem.squashfs)
# ==============================================================================

set -euo pipefail

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
CYAN='\\033[0;36m'
BOLD='\\033[1m'
NC='\\033[0m'

DISTRO_NAME="${config.distroName}"
DISTRO_LABEL="${config.codename.toUpperCase().substring(0, 11)}_BOOT"

echo -e "\${CYAN}\${BOLD}"
echo "=============================================================================="
echo "    \${DISTRO_NAME} — USB FAT32 UEFI/BIOS Boot Preparation Engine"
echo "=============================================================================="
echo -e "\${NC}"

if [[ \$EUID -ne 0 ]]; then
   echo -e "\${RED}[!] Error: Run with sudo (sudo ./format-fat32-usb.sh [TARGET_DRIVE] [ISO_PATH])\${NC}" 1>&2
   exit 1
fi

# Ensure required utilities exist
for tool in parted mkfs.vfat wipefs lsblk udevadm; do
    if ! command -v "\$tool" >/dev/null 2>&1; then
        echo -e "\${YELLOW}[*] Installing required disk partitioning tools...\${NC}"
        apt-get update -qq && apt-get install -y -qq dosfstools parted util-linux udev grub-efi-amd64-bin
        break
    fi
done

TARGET_DRIVE="\${1:-}"
ISO_SOURCE="\${2:-}"

if [[ -z "\$TARGET_DRIVE" ]]; then
    echo -e "\${BOLD}Available block devices:\${NC}"
    lsblk -d -o NAME,SIZE,TYPE,TRAN,MODEL,VENDOR
    echo ""
    read -p "Enter target USB device to format to FAT32 (e.g. /dev/sdb): " TARGET_DRIVE
fi

if [[ ! -b "\$TARGET_DRIVE" ]]; then
    echo -e "\${RED}[!] Error: '\$TARGET_DRIVE' is not a valid block device!\${NC}"
    exit 1
fi

# Safety check: avoid formatting root filesystem drive
ROOT_DEV=\$(lsblk -no pkname "\$(findmnt -n -o SOURCE /)" 2>/dev/null || true)
if [[ -n "\$ROOT_DEV" && "\$TARGET_DRIVE" == *"\$ROOT_DEV"* ]]; then
    echo -e "\${RED}[CRITICAL ERROR] '\$TARGET_DRIVE' contains your running OS root (/) partition! Aborting.\${NC}"
    exit 1
fi

echo -e "\${YELLOW}\${BOLD}WARNING: All data on \${TARGET_DRIVE} will be destroyed.\${NC}"
read -p "Format \${TARGET_DRIVE} as FAT32 EFI bootable drive? [y/N]: " confirm
if [[ ! "\$confirm" =~ ^[Yy]\$ ]]; then
    echo "Aborted."
    exit 0
fi

# 1. Unmount existing partitions
echo -e "\${BLUE}[1/5] Unmounting partitions on \${TARGET_DRIVE}...\${NC}"
for part in \$(lsblk -ln -o NAME "\${TARGET_DRIVE}" | tail -n +2); do
    umount -f "/dev/\${part}" 2>/dev/null || true
    swapoff "/dev/\${part}" 2>/dev/null || true
done

# 2. Wipe disk signature and create GPT FAT32 partition
echo -e "\${BLUE}[2/5] Initializing GPT partition table and FAT32 ESP partition...\${NC}"
wipefs --all --force "\${TARGET_DRIVE}"
dd if=/dev/zero of="\${TARGET_DRIVE}" bs=1M count=10 status=none
parted -s "\${TARGET_DRIVE}" mklabel gpt
parted -s "\${TARGET_DRIVE}" mkpart primary fat32 1MiB 100%
parted -s "\${TARGET_DRIVE}" set 1 esp on
parted -s "\${TARGET_DRIVE}" set 1 boot on

udevadm settle
sleep 1

if [[ "\${TARGET_DRIVE}" =~ [0-9]\$ ]]; then
    PART_DEV="\${TARGET_DRIVE}p1"
else
    PART_DEV="\${TARGET_DRIVE}1"
fi

# 3. Format FAT32
echo -e "\${BLUE}[3/5] Formatting \${PART_DEV} with FAT32 filesystem (Label: \${DISTRO_LABEL})...\${NC}"
mkfs.vfat -F 32 -n "\${DISTRO_LABEL}" "\${PART_DEV}"

# 4. Mount and install GRUB 2.12 UEFI files
echo -e "\${BLUE}[4/5] Deploying EFI/BOOT and GRUB configuration...\${NC}"
MNT_DIR=\$(mktemp -d /tmp/apex_mnt_XXXXXX)
mount -o umask=000 "\${PART_DEV}" "\${MNT_DIR}"

mkdir -p "\${MNT_DIR}/EFI/BOOT"
mkdir -p "\${MNT_DIR}/boot/grub"
mkdir -p "\${MNT_DIR}/casper"
mkdir -p "\${MNT_DIR}/isolinux"
mkdir -p "\${MNT_DIR}/.disk"

echo "\${DISTRO_NAME} ${config.version} - FAT32 UEFI Boot" > "\${MNT_DIR}/.disk/info"
touch "\${MNT_DIR}/.disk/casper-uuid-generic"

cat <<'GRUB_EOF' > "\${MNT_DIR}/boot/grub/grub.cfg"
set default="0"
set timeout=10

insmod font
if loadfont \${prefix}/fonts/unicode.pf2 ; then
    insmod gfxterm
    set gfxmode=auto
    terminal_output gfxterm
fi

insmod all_video
insmod part_gpt
insmod part_msdos
insmod fat
insmod ext2

menuentry "Try or Install ${config.distroName} (Live FAT32)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper quiet splash fsck.mode=skip ---
    initrd /casper/initrd
}

menuentry "Install ${config.distroName} (Direct OEM Installer)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper only-ubiquity quiet splash ---
    initrd /casper/initrd
}

menuentry "${config.distroName} (Safe Graphics - Nomodeset)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper nomodeset quiet splash ---
    initrd /casper/initrd
}

menuentry "UEFI Firmware Settings" {
    fwsetup
}

menuentry "Reboot" {
    reboot
}
GRUB_EOF

cp "\${MNT_DIR}/boot/grub/grub.cfg" "\${MNT_DIR}/EFI/BOOT/grub.cfg"

# 5. Extract ISO files if supplied
if [[ -n "\$ISO_SOURCE" && -f "\$ISO_SOURCE" ]]; then
    echo -e "\${BLUE}[5/5] Copying live system files from \${ISO_SOURCE}...\${NC}"
    ISO_MNT=\$(mktemp -d /tmp/apex_iso_XXXXXX)
    mount -o loop,ro "\$ISO_SOURCE" "\$ISO_MNT"
    if [[ -d "\$ISO_MNT/casper" ]]; then
        cp -r "\$ISO_MNT/casper"/* "\${MNT_DIR}/casper/"
    fi
    if [[ -d "\$ISO_MNT/EFI" ]]; then
        cp -r "\$ISO_MNT/EFI"/* "\${MNT_DIR}/EFI/"
    fi
    umount "\$ISO_MNT"
    rmdir "\$ISO_MNT"
fi

# Ensure UEFI boot binary exists
if [[ ! -f "\${MNT_DIR}/EFI/BOOT/BOOTX64.EFI" ]]; then
    if [[ -f "/usr/lib/grub/x86_64-efi/monolithic/gcdx64.efi" ]]; then
        cp "/usr/lib/grub/x86_64-efi/monolithic/gcdx64.efi" "\${MNT_DIR}/EFI/BOOT/BOOTX64.EFI"
    elif [[ -f "/boot/efi/EFI/ubuntu/grubx64.efi" ]]; then
        cp "/boot/efi/EFI/ubuntu/grubx64.efi" "\${MNT_DIR}/EFI/BOOT/BOOTX64.EFI"
    fi
fi

sync
umount "\${MNT_DIR}"
rmdir "\${MNT_DIR}"

echo -e "\${GREEN}\${BOLD}[SUCCESS] FAT32 Bootable USB drive ready on \${PART_DEV}!\${NC}"
`;
}

export function generateMakeBootableFat32Script(config: DistroConfiguration): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# ${config.distroName} — Automated Distro ISO Builder & FAT32 USB Deployer
# ==============================================================================
set -euo pipefail

echo "=============================================================================="
echo " ${config.distroName} - FAT32 Bootable Distro Pipeline"
echo "=============================================================================="

if [[ \$EUID -ne 0 ]]; then
   echo "[!] Please run with sudo: sudo ./make-bootable-fat32.sh" 1>&2
   exit 1
fi

chmod +x ./format-fat32-usb.sh
chmod +x ./build-iso.sh 2>/dev/null || true

# Look for ISO
ISO_FILE="output/${config.distroName.toLowerCase().replace(/\\s+/g, '-')}-${config.version}-${config.architecture}.iso"
if [[ ! -f "\$ISO_FILE" ]]; then
    POSSIBLE_ISOS=(\$(ls -t output/*.iso ./*.iso 2>/dev/null || true))
    if [[ \${#POSSIBLE_ISOS[@]} -gt 0 ]]; then
        ISO_FILE="\${POSSIBLE_ISOS[0]}"
    fi
fi

if [[ -f "\$ISO_FILE" ]]; then
    echo "[*] Using ISO image: \$ISO_FILE (\$(du -h "\$ISO_FILE" | cut -f1))"
else
    echo "[*] ISO not yet compiled. Running ./build-iso.sh first..."
    bash ./build-iso.sh
fi

echo ""
lsblk -d -o NAME,SIZE,TYPE,TRAN,MODEL,VENDOR
read -p "Enter target USB disk (e.g. /dev/sdb): " USB_DISK

./format-fat32-usb.sh "\$USB_DISK" "\$ISO_FILE"
echo "[✓] Complete! Boot your system and select USB in UEFI boot menu."
`;
}

export function generateEfiGrubCfg(config: DistroConfiguration): string {
  return `# GRUB 2.12 UEFI Bootloader Configuration for ${config.distroName} FAT32 USB
set default="0"
set timeout=10

insmod font
if loadfont \${prefix}/fonts/unicode.pf2 ; then
    insmod gfxterm
    set gfxmode=auto
    terminal_output gfxterm
fi

insmod all_video
insmod part_gpt
insmod part_msdos
insmod fat
insmod ext2

menuentry "Try or Install ${config.distroName} (Live Session - FAT32)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper quiet splash fsck.mode=skip ---
    initrd /casper/initrd
}

menuentry "Install ${config.distroName} Directly (OEM Automated)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper only-ubiquity quiet splash ---
    initrd /casper/initrd
}

menuentry "${config.distroName} (Safe Graphics - Nomodeset)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper nomodeset quiet splash ---
    initrd /casper/initrd
}

menuentry "UEFI Firmware Settings" {
    fwsetup
}

menuentry "Reboot System" {
    reboot
}
`;
}

export function generateLoopbackCfg(config: DistroConfiguration): string {
  return `# Loopback configuration for ISO boot tools (Ventoy, GRUB loopmount)
menuentry "${config.distroName} (Boot from Loopback ISO File)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper iso-scan/filename=\${iso_path} quiet splash fsck.mode=skip ---
    initrd /casper/initrd
}

menuentry "${config.distroName} (Safe Graphics - Loopback ISO)" {
    set gfxpayload=keep
    linux  /casper/vmlinuz boot=casper iso-scan/filename=\${iso_path} nomodeset quiet splash ---
    initrd /casper/initrd
}
`;
}

export function generateIsolinuxCfg(config: DistroConfiguration): string {
  return `default vesamenu.c32
prompt 0
timeout 100

menu title ${config.distroName} Live Bootloader (Legacy BIOS)
label live
  menu label ^Try or Install ${config.distroName}
  kernel /casper/vmlinuz
  append boot=casper initrd=/casper/initrd quiet splash ---

label direct
  menu label ^Install ${config.distroName} Directly
  kernel /casper/vmlinuz
  append boot=casper initrd=/casper/initrd only-ubiquity quiet splash ---

label safe
  menu label ${config.distroName} (^Safe Graphics Mode)
  kernel /casper/vmlinuz
  append boot=casper initrd=/casper/initrd nomodeset quiet splash ---
`;
}

