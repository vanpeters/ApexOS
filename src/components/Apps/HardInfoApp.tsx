import React, { useState } from 'react';
import {
  Cpu,
  Monitor,
  HardDrive,
  Activity,
  Layers,
  Zap,
  Info,
  Server,
  Microchip,
  Thermometer,
  Award,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface HardInfoAppProps {
  config: DistroConfiguration;
}

export const HardInfoApp: React.FC<HardInfoAppProps> = ({ config }) => {
  const [activeCategory, setActiveCategory] = useState<'summary' | 'processor' | 'memory' | 'graphics' | 'benchmarks'>('summary');

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans select-none text-xs">
      {/* Top Header */}
      <div className="h-10 px-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/80 rounded border border-slate-700/80 text-white font-semibold">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>HardInfo 0.6 — System Profiler and Benchmark</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px]">{config.hostname}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Kernel: <strong className="text-slate-200">6.11.0-xanmod</strong></span>
          <span aria-hidden="true">·</span>
          <span>Arch: <strong className="text-slate-200">{config.architecture}</strong></span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-56 bg-slate-950/80 border-r border-slate-800 p-2 flex flex-col justify-between shrink-0">
          <div className="space-y-3">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Computer Profile
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveCategory('summary')}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition ${
                    activeCategory === 'summary'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span>System Summary</span>
                </button>
                <button
                  onClick={() => setActiveCategory('processor')}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition ${
                    activeCategory === 'processor'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>Processor (CPU)</span>
                </button>
                <button
                  onClick={() => setActiveCategory('memory')}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition ${
                    activeCategory === 'memory'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Memory & ZRAM</span>
                </button>
                <button
                  onClick={() => setActiveCategory('graphics')}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition ${
                    activeCategory === 'graphics'
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-rose-400" />
                  <span>Display & Mesa GPU</span>
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Benchmarks
              </div>
              <button
                onClick={() => setActiveCategory('benchmarks')}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded transition ${
                  activeCategory === 'benchmarks'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Performance Benchmarks</span>
              </button>
            </div>
          </div>

          <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-400">
            HardInfo Hardware Prober active via sysfs.
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Summary Tab */}
          {activeCategory === 'summary' && (
            <div className="space-y-4 max-w-4xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">System Summary</h3>
                <p className="text-slate-400 mt-0.5">Overview of hardware configuration on {config.distroName}.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-cyan-400" />
                    Operating System
                  </span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Distribution:</span>
                      <span className="text-white font-medium">{config.distroName}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Ubuntu Base:</span>
                      <span>24.04.1 LTS ({config.codename})</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Kernel:</span>
                      <span className="text-amber-400">{config.kernelVariant}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Desktop:</span>
                      <span>GNOME 47.0 (Wayland)</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">Installed Daemons:</span>
                      <span className="text-emerald-400">Apache2, GameMode, KVM</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    Host Hardware
                  </span>
                  <div className="space-y-1 font-mono text-[11px] text-slate-300">
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Processor:</span>
                      <span className="text-white font-medium">AMD Ryzen 9 7950X3D (32)</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Memory (RAM):</span>
                      <span>32,140 MB DDR5-6000</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">ZRAM Swap:</span>
                      <span className="text-emerald-400">16,384 MB (ZSTD Compressed)</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-800">
                      <span className="text-slate-400">Graphics:</span>
                      <span>AMD Radeon RX 7900 XTX (24 GB)</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-400">Mesa Driver PPA:</span>
                      <span className="text-amber-400">Kisak Mesa 24.3.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processor Tab */}
          {activeCategory === 'processor' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Processor Architecture</h3>
                <p className="text-slate-400 mt-0.5">Detailed x86_64 CPU flags and hardware virtualization.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Model Name:</span>
                  <span className="text-white font-bold">AMD Ryzen 9 7950X3D 16-Core Processor</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Cores / Threads:</span>
                  <span>16 Cores / 32 Threads</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Clock Frequency:</span>
                  <span>4200.00 MHz (Max Turbo: 5700.00 MHz)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">L3 Cache:</span>
                  <span className="text-amber-400">128 MB (3D V-Cache Technology)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Virtualization:</span>
                  <span className="text-emerald-400 font-bold">AMD-V (KVM enabled for Android Studio)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Governor:</span>
                  <span className="text-cyan-400 font-medium">schedutil (GameMode performance override)</span>
                </div>
              </div>
            </div>
          )}

          {/* Memory Tab */}
          {activeCategory === 'memory' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Memory & ZRAM Swap</h3>
                <p className="text-slate-400 mt-0.5">Dual-channel DDR5 and kernel ZRAM allocation.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Physical RAM:</span>
                  <span className="text-white font-bold">32,140 MB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Used Memory:</span>
                  <span className="text-emerald-400">4,812 MB (15%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">ZRAM Device (/dev/zram0):</span>
                  <span className="text-amber-400 font-bold">16,384 MB (ZSTD Algorithm)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Swappiness:</span>
                  <span>10 (Optimized for gaming responsiveness)</span>
                </div>
              </div>
            </div>
          )}

          {/* Graphics Tab */}
          {activeCategory === 'graphics' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Display & Mesa Vulkan GPU</h3>
                <p className="text-slate-400 mt-0.5">Mesa graphics pipeline from Kisak Launchpad PPA.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Vulkan Driver:</span>
                  <span className="text-emerald-400 font-bold">RADV (Radeon Vulkan 1.3.296)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Mesa Version:</span>
                  <span className="text-amber-400">Mesa 24.3.0-kisak1~noble</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">DirectX Translation:</span>
                  <span>DXVK 2.4.1 & VKD3D-Proton 2.13 (Lutris)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Resolution & Refresh:</span>
                  <span>2560x1440 @ 144Hz (Adaptive Sync / VRR active)</span>
                </div>
              </div>
            </div>
          )}

          {/* Benchmarks Tab */}
          {activeCategory === 'benchmarks' && (
            <div className="space-y-5 max-w-4xl">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Performance Benchmarks</h3>
                <p className="text-slate-400 mt-0.5">Comparative CPU & Gaming translation throughput (Lower is faster).</p>
              </div>

              {/* Benchmark 1: CPU Blowfish */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">CPU Blowfish Multi-thread (Seconds)</span>
                  <span className="text-emerald-400 font-mono font-bold">1.24s (ApexOS 6.11 Xanmod)</span>
                </div>
                <div className="space-y-1.5 pt-1 text-[11px] font-mono">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span className="text-emerald-300 font-semibold">{config.distroName} (XanMod)</span>
                      <span>1.24s</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[25%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Standard Ubuntu 24.04 (Generic 6.8)</span>
                      <span>1.52s</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-700 rounded-full w-[38%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Windows 11 (23H2)</span>
                      <span>1.78s</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-800 rounded-full w-[52%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benchmark 2: Vulkan Compute */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Vulkan Compute Shader Processing (Frames/Sec)</span>
                  <span className="text-amber-400 font-mono font-bold">285 FPS (Kisak Mesa 24.3)</span>
                </div>
                <div className="space-y-1.5 pt-1 text-[11px] font-mono">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span className="text-amber-300 font-semibold">{config.distroName} (Kisak PPA)</span>
                      <span>285 FPS</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[95%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-0.5">
                      <span>Default Ubuntu Mesa 24.0</span>
                      <span>232 FPS</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-700 rounded-full w-[76%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
