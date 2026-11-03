import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Sliders,
  Check,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  Layers,
  RotateCw,
  Tv,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Grid,
  Shield,
  Eye,
  Maximize2,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface DisplayManagerAppProps {
  config: DistroConfiguration;
}

interface MonitorInfo {
  id: string;
  name: string;
  connector: string;
  resolution: string;
  refreshRate: string;
  scale: string;
  isPrimary: boolean;
  orientation: 'landscape' | 'portrait-left' | 'portrait-right' | 'inverted';
  hdr: boolean;
  vrr: boolean;
  x: number;
  y: number;
  widthPx: number;
  heightPx: number;
}

export const DisplayManagerApp: React.FC<DisplayManagerAppProps> = ({ config }) => {
  // Available Display Managers in Linux
  const [activeDm, setActiveDm] = useState<'gdm3' | 'sddm' | 'lightdm' | 'greetd' | 'ly'>('gdm3');
  const [dmStatusMessage, setDmStatusMessage] = useState<string | null>(null);

  // Monitors
  const [monitors, setMonitors] = useState<MonitorInfo[]>([
    {
      id: 'edp1',
      name: 'Built-in OLED Display',
      connector: 'eDP-1',
      resolution: '2560x1440',
      refreshRate: '165Hz',
      scale: '125%',
      isPrimary: true,
      orientation: 'landscape',
      hdr: true,
      vrr: true,
      x: 0,
      y: 0,
      widthPx: 140,
      heightPx: 85,
    },
    {
      id: 'dp1',
      name: 'ASUS ROG Swift OLED 360Hz',
      connector: 'DP-1',
      resolution: '2560x1440',
      refreshRate: '240Hz',
      scale: '100%',
      isPrimary: false,
      orientation: 'landscape',
      hdr: true,
      vrr: true,
      x: 150,
      y: 0,
      widthPx: 160,
      heightPx: 95,
    },
    {
      id: 'hdmi1',
      name: 'LG UltraFine 4K Secondary',
      connector: 'HDMI-1',
      resolution: '3840x2160',
      refreshRate: '60Hz',
      scale: '150%',
      isPrimary: false,
      orientation: 'portrait-right',
      hdr: false,
      vrr: false,
      x: 320,
      y: 0,
      widthPx: 75,
      heightPx: 130,
    },
  ]);

  const [selectedMonitorId, setSelectedMonitorId] = useState<string>('edp1');
  const [displayMode, setDisplayMode] = useState<'join' | 'mirror' | 'single'>('join');

  // Night light & Color Temperature
  const [nightLightEnabled, setNightLightEnabled] = useState(false);
  const [colorTemperature, setColorTemperature] = useState(4200); // 3000K (warm) to 6500K (cool)
  const [fractionalScaling, setFractionalScaling] = useState(true);

  // Confirmation banner countdown
  const [pendingChanges, setPendingChanges] = useState(false);
  const [revertCountdown, setRevertCountdown] = useState<number | null>(null);
  const [showTestPattern, setShowTestPattern] = useState(false);

  const selectedMonitor = monitors.find((m) => m.id === selectedMonitorId) || monitors[0];

  const updateSelectedMonitor = (updates: Partial<MonitorInfo>) => {
    setMonitors((prev) =>
      prev.map((m) => (m.id === selectedMonitorId ? { ...m, ...updates } : m))
    );
    setPendingChanges(true);
  };

  const handleSetPrimary = (id: string) => {
    setMonitors((prev) =>
      prev.map((m) => ({
        ...m,
        isPrimary: m.id === id,
      }))
    );
    setPendingChanges(true);
  };

  const handleSwitchDisplayManager = (dm: typeof activeDm) => {
    setActiveDm(dm);
    const dmNames: Record<typeof activeDm, string> = {
      gdm3: 'GNOME Display Manager (gdm3)',
      sddm: 'Simple Desktop Display Manager (sddm)',
      lightdm: 'LightDM Lightweight Greeter',
      greetd: 'greetd / tuigreet Wayland greeter',
      ly: 'Ly TUI Console Matrix Greeter',
    };
    setDmStatusMessage(`Switched default display manager service to ${dmNames[dm]}. Systemd unit /etc/systemd/system/display-manager.service updated.`);
    setTimeout(() => setDmStatusMessage(null), 4000);
  };

  const handleApplyDisplayChanges = () => {
    setPendingChanges(false);
    setRevertCountdown(15);
  };

  useEffect(() => {
    if (revertCountdown === null) return;
    if (revertCountdown <= 0) {
      setRevertCountdown(null);
      return;
    }
    const timer = setInterval(() => {
      setRevertCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [revertCountdown]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden text-xs">
      {/* Top Header */}
      <div className="h-11 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Display Manager & Multi-Monitor Studio</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                DRM/KMS Active
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Wayland compositor • Mesa 24.3 RADV Vulkan drivers
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTestPattern(!showTestPattern)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            <Grid className="w-3.5 h-3.5 text-amber-400" />
            <span>{showTestPattern ? 'Exit Test Pattern' : 'Calibration Pattern'}</span>
          </button>

          {pendingChanges && (
            <button
              onClick={handleApplyDisplayChanges}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition shadow-md animate-pulse"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Resolution</span>
            </button>
          )}
        </div>
      </div>

      {/* Revert / Keep Changes Banner */}
      {revertCountdown !== null && (
        <div className="px-4 py-2 bg-amber-500/15 border-b border-amber-500/40 text-amber-300 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>
              Display configuration applied. Keep new settings? Reverting automatically in <strong>{revertCountdown}s</strong>.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevertCountdown(null)}
              className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Keep Changes
            </button>
            <button
              onClick={() => {
                setRevertCountdown(null);
                setPendingChanges(false);
              }}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
            >
              Revert Now
            </button>
          </div>
        </div>
      )}

      {/* DM Switch Status Notification */}
      {dmStatusMessage && (
        <div className="px-4 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 flex items-center gap-2 font-mono text-[11px] animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{dmStatusMessage}</span>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Section 1: Display Manager Greeter Selector */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Linux Display Manager (Login & Session Greeter)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Active Service: <strong className="text-emerald-400">{activeDm}.service</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'gdm3', name: 'GDM3', desc: 'GNOME Display Manager (Default Wayland)', badge: 'Default' },
              { id: 'sddm', name: 'SDDM', desc: 'KDE Plasma Qt6 Greeter', badge: 'KDE' },
              { id: 'lightdm', name: 'LightDM', desc: 'Lightweight X11 GTK Greeter', badge: 'Fast' },
              { id: 'greetd', name: 'greetd', desc: 'Modern Rust Minimal Greeter', badge: 'Rust' },
              { id: 'ly', name: 'Ly TUI', desc: 'Console Matrix Animation Greeter', badge: 'TUI' },
            ].map((dm) => (
              <button
                key={dm.id}
                onClick={() => handleSwitchDisplayManager(dm.id as any)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                  activeDm === dm.id
                    ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">{dm.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      activeDm === dm.id ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {dm.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{dm.desc}</p>
                </div>
                <span className={`text-[10px] font-mono mt-2 font-semibold ${
                  activeDm === dm.id ? 'text-amber-400' : 'text-slate-500'
                }`}>
                  {activeDm === dm.id ? '● Active DM' : 'Switch →'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Virtual Monitor Arrangement Canvas */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Monitors Arrangement & Spatial Layout
              </h3>
              <p className="text-[11px] text-slate-400">
                Click a display to configure its resolution, refresh rate, and scaling.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              {(['join', 'mirror', 'single'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setDisplayMode(mode);
                    setPendingChanges(true);
                  }}
                  className={`px-2.5 py-1 rounded capitalize transition ${
                    displayMode === mode
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode === 'join' ? 'Extend (Join)' : mode === 'mirror' ? 'Mirror' : 'Single Only'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Screen Layout Canvas */}
          <div className="h-44 bg-slate-950 rounded-xl border border-slate-800/90 relative p-4 flex items-center justify-center gap-4 overflow-hidden">
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            ></div>

            {monitors.map((mon, index) => {
              const isSelected = mon.id === selectedMonitorId;
              return (
                <div
                  key={mon.id}
                  onClick={() => setSelectedMonitorId(mon.id)}
                  style={{
                    width: `${mon.widthPx}px`,
                    height: `${mon.heightPx}px`,
                  }}
                  className={`relative rounded-xl border-2 flex flex-col items-center justify-between p-2 cursor-pointer transition-all shadow-xl group ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/40 scale-105 z-10'
                      : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="w-full flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-slate-200 truncate">{mon.connector}</span>
                    {mon.isPrimary && (
                      <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-bold">
                        PRIMARY
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-base font-bold text-white block">#{index + 1}</span>
                    <span className="text-[9px] text-slate-400 font-mono block">{mon.resolution}</span>
                  </div>

                  <div className="text-[9px] font-mono text-cyan-400 font-semibold">
                    {mon.refreshRate} • {mon.scale}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Monitor Detail Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Selected Display Output */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  {selectedMonitor.name} ({selectedMonitor.connector})
                </h4>
              </div>
              {!selectedMonitor.isPrimary && (
                <button
                  onClick={() => handleSetPrimary(selectedMonitor.id)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-[10px] font-semibold"
                >
                  Make Primary
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Resolution */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Resolution</label>
                <select
                  value={selectedMonitor.resolution}
                  onChange={(e) => updateSelectedMonitor({ resolution: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
                >
                  <option value="3840x2160">3840 x 2160 (16:9 4K UHD)</option>
                  <option value="2560x1440">2560 x 1440 (16:9 2K QHD)</option>
                  <option value="1920x1080">1920 x 1080 (16:9 Full HD)</option>
                  <option value="1680x1050">1680 x 1050 (16:10 WSXGA)</option>
                  <option value="1280x720">1280 x 720 (16:9 HD)</option>
                </select>
              </div>

              {/* Refresh Rate */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Refresh Rate</label>
                <select
                  value={selectedMonitor.refreshRate}
                  onChange={(e) => updateSelectedMonitor({ refreshRate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
                >
                  <option value="360Hz">360.00 Hz (eSports Ultra)</option>
                  <option value="240Hz">240.00 Hz (Pro Gaming)</option>
                  <option value="165Hz">165.00 Hz (Fluid Gaming)</option>
                  <option value="144Hz">144.00 Hz (Gaming Standard)</option>
                  <option value="120Hz">120.00 Hz (Smooth)</option>
                  <option value="60Hz">60.00 Hz (Standard 60FPS)</option>
                </select>
              </div>

              {/* Fractional Scaling */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Display Scaling</label>
                <select
                  value={selectedMonitor.scale}
                  onChange={(e) => updateSelectedMonitor({ scale: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
                >
                  <option value="100%">100% (Native)</option>
                  <option value="125%">125% (Fractional)</option>
                  <option value="150%">150% (Recommended for 2K/4K)</option>
                  <option value="175%">175% (Fractional)</option>
                  <option value="200%">200% (HiDPI 2x Retina)</option>
                </select>
              </div>

              {/* Orientation */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Orientation</label>
                <select
                  value={selectedMonitor.orientation}
                  onChange={(e) => updateSelectedMonitor({ orientation: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
                >
                  <option value="landscape">Standard (Landscape)</option>
                  <option value="portrait-right">Portrait (Right 90°)</option>
                  <option value="portrait-left">Portrait (Left 270°)</option>
                  <option value="inverted">Inverted (Flipped 180°)</option>
                </select>
              </div>
            </div>

            {/* Checkboxes: VRR & HDR */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">Adaptive Sync / VRR (FreeSync & G-Sync Compatible)</span>
                <input
                  type="checkbox"
                  checked={selectedMonitor.vrr}
                  onChange={(e) => updateSelectedMonitor({ vrr: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-300">High Dynamic Range (HDR10 / 10-bit Color Depth)</span>
                <input
                  type="checkbox"
                  checked={selectedMonitor.hdr}
                  onChange={(e) => updateSelectedMonitor({ hdr: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* Card B: Night Light & Visual Calibration */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Night Light & Color Calibration
                </h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={nightLightEnabled}
                  onChange={(e) => setNightLightEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Night Light warms screen colors to reduce eye strain and sleep disturbance.
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Color Temperature:</span>
                <span className="font-mono text-amber-400 font-bold">{colorTemperature}K ({colorTemperature < 4000 ? 'Warm Amber' : colorTemperature < 5500 ? 'Natural' : 'Cool Daylight'})</span>
              </div>
              <input
                type="range"
                min="3000"
                max="6500"
                step="100"
                disabled={!nightLightEnabled}
                value={colorTemperature}
                onChange={(e) => setColorTemperature(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer disabled:opacity-40"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Warm (3000K)</span>
                <span>Neutral (5000K)</span>
                <span>Cool (6500K)</span>
              </div>
            </div>

            {/* Simulated Live Color Tint Preview */}
            <div className="p-3 rounded-lg border border-slate-800 flex items-center justify-between overflow-hidden relative" style={{
              backgroundColor: nightLightEnabled ? `rgba(255, 180, 50, ${Math.max(0.05, (6500 - colorTemperature) / 15000)})` : 'transparent'
            }}>
              <div>
                <span className="font-semibold text-slate-200 text-xs block">Preview Color Spectrum</span>
                <span className="text-[10px] text-slate-400 font-mono">sRGB Color Gamut Coverage: 99.8%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></span>
                <span className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></span>
                <span className="w-4 h-4 rounded-full bg-blue-500 shadow-sm"></span>
                <span className="w-4 h-4 rounded-full bg-amber-400 shadow-sm"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Pattern Overlay Modal */}
        {showTestPattern && (
          <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-xl space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-400 text-xs uppercase font-mono">
                Display Uniformity & RGB Geometry Calibration Pattern
              </span>
              <button
                onClick={() => setShowTestPattern(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close Pattern ✕
              </button>
            </div>
            {/* Color bars */}
            <div className="h-10 rounded-lg overflow-hidden flex border border-slate-700">
              {['#ffffff', '#ffff00', '#00ffff', '#00ff00', '#ff00ff', '#ff0000', '#0000ff', '#000000'].map((c, i) => (
                <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }}></div>
              ))}
            </div>
            {/* Grayscale Ramp */}
            <div className="h-6 rounded-lg overflow-hidden flex border border-slate-700">
              {Array.from({ length: 16 }).map((_, i) => {
                const val = Math.round((i / 15) * 255);
                return (
                  <div
                    key={i}
                    className="flex-1 h-full"
                    style={{ backgroundColor: `rgb(${val}, ${val}, ${val})` }}
                  ></div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="h-8 px-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-slate-400 text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span>Connected Displays: <strong className="text-white">{monitors.length}</strong></span>
          <span className="hidden sm:inline">Compositor: <strong>Wayland (wlroots)</strong></span>
          <span className="hidden sm:inline">Display Manager: <strong className="text-amber-400">{activeDm}</strong></span>
        </div>
        <div>
          <span>Primary: <strong className="text-cyan-400">{monitors.find((m) => m.isPrimary)?.connector}</strong></span>
        </div>
      </div>
    </div>
  );
};
