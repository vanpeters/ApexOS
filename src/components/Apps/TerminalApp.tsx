import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Terminal as TermIcon, Play, Flame, CheckCircle, Sparkles } from 'lucide-react';
import { DistroConfiguration, ActiveAppId } from '../../types/distro';

interface TerminalAppProps {
  config: DistroConfiguration;
  onOpenApp?: (appId: ActiveAppId) => void;
  onTogglePpa?: (ppaId: string) => void;
}

interface CommandLog {
  id: string;
  type: 'cmd' | 'output' | 'error' | 'success';
  text: string | React.ReactNode;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ config, onOpenApp }) => {
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStage, setBootStage] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [apacheRunning, setApacheRunning] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome logs
  const [logs, setLogs] = useState<CommandLog[]>([]);

  // CSS Boot Animation Sequence
  const runBootSequence = () => {
    setIsBooting(true);
    setBootProgress(0);
    setBootStage(0);
    setBootLogs([]);
    setLogs([]);

    const systemdLogs = [
      '[  OK  ] Started systemd-udevd.service (Kernel Device Manager)',
      '[  OK  ] Mounted /dev/nvme0n1p2 on /sysroot (ext4, noatime, discard)',
      '[  OK  ] Initialized ZRAM compressed memory swap (16 GB ZSTD)',
      '[  OK  ] Loaded Kisak Mesa 24.3 Vulkan graphics drivers (AMD/Intel/NVIDIA)',
      '[  OK  ] Configured KVM hardware virtualization (/dev/kvm permissions verified)',
      '[  OK  ] Started Lutris GameMode daemon (gamemoded.service)',
      '[  OK  ] Started Apache HTTP Server (apache2.service listening on 0.0.0.0:80)',
      '[  OK  ] Verified GPG keyrings in /etc/apt/sources.list.d (Lutris, Android Studio, Claude, ChatGPT)',
      '[  OK  ] Initialized Synaptic Package Manager & HardInfo hardware prober',
      '[  OK  ] Reached target Graphical Interface & Multi-User System.',
    ];

    // Progress increments
    let p = 0;
    const progressTimer = setInterval(() => {
      p += 10;
      setBootProgress(p);
      if (p >= 100) {
        clearInterval(progressTimer);
      }
    }, 120);

    // Boot stages
    setTimeout(() => setBootStage(1), 300); // Logo scanline
    setTimeout(() => setBootStage(2), 700); // Kernel load

    // Stream systemd logs
    systemdLogs.forEach((sLog, i) => {
      setTimeout(() => {
        setBootLogs((prev) => [...prev, sLog]);
      }, 900 + i * 140);
    });

    // Complete boot and show prompt
    setTimeout(() => {
      setIsBooting(false);
      setLogs([
        {
          id: 'welcome-1',
          type: 'output',
          text: (
            <div className="text-slate-400 space-y-1 mb-2 font-mono text-xs">
              <p className="text-amber-400 font-bold">
                Welcome to {config.distroName} (GNU/Linux 6.11.0-xanmod-gaming x86_64)
              </p>
              <p className="text-slate-400">
                * Pre-installed: VS Code, Claude, ChatGPT, Android Studio, Lutris, Steam, Thunar, Synaptic
                <br />
                * Type <span className="text-emerald-400 font-semibold">help</span>, <span className="text-amber-400 font-semibold">./build-iso.sh</span>, or <span className="text-emerald-400 font-semibold">./install-distro.sh</span>
                <br />
                * Type <span className="text-cyan-400 font-semibold">neofetch</span>, <span className="text-cyan-400 font-semibold">synaptic</span>, or <span className="text-cyan-400 font-semibold">hardinfo</span>
              </p>
            </div>
          ),
        },
      ]);
    }, 2500);
  };

  useEffect(() => {
    runBootSequence();
  }, []);

  useEffect(() => {
    if (!isBooting) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isBooting]);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const logEntry: CommandLog = {
      id: Math.random().toString(),
      type: 'cmd',
      text: trimmed,
    };

    const parts = trimmed.split(' ');
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputNode: React.ReactNode = null;

    switch (baseCmd) {
      case 'clear':
        setLogs([]);
        setInputVal('');
        return;

      case 'reboot':
      case 'boot':
        runBootSequence();
        setInputVal('');
        return;

      case 'help':
        outputNode = (
          <div className="space-y-1 text-slate-300 font-mono text-xs">
            <p className="font-semibold text-amber-400">Available commands in {config.distroName}:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <div><span className="text-amber-400 font-bold">./build-iso.sh</span> - Compile live bootable ISO image</div>
              <div><span className="text-emerald-400 font-bold">./install-distro.sh</span> - Direct OS bare-metal installer</div>
              <div><span className="text-emerald-400">code</span> - Launch Visual Studio Code</div>
              <div><span className="text-emerald-400">thunar</span> - Launch Thunar XFCE File Manager</div>
              <div><span className="text-emerald-400">steam</span> - Launch Steam with Wine & Proton 9.0</div>
              <div><span className="text-emerald-400">q4wine</span> - Launch Q4Wine Qt Prefix Manager</div>
              <div><span className="text-emerald-400">mangoapp</span> - Launch Mangoapp Overlay Runner</div>
              <div><span className="text-emerald-400">cmatrix</span> - Launch Matrix Digital Rain Console</div>
              <div><span className="text-emerald-400">tdfsb</span> - Launch 3D File System Browser (Modded)</div>
              <div><span className="text-emerald-400">synaptic</span> - Launch Synaptic Package Manager</div>
              <div><span className="text-emerald-400">hardinfo</span> - Launch HardInfo Benchmark</div>
              <div><span className="text-emerald-400">systemctl status apache2</span> - Inspect Apache2 HTTP Server</div>
              <div><span className="text-emerald-400">apt update / apt list</span> - APT package operations</div>
              <div><span className="text-emerald-400">neofetch</span> - Display system specs & ASCII logo</div>
              <div><span className="text-emerald-400">lutris</span> - Open Lutris Gaming Platform</div>
              <div><span className="text-emerald-400">studio.sh</span> - Open Android Studio IDE</div>
              <div><span className="text-emerald-400">reboot / clear</span> - Replay boot / Clear buffer</div>
            </div>
          </div>
        );
        break;

      case 'synaptic':
        if (onOpenApp) onOpenApp('synaptic');
        outputNode = <p className="text-xs text-emerald-400">Launching Synaptic Package Manager (GTK3)...</p>;
        break;

      case 'hardinfo':
        if (onOpenApp) onOpenApp('hardinfo');
        outputNode = <p className="text-xs text-emerald-400">Launching HardInfo System Profiler & Benchmark tool...</p>;
        break;

      case 'apache2':
      case 'apache2ctl':
      case 'systemctl': {
        const sub = args[0] || '';
        const target = args[1] || '';
        if (sub === 'status' && target.includes('apache')) {
          outputNode = (
            <div className="space-y-0.5 text-xs font-mono text-slate-300">
              <p>● apache2.service - The Apache HTTP Server</p>
              <p>     Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)</p>
              <p>     Active: <span className="text-emerald-400 font-bold">{apacheRunning ? 'active (running)' : 'inactive (dead)'}</span> since Sun 2026-11-01 19:30:12 PST; 16min ago</p>
              <p>       Docs: https://httpd.apache.org/docs/2.4/</p>
              <p>   Main PID: 2841 (apache2)</p>
              <p>      Tasks: 55 (limit: 38321)</p>
              <p>     Memory: 24.2M</p>
              <p>        CPU: 142ms</p>
              <p>     CGroup: /system.slice/apache2.service</p>
              <p>             ├─2841 /usr/sbin/apache2 -k start</p>
              <p>             ├─2842 /usr/sbin/apache2 -k start</p>
              <p>             └─2843 /usr/sbin/apache2 -k start</p>
              <p className="text-slate-400 pt-1">Nov 01 19:30:12 apex-noble systemd[1]: Started The Apache HTTP Server.</p>
              <p className="text-emerald-400 font-semibold">Listening on: http://0.0.0.0:80 (IPv4) and http://[::]:80 (IPv6)</p>
            </div>
          );
        } else if (sub === 'stop' && target.includes('apache')) {
          setApacheRunning(false);
          outputNode = <p className="text-xs text-amber-400">Stopped The Apache HTTP Server (apache2.service).</p>;
        } else if ((sub === 'start' || sub === 'restart') && target.includes('apache')) {
          setApacheRunning(true);
          outputNode = <p className="text-xs text-emerald-400">Started The Apache HTTP Server on port 80.</p>;
        } else {
          if (onOpenApp) onOpenApp('apache2');
          outputNode = <p className="text-xs text-emerald-400">Launching Apache2 Server Manager & Localhost Viewer...</p>;
        }
        break;
      }

      case 'curl': {
        const url = args[0] || '';
        if (url.includes('localhost') || url.includes('127.0.0.1')) {
          outputNode = (
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <p className="text-slate-500">&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"&gt;</p>
              <p className="text-slate-400">&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;</p>
              <p className="text-emerald-400">&lt;title&gt;Apache2 Ubuntu Default Page: It works! - ApexOS&lt;/title&gt;</p>
              <p className="text-amber-400">&lt;h1&gt;Apache2 Ubuntu Default Page&lt;/h1&gt;</p>
              <p className="text-slate-300">&lt;p&gt;This is the default welcome page used to test the correct operation of the Apache2 server on ApexOS (Ubuntu 24.04).&lt;/p&gt;</p>
              <p className="text-slate-400">&lt;/html&gt;</p>
            </div>
          );
        } else {
          outputNode = <p className="text-xs text-slate-400 font-mono">curl: (7) Failed to connect to {url}</p>;
        }
        break;
      }

      case 'neofetch':
        outputNode = (
          <div className="flex flex-col sm:flex-row gap-4 py-2 font-mono text-xs">
            <pre className="text-amber-500 font-bold shrink-0 select-none leading-tight">
{`            .-/+oossssoo+/-.
        \`:+ssssssssssssssssss+:\`
      -+ssssssssssssssssssyyssss+-
    .ossssssssssssssssssdMMMNysssso.
   /ssssssssssshdmmNNmmyNMMMMhssssss/
  +ssssssssshmydDNMMMMMNddhysssssssss+
 /ssssssssdhdmmhyhhyddhssshdmmyysssss/
.sssssssydmmh/-.         .-/hmmmhsssss.
/ssssssydmm+               +mmmhsssss/
osssssydmm+                 hmmmhssssso
/ssssssydmm+               +mmmhsssss/
.sssssssydmmh/-.         .-/hmmmhsssss.
 /ssssssssdhdmmhyhhyddhssshdmmyysssss/
  +ssssssssshmydDNMMMMMNddhysssssssss+
   /ssssssssssshdmmNNmmyNMMMMhssssss/
    .ossssssssssssssssssdMMMNysssso.
      -+ssssssssssssssssssyyssss+-
        \`:+ssssssssssssssssss+:\`
            .-/+oossssoo+/-.`}
            </pre>
            <div className="space-y-1 text-slate-200">
              <p><span className="text-amber-400 font-bold">{config.defaultUsername}@{config.hostname}</span></p>
              <p className="text-slate-500">-------------------------------------</p>
              <p><span className="text-amber-400 font-semibold">OS:</span> {config.distroName} (Ubuntu 24.04.1 LTS Noble)</p>
              <p><span className="text-amber-400 font-semibold">Host:</span> ApexOS KVM Virtual Platform (x86_64)</p>
              <p><span className="text-amber-400 font-semibold">Kernel:</span> 6.11.0-xanmod-gaming (PREEMPT_DYNAMIC)</p>
              <p><span className="text-amber-400 font-semibold">Packages:</span> 2,154 (dpkg including Synaptic, HardInfo, Apache2)</p>
              <p><span className="text-amber-400 font-semibold">Shell:</span> bash 5.2.21</p>
              <p><span className="text-amber-400 font-semibold">DE:</span> GNOME 47.0 (Wayland)</p>
              <p><span className="text-amber-400 font-semibold">Pre-loaded:</span> Claude, ChatGPT, Android Studio, Lutris, Synaptic, HardInfo, Apache2</p>
              <p><span className="text-amber-400 font-semibold">Services:</span> apache2 (Port 80 HTTP active), gamemoded (active)</p>
              <div className="flex gap-1 pt-2">
                <span className="w-3.5 h-3.5 bg-black rounded-xs"></span>
                <span className="w-3.5 h-3.5 bg-rose-500 rounded-xs"></span>
                <span className="w-3.5 h-3.5 bg-emerald-500 rounded-xs"></span>
                <span className="w-3.5 h-3.5 bg-amber-500 rounded-xs"></span>
                <span className="w-3.5 h-3.5 bg-blue-500 rounded-xs"></span>
                <span className="w-3.5 h-3.5 bg-purple-500 rounded-xs"></span>
                <span className="w-3.5 h-3.5 bg-cyan-500 rounded-xs"></span>
                <span className="w-3.5 h-3.5 bg-white rounded-xs"></span>
              </div>
            </div>
          </div>
        );
        break;

      case 'apt':
      case 'apt-get': {
        const sub = args[0] || '';
        if (sub === 'update') {
          outputNode = (
            <div className="space-y-0.5 text-xs text-slate-300 font-mono">
              <p>Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease</p>
              <p className="text-emerald-400">Get:2 https://ppa.launchpadcontent.net/lutris-team/lutris/ubuntu noble InRelease</p>
              <p className="text-emerald-400">Get:3 https://ppa.launchpadcontent.net/maarten-fonville/android-studio/ubuntu noble InRelease</p>
              <p className="text-emerald-400">Get:4 https://packages.anthropic.com/linux/deb stable InRelease</p>
              <p className="text-emerald-400">Get:5 https://packages.openai.com/linux/deb stable InRelease</p>
              <p>Reading package lists... Done</p>
              <p className="text-emerald-400 font-semibold">All packages including Synaptic, HardInfo, and Apache2 are up to date.</p>
            </div>
          );
        } else if (sub === 'list') {
          outputNode = (
            <div className="space-y-0.5 text-xs font-mono text-slate-300 max-h-60 overflow-y-auto">
              {config.packages.map((p) => (
                <p key={p.id}>
                  <span className="text-emerald-400">{p.name}</span>/{config.codename} [{p.version}] {p.installed ? '[installed]' : '[available]'}
                </p>
              ))}
            </div>
          );
        } else {
          outputNode = <p className="text-slate-400 text-xs">apt {sub}: try "apt update" or "apt list".</p>;
        }
        break;
      }

      case './build-iso.sh':
      case 'bash build-iso.sh':
      case 'build-iso.sh':
      case 'build-iso': {
        const activePkgs = config.packages.filter((p) => p.installed).map((p) => p.name);
        outputNode = (
          <div className="space-y-2 py-1 font-mono text-xs">
            <div className="text-amber-400 font-bold">
              [ApexOS ISO Builder] Executing ./build-iso.sh for {config.distroName}
            </div>
            <div className="text-slate-400">
              Bundling: {activePkgs.join(', ')}
            </div>
            <div className="py-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="animate-spin">⠋</span>
                <span>[1/8] Debootstrapping Ubuntu 24.04 LTS (${config.codename}) minbase filesystem...</span>
              </div>
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                [████░░░░░░░░░░░░░░░░░░░░░░░░░░] 12% (core rootfs prepared)
              </div>
            </div>
          </div>
        );

        const steps = [
          {
            delay: 700,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[2/8] Injecting PPA keyrings (VS Code, Lutris, Android Studio, Claude, ChatGPT, Kisak Mesa)...</p>
                <div className="text-slate-500 font-mono text-[11px]">[████████░░░░░░░░░░░░░░░░░░░░░░] 25%</div>
              </div>
            ),
          },
          {
            delay: 1400,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[3/8] Installing Kernel ({config.kernelVariant}) and Casper live-boot stack...</p>
                <div className="text-slate-500 font-mono text-[11px]">[████████████░░░░░░░░░░░░░░░░░░] 38%</div>
              </div>
            ),
          },
          {
            delay: 2100,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[4/8] Installing Desktop Environment ({config.desktopEnvironment}) & Ubiquity installer...</p>
                <div className="text-slate-500 font-mono text-[11px]">[████████████████░░░░░░░░░░░░░░] 50%</div>
              </div>
            ),
          },
          {
            delay: 2800,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[5/8] Installing user packages: code, steam, thunar, q4wine, mangoapp, synaptic, hardinfo...</p>
                <div className="text-slate-500 font-mono text-[11px]">[████████████████████░░░░░░░░░░] 63%</div>
              </div>
            ),
          },
          {
            delay: 3500,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[6/8] Extracting kernel vmlinuz & Casper initrd.img...</p>
                <div className="text-slate-500 font-mono text-[11px]">[████████████████████████░░░░░░] 75%</div>
              </div>
            ),
          },
          {
            delay: 4200,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[7/8] Compressing rootfs into SquashFS (XZ 1MB compression)...</p>
                <div className="text-slate-500 font-mono text-[11px]">[████████████████████████████░░] 88%</div>
              </div>
            ),
          },
          {
            delay: 4900,
            node: (
              <div className="space-y-1.5 font-mono text-xs p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-emerald-400 font-bold">[8/8] [SUCCESS] Hybrid UEFI & BIOS Bootable ISO generated successfully!</p>
                <p className="text-slate-300">File: apexos-${config.version}-${config.architecture}.iso (3.2 GB)</p>
                <p className="text-slate-400 font-mono text-[11px]">SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</p>
                <p className="text-amber-400">Flash to USB: sudo dd if=apexos-${config.version}-${config.architecture}.iso of=/dev/sdX bs=4M status=progress</p>
              </div>
            ),
          },
        ];

        steps.forEach(({ delay, node }) => {
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              { id: Math.random().toString(), type: 'output', text: node },
            ]);
          }, delay);
        });
        break;
      }

      case './install-distro.sh':
      case 'bash install-distro.sh':
      case 'install-distro.sh':
      case 'install-distro':
      case 'os-install': {
        outputNode = (
          <div className="space-y-2 py-1 font-mono text-xs">
            <div className="text-emerald-400 font-bold">
              [ApexOS Installer] Initializing bare-metal OS target drive installation...
            </div>
            <div className="text-slate-400">
              Target System: {config.distroName} (Ubuntu {config.codename} • {config.kernelVariant})
            </div>
            <div className="py-1">
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="animate-spin">⠋</span>
                <span>[1/7] Scanning storage bus for available NVMe/SATA block devices...</span>
              </div>
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                Target Selected: /dev/nvme0n1 (1000.2 GB NVMe Samsung 990 PRO)
              </div>
            </div>
          </div>
        );

        const installSteps = [
          {
            delay: 700,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[2/7] Creating GPT Partition Table: /dev/nvme0n1p1 (ESP 512M), p2 (Swap 4G), p3 (ext4 APEX_ROOT)...</p>
                <div className="text-slate-500 font-mono text-[11px]">[████░░░░░░░░░░░░░░░░░░░░░░░░░░] 20%</div>
              </div>
            ),
          },
          {
            delay: 1500,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[3/7] Formatting filesystems: mkfs.vfat -F32 (EFI), mkswap, mkfs.ext4 -L "APEX_ROOT"...</p>
                <div className="text-slate-500 font-mono text-[11px]">[████████░░░░░░░░░░░░░░░░░░░░░░] 38%</div>
              </div>
            ),
          },
          {
            delay: 2300,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[4/7] Unpacking Casper SquashFS rootfs to /mnt/apex-install (4.2 GB payload)...</p>
                <div className="text-slate-500 font-mono text-[11px]">[██████████████░░░░░░░░░░░░░░░░] 60%</div>
              </div>
            ),
          },
          {
            delay: 3100,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[5/7] Generating /etc/fstab with persistent partition UUIDs and ZRAM generator...</p>
                <div className="text-slate-500 font-mono text-[11px]">[████████████████████░░░░░░░░░░] 78%</div>
              </div>
            ),
          },
          {
            delay: 3900,
            node: (
              <div className="space-y-1 font-mono text-xs">
                <p className="text-slate-400">[6/7] Installing GRUB 2.12 EFI Bootloader (UEFI x86_64) and generating initramfs...</p>
                <div className="text-slate-500 font-mono text-[11px]">[█████████████████████████░░░░░] 92%</div>
              </div>
            ),
          },
          {
            delay: 4700,
            node: (
              <div className="space-y-1.5 font-mono text-xs p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <p className="text-emerald-400 font-bold">[7/7] [SUCCESS] {config.distroName} installed successfully to /dev/nvme0n1!</p>
                <p className="text-slate-300">Default user: <strong className="text-amber-400">{config.defaultUsername}</strong> (Password: apex) • Sudo privileges enabled</p>
                <p className="text-slate-400">Bootloader: GRUB EFI Boot entry "ApexOS" registered in NVRAM</p>
                <p className="text-emerald-400 font-semibold">Ready to reboot into bare-metal system (sudo reboot).</p>
              </div>
            ),
          },
        ];

        installSteps.forEach(({ delay, node }) => {
          setTimeout(() => {
            setLogs((prev) => [
              ...prev,
              { id: Math.random().toString(), type: 'output', text: node },
            ]);
          }, delay);
        });
        break;
      }

      case 'code':
      case 'vscode':
        outputNode = (
          <div className="space-y-1 font-mono text-xs text-slate-300">
            <p className="text-emerald-400 font-bold">Visual Studio Code 1.95.3 (Microsoft APT Repository)</p>
            <p className="text-slate-400">Binary: /usr/bin/code</p>
            <p className="text-slate-400">Extensions: Remote-SSH, C/C++, Python, WSL, Docker, GitLens</p>
            <p className="text-cyan-400">Launching VS Code workspace in background...</p>
          </div>
        );
        break;

      case 'lutris':
        if (onOpenApp) onOpenApp('lutris');
        outputNode = <p className="text-xs text-emerald-400">Launching Lutris Gaming Platform...</p>;
        break;

      case 'studio.sh':
      case 'android-studio':
        if (onOpenApp) onOpenApp('android-studio');
        outputNode = <p className="text-xs text-emerald-400">Launching Android Studio...</p>;
        break;

      case 'claude':
        if (onOpenApp) onOpenApp('claude');
        outputNode = <p className="text-xs text-emerald-400">Launching Claude Desktop...</p>;
        break;

      case 'gemini':
        if (onOpenApp) onOpenApp('gemini');
        outputNode = <p className="text-xs text-cyan-400">Launching Gemini AI Linux Distro Architect...</p>;
        break;

      case 'chatgpt':
        if (onOpenApp) onOpenApp('chatgpt');
        outputNode = <p className="text-xs text-emerald-400">Launching ChatGPT Desktop...</p>;
        break;

      case 'thunar':
        if (onOpenApp) onOpenApp('thunar');
        outputNode = <p className="text-xs text-emerald-400">Launching Thunar 4.18 File Manager...</p>;
        break;

      case 'steam':
        if (onOpenApp) onOpenApp('steam');
        outputNode = <p className="text-xs text-blue-400">Launching Steam with Wine & Proton compatibility runtime...</p>;
        break;

      case 'q4wine':
      case 'winetricks':
        if (onOpenApp) onOpenApp('q4wine');
        outputNode = <p className="text-xs text-amber-400">Launching Q4Wine Qt Prefix Manager...</p>;
        break;

      case 'mangoapp':
      case 'mangohud':
        if (onOpenApp) onOpenApp('mangoapp');
        outputNode = <p className="text-xs text-emerald-400">Launching Mangoapp Wayland/X11 HUD overlay runner...</p>;
        break;

      case 'cmatrix':
        if (onOpenApp) onOpenApp('cmatrix');
        outputNode = <p className="text-xs text-emerald-400">Initiating cmatrix digital rain console...</p>;
        break;

      case 'tdfsb':
        if (onOpenApp) onOpenApp('tdfsb');
        outputNode = <p className="text-xs text-cyan-400">Entering TDFSB 3D File System Browser room...</p>;
        break;

      case 'wine':
        outputNode = (
          <div className="space-y-0.5 text-xs font-mono text-slate-300">
            <p className="text-emerald-400 font-bold">wine-9.21 (Staging) on ApexOS x86_64</p>
            <p>Usage: wine PROGRAM [ARGUMENTS...]</p>
            <p className="text-slate-400">Default WINEPREFIX: ~/.wine (win64 Windows 10)</p>
          </div>
        );
        break;

      case 'uname':
        outputNode = (
          <p className="text-xs font-mono text-slate-300">
            Linux {config.hostname} 6.11.0-xanmod-gaming #1 SMP PREEMPT_DYNAMIC {config.architecture} GNU/Linux
          </p>
        );
        break;

      case 'whoami':
        outputNode = <p className="text-xs font-mono text-emerald-400">{config.defaultUsername}</p>;
        break;

      default:
        outputNode = (
          <p className="text-rose-400 text-xs font-mono">
            bash: {baseCmd}: command not found. Type <span className="text-slate-200 underline">help</span> for commands.
          </p>
        );
    }

    setLogs((prev) => [
      ...prev,
      logEntry,
      { id: Math.random().toString(), type: 'output', text: outputNode },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    }
  };

  return (
    <div
      onClick={handleFocus}
      className="flex-1 flex flex-col bg-slate-950 font-mono text-sm leading-relaxed overflow-y-auto cursor-text text-slate-200 relative select-text"
    >
      {/* Terminal Sub-header with Boot Replay button */}
      <div className="h-7 px-3 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>bash 5.2.21 (x86_64-pc-linux-gnu)</span>
        </div>
        <button
          onClick={runBootSequence}
          disabled={isBooting}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition text-[10px] font-medium"
        >
          <RotateCcw className={`w-3 h-3 ${isBooting ? 'animate-spin' : ''}`} />
          <span>Replay Boot Sequence</span>
        </button>
      </div>

      {/* CSS-Based Boot Animation Sequence Overlay */}
      {isBooting ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden bg-slate-950">
          {/* Scanline laser CSS effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-pulse opacity-80"></div>

          {/* Logo Container with Neon Glow */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-3xl bg-slate-900/90 border-2 border-amber-500/80 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.35)] relative overflow-hidden group">
              {/* Internal glowing geometry */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-rose-500/10 to-cyan-500/20 animate-pulse"></div>
              {/* Laser scan line moving down */}
              <div className="absolute inset-x-0 h-1 bg-amber-400/80 shadow-[0_0_12px_#f59e0b] animate-bounce"></div>
              <Flame className="w-12 h-12 text-amber-400 relative z-10 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            </div>

            {/* Glowing Ring */}
            <div className="absolute -inset-2 rounded-3xl border border-amber-500/20 animate-ping opacity-25 pointer-events-none"></div>
          </div>

          {/* Branding Title */}
          <div className="space-y-1 mb-6">
            <h1 className="text-2xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
              APEX<span className="text-amber-400">OS</span>
            </h1>
            <p className="text-xs text-amber-300 font-mono tracking-wider">
              UBUNTU 24.04 LTS NOBLE · KERNEL 6.11 XANMOD
            </p>
          </div>

          {/* Boot Progress Bar */}
          <div className="w-80 space-y-2 mb-6">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span className="text-slate-300">
                {bootStage === 0 && 'UEFI SecureBoot: OK'}
                {bootStage === 1 && 'Loading vmlinuz-6.11.0-xanmod-gaming...'}
                {bootStage === 2 && 'Mounting Casper Live-Boot initramfs...'}
              </span>
              <span className="text-amber-400 font-bold">{bootProgress}%</span>
            </div>

            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                style={{ width: `${bootProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Systemd Boot Log Ticker */}
          <div className="w-full max-w-xl text-left bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 h-32 overflow-hidden font-mono text-[11px] space-y-1">
            {bootLogs.map((log, idx) => (
              <div key={idx} className="text-slate-300 truncate">
                <span className="text-emerald-400 font-bold">[  OK  ]</span>{' '}
                <span className="text-slate-300">{log.replace('[  OK  ] ', '')}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Regular Interactive Terminal View */
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="text-xs">
              {log.type === 'cmd' ? (
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-400 font-semibold">
                    {config.defaultUsername}@{config.hostname}
                  </span>
                  <span className="text-slate-500">:</span>
                  <span className="text-cyan-400">~</span>
                  <span className="text-amber-400 font-bold">$</span>
                  <span className="text-white font-medium">{log.text}</span>
                </div>
              ) : (
                <div className="mt-0.5">{log.text}</div>
              )}
            </div>
          ))}

          {/* Active Prompt Line */}
          <div className="flex items-center gap-2 mt-2 shrink-0">
            <span className="text-emerald-400 font-semibold">
              {config.defaultUsername}@{config.hostname}
            </span>
            <span className="text-slate-500">:</span>
            <span className="text-cyan-400">~</span>
            <span className="text-amber-400 font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono caret-amber-400 p-0 m-0"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      )}
    </div>
  );
};
