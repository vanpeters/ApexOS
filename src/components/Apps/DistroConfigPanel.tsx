import React, { useState, useRef } from 'react';
import {
  Settings,
  Sliders,
  Check,
  Package,
  Layers,
  Cpu,
  Terminal,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  Gamepad2,
  Smartphone,
  Bot,
  Disc,
  Copy,
  PlusCircle,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  BookmarkPlus,
  BookmarkCheck,
  FileJson,
  Upload,
  Save,
  FolderArchive,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { DistroConfiguration, PackageItem, PpaRepository, DistroPreset } from '../../types/distro';

interface DistroConfigPanelProps {
  config: DistroConfiguration;
  onUpdateConfig: (newConfig: DistroConfiguration) => void;
  onOpenExportModal: () => void;
  onOpenGemini?: () => void;
}

export const DistroConfigPanel: React.FC<DistroConfigPanelProps> = ({
  config,
  onUpdateConfig,
  onOpenExportModal,
  onOpenGemini,
}) => {
  const [activeTab, setActiveTab] = useState<'packages' | 'custom-ppas' | 'presets' | 'system' | 'build-log'>('packages');
  const [isSimulatingBuild, setIsSimulatingBuild] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
  const [copiedLog, setCopiedLog] = useState(false);
  const [copiedPpaId, setCopiedPpaId] = useState<string | null>(null);

  // Custom PPA Form State
  const [showAddPpaModal, setShowAddPpaModal] = useState(false);
  const [newPpaName, setNewPpaName] = useState('');
  const [newPpaIdentifier, setNewPpaIdentifier] = useState('');
  const [newPpaSourceLine, setNewPpaSourceLine] = useState('');
  const [newPpaKeyring, setNewPpaKeyring] = useState('/etc/apt/keyrings/');
  const [newPpaGpgUrl, setNewPpaGpgUrl] = useState('');
  const [newPpaDesc, setNewPpaDesc] = useState('');
  const [newPpaPackages, setNewPpaPackages] = useState('');

  // Create Export Preset State
  const [showCreatePresetModal, setShowCreatePresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDesc, setPresetDesc] = useState('');
  const [presetAuthor, setPresetAuthor] = useState('');
  const [presetNotice, setPresetNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCreateExportPreset = (downloadJson: boolean = false) => {
    const cleanName = presetName.trim() || `${config.distroName} Custom Recipe`;
    const newPresetId = `preset-${Date.now()}`;
    const newPreset: DistroPreset = {
      id: newPresetId,
      name: cleanName,
      description:
        presetDesc.trim() ||
        `Profile with ${config.packages.filter((p) => p.installed).length} packages and ${
          config.repositories.filter((r) => r.enabled).length
        } active PPAs`,
      createdAt: new Date().toISOString().split('T')[0],
      author: presetAuthor.trim() || config.defaultUsername || 'developer',
      repositories: JSON.parse(JSON.stringify(config.repositories)),
      packages: JSON.parse(JSON.stringify(config.packages)),
      kernelVariant: config.kernelVariant,
      desktopEnvironment: config.desktopEnvironment,
      enableZram: config.enableZram,
      enableWineStaging: config.enableWineStaging,
      enableKvmVirtualization: config.enableKvmVirtualization,
      enableGamemode: config.enableGamemode,
      isDefault: false,
    };

    const existingPresets = config.presets || [];
    const updatedPresets = [...existingPresets, newPreset];

    onUpdateConfig({
      ...config,
      presets: updatedPresets,
      activePresetId: newPresetId,
    });

    if (downloadJson) {
      handleDownloadPresetJson(newPreset);
    }

    setPresetNotice(`Preset profile "${cleanName}" created and added to DistroConfiguration!`);
    setShowCreatePresetModal(false);
    setTimeout(() => setPresetNotice(null), 4500);
  };

  const handleLoadDistroPreset = (preset: DistroPreset) => {
    onUpdateConfig({
      ...config,
      repositories: JSON.parse(JSON.stringify(preset.repositories)),
      packages: JSON.parse(JSON.stringify(preset.packages)),
      kernelVariant: preset.kernelVariant,
      desktopEnvironment: preset.desktopEnvironment,
      enableZram: preset.enableZram,
      enableWineStaging: preset.enableWineStaging,
      enableKvmVirtualization: preset.enableKvmVirtualization,
      enableGamemode: preset.enableGamemode,
      activePresetId: preset.id,
    });
    setPresetNotice(`Applied configuration profile: "${preset.name}"`);
    setTimeout(() => setPresetNotice(null), 4500);
  };

  const handleDownloadPresetJson = (preset: DistroPreset) => {
    const jsonString = JSON.stringify(preset, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = preset.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    link.download = `distro-preset-${safeName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportPresetJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as DistroPreset;
        if (!parsed.name || !Array.isArray(parsed.repositories) || !Array.isArray(parsed.packages)) {
          setPresetNotice('Error: Invalid preset JSON structure.');
          return;
        }
        const importedPreset: DistroPreset = {
          ...parsed,
          id: `imported-${Date.now()}`,
          createdAt: parsed.createdAt || new Date().toISOString().split('T')[0],
          isDefault: false,
        };

        const existing = config.presets || [];
        onUpdateConfig({
          ...config,
          presets: [...existing, importedPreset],
          repositories: importedPreset.repositories,
          packages: importedPreset.packages,
          activePresetId: importedPreset.id,
        });
        setPresetNotice(`Imported and applied preset profile: "${importedPreset.name}"`);
        setTimeout(() => setPresetNotice(null), 4500);
      } catch (err) {
        setPresetNotice('Error reading preset JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteDistroPreset = (presetId: string) => {
    const updated = (config.presets || []).filter((p) => p.id !== presetId);
    onUpdateConfig({
      ...config,
      presets: updated,
      activePresetId: config.activePresetId === presetId ? updated[0]?.id : config.activePresetId,
    });
    setPresetNotice('Preset profile deleted.');
    setTimeout(() => setPresetNotice(null), 3000);
  };

  // Curated PPA Presets
  const ppaPresets: Partial<PpaRepository>[] = [
    {
      id: 'ppa-obs-studio',
      name: 'OBS Studio Official PPA',
      ppaIdentifier: 'ppa:obsproject/obs-studio',
      sourceLine: 'deb [signed-by=/etc/apt/keyrings/obs-studio.gpg] https://ppa.launchpadcontent.net/obsproject/obs-studio/ubuntu noble main',
      keyringPath: '/etc/apt/keyrings/obs-studio.gpg',
      gpgKeyUrl: 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xBC7345F522073467',
      description: 'Official Open Broadcaster Software PPA for live streaming, hardware NVENC/VAAPI recording.',
      category: 'custom',
      requiredPackages: ['obs-studio'],
    },
    {
      id: 'ppa-libreoffice',
      name: 'LibreOffice Fresh PPA',
      ppaIdentifier: 'ppa:libreoffice/ppa',
      sourceLine: 'deb [signed-by=/etc/apt/keyrings/libreoffice.gpg] https://ppa.launchpadcontent.net/libreoffice/ppa/ubuntu noble main',
      keyringPath: '/etc/apt/keyrings/libreoffice.gpg',
      gpgKeyUrl: 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x1378B444',
      description: 'Latest stable release branch of LibreOffice suite for documents, spreadsheets, and presentations.',
      category: 'custom',
      requiredPackages: ['libreoffice', 'libreoffice-gtk3'],
    },
    {
      id: 'ppa-git-core',
      name: 'Git Core Upstream PPA',
      ppaIdentifier: 'ppa:git-core/ppa',
      sourceLine: 'deb [signed-by=/etc/apt/keyrings/git-core.gpg] https://ppa.launchpadcontent.net/git-core/ppa/ubuntu noble main',
      keyringPath: '/etc/apt/keyrings/git-core.gpg',
      gpgKeyUrl: 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xA1715D88E1DF1F24',
      description: 'Upstream git packaging branch providing latest git 2.47+ with HTTP/2 and partial clone support.',
      category: 'custom',
      requiredPackages: ['git'],
    },
    {
      id: 'ppa-neovim',
      name: 'Neovim Nightly PPA',
      ppaIdentifier: 'ppa:neovim-ppa/unstable',
      sourceLine: 'deb [signed-by=/etc/apt/keyrings/neovim.gpg] https://ppa.launchpadcontent.net/neovim-ppa/unstable/ubuntu noble main',
      keyringPath: '/etc/apt/keyrings/neovim.gpg',
      gpgKeyUrl: 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x55DE5DEE',
      description: 'Vim-fork focused on extensibility, Lua plugins, and Tree-sitter syntax highlighting.',
      category: 'custom',
      requiredPackages: ['neovim'],
    },
    {
      id: 'repo-docker-ce',
      name: 'Docker CE Official Repository',
      ppaIdentifier: 'download.docker.com/linux/ubuntu',
      sourceLine: 'deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu noble stable',
      keyringPath: '/etc/apt/keyrings/docker.gpg',
      gpgKeyUrl: 'https://download.docker.com/linux/ubuntu/gpg',
      description: 'Official Docker Community Edition engine, containerd, and docker-compose plugin.',
      category: 'custom',
      requiredPackages: ['docker-ce', 'docker-ce-cli', 'containerd.io', 'docker-compose-plugin'],
    },
    {
      id: 'repo-vscode',
      name: 'Visual Studio Code Repository',
      ppaIdentifier: 'packages.microsoft.com/repos/code',
      sourceLine: 'deb [arch=amd64 signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main',
      keyringPath: '/etc/apt/keyrings/packages.microsoft.gpg',
      gpgKeyUrl: 'https://packages.microsoft.com/keys/microsoft.asc',
      description: 'Official Microsoft repository for VS Code editor on Debian/Ubuntu systems.',
      category: 'custom',
      requiredPackages: ['code'],
    },
  ];

  const handleApplyPreset = (preset: Partial<PpaRepository>) => {
    if (config.repositories.some((r) => r.id === preset.id || r.ppaIdentifier === preset.ppaIdentifier)) {
      return; // Already added
    }

    const fullRepo: PpaRepository = {
      id: preset.id || `ppa-${Date.now()}`,
      name: preset.name || 'Custom PPA',
      ppaIdentifier: preset.ppaIdentifier || '',
      sourceLine: preset.sourceLine || '',
      keyringPath: preset.keyringPath || '/etc/apt/keyrings/custom.gpg',
      gpgKeyUrl: preset.gpgKeyUrl,
      description: preset.description || '',
      category: 'custom',
      enabled: true,
      requiredPackages: preset.requiredPackages || [],
    };

    onUpdateConfig({
      ...config,
      repositories: [...config.repositories, fullRepo],
    });
  };

  const handleSaveCustomPpa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPpaName.trim() || !newPpaIdentifier.trim()) return;

    const safeId = `custom-${newPpaName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    let sourceLine = newPpaSourceLine.trim();

    if (!sourceLine) {
      if (newPpaIdentifier.startsWith('ppa:')) {
        const repoPath = newPpaIdentifier.replace('ppa:', '');
        const keyringFile = newPpaKeyring.endsWith('.gpg')
          ? newPpaKeyring
          : `/etc/apt/keyrings/${safeId}.gpg`;
        sourceLine = `deb [signed-by=${keyringFile}] https://ppa.launchpadcontent.net/${repoPath}/ubuntu ${config.codename} main`;
      } else {
        sourceLine = `deb ${newPpaIdentifier} ${config.codename} main`;
      }
    }

    const pkgs = newPpaPackages
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const newRepo: PpaRepository = {
      id: safeId,
      name: newPpaName.trim(),
      ppaIdentifier: newPpaIdentifier.trim(),
      sourceLine,
      keyringPath: newPpaKeyring.endsWith('.gpg') ? newPpaKeyring : `/etc/apt/keyrings/${safeId}.gpg`,
      gpgKeyUrl: newPpaGpgUrl.trim() || undefined,
      description: newPpaDesc.trim() || `Custom PPA repository for ${newPpaName}`,
      category: 'custom',
      enabled: true,
      requiredPackages: pkgs.length > 0 ? pkgs : [safeId],
    };

    // If new packages specified, register them in distro package catalog
    const newPkgItems: PackageItem[] = pkgs.map((pkgName) => ({
      id: `pkg-${pkgName}`,
      name: pkgName,
      version: 'latest',
      description: `Package from ${newPpaName}`,
      size: '45 MB',
      category: 'system',
      ppaId: safeId,
      installed: true,
      binaryCmd: pkgName,
      iconName: 'Package',
    }));

    onUpdateConfig({
      ...config,
      repositories: [...config.repositories, newRepo],
      packages: [...config.packages, ...newPkgItems],
    });

    // Reset form
    setNewPpaName('');
    setNewPpaIdentifier('');
    setNewPpaSourceLine('');
    setNewPpaGpgUrl('');
    setNewPpaDesc('');
    setNewPpaPackages('');
    setShowAddPpaModal(false);
  };

  const handleDeletePpa = (repoId: string) => {
    onUpdateConfig({
      ...config,
      repositories: config.repositories.filter((r) => r.id !== repoId),
      packages: config.packages.filter((p) => p.ppaId !== repoId),
    });
  };

  const togglePackage = (pkgId: string) => {
    const updatedPkgs = config.packages.map((p) =>
      p.id === pkgId ? { ...p, installed: !p.installed } : p
    );

    const targetPkg = config.packages.find((p) => p.id === pkgId);
    let updatedRepos = [...config.repositories];
    if (targetPkg) {
      const willBeInstalled = !targetPkg.installed;
      if (willBeInstalled) {
        updatedRepos = updatedRepos.map((r) =>
          r.id === targetPkg.ppaId ? { ...r, enabled: true } : r
        );
      }
    }

    onUpdateConfig({
      ...config,
      packages: updatedPkgs,
      repositories: updatedRepos,
    });
  };

  const toggleRepository = (repoId: string) => {
    const updatedRepos = config.repositories.map((r) =>
      r.id === repoId ? { ...r, enabled: !r.enabled } : r
    );
    onUpdateConfig({
      ...config,
      repositories: updatedRepos,
    });
  };

  const handleStartSimulatedBuildLog = () => {
    setIsSimulatingBuild(true);
    setActiveTab('build-log');
    setSimulatedLogs([
      `[00:00.01] === Starting Build for ${config.distroName} ===`,
      `[00:00.05] Host: Ubuntu 24.04 LTS (Noble) / Architecture: ${config.architecture}`,
      `[00:00.12] Kernel selected: ${config.kernelVariant}`,
      `[00:00.20] Desktop environment: ${config.desktopEnvironment}`,
      `[00:00.35] Initializing /tmp/apexos-build chroot workspace...`,
    ]);

    const activeRepos = config.repositories.filter((r) => r.enabled);
    const activePkgs = config.packages.filter((p) => p.installed);

    const logSteps: { delay: number; log: string }[] = [
      { delay: 300, log: `[00:01.10] [Debootstrap] Fetching base noble minbase packages (142 core packages)...` },
      { delay: 600, log: `[00:02.40] [Debootstrap] Base filesystem extracted (840 MB). Mounting /proc, /sys, /dev.` },
      { delay: 900, log: `[00:03.15] [PPA Engine] Injecting ${activeRepos.length} configured repositories into /etc/apt/sources.list.d:` },
      ...activeRepos.map((r, i) => ({
        delay: 1100 + i * 150,
        log: `[00:03.${40 + i * 12}]   + Injected [${r.id}.list] -> ${r.ppaIdentifier} (Keyring: ${r.keyringPath})`,
      })),
      { delay: 2000, log: `[00:04.80] [Kernel] Installing ${config.kernelVariant} & Casper live-boot initramfs...` },
      { delay: 2400, log: `[00:05.90] [Packages] Installing user-selected packages (${activePkgs.length} items):` },
      ...activePkgs.map((p, i) => ({
        delay: 2600 + i * 180,
        log: `[00:06.${10 + i * 10}]   ✓ Installed ${p.name} [${p.version}] (${p.size})`,
      })),
      { delay: 3800, log: `[00:08.20] [Optimization] Applying ZRAM compression, KVM permissions, and GameMode.` },
      { delay: 4200, log: `[00:09.50] [SquashFS] Compressing rootfs into /casper/filesystem.squashfs (XZ, 1M blocks)...` },
      { delay: 4600, log: `[00:10.90] [SquashFS] Compression complete: 11.4 GB -> 3.2 GB (Ratio: 28.1%).` },
      { delay: 5000, log: `[00:12.10] [ISO Builder] grub-mkrescue generating hybrid UEFI/BIOS bootable ISO image...` },
      { delay: 5400, log: `[00:13.40] [SUCCESS] ISO Image created: apexos-${config.version}-${config.architecture}.iso (3.2 GB)` },
    ];

    logSteps.forEach(({ delay, log }) => {
      setTimeout(() => {
        setSimulatedLogs((prev) => [...prev, log]);
        if (delay === 5400) {
          setIsSimulatingBuild(false);
        }
      }, delay);
    });
  };

  const copySimulatedLogs = () => {
    navigator.clipboard.writeText(simulatedLogs.join('\n'));
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const copyPpaSource = (line: string, id: string) => {
    navigator.clipboard.writeText(line);
    setCopiedPpaId(id);
    setTimeout(() => setCopiedPpaId(null), 2000);
  };

  const installedCount = config.packages.filter((p) => p.installed).length;
  const reposCount = config.repositories.filter((r) => r.enabled).length;

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans select-none text-xs">
      {/* Clean Top Header & Metrics Bar */}
      <div className="px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">{config.distroName}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30">
              v{config.version}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
            <span>Ubuntu {config.baseUbuntuVersion} ({config.codename})</span>
            <span aria-hidden="true">·</span>
            <span>{config.kernelVariant}</span>
            <span aria-hidden="true">·</span>
            <span>{config.architecture}</span>
          </div>
        </div>

        {/* Clean Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Preset Profile Indicator */}
          {config.activePresetId && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">Profile:</span>
              <span className="font-semibold text-amber-300 truncate max-w-[140px]">
                {config.presets?.find((p) => p.id === config.activePresetId)?.name || 'Custom'}
              </span>
            </div>
          )}

          {/* Create Export Preset Button */}
          <button
            onClick={() => {
              setPresetName(`${config.distroName} Custom Recipe`);
              setPresetDesc(`Snapshot profile containing ${installedCount} packages and ${reposCount} enabled PPAs`);
              setPresetAuthor(config.defaultUsername || 'developer');
              setShowCreatePresetModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-semibold transition"
            title="Create an Export Preset saving your current PPA and package selection"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Create Export Preset</span>
          </button>

          {onOpenGemini && (
            <button
              onClick={onOpenGemini}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-semibold transition"
              title="Open Gemini AI Distro Architect Chat"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Gemini</span>
            </button>
          )}

          <button
            onClick={handleStartSimulatedBuildLog}
            disabled={isSimulatingBuild}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition disabled:opacity-50"
          >
            {isSimulatingBuild ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
            )}
            <span>{isSimulatingBuild ? 'Simulating...' : 'Simulate Build'}</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export & Build ISO</span>
          </button>
        </div>
      </div>

      {/* Hidden Preset Import File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportPresetJson}
        className="hidden"
      />

      {/* Navigation Tabs */}
      <div className="h-9 px-6 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
              activeTab === 'packages'
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Software Packages</span>
            <span className="px-1.5 py-0.2 bg-slate-700 text-slate-300 rounded-full text-[10px] font-mono">
              {installedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('custom-ppas')}
            className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
              activeTab === 'custom-ppas'
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Custom PPA Repositories</span>
            <span className="px-1.5 py-0.2 bg-slate-700 text-slate-300 rounded-full text-[10px] font-mono">
              {reposCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Export Presets & Profiles</span>
            <span className="px-1.5 py-0.2 bg-slate-700 text-slate-300 rounded-full text-[10px] font-mono">
              {config.presets?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
              activeTab === 'system'
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kernel & Desktop Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('build-log')}
            className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
              activeTab === 'build-log'
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Build Log Output</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span>Active PPAs: <strong className="text-slate-200">{reposCount}</strong></span>
          <span>Est. ISO Size: <strong className="text-emerald-400 font-mono">~3.2 GB</strong></span>
        </div>
      </div>

      {/* Preset Notice Banner */}
      {presetNotice && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-6 py-2 flex items-center justify-between text-xs animate-in fade-in duration-150 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{presetNotice}</span>
          </div>
          <button
            onClick={() => setPresetNotice(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Tab 1: Packages Toggles */}
        {activeTab === 'packages' && (
          <div className="max-w-5xl mx-auto space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Software Packages & Bundled Daemons
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle applications and background daemons bundled into the live squashfs root filesystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {config.packages.map((pkg) => {
                const parentRepo = config.repositories.find((r) => r.id === pkg.ppaId);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => togglePackage(pkg.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                      pkg.installed
                        ? 'bg-slate-900 border-amber-500/70 shadow-sm ring-1 ring-amber-500/20'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {pkg.id.includes('lutris') && <Gamepad2 className="w-4 h-4 text-amber-400" />}
                        {pkg.id.includes('android') && <Smartphone className="w-4 h-4 text-cyan-400" />}
                        {pkg.id.includes('claude') && <Bot className="w-4 h-4 text-amber-400" />}
                        {pkg.id.includes('chatgpt') && <Sparkles className="w-4 h-4 text-emerald-400" />}
                        {pkg.id.includes('synaptic') && <Package className="w-4 h-4 text-amber-400" />}
                        {pkg.id.includes('hardinfo') && <Cpu className="w-4 h-4 text-cyan-400" />}
                        {pkg.id.includes('apache') && <Disc className="w-4 h-4 text-emerald-400" />}
                        {!['lutris', 'android', 'claude', 'chatgpt', 'synaptic', 'hardinfo', 'apache'].some((k) => pkg.id.includes(k)) && (
                          <Package className="w-4 h-4 text-slate-400" />
                        )}

                        <span className="font-bold text-sm text-white">{pkg.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          v{pkg.version}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{pkg.description}</p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono pt-0.5">
                        <span>PPA: <span className="text-amber-400">{parentRepo?.name || pkg.ppaId}</span></span>
                        <span aria-hidden="true">·</span>
                        <span>Size: {pkg.size}</span>
                      </div>
                    </div>

                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${
                          pkg.installed ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-slate-950 shadow-xs"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Custom PPA Repositories Manager */}
        {activeTab === 'custom-ppas' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Custom PPA & APT Repositories Options
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure Launchpad PPAs, third-party deb sources, and custom GPG keyrings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddPpaModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Custom PPA</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click PPA Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Popular Curated PPA Presets (Click to Add):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {ppaPresets.map((preset) => {
                  const isAdded = config.repositories.some((r) => r.id === preset.id || r.ppaIdentifier === preset.ppaIdentifier);
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      disabled={isAdded}
                      className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition ${
                        isAdded
                          ? 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed'
                          : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 hover:border-amber-500/50 cursor-pointer'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-white truncate text-[11px]">{preset.name}</div>
                        <div className="text-[10px] text-amber-400 font-mono truncate">{preset.ppaIdentifier}</div>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{isAdded ? 'Added ✓' : '+ Add Preset'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Repositories List */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                Active Distro Repositories ({config.repositories.length} Total):
              </span>

              <div className="space-y-2.5">
                {config.repositories.map((repo) => {
                  const isCustom = repo.category === 'custom';
                  return (
                    <div
                      key={repo.id}
                      className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1.5 flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{repo.name}</span>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {repo.ppaIdentifier}
                          </span>
                          {isCustom && (
                            <span className="text-[9px] font-semibold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                              CUSTOM USER PPA
                            </span>
                          )}
                        </div>

                        <div className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800/80 truncate">
                          {repo.sourceLine}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>Keyring: <strong className="text-slate-300">{repo.keyringPath}</strong></span>
                          {repo.requiredPackages?.length > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Packages: <strong className="text-emerald-400">{repo.requiredPackages.join(', ')}</strong></span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Repo controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyPpaSource(repo.sourceLine, repo.id)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition text-[11px] flex items-center gap-1 border border-slate-700"
                          title="Copy source line"
                        >
                          {copiedPpaId === repo.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedPpaId === repo.id ? 'Copied' : 'Copy deb'}</span>
                        </button>

                        <button
                          onClick={() => toggleRepository(repo.id)}
                          className={`px-3 py-1.5 rounded-md font-semibold transition text-[11px] border ${
                            repo.enabled
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {repo.enabled ? 'Enabled' : 'Disabled'}
                        </button>

                        {isCustom && (
                          <button
                            onClick={() => handleDeletePpa(repo.id)}
                            className="p-1.5 rounded-md bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition"
                            title="Delete custom PPA"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: System Settings */}
        {activeTab === 'system' && (
          <div className="max-w-3xl mx-auto space-y-5 text-xs text-slate-300">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Kernel & Low-Level OS Options
              </h3>
              <p className="text-slate-400 mt-0.5">
                Fine-tune the operating system kernel and virtualization stack.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <label className="font-bold text-slate-200 block">Linux Kernel Variant</label>
                <select
                  value={config.kernelVariant}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, kernelVariant: e.target.value as any })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none"
                >
                  <option value="linux-xanmod-gaming">Linux 6.11 XanMod Gaming (Low-Latency Zen)</option>
                  <option value="linux-generic-6.11">Linux Generic 6.11 (Ubuntu Noble Official)</option>
                  <option value="linux-lowlatency">Linux Low-Latency (Real-Time Audio)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  XanMod features custom scheduler optimizations for wine/lutris gaming responsiveness.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <label className="font-bold text-slate-200 block">Desktop Environment</label>
                <select
                  value={config.desktopEnvironment}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, desktopEnvironment: e.target.value as any })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none"
                >
                  <option value="gnome-47">Ubuntu GNOME 47 (Default Wayland)</option>
                  <option value="kde-plasma-6">KDE Plasma 6 (Custom Gaming Shell)</option>
                  <option value="xfce-4.18">XFCE 4.18 (Lightweight)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  Pre-configured with dark theme, Lutris, and Android Studio desktop shortcuts.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">KVM Virtualization Group Perms</div>
                  <div className="text-slate-400">
                    Auto-adds user to kvm & libvirt for bare-metal Android Studio emulator launch.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableKvmVirtualization}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, enableKvmVirtualization: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">ZRAM Compressed RAM Swap</div>
                  <div className="text-slate-400">
                    Doubles effective RAM capacity for concurrent Android Studio compiles & Lutris gaming.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableZram}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, enableZram: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">GameMode Systemd Daemon</div>
                  <div className="text-slate-400">
                    Dynamically switches Linux CPU governor to performance mode during gaming.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableGamemode}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, enableGamemode: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Simulated Build Log Output */}
        {activeTab === 'build-log' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Simulated Build Log Output
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generated compilation logs executing <span className="font-mono text-amber-400">build-iso.sh</span> with active PPAs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copySimulatedLogs}
                  disabled={simulatedLogs.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs transition border border-slate-700 disabled:opacity-40"
                >
                  {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLog ? 'Copied' : 'Copy Logs'}</span>
                </button>

                <button
                  onClick={handleStartSimulatedBuildLog}
                  disabled={isSimulatingBuild}
                  className="flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-md text-xs font-semibold transition disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isSimulatingBuild ? 'animate-spin' : ''}`} />
                  <span>Re-run Simulation</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed min-h-[380px] max-h-[500px] overflow-y-auto space-y-1">
              {simulatedLogs.length === 0 ? (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <Terminal className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Click "Simulate Build" to start the automated build pipeline.</p>
                </div>
              ) : (
                simulatedLogs.map((line, idx) => (
                  <div
                    key={idx}
                    className={`${
                      line.includes('[SUCCESS]') || line.includes('✓')
                        ? 'text-emerald-400 font-semibold'
                        : line.includes('===')
                        ? 'text-amber-400 font-bold'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Export Presets & Profiles */}
        {activeTab === 'presets' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-amber-400" />
                  <span>Configuration Profiles & Export Presets</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Save, switch between, and export your curated PPA and package selections as reusable distro profiles.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs transition border border-slate-700"
                  title="Import a previously exported distro-preset.json"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Import JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPresetName(`${config.distroName} Custom Recipe`);
                    setPresetDesc(`Snapshot profile containing ${installedCount} packages and ${reposCount} enabled PPAs`);
                    setPresetAuthor(config.defaultUsername || 'developer');
                    setShowCreatePresetModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition shadow-sm"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Create Export Preset</span>
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(config.presets || []).map((preset) => {
                const isActive = config.activePresetId === preset.id;
                const activeRepos = preset.repositories.filter((r) => r.enabled);
                const activePkgs = preset.packages.filter((p) => p.installed);

                return (
                  <div
                    key={preset.id}
                    className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all ${
                      isActive
                        ? 'bg-slate-900/90 border-amber-500/50 shadow-lg ring-1 ring-amber-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Header of card */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{preset.name}</h4>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Active
                              </span>
                            )}
                            {preset.isDefault && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {preset.description}
                          </p>
                        </div>
                      </div>

                      {/* Metrics Badges */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">PPAs</span>
                          <span className="font-semibold text-amber-300">
                            {activeRepos.length} active
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                          <span className="text-slate-500 text-[10px] block">Packages</span>
                          <span className="font-semibold text-emerald-300">
                            {activePkgs.length} items
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 truncate">
                          <span className="text-slate-500 text-[10px] block">Kernel</span>
                          <span className="font-semibold text-cyan-300 truncate block">
                            {preset.kernelVariant.replace('linux-', '')}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 truncate">
                          <span className="text-slate-500 text-[10px] block">Desktop</span>
                          <span className="font-semibold text-purple-300 truncate block">
                            {preset.desktopEnvironment}
                          </span>
                        </div>
                      </div>

                      {/* Package Chips Preview */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          Included Packages Sample:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {activePkgs.slice(0, 6).map((pkg) => (
                            <span
                              key={pkg.id}
                              className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 text-[10px] font-mono border border-slate-700/50"
                            >
                              {pkg.name}
                            </span>
                          ))}
                          {activePkgs.length > 6 && (
                            <span className="px-2 py-0.5 rounded bg-slate-800/50 text-slate-400 text-[10px] font-mono">
                              +{activePkgs.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/80 text-xs">
                      <div className="text-[10px] text-slate-500">
                        By {preset.author || 'ApexOS'} · {preset.createdAt}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadPresetJson(preset)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px] flex items-center gap-1 border border-slate-700"
                          title="Export preset recipe as JSON"
                        >
                          <Download className="w-3 h-3 text-cyan-400" />
                          <span>JSON</span>
                        </button>

                        {!isActive ? (
                          <button
                            type="button"
                            onClick={() => handleLoadDistroPreset(preset)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition text-[11px] flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Apply Preset</span>
                          </button>
                        ) : (
                          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Current Config</span>
                          </div>
                        )}

                        {!preset.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleDeleteDistroPreset(preset.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20 transition"
                            title="Delete custom preset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Custom PPA Modal */}
      {showAddPpaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                Add Custom PPA / Repository
              </span>
              <button
                onClick={() => setShowAddPpaModal(false)}
                className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomPpa} className="space-y-3 font-sans">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Repository Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OBS Studio Official PPA"
                  value={newPpaName}
                  onChange={(e) => setNewPpaName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  PPA Identifier or Host URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ppa:obsproject/obs-studio or download.docker.com/linux/ubuntu"
                  value={newPpaIdentifier}
                  onChange={(e) => setNewPpaIdentifier(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-amber-400 placeholder-slate-500 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Custom APT Sources Line (Optional - Auto-generated if blank)
                </label>
                <input
                  type="text"
                  placeholder={`deb [signed-by=/etc/apt/keyrings/...] https://... ${config.codename} main`}
                  value={newPpaSourceLine}
                  onChange={(e) => setNewPpaSourceLine(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                    GPG Key Download URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://keyserver.ubuntu.com/..."
                    value={newPpaGpgUrl}
                    onChange={(e) => setNewPpaGpgUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                    Packages to Auto-Install (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. obs-studio, v4l2loopback-dkms"
                    value={newPpaPackages}
                    onChange={(e) => setNewPpaPackages(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes about this PPA repository..."
                  value={newPpaDesc}
                  onChange={(e) => setNewPpaDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPpaModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save & Inject PPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Export Preset Modal */}
      {showCreatePresetModal && (
        <div
          onClick={() => setShowCreatePresetModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-950 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <BookmarkPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Create Export Preset</h3>
                  <p className="text-[11px] text-slate-400">Save current PPA and package selection as a reusable configuration profile</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreatePresetModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Preset Profile Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ApexOS High-FPS Gaming & Streaming"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Profile Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain what this configuration profile is optimized for..."
                  value={presetDesc}
                  onChange={(e) => setPresetDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Author / Maintainer Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. developer, sysadmin"
                  value={presetAuthor}
                  onChange={(e) => setPresetAuthor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                />
              </div>

              {/* Profile Snapshot Summary */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Current Selection Snapshot:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enabled PPAs:</span>
                    <span className="font-mono text-amber-400 font-semibold">{reposCount} active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Installed Packages:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{installedCount} packages</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kernel:</span>
                    <span className="font-mono text-cyan-400">{config.kernelVariant.replace('linux-', '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Desktop:</span>
                    <span className="font-mono text-purple-400">{config.desktopEnvironment}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setShowCreatePresetModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCreateExportPreset(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium transition border border-slate-700"
                  title="Save preset and download .json file"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save & Download JSON</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCreateExportPreset(false)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Preset Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
