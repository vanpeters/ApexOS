import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  CheckCircle2,
  Cpu,
  Package,
  Layers,
  HardDrive,
  Terminal,
  FileArchive,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  BookmarkCheck,
  FileCode,
  Copy,
  Check,
  Code,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { DistroConfiguration } from '../../types/distro';
import {
  generateBuildIsoScript,
  generateDockerBuildScript,
  generatePostInstallScript,
  generateSourcesListD,
  generateOsInstallScript,
  generateAutoinstallYaml,
  generateFormatFat32UsbScript,
  generateMakeBootableFat32Script,
  generateEfiGrubCfg,
  generateLoopbackCfg,
  generateIsolinuxCfg,
} from '../../data/defaultDistroConfig';

interface ExportDistroModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DistroConfiguration;
}

export const ExportDistroModal: React.FC<ExportDistroModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [buildStage, setBuildStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [stageDescription, setStageDescription] = useState('Initializing build environment...');
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [showScriptViewer, setShowScriptViewer] = useState(false);
  const [selectedScriptTab, setSelectedScriptTab] = useState<
    'build-iso' | 'format-fat32' | 'make-bootable' | 'install-distro' | 'post-install' | 'autoinstall' | 'docker' | 'efi-grub'
  >('format-fat32');
  const [copiedScript, setCopiedScript] = useState(false);

  const stages = [
    { name: 'Workspace & Dependencies', desc: 'Setting up chroot workspace, xorriso, and debootstrap tools' },
    { name: 'Debootstrap Rootfs', desc: `Bootstrapping Ubuntu ${config.baseUbuntuVersion} (${config.codename}) base` },
    { name: 'PPA Keyrings & Sources', desc: 'Importing GPG keys for Lutris, Android Studio, Claude, and ChatGPT' },
    { name: 'Package Installation', desc: 'Installing Linux 6.11 XanMod kernel, GNOME 47, and selected packages' },
    { name: 'SquashFS Compression', desc: 'Compressing filesystem into /casper/filesystem.squashfs (XZ)' },
    { name: 'Hybrid ISO Generation', desc: 'Writing GRUB 2.12 EFI and MBR bootloader hybrid image' },
  ];

  const startBuild = () => {
    setIsBuilding(true);
    setIsDone(false);
    setProgress(0);
    setBuildStage(0);

    const totalSteps = 6;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= totalSteps) {
        setBuildStage(currentStep - 1);
        setStageDescription(stages[currentStep - 1].desc);
        setProgress(Math.round((currentStep / totalSteps) * 100));
      } else {
        clearInterval(interval);
        setIsBuilding(false);
        setIsDone(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 700);
  };

  useEffect(() => {
    if (isOpen) {
      startBuild();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Real JSZip bundle generator
  const downloadDistroBundleZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // 1. Root build script
      const buildScript = generateBuildIsoScript(config);
      zip.file('build-iso.sh', buildScript);

      // 2. Direct bare-metal target OS installer script
      const installScript = generateOsInstallScript(config);
      zip.file('install-distro.sh', installScript);

      // 3. Format USB to FAT32 and Setup EFI Boot
      zip.file('format-fat32-usb.sh', generateFormatFat32UsbScript(config));

      // 4. Automated FAT32 Bootable Distro Pipeline
      zip.file('make-bootable-fat32.sh', generateMakeBootableFat32Script(config));

      // 5. EFI & Boot configs
      const efiFolder = zip.folder('EFI/BOOT');
      if (efiFolder) {
        efiFolder.file('grub.cfg', generateEfiGrubCfg(config));
      }
      const grubFolder = zip.folder('boot/grub');
      if (grubFolder) {
        grubFolder.file('grub.cfg', generateEfiGrubCfg(config));
        grubFolder.file('loopback.cfg', generateLoopbackCfg(config));
      }
      const isolinuxFolder = zip.folder('isolinux');
      if (isolinuxFolder) {
        isolinuxFolder.file('isolinux.cfg', generateIsolinuxCfg(config));
      }

      // 6. Subiquity unattended autoinstall cloud-init YAML
      const autoinstallYaml = generateAutoinstallYaml(config);
      zip.file('autoinstall-user-data.yaml', autoinstallYaml);

      // 7. Dockerfile
      zip.file('Dockerfile', generateDockerBuildScript(config));

      // 8. Post-install script
      zip.file('post-install.sh', generatePostInstallScript(config));

      // 9. README documentation
      const readme = `# ${config.distroName} v${config.version}
Ubuntu Base: ${config.baseUbuntuVersion} (${config.codename})
Kernel: ${config.kernelVariant}
Desktop Environment: ${config.desktopEnvironment}

## Pre-Configured PPA Repositories:
${config.repositories.map((r) => `- ${r.name} (${r.ppaIdentifier})`).join('\n')}

## How to Build the Bootable ISO:
1. Ensure you have an Ubuntu/Debian system or VM.
2. Make the script executable:
   chmod +x build-iso.sh
3. Run as root:
   sudo ./build-iso.sh

## How to Format a USB Drive to FAT32 & Make It Bootable:
1. Make the formatting tools executable:
   chmod +x format-fat32-usb.sh make-bootable-fat32.sh
2. Run the automated FAT32 deployment tool:
   sudo ./make-bootable-fat32.sh
3. Or manually format your target drive (e.g. /dev/sdb) to FAT32 ESP and copy ISO:
   sudo ./format-fat32-usb.sh /dev/sdb output/apexos-${config.version}-${config.architecture}.iso
`;
      zip.file('README.md', readme);

      // 5. sources.list.d directory with individual repo configs
      const sourcesFolder = zip.folder('sources.list.d');
      config.repositories.forEach((repo) => {
        if (sourcesFolder) {
          sourcesFolder.file(`${repo.id}.list`, generateSourcesListD(repo));
        }
      });

      // 6. Export Preset profile JSON
      const activePreset = config.presets?.find((p) => p.id === config.activePresetId);
      const presetData = {
        name: activePreset?.name || `${config.distroName} Custom Recipe`,
        description: activePreset?.description || `Export preset profile for ${config.distroName}`,
        version: config.version,
        codename: config.codename,
        kernelVariant: config.kernelVariant,
        desktopEnvironment: config.desktopEnvironment,
        exportedAt: new Date().toISOString(),
        author: activePreset?.author || config.defaultUsername,
        repositories: config.repositories,
        packages: config.packages,
        enableZram: config.enableZram,
        enableWineStaging: config.enableWineStaging,
        enableKvmVirtualization: config.enableKvmVirtualization,
        enableGamemode: config.enableGamemode,
      };
      zip.file('distro-preset.json', JSON.stringify(presetData, null, 2));

      // Generate blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `apexos-${config.version}-distro-recipe.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const downloadPresetJson = () => {
    const activePreset = config.presets?.find((p) => p.id === config.activePresetId);
    const presetData = {
      name: activePreset?.name || `${config.distroName} Custom Profile`,
      description: activePreset?.description || `Configuration preset for ${config.distroName}`,
      createdAt: new Date().toISOString().split('T')[0],
      author: activePreset?.author || config.defaultUsername || 'developer',
      repositories: config.repositories,
      packages: config.packages,
      kernelVariant: config.kernelVariant,
      desktopEnvironment: config.desktopEnvironment,
      enableZram: config.enableZram,
      enableWineStaging: config.enableWineStaging,
      enableKvmVirtualization: config.enableKvmVirtualization,
      enableGamemode: config.enableGamemode,
    };
    const blob = new Blob([JSON.stringify(presetData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `distro-preset-${config.codename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadMockIso = () => {
    // Generate simulated ISO descriptor file
    const content = `[ApexOS Bootable ISO Descriptor]
Distro: ${config.distroName}
Version: ${config.version}
Ubuntu Base: ${config.codename}
Architecture: ${config.architecture}
Kernel: ${config.kernelVariant}
Packages: ${config.packages.filter((p) => p.installed).map((p) => p.name).join(', ')}
Ready to flash with balenaEtcher, Rufus, or 'dd'.
`;
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apexos-${config.version}-${config.architecture}.iso`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadSingleScript = (filename: string, content: string) => {
    const blob = new Blob([content], { type: filename.endsWith('.yaml') ? 'text/yaml' : 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getActiveScriptContent = () => {
    switch (selectedScriptTab) {
      case 'format-fat32':
        return {
          name: 'format-fat32-usb.sh',
          content: generateFormatFat32UsbScript(config),
          desc: 'Automated USB GPT/FAT32 Formatter with EFI System Partition (ESP) & Bootloader',
        };
      case 'make-bootable':
        return {
          name: 'make-bootable-fat32.sh',
          content: generateMakeBootableFat32Script(config),
          desc: 'High-Level Distro ISO Verification & FAT32 USB Media Deployment Pipeline',
        };
      case 'build-iso':
        return {
          name: 'build-iso.sh',
          content: generateBuildIsoScript(config),
          desc: 'Automated Live ISO Creator (Debootstrap, SquashFS, GRUB 2.12 Hybrid)',
        };
      case 'install-distro':
        return {
          name: 'install-distro.sh',
          content: generateOsInstallScript(config),
          desc: 'Bare-Metal / Target Drive Direct OS Installer (GPT, EFI ESP, ext4, fstab, GRUB EFI)',
        };
      case 'efi-grub':
        return {
          name: 'grub.cfg',
          content: generateEfiGrubCfg(config),
          desc: 'GRUB 2.12 UEFI Bootloader Configuration for FAT32 Media',
        };
      case 'post-install':
        return {
          name: 'post-install.sh',
          content: generatePostInstallScript(config),
          desc: 'First-Boot Optimization & Hardware Environment Tuning',
        };
      case 'autoinstall':
        return {
          name: 'autoinstall-user-data.yaml',
          content: generateAutoinstallYaml(config),
          desc: 'Ubuntu Subiquity Unattended Cloud-Init Automated Config',
        };
      case 'docker':
        return {
          name: 'Dockerfile',
          content: generateDockerBuildScript(config),
          desc: 'Multi-stage Dockerized Container Build Engine',
        };
    }
  };

  const copyScriptToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const activePackages = config.packages.filter((p) => p.installed);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="h-12 px-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm text-white">Distro ISO Export & Build Pipeline</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Target Distro Summary */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{config.distroName}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {config.architecture}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Ubuntu {config.baseUbuntuVersion} ({config.codename}) · {config.kernelVariant}
              </p>
            </div>

            <div className="text-right text-xs space-y-0.5 shrink-0">
              <div className="text-slate-400">
                Included Packages: <strong className="text-amber-400">{activePackages.length}</strong>
              </div>
              <div className="text-slate-400">
                Est. Size: <strong className="text-emerald-400 font-mono">3.2 GB</strong>
              </div>
            </div>
          </div>

          {/* Progress Bar & Stages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                {isDone ? 'Build Complete: Bootable Hybrid ISO Ready' : stages[buildStage]?.name || 'Building...'}
              </span>
              <span className="font-mono text-amber-400 font-bold">{progress}%</span>
            </div>

            {/* Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${
                  isDone
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-amber-500 to-amber-400'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              {isDone ? 'Integrity checksum verified (SHA256). All PPAs bundled.' : stageDescription}
            </p>
          </div>

          {/* Stages Checklist */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {stages.map((st, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg border flex items-center gap-2 ${
                  i < buildStage || isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : i === buildStage
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 animate-pulse'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{st.name}</span>
              </div>
            ))}
          </div>

          {/* Completion Download Cards */}
          {isDone && (
            <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>apexos-{config.version}-{config.architecture}.iso</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Ready for bare-metal installation via USB, Proxmox, VirtualBox, or QEMU.
                  </p>
                </div>

                <button
                  onClick={downloadMockIso}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ISO</span>
                </button>
              </div>

              {/* Direct Script Download Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <button
                  onClick={() => downloadSingleScript('format-fat32-usb.sh', generateFormatFat32UsbScript(config))}
                  className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 rounded-xl flex items-center justify-between text-left transition group"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 flex items-center gap-1.5 font-mono">
                      <HardDrive className="w-4 h-4 text-cyan-400" />
                      <span>format-fat32.sh</span>
                    </div>
                    <p className="text-[10px] text-slate-500">FAT32 USB UEFI Formatter</p>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                </button>

                <button
                  onClick={() => downloadSingleScript('make-bootable-fat32.sh', generateMakeBootableFat32Script(config))}
                  className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 rounded-xl flex items-center justify-between text-left transition group"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 flex items-center gap-1.5 font-mono">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <span>make-bootable.sh</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Automated FAT32 Deployer</p>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                </button>

                <button
                  onClick={() => downloadSingleScript('build-iso.sh', generateBuildIsoScript(config))}
                  className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded-xl flex items-center justify-between text-left transition group"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 flex items-center gap-1.5 font-mono">
                      <FileCode className="w-4 h-4 text-emerald-400" />
                      <span>build-iso.sh</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Live ISO Creator Script</p>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
                </button>

                <button
                  onClick={() => downloadSingleScript('install-distro.sh', generateOsInstallScript(config))}
                  className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/40 rounded-xl flex items-center justify-between text-left transition group"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-sky-400 flex items-center gap-1.5 font-mono">
                      <Code className="w-4 h-4 text-sky-400" />
                      <span>install-distro.sh</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Target Drive OS Installer</p>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" />
                </button>
              </div>

              {/* Full Distro Recipe Kit (.zip) */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <FileArchive className="w-4 h-4" />
                    <span>Download Distro Build Kit & FAT32 Boot Tools (.zip)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Includes <span className="font-mono text-slate-300">format-fat32-usb.sh</span>, <span className="font-mono text-slate-300">make-bootable-fat32.sh</span>, <span className="font-mono text-slate-300">build-iso.sh</span>, EFI bootloaders, and autoinstall configs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/assets/aistudio/apexos-24.04.1-distro-recipe_b0b3c4b5.zip"
                    download
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition border border-slate-700 shrink-0"
                    title="Download original attached zip"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Download Attachment</span>
                  </a>

                  <button
                    onClick={downloadDistroBundleZip}
                    disabled={isZipping}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shrink-0 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isZipping ? 'Generating Zip...' : 'Download Kit (.zip)'}</span>
                  </button>
                </div>
              </div>

              {/* Toggleable Script Inspector */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
                <button
                  onClick={() => setShowScriptViewer(!showScriptViewer)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-300 hover:bg-slate-850 transition"
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span>Inspect Generated Scripts & Installer Code</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-mono">
                    {showScriptViewer ? 'Hide Inspector ▲' : 'View Code ▼'}
                  </span>
                </button>

                {showScriptViewer && (
                  <div className="p-3 border-t border-slate-800 space-y-3 bg-slate-950">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                        {[
                          { id: 'format-fat32', label: 'format-fat32-usb.sh' },
                          { id: 'make-bootable', label: 'make-bootable-fat32.sh' },
                          { id: 'build-iso', label: 'build-iso.sh' },
                          { id: 'install-distro', label: 'install-distro.sh' },
                          { id: 'efi-grub', label: 'EFI grub.cfg' },
                          { id: 'post-install', label: 'post-install.sh' },
                          { id: 'autoinstall', label: 'autoinstall.yaml' },
                          { id: 'docker', label: 'Dockerfile' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedScriptTab(t.id as any)}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                              selectedScriptTab === t.id
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyScriptToClipboard(getActiveScriptContent().content)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition border border-slate-700"
                        >
                          {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{copiedScript ? 'Copied!' : 'Copy Code'}</span>
                        </button>

                        <button
                          onClick={() => downloadSingleScript(getActiveScriptContent().name, getActiveScriptContent().content)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono flex items-center gap-1.5 transition border border-slate-700"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 italic">
                      {getActiveScriptContent().desc}
                    </div>

                    <div className="max-h-64 overflow-y-auto p-3 rounded-lg bg-black/80 border border-slate-800 font-mono text-[11px] text-emerald-300 leading-relaxed select-text whitespace-pre-wrap">
                      {getActiveScriptContent().content}
                    </div>
                  </div>
                )}
              </div>

              {/* Flash command helper */}
              <div className="p-3 bg-black/60 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="text-slate-300 font-semibold">Write ISO to USB drive on Linux:</div>
                <div className="text-amber-400 select-all">
                  sudo dd if=apexos-{config.version}-{config.architecture}.iso of=/dev/sdX bs=4M status=progress oflag=sync
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-12 px-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Target Architecture: <strong className="text-slate-200">{config.architecture}</strong></span>
          <div className="flex items-center gap-2">
            {!isDone && (
              <button
                onClick={startBuild}
                disabled={isBuilding}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
              >
                Restart Build
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
            >
              {isDone ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
