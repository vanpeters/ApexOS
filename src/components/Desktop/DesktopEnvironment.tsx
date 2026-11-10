import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Gamepad2,
  Smartphone,
  Bot,
  Sparkles,
  Sliders,
  Download,
  Wifi,
  Volume2,
  Battery,
  Power,
  Grid,
  FileCode,
  Folder,
  FolderOpen,
  Layers,
  ChevronDown,
  Monitor,
  HardDrive,
  Cpu,
  PackageCheck,
  Activity,
  Globe,
  Palette,
  Flame,
  Gauge,
  Box,
  Binary,
  Compass,
  Play,
  Settings as SettingsIcon,
  Code2,
} from 'lucide-react';
import { ActiveAppId, DistroConfiguration, WindowState } from '../../types/distro';
import { WindowFrame } from './WindowFrame';
import { TerminalApp } from '../Apps/TerminalApp';
import { ClaudeApp } from '../Apps/ClaudeApp';
import { ChatGPTApp } from '../Apps/ChatGPTApp';
import { AndroidStudioApp } from '../Apps/AndroidStudioApp';
import { LutrisApp } from '../Apps/LutrisApp';
import { DistroConfigPanel } from '../Apps/DistroConfigPanel';
import { SynapticApp } from '../Apps/SynapticApp';
import { HardInfoApp } from '../Apps/HardInfoApp';
import { Apache2App } from '../Apps/Apache2App';
import { GeminiApp } from '../Apps/GeminiApp';
import { SettingsApp } from '../Apps/SettingsApp';
import { ThunarApp } from '../Apps/ThunarApp';
import { SteamApp } from '../Apps/SteamApp';
import { Q4WineApp } from '../Apps/Q4WineApp';
import { MangoappApp } from '../Apps/MangoappApp';
import { CmatrixApp } from '../Apps/CmatrixApp';
import { TdfsbApp } from '../Apps/TdfsbApp';
import { SystemDashboardApp } from '../Apps/SystemDashboardApp';
import { DisplayManagerApp } from '../Apps/DisplayManagerApp';
import { PythonCompilerApp } from '../Apps/PythonCompilerApp';

interface DesktopEnvironmentProps {
  config: DistroConfiguration;
  onUpdateConfig: (newConfig: DistroConfiguration) => void;
  onOpenExportModal: () => void;
}

export const DesktopEnvironment: React.FC<DesktopEnvironmentProps> = ({
  config,
  onUpdateConfig,
  onOpenExportModal,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [showAppDrawer, setShowAppDrawer] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [activeZIndex, setActiveZIndex] = useState(10);
  const [currentTheme, setCurrentTheme] = useState('default');

  const handleSelectTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    if (themeId === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  // Initial Window States
  const [windows, setWindows] = useState<Record<ActiveAppId, WindowState>>({
    'distro-builder': {
      id: 'distro-builder',
      title: `${config.distroName} — Configuration & PPA Manager`,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      position: { x: 80, y: 50 },
      size: { width: 940, height: 600 },
    },
    terminal: {
      id: 'terminal',
      title: `Terminal — ${config.defaultUsername}@${config.hostname}: ~ (bash)`,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 6,
      position: { x: 140, y: 90 },
      size: { width: 780, height: 480 },
    },
    gemini: {
      id: 'gemini',
      title: 'Gemini AI Linux Distro Architect (Multi-turn)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 14,
      position: { x: 130, y: 70 },
      size: { width: 880, height: 580 },
    },
    claude: {
      id: 'claude',
      title: 'Anthropic Claude Desktop (Linux x86_64)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 7,
      position: { x: 180, y: 80 },
      size: { width: 840, height: 560 },
    },
    chatgpt: {
      id: 'chatgpt',
      title: 'OpenAI ChatGPT Linux Client',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 8,
      position: { x: 220, y: 90 },
      size: { width: 800, height: 540 },
    },
    'android-studio': {
      id: 'android-studio',
      title: 'Android Studio Ladybug (2024.2.1) — ApexApp',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 9,
      position: { x: 100, y: 60 },
      size: { width: 980, height: 620 },
    },
    lutris: {
      id: 'lutris',
      title: 'Lutris Open Gaming Platform (Wine 9.21 & Proton-GE)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 160, y: 70 },
      size: { width: 920, height: 580 },
    },
    'package-manager': {
      id: 'package-manager',
      title: 'Ubuntu APT & PPA Software Center',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 4,
      position: { x: 200, y: 100 },
      size: { width: 820, height: 520 },
    },
    synaptic: {
      id: 'synaptic',
      title: 'Synaptic Package Manager (APT)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 11,
      position: { x: 190, y: 80 },
      size: { width: 880, height: 560 },
    },
    hardinfo: {
      id: 'hardinfo',
      title: 'HardInfo 0.6 — System Profiler and Benchmark',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 12,
      position: { x: 210, y: 90 },
      size: { width: 860, height: 540 },
    },
    apache2: {
      id: 'apache2',
      title: 'Apache HTTP Server 2.4 — Localhost & Service Manager',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 13,
      position: { x: 230, y: 100 },
      size: { width: 840, height: 520 },
    },
    'file-manager': {
      id: 'file-manager',
      title: 'Files — /etc/apt/sources.list.d',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 3,
      position: { x: 240, y: 110 },
      size: { width: 740, height: 460 },
    },
    'system-settings': {
      id: 'system-settings',
      title: 'System Settings — Themes & Hardware',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 2,
      position: { x: 240, y: 100 },
      size: { width: 840, height: 560 },
    },
    thunar: {
      id: 'thunar',
      title: 'Thunar 4.18.11 — File Manager (XFCE / GTK)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 15,
      position: { x: 170, y: 80 },
      size: { width: 880, height: 560 },
    },
    steam: {
      id: 'steam',
      title: 'Steam (Wine 9.21 Staging & Proton 9.0 Compatibility)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 16,
      position: { x: 140, y: 70 },
      size: { width: 960, height: 600 },
    },
    q4wine: {
      id: 'q4wine',
      title: 'q4wine 1.3.14 — Qt GUI Wine Prefix Manager',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 17,
      position: { x: 200, y: 90 },
      size: { width: 880, height: 550 },
    },
    mangoapp: {
      id: 'mangoapp',
      title: 'Mangoapp & MangoHud — Performance HUD Overlay Runner',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 18,
      position: { x: 220, y: 100 },
      size: { width: 860, height: 540 },
    },
    cmatrix: {
      id: 'cmatrix',
      title: 'cmatrix v2.0 — Console Digital Rain (Matrix)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 19,
      position: { x: 250, y: 110 },
      size: { width: 800, height: 520 },
    },
    tdfsb: {
      id: 'tdfsb',
      title: 'TDFSB (Modded) — 3D File System Browser (OpenGL/Three.js)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 20,
      position: { x: 120, y: 60 },
      size: { width: 940, height: 620 },
    },
    'system-dashboard': {
      id: 'system-dashboard',
      title: 'ApexOS System Dashboard & Hardware Telemetry (CPU / RAM / GPU)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 21,
      position: { x: 130, y: 65 },
      size: { width: 920, height: 600 },
    },
    'display-manager': {
      id: 'display-manager',
      title: 'Display & Screen Manager — Multi-Monitor, Resolutions, VRR & DM Services',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 22,
      position: { x: 150, y: 70 },
      size: { width: 940, height: 640 },
    },
    'python-compiler': {
      id: 'python-compiler',
      title: 'Python 3.12 Compiler Pro — Interactive IDE & Run Prompt',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 23,
      position: { x: 160, y: 75 },
      size: { width: 960, height: 620 },
    },
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const openApp = (appId: ActiveAppId) => {
    const nextZ = activeZIndex + 1;
    setActiveZIndex(nextZ);
    setWindows((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
    setShowAppDrawer(false);
  };

  const closeWindow = (appId: ActiveAppId) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isOpen: false },
    }));
  };

  const minimizeWindow = (appId: ActiveAppId) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isMinimized: true },
    }));
  };

  const maximizeWindow = (appId: ActiveAppId) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], isMaximized: !prev[appId].isMaximized },
    }));
  };

  const focusWindow = (appId: ActiveAppId) => {
    const nextZ = activeZIndex + 1;
    setActiveZIndex(nextZ);
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], zIndex: nextZ, isMinimized: false },
    }));
  };

  const moveWindow = (appId: ActiveAppId, x: number, y: number) => {
    setWindows((prev) => ({
      ...prev,
      [appId]: { ...prev[appId], position: { x, y } },
    }));
  };

  const dockApps = [
    { id: 'distro-builder' as ActiveAppId, name: 'Distro Architect & PPAs', icon: <Sliders className="w-5 h-5 text-amber-400" /> },
    { id: 'python-compiler' as ActiveAppId, name: 'Python 3.12 Compiler & IDE', icon: <Code2 className="w-5 h-5 text-amber-400" /> },
    { id: 'system-dashboard' as ActiveAppId, name: 'System Dashboard (CPU/RAM/GPU)', icon: <Activity className="w-5 h-5 text-emerald-400" /> },
    { id: 'display-manager' as ActiveAppId, name: 'Display & Screen Manager', icon: <Monitor className="w-5 h-5 text-indigo-400" /> },
    { id: 'terminal' as ActiveAppId, name: 'Terminal (bash & boot)', icon: <Terminal className="w-5 h-5 text-emerald-400" /> },
    { id: 'thunar' as ActiveAppId, name: 'Thunar File Manager', icon: <FolderOpen className="w-5 h-5 text-sky-400" /> },
    { id: 'steam' as ActiveAppId, name: 'Steam (Wine & Proton)', icon: <Flame className="w-5 h-5 text-red-400" /> },
    { id: 'q4wine' as ActiveAppId, name: 'q4wine Prefix Manager', icon: <Box className="w-5 h-5 text-purple-400" /> },
    { id: 'mangoapp' as ActiveAppId, name: 'Mangoapp HUD Overlay', icon: <Gauge className="w-5 h-5 text-emerald-400" /> },
    { id: 'cmatrix' as ActiveAppId, name: 'cmatrix Digital Rain', icon: <Binary className="w-5 h-5 text-green-400" /> },
    { id: 'tdfsb' as ActiveAppId, name: 'TDFSB 3D Browser (Modded)', icon: <Compass className="w-5 h-5 text-cyan-400" /> },
    { id: 'synaptic' as ActiveAppId, name: 'Synaptic Package Manager', icon: <PackageCheck className="w-5 h-5 text-amber-400" /> },
    { id: 'hardinfo' as ActiveAppId, name: 'HardInfo System Benchmark', icon: <Activity className="w-5 h-5 text-cyan-400" /> },
    { id: 'apache2' as ActiveAppId, name: 'Apache2 Web Server (Port 80)', icon: <Globe className="w-5 h-5 text-emerald-400" /> },
    { id: 'lutris' as ActiveAppId, name: 'Lutris Gaming Platform', icon: <Gamepad2 className="w-5 h-5 text-amber-300" /> },
    { id: 'android-studio' as ActiveAppId, name: 'Android Studio IDE', icon: <Smartphone className="w-5 h-5 text-cyan-400" /> },
    { id: 'system-settings' as ActiveAppId, name: 'Settings & Theme Selector', icon: <Palette className="w-5 h-5 text-amber-400" /> },
    { id: 'gemini' as ActiveAppId, name: 'Gemini AI Distro Architect', icon: <Sparkles className="w-5 h-5 text-cyan-400" /> },
    { id: 'claude' as ActiveAppId, name: 'Claude Desktop', icon: <Bot className="w-5 h-5 text-amber-400" /> },
    { id: 'chatgpt' as ActiveAppId, name: 'ChatGPT Desktop', icon: <Sparkles className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans select-none flex flex-col">
      {/* Linux Wallpaper Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-300"
        style={{
          backgroundImage: `url('/src/assets/images/apex_linux_wallpaper_1793590006758.jpg')`,
        }}
      >
        {/* Subtle vignette gradient with CSS theme variable */}
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: `radial-gradient(circle at center, transparent 30%, var(--theme-vignette, rgba(2, 6, 23, 0.75)) 100%)`,
          }}
        ></div>
      </div>

      {/* Top Status Bar (Ubuntu GNOME 47 Style) */}
      <div className="relative z-40 h-8 px-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-xs flex items-center justify-between text-slate-200">
        {/* Left: Activities & Distro Codename */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAppDrawer(!showAppDrawer)}
            className="hover:text-white font-semibold transition px-2 py-0.5 rounded hover:bg-slate-800/80 flex items-center gap-1.5"
          >
            <span>Activities</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-amber-400 font-medium">
            {config.distroName} ({config.codename})
          </span>
        </div>

        {/* Center: Live Clock */}
        <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-xs tracking-wide">
          {timeStr}
        </div>

        {/* Right: Quick Settings & Export Action */}
        <div className="flex items-center gap-3">
          {/* Real-time System Dashboard Toggle Pill */}
          <button
            onClick={() => {
              if (windows['system-dashboard'].isOpen) {
                closeWindow('system-dashboard');
              } else {
                openApp('system-dashboard');
              }
            }}
            className="flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 hover:text-white transition shadow-sm"
            title="Click to toggle Live System Dashboard & Hardware Telemetry"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline text-slate-300">
              CPU <span className="text-emerald-400 font-semibold">25%</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">
              RAM <span className="text-sky-400 font-semibold">10.4G</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-slate-300">
              GPU <span className="text-amber-400 font-semibold">58°C</span>
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline text-slate-300">
              BAT <span className="text-emerald-400 font-semibold">88% (14W)</span>
            </span>
          </button>

          <button
            onClick={() => openApp('display-manager')}
            className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Display Manager & Multi-Monitor Resolution Studio"
          >
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            <span>Displays</span>
          </button>

          <button
            onClick={() => openApp('system-settings')}
            className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Desktop Theme & System Settings"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{currentTheme}</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold text-[11px] transition shadow"
          >
            <Download className="w-3 h-3" />
            <span>Export ISO</span>
          </button>

          <div
            onClick={() => setShowQuickSettings(!showQuickSettings)}
            className="flex items-center gap-2 px-2 py-0.5 rounded hover:bg-slate-800/80 cursor-pointer transition text-slate-300 hover:text-white"
          >
            <Wifi className="w-3.5 h-3.5" />
            <Volume2 className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Quick Settings Dropdown with Quick Theme Switcher */}
      {showQuickSettings && (
        <div className="absolute top-9 right-4 z-50 w-80 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-xl text-xs text-slate-200 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold">
            <span>System Telemetry & Themes</span>
            <span className="text-[10px] font-mono text-emerald-400">Linux 6.11 XanMod</span>
          </div>

          {/* Quick Theme Swatches */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Color Scheme:</span>
              <button
                onClick={() => {
                  setShowQuickSettings(false);
                  openApp('system-settings');
                }}
                className="text-amber-400 hover:underline text-[10px]"
              >
                All Themes →
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1.5 pt-0.5">
              {[
                { id: 'default', color: '#f59e0b', name: 'Ubuntu' },
                { id: 'midnight-blue', color: '#3b82f6', name: 'Navy' },
                { id: 'cyberpunk', color: '#facc15', name: 'Cyber' },
                { id: 'forest-green', color: '#10b981', name: 'Forest' },
                { id: 'solarized-dark', color: '#2aa198', name: 'Solar' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => handleSelectTheme(th.id)}
                  title={th.name}
                  className={`p-1.5 rounded-lg border flex flex-col items-center gap-1 transition ${
                    currentTheme === th.id
                      ? 'bg-slate-800 border-white ring-1 ring-white/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shadow-inner"
                    style={{ backgroundColor: th.color }}
                  ></span>
                  <span className="text-[9px] font-mono text-slate-300 truncate w-full text-center">
                    {th.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300 pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Active PPAs:</span>
              <span className="font-mono text-amber-400">
                {config.repositories.filter((r) => r.enabled).length} Enabled
              </span>
            </div>
            <div className="flex justify-between">
              <span>Android KVM Accel:</span>
              <span className="font-mono text-emerald-400">Hardware Direct</span>
            </div>
            <div className="flex justify-between">
              <span>Lutris GameMode:</span>
              <span className="font-mono text-emerald-400">Daemon Active</span>
            </div>
            <div className="flex justify-between">
              <span>Battery (BAT0):</span>
              <span className="font-mono text-emerald-400">88.4% • 14.2W (7.0% Wear)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setShowQuickSettings(false);
                openApp('display-manager');
              }}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition border border-slate-700 flex items-center justify-center gap-1"
            >
              <Monitor className="w-3 h-3 text-indigo-400" />
              <span>Displays</span>
            </button>
            <button
              onClick={() => {
                setShowQuickSettings(false);
                openApp('system-settings');
              }}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs transition border border-slate-700"
            >
              Settings
            </button>
            <button
              onClick={() => {
                setShowQuickSettings(false);
                onOpenExportModal();
              }}
              className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition"
            >
              Build ISO
            </button>
          </div>
        </div>
      )}

      {/* Workspace Canvas & Windows Container */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Ubuntu Dock */}
        <div className="relative z-30 w-16 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col items-center py-2.5 justify-between shrink-0 h-full">
          {/* Applications list */}
          <div className="flex flex-col items-center gap-2 overflow-y-auto overflow-x-hidden flex-1 w-full py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {dockApps.map((app) => {
              const win = windows[app.id];
              const isRunning = win?.isOpen;
              return (
                <button
                  key={app.id}
                  onClick={() => openApp(app.id)}
                  title={app.name}
                  className={`group relative w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${
                    isRunning
                      ? 'bg-slate-800 text-white shadow-lg ring-1 ring-slate-700'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {app.icon}
                  {/* Ubuntu Active Dot indicator */}
                  {isRunning && (
                    <span className="absolute -left-1 w-1 h-3 rounded-r-full bg-amber-400"></span>
                  )}
                  {/* Tooltip on hover */}
                  <span className="absolute left-14 px-2 py-1 bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom App Drawer Trigger */}
          <div className="pt-2 border-t border-slate-800/60 w-full flex justify-center">
            <button
              onClick={() => setShowAppDrawer(!showAppDrawer)}
              title="Show Applications (Grid)"
              className="w-10 h-10 rounded-xl hover:bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Surface Shortcuts */}
        <div className="absolute inset-0 pl-20 pt-4 p-4 pointer-events-none grid grid-cols-2 md:grid-cols-2 gap-2.5 max-w-xs z-10 max-h-[calc(100vh-60px)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div
            onClick={() => openApp('python-compiler')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full font-mono">
              Python IDE
            </span>
          </div>

          <div
            onClick={() => openApp('system-dashboard')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              Dashboard
            </span>
          </div>

          <div
            onClick={() => openApp('terminal')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <FileCode className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 font-mono truncate w-full">
              build-iso.sh
            </span>
          </div>

          <div
            onClick={() => openApp('terminal')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Terminal className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 font-mono truncate w-full">
              install-distro.sh
            </span>
          </div>

          <div
            onClick={() => openApp('thunar')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-sky-500/40 text-sky-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              Thunar
            </span>
          </div>

          <div
            onClick={() => openApp('steam')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-red-500/40 text-red-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              Steam Wine
            </span>
          </div>

          <div
            onClick={() => openApp('q4wine')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-purple-500/40 text-purple-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Box className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              q4wine
            </span>
          </div>

          <div
            onClick={() => openApp('mangoapp')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Gauge className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              Mangoapp
            </span>
          </div>

          <div
            onClick={() => openApp('cmatrix')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-green-500/40 text-green-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Binary className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full font-mono">
              cmatrix
            </span>
          </div>

          <div
            onClick={() => openApp('tdfsb')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              TDFSB 3D
            </span>
          </div>

          <div
            onClick={() => openApp('display-manager')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Monitor className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              Displays
            </span>
          </div>

          <div
            onClick={() => openApp('lutris')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              Lutris
            </span>
          </div>

          <div
            onClick={() => openApp('gemini')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-cyan-500/50 text-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              Gemini AI
            </span>
          </div>

          <div
            onClick={() => openApp('synaptic')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <PackageCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              Synaptic
            </span>
          </div>

          <div
            onClick={() => openApp('hardinfo')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              HardInfo
            </span>
          </div>

          <div
            onClick={() => openApp('apache2')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-22 text-center transition group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow-md mt-1 truncate w-full">
              Apache2
            </span>
          </div>

          <div
            onClick={() => openApp('system-settings')}
            className="pointer-events-auto flex flex-col items-center p-2 rounded-xl hover:bg-white/10 cursor-pointer w-24 text-center transition group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Palette className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-white drop-shadow-md mt-1">
              Themes & Settings
            </span>
          </div>
        </div>

        {/* Windows Rendering */}
        {/* Window 1: Distro Config Panel */}
        <WindowFrame
          window={windows['distro-builder']}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Sliders className="w-4 h-4 text-amber-400" />}
        >
          <DistroConfigPanel
            config={config}
            onUpdateConfig={onUpdateConfig}
            onOpenExportModal={onOpenExportModal}
            onOpenGemini={() => openApp('gemini')}
          />
        </WindowFrame>

        {/* Window: Gemini AI Distro Architect */}
        <WindowFrame
          window={windows.gemini}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Sparkles className="w-4 h-4 text-cyan-400" />}
        >
          <GeminiApp
            config={config}
            onAddCustomPpa={(newPpa) => {
              onUpdateConfig({
                ...config,
                repositories: [...config.repositories, newPpa],
              });
            }}
          />
        </WindowFrame>

        {/* Window 2: Terminal */}
        <WindowFrame
          window={windows.terminal}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Terminal className="w-4 h-4 text-emerald-400" />}
        >
          <TerminalApp config={config} onOpenApp={openApp} />
        </WindowFrame>

        {/* Window 3: Claude Desktop */}
        <WindowFrame
          window={windows.claude}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Bot className="w-4 h-4 text-amber-400" />}
        >
          <ClaudeApp config={config} />
        </WindowFrame>

        {/* Window 4: ChatGPT Desktop */}
        <WindowFrame
          window={windows.chatgpt}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
        >
          <ChatGPTApp config={config} />
        </WindowFrame>

        {/* Window 5: Android Studio */}
        <WindowFrame
          window={windows['android-studio']}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Smartphone className="w-4 h-4 text-cyan-400" />}
        >
          <AndroidStudioApp config={config} />
        </WindowFrame>

        {/* Window 6: Lutris */}
        <WindowFrame
          window={windows.lutris}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Gamepad2 className="w-4 h-4 text-amber-400" />}
        >
          <LutrisApp config={config} />
        </WindowFrame>

        {/* Window 7: Synaptic Package Manager */}
        <WindowFrame
          window={windows.synaptic}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<PackageCheck className="w-4 h-4 text-amber-400" />}
        >
          <SynapticApp config={config} onUpdateConfig={onUpdateConfig} />
        </WindowFrame>

        {/* Window 8: HardInfo System Profiler & Benchmark */}
        <WindowFrame
          window={windows.hardinfo}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Activity className="w-4 h-4 text-cyan-400" />}
        >
          <HardInfoApp config={config} />
        </WindowFrame>

        {/* Window 9: Apache2 Web Server Manager */}
        <WindowFrame
          window={windows.apache2}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Globe className="w-4 h-4 text-emerald-400" />}
        >
          <Apache2App config={config} />
        </WindowFrame>

        {/* Window 10: System Settings & Theme Selector */}
        <WindowFrame
          window={windows['system-settings']}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Palette className="w-4 h-4 text-amber-400" />}
        >
          <SettingsApp
            config={config}
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
            onOpenDisplayManager={() => openApp('display-manager')}
          />
        </WindowFrame>

        {/* Window 11: Thunar File Manager */}
        <WindowFrame
          window={windows.thunar}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<FolderOpen className="w-4 h-4 text-sky-400" />}
        >
          <ThunarApp config={config} />
        </WindowFrame>

        {/* Window 12: Steam (Wine & Proton) */}
        <WindowFrame
          window={windows.steam}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Flame className="w-4 h-4 text-red-400" />}
        >
          <SteamApp config={config} />
        </WindowFrame>

        {/* Window 13: q4wine Qt Prefix Manager */}
        <WindowFrame
          window={windows.q4wine}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Box className="w-4 h-4 text-purple-400" />}
        >
          <Q4WineApp config={config} />
        </WindowFrame>

        {/* Window 14: Mangoapp & MangoHud */}
        <WindowFrame
          window={windows.mangoapp}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Gauge className="w-4 h-4 text-emerald-400" />}
        >
          <MangoappApp config={config} />
        </WindowFrame>

        {/* Window 15: cmatrix Console Digital Rain */}
        <WindowFrame
          window={windows.cmatrix}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Binary className="w-4 h-4 text-green-400" />}
        >
          <CmatrixApp config={config} />
        </WindowFrame>

        {/* Window 16: TDFSB (Modded) 3D File System Browser */}
        <WindowFrame
          window={windows.tdfsb}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Compass className="w-4 h-4 text-cyan-400" />}
        >
          <TdfsbApp config={config} onOpenApp={openApp} />
        </WindowFrame>

        {/* Window 17: System Dashboard & Hardware Telemetry */}
        <WindowFrame
          window={windows['system-dashboard']}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Activity className="w-4 h-4 text-emerald-400" />}
        >
          <SystemDashboardApp config={config} />
        </WindowFrame>

        {/* Window 18: Display & Screen Manager */}
        <WindowFrame
          window={windows['display-manager']}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Monitor className="w-4 h-4 text-indigo-400" />}
        >
          <DisplayManagerApp config={config} />
        </WindowFrame>

        {/* Window 19: Python 3.12 Compiler & Interactive IDE */}
        <WindowFrame
          window={windows['python-compiler']}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMaximize={maximizeWindow}
          onFocus={focusWindow}
          onMove={moveWindow}
          icon={<Code2 className="w-4 h-4 text-amber-400" />}
        >
          <PythonCompilerApp config={config} />
        </WindowFrame>
      </div>

      {/* Applications Drawer Modal (Full GNOME App Grid) */}
      {showAppDrawer && (
        <div
          onClick={() => setShowAppDrawer(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl space-y-8 text-center"
          >
            <h2 className="text-xl font-bold text-white tracking-wide">
              {config.distroName} Applications
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
              {dockApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => openApp(app.id)}
                  className="flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:bg-slate-800/80 transition group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition shadow-xl">
                    {app.icon}
                  </div>
                  <span className="text-xs font-medium text-slate-200 group-hover:text-amber-400 transition">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-6">
              <span>Kernel: {config.kernelVariant}</span>
              <span aria-hidden="true">·</span>
              <span>Debootstrap Ubuntu {config.codename}</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => {
                  setShowAppDrawer(false);
                  onOpenExportModal();
                }}
                className="text-amber-400 hover:underline font-semibold"
              >
                Export ISO Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
