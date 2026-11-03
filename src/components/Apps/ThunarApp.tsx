import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  FileText,
  File,
  HardDrive,
  Home,
  Download,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCw,
  Search,
  Grid,
  List as ListIcon,
  Eye,
  Copy,
  Trash2,
  FolderPlus,
  Terminal,
  ExternalLink,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface ThunarAppProps {
  config: DistroConfiguration;
  onOpenApp?: (appId: any) => void;
}

interface FsItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size: string;
  extension?: string;
  mime: string;
  modified: string;
  permissions: string;
  owner: string;
  content?: string;
}

export const ThunarApp: React.FC<ThunarAppProps> = ({ config, onOpenApp }) => {
  const [currentPath, setCurrentPath] = useState<string>('/home/developer');
  const [history, setHistory] = useState<string[]>(['/home/developer']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<FsItem | null>(null);
  const [previewItem, setPreviewItem] = useState<FsItem | null>(null);

  // Simulated virtual filesystem
  const fileSystemData: Record<string, FsItem[]> = {
    '/': [
      { id: 'bin', name: 'bin', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 24 14:10', permissions: 'drwxr-xr-x', owner: 'root:root' },
      { id: 'boot', name: 'boot', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 24 14:12', permissions: 'drwxr-xr-x', owner: 'root:root' },
      { id: 'etc', name: 'etc', type: 'folder', size: '12.0 KB', mime: 'Directory', modified: 'Oct 28 09:20', permissions: 'drwxr-xr-x', owner: 'root:root' },
      { id: 'home', name: 'home', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 28 10:00', permissions: 'drwxr-xr-x', owner: 'root:root' },
      { id: 'opt', name: 'opt', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 28 11:15', permissions: 'drwxr-xr-x', owner: 'root:root' },
      { id: 'usr', name: 'usr', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 24 13:50', permissions: 'drwxr-xr-x', owner: 'root:root' },
      { id: 'var', name: 'var', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 29 16:30', permissions: 'drwxr-xr-x', owner: 'root:root' },
    ],
    '/home': [
      { id: 'developer', name: 'developer', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 28 10:00', permissions: 'drwxr-xr-x', owner: 'developer:developer' },
    ],
    '/home/developer': [
      { id: 'desktop', name: 'Desktop', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 28 10:02', permissions: 'drwxr-xr-x', owner: 'developer:developer' },
      { id: 'documents', name: 'Documents', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 28 10:05', permissions: 'drwxr-xr-x', owner: 'developer:developer' },
      { id: 'downloads', name: 'Downloads', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 28 12:40', permissions: 'drwxr-xr-x', owner: 'developer:developer' },
      { id: 'games', name: 'Games', type: 'folder', size: '4.0 KB', mime: 'Directory', modified: 'Oct 28 14:15', permissions: 'drwxr-xr-x', owner: 'developer:developer' },
      { id: 'build-iso-sh', name: 'build-iso.sh', type: 'file', size: '5.8 KB', extension: 'sh', mime: 'Shell script', modified: 'Nov 02 14:22', permissions: '-rwxr-xr-x', owner: 'developer:developer', content: `#!/usr/bin/env bash\n# ${config.distroName} Live ISO Creator Script\nset -euo pipefail\n\nWORKDIR="/tmp/apexos-build"\necho "[+] Debootstrapping Ubuntu ${config.codename} (${config.architecture})..."\necho "[+] Installing XanMod kernel, GNOME 47, and packages..."\nmksquashfs "$WORKDIR/chroot" "$WORKDIR/image/casper/filesystem.squashfs" -comp xz\necho "[+] Generating UEFI/BIOS Hybrid Bootable ISO: apexos-${config.version}-${config.architecture}.iso"\ngrub-mkrescue -o "apexos-${config.version}-${config.architecture}.iso" "$WORKDIR/image"\n` },
      { id: 'install-distro-sh', name: 'install-distro.sh', type: 'file', size: '6.4 KB', extension: 'sh', mime: 'Shell script', modified: 'Nov 02 14:30', permissions: '-rwxr-xr-x', owner: 'developer:developer', content: `#!/usr/bin/env bash\n# ${config.distroName} Bare-Metal Target OS Installer\nset -euo pipefail\n\necho "[*] Scanning block devices for installation target..."\nlsblk -d -p -n -o NAME,SIZE,TYPE,MODEL\necho "[1/7] Creating GPT Partition Table (ESP 512M, Swap 4G, ext4 APEX_ROOT)..."\necho "[2/7] Formatting mkfs.vfat and mkfs.ext4..."\necho "[3/7] Unpacking SquashFS rootfs to target drive..."\necho "[4/7] Generating /etc/fstab with persistent UUIDs..."\necho "[5/7] Installing GRUB 2.12 EFI Bootloader..."\necho "[✓] ${config.distroName} installed successfully! Ready to reboot."\n` },
      { id: 'autoinstall-yaml', name: 'autoinstall-user-data.yaml', type: 'file', size: '2.4 KB', extension: 'yaml', mime: 'YAML document', modified: 'Nov 02 14:35', permissions: '-rw-r--r--', owner: 'developer:developer', content: `#cloud-config\n# Ubuntu 24.04 Subiquity Unattended Autoinstall for ${config.distroName}\nautoinstall:\n  version: 1\n  locale: en_US.UTF-8\n  identity:\n    hostname: ${config.hostname}\n    username: ${config.defaultUsername}\n  storage:\n    layout:\n      name: direct\n` },
      { id: 'readme-txt', name: 'README-ApexOS.md', type: 'file', size: '1.8 KB', extension: 'md', mime: 'Markdown document', modified: 'Nov 02 14:00', permissions: '-rw-r--r--', owner: 'developer:developer', content: `# Welcome to ${config.distroName} v${config.version}\n\nPre-configured with:\n- Visual Studio Code (Microsoft Official APT Repository)\n- Thunar 4.18 Lightweight XFCE File Manager\n- Steam with Wine & Proton 9.0 Compatibility\n- Q4Wine Qt GUI Prefix & DLL Manager\n- Mangoapp Standalone Overlay Runner\n- Cmatrix Digital Rain Console\n- TDFSB (Modded) 3D File System Browser\n` },
    ],
    '/home/developer/Desktop': [
      { id: 'install-distro-desk', name: 'install-apexos.desktop', type: 'file', size: '680 B', extension: 'desktop', mime: 'Desktop entry', modified: 'Nov 02 14:32', permissions: '-rwxr-xr-x', owner: 'developer:developer', content: `[Desktop Entry]\nName=Install ${config.distroName}\nComment=Direct Bare-Metal OS Installer\nExec=sudo /home/developer/install-distro.sh\nIcon=system-software-install\nTerminal=true\nType=Application\nCategories=System;\n` },
      { id: 'thunar-desktop', name: 'thunar.desktop', type: 'file', size: '820 B', extension: 'desktop', mime: 'Desktop entry', modified: 'Oct 29 18:00', permissions: '-rwxr-xr-x', owner: 'developer:developer', content: '[Desktop Entry]\nName=Thunar File Manager\nComment=Manage your files with XFCE Thunar\nExec=thunar %F\nIcon=thunar\nTerminal=false\nType=Application\nCategories=System;Utility;Core;GTK;\n' },
      { id: 'steam-desktop', name: 'steam.desktop', type: 'file', size: '940 B', extension: 'desktop', mime: 'Desktop entry', modified: 'Oct 29 18:05', permissions: '-rwxr-xr-x', owner: 'developer:developer', content: '[Desktop Entry]\nName=Steam (Native & Wine)\nComment=Valve Steam Gaming Client with Proton 9.0\nExec=steam %U\nIcon=steam\nTerminal=false\nType=Application\nCategories=Network;FileTransfer;Game;\n' },
      { id: 'tdfsb-desktop', name: 'tdfsb-3d.desktop', type: 'file', size: '780 B', extension: 'desktop', mime: 'Desktop entry', modified: 'Oct 29 18:10', permissions: '-rwxr-xr-x', owner: 'developer:developer', content: '[Desktop Entry]\nName=TDFSB 3D File Browser\nComment=Navigate Linux file system in 3D\nExec=tdfsb\nIcon=system-file-manager\nTerminal=false\nType=Application\nCategories=Utility;3DGraphics;\n' },
    ],
    '/etc/apt/sources.list.d': [
      { id: 'vscode-sources', name: 'vscode.sources', type: 'file', size: '410 B', extension: 'sources', mime: 'APT deb822 source', modified: 'Nov 02 12:00', permissions: '-rw-r--r--', owner: 'root:root', content: 'Types: deb\nURIs: https://packages.microsoft.com/repos/code\nSuites: stable\nComponents: main\nSigned-By: /etc/apt/keyrings/packages.microsoft.gpg\n' },
      { id: 'lutris-sources', name: 'lutris.sources', type: 'file', size: '420 B', extension: 'sources', mime: 'APT deb822 source', modified: 'Oct 28 09:12', permissions: '-rw-r--r--', owner: 'root:root', content: 'Types: deb\nURIs: https://ppa.launchpadcontent.net/lutris-team/lutris/ubuntu\nSuites: noble\nComponents: main\nSigned-By: /etc/apt/keyrings/lutris.gpg\n' },
      { id: 'android-sources', name: 'android-studio.sources', type: 'file', size: '445 B', extension: 'sources', mime: 'APT deb822 source', modified: 'Oct 28 09:15', permissions: '-rw-r--r--', owner: 'root:root', content: 'Types: deb\nURIs: https://ppa.launchpadcontent.net/maarten-fonville/android-studio/ubuntu\nSuites: noble\nComponents: main\nSigned-By: /etc/apt/keyrings/android-studio.gpg\n' },
      { id: 'winehq-sources', name: 'winehq-noble.sources', type: 'file', size: '390 B', extension: 'sources', mime: 'APT deb822 source', modified: 'Oct 28 09:20', permissions: '-rw-r--r--', owner: 'root:root', content: 'Types: deb\nURIs: https://dl.winehq.org/wine-builds/ubuntu/\nSuites: noble\nComponents: main\nSigned-By: /etc/apt/keyrings/winehq-archive.key\n' },
    ],
    '/var/www/html': [
      { id: 'index-html', name: 'index.html', type: 'file', size: '10.8 KB', extension: 'html', mime: 'HTML document', modified: 'Oct 29 16:30', permissions: '-rw-r--r--', owner: 'www-data:www-data', content: '<!DOCTYPE html>\n<html>\n<head><title>Apache2 Ubuntu Default Page: It Works</title></head>\n<body>\n<h1>Apache2 Default Page on ApexOS 24.04</h1>\n<p>Document root is /var/www/html.</p>\n</body>\n</html>\n' },
    ],
  };

  const getItemsForPath = (path: string): FsItem[] => {
    return fileSystemData[path] || [
      { id: 'empty', name: '(Empty folder)', type: 'file', size: '0 B', mime: 'Empty', modified: '-', permissions: 'drwxr-xr-x', owner: 'developer:developer', content: 'Folder is empty.' },
    ];
  };

  const navigateTo = (path: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSelectedItem(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setCurrentPath(history[newIdx]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setCurrentPath(history[newIdx]);
    }
  };

  const goUp = () => {
    if (currentPath === '/') return;
    const segments = currentPath.split('/').filter(Boolean);
    segments.pop();
    const upPath = '/' + segments.join('/');
    navigateTo(upPath || '/');
  };

  const items = getItemsForPath(currentPath).filter((it) =>
    it.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (item: FsItem) => {
    if (item.type === 'folder') {
      return <Folder className="w-8 h-8 text-amber-400 fill-amber-400/20" />;
    }
    if (item.extension === 'sh') {
      return <FileCode className="w-8 h-8 text-emerald-400" />;
    }
    if (item.extension === 'desktop') {
      return <Sliders className="w-8 h-8 text-cyan-400" />;
    }
    if (item.extension === 'sources' || item.extension === 'list' || item.extension === 'conf') {
      return <FileText className="w-8 h-8 text-amber-300" />;
    }
    return <File className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 font-sans select-none overflow-hidden text-xs">
      {/* Top Menu / Toolbar */}
      <div className="h-10 px-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
            title="Back (Alt+Left)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
            title="Forward (Alt+Right)"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={goUp}
            disabled={currentPath === '/'}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300"
            title="Parent Directory (Alt+Up)"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('/home/developer')}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPath(currentPath)}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300"
            title="Reload (Ctrl+R)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Breadcrumb Path Bar */}
        <div className="flex-1 flex items-center bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-slate-300 font-mono text-[11px] overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => navigateTo('/')}
            className="hover:text-amber-400 font-bold px-1"
          >
            /
          </button>
          {currentPath
            .split('/')
            .filter(Boolean)
            .map((seg, idx, arr) => {
              const segPath = '/' + arr.slice(0, idx + 1).join('/');
              return (
                <React.Fragment key={segPath}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-0.5" />
                  <button
                    onClick={() => navigateTo(segPath)}
                    className="hover:text-amber-400 px-1 rounded hover:bg-slate-800 transition"
                  >
                    {seg}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        {/* View toggles & Search */}
        <div className="flex items-center gap-2">
          <div className="relative w-36">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-md pl-7 pr-2 py-1 text-slate-200 outline-none text-[11px]"
            />
          </div>

          <div className="flex items-center border border-slate-800 rounded-md bg-slate-950 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'}`}
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Sidebar & Directory View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thunar Sidebar */}
        <div className="w-48 bg-slate-950/70 border-r border-slate-800 p-2.5 flex flex-col justify-between shrink-0 text-slate-300">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2">
                Places
              </span>
              <div className="mt-1.5 space-y-0.5">
                <button
                  onClick={() => navigateTo('/home/developer')}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition text-left ${currentPath === '/home/developer' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'hover:bg-slate-800/60'}`}
                >
                  <Home className="w-4 h-4 text-amber-400" />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => navigateTo('/home/developer/Desktop')}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition text-left ${currentPath === '/home/developer/Desktop' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'hover:bg-slate-800/60'}`}
                >
                  <Folder className="w-4 h-4 text-cyan-400" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => navigateTo('/home/developer/Downloads')}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition text-left ${currentPath === '/home/developer/Downloads' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'hover:bg-slate-800/60'}`}
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Downloads</span>
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-2">
                System Locations
              </span>
              <div className="mt-1.5 space-y-0.5">
                <button
                  onClick={() => navigateTo('/')}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition text-left ${currentPath === '/' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'hover:bg-slate-800/60'}`}
                >
                  <HardDrive className="w-4 h-4 text-slate-400" />
                  <span>File System (/)</span>
                </button>
                <button
                  onClick={() => navigateTo('/etc/apt/sources.list.d')}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition text-left ${currentPath === '/etc/apt/sources.list.d' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'hover:bg-slate-800/60'}`}
                >
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>APT Sources.list.d</span>
                </button>
                <button
                  onClick={() => navigateTo('/var/www/html')}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition text-left ${currentPath === '/var/www/html' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'hover:bg-slate-800/60'}`}
                >
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>Apache Web Root</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-400">
            <div>Drive: <strong>/dev/nvme0n1p2</strong></div>
            <div>Free: <strong>482.4 GB / 1000 GB</strong></div>
            <div className="mt-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[52%]"></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          <div className="flex-1 overflow-y-auto p-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {items.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      onDoubleClick={() => {
                        if (item.type === 'folder') {
                          navigateTo(currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`);
                        } else if (item.content) {
                          setPreviewItem(item);
                        }
                      }}
                      className={`flex flex-col items-center p-3 rounded-xl border text-center transition cursor-pointer group ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/80 text-white shadow-lg'
                          : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="group-hover:scale-105 transition-transform mb-1.5">
                        {getFileIcon(item)}
                      </div>
                      <span className="font-medium text-xs break-all line-clamp-2 text-slate-200 group-hover:text-white">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 font-mono">
                        {item.size}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List Mode */
              <div className="w-full">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Size</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Permissions</th>
                      <th className="py-2 px-3">Owner</th>
                      <th className="py-2 px-3">Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const isSelected = selectedItem?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          onDoubleClick={() => {
                            if (item.type === 'folder') {
                              navigateTo(currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`);
                            } else if (item.content) {
                              setPreviewItem(item);
                            }
                          }}
                          className={`border-b border-slate-800/50 cursor-pointer transition ${
                            isSelected ? 'bg-amber-500/20 text-white' : 'hover:bg-slate-800/40 text-slate-300'
                          }`}
                        >
                          <td className="py-2 px-3 flex items-center gap-2">
                            {item.type === 'folder' ? (
                              <Folder className="w-4 h-4 text-amber-400" />
                            ) : (
                              <File className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="font-medium">{item.name}</span>
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-400">{item.size}</td>
                          <td className="py-2 px-3 text-slate-400">{item.mime}</td>
                          <td className="py-2 px-3 font-mono text-amber-400/90">{item.permissions}</td>
                          <td className="py-2 px-3 font-mono text-slate-400">{item.owner}</td>
                          <td className="py-2 px-3 text-slate-400">{item.modified}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Status Bar */}
          <div className="h-7 px-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0 font-mono">
            <div>
              {items.length} items {selectedItem ? `(1 selected: ${selectedItem.name} — ${selectedItem.size})` : ''}
            </div>
            <div className="flex items-center gap-4">
              <span>Path: {currentPath}</span>
              {selectedItem?.content && (
                <button
                  onClick={() => setPreviewItem(selectedItem)}
                  className="text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  Preview File
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white">{previewItem.name}</span>
                <span className="text-slate-500">({previewItem.size})</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-slate-200 bg-slate-950">
              <pre className="whitespace-pre-wrap">{previewItem.content}</pre>
            </div>
            <div className="h-10 px-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Permissions: {previewItem.permissions} ({previewItem.owner})</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewItem.content || '');
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded flex items-center gap-1.5"
              >
                <Copy className="w-3 h-3" />
                Copy Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
