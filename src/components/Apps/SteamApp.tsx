import React, { useState } from 'react';
import {
  Flame,
  Play,
  Square,
  Settings,
  Download,
  Shield,
  Layers,
  Cpu,
  Gamepad2,
  HardDrive,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface SteamAppProps {
  config: DistroConfiguration;
}

interface SteamGame {
  id: string;
  title: string;
  status: 'Ready to Play' | 'Update Required' | 'Installed';
  size: string;
  hoursPlayed: string;
  protonVersion: string;
  compatibilityBadge: 'Verified' | 'Playable' | 'Native Linux';
  launchOptions: string;
  bannerBg: string;
}

export const SteamApp: React.FC<SteamAppProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<'library' | 'compatibility' | 'downloads'>('library');
  const [selectedGameId, setSelectedGameId] = useState<string>('cyberpunk');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [globalProton, setGlobalProton] = useState<string>('GE-Proton9-20');
  const [enableSteamPlayAll, setEnableSteamPlayAll] = useState<boolean>(true);
  const [enableShaderPrecache, setEnableShaderPrecache] = useState<boolean>(true);
  const [simulatedFps, setSimulatedFps] = useState<number>(118);

  const games: SteamGame[] = [
    {
      id: 'cyberpunk',
      title: 'Cyberpunk 2077',
      status: 'Ready to Play',
      size: '68.4 GB',
      hoursPlayed: '142.5 hrs',
      protonVersion: 'GE-Proton9-20',
      compatibilityBadge: 'Verified',
      launchOptions: 'gamemoderun mangohud %command% -dx12',
      bannerBg: 'from-amber-600/40 via-purple-900/40 to-slate-950',
    },
    {
      id: 'bg3',
      title: "Baldur's Gate 3",
      status: 'Ready to Play',
      size: '122.0 GB',
      hoursPlayed: '88.2 hrs',
      protonVersion: 'Proton 9.0-3',
      compatibilityBadge: 'Verified',
      launchOptions: 'gamemoderun %command% --vulkan',
      bannerBg: 'from-blue-600/40 via-indigo-900/40 to-slate-950',
    },
    {
      id: 'hl2',
      title: 'Half-Life 2 (20th Anniversary)',
      status: 'Ready to Play',
      size: '8.2 GB',
      hoursPlayed: '210.0 hrs',
      protonVersion: 'Native Linux (Vulkan)',
      compatibilityBadge: 'Native Linux',
      launchOptions: '%command%',
      bannerBg: 'from-amber-500/40 via-stone-800/40 to-slate-950',
    },
    {
      id: 'doom',
      title: 'DOOM Eternal',
      status: 'Ready to Play',
      size: '79.1 GB',
      hoursPlayed: '64.1 hrs',
      protonVersion: 'GE-Proton9-20',
      compatibilityBadge: 'Verified',
      launchOptions: 'mangohud %command%',
      bannerBg: 'from-red-600/40 via-orange-900/40 to-slate-950',
    },
    {
      id: 'cs2',
      title: 'Counter-Strike 2',
      status: 'Ready to Play',
      size: '34.5 GB',
      hoursPlayed: '512.4 hrs',
      protonVersion: 'Native Linux (Vulkan SDL3)',
      compatibilityBadge: 'Native Linux',
      launchOptions: '-high -novid -threads 16',
      bannerBg: 'from-cyan-600/40 via-slate-800/40 to-slate-950',
    },
    {
      id: 'elden',
      title: 'Elden Ring',
      status: 'Ready to Play',
      size: '48.9 GB',
      hoursPlayed: '175.8 hrs',
      protonVersion: 'Proton Experimental',
      compatibilityBadge: 'Verified',
      launchOptions: 'gamemoderun %command%',
      bannerBg: 'from-yellow-700/40 via-amber-950/40 to-slate-950',
    },
  ];

  const selectedGame = games.find((g) => g.id === selectedGameId) || games[0];

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden text-xs">
      {/* Steam Top Bar */}
      <div className="h-10 px-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center text-blue-400">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm tracking-wider text-slate-100">STEAM</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Proton & Wine Staging
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <button
              onClick={() => setActiveTab('library')}
              className={`hover:text-white transition ${activeTab === 'library' ? 'text-white border-b-2 border-blue-500 pb-1 mt-1' : ''}`}
            >
              LIBRARY
            </button>
            <button
              onClick={() => setActiveTab('compatibility')}
              className={`hover:text-white transition ${activeTab === 'compatibility' ? 'text-white border-b-2 border-blue-500 pb-1 mt-1' : ''}`}
            >
              STEAM PLAY & PROTON
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`hover:text-white transition ${activeTab === 'downloads' ? 'text-white border-b-2 border-blue-500 pb-1 mt-1' : ''}`}
            >
              DOWNLOADS
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{config.defaultUsername} (Online)</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-amber-400">Wine 9.21</span>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'library' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Games Sidebar */}
          <div className="w-64 bg-slate-900/60 border-r border-slate-800 flex flex-col justify-between shrink-0">
            <div className="p-3 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Installed Games ({games.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => {
                    setSelectedGameId(game.id);
                    setIsRunning(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition text-left ${
                    selectedGameId === game.id
                      ? 'bg-blue-600/30 border border-blue-500/50 text-white font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Gamepad2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate text-xs">{game.title}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-1 rounded shrink-0 ${
                      game.compatibilityBadge === 'Native Linux'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {game.compatibilityBadge}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Steam Storage:</span>
              <span className="font-mono text-white">412.1 GB Installed</span>
            </div>
          </div>

          {/* Game Detail View */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
            {/* Game Banner Header */}
            <div className={`p-6 bg-gradient-to-r ${selectedGame.bannerBg} border-b border-slate-800 relative`}>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white tracking-wide">
                      {selectedGame.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Steam Deck Verified / Linux
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <div>Status: <strong className="text-emerald-400">{selectedGame.status}</strong></div>
                    <span className="text-slate-600">•</span>
                    <div>Time on Record: <strong>{selectedGame.hoursPlayed}</strong></div>
                    <span className="text-slate-600">•</span>
                    <div>Compatibility: <strong className="text-amber-400">{selectedGame.protonVersion}</strong></div>
                  </div>
                </div>

                {/* Big Action Play Button */}
                <button
                  onClick={handleTogglePlay}
                  className={`px-8 py-3 rounded-xl font-black text-sm tracking-wider flex items-center gap-2 transition shadow-xl ${
                    isRunning
                      ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Square className="w-4 h-4 fill-white" />
                      <span>STOPPING GAME...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>PLAY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Game Runner Overlay if game is running */}
              {isRunning && (
                <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-emerald-500/60 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Zap className="w-4 h-4 animate-bounce" />
                      <span>Running via Wine / Proton: {selectedGame.title}</span>
                    </div>
                    <div className="font-mono text-xs text-amber-400">
                      Wine Prefix: ~/.local/share/Steam/steamapps/compatdata/{selectedGame.id}/pfx
                    </div>
                  </div>

                  {/* Simulated MangoHud Overlay */}
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-6">
                      <div className="text-emerald-400 font-black text-sm">
                        FPS: {simulatedFps}
                      </div>
                      <div className="text-slate-300">
                        CPU: 42°C (18%)
                      </div>
                      <div className="text-slate-300">
                        GPU: 54°C (94%)
                      </div>
                      <div className="text-cyan-400">
                        VRAM: 6.8 GB / 16 GB
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Vulkan 1.3 • DXVK 2.4.1 • MangoHud Active
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Game Options & Properties */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-xs block">Proton Compatibility Layer</span>
                  <select
                    defaultValue={selectedGame.protonVersion}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none text-xs"
                  >
                    <option value="GE-Proton9-20">GE-Proton9-20 (GloriousEggroll Custom)</option>
                    <option value="Proton 9.0-3">Proton 9.0-3 (Valve Official)</option>
                    <option value="Proton Experimental">Proton Experimental (Bleeding Edge)</option>
                    <option value="Wine-GE-8-26">Wine-GE-8-26 (WineHQ Staging)</option>
                  </select>
                  <p className="text-[11px] text-slate-400">
                    Translates DirectX 11/12 and Windows system calls to native Linux Vulkan in real time.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-xs block">Launch Options</span>
                  <input
                    type="text"
                    defaultValue={selectedGame.launchOptions}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-xs text-amber-300 outline-none"
                  />
                  <p className="text-[11px] text-slate-400">
                    Prefix commands like <code className="text-amber-400 font-mono">gamemoderun</code> and <code className="text-amber-400 font-mono">mangohud</code> before <code className="text-amber-400 font-mono">%command%</code>.
                  </p>
                </div>
              </div>

              {/* Wine Prefix Info Box */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-white block">Proton Prefix Configuration (Wine 64-bit)</span>
                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-slate-300">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">WINEPREFIX:</span>
                    <span>~/.local/share/Steam/compatdata/{selectedGame.id}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">D3D TRANSLATION:</span>
                    <span className="text-emerald-400">DXVK 2.4.1 (D3D9/10/11) & VKD3D-Proton (D3D12)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Steam Play & Compatibility Settings Tab */}
      {activeTab === 'compatibility' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Steam Play & Proton Global Settings
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Configure Wine translation and Proton runtime across all Windows titles on ApexOS.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block text-sm">Enable Steam Play for all other titles</span>
                  <p className="text-slate-400 text-[11px]">
                    Allows running any Windows game even if not explicitly verified by Valve.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableSteamPlayAll}
                  onChange={(e) => setEnableSteamPlayAll(e.target.checked)}
                  className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Default Proton Tool
                </label>
                <select
                  value={globalProton}
                  onChange={(e) => setGlobalProton(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none text-xs"
                >
                  <option value="GE-Proton9-20">GE-Proton9-20 (Recommended for ApexOS)</option>
                  <option value="Proton 9.0-3">Proton 9.0-3</option>
                  <option value="Proton Experimental">Proton Experimental</option>
                  <option value="Proton 8.0-5">Proton 8.0-5</option>
                  <option value="Wine-GE-8-26">Wine-GE-8-26</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Shader Pre-Caching (Mesa RADV)</span>
                <p className="text-slate-400 text-[11px]">
                  Downloads pre-compiled Vulkan pipeline caches to eliminate in-game stutter.
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableShaderPrecache}
                onChange={(e) => setEnableShaderPrecache(e.target.checked)}
                className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Downloads Tab */}
      {activeTab === 'downloads' && (
        <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Download Manager</h3>
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-400" />
              <div>
                <span className="font-bold text-white block">Proton 9.0-3 Compatibility Tool</span>
                <span className="text-[11px] text-slate-400 font-mono">1.2 GB / 1.2 GB • 100% Complete</span>
              </div>
            </div>
            <span className="font-mono text-emerald-400 text-xs">Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};
