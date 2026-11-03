import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Sliders,
  Copy,
  Check,
  Zap,
  Cpu,
  Monitor,
  Flame,
  Battery,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface MangoappAppProps {
  config: DistroConfiguration;
}

export const MangoappApp: React.FC<MangoappAppProps> = ({ config }) => {
  const [showFps, setShowFps] = useState(true);
  const [showFrametime, setShowFrametime] = useState(true);
  const [showCpu, setShowCpu] = useState(true);
  const [showGpu, setShowGpu] = useState(true);
  const [showVram, setShowVram] = useState(true);
  const [showWine, setShowWine] = useState(true);
  const [showBattery, setShowBattery] = useState(false);
  const [hudPosition, setHudPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-left');
  const [fpsLimit, setFpsLimit] = useState('144');
  const [copied, setCopied] = useState(false);

  // Live telemetry ticker
  const [liveFps, setLiveFps] = useState(120);
  const [liveFrametime, setLiveFrametime] = useState(8.3);
  const [liveGpuTemp, setLiveGpuTemp] = useState(56);
  const [liveCpuTemp, setLiveCpuTemp] = useState(48);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveFps(Math.floor(118 + Math.random() * 8));
      setLiveFrametime(parseFloat((8.1 + Math.random() * 0.5).toFixed(1)));
      setLiveGpuTemp(Math.floor(55 + Math.random() * 3));
      setLiveCpuTemp(Math.floor(47 + Math.random() * 3));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const configText = `# ApexOS MangoHud & Mangoapp Configuration
# Path: ~/.config/MangoHud/MangoHud.conf

legacy_layout=false
${showFps ? 'fps' : '# fps'}
${showFrametime ? 'frametime' : '# frametime'}
${showCpu ? 'cpu_stats\ncpu_temp' : '# cpu_stats'}
${showGpu ? 'gpu_stats\ngpu_temp' : '# gpu_stats'}
${showVram ? 'vram' : '# vram'}
${showWine ? 'wine\nwine_color=00FF00' : '# wine'}
${showBattery ? 'battery' : '# battery'}

position=${hudPosition.replace('-', '_')}
fps_limit=${fpsLimit}
font_size=24
background_alpha=0.65
round_corners=10
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(configText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 font-sans select-none overflow-hidden text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm text-white">Mangoapp 0.7.2</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px]">Standalone Wayland/X11 HUD Overlay</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-emerald-400">Daemon Active (PID: 3418)</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Controls */}
        <div className="w-80 bg-slate-950/80 border-r border-slate-800 p-4 overflow-y-auto space-y-4 shrink-0">
          <div>
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              Telemetry Sensors
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Toggle real-time metrics shown on games</p>
          </div>

          <div className="space-y-2">
            {[
              { label: 'FPS (Frames Per Second)', state: showFps, setter: setShowFps },
              { label: 'Frametime Graph (ms)', state: showFrametime, setter: setShowFrametime },
              { label: 'CPU Usage & Temperature', state: showCpu, setter: setShowCpu },
              { label: 'GPU Clocks & Temperature', state: showGpu, setter: setShowGpu },
              { label: 'VRAM Allocation (GB)', state: showVram, setter: setShowVram },
              { label: 'Wine / Proton Engine Tag', state: showWine, setter: setShowWine },
              { label: 'Battery / Power Draw (W)', state: showBattery, setter: setShowBattery },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800"
              >
                <span className="text-xs text-slate-200">{item.label}</span>
                <input
                  type="checkbox"
                  checked={item.state}
                  onChange={(e) => item.setter(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="font-bold text-white text-xs block">HUD Screen Position</span>
            <select
              value={hudPosition}
              onChange={(e) => setHudPosition(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none text-xs"
            >
              <option value="top-left">Top Left (Standard)</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-white text-xs block">FPS Target Limiter</span>
            <select
              value={fpsLimit}
              onChange={(e) => setFpsLimit(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none text-xs"
            >
              <option value="144">144 FPS (Match Gaming Monitor)</option>
              <option value="120">120 FPS</option>
              <option value="60">60 FPS (Battery Saving)</option>
              <option value="0">Unlimited (0)</option>
            </select>
          </div>
        </div>

        {/* Right Preview & Conf */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-900 p-5 space-y-4">
          <div>
            <span className="font-bold text-white text-xs uppercase tracking-wider block">
              Live In-Game HUD Preview
            </span>
            <span className="text-[11px] text-slate-400">Simulates appearance over Vulkan/OpenGL viewport</span>
          </div>

          {/* Interactive Screen Simulator */}
          <div className="h-64 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner">
            {/* Background simulated 3D game scene */}
            <div className="absolute inset-0 bg-radial from-slate-900 to-black opacity-90"></div>
            <div className="text-slate-600 font-mono text-xs z-10 flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              <span>Vulkan 1.3 Viewport (1920x1080 @ 144Hz)</span>
            </div>

            {/* Draggable-like HUD overlay element based on position */}
            <div
              className={`absolute z-20 p-2.5 rounded-lg bg-black/80 border border-slate-700 backdrop-blur-md font-mono text-[11px] shadow-2xl transition-all duration-300 ${
                hudPosition === 'top-left' ? 'top-3 left-3' :
                hudPosition === 'top-right' ? 'top-3 right-3' :
                hudPosition === 'bottom-left' ? 'bottom-3 left-3' :
                'bottom-3 right-3'
              }`}
            >
              <div className="space-y-1">
                {showFps && (
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold text-sm">{liveFps} FPS</span>
                    {showFrametime && <span className="text-slate-400 text-[10px]">{liveFrametime} ms</span>}
                  </div>
                )}
                {showGpu && (
                  <div className="flex justify-between gap-3 text-cyan-400">
                    <span>GPU: {liveGpuTemp}°C</span>
                    <span>95%</span>
                  </div>
                )}
                {showCpu && (
                  <div className="flex justify-between gap-3 text-amber-400">
                    <span>CPU: {liveCpuTemp}°C</span>
                    <span>22%</span>
                  </div>
                )}
                {showVram && (
                  <div className="text-purple-400">
                    VRAM: 6.2 GB
                  </div>
                )}
                {showWine && (
                  <div className="text-emerald-300 text-[10px]">
                    Proton-GE 9.20 • Wine 9.21
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Configuration File Display */}
          <div className="flex-1 flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="h-8 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="font-mono text-[11px] text-amber-400">~/.config/MangoHud/MangoHud.conf</span>
              <button
                onClick={handleCopy}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1 font-mono transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Config'}</span>
              </button>
            </div>
            <pre className="flex-1 p-3 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed bg-slate-950">
              {configText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
