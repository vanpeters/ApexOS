import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  RotateCcw,
  Check,
  Download,
  Filter,
  Layers,
  Settings,
  Info,
  CheckCircle2,
  Trash2,
  X,
  Plus,
  ShieldCheck,
  Key,
  Globe,
  Sparkles,
  FolderPlus,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  Terminal,
  Copy,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  FileCode,
} from 'lucide-react';
import { DistroConfiguration, PackageItem, PpaRepository } from '../../types/distro';

interface SynapticAppProps {
  config: DistroConfiguration;
  onUpdateConfig?: (newConfig: DistroConfiguration) => void;
}

interface PpaPreset {
  name: string;
  identifier: string;
  sourceLine: string;
  category: 'gaming' | 'ide' | 'ai' | 'system' | 'custom';
  description: string;
  defaultPackage?: {
    name: string;
    version: string;
    size: string;
    description: string;
  };
}

const PPA_PRESETS: PpaPreset[] = [
  {
    name: 'NVIDIA Graphics Drivers PPA',
    identifier: 'ppa:graphics-drivers/ppa',
    sourceLine: 'deb [arch=amd64 signed-by=/etc/apt/keyrings/graphics-drivers.gpg] https://ppa.launchpadcontent.net/graphics-drivers/ppa/ubuntu noble main',
    category: 'gaming',
    description: 'Proprietary and production NVIDIA GPU display drivers for high-performance Linux 3D gaming and CUDA compute.',
    defaultPackage: {
      name: 'nvidia-driver-560',
      version: '560.35.03-0ubuntu1',
      size: '142 MB',
      description: 'NVIDIA driver metapackage with Vulkan 1.3, NVAPI, and Wayland direct scanout support.',
    },
  },
  {
    name: 'OBS Studio Official PPA',
    identifier: 'ppa:obsproject/obs-studio',
    sourceLine: 'deb [arch=amd64 signed-by=/etc/apt/keyrings/obs-studio.gpg] https://ppa.launchpadcontent.net/obsproject/obs-studio/ubuntu noble main',
    category: 'system',
    description: 'Latest builds of Open Broadcaster Software with Wayland PipeWire screen capture and NVENC encoding.',
    defaultPackage: {
      name: 'obs-studio',
      version: '30.2.3-0obsproject1~noble',
      size: '76 MB',
      description: 'Free and open source software for video recording and live streaming.',
    },
  },
  {
    name: 'Python Deadsnakes PPA',
    identifier: 'ppa:deadsnakes/ppa',
    sourceLine: 'deb [arch=amd64 signed-by=/etc/apt/keyrings/deadsnakes.gpg] https://ppa.launchpadcontent.net/deadsnakes/ppa/ubuntu noble main',
    category: 'ide',
    description: 'Multiple Python versions (3.11, 3.12, 3.13) packaged cleanly for Ubuntu development environments.',
    defaultPackage: {
      name: 'python3.13-full',
      version: '3.13.0-1+noble1',
      size: '28.4 MB',
      description: 'Python 3.13 standard library, development headers, and venv tooling.',
    },
  },
  {
    name: 'Kisak Mesa Fresh PPA',
    identifier: 'ppa:kisak/kisak-mesa',
    sourceLine: 'deb [arch=amd64 signed-by=/etc/apt/keyrings/kisak-mesa.gpg] https://ppa.launchpadcontent.net/kisak/kisak-mesa/ubuntu noble main',
    category: 'gaming',
    description: 'Bleeding edge Mesa 24.3+ RADV, Iris, and ANV graphics drivers for optimal Wine and Proton framerates.',
    defaultPackage: {
      name: 'mesa-vulkan-drivers',
      version: '24.3.1-kisak1~noble',
      size: '52 MB',
      description: 'Mesa Vulkan graphics driver stack for AMD Radeon, Intel Arc, and NVIDIA.',
    },
  },
];

export const SynapticApp: React.FC<SynapticAppProps> = ({ config, onUpdateConfig }) => {
  const [selectedSection, setSelectedSection] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(config.packages[0] || null);
  const [markedPackages, setMarkedPackages] = useState<Record<string, 'install' | 'remove'>>({});
  const [isApplying, setIsApplying] = useState(false);
  const [applyProgress, setApplyProgress] = useState(0);

  // New PPA Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [sourceLine, setSourceLine] = useState('');
  const [repoName, setRepoName] = useState('');
  const [category, setCategory] = useState<'gaming' | 'ide' | 'ai' | 'system' | 'custom'>('custom');
  const [description, setDescription] = useState('');
  const [includePackage, setIncludePackage] = useState(true);
  const [packageName, setPackageName] = useState('');
  const [packageVersion, setPackageVersion] = useState('1.0.0-1~noble');
  const [packageSize, setPackageSize] = useState('35 MB');
  const [packageDesc, setPackageDesc] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const sections = [
    'All',
    'Development (IDE & SDK)',
    'Gaming & Wine Runners',
    'AI & Language Models',
    'System Administration',
    'Web Servers & Daemons',
    'Custom PPA Packages',
  ];

  const filteredPackages = config.packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedSection === 'Development (IDE & SDK)') return matchesSearch && pkg.category === 'ide';
    if (selectedSection === 'Gaming & Wine Runners') return matchesSearch && pkg.category === 'gaming';
    if (selectedSection === 'AI & Language Models') return matchesSearch && pkg.category === 'ai';
    if (selectedSection === 'Web Servers & Daemons') return matchesSearch && pkg.name.includes('apache');
    if (selectedSection === 'Custom PPA Packages') return matchesSearch && (pkg.ppaId.includes('custom') || pkg.ppaId.includes('ppa-'));
    return matchesSearch;
  });

  const toggleMark = (pkg: PackageItem) => {
    setMarkedPackages((prev) => {
      const current = prev[pkg.id];
      if (current) {
        const next = { ...prev };
        delete next[pkg.id];
        return next;
      }
      return {
        ...prev,
        [pkg.id]: pkg.installed ? 'remove' : 'install',
      };
    });
  };

  const handleApply = () => {
    const markedIds = Object.keys(markedPackages);
    if (markedIds.length === 0) return;

    setIsApplying(true);
    setApplyProgress(10);

    const timer = setInterval(() => {
      setApplyProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setIsApplying(false);

          if (onUpdateConfig) {
            const updated = config.packages.map((pkg) => {
              if (markedPackages[pkg.id] === 'install') return { ...pkg, installed: true };
              if (markedPackages[pkg.id] === 'remove') return { ...pkg, installed: false };
              return pkg;
            });
            onUpdateConfig({ ...config, packages: updated });
          }
          setMarkedPackages({});
          showNotice('Applied package transaction successfully.');
          return 100;
        }
        return p + 25;
      });
    }, 300);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  const handleIdentifierChange = (val: string) => {
    setIdentifier(val);

    // Auto-generate sourceLine if identifier is in ppa:user/repo format
    const trimmed = val.trim();
    if (trimmed.startsWith('ppa:')) {
      const parts = trimmed.substring(4).split('/');
      const user = parts[0] || 'maintainer';
      const repo = parts[1] || 'ppa';
      const cleanSlug = `${user}-${repo}`.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();

      if (!sourceLine || sourceLine.includes('launchpadcontent.net')) {
        setSourceLine(
          `deb [arch=amd64 signed-by=/etc/apt/keyrings/${cleanSlug}.gpg] https://ppa.launchpadcontent.net/${user}/${repo}/ubuntu ${config.codename} main`
        );
      }
      if (!repoName) {
        setRepoName(`${user.charAt(0).toUpperCase() + user.slice(1)} ${repo.toUpperCase()} PPA`);
      }
      if (!packageName) {
        setPackageName(repo);
      }
    }
  };

  const applyPreset = (preset: PpaPreset) => {
    setIdentifier(preset.identifier);
    setSourceLine(preset.sourceLine);
    setRepoName(preset.name);
    setCategory(preset.category);
    setDescription(preset.description);

    if (preset.defaultPackage) {
      setIncludePackage(true);
      setPackageName(preset.defaultPackage.name);
      setPackageVersion(preset.defaultPackage.version);
      setPackageSize(preset.defaultPackage.size);
      setPackageDesc(preset.defaultPackage.description);
    }
  };

  const handleSavePpa = () => {
    if (!identifier.trim() || !sourceLine.trim()) return;

    const trimmedIdent = identifier.trim();
    const cleanSlug = trimmedIdent
      .replace(/^ppa:/i, '')
      .replace(/[^a-z0-9_-]/gi, '-')
      .toLowerCase();

    const newRepoId = `ppa-${cleanSlug || Date.now()}`;
    const keyringPath = `/etc/apt/keyrings/${cleanSlug}.gpg`;

    const newRepo: PpaRepository = {
      id: newRepoId,
      name: repoName.trim() || trimmedIdent,
      ppaIdentifier: trimmedIdent,
      sourceLine: sourceLine.trim(),
      keyringPath: keyringPath,
      gpgKeyUrl: `https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x${cleanSlug.substring(0, 16)}`,
      description: description.trim() || `Custom PPA repository for ${trimmedIdent} on Ubuntu ${config.codename}`,
      category: category,
      enabled: true,
      requiredPackages: includePackage && packageName.trim() ? [packageName.trim()] : [],
      maintainer: trimmedIdent.startsWith('ppa:') ? trimmedIdent.split('/')[0].replace('ppa:', '') : 'Custom PPA Maintainer',
    };

    let updatedPackages = [...config.packages];
    if (includePackage && packageName.trim()) {
      const newPkgItem: PackageItem = {
        id: `pkg-${packageName.trim().toLowerCase().replace(/[^a-z0-9_-]/gi, '-')}`,
        name: packageName.trim(),
        version: packageVersion.trim() || '1.0.0-1~noble',
        description: packageDesc.trim() || description.trim() || `Package provided by ${newRepo.name}`,
        size: packageSize.trim() || '38.4 MB',
        category: category === 'gaming' ? 'gaming' : category === 'ide' ? 'ide' : category === 'ai' ? 'ai' : 'system',
        ppaId: newRepoId,
        installed: false,
        binaryCmd: packageName.trim(),
        iconName: 'Package',
      };
      // Avoid duplicate package ids
      updatedPackages = updatedPackages.filter((p) => p.name !== newPkgItem.name);
      updatedPackages.push(newPkgItem);
      setSelectedPkg(newPkgItem);
    }

    if (onUpdateConfig) {
      // Remove any existing repo with identical id
      const updatedRepos = config.repositories.filter((r) => r.id !== newRepoId);
      updatedRepos.push(newRepo);

      onUpdateConfig({
        ...config,
        repositories: updatedRepos,
        packages: updatedPackages,
      });
    }

    showNotice(`✓ PPA "${newRepo.name}" and sources.list.d entry added to DistroConfiguration.`);
    setIsWizardOpen(false);
    setWizardStep(1);
    // Reset form
    setIdentifier('');
    setSourceLine('');
    setRepoName('');
    setDescription('');
    setPackageName('');
  };

  const getCleanSlug = () => {
    return identifier
      .replace(/^ppa:/i, '')
      .replace(/[^a-z0-9_-]/gi, '-')
      .toLowerCase() || 'custom-repo';
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans select-none text-xs relative">
      {/* Top Synaptic GTK Toolbar */}
      <div className="h-10 px-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/80 rounded border border-slate-700/80 text-white font-semibold">
            <PackageCheck className="w-4 h-4 text-amber-400" />
            <span>Synaptic Package Manager</span>
          </div>

          <span className="text-slate-600">|</span>

          {/* New PPA Wizard Trigger */}
          <button
            onClick={() => {
              setIsWizardOpen(true);
              setWizardStep(1);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm"
            title="Open New PPA Repository Wizard"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New PPA</span>
          </button>

          <button
            onClick={() => setSearchQuery('')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>

          <button
            onClick={handleApply}
            disabled={Object.keys(markedPackages).length === 0 || isApplying}
            className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Changes ({Object.keys(markedPackages).length})</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick filter..."
            className="w-48 pl-8 pr-3 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-4 py-1.5 flex items-center justify-between text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sections Sidebar */}
        <div className="w-52 bg-slate-950/80 border-r border-slate-800 p-2 flex flex-col justify-between shrink-0">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
              Package Sections
            </div>
            <div className="space-y-0.5">
              {sections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition truncate ${
                    selectedSection === sec
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="text-slate-300 font-semibold flex items-center justify-between">
              <span>APT Sources</span>
              <span className="font-mono text-amber-400">{config.repositories.length}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Active PPAs: <strong className="text-emerald-400">{config.repositories.filter((r) => r.enabled).length} Enabled</strong>
            </div>

            <button
              onClick={() => {
                setIsWizardOpen(true);
                setWizardStep(1);
              }}
              className="mt-1 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-medium rounded text-[11px] flex items-center justify-center gap-1.5 transition border border-slate-700 hover:border-amber-500/50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom PPA...</span>
            </button>
          </div>
        </div>

        {/* Package List Grid */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* Table Header */}
          <div className="h-7 bg-slate-950 border-b border-slate-800 flex items-center px-3 text-[11px] font-semibold text-slate-400 shrink-0">
            <div className="w-8 text-center">S</div>
            <div className="w-48">Package</div>
            <div className="w-32">Installed Version</div>
            <div className="w-32">Latest Version</div>
            <div className="flex-1">Description</div>
          </div>

          {/* Table Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 font-mono text-[11px]">
            {filteredPackages.map((pkg) => {
              const mark = markedPackages[pkg.id];
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  onDoubleClick={() => toggleMark(pkg)}
                  className={`flex items-center px-3 py-1.5 cursor-pointer transition ${
                    selectedPkg?.id === pkg.id
                      ? 'bg-amber-500/15 text-white'
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  {/* Status checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMark(pkg);
                    }}
                    className="w-8 flex justify-center cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        mark === 'install'
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : mark === 'remove'
                          ? 'bg-rose-600 border-rose-500 text-white'
                          : pkg.installed
                          ? 'bg-slate-700 border-slate-600 text-emerald-400'
                          : 'border-slate-700'
                      }`}
                    >
                      {mark === 'install' && <Check className="w-3 h-3" />}
                      {mark === 'remove' && <X className="w-3 h-3" />}
                      {!mark && pkg.installed && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>

                  <div className="w-48 font-bold truncate text-slate-200">{pkg.name}</div>
                  <div className="w-32 text-slate-400 truncate">{pkg.installed ? pkg.version : '-'}</div>
                  <div className="w-32 text-emerald-400 truncate">{pkg.version}</div>
                  <div className="flex-1 font-sans text-slate-300 truncate">{pkg.description}</div>
                </div>
              );
            })}
          </div>

          {/* Package Details Bottom Box */}
          {selectedPkg && (
            <div className="h-32 bg-slate-950 border-t border-slate-800 p-3 flex flex-col justify-between shrink-0 font-sans">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{selectedPkg.name}</span>
                  <span className="text-[11px] font-mono text-amber-400">({selectedPkg.version})</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {selectedPkg.size}
                  </span>
                  {selectedPkg.ppaId && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                      {selectedPkg.ppaId}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-xs mt-1">{selectedPkg.description}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="truncate max-w-md">
                  Source Repository: <strong className="text-amber-400 font-mono">{selectedPkg.ppaId}</strong>
                </div>
                <button
                  onClick={() => toggleMark(selectedPkg)}
                  className={`px-3 py-1 rounded font-medium transition ${
                    selectedPkg.installed
                      ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white'
                  }`}
                >
                  {selectedPkg.installed ? 'Mark for Removal' : 'Mark for Installation'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW PPA WIZARD MODAL */}
      {isWizardOpen && (
        <div
          onClick={() => setIsWizardOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-slate-950 border border-slate-700/80 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
          >
            {/* Modal Header */}
            <div className="h-12 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">New PPA Repository Wizard</h3>
                  <p className="text-[10px] text-slate-400">Add Launchpad PPA or custom APT repository source</p>
                </div>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Tabs indicator */}
            <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center gap-4 text-xs">
              <button
                onClick={() => setWizardStep(1)}
                className={`flex items-center gap-2 pb-1 border-b-2 font-medium transition ${
                  wizardStep === 1
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">1</span>
                <span>Identifier & Source Line</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button
                onClick={() => {
                  if (identifier.trim() && sourceLine.trim()) setWizardStep(2);
                }}
                disabled={!identifier.trim() || !sourceLine.trim()}
                className={`flex items-center gap-2 pb-1 border-b-2 font-medium transition disabled:opacity-40 ${
                  wizardStep === 2
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center">2</span>
                <span>Keyring & Packages Preview</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
              {wizardStep === 1 && (
                <div className="space-y-4">
                  {/* Presets Bar */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Quick Load PPA Preset</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PPA_PRESETS.map((preset) => (
                        <button
                          key={preset.identifier}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 text-left transition group"
                        >
                          <div className="font-semibold text-slate-200 group-hover:text-amber-300 text-xs truncate">
                            {preset.name}
                          </div>
                          <div className="font-mono text-[10px] text-slate-500 truncate mt-0.5">
                            {preset.identifier}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Identifier Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
                      <span>PPA Identifier <span className="text-amber-400">*</span></span>
                      <span className="text-[10px] text-slate-500 font-mono">e.g. ppa:user/repo or custom domain</span>
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      placeholder="ppa:graphics-drivers/ppa"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                    />
                  </div>

                  {/* Source Line Input */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
                      <span>APT Source Line (deb format) <span className="text-amber-400">*</span></span>
                      <span className="text-[10px] text-emerald-400 font-mono">Ubuntu {config.codename}</span>
                    </label>
                    <textarea
                      rows={2}
                      value={sourceLine}
                      onChange={(e) => setSourceLine(e.target.value)}
                      placeholder="deb [arch=amd64 signed-by=/etc/apt/keyrings/repo.gpg] https://ppa.launchpadcontent.net/user/repo/ubuntu noble main"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition resize-none leading-relaxed"
                    />
                  </div>

                  {/* Repository Details Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Repository Display Name
                      </label>
                      <input
                        type="text"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        placeholder="e.g. Graphics Drivers PPA"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-amber-500 transition"
                      >
                        <option value="gaming">Gaming & Wine Runners</option>
                        <option value="ide">Development (IDE & SDK)</option>
                        <option value="ai">AI & Language Models</option>
                        <option value="system">System Utilities</option>
                        <option value="custom">Custom / Third-Party</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Description & Notes
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Packages and drivers provided by this repository..."
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-4">
                  {/* Generated Sources.list.d file preview */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Generated /etc/apt/sources.list.d/{getCleanSlug()}.sources</span>
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono">deb822 format</span>
                    </div>
                    <pre className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 leading-relaxed overflow-x-auto">
{`Types: deb
URIs: ${sourceLine.split(' ').find((s) => s.startsWith('http')) || 'https://ppa.launchpadcontent.net/'}
Suites: ${config.codename}
Components: main
Signed-By: /etc/apt/keyrings/${getCleanSlug()}.gpg`}
                    </pre>
                  </div>

                  {/* GPG Keyring Security Card */}
                  <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>APT Security Keyring Architecture</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Keyring path: <code className="text-slate-200 font-mono text-[10px]">/etc/apt/keyrings/{getCleanSlug()}.gpg</code>
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Conforms to Debian 12 / Ubuntu 24.04 security standards without relying on deprecated <code className="font-mono text-slate-400">apt-key add</code>.
                    </p>
                  </div>

                  {/* Register Initial Package */}
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePackage}
                          onChange={(e) => setIncludePackage(e.target.checked)}
                          className="rounded border-slate-700 text-amber-500 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span className="font-semibold text-xs text-white">Register package in Synaptic view</span>
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">Instantly available in list</span>
                    </div>

                    {includePackage && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Package Binary Name</label>
                          <input
                            type="text"
                            value={packageName}
                            onChange={(e) => setPackageName(e.target.value)}
                            placeholder="e.g. nvidia-driver-560"
                            className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white outline-none focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Package Version</label>
                          <input
                            type="text"
                            value={packageVersion}
                            onChange={(e) => setPackageVersion(e.target.value)}
                            placeholder="e.g. 1.0.0-1~noble"
                            className="w-full px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="h-14 px-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <div>
                {wizardStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition text-xs font-medium"
                >
                  Cancel
                </button>

                {wizardStep === 1 ? (
                  <button
                    type="button"
                    disabled={!identifier.trim() || !sourceLine.trim()}
                    onClick={() => setWizardStep(2)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold transition text-xs"
                  >
                    <span>Next: Keyring & Preview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSavePpa}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition text-xs shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Add PPA & Update Distro</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applying Progress Modal */}
      {isApplying && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-96 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Applying Changes...</span>
              <span className="font-mono text-emerald-400 font-bold">{applyProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                style={{ width: `${applyProgress}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Unpacking and configuring apt packages into system rootfs...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
