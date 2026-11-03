import React, { useState, useEffect } from 'react';
import {
  Palette,
  Monitor,
  Volume2,
  Cpu,
  Check,
  Sparkles,
  Sliders,
  Moon,
  Sun,
  Shield,
  Layers,
  CheckCircle2,
  Eye,
  ExternalLink,
  Tv,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface SettingsAppProps {
  config: DistroConfiguration;
  currentTheme: string;
  onSelectTheme: (themeId: string) => void;
  onOpenDisplayManager?: () => void;
}

export interface ThemeOption {
  id: string;
  name: string;
  description: string;
  bgHex: string;
  surfaceHex: string;
  accentHex: string;
  highlightHex: string;
  tag: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'default',
    name: 'Ubuntu Yaru',
    description: 'Canonical dark slate with warm amber and aubergine highlights.',
    bgHex: '#020617',
    surfaceHex: '#0f172a',
    accentHex: '#f59e0b',
    highlightHex: '#fbbf24',
    tag: 'Default Distro',
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep naval abyss with electric azure and cobalt glow.',
    bgHex: '#070e1b',
    surfaceHex: '#0f1d36',
    accentHex: '#3b82f6',
    highlightHex: '#60a5fa',
    tag: 'Deep Cobalt',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Obsidian base with intense neon yellow and magenta highlights.',
    bgHex: '#0a0612',
    surfaceHex: '#170e24',
    accentHex: '#facc15',
    highlightHex: '#e879f9',
    tag: 'Neon High-Contrast',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Deep pine tones with vivid emerald and mint phosphor.',
    bgHex: '#041009',
    surfaceHex: '#0a2115',
    accentHex: '#10b981',
    highlightHex: '#34d399',
    tag: 'Emerald Phosphor',
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Classic hacker terminal palette with cyan and golden yellow.',
    bgHex: '#00212b',
    surfaceHex: '#073642',
    accentHex: '#2aa198',
    highlightHex: '#b58900',
    tag: 'Retro Cybernetic',
  },
];

export const SettingsApp: React.FC<SettingsAppProps> = ({
  config,
  currentTheme,
  onSelectTheme,
  onOpenDisplayManager,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'display' | 'sound' | 'about'>('appearance');
  const [resolution, setResolution] = useState('2560x1440');
  const [refreshRate, setRefreshRate] = useState('144Hz');
  const [scaling, setScaling] = useState('100%');
  const [vrrEnabled, setVrrEnabled] = useState(true);
  const [displayManagerService, setDisplayManagerService] = useState<'gdm3' | 'sddm' | 'lightdm' | 'greetd' | 'ly'>('gdm3');
  const [sampleRate, setSampleRate] = useState('48000Hz');
  const [bufferSize, setBufferSize] = useState('128 samples (2.7ms)');

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans select-none text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm text-white">System Settings</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px]">{config.hostname}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Active Theme:</span>
          <span className="font-bold text-amber-400 capitalize">
            {THEME_OPTIONS.find((t) => t.id === currentTheme)?.name || currentTheme}
          </span>
        </div>
      </div>

      {/* Main Settings Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-52 bg-slate-950/80 border-r border-slate-800 p-2.5 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-left ${
                activeTab === 'appearance'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Appearance & Themes</span>
            </button>

            <button
              onClick={() => setActiveTab('display')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-left ${
                activeTab === 'display'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span>Displays & Refresh</span>
            </button>

            <button
              onClick={() => setActiveTab('sound')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-left ${
                activeTab === 'sound'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>PipeWire Audio</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-left ${
                activeTab === 'about'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4 text-slate-400" />
              <span>About System</span>
            </button>
          </div>

          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-400 space-y-0.5">
            <div>Global CSS Variables: <strong>Active</strong></div>
            <div>Desktop Environment: <strong>GNOME 47</strong></div>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab 1: Appearance & Theme Selector */}
          {activeTab === 'appearance' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Desktop Color Scheme & Visual Themes
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Select a color scheme to dynamically update global CSS variables (`--color-accent`, `--color-bg-base`, `--color-surface`, `--color-terminal-prompt`) across the entire desktop environment.
                </p>
              </div>

              {/* Theme Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {THEME_OPTIONS.map((theme) => {
                  const isActive = currentTheme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => onSelectTheme(theme.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/40 shadow-xl'
                          : 'bg-slate-950/70 hover:bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Title & Tag */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{theme.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {theme.tag}
                            </span>
                          </div>

                          {isActive ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-700"></div>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {theme.description}
                        </p>

                        {/* Visual Palette Swatches */}
                        <div className="pt-2">
                          <span className="text-[10px] text-slate-500 font-mono block mb-1">
                            Palette Swatches:
                          </span>
                          <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800">
                            {/* Base Canvas */}
                            <div className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className="w-full h-6 rounded border border-slate-700 shadow-inner"
                                style={{ backgroundColor: theme.bgHex }}
                              ></div>
                              <span className="text-[9px] font-mono text-slate-400">Base</span>
                            </div>

                            {/* Surface */}
                            <div className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className="w-full h-6 rounded border border-slate-700 shadow-inner"
                                style={{ backgroundColor: theme.surfaceHex }}
                              ></div>
                              <span className="text-[9px] font-mono text-slate-400">Surface</span>
                            </div>

                            {/* Accent */}
                            <div className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className="w-full h-6 rounded border border-slate-700 shadow-inner"
                                style={{ backgroundColor: theme.accentHex }}
                              ></div>
                              <span className="text-[9px] font-mono text-slate-400">Accent</span>
                            </div>

                            {/* Highlight */}
                            <div className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className="w-full h-6 rounded border border-slate-700 shadow-inner"
                                style={{ backgroundColor: theme.highlightHex }}
                              ></div>
                              <span className="text-[9px] font-mono text-slate-400">Glow</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action status */}
                      <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-400">
                          data-theme="{theme.id}"
                        </span>
                        <span
                          className={`font-semibold ${
                            isActive ? 'text-amber-400' : 'text-slate-500'
                          }`}
                        >
                          {isActive ? 'Active Scheme' : 'Click to Apply'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CSS Variables Inspector Box */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    Global CSS Variable Declarations:
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Applied to :root</span>
                </div>
                <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-amber-300/90 overflow-x-auto leading-relaxed border border-slate-800">
{`:root[data-theme='${currentTheme}'] {
  --color-accent: ${THEME_OPTIONS.find((t) => t.id === currentTheme)?.accentHex};
  --color-bg-base: ${THEME_OPTIONS.find((t) => t.id === currentTheme)?.bgHex};
  --color-surface: ${THEME_OPTIONS.find((t) => t.id === currentTheme)?.surfaceHex};
  --color-accent-text: ${THEME_OPTIONS.find((t) => t.id === currentTheme)?.highlightHex};
}`}
                </pre>
              </div>
            </div>
          )}

          {/* Tab 2: Display & Refresh Rate */}
          {activeTab === 'display' && (
            <div className="max-w-2xl mx-auto space-y-5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Displays & Refresh Settings
                  </h3>
                  <p className="text-slate-400 mt-0.5">
                    Mesa 24.3 RADV Vulkan and DRM kernel modesetting.
                  </p>
                </div>
                {onOpenDisplayManager && (
                  <button
                    onClick={onOpenDisplayManager}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs shadow transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Display Studio</span>
                  </button>
                )}
              </div>

              {/* Advanced Display Manager Card Banner */}
              <div className="p-4 bg-gradient-to-r from-indigo-950/70 to-slate-900 rounded-xl border border-indigo-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                      <Tv className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">ApexOS Multi-Monitor & Display Manager Studio</div>
                      <div className="text-[11px] text-slate-400">Interactive screen topology, fractional scaling, Night Light, and service daemons</div>
                    </div>
                  </div>
                  {onOpenDisplayManager && (
                    <button
                      onClick={onOpenDisplayManager}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[11px] transition shadow"
                    >
                      Configure Monitors
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Linux Display Manager Switcher */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="font-bold text-slate-200 block">Default Linux Display Manager (DM)</label>
                  <p className="text-[11px] text-slate-400">Login greeter service active on system startup:</p>
                  <select
                    value={displayManagerService}
                    onChange={(e) => setDisplayManagerService(e.target.value as 'gdm3' | 'sddm' | 'lightdm' | 'greetd' | 'ly')}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none font-mono"
                  >
                    <option value="gdm3">gdm3 (GNOME Display Manager — Wayland & X11 Default)</option>
                    <option value="sddm">sddm (Simple Desktop Display Manager — KDE / Qt6 / Wayland)</option>
                    <option value="lightdm">lightdm (Light Display Manager — Fast, Cross-desktop)</option>
                    <option value="greetd">greetd (Lightweight daemon with ReGreet Wayland compositor)</option>
                    <option value="ly">ly (Compact TUI Matrix-style C Display Manager)</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="font-bold text-slate-200 block">Screen Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none"
                  >
                    <option value="2560x1440">2560 x 1440 (16:9 QHD, Recommended)</option>
                    <option value="1920x1080">1920 x 1080 (16:9 Full HD)</option>
                    <option value="3840x2160">3840 x 2160 (16:9 4K Ultra HD)</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="font-bold text-slate-200 block">Refresh Rate</label>
                  <select
                    value={refreshRate}
                    onChange={(e) => setRefreshRate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none"
                  >
                    <option value="144Hz">144.00 Hz (Gaming eSports)</option>
                    <option value="240Hz">240.00 Hz (Ultra High Refresh)</option>
                    <option value="360Hz">360.00 Hz (Competitive Pro OLED)</option>
                    <option value="60Hz">60.00 Hz (Standard Desktop)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <div className="font-bold text-white">Variable Refresh Rate (VRR / FreeSync / G-Sync)</div>
                    <div className="text-[11px] text-slate-400">Eliminates stutter and screen tearing in Proton and Wine games</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={vrrEnabled}
                    onChange={(e) => setVrrEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Sound */}
          {activeTab === 'sound' && (
            <div className="max-w-2xl mx-auto space-y-5 text-xs text-slate-300">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  PipeWire Low-Latency Audio Server
                </h3>
                <p className="text-slate-400 mt-0.5">
                  Configured for real-time gaming audio and Android Studio emulator sync.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="font-bold text-slate-200 block">Sample Rate</label>
                  <select
                    value={sampleRate}
                    onChange={(e) => setSampleRate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none"
                  >
                    <option value="48000Hz">48000 Hz (Broadcast & Gaming Standard)</option>
                    <option value="96000Hz">96000 Hz (Hi-Res Audio Studio)</option>
                    <option value="44100Hz">44100 Hz (Legacy CD Audio)</option>
                  </select>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="font-bold text-slate-200 block">Quantum Buffer Size</label>
                  <select
                    value={bufferSize}
                    onChange={(e) => setBufferSize(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none"
                  >
                    <option value="128 samples (2.7ms)">128 samples (2.7ms latency - Gaming Mode)</option>
                    <option value="64 samples (1.3ms)">64 samples (1.3ms ultra-low latency)</option>
                    <option value="256 samples (5.3ms)">256 samples (Balanced)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: About System */}
          {activeTab === 'about' && (
            <div className="max-w-2xl mx-auto space-y-4 text-xs text-slate-300">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">About {config.distroName}</h3>
                <p className="text-slate-400 mt-0.5">Operating system build specifications.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">OS Name:</span>
                  <span className="text-white font-bold">{config.distroName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Base Release:</span>
                  <span>Ubuntu {config.baseUbuntuVersion} ({config.codename})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Kernel Version:</span>
                  <span className="text-amber-400">{config.kernelVariant}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Active Repositories:</span>
                  <span>{config.repositories.filter((r) => r.enabled).length} PPAs Active</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Installed Packages:</span>
                  <span className="text-emerald-400">{config.packages.filter((p) => p.installed).length} packages</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
