import React, { useState, useEffect, useMemo } from 'react';
import {
  Cpu,
  Activity,
  Gauge,
  Flame,
  Zap,
  HardDrive,
  RefreshCw,
  Sliders,
  Download,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Layers,
  Search,
  XCircle,
  Info,
  Fan,
  Thermometer,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  ShieldCheck,
  Check,
  Copy,
  Terminal,
  ArrowDownRight,
  ArrowUpRight,
  Power,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface SystemDashboardAppProps {
  config: DistroConfiguration;
}

interface ProcessItem {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memMb: number;
  status: 'running' | 'sleeping';
  priority: number;
}

const INITIAL_PROCESSES: ProcessItem[] = [
  { pid: 1420, name: 'gnome-shell', user: 'developer', cpu: 4.8, memMb: 412, status: 'running', priority: 0 },
  { pid: 2154, name: 'code', user: 'developer', cpu: 6.2, memMb: 680, status: 'running', priority: 0 },
  { pid: 3108, name: 'lutris', user: 'developer', cpu: 2.1, memMb: 245, status: 'sleeping', priority: 0 },
  { pid: 3490, name: 'steam.exe (proton)', user: 'developer', cpu: 14.5, memMb: 1420, status: 'running', priority: -2 },
  { pid: 4012, name: 'android-studio', user: 'developer', cpu: 8.9, memMb: 1850, status: 'running', priority: 0 },
  { pid: 4520, name: 'claude-desktop', user: 'developer', cpu: 1.4, memMb: 320, status: 'sleeping', priority: 0 },
  { pid: 4890, name: 'chatgpt-desktop', user: 'developer', cpu: 1.1, memMb: 290, status: 'sleeping', priority: 0 },
  { pid: 1120, name: 'pipewire-pulse', user: 'developer', cpu: 0.8, memMb: 48, status: 'running', priority: -11 },
  { pid: 820, name: 'gamemoded', user: 'root', cpu: 0.2, memMb: 16, status: 'sleeping', priority: -5 },
  { pid: 1, name: 'systemd', user: 'root', cpu: 0.1, memMb: 24, status: 'sleeping', priority: 0 },
];

export const SystemDashboardApp: React.FC<SystemDashboardAppProps> = ({ config }) => {
  const [isLive, setIsLive] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(1000);
  const [uptimeSeconds, setUptimeSeconds] = useState(14830); // ~4 hours
  const [searchProcess, setSearchProcess] = useState('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'cpu' | 'memory' | 'gpu' | 'battery' | 'processes'>('overview');

  // Real-time fluctuating metrics
  const [cpuUsage, setCpuUsage] = useState(24.5);
  const [cpuCores, setCpuCores] = useState<number[]>([22, 35, 18, 42, 14, 29, 38, 20]);
  const [cpuHistory, setCpuHistory] = useState<number[]>([18, 20, 22, 25, 21, 28, 30, 26, 24, 25]);
  const [cpuFreqGHz, setCpuFreqGHz] = useState(4.42);
  const [cpuTemp, setCpuTemp] = useState(54);

  // RAM
  const totalRamGb = 32.0;
  const [usedRamGb, setUsedRamGb] = useState(10.4);
  const [cacheRamGb, setCacheRamGb] = useState(5.8);

  // GPU
  const [gpuLoad, setGpuLoad] = useState(38);
  const [gpuTemp, setGpuTemp] = useState(58);
  const [gpuHotspotTemp, setGpuHotspotTemp] = useState(67);
  const [gpuFanSpeedRpm, setGpuFanSpeedRpm] = useState(1420);
  const [gpuFanPct, setGpuFanPct] = useState(48);
  const [gpuPowerWatts, setGpuPowerWatts] = useState(165);
  const [gpuVramUsedGb, setGpuVramUsedGb] = useState(7.4);
  const totalVramGb = 24.0;

  // Battery & Power Supply (/sys/class/power_supply/BAT0/)
  const [batteryPercent, setBatteryPercent] = useState<number>(88.4);
  const [batteryStatus, setBatteryStatus] = useState<'Discharging' | 'Charging' | 'Full'>('Discharging');
  const [batteryWatts, setBatteryWatts] = useState<number>(14.18);
  const [batteryHistory, setBatteryHistory] = useState<number[]>([13.2, 13.8, 14.2, 14.0, 14.5, 13.9, 14.2, 14.6, 14.1, 14.2]);
  const [batteryVoltageV, setBatteryVoltageV] = useState<number>(15.42);
  const [batteryTempC, setBatteryTempC] = useState<number>(31.4);
  const [batteryChargeLimit, setBatteryChargeLimit] = useState<number>(80);
  const [powerProfile, setPowerProfile] = useState<'power-saver' | 'balanced' | 'performance'>('balanced');
  const [copiedSysfsNode, setCopiedSysfsNode] = useState<string | null>(null);

  // Battery Specs for /sys/class/power_supply/BAT0/
  const energyFullDesignWh = 80.0; // 80,000,000 uWh (Factory Design)
  const energyFullWh = 74.4; // 74,400,000 uWh (Full Charge Ceiling)
  const batteryCycleCount = 142;
  const batteryTechnology = 'Li-poly';
  const batteryManufacturer = 'SMP-LGC';
  const batteryModel = 'L21M4PC1-APEX';

  // Battery Wear Level: (1 - energyFullWh / energyFullDesignWh) * 100
  const batteryWearPct = +(((energyFullDesignWh - energyFullWh) / energyFullDesignWh) * 100).toFixed(1); // 7.0%
  const batteryHealthPct = +(100 - batteryWearPct).toFixed(1); // 93.0%
  const energyNowWh = +((batteryPercent / 100) * energyFullWh).toFixed(2);
  const batteryCurrentA = +(batteryWatts / Math.max(batteryVoltageV, 1)).toFixed(2);

  // Processes
  const [processes, setProcesses] = useState<ProcessItem[]>(INITIAL_PROCESSES);

  // Uptime ticker
  useEffect(() => {
    const t = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Live telemetry polling
  useEffect(() => {
    if (!isLive) return;

    const timer = setInterval(() => {
      // Fluctuate CPU
      setCpuUsage((prev) => {
        const delta = (Math.random() - 0.48) * 8;
        const next = Math.max(8, Math.min(94, +(prev + delta).toFixed(1)));
        setCpuHistory((hist) => [...hist.slice(-24), next]);
        return next;
      });

      // Core loads
      setCpuCores((prev) =>
        prev.map((c) => {
          const delta = (Math.random() - 0.5) * 12;
          return Math.max(5, Math.min(98, Math.round(c + delta)));
        })
      );

      // CPU temp & Freq
      setCpuTemp((prev) => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(42, Math.min(84, Math.round(prev + delta)));
      });
      setCpuFreqGHz((prev) => {
        const delta = (Math.random() - 0.5) * 0.15;
        return +(Math.max(3.2, Math.min(5.4, prev + delta))).toFixed(2);
      });

      // RAM
      setUsedRamGb((prev) => {
        const delta = (Math.random() - 0.5) * 0.15;
        return +(Math.max(6.5, Math.min(28.0, prev + delta))).toFixed(2);
      });

      // GPU Telemetry
      setGpuLoad((prev) => {
        const delta = (Math.random() - 0.48) * 10;
        return Math.max(12, Math.min(99, Math.round(prev + delta)));
      });
      setGpuTemp((prev) => {
        const delta = (Math.random() - 0.5) * 1.5;
        return Math.max(40, Math.min(88, Math.round(prev + delta)));
      });
      setGpuHotspotTemp((prev) => {
        const delta = (Math.random() - 0.5) * 1.8;
        return Math.max(48, Math.min(96, Math.round(prev + delta)));
      });
      setGpuFanSpeedRpm((prev) => {
        const delta = (Math.random() - 0.5) * 60;
        return Math.max(900, Math.min(2800, Math.round(prev + delta)));
      });
      setGpuFanPct((prev) => {
        const delta = (Math.random() - 0.5) * 3;
        return Math.max(30, Math.min(100, Math.round(prev + delta)));
      });
      setGpuPowerWatts((prev) => {
        const delta = (Math.random() - 0.5) * 12;
        return Math.max(65, Math.min(430, Math.round(prev + delta)));
      });
      setGpuVramUsedGb((prev) => {
        const delta = (Math.random() - 0.5) * 0.1;
        return +(Math.max(4.0, Math.min(22.0, prev + delta))).toFixed(2);
      });

      // Fluctuate top process CPU
      setProcesses((prev) =>
        prev.map((proc) => {
          if (proc.status === 'sleeping') return proc;
          const jitter = (Math.random() - 0.5) * 2.5;
          return {
            ...proc,
            cpu: +(Math.max(0.1, Math.min(65.0, proc.cpu + jitter))).toFixed(1),
          };
        })
      );

      // Battery / BAT0 power draw fluctuations
      setBatteryWatts((prev) => {
        const base = powerProfile === 'power-saver' ? 9.2 : powerProfile === 'performance' ? 24.5 : 13.8;
        const cpuFactor = (cpuUsage / 100) * 7.5;
        const gpuFactor = (gpuLoad / 100) * 9.0;
        const jitter = (Math.random() - 0.5) * 1.2;
        const activeDischarge = +(base + cpuFactor + gpuFactor + jitter).toFixed(2);
        const finalW = batteryStatus === 'Charging' ? +(-35.0 + (Math.random() - 0.5) * 3).toFixed(2) : Math.max(6.5, activeDischarge);
        setBatteryHistory((hist) => [...hist.slice(-24), Math.abs(finalW)]);
        return finalW;
      });

      setBatteryPercent((prev) => {
        if (batteryStatus === 'Charging') {
          return +(Math.min(batteryChargeLimit, prev + 0.05)).toFixed(1);
        } else {
          return +(Math.max(4.0, prev - 0.01)).toFixed(1);
        }
      });

      setBatteryVoltageV(() => +(15.38 + (Math.random() - 0.5) * 0.08).toFixed(2));
      setBatteryTempC(() => +(31.2 + (Math.random() - 0.5) * 0.4).toFixed(1));
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [isLive, refreshInterval, powerProfile, batteryStatus, batteryChargeLimit, cpuUsage, gpuLoad]);

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  const freeRamGb = +(totalRamGb - usedRamGb - cacheRamGb).toFixed(2);
  const usedRamPct = Math.round((usedRamGb / totalRamGb) * 100);
  const cacheRamPct = Math.round((cacheRamGb / totalRamGb) * 100);
  const freeRamPct = Math.max(0, 100 - usedRamPct - cacheRamPct);

  // Terminate or nice simulated process
  const killProcess = (pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  };

  const handleExportSnapshot = () => {
    const snapshot = {
      timestamp: new Date().toISOString(),
      distro: config.distroName,
      kernel: config.kernelVariant,
      uptime: formatUptime(uptimeSeconds),
      cpu: {
        usagePercent: cpuUsage,
        frequencyGHz: cpuFreqGHz,
        temperatureC: cpuTemp,
        cores: cpuCores,
      },
      ram: {
        totalGb: totalRamGb,
        usedGb: usedRamGb,
        cachedGb: cacheRamGb,
        freeGb: freeRamGb,
        zramEnabled: config.enableZram,
      },
      gpu: {
        model: 'NVIDIA GeForce RTX 4090 (Kisak Mesa 24.3 / Vulkan)',
        loadPercent: gpuLoad,
        coreTempC: gpuTemp,
        hotspotTempC: gpuHotspotTemp,
        fanRpm: gpuFanSpeedRpm,
        powerWatts: gpuPowerWatts,
        vramUsedGb: gpuVramUsedGb,
        vramTotalGb: totalVramGb,
      },
      battery: {
        deviceNode: '/sys/class/power_supply/BAT0/',
        chargePercentage: batteryPercent,
        status: batteryStatus,
        dischargeRateWatts: batteryWatts,
        voltageV: batteryVoltageV,
        currentA: batteryCurrentA,
        energyFullDesignWh: energyFullDesignWh,
        energyFullWh: energyFullWh,
        energyNowWh: energyNowWh,
        wearLevelPercent: batteryWearPct,
        healthPercent: batteryHealthPct,
        cycleCount: batteryCycleCount,
        temperatureC: batteryTempC,
        manufacturer: batteryManufacturer,
        modelName: batteryModel,
        technology: batteryTechnology,
      },
      topProcesses: processes.slice(0, 5),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `apexos-hardware-metrics-${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const filteredProcesses = useMemo(() => {
    return processes.filter(
      (p) =>
        p.name.toLowerCase().includes(searchProcess.toLowerCase()) ||
        p.user.toLowerCase().includes(searchProcess.toLowerCase()) ||
        p.pid.toString().includes(searchProcess)
    );
  }, [processes, searchProcess]);

  // Color helper for temperatures
  const getTempColor = (t: number) => {
    if (t < 50) return 'text-emerald-400';
    if (t < 72) return 'text-amber-400';
    return 'text-red-400 animate-pulse';
  };

  // Sparkline generator for CPU
  const maxHistory = Math.max(100, ...cpuHistory);
  const minHistory = 0;
  const sparkPoints = cpuHistory
    .map((val, idx) => {
      const x = (idx / (cpuHistory.length - 1)) * 180;
      const y = 45 - ((val - minHistory) / (maxHistory - minHistory || 1)) * 40;
      return `${x},${y}`;
    })
    .join(' ');

  // Sparkline generator for Battery Discharge Rate (Watts)
  const maxBatHistory = Math.max(35, ...batteryHistory);
  const minBatHistory = 0;
  const batterySparkPoints = batteryHistory
    .map((val, idx) => {
      const x = (idx / (batteryHistory.length - 1)) * 180;
      const y = 45 - ((val - minBatHistory) / (maxBatHistory - minBatHistory || 1)) * 40;
      return `${x},${y}`;
    })
    .join(' ');

  // Time remaining string calculation
  const timeRemainingHours = batteryWatts > 0 ? energyNowWh / Math.abs(batteryWatts) : 0;
  const timeRemainingMins = Math.round(timeRemainingHours * 60);
  const timeRemainingStr =
    batteryStatus === 'Charging'
      ? `${Math.max(1, Math.floor(((energyFullWh - energyNowWh) / Math.max(Math.abs(batteryWatts), 1)) * 60))}m until full`
      : `${Math.floor(timeRemainingMins / 60)}h ${timeRemainingMins % 60}m remaining`;

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Header / Control Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">ApexOS Real-Time System Dashboard</h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              {config.distroName} • {config.kernelVariant} • Uptime: {formatUptime(uptimeSeconds)}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
              isLive
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isLive ? 'Pause' : 'Resume'}</span>
          </button>

          {/* Polling Rate */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-md px-2 py-0.5 text-xs text-slate-300">
            <RefreshCw className={`w-3 h-3 text-slate-400 mr-1.5 ${isLive ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              <option value={500} className="bg-slate-900">500ms</option>
              <option value={1000} className="bg-slate-900">1.0s</option>
              <option value={2000} className="bg-slate-900">2.0s</option>
            </select>
          </div>

          {/* Export JSON */}
          <button
            onClick={handleExportSnapshot}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-md text-xs font-semibold transition"
            title="Export metrics snapshot as JSON"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Export Metrics</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 px-4 py-1.5 bg-slate-900/60 border-b border-slate-800/80 text-xs font-medium shrink-0 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'battery', label: 'Battery & BAT0', icon: <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> },
          { id: 'cpu', label: 'CPU Cores', icon: <Cpu className="w-3.5 h-3.5" /> },
          { id: 'memory', label: 'RAM & ZRAM', icon: <HardDrive className="w-3.5 h-3.5" /> },
          { id: 'gpu', label: 'GPU & Thermals', icon: <Flame className="w-3.5 h-3.5" /> },
          { id: 'processes', label: 'Processes', icon: <Activity className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
              selectedTab === tab.id
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Top 4 Metric Cards: CPU, RAM, GPU, Battery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: CPU Total Load */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-300">Processor (CPU)</span>
                  <div className="text-[10px] text-slate-500 font-mono">16 Cores • {cpuFreqGHz} GHz</div>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold ${getTempColor(cpuTemp)}`}>
                {cpuTemp}°C
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-white">{cpuUsage}%</span>
                <span className="text-xs text-slate-400 font-mono">Gov: performance</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    cpuUsage > 80 ? 'bg-red-500' : cpuUsage > 50 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${cpuUsage}%` }}
                ></div>
              </div>
            </div>

            {/* Sparkline Canvas */}
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Load History (30s)</span>
              <svg className="w-24 h-6 overflow-visible" viewBox="0 0 180 50">
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sparkPoints}
                />
              </svg>
            </div>
          </div>

          {/* Card 2: Memory (RAM) & ZRAM */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-300">Memory (RAM)</span>
                  <div className="text-[10px] text-slate-500 font-mono">DDR5 @ 6000 MT/s</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {config.enableZram ? 'ZRAM Active' : 'Swap Active'}
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-white">{usedRamGb} GB</span>
                <span className="text-xs text-slate-400 font-mono">of {totalRamGb} GB ({usedRamPct}%)</span>
              </div>

              {/* Stacked Memory Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${usedRamPct}%` }}
                  title={`Used: ${usedRamGb} GB`}
                ></div>
                <div
                  className="bg-amber-500/70 h-full transition-all duration-300"
                  style={{ width: `${cacheRamPct}%` }}
                  title={`Cached/Buffers: ${cacheRamGb} GB`}
                ></div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Free: {freeRamGb} GB</span>
              <span>Cache: {cacheRamGb} GB</span>
              <span>ZRAM: 2.9x ratio</span>
            </div>
          </div>

          {/* Card 3: GPU & Thermals */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-300">Graphics (GPU)</span>
                  <div className="text-[10px] text-slate-500 font-mono">RTX 4090 • Kisak Mesa</div>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold ${getTempColor(gpuTemp)}`}>
                {gpuTemp}°C Core
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-white">{gpuLoad}%</span>
                <span className="text-xs text-slate-400 font-mono">{gpuPowerWatts}W / 450W</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    gpuLoad > 80 ? 'bg-red-500' : gpuLoad > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${gpuLoad}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Fan className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '2s' }} />
                {gpuFanSpeedRpm} RPM ({gpuFanPct}%)
              </span>
              <span>VRAM: {gpuVramUsedGb}/{totalVramGb} GB</span>
            </div>
          </div>

          {/* Card 4: Battery Health & Discharge (/sys/class/power_supply/BAT0/) */}
          <div
            onClick={() => setSelectedTab('battery')}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition relative overflow-hidden flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                  {batteryStatus === 'Charging' ? (
                    <BatteryCharging className="w-4 h-4 animate-pulse" />
                  ) : batteryPercent > 50 ? (
                    <BatteryFull className="w-4 h-4" />
                  ) : (
                    <BatteryMedium className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    Battery (BAT0)
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {batteryManufacturer} • {energyFullWh} Wh
                  </div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {batteryHealthPct}% Health
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline justify-between mb-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono tracking-tight text-white">
                    {batteryPercent}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    {batteryStatus === 'Charging' ? '+Charging' : 'Discharging'}
                  </span>
                </div>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  {Math.abs(batteryWatts)} W
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    batteryPercent > 50
                      ? 'bg-emerald-500'
                      : batteryPercent > 20
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${batteryPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Sparkline Canvas & Wear Level */}
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="text-slate-400">
                Wear: <strong className="text-white">{batteryWearPct}%</strong> ({batteryCycleCount}c)
              </span>
              <span className="text-emerald-400 group-hover:underline flex items-center gap-1">
                <span>BAT0 Details</span>
                <span>→</span>
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Sections Based on Selected Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            {/* Multi-core CPU Matrix */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Core Allocation Matrix (Physical & SMT Threads)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Kernel Variant: {config.kernelVariant}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
                {cpuCores.map((load, index) => (
                  <div
                    key={index}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800/90 flex flex-col items-center gap-1 text-center"
                  >
                    <span className="text-[10px] font-mono text-slate-400">Core #{index}</span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        load > 80 ? 'text-red-400' : load > 50 ? 'text-amber-400' : 'text-blue-400'
                      }`}
                    >
                      {load}%
                    </span>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full ${
                          load > 80 ? 'bg-red-500' : load > 50 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${load}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Process Snapshot & System Spec Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ZRAM & Virtualization Stats */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Distro Kernel Features
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>ZRAM Memory Compression</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                        config.enableZram
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {config.enableZram ? 'Enabled (zstd algorithm)' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-cyan-400" />
                      <span>KVM Hardware Virtualization</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                        config.enableKvmVirtualization
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {config.enableKvmVirtualization ? 'Active (/dev/kvm ready)' : 'Disabled'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-purple-400" />
                      <span>Feral Interactive GameMode</span>
                    </div>
                    <span
                      className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                        config.enableGamemode
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {config.enableGamemode ? 'gamemoded Daemon On' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Active Tasks Snapshot */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      High Load Processes
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedTab('processes')}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  {processes.slice(0, 4).map((proc) => (
                    <div
                      key={proc.pid}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px]">#{proc.pid}</span>
                        <span className="font-semibold text-slate-200">{proc.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">{proc.memMb} MB</span>
                        <span
                          className={`font-bold ${
                            proc.cpu > 10 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {proc.cpu}% CPU
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CPU Detailed Tab */}
        {selectedTab === 'cpu' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Central Processing Unit Diagnostics</h3>
                  <p className="text-xs text-slate-400">AMD Ryzen 9 7950X3D 16-Core Processor (x86_64 AVX-512)</p>
                </div>
                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-mono text-xs border border-blue-500/40">
                  {cpuFreqGHz} GHz Real-time Frequency
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">CPU Governor</span>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">performance (XanMod)</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Core Temperature</span>
                  <div className={`text-sm font-bold mt-0.5 font-mono ${getTempColor(cpuTemp)}`}>
                    {cpuTemp}°C (Tctl/Tdie)
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">L3 3D V-Cache</span>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">128 MB Stacked</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Virtualization (KVM)</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">AMD-V Enabled</div>
                </div>
              </div>

              {/* Per-Core Live Gauges */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-slate-300">Individual Core Load Progression</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cpuCores.map((load, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">Core {i} (vCPU {i * 2} / {i * 2 + 1})</span>
                        <span className={load > 80 ? 'text-red-400 font-bold' : 'text-blue-400 font-bold'}>
                          {load}% • {cpuFreqGHz} GHz
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${
                            load > 80 ? 'bg-red-500' : load > 50 ? 'bg-amber-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${load}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Memory Tab */}
        {selectedTab === 'memory' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">System Memory & ZRAM Compression</h3>
                  <p className="text-xs text-slate-400">Physical DDR5 6000MHz Dual-Channel + Linux in-kernel ZRAM Swap</p>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs border border-emerald-500/40">
                  {totalRamGb} GB Total Capacity
                </span>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Active Memory</span>
                  <div className="text-base font-bold text-white mt-0.5 font-mono">{usedRamGb} GB</div>
                  <span className="text-[10px] text-slate-400">Used by applications & GUI</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Page Cache & Buffers</span>
                  <div className="text-base font-bold text-amber-400 mt-0.5 font-mono">{cacheRamGb} GB</div>
                  <span className="text-[10px] text-slate-400">Cached disk I/O for instant load</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Available Free RAM</span>
                  <div className="text-base font-bold text-emerald-400 mt-0.5 font-mono">{freeRamGb} GB</div>
                  <span className="text-[10px] text-slate-400">Immediately assignable memory</span>
                </div>
              </div>

              {/* ZRAM Spec Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      ZRAM Block Device Telemetry (/dev/zram0)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Algorithm: Zstandard (zstd)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px]">Disksize:</span>
                    <div className="text-slate-200 font-bold">8.00 GB</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Orig Data Stored:</span>
                    <div className="text-slate-200 font-bold">4.82 GB</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Compr RAM Used:</span>
                    <div className="text-emerald-400 font-bold">1.64 GB</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Net RAM Saved:</span>
                    <div className="text-emerald-400 font-bold">+3.18 GB (2.94x)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GPU & Thermals Tab */}
        {selectedTab === 'gpu' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Dedicated GPU Accelerators & Thermals</h3>
                  <p className="text-xs text-slate-400">NVIDIA GeForce RTX 4090 24GB • Kisak Mesa 24.3 & Vulkan 1.3</p>
                </div>
                <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/40">
                  Vulkan Driver Active
                </span>
              </div>

              {/* Thermal gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">GPU Core Temp</span>
                    <div className={`text-xl font-bold font-mono ${getTempColor(gpuTemp)}`}>{gpuTemp}°C</div>
                    <span className="text-[10px] text-slate-400">Target limit: 83°C</span>
                  </div>
                  <Thermometer className={`w-8 h-8 ${getTempColor(gpuTemp)}`} />
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Hotspot / Junction</span>
                    <div className={`text-xl font-bold font-mono ${getTempColor(gpuHotspotTemp)}`}>{gpuHotspotTemp}°C</div>
                    <span className="text-[10px] text-slate-400">Maximum: 95°C</span>
                  </div>
                  <Flame className={`w-8 h-8 ${getTempColor(gpuHotspotTemp)}`} />
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Fan RPM & Speed</span>
                    <div className="text-xl font-bold font-mono text-cyan-400">{gpuFanSpeedRpm} RPM</div>
                    <span className="text-[10px] text-slate-400">Profile: Auto Curve ({gpuFanPct}%)</span>
                  </div>
                  <Fan className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '1.5s' }} />
                </div>
              </div>

              {/* VRAM Utilization */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Video Memory (VRAM) Allocation</span>
                  <span className="text-amber-400 font-bold">{gpuVramUsedGb} GB / {totalVramGb} GB</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${(gpuVramUsedGb / totalVramGb) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>DXVK / VKD3D Pipeline Cache: 2.1 GB</span>
                  <span>GDDR6X Bandwidth: 1,008 GB/s</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Battery Health & Sysfs BAT0 Tab */}
        {selectedTab === 'battery' && (
          <div className="space-y-4">
            {/* Battery Header & Quick Actions */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  {batteryStatus === 'Charging' ? (
                    <BatteryCharging className="w-6 h-6 animate-pulse" />
                  ) : (
                    <BatteryFull className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-wide">
                      Battery Health & Power Supply (/sys/class/power_supply/BAT0/)
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {batteryHealthPct}% Health
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Device: {batteryManufacturer} {batteryModel} • Chemistry: {batteryTechnology} • {energyFullWh} Wh / {energyFullDesignWh} Wh
                  </p>
                </div>
              </div>

              {/* AC Adapter Toggle Simulation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setBatteryStatus((prev) => (prev === 'Charging' ? 'Discharging' : 'Charging'));
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1.5 transition ${
                    batteryStatus === 'Charging'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
                  }`}
                  title="Toggle between AC wall power and battery power"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{batteryStatus === 'Charging' ? 'AC Plugged (Disconnect)' : 'On Battery (Plug In AC)'}</span>
                </button>
              </div>
            </div>

            {/* 4 Core Battery Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Charge Percentage */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Charge Percentage</span>
                  <span className={`font-mono font-bold ${batteryStatus === 'Charging' ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {batteryStatus}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-mono tracking-tight text-white">{batteryPercent}%</span>
                  <span className="text-xs text-slate-400 font-mono">{energyNowWh} Wh</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      batteryPercent > 50 ? 'bg-emerald-500' : batteryPercent > 20 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${batteryPercent}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>Threshold: {batteryChargeLimit}%</span>
                  <span>{timeRemainingStr}</span>
                </div>
              </div>

              {/* Card 2: Current Discharge Rate (Watts) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Discharge Rate</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">
                    power_now
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-mono tracking-tight text-amber-400">
                    {Math.abs(batteryWatts)} W
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {batteryStatus === 'Charging' ? '+Input' : '-Draw'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
                  <span>Voltage: <strong>{batteryVoltageV} V</strong></span>
                  <span>Current: <strong>{batteryCurrentA} A</strong></span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                  <span>Temp: {batteryTempC}°C</span>
                  <span className="text-slate-400">Profile: {powerProfile}</span>
                </div>
              </div>

              {/* Card 3: Battery Wear Level */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Battery Wear Level</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Healthy Cell
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-mono tracking-tight text-white">{batteryWearPct}%</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">{batteryHealthPct}% Health</span>
                </div>
                {/* Visual Wear Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${batteryHealthPct}%` }}
                    title={`Retained Capacity: ${batteryHealthPct}%`}
                  ></div>
                  <div
                    className="bg-red-500/80 h-full"
                    style={{ width: `${batteryWearPct}%` }}
                    title={`Wear Degradation: ${batteryWearPct}%`}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                  <span>Full: {energyFullWh} Wh</span>
                  <span>Design: {energyFullDesignWh} Wh</span>
                </div>
              </div>

              {/* Card 4: Charge Cycle Count & Status */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Cycle Count</span>
                  <span className="text-[10px] font-mono text-slate-500">cycle_count</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold font-mono tracking-tight text-white">{batteryCycleCount}</span>
                  <span className="text-xs text-slate-400 font-mono">of ~1000 rated</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${(batteryCycleCount / 1000) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                  <span>Estimated Life: 85.8%</span>
                  <span className="text-emerald-400">Optimal</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Live Discharge Graph & Battery Care Limits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Discharge Rate Wattage Sparkline (2 cols) */}
              <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Real-Time Discharge Rate History (Watts)
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    Current: {Math.abs(batteryWatts)} W
                  </span>
                </div>

                <div className="h-32 bg-slate-950 rounded-lg p-3 border border-slate-800/80 flex flex-col justify-between">
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Peak: 35.0 W</span>
                    <span>Idle: 6.5 W</span>
                  </div>
                  <svg className="w-full h-20 overflow-visible" viewBox="0 0 180 50">
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={batterySparkPoints}
                    />
                  </svg>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>30 seconds ago</span>
                    <span>Live (now)</span>
                  </div>
                </div>

                {/* Capacity Degradation Comparison */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between text-slate-300">
                    <span>Factory OEM Design Capacity (energy_full_design):</span>
                    <strong className="text-white">{energyFullDesignWh}.00 Wh (80,000 mWh)</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Current Full Charge Capacity (energy_full):</span>
                    <strong className="text-emerald-400">{energyFullWh}.40 Wh (74,400 mWh)</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Degradation / Total Wear Level:</span>
                    <strong className="text-amber-400">-{batteryWearPct}% (-5.60 Wh lost over 142 cycles)</strong>
                  </div>
                </div>
              </div>

              {/* Power Profile & Battery Care Mode Controls (1 col) */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Battery Care & Thresholds
                    </h4>
                  </div>

                  {/* 80% Max Charge Limit Switch */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">Battery Care Limit (80%)</span>
                      <input
                        type="checkbox"
                        checked={batteryChargeLimit === 80}
                        onChange={(e) => setBatteryChargeLimit(e.target.checked ? 80 : 100)}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Caps charging at 80% to reduce chemical stress and prolong battery lifespan via <code className="text-slate-300 font-mono">charge_control_limit_max</code>.
                    </p>
                  </div>

                  {/* Power Profile Selector */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <label className="font-bold text-white text-xs block">Linux Power Profile</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['power-saver', 'balanced', 'performance'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPowerProfile(p)}
                          className={`py-1.5 px-2 rounded text-[10px] font-mono font-bold capitalize transition ${
                            powerProfile === p
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {p.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Target TDP: {powerProfile === 'power-saver' ? '8-11W' : powerProfile === 'performance' ? '22-35W' : '12-16W'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                  <span>Kernel driver: <strong className="text-slate-200">acpi_battery</strong></span>
                  <span className="text-emerald-400">Online</span>
                </div>
              </div>
            </div>

            {/* Direct Kernel Sysfs Node Explorer (/sys/class/power_supply/BAT0/) */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Linux Sysfs Tree Inspection — <code className="text-amber-400 font-mono font-normal">/sys/class/power_supply/BAT0/</code>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Direct kernel power supply interface providing raw hardware values
                    </p>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  Total Sysfs Nodes: 14 Active
                </div>
              </div>

              {/* Table of Sysfs Nodes */}
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Sysfs Node File</th>
                      <th className="py-2 px-3">Raw Kernel Value</th>
                      <th className="py-2 px-3">Parsed Metric</th>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-3 text-right">Command</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-[11px]">
                    {[
                      {
                        file: 'capacity',
                        raw: `${Math.round(batteryPercent)}`,
                        parsed: `${batteryPercent}%`,
                        desc: 'Current state of charge percentage',
                      },
                      {
                        file: 'status',
                        raw: batteryStatus,
                        parsed: batteryStatus,
                        desc: 'Charging / Discharging / Full state',
                      },
                      {
                        file: 'power_now',
                        raw: `${Math.round(Math.abs(batteryWatts) * 1000000)}`,
                        parsed: `${Math.abs(batteryWatts)} W`,
                        desc: 'Instantaneous discharge/charge rate in microwatts (µW)',
                      },
                      {
                        file: 'voltage_now',
                        raw: `${Math.round(batteryVoltageV * 1000000)}`,
                        parsed: `${batteryVoltageV} V`,
                        desc: 'Terminal voltage in microvolts (µV)',
                      },
                      {
                        file: 'current_now',
                        raw: `${Math.round(batteryCurrentA * 1000000)}`,
                        parsed: `${batteryCurrentA} A`,
                        desc: 'Instantaneous current flow in microamperes (µA)',
                      },
                      {
                        file: 'energy_full',
                        raw: `${Math.round(energyFullWh * 1000000)}`,
                        parsed: `${energyFullWh} Wh`,
                        desc: 'Current maximum ceiling capacity in microwatt-hours (µWh)',
                      },
                      {
                        file: 'energy_full_design',
                        raw: `${Math.round(energyFullDesignWh * 1000000)}`,
                        parsed: `${energyFullDesignWh} Wh`,
                        desc: 'OEM factory designed capacity in microwatt-hours (µWh)',
                      },
                      {
                        file: 'energy_now',
                        raw: `${Math.round(energyNowWh * 1000000)}`,
                        parsed: `${energyNowWh} Wh`,
                        desc: 'Remaining energy in microwatt-hours (µWh)',
                      },
                      {
                        file: 'cycle_count',
                        raw: `${batteryCycleCount}`,
                        parsed: `${batteryCycleCount} cycles`,
                        desc: 'Total complete charge discharge cycle count',
                      },
                      {
                        file: 'charge_control_limit_max',
                        raw: `${batteryChargeLimit}`,
                        parsed: `${batteryChargeLimit}%`,
                        desc: 'Hardware charge limit ceiling to prevent degradation',
                      },
                      {
                        file: 'technology',
                        raw: batteryTechnology,
                        parsed: 'Lithium-Polymer',
                        desc: 'Battery internal cell chemistry composition',
                      },
                      {
                        file: 'manufacturer',
                        raw: batteryManufacturer,
                        parsed: 'Simplo / LG Chem OEM',
                        desc: 'Original battery manufacturer vendor string',
                      },
                      {
                        file: 'model_name',
                        raw: batteryModel,
                        parsed: batteryModel,
                        desc: 'Model identifier code',
                      },
                      {
                        file: 'type',
                        raw: 'Battery',
                        parsed: 'Battery (Secondary Power Supply)',
                        desc: 'Linux power supply subsystem type',
                      },
                    ].map((row) => (
                      <tr key={row.file} className="hover:bg-slate-800/40 transition">
                        <td className="py-2 px-3 font-bold text-amber-400">
                          /sys/class/power_supply/BAT0/{row.file}
                        </td>
                        <td className="py-2 px-3 text-slate-300 font-mono">{row.raw}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{row.parsed}</td>
                        <td className="py-2 px-3 text-slate-400 text-[10px]">{row.desc}</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => {
                              const cmd = `cat /sys/class/power_supply/BAT0/${row.file}`;
                              navigator.clipboard.writeText(cmd);
                              setCopiedSysfsNode(row.file);
                              setTimeout(() => setCopiedSysfsNode(null), 1500);
                            }}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] transition"
                            title="Copy command to clipboard"
                          >
                            {copiedSysfsNode === row.file ? 'Copied!' : 'Copy cat'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Processes Tab */}
        {selectedTab === 'processes' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">ApexOS Process & Task Manager</h3>
                  <p className="text-xs text-slate-400">Live background daemon and interactive user processes</p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchProcess}
                    onChange={(e) => setSearchProcess(e.target.value)}
                    placeholder="Search process, user, PID..."
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-56"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">PID</th>
                      <th className="py-2 px-3">Process Name</th>
                      <th className="py-2 px-3">User</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">CPU %</th>
                      <th className="py-2 px-3">Memory</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProcesses.map((proc) => (
                      <tr key={proc.pid} className="hover:bg-slate-800/40 transition">
                        <td className="py-2 px-3 text-slate-500">#{proc.pid}</td>
                        <td className="py-2 px-3 font-semibold text-white">{proc.name}</td>
                        <td className="py-2 px-3 text-slate-400">{proc.user}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              proc.status === 'running'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {proc.status}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`font-bold ${
                              proc.cpu > 10 ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {proc.cpu}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-300">{proc.memMb} MB</td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => killProcess(proc.pid)}
                            className="px-2 py-0.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] transition"
                            title="Send SIGTERM signal"
                          >
                            End Task
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Telemetry Agent: Active
          </span>
          <span className="hidden sm:inline">Tasks: {processes.length} total</span>
          <span className="hidden sm:inline">Kernel: {config.kernelVariant}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Hostname: <strong className="text-slate-200">{config.hostname}</strong></span>
        </div>
      </div>
    </div>
  );
};
