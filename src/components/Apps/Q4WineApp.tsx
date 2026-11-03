import React, { useState } from 'react';
import {
  Layers,
  HardDrive,
  Settings,
  Sliders,
  Play,
  RotateCw,
  Folder,
  FileCode,
  CheckCircle2,
  Trash2,
  Plus,
  Terminal,
  Shield,
  Zap,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface Q4WineAppProps {
  config: DistroConfiguration;
}

interface WinePrefix {
  id: string;
  name: string;
  path: string;
  arch: 'win64' | 'win32';
  winVer: string;
  size: string;
}

export const Q4WineApp: React.FC<Q4WineAppProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'programs' | 'drives' | 'overrides' | 'winetricks'>('programs');
  const [selectedPrefixId, setSelectedPrefixId] = useState<string>('default');
  const [runningApp, setRunningApp] = useState<string | null>(null);

  const prefixes: WinePrefix[] = [
    { id: 'default', name: 'Default Wine Prefix', path: '~/.wine', arch: 'win64', winVer: 'Windows 10', size: '1.8 GB' },
    { id: 'steam', name: 'Steam Proton Compatibility', path: '~/.local/share/Steam/compatdata', arch: 'win64', winVer: 'Windows 11', size: '14.2 GB' },
    { id: 'gaming', name: 'Lutris Custom Gaming', path: '~/.wine-gaming', arch: 'win64', winVer: 'Windows 10', size: '4.6 GB' },
    { id: 'legacy32', name: 'Legacy 32-bit Architecture', path: '~/.wine-legacy', arch: 'win32', winVer: 'Windows 7', size: '750 MB' },
  ];

  const currentPrefix = prefixes.find((p) => p.id === selectedPrefixId) || prefixes[0];

  const standardApps = [
    { id: 'winecfg', name: 'Wine Configuration (winecfg)', desc: 'Configure graphics, audio, and Windows version.', cmd: 'winecfg', icon: <Settings className="w-5 h-5 text-blue-400" /> },
    { id: 'regedit', name: 'Registry Editor (regedit)', desc: 'Direct registry modification (HKEY_LOCAL_MACHINE).', cmd: 'wine regedit', icon: <FileCode className="w-5 h-5 text-amber-400" /> },
    { id: 'winetricks', name: 'Winetricks GUI Helper', desc: 'Download DLLs, DirectX runtimes, and Visual C++ libraries.', cmd: 'winetricks --gui', icon: <Zap className="w-5 h-5 text-emerald-400" /> },
    { id: 'cmd', name: 'Wine Command Prompt (cmd)', desc: 'Windows command shell inside Wine virtual environment.', cmd: 'wine cmd', icon: <Terminal className="w-5 h-5 text-slate-300" /> },
    { id: 'taskmgr', name: 'Task Manager (taskmgr)', desc: 'Inspect Wine threads, PE processes, and memory consumption.', cmd: 'wine taskmgr', icon: <Sliders className="w-5 h-5 text-cyan-400" /> },
  ];

  const [dllOverrides, setDllOverrides] = useState([
    { name: 'd3d11', mode: 'native,builtin' },
    { name: 'dxgi', mode: 'native' },
    { name: 'd3d12', mode: 'native' },
    { name: 'd3d9', mode: 'native,builtin' },
    { name: 'wininet', mode: 'builtin,native' },
  ]);

  const [winetricksPackages, setWinetricksPackages] = useState([
    { id: 'dxvk', name: 'dxvk', desc: 'Vulkan-based translation layer for Direct3D 9/10/11', installed: true },
    { id: 'vkd3d', name: 'vkd3d', desc: 'Direct3D 12 to Vulkan translation library', installed: true },
    { id: 'vcrun2022', name: 'vcrun2022', desc: 'Visual C++ 2015-2022 Redistributable (x86 & x64)', installed: true },
    { id: 'dotnet48', name: 'dotnet48', desc: 'Microsoft .NET Framework 4.8 Runtime', installed: false },
    { id: 'corefonts', name: 'corefonts', desc: 'MS TrueType core fonts (Arial, Times, Courier)', installed: true },
    { id: 'physx', name: 'physx', desc: 'NVIDIA PhysX legacy runtime for game physics', installed: false },
  ]);

  const handleRunApp = (appId: string) => {
    setRunningApp(appId);
    setTimeout(() => {
      setRunningApp(null);
    }, 3000);
  };

  const handleToggleWinetrick = (pkgId: string) => {
    setWinetricksPackages((prev) =>
      prev.map((pkg) => (pkg.id === pkgId ? { ...pkg, installed: !pkg.installed } : pkg))
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 font-sans select-none overflow-hidden text-xs">
      {/* Top Menu / Header in Qt style */}
      <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm text-white">Q4Wine 1.3.13</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px]">Qt Wine Prefix Manager</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Wine Version:</span>
          <span className="font-mono text-emerald-400 font-bold">wine-9.21 (Staging)</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Prefixes Panel */}
        <div className="w-56 bg-slate-950/80 border-r border-slate-800 p-3 flex flex-col justify-between shrink-0">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Wine Prefixes (WINEPREFIX)
            </span>

            <div className="space-y-1">
              {prefixes.map((pfx) => (
                <button
                  key={pfx.id}
                  onClick={() => setSelectedPrefixId(pfx.id)}
                  className={`w-full p-2.5 rounded-lg border transition text-left flex flex-col gap-1 ${
                    selectedPrefixId === pfx.id
                      ? 'bg-blue-600/20 border-blue-500/80 text-white'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate">{pfx.name}</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                      {pfx.arch}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 truncate">{pfx.path}</span>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>{pfx.winVer}</span>
                    <span>{pfx.size}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => alert(`Created new prefix ~/.wine-custom (${currentPrefix.arch})`)}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Wine Prefix</span>
          </button>
        </div>

        {/* Central Configuration View */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
          {/* Tabs */}
          <div className="h-9 px-4 bg-slate-950 border-b border-slate-800 flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('programs')}
              className={`hover:text-white transition ${activeTab === 'programs' ? 'text-amber-400 border-b-2 border-amber-400 pb-2 mt-2' : 'text-slate-400'}`}
            >
              Programs & Tools
            </button>
            <button
              onClick={() => setActiveTab('drives')}
              className={`hover:text-white transition ${activeTab === 'drives' ? 'text-amber-400 border-b-2 border-amber-400 pb-2 mt-2' : 'text-slate-400'}`}
            >
              Drive Mappings
            </button>
            <button
              onClick={() => setActiveTab('overrides')}
              className={`hover:text-white transition ${activeTab === 'overrides' ? 'text-amber-400 border-b-2 border-amber-400 pb-2 mt-2' : 'text-slate-400'}`}
            >
              DLL Overrides
            </button>
            <button
              onClick={() => setActiveTab('winetricks')}
              className={`hover:text-white transition ${activeTab === 'winetricks' ? 'text-amber-400 border-b-2 border-amber-400 pb-2 mt-2' : 'text-slate-400'}`}
            >
              Winetricks Components
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Tab 1: Programs & Wine Tools */}
            {activeTab === 'programs' && (
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    Core Utilities for {currentPrefix.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Arch: {currentPrefix.arch} • Mode: {currentPrefix.winVer}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {standardApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                          {app.icon}
                        </div>
                        <div>
                          <span className="font-bold text-white block text-xs">{app.name}</span>
                          <span className="text-[11px] text-slate-400">{app.desc}</span>
                          <span className="text-[10px] font-mono text-amber-400/90 block mt-0.5">
                            $ WINEPREFIX={currentPrefix.path} {app.cmd}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRunApp(app.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                          runningApp === app.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{runningApp === app.id ? 'Running...' : 'Execute'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Drives */}
            {activeTab === 'drives' && (
              <div className="space-y-4 max-w-3xl">
                <span className="font-bold text-white text-xs uppercase tracking-wider block">
                  Virtual DOS / Windows Drives
                </span>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                    <div>
                      <strong className="text-amber-400 text-sm">C:\</strong>
                      <span className="text-slate-400 ml-2">→ {currentPrefix.path}/drive_c</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Fixed Disk (NTFS Emulated)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                    <div>
                      <strong className="text-amber-400 text-sm">D:\</strong>
                      <span className="text-slate-400 ml-2">→ /media/developer/cdrom</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Optical Disc Drive</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                    <div>
                      <strong className="text-amber-400 text-sm">Z:\</strong>
                      <span className="text-slate-400 ml-2">→ / (Linux Root Filesystem)</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Root Mapping</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: DLL Overrides */}
            {activeTab === 'overrides' && (
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    DirectX & Win32 DLL Overrides
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Enforces native Vulkan translation (DXVK/VKD3D)
                  </span>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 pb-2">
                        <th className="py-1">Library Name</th>
                        <th className="py-1">Load Order</th>
                        <th className="py-1 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dllOverrides.map((dll) => (
                        <tr key={dll.name} className="border-b border-slate-800/40">
                          <td className="py-2 text-white font-bold">{dll.name}.dll</td>
                          <td className="py-2 text-amber-400">{dll.mode}</td>
                          <td className="py-2 text-right text-emerald-400">Active</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Winetricks */}
            {activeTab === 'winetricks' && (
              <div className="space-y-4 max-w-3xl">
                <span className="font-bold text-white text-xs uppercase tracking-wider block">
                  Winetricks Package Installer
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {winetricksPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleToggleWinetrick(pkg.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        pkg.installed
                          ? 'bg-slate-950 border-emerald-500/60 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                          <span>{pkg.name}</span>
                          {pkg.installed && <span className="text-emerald-400 text-[10px] font-mono">[Installed]</span>}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{pkg.desc}</p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs ${
                          pkg.installed ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700'
                        }`}
                      >
                        {pkg.installed ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
