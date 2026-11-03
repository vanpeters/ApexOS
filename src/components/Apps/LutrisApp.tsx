import React, { useState } from 'react';
import {
  Gamepad2,
  Play,
  Settings2,
  Sliders,
  Check,
  Disc,
  FolderOpen,
  Plus,
  Search,
  Zap,
  Flame,
  Volume2,
  X,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface LutrisAppProps {
  config: DistroConfiguration;
}

interface GameItem {
  id: string;
  name: string;
  runner: 'wine' | 'steam' | 'linux';
  wineVersion: string;
  status: 'installed' | 'ready';
  bannerBg: string;
  genre: string;
  playtime: string;
  dxvkVersion: string;
}

export const LutrisApp: React.FC<LutrisAppProps> = ({ config }) => {
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'installed' | 'wine'>('all');
  const [runningGame, setRunningGame] = useState<GameItem | null>(null);
  const [fps, setFps] = useState(144);
  const [showConfig, setShowConfig] = useState(false);

  // Settings
  const [gamemodeActive, setGamemodeActive] = useState(config.enableGamemode);
  const [dxvkActive, setDxvkActive] = useState(true);
  const [fsrActive, setFsrActive] = useState(true);
  const [selectedRunner, setSelectedRunner] = useState('GE-Proton9-20 (Lutris PPA)');

  const gamesList: GameItem[] = [
    {
      id: 'cyberpunk',
      name: 'Cyberpunk 2077: Phantom Liberty',
      runner: 'wine',
      wineVersion: 'GE-Proton9-20',
      status: 'installed',
      bannerBg: 'from-amber-600 via-rose-700 to-slate-900',
      genre: 'Action RPG / Ray Tracing',
      playtime: '84h 12m',
      dxvkVersion: 'DXVK 2.4.1 (Async)',
    },
    {
      id: 'bg3',
      name: "Baldur's Gate 3",
      runner: 'wine',
      wineVersion: 'Wine-Staging 9.21',
      status: 'installed',
      bannerBg: 'from-blue-700 via-indigo-800 to-slate-900',
      genre: 'CRPG / Vulkan 1.3',
      playtime: '128h 45m',
      dxvkVersion: 'VKD3D-Proton 2.13',
    },
    {
      id: 'witcher3',
      name: 'The Witcher 3: Wild Hunt (Next-Gen)',
      runner: 'wine',
      wineVersion: 'GE-Proton9-20',
      status: 'installed',
      bannerBg: 'from-rose-900 via-stone-800 to-slate-950',
      genre: 'Open World RPG',
      playtime: '210h 30m',
      dxvkVersion: 'DXVK 2.4.1',
    },
    {
      id: 'overwatch2',
      name: 'Overwatch 2 (Battle.net)',
      runner: 'wine',
      wineVersion: 'Lutris-GE-8-26',
      status: 'installed',
      bannerBg: 'from-orange-600 via-amber-800 to-slate-900',
      genre: 'Hero Shooter',
      playtime: '42h 10m',
      dxvkVersion: 'DXVK-NVAPI',
    },
  ];

  const filteredGames = gamesList.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterCategory === 'wine') return matchesSearch && g.runner === 'wine';
    return matchesSearch;
  });

  const launchGame = (game: GameItem) => {
    setRunningGame(game);
    setFps(140 + Math.floor(Math.random() * 15));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Lutris Header */}
      <div className="h-11 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-wide text-white">Lutris 0.5.17</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400">
            PPA: <span className="font-mono text-amber-400">ppa:lutris-team/lutris</span>
          </span>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-44 pl-8 pr-3 py-1 bg-slate-950 border border-slate-700/80 rounded-md text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition ${
              showConfig
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Runner Config</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Category Filter */}
        <div className="w-52 bg-slate-900/60 border-r border-slate-800/80 p-3 flex flex-col justify-between shrink-0 text-xs text-slate-300">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Gaming Runners
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setFilterCategory('all')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition ${
                  filterCategory === 'all'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>All Games</span>
                <span className="font-mono text-[10px]">{gamesList.length}</span>
              </button>
              <button
                onClick={() => setFilterCategory('wine')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition ${
                  filterCategory === 'wine'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Disc className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wine / Proton</span>
                </div>
                <span className="font-mono text-[10px]">4</span>
              </button>
            </div>
          </div>

          {/* Quick System Driver Status */}
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Kisak Mesa 24.3 PPA</span>
            </div>
            <p className="text-slate-400 text-[10px]">Vulkan 1.3.296 & DXVK Async enabled for low latency gaming.</p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <span>GameMode:</span>
              <span className="text-emerald-400 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Games Library Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`group relative rounded-xl overflow-hidden border transition cursor-pointer flex flex-col justify-between ${
                  selectedGame?.id === game.id
                    ? 'border-amber-500 ring-1 ring-amber-500 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/80 hover:bg-slate-900'
                }`}
              >
                {/* Banner Gradient */}
                <div className={`h-28 bg-gradient-to-r ${game.bannerBg} p-4 flex flex-col justify-between relative`}>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-amber-300 uppercase tracking-wider backdrop-blur-xs">
                      {game.runner.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-200 font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                      {game.playtime}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base leading-tight drop-shadow-sm group-hover:text-amber-300 transition">
                      {game.name}
                    </h3>
                    <p className="text-[11px] text-slate-300 drop-shadow-xs mt-0.5">{game.genre}</p>
                  </div>
                </div>

                {/* Footer specs & Launch Button */}
                <div className="p-3 bg-slate-950/90 flex items-center justify-between text-xs border-t border-slate-800/80">
                  <div className="space-y-0.5">
                    <div className="text-[10px] text-slate-400 font-mono">
                      Runner: <span className="text-slate-200 font-medium">{game.wineVersion}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      DirectX: <span className="text-amber-400 font-medium">{game.dxvkVersion}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      launchGame(game);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition active:scale-95 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Runner Config Drawer */}
        {showConfig && (
          <div className="w-72 bg-slate-950 border-l border-slate-800 p-4 flex flex-col justify-between shrink-0 text-xs text-slate-300 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Global Runner Options
                </span>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Wine Version */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Default Wine Runner
                </label>
                <select
                  value={selectedRunner}
                  onChange={(e) => setSelectedRunner(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none"
                >
                  <option value="GE-Proton9-20 (Lutris PPA)">GE-Proton 9.20 (Lutris PPA)</option>
                  <option value="Wine-Staging 9.21 (WineHQ)">Wine-Staging 9.21 (WineHQ repo)</option>
                  <option value="Lutris-GE-8-26">Lutris-GE-8.26-x86_64</option>
                  <option value="System Wine 9.0">System Wine 9.0 (Ubuntu Noble)</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div>
                    <div className="font-semibold text-white">Enable GameMode</div>
                    <div className="text-[10px] text-slate-400">Sets CPU governor to performance</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={gamemodeActive}
                    onChange={(e) => setGamemodeActive(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div>
                    <div className="font-semibold text-white">DXVK & VKD3D-Proton</div>
                    <div className="text-[10px] text-slate-400">DirectX 11/12 to Vulkan translation</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={dxvkActive}
                    onChange={(e) => setDxvkActive(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div>
                    <div className="font-semibold text-white">AMD FSR 3 Upscaling</div>
                    <div className="text-[10px] text-slate-400">FidelityFX Super Resolution</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={fsrActive}
                    onChange={(e) => setFsrActive(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-400">
              Settings automatically applied to system `/etc/lutris.conf`.
            </div>
          </div>
        )}
      </div>

      {/* Simulated Active Game Running Modal */}
      {runningGame && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-950 border border-amber-500/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Titlebar with MangoHud telemetry */}
            <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-white">{runningGame.name}</span>
                <span className="text-slate-500">|</span>
                <span className="font-mono text-emerald-400 font-bold">{fps} FPS</span>
                <span className="text-slate-400 font-mono text-[11px]">Vulkan 1.3 / DXVK 2.4</span>
              </div>
              <button
                onClick={() => setRunningGame(null)}
                className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-md transition font-medium text-xs"
              >
                Exit Game
              </button>
            </div>

            {/* Game Canvas Simulator */}
            <div className={`h-80 bg-gradient-to-tr ${runningGame.bannerBg} flex flex-col items-center justify-center p-8 relative overflow-hidden`}>
              {/* MangoHud Overlay in Top Left */}
              <div className="absolute top-3 left-3 bg-black/70 p-2.5 rounded-md font-mono text-[10px] text-emerald-400 border border-slate-800 backdrop-blur-xs space-y-0.5">
                <div>GPU: AMD RX 7900 XTX 62°C (98%)</div>
                <div>CPU: 5800X3D 54°C (42%)</div>
                <div>RAM: 14.2 GB / VRAM: 11.4 GB</div>
                <div>MESA: 24.3.0-devel (Kisak PPA)</div>
                <div>RUNNER: {runningGame.wineVersion}</div>
              </div>

              <div className="text-center space-y-3 z-10">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg">
                  <Flame className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wide">{runningGame.name}</h2>
                  <p className="text-xs text-slate-300 mt-1">Simulated gameplay running on Linux 6.11 XanMod with GameMode</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/60 rounded-full text-xs font-mono text-amber-400 border border-amber-500/30">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>PipeWire Low-Latency Audio 48kHz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
