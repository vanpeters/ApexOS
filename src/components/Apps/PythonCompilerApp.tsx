import React, { useState, useRef, useEffect, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import {
  Play,
  Square,
  ClipboardPaste,
  Copy,
  RotateCcw,
  Sparkles,
  Terminal as TerminalIcon,
  Code2,
  FileText,
  Download,
  Check,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Cpu,
  Clock,
  Layers,
  ArrowRight,
  Send,
  Zap,
  Bookmark,
  FolderCode,
  Save,
  Plus,
  Trash2,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Tag,
  Upload,
  FolderPlus,
  FileCode2,
  FileDown,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

export interface UserSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  defaultInput?: string;
  category: 'system' | 'hardware' | 'math' | 'utility' | 'custom';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_USER_SNIPPETS: UserSnippet[] = [
  {
    id: 'snip-subprocess',
    title: 'Shell Subprocess & Pipe Runner',
    description: 'Executes shell pipelines, captures stdout/stderr, and checks return codes',
    category: 'system',
    tags: ['subprocess', 'shell', 'kernel', 'pipes'],
    defaultInput: 'uname -a\\ndf -h /boot/efi',
    createdAt: '2026-11-06',
    updatedAt: '2026-11-06',
    code: `# ==============================================================
# Python Subprocess & Shell Pipeline Orchestrator
# ==============================================================
import sys
import os
import time

def run_command(cmd):
    print(f">> Executing: {cmd}")
    time.sleep(0.3)
    if "uname" in cmd:
        return "Linux apexos-builder 6.11.0-xanmod-gaming x86_64 GNU/Linux"
    elif "df" in cmd:
        return "Filesystem     1K-blocks  Used Available Use% Mounted on\\\\n/dev/nvme0n1p1    523248 14320    508928   3% /boot/efi"
    else:
        return f"[cmd '{cmd}' completed with exit status 0]"

print("[*] Subprocess Worker Initialized")
cmd1 = input("Enter primary shell command to run: ")
cmd2 = input("Enter secondary probe command: ")

print("-" * 50)
out1 = run_command(cmd1)
print(out1)
print("-" * 50)
out2 = run_command(cmd2)
print(out2)
print("[*] Pipeline finished.")
`,
  },
  {
    id: 'snip-cpu-load',
    title: 'CPU Core Load & Thread Worker Pool',
    description: 'Calculates /proc/loadavg averages, thermal throttle, and multi-core thread affinity',
    category: 'hardware',
    tags: ['cpu', 'thermal', 'hardware', 'threads', 'telemetry'],
    defaultInput: '8\\n85.5',
    createdAt: '2026-11-06',
    updatedAt: '2026-11-06',
    code: `# ==============================================================
# CPU Core Load & Thermal Throttling Diagnostic
# ==============================================================
import math
import time

cores = int(input("Enter number of available CPU cores [e.g. 8, 16]: "))
target_pct = float(input("Enter simulated CPU load percentage [e.g. 75.0]: "))

print(f"[*] Analyzing CPU Topology: {cores} Cores @ 4.80 GHz Boost")

load_1m = (cores * target_pct) / 100.0
load_5m = load_1m * 0.92
load_15m = load_1m * 0.85

print(f"Load Averages (1m, 5m, 15m): {load_1m:.2f}, {load_5m:.2f}, {load_15m:.2f}")

for core_id in range(cores):
    core_load = min(100.0, max(5.0, target_pct + (core_id % 3 - 1) * 6.5))
    bar_len = int(core_load / 5)
    bar = "█" * bar_len + "░" * (20 - bar_len)
    status = "THRTL" if core_load > 90.0 else "NOMINAL"
    print(f"  Core #{core_id:02d} [{bar}] {core_load:5.1f}% [{status}]")

temp_c = 42.0 + (target_pct * 0.45)
print(f"\\\\nPackage Temperature: {temp_c:.1f}°C (Tjunction Max: 100°C)")
if temp_c > 85.0:
    print("[WARNING] Thermal mitigation: Scaling down CPU P-cores to 3.8 GHz")
else:
    print("[OK] Thermal headroom sufficient for sustained Turbo Boost.")
`,
  },
  {
    id: 'snip-fat32-inspector',
    title: 'FAT32 Boot Sector & EFI Partition Prober',
    description: 'Inspects bytes per sector, cluster size, file allocation table count, and EFI stub',
    category: 'system',
    tags: ['fat32', 'efi', 'storage', 'partition', 'usb'],
    defaultInput: '512\\n8\\nAPEX_BOOT',
    createdAt: '2026-11-06',
    updatedAt: '2026-11-06',
    code: `# ==============================================================
# FAT32 / EFI System Partition Structure Inspector
# ==============================================================

bytes_per_sector = int(input("Bytes per sector [default 512]: "))
sectors_per_cluster = int(input("Sectors per cluster [default 8 = 4096B]: "))
volume_label = input("Volume Label [e.g. APEX_BOOT]: ")

cluster_size = bytes_per_sector * sectors_per_cluster
reserved_sectors = 32
num_fats = 2

print("=" * 55)
print(f"FAT32 File System Geometry Analysis for [{volume_label}]:")
print(f"  - Sector Size:          {bytes_per_sector} bytes")
print(f"  - Cluster Size:         {cluster_size} bytes ({cluster_size / 1024:.1f} KB)")
print(f"  - Reserved Sectors:     {reserved_sectors} (Contains VBR & FSInfo)")
print(f"  - Number of FAT Tables: {num_fats} (Redundant FAT1 & FAT2)")
print(f"  - Root Directory Clust: Cluster #2")
print(f"  - EFI System Partition: /EFI/BOOT/BOOTX64.EFI verified")

if cluster_size % 4096 == 0:
    print("  - [PASS] Flash Alignment: 4096-byte boundary aligned (Optimal for SSD/USB)")
else:
    print("  - [WARN] Suboptimal cluster size for modern flash storage")

print("=" * 55)
`,
  },
  {
    id: 'snip-matrix-rain',
    title: 'Matrix Rain Terminal Streamer',
    description: 'Generates animated digital rain ASCII art streams with customizable density',
    category: 'utility',
    tags: ['matrix', 'ascii', 'animation', 'terminal'],
    defaultInput: '25\\n12',
    createdAt: '2026-11-06',
    updatedAt: '2026-11-06',
    code: `# ==============================================================
# Matrix Rain ASCII Stream Generator
# ==============================================================
import random
import time

cols = int(input("Enter terminal stream columns (e.g. 25, 40): "))
rows = int(input("Enter stream duration frames (e.g. 10, 20): "))

chars = "0123456789ABCDEF@#$%&*+-=~ApexOS"

print("[*] Initiating Matrix digital stream...")
for r in range(rows):
    line = "".join([random.choice(chars) if random.random() > 0.4 else " " for _ in range(cols)])
    print(f"\\\\033[32m{line}\\\\033[0m")
    time.sleep(0.08)

print("[*] Stream terminated.")
`,
  },
  {
    id: 'snip-bat0-monitor',
    title: 'Sysfs BAT0 Power & Wear Degradation Analyzer',
    description: 'Probes ACPI power_now, energy_full, and calculates battery health percentage',
    category: 'hardware',
    tags: ['battery', 'acpi', 'power', 'wear', 'sysfs'],
    defaultInput: '',
    createdAt: '2026-11-06',
    updatedAt: '2026-11-06',
    code: `# ==============================================================
# Sysfs BAT0 Real-Time Power & Wear Calculator
# ==============================================================
energy_now_wh = 63.65
energy_full_wh = 72.00
design_wh = 77.40
power_w = 14.20

wear_pct = ((design_wh - energy_full_wh) / design_wh) * 100.0
charge_pct = (energy_now_wh / energy_full_wh) * 100.0
runtime_hours = energy_now_wh / power_w

print(f"[BAT0] Current Charge: {charge_pct:.1f}% ({energy_now_wh:.1f} Wh)")
print(f"[BAT0] Discharge Rate: {power_w:.2f} Watts")
print(f"[BAT0] Battery Wear:   {wear_pct:.1f}% degradation (Health: {100 - wear_pct:.1f}%)")
print(f"[BAT0] Est. Remaining: {runtime_hours:.1f} hours")
`,
  },
  {
    id: 'snip-prime-monte-carlo',
    title: 'Monte Carlo Pi & Benchmark Suite',
    description: 'Estimates Pi using random Cartesian sampling and computes execution timing',
    category: 'math',
    tags: ['math', 'pi', 'monte-carlo', 'benchmark'],
    defaultInput: '5000',
    createdAt: '2026-11-06',
    updatedAt: '2026-11-06',
    code: `# ==============================================================
# Monte Carlo Pi Estimation & Number Theory
# ==============================================================
import math
import random
import time

iters = int(input("Enter number of sample points [e.g. 3000, 5000]: "))
start = time.time()
inside = 0

for _ in range(iters):
    x = random.random()
    y = random.random()
    if x*x + y*y <= 1.0:
        inside += 1

pi_est = 4.0 * (inside / iters)
print(f"Sample Count:    {iters}")
print(f"Estimated Pi:    {pi_est:.6f}")
print(f"Math.pi Diff:    {abs(pi_est - math.pi):.6f}")
print(f"Elapsed Time:    {(time.time() - start) * 1000:.2f} ms")
`,
  },
];

interface PythonCompilerAppProps {
  config: DistroConfiguration;
  onOpenApp?: (appId: string) => void;
}

interface TerminalLine {
  id: string;
  type: 'stdout' | 'stderr' | 'info' | 'input' | 'system';
  text: string;
  timestamp: string;
}

export const PythonCompilerApp: React.FC<PythonCompilerAppProps> = ({ config }) => {
  // Builtin Starter Code Templates
  const templates: Record<string, { title: string; description: string; code: string; defaultInput: string }> = {
    'iso-builder': {
      title: 'Distro ISO Auto-Builder (Subprocess Orchestrator)',
      description: 'Automates debootstrap, kernel injection, squashfs creation and FAT32 boot check',
      defaultInput: `ApexOS-Pro\namd64\nyes`,
      code: `# ==============================================================
# ApexOS Linux - Automated Distro ISO Builder & Packager
# Python 3.12 Orchestration Script
# ==============================================================
import time
import sys
import os

print(f"[*] Initializing ApexOS ISO Builder Engine on {sys.platform}...")
print(f"[*] Host CPU Architecture: {sys.argv[0] if len(sys.argv) > 0 else 'x86_64'}")

# Interactive prompt reading from Run Prompt stdin
distro_name = input("Enter Target Distro Name [e.g. ApexOS]: ")
arch = input("Enter Target Architecture [amd64/arm64]: ")
enable_zram = input("Enable ZRAM Compressed Swap? (yes/no): ")

print("-" * 55)
print(f"[+] Build Configuration Confirmed:")
print(f"    - Distribution: {distro_name}")
print(f"    - Target Arch:  {arch}")
print(f"    - Kernel:       6.11.0-xanmod-gaming")
print(f"    - ZRAM Cache:   {enable_zram.upper()}")
print("-" * 55)

stages = [
    "1/6: Debootstrap Ubuntu 24.04 (Noble Numbat) minimal chroot",
    "2/6: Injecting Linux XanMod 6.11 kernel & Kisak Mesa 24.3 drivers",
    "3/6: Installing Wine Staging 9.21, Lutris & Mangoapp stack",
    "4/6: Generating UEFI GRUB 2.12 EFI/BOOT/BOOTX64.EFI stub",
    "5/6: Compressing rootfs into SquashFS (XZ 1MB block dictionary)",
    "6/6: Packaging hybrid ISO with FAT32 EFI partition structure"
]

for stage in stages:
    print(f">> Executing: {stage}...")
    time.sleep(0.4)
    print("   [OK] Stage completed successfully.")

print("=" * 55)
print(f"[SUCCESS] ISO Image Generated: {distro_name.lower()}-{arch}.iso (3.2 GB)")
print("Sha256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069")
print("Ready to flash via: sudo dd if=apexos.iso of=/dev/sdX bs=4M status=progress")
`,
    },

    'bat0-telemetry': {
      title: 'Sysfs BAT0 Telemetry & Power Wear Diagnostic',
      description: 'Parses /sys/class/power_supply/BAT0/ files, calculating discharge in Watts & wear level',
      defaultInput: ``,
      code: `# ==============================================================
# ApexOS Linux - /sys/class/power_supply/BAT0/ Hardware Prober
# Calculates Discharge Rate in Watts & Battery Wear Degradation
# ==============================================================
import math
import time

print("[SYSFS] Probing ACPI /sys/class/power_supply/BAT0/...")

# Raw sysfs simulated micro-unit values (uWh, uW, uV)
sysfs_data = {
    "status": "Discharging",
    "energy_now": 63650000,          # 63.65 Wh (63,650,000 uWh)
    "energy_full": 72000000,         # 72.00 Wh (72,000,000 uWh)
    "energy_full_design": 77400000,  # 77.40 Wh (77,400,000 uWh)
    "power_now": 14200000,           # 14.20 W  (14,200,000 uW)
    "voltage_now": 15400000,         # 15.40 V  (15,400,000 uV)
    "cycle_count": 84,
    "technology": "Li-ion",
    "manufacturer": "SMP-Apex",
    "model_name": "APX-9984"
}

# Real-time physical unit conversions
energy_now_wh = sysfs_data["energy_now"] / 1000000.0
energy_full_wh = sysfs_data["energy_full"] / 1000000.0
design_wh = sysfs_data["energy_full_design"] / 1000000.0
power_w = sysfs_data["power_now"] / 1000000.0
voltage_v = sysfs_data["voltage_now"] / 1000000.0

# Calculations
charge_pct = (energy_now_wh / energy_full_wh) * 100.0
wear_level_pct = ((design_wh - energy_full_wh) / design_wh) * 100.0
health_pct = 100.0 - wear_level_pct
time_remaining_hours = energy_now_wh / power_w if power_w > 0 else 0

print("=" * 50)
print(f"BAT0 Hardware ID:       {sysfs_data['manufacturer']} {sysfs_data['model_name']} ({sysfs_data['technology']})")
print(f"Battery Status:         {sysfs_data['status'].upper()}")
print(f"Current Charge:         {charge_pct:.1f}% ({energy_now_wh:.2f} Wh / {energy_full_wh:.2f} Wh)")
print(f"Discharge Rate:         {power_w:.2f} Watts @ {voltage_v:.2f}V")
print(f"Factory Design Capacity:{design_wh:.2f} Wh")
print(f"Battery Wear Level:     {wear_level_pct:.2f}% degradation")
print(f"State of Health (SoH):  {health_pct:.1f}%")
print(f"Cycle Count:            {sysfs_data['cycle_count']} charge cycles")
print(f"Estimated Runtime:      {math.floor(time_remaining_hours)}h {int((time_remaining_hours % 1) * 60)}m remaining")
print("=" * 50)
`,
    },

    'interactive-input': {
      title: 'Interactive Run Prompt & Input() Demo',
      description: 'Demonstrates reading multiple pasted or typed inputs directly from the Run Prompt',
      defaultInput: `DevUser\nlinux-xanmod-gaming\n1920x1080@144Hz\n4`,
      code: `# ==============================================================
# Interactive Python Input() & Paste Demonstration
# Input lines are read sequentially from the 'Run Prompt' panel!
# ==============================================================

print("=== Welcome to ApexOS Python 3.12 Interactive Prompt ===")

user = input("1. Enter your developer username: ")
kernel = input("2. Preferred Linux kernel variant: ")
display = input("3. Target monitor resolution: ")
cores = input("4. Number of CPU build threads: ")

print()
print("--> Processing inputs received from Run Prompt...")
cores_int = int(cores) if cores.isdigit() else 8

print(f"User:           {user}")
print(f"Kernel Variant: {kernel}")
print(f"Display Mode:   {display}")
print(f"Parallel Jobs:  -j{cores_int} (Make acceleration)")

print()
print("Generating build threads:")
for i in range(1, cores_int + 1):
    print(f"  [Thread {i}] Initialized worker pool for {user}...")

print("[SUCCESS] All interactive inputs consumed successfully!")
`,
    },

    'data-science': {
      title: 'Algorithms & Computational Benchmark Suite',
      description: 'Prime sieve, recursive memoized Fibonacci, QuickSort & Pi Monte Carlo approximation',
      defaultInput: `1000\n30`,
      code: `# ==============================================================
# Python 3.12 Computational Benchmark & Number Theory
# ==============================================================
import math
import random
import time

limit = int(input("Enter Prime Sieve upper limit (e.g. 500, 1000): "))
fib_n = int(input("Enter Fibonacci index to calculate (e.g. 25, 35): "))

start = time.time()

# 1. Sieve of Eratosthenes
primes = []
sieve = [True] * (limit + 1)
for p in range(2, limit + 1):
    if sieve[p]:
        primes.append(p)
        for i in range(p * p, limit + 1, p):
            sieve[i] = False

print(f"[1] Prime Sieve up to {limit}: found {len(primes)} primes.")
print(f"    First 10 primes: {primes[:10]}")
print(f"    Largest prime found: {primes[-1] if primes else 'None'}")

# 2. Recursive Fibonacci with dictionary memoization
memo = {}
def fib(n):
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]

fib_val = fib(fib_n)
print(f"[2] Fibonacci({fib_n}) = {fib_val}")

# 3. Monte Carlo Pi Estimation
samples = 5000
inside_circle = 0
for _ in range(samples):
    x = random.random()
    y = random.random()
    if x*x + y*y <= 1.0:
        inside_circle += 1

pi_est = 4.0 * (inside_circle / samples)
print(f"[3] Monte Carlo Pi Estimation ({samples} iterations): {pi_est:.5f}")
print(f"    Math.pi difference: {abs(pi_est - math.pi):.5f}")

elapsed = (time.time() - start) * 1000
print(f"Benchmark finished in {elapsed:.2f} ms")
`,
    },

    'edid-calculator': {
      title: 'VESA EDID & Refresh Rate Pixel Clock Calculator',
      description: 'Calculates horizontal frequency, bandwidth in Gbps & pixel clock for display modes',
      defaultInput: `2560\n1440\n165`,
      code: `# ==============================================================
# ApexOS Display Manager - VESA CVT 1.2 Modelines Generator
# ==============================================================
import math

width = int(input("Enter Display Width (e.g. 1920, 2560, 3840): "))
height = int(input("Enter Display Height (e.g. 1080, 1440, 2160): "))
refresh = int(input("Enter Desired Refresh Rate (e.g. 60, 144, 165): "))

# Approximate VESA Coordinated Video Timings (CVT) reduced blanking
total_h = width + 160
total_v = height + 40

pixel_clock_mhz = (total_h * total_v * refresh) / 1000000.0
bandwidth_gbps = (pixel_clock_mhz * 24 * 1.25) / 1000.0  # 24-bit RGB with 8b/10b encoding

print(f"=== Modelines & EDID Specs for {width}x{height} @ {refresh}Hz ===")
print(f"Pixel Clock:       {pixel_clock_mhz:.2f} MHz")
print(f"Required Bandwidth:{bandwidth_gbps:.2f} Gbps")
print(f"Aspect Ratio:      {math.gcd(width, height)} simplified ({width/math.gcd(width, height):.0f}:{height/math.gcd(width, height):.0f})")

if bandwidth_gbps < 8.16:
    print("Interface Support: HDMI 1.4 / DisplayPort 1.2 Compatible")
elif bandwidth_gbps < 18.0:
    print("Interface Support: HDMI 2.0 / DisplayPort 1.4 Compatible")
elif bandwidth_gbps < 48.0:
    print("Interface Support: HDMI 2.1 / DisplayPort 2.1 UHBR10 Compatible")
else:
    print("Interface Support: Requires Display Stream Compression (DSC 1.2a)")
`,
    },
  };

  const [activeTemplate, setActiveTemplate] = useState<string>('iso-builder');
  const [code, setCode] = useState<string>(templates['iso-builder'].code);
  const [runPrompt, setRunPrompt] = useState<string>(templates['iso-builder'].defaultInput);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'info',
      text: 'Python 3.12.3 (main, Nov 2024, 09:12:44) [GCC 13.3.0 on linux x86_64]',
      timestamp: '00:00:00',
    },
    {
      id: 'init-2',
      type: 'info',
      text: 'Type "help()", "copyright()", or "license()" for more information.',
      timestamp: '00:00:00',
    },
    {
      id: 'init-3',
      type: 'system',
      text: '⚡ Ready. Click [▶ Run (Ctrl+Enter)] or paste inputs directly into the [Run Prompt] below.',
      timestamp: '00:00:00',
    },
  ]);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'repl'>('editor');
  const [replInput, setReplInput] = useState<string>('');
  const [replHistory, setReplHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [pastedNotice, setPastedNotice] = useState<string | null>(null);
  const [interactivePromptModal, setInteractivePromptModal] = useState<{
    promptText: string;
    resolve: (val: string) => void;
  } | null>(null);
  const [modalInputValue, setModalInputValue] = useState<string>('');

  // Snippet Library Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [userSnippets, setUserSnippets] = useState<UserSnippet[]>(() => {
    try {
      const stored = localStorage.getItem('apexos_python_snippets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_USER_SNIPPETS;
  });
  const [snippetSearchQuery, setSnippetSearchQuery] = useState<string>('');
  const [selectedSnippetCategory, setSelectedSnippetCategory] = useState<string>('all');
  const [selectedSnippetTag, setSelectedSnippetTag] = useState<string | null>(null);
  const [snippetSortBy, setSnippetSortBy] = useState<'recent' | 'title' | 'lines'>('recent');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [newSnippetTitle, setNewSnippetTitle] = useState<string>('');
  const [newSnippetDesc, setNewSnippetDesc] = useState<string>('');
  const [newSnippetCategory, setNewSnippetCategory] = useState<UserSnippet['category']>('custom');
  const [newSnippetTagsInput, setNewSnippetTagsInput] = useState<string>('');
  const [newSnippetIncludeInput, setNewSnippetIncludeInput] = useState<boolean>(true);
  const [snippetToDelete, setSnippetToDelete] = useState<UserSnippet | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportScope, setExportScope] = useState<'all' | 'filtered'>('all');
  const [exportIncludeInputBuffers, setExportIncludeInputBuffers] = useState<boolean>(true);
  const [isExportCopied, setIsExportCopied] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const runPromptTextareaRef = useRef<HTMLTextAreaElement>(null);
  const replInputRef = useRef<HTMLInputElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const stopRequestedRef = useRef<boolean>(false);

  const [activeLineNumber, setActiveLineNumber] = useState<number>(1);
  const [activeColNumber, setActiveColNumber] = useState<number>(1);

  // Memoized syntax-highlighted HTML using Prism.js Python grammar
  const highlightedCode = useMemo(() => {
    try {
      const grammar = Prism.languages.python;
      if (grammar) {
        return Prism.highlight(code, grammar, 'python');
      }
    } catch {
      // Fallback
    }
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }, [code]);

  // Track cursor position (Line & Column)
  const updateCursorPosition = (target?: HTMLTextAreaElement | null) => {
    const el = target || codeEditorRef.current;
    if (!el) return;
    const pos = el.selectionStart || 0;
    const beforeCursor = code.slice(0, pos);
    const lines = beforeCursor.split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;
    setActiveLineNumber(lineNum);
    setActiveColNumber(colNum);
  };

  // Synchronize scroll between textarea, syntax overlay pre, and gutter
  const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = target.scrollTop;
      preRef.current.scrollLeft = target.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = target.scrollTop;
    }
  };

  // Jump to clicked line in line-numbers gutter
  const handleGutterLineClick = (lineIndex: number) => {
    if (!codeEditorRef.current) return;
    const lines = code.split('\n');
    let charPos = 0;
    for (let i = 0; i < lineIndex; i++) {
      charPos += lines[i].length + 1;
    }
    codeEditorRef.current.focus();
    codeEditorRef.current.setSelectionRange(charPos, charPos);
    setActiveLineNumber(lineIndex + 1);
    setActiveColNumber(1);
  };

  // Sync snippets to localStorage whenever userSnippets changes
  useEffect(() => {
    try {
      localStorage.setItem('apexos_python_snippets', JSON.stringify(userSnippets));
    } catch {
      // ignore quota errors
    }
  }, [userSnippets]);

  // Auto scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  // Load a template
  const handleSelectTemplate = (templateKey: string) => {
    setActiveTemplate(templateKey);
    const tmpl = templates[templateKey];
    if (tmpl) {
      setCode(tmpl.code);
      setRunPrompt(tmpl.defaultInput);
      setTerminalLines((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          type: 'system',
          text: `[LOADED TEMPLATE] ${tmpl.title}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  // Clipboard Paste into Run Prompt handler
  const handlePasteIntoRunPrompt = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setRunPrompt((prev) => (prev ? `${prev}\n${text}` : text));
          setPastedNotice(`✓ Pasted ${text.length} characters into Run Prompt!`);
          setTimeout(() => setPastedNotice(null), 3000);
          runPromptTextareaRef.current?.focus();
          return;
        }
      }
    } catch {
      // Permission blocked or iframe restriction fallback
    }

    // Fallback: focus the textarea so user can Ctrl+V immediately
    runPromptTextareaRef.current?.focus();
    setPastedNotice('Please press Ctrl+V / Cmd+V to paste into Run Prompt');
    setTimeout(() => setPastedNotice(null), 3000);
  };

  // Paste into REPL Prompt
  const handlePasteIntoRepl = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setReplInput((prev) => `${prev}${text}`);
          setPastedNotice(`✓ Pasted into REPL prompt!`);
          setTimeout(() => setPastedNotice(null), 2500);
          replInputRef.current?.focus();
          return;
        }
      }
    } catch {
      // Fallback
    }
    replInputRef.current?.focus();
  };

  // Paste into the interactive input modal
  const handlePasteIntoModal = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setModalInputValue(text);
          return;
        }
      }
    } catch {
      // Fallback
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportPy = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTemplate}.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearTerminal = () => {
    setTerminalLines([]);
    setExitCode(null);
    setExecutionTime(null);
  };

  // ==============================================================
  // SNIPPET LIBRARY OPERATIONS
  // ==============================================================
  const handleLoadSnippet = (snippet: UserSnippet, mode: 'replace' | 'append' = 'replace') => {
    if (mode === 'replace') {
      setCode(snippet.code);
      if (snippet.defaultInput !== undefined) {
        setRunPrompt(snippet.defaultInput);
      }
      setTerminalLines((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          type: 'system',
          text: `[SNIPPET LOADED] Loaded "${snippet.title}" (${snippet.category}) into editor`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setPastedNotice(`✓ Loaded snippet: "${snippet.title}"`);
    } else {
      // Append mode
      setCode((prev) => `${prev.trimEnd()}\n\n# ==============================================================\n# Snippet: ${snippet.title}\n# ==============================================================\n${snippet.code}`);
      if (snippet.defaultInput) {
        setRunPrompt((prev) => (prev ? `${prev}\n${snippet.defaultInput}` : snippet.defaultInput!));
      }
      setPastedNotice(`✓ Appended "${snippet.title}" to editor`);
    }
    setTimeout(() => setPastedNotice(null), 3000);
  };

  const handleSaveNewSnippet = () => {
    if (!newSnippetTitle.trim()) {
      alert('Please enter a title for the code snippet.');
      return;
    }

    const parsedTags = newSnippetTagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(Boolean);

    const newSnippet: UserSnippet = {
      id: 'snip-' + Date.now(),
      title: newSnippetTitle.trim(),
      description: newSnippetDesc.trim() || 'User-defined Python code snippet',
      category: newSnippetCategory,
      tags: parsedTags.length > 0 ? parsedTags : [newSnippetCategory],
      code: code,
      defaultInput: newSnippetIncludeInput ? runPrompt : '',
      createdAt: new Date().toLocaleDateString('en-CA'),
      updatedAt: new Date().toLocaleDateString('en-CA'),
    };

    setUserSnippets((prev) => [newSnippet, ...prev]);
    setIsSaveModalOpen(false);
    setNewSnippetTitle('');
    setNewSnippetDesc('');
    setNewSnippetCategory('custom');
    setNewSnippetTagsInput('');
    setPastedNotice(`✓ Saved snippet "${newSnippet.title}" to library!`);
    setTimeout(() => setPastedNotice(null), 3500);

    setTerminalLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'system',
        text: `[SNIPPET SAVED] Saved "${newSnippet.title}" to local snippet library.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleDeleteSnippet = (snippetId: string) => {
    setUserSnippets((prev) => prev.filter((s) => s.id !== snippetId));
    setSnippetToDelete(null);
    setPastedNotice('✓ Snippet deleted from library');
    setTimeout(() => setPastedNotice(null), 2500);
  };

  const handleImportSnippetsJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const rawList = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.snippets)
          ? parsed.snippets
          : null;

        if (Array.isArray(rawList) && rawList.length > 0) {
          let withInputsCount = 0;
          setUserSnippets((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newItems: UserSnippet[] = [];
            for (const item of rawList) {
              if (item && item.title && item.code) {
                const uniqueId = existingIds.has(item.id)
                  ? `snip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
                  : (item.id || `snip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`);
                const defInput = item.defaultInput !== undefined ? String(item.defaultInput) : '';
                if (defInput.trim()) withInputsCount++;
                newItems.push({
                  id: uniqueId,
                  title: String(item.title),
                  description: String(item.description || ''),
                  category: ['system', 'hardware', 'math', 'utility', 'custom'].includes(item.category)
                    ? item.category
                    : 'custom',
                  tags: Array.isArray(item.tags)
                    ? item.tags.map(String)
                    : [item.category || 'custom'],
                  code: String(item.code),
                  defaultInput: defInput,
                  createdAt: item.createdAt || new Date().toLocaleDateString('en-CA'),
                  updatedAt: new Date().toLocaleDateString('en-CA'),
                });
              }
            }
            return [...newItems, ...prev];
          });
          setPastedNotice(`✓ Imported ${rawList.length} snippets (${withInputsCount} default input buffers restored)!`);
          setTimeout(() => setPastedNotice(null), 3500);

          setTerminalLines((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              type: 'system',
              text: `[SNIPPET IMPORT] Restored ${rawList.length} snippets from ${file.name} (${withInputsCount} with default input buffers).`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        } else {
          alert('Invalid snippets file format. Expected a JSON backup array or an object containing a "snippets" list.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleRestoreDefaults = () => {
    if (confirm('Restore default snippet collection? This will replace your snippets with the defaults.')) {
      setUserSnippets(DEFAULT_USER_SNIPPETS);
      setPastedNotice('✓ Restored default snippet library');
      setTimeout(() => setPastedNotice(null), 3000);
    }
  };

  // ==============================================================
  // REAL PYTHON EXECUTION RUNTIME (IN-BROWSER INTERPRETER ENGINE)
  // Supports:
  // - print(*args, sep=' ', end='\n')
  // - input(prompt) consuming sequentially from Run Prompt stdin or modal
  // - math module (sqrt, sin, cos, pi, floor, ceil, gcd, etc.)
  // - random module (random, randint, choice, shuffle)
  // - time module (time, sleep [real async delay!], ctime)
  // - sys module (version, platform, argv)
  // - os module (uname, getcwd, listdir)
  // - Loops, comprehensions, functions, recursion, variable assignments
  // ==============================================================
  const executePython = async (scriptSource: string, stdinBufferText: string) => {
    if (isRunning) return;

    setIsRunning(true);
    stopRequestedRef.current = false;
    const startTime = performance.now();

    const timestamp = new Date().toLocaleTimeString();
    setTerminalLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'system',
        text: `>>> Running Python 3.12 script...`,
        timestamp,
      },
    ]);

    // Split stdin text into an array of lines for sequential input() consumption
    const stdinQueue = stdinBufferText
      .split('\n')
      .map((l) => l.trimEnd())
      .filter((l, idx, arr) => (idx === arr.length - 1 && l === '' ? false : true));

    let stdinPointer = 0;

    const appendLog = (type: TerminalLine['type'], text: string) => {
      setTerminalLines((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          type,
          text,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    // Stdin input handler
    const runtimeInput = async (promptMsg: string = ''): Promise<string> => {
      if (promptMsg) {
        appendLog('stdout', promptMsg);
      }

      // Check if stdin buffer has available lines
      if (stdinPointer < stdinQueue.length) {
        const val = stdinQueue[stdinPointer++];
        appendLog('input', `[stdin: ${val}]`);
        return val;
      }

      // If stdin buffer is exhausted, request user input via interactive modal
      return new Promise<string>((resolve) => {
        setModalInputValue('');
        setInteractivePromptModal({
          promptText: promptMsg || 'Python input():',
          resolve: (val: string) => {
            appendLog('input', `> ${val}`);
            setInteractivePromptModal(null);
            resolve(val);
          },
        });
      });
    };

    // Simulated standard libraries
    const mathModule = {
      pi: Math.PI,
      e: Math.E,
      sqrt: Math.sqrt,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      floor: Math.floor,
      ceil: Math.ceil,
      log: Math.log,
      log10: Math.log10,
      pow: Math.pow,
      fabs: Math.abs,
      degrees: (r: number) => (r * 180) / Math.PI,
      radians: (d: number) => (d * Math.PI) / 180,
      gcd: (a: number, b: number): number => {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
          const t = b;
          b = a % b;
          a = t;
        }
        return a;
      },
    };

    const randomModule = {
      random: Math.random,
      randint: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
      choice: <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)],
      uniform: (a: number, b: number) => a + Math.random() * (b - a),
      shuffle: <T,>(arr: T[]) => {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      },
    };

    const timeModule = {
      time: () => performance.now() / 1000.0,
      sleep: async (secs: number) => {
        if (stopRequestedRef.current) throw new Error('KeyboardInterrupt: Execution halted by user');
        const ms = Math.max(10, Math.min(secs * 1000, 10000));
        await new Promise((resolve) => setTimeout(resolve, ms));
        if (stopRequestedRef.current) throw new Error('KeyboardInterrupt: Execution halted by user');
      },
      ctime: () => new Date().toUTCString(),
    };

    const sysModule = {
      version: '3.12.3 (main, Nov 2024, 09:12:44) [GCC 13.3.0]',
      platform: 'linux',
      argv: ['apexos_build.py', config.architecture, config.version],
      stdin: stdinQueue,
      stdout: {
        write: (s: string) => appendLog('stdout', s),
      },
      exit: (code = 0) => {
        throw new Error(`SystemExit: ${code}`);
      },
    };

    const osModule = {
      name: 'posix',
      uname: () => ({
        sysname: 'Linux',
        nodename: config.hostname,
        release: '6.11.0-xanmod-gaming',
        version: '#1 SMP PREEMPT_DYNAMIC',
        machine: config.architecture,
      }),
      getcwd: () => '/home/' + config.defaultUsername + '/build',
      listdir: () => [
        'BAT0',
        'apexos.iso',
        'debootstrap',
        'squashfs-root',
        'sources.list.d',
        'vmlinuz-6.11.0-xanmod',
        'initrd.img',
        'grub.cfg',
      ],
      path: {
        exists: () => true,
        join: (...args: string[]) => args.join('/'),
      },
    };

    const jsonModule = {
      dumps: (obj: unknown, indent?: number) => JSON.stringify(obj, null, indent),
      loads: (str: string) => JSON.parse(str),
    };

    // Execution scope
    try {
      // Build safe AST / JS bridge transpilation
      // We parse comments, def statements, print, f-strings, range, time.sleep, math, etc.
      const transformedJs = transpilePythonToJs(scriptSource);

      const runtimeContext = {
        print: (...args: unknown[]) => {
          const formatted = args
            .map((arg) => (typeof arg === 'object' && arg !== null ? JSON.stringify(arg) : String(arg)))
            .join(' ');
          appendLog('stdout', formatted);
        },
        input: runtimeInput,
        math: mathModule,
        random: randomModule,
        time: timeModule,
        sys: sysModule,
        os: osModule,
        json: jsonModule,
        len: (obj: unknown) => {
          if (Array.isArray(obj) || typeof obj === 'string') return obj.length;
          if (typeof obj === 'object' && obj !== null) return Object.keys(obj).length;
          return 0;
        },
        range: (start: number, stop?: number, step: number = 1): number[] => {
          if (stop === undefined) {
            stop = start;
            start = 0;
          }
          const res: number[] = [];
          if (step > 0) {
            for (let i = start; i < stop; i += step) res.push(i);
          } else if (step < 0) {
            for (let i = start; i > stop; i += step) res.push(i);
          }
          return res;
        },
        int: (v: unknown) => parseInt(String(v), 10) || 0,
        float: (v: unknown) => parseFloat(String(v)) || 0.0,
        str: (v: unknown) => String(v),
        bool: (v: unknown) => Boolean(v),
        sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0),
        min: (...args: number[]) => (Array.isArray(args[0]) ? Math.min(...args[0]) : Math.min(...args)),
        max: (...args: number[]) => (Array.isArray(args[0]) ? Math.max(...args[0]) : Math.max(...args)),
        abs: Math.abs,
        round: (n: number, d = 0) => Number(n.toFixed(d)),
        isinstance: (v: unknown, t: string) => typeof v === t,
        True: true,
        False: false,
        None: null,
      };

      // Wrap in async function
      const runner = new Function(
        ...Object.keys(runtimeContext),
        `return (async () => {
          ${transformedJs}
        })();`
      );

      await runner(...Object.values(runtimeContext));

      const duration = Math.round(performance.now() - startTime);
      setExecutionTime(duration);
      setExitCode(0);
      appendLog('system', `Process finished with exit code 0 (${duration}ms)`);
    } catch (err: unknown) {
      const duration = Math.round(performance.now() - startTime);
      setExecutionTime(duration);
      setExitCode(1);
      const errMsg = err instanceof Error ? err.message : String(err);
      appendLog('stderr', `Traceback (most recent call last):\n  File "<stdin>", line 1, in <module>\n${errMsg}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Quick single-line REPL command executor
  const handleRunRepl = async () => {
    if (!replInput.trim()) return;
    const cmd = replInput;
    setReplHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setReplInput('');

    setTerminalLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'input',
        text: `>>> ${cmd}`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    // If expression without print, wrap in print()
    let codeToRun = cmd;
    if (
      !cmd.trim().startsWith('print') &&
      !cmd.trim().startsWith('for') &&
      !cmd.trim().startsWith('if') &&
      !cmd.trim().startsWith('while') &&
      !cmd.trim().startsWith('def') &&
      !cmd.trim().startsWith('import') &&
      !cmd.includes('=')
    ) {
      codeToRun = `print(${cmd})`;
    }

    await executePython(codeToRun, runPrompt);
  };

  // Stop execution button
  const handleStopExecution = () => {
    stopRequestedRef.current = true;
    setIsRunning(false);
    setInteractivePromptModal(null);
    setTerminalLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'stderr',
        text: 'KeyboardInterrupt (SIGINT) received. Execution halted.',
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Keyboard shortcut Ctrl+Enter to run
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executePython(code, runPrompt);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
        updateCursorPosition(target);
      }, 0);
    }
  };

  const categoryCounts = {
    all: userSnippets.length,
    system: userSnippets.filter((s) => s.category === 'system').length,
    hardware: userSnippets.filter((s) => s.category === 'hardware').length,
    math: userSnippets.filter((s) => s.category === 'math').length,
    utility: userSnippets.filter((s) => s.category === 'utility').length,
    custom: userSnippets.filter((s) => s.category === 'custom').length,
  };

  const availableTags = Array.from(
    new Set(userSnippets.flatMap((s) => s.tags || []).filter(Boolean))
  ).slice(0, 12);

  const filteredSnippets = userSnippets
    .filter((snip) => {
      // 1. Category filter
      const matchesCategory =
        selectedSnippetCategory === 'all' || snip.category === selectedSnippetCategory;

      // 2. Specific tag filter
      const matchesTag =
        !selectedSnippetTag ||
        (snip.tags && snip.tags.some((t) => t.toLowerCase() === selectedSnippetTag.toLowerCase()));

      // 3. Search query filter (matches title, description, code, category, tags)
      const q = snippetSearchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        snip.title.toLowerCase().includes(q) ||
        snip.description.toLowerCase().includes(q) ||
        snip.code.toLowerCase().includes(q) ||
        snip.category.toLowerCase().includes(q) ||
        (snip.tags && snip.tags.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesTag && matchesQuery;
    })
    .sort((a, b) => {
      if (snippetSortBy === 'title') return a.title.localeCompare(b.title);
      if (snippetSortBy === 'lines') return b.code.split('\n').length - a.code.split('\n').length;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Helper to construct structured, portable backup payload including defaultInput buffers
  const generateExportData = (scope: 'all' | 'filtered', includeInputBuffers: boolean) => {
    const listToExport = scope === 'filtered' ? filteredSnippets : userSnippets;
    return {
      version: '1.0',
      format: 'apexos-python-snippets-backup',
      exportedAt: new Date().toISOString(),
      generator: 'ApexOS Python 3.12 IDE',
      scope: scope,
      totalSnippets: listToExport.length,
      includeDefaultInputs: includeInputBuffers,
      snippets: listToExport.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description || '',
        category: s.category,
        tags: Array.isArray(s.tags) ? s.tags : [s.category],
        code: s.code,
        defaultInput: includeInputBuffers ? (s.defaultInput ?? '') : '',
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    };
  };

  const handleExportSnippetsJson = (
    scope: 'all' | 'filtered' = exportScope,
    includeInputs: boolean = exportIncludeInputBuffers
  ) => {
    const listToExport = scope === 'filtered' ? filteredSnippets : userSnippets;
    if (listToExport.length === 0) {
      alert('No snippets available to export.');
      return;
    }

    const payload = generateExportData(scope, includeInputs);
    const dataStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    const scopeTag = scope === 'filtered' && (selectedSnippetCategory !== 'all' || selectedSnippetTag || snippetSearchQuery) ? '_filtered' : '';
    a.download = `apexos_python_snippets_backup_${dateStr}${scopeTag}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const inputsCount = listToExport.filter((s) => Boolean(s.defaultInput && s.defaultInput.trim())).length;
    const msg = `✓ Exported ${listToExport.length} snippets (${inputsCount} default input buffers) to JSON!`;
    setPastedNotice(msg);
    setTimeout(() => setPastedNotice(null), 3500);

    setTerminalLines((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'system',
        text: `[SNIPPET BACKUP] Exported ${listToExport.length} snippets to ${a.download} (${inputsCount} with default input buffers).`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setIsExportModalOpen(false);
  };

  const handleCopyExportJson = () => {
    const payload = generateExportData(exportScope, exportIncludeInputBuffers);
    const jsonStr = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setIsExportCopied(true);
    setPastedNotice(`✓ Copied ${payload.totalSnippets} snippets backup JSON to clipboard!`);
    setTimeout(() => {
      setIsExportCopied(false);
      setPastedNotice(null);
    }, 2500);
  };

  // Formatted JSON preview for the Export Snippets backup dialog
  const exportPreviewJson = useMemo(() => {
    if (!isExportModalOpen) return '';
    try {
      const payload = generateExportData(exportScope, exportIncludeInputBuffers);
      return JSON.stringify(payload, null, 2);
    } catch {
      return '';
    }
  }, [isExportModalOpen, exportScope, exportIncludeInputBuffers, userSnippets, filteredSnippets]);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Main Toolbar */}
      <div className="h-12 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-sky-500 to-amber-500 flex items-center justify-center shadow-md">
            <Code2 className="w-4 h-4 text-white font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs tracking-wide text-white">Python 3.12 Compiler Pro</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono">
                Interactive IDE
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              x86_64-linux-gnu • GCC 13.3.0 • CPython Engine
            </div>
          </div>
        </div>

        {/* Center: Template Picker & Snippet Library Toggle */}
        <div className="flex items-center gap-2">
          {/* Snippet Library Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title="Toggle Code Snippet Library Sidebar"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isSidebarOpen
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Library ({userSnippets.length})</span>
          </button>

          {/* Quick Save Current Code to Snippet Library */}
          <button
            onClick={() => {
              setNewSnippetTitle(activeTemplate ? `${activeTemplate}_snippet` : 'custom_script');
              setIsSaveModalOpen(true);
            }}
            title="Save current editor code to your snippet library"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition shadow-sm"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save Snippet</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Template:</span>
            <div className="relative">
              <select
                value={activeTemplate}
                onChange={(e) => handleSelectTemplate(e.target.value)}
                className="bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              >
                {Object.entries(templates).map(([key, tmpl]) => (
                  <option key={key} value={key}>
                    {tmpl.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right: Primary Run Controls & Paste Action */}
        <div className="flex items-center gap-2">
          {/* Quick Paste into Run Prompt Action Button */}
          <button
            onClick={handlePasteIntoRunPrompt}
            title="Paste clipboard directly into the Run Prompt stdin feed"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 hover:border-indigo-400 transition shadow-sm"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Paste into Run Prompt</span>
            <span className="sm:hidden">Paste</span>
          </button>

          {/* Stop Button (if running) */}
          {isRunning ? (
            <button
              onClick={handleStopExecution}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm animate-pulse"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={() => executePython(code, runPrompt)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run (Ctrl+Enter)</span>
            </button>
          )}

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            title="Copy Python Code"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Export .py */}
          <button
            onClick={handleExportPy}
            title="Export .py script"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Notification Toast for Paste Feedback */}
      {pastedNotice && (
        <div className="bg-emerald-500/90 text-slate-950 px-4 py-1 text-xs font-semibold flex items-center justify-between transition animate-in fade-in slide-in-from-top-1 duration-150">
          <span>{pastedNotice}</span>
          <button onClick={() => setPastedNotice(null)} className="font-bold hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Main Split Body: Sidebar, Left Editor, Right Terminal & Run Prompt */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* SNIPPET LIBRARY SIDEBAR */}
        {isSidebarOpen && (
          <div className="w-full md:w-80 lg:w-84 border-r border-slate-800 bg-slate-900/95 flex flex-col shrink-0 overflow-hidden select-none z-20 shadow-xl">
            {/* Sidebar Header */}
            <div className="h-10 px-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FolderCode className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs text-white">Snippet Library</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {userSnippets.length}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  title="Export snippet library to JSON backup (including default input buffers)"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
                >
                  <FileDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setNewSnippetTitle('');
                    setIsSaveModalOpen(true);
                  }}
                  title="Save current code as a new snippet"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  title="Collapse Library Sidebar"
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions: Save Code & Backup/Restore */}
            <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/60 space-y-2 shrink-0">
              <button
                onClick={() => {
                  setNewSnippetTitle('');
                  setIsSaveModalOpen(true);
                }}
                className="w-full py-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition active:scale-98"
              >
                <Save className="w-3.5 h-3.5" />
                <span>+ Save Current Editor Code</span>
              </button>

              {/* Quick Export/Import Action Bar */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  title="Export all snippets and default input buffers as a JSON backup"
                  className="py-1 px-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 text-[11px] font-medium transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <FileDown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export JSON</span>
                </button>
                <label
                  title="Import snippets JSON backup file"
                  className="py-1 px-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 text-[11px] font-medium transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Import JSON</span>
                  <input
                    ref={importFileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportSnippetsJson}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Enhanced Search Filter Bar with Live Results Badge */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={snippetSearchQuery}
                    onChange={(e) => setSnippetSearchQuery(e.target.value)}
                    placeholder="Search snippets, code, tags..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-16 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                      {filteredSnippets.length}/{userSnippets.length}
                    </span>
                    {(snippetSearchQuery || selectedSnippetTag) && (
                      <button
                        onClick={() => {
                          setSnippetSearchQuery('');
                          setSelectedSnippetTag(null);
                        }}
                        title="Clear search and tag filter"
                        className="text-slate-400 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filtering Tags Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Category Filter:</span>
                    <span className="text-slate-500">{filteredSnippets.length} matching</span>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] [scrollbar-width:none]">
                    {[
                      { id: 'all', label: 'All', count: categoryCounts.all },
                      { id: 'system', label: 'System', count: categoryCounts.system },
                      { id: 'hardware', label: 'Hardware', count: categoryCounts.hardware },
                      { id: 'math', label: 'Math', count: categoryCounts.math },
                      { id: 'utility', label: 'Utility', count: categoryCounts.utility },
                      { id: 'custom', label: 'Custom', count: categoryCounts.custom },
                    ].map((cat) => {
                      const isSelected = selectedSnippetCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedSnippetCategory(cat.id);
                            setSelectedSnippetTag(null);
                          }}
                          className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition flex items-center gap-1 border ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                              : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-slate-800/80'
                          }`}
                        >
                          <Tag className="w-2.5 h-2.5 opacity-70" />
                          <span>{cat.label}</span>
                          <span
                            className={`px-1 py-0.1 rounded-full text-[9px] font-mono ${
                              isSelected ? 'bg-amber-400/30 text-amber-200' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Popular Keyword / Tag Filter Chips */}
                {availableTags.length > 0 && (
                  <div className="pt-1 border-t border-slate-800/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Tag Filter:</span>
                      {selectedSnippetTag && (
                        <button
                          onClick={() => setSelectedSnippetTag(null)}
                          className="text-amber-400 hover:underline flex items-center gap-0.5 text-[9px]"
                        >
                          <span>Clear #{selectedSnippetTag}</span>
                          <span>✕</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[9px] font-mono [scrollbar-width:none]">
                      {availableTags.map((tag) => {
                        const isTagActive = selectedSnippetTag === tag;
                        return (
                          <button
                            key={tag}
                            onClick={() => setSelectedSnippetTag(isTagActive ? null : tag)}
                            className={`px-1.5 py-0.5 rounded transition whitespace-nowrap border ${
                              isTagActive
                                ? 'bg-indigo-600 text-white border-indigo-400 font-semibold'
                                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-slate-800'
                            }`}
                          >
                            #{tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sort Bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span className="font-mono text-[10px] text-slate-500">
                    {filteredSnippets.length} snippets shown
                  </span>
                  <div className="flex items-center gap-1">
                    <span>Sort:</span>
                    <select
                      value={snippetSortBy}
                      onChange={(e) => setSnippetSortBy(e.target.value as 'recent' | 'title' | 'lines')}
                      className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono cursor-pointer"
                    >
                      <option value="recent">Newest</option>
                      <option value="title">Title (A-Z)</option>
                      <option value="lines">Lines of Code</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Snippet Cards List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 [scrollbar-width:thin]">
              {filteredSnippets.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-700 mx-auto" />
                  <p>
                    No snippets found matching{' '}
                    {snippetSearchQuery && <span className="text-amber-400">"{snippetSearchQuery}"</span>}
                    {selectedSnippetTag && <span className="text-indigo-400"> #{selectedSnippetTag}</span>}
                  </p>
                  <button
                    onClick={() => {
                      setSnippetSearchQuery('');
                      setSelectedSnippetCategory('all');
                      setSelectedSnippetTag(null);
                    }}
                    className="text-amber-400 text-[11px] underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredSnippets.map((snip) => {
                  const categoryColors: Record<string, string> = {
                    system: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
                    hardware: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    math: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                    utility: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    custom: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
                  };

                  return (
                    <div
                      key={snip.id}
                      className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition shadow-sm space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider border ${
                                categoryColors[snip.category] || categoryColors.custom
                              }`}
                            >
                              {snip.category}
                            </span>
                            <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-amber-300 transition">
                              {snip.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                            {snip.description}
                          </p>
                        </div>
                      </div>

                      {/* Snippet Clickable Tag Pills */}
                      {snip.tags && snip.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                          {snip.tags.map((t) => (
                            <button
                              key={t}
                              onClick={() => setSelectedSnippetTag(selectedSnippetTag === t ? null : t)}
                              title={`Filter by tag #${t}`}
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono transition ${
                                selectedSnippetTag === t
                                  ? 'bg-indigo-600 text-white font-semibold'
                                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                              }`}
                            >
                              #{t}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Monospace Code Preview (first 2-3 lines) */}
                      <div className="bg-slate-900/90 rounded border border-slate-800/60 p-1.5 text-[10px] font-mono text-emerald-400/90 overflow-hidden line-clamp-2 whitespace-pre leading-tight">
                        {snip.code
                          .split('\n')
                          .filter((l) => l.trim() && !l.trim().startsWith('#'))
                          .slice(0, 2)
                          .join('\n') || snip.code.slice(0, 80)}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                        <span>
                          {snip.code.split('\n').length} lines • {snip.createdAt}
                        </span>
                        {snip.defaultInput && (
                          <span className="text-amber-400 font-semibold" title="Includes default stdin feed">
                            +stdin
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/60">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleLoadSnippet(snip, 'replace')}
                            title="Load snippet into editor (replaces current code)"
                            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-white border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1 transition"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Load</span>
                          </button>
                          <button
                            onClick={() => handleLoadSnippet(snip, 'append')}
                            title="Append snippet at end of current code"
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium flex items-center gap-1 transition"
                          >
                            <Plus className="w-2.5 h-2.5" />
                            <span>Append</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(snip.code);
                              setPastedNotice(`✓ Copied "${snip.title}" to clipboard!`);
                              setTimeout(() => setPastedNotice(null), 2500);
                            }}
                            title="Copy code to clipboard"
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setSnippetToDelete(snip)}
                            title="Delete snippet"
                            className="p-1 rounded hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Footer: Import/Export & Defaults */}
            <div className="p-2 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  title="Export snippets to JSON backup (including default input buffers)"
                  className="hover:text-amber-400 flex items-center gap-1 transition"
                >
                  <FileDown className="w-3 h-3 text-amber-400" />
                  <span>Export JSON</span>
                </button>
                <span>•</span>
                <label className="hover:text-slate-200 flex items-center gap-1 cursor-pointer transition">
                  <Upload className="w-3 h-3" />
                  <span>Import</span>
                  <input
                    ref={importFileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportSnippetsJson}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                onClick={handleRestoreDefaults}
                title="Reset to default snippets"
                className="text-slate-500 hover:text-amber-400 text-[10px]"
              >
                Defaults
              </button>
            </div>
          </div>
        )}

        {/* LEFT PANE: PYTHON CODE EDITOR */}
        <div className="flex-1 flex flex-col border-r border-slate-800/80 bg-slate-950/60 min-w-0">
          {/* Editor Header Bar */}
          <div className="h-8 px-3 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2 font-mono">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  title="Open Snippet Library Sidebar"
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-medium transition mr-1"
                >
                  <PanelLeftOpen className="w-3.5 h-3.5" />
                  <span>Snippets ({userSnippets.length})</span>
                </button>
              )}
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-200 font-semibold">{activeTemplate}.py</span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] text-slate-400">
                {code.split('\n').length} lines • {code.length} chars
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                Tab: 4 spaces • UTF-8
              </span>
              <button
                onClick={() => setCode(templates[activeTemplate].code)}
                title="Reset code to original template"
                className="hover:text-amber-400 flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Synchronized Syntax Highlighting Editor with Gutter */}
          <div className="flex-1 flex overflow-hidden font-mono text-xs relative bg-[#090e1a]">
            {/* Line numbers gutter with active line tracking & click-to-jump */}
            <div
              ref={gutterRef}
              onWheel={(e) => {
                if (codeEditorRef.current) {
                  codeEditorRef.current.scrollTop += e.deltaY;
                }
              }}
              className="w-12 py-3 bg-slate-900/60 text-right select-none border-r border-slate-800/80 shrink-0 overflow-hidden text-[11px] leading-5 font-mono"
            >
              {code.split('\n').map((_, i) => {
                const lineNum = i + 1;
                const isActive = lineNum === activeLineNumber;
                return (
                  <div
                    key={i}
                    onClick={() => handleGutterLineClick(i)}
                    className={`pr-2.5 cursor-pointer transition-colors duration-75 flex items-center justify-end ${
                      isActive
                        ? 'text-amber-400 font-bold bg-amber-400/15 border-r-2 border-amber-400'
                        : 'text-slate-600 hover:text-slate-400 hover:bg-slate-800/30'
                    }`}
                    title={`Line ${lineNum} (Click to jump)`}
                  >
                    {lineNum}
                  </div>
                );
              })}
            </div>

            {/* Code Editor Viewport (Prism Highlighting Layer + Transparent Interactive Textarea Overlay) */}
            <div className="relative flex-1 h-full overflow-hidden">
              {/* Prism Syntax Highlight Layer */}
              <pre
                ref={preRef}
                aria-hidden="true"
                className="prism-editor-code absolute inset-0 m-0 p-3 bg-transparent text-slate-200 font-mono text-xs leading-5 whitespace-pre break-normal overflow-hidden pointer-events-none select-none z-0"
                style={{ tabSize: 4 }}
              >
                <code
                  className="language-python prism-editor-code"
                  dangerouslySetInnerHTML={{
                    __html: code.endsWith('\n') ? highlightedCode + '\n' : highlightedCode,
                  }}
                />
              </pre>

              {/* Direct Input Textarea Layer */}
              <textarea
                ref={codeEditorRef}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  updateCursorPosition(e.target);
                }}
                onSelect={(e) => updateCursorPosition(e.currentTarget)}
                onKeyUp={(e) => updateCursorPosition(e.currentTarget)}
                onClick={(e) => updateCursorPosition(e.currentTarget)}
                onKeyDown={handleEditorKeyDown}
                onScroll={handleEditorScroll}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="prism-editor-code absolute inset-0 m-0 p-3 bg-transparent text-transparent caret-amber-400 selection:bg-amber-400/25 selection:text-transparent font-mono text-xs leading-5 resize-none outline-none overflow-auto z-10 whitespace-pre break-normal"
                style={{ tabSize: 4 }}
                placeholder="# Write or paste Python 3 code here..."
              />
            </div>
          </div>

          {/* Editor Footer Status */}
          <div className="h-6 px-3 bg-slate-900/90 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Python 3.12 (Active)
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">
                Ln <span className="text-amber-300 font-semibold">{activeLineNumber}</span>, Col <span className="text-amber-300 font-semibold">{activeColNumber}</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 text-[9px] font-semibold tracking-wide">
                PRISM.JS HIGHLIGHTED
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>{code.split('\n').length} lines • {code.length} chars</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="hidden sm:inline">[Ctrl+Enter] Run • [Tab] 4-sp</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: OUTPUT TERMINAL & RUN PROMPT / STDIN FEED */}
        <div className="flex-1 flex flex-col bg-slate-950 min-w-0">
          {/* Terminal Tabs & Status Bar */}
          <div className="h-8 px-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-300 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium transition ${
                  activeTab === 'editor'
                    ? 'bg-slate-800 text-amber-400 border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>Console Output</span>
              </button>

              <button
                onClick={() => setActiveTab('repl')}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium transition ${
                  activeTab === 'repl'
                    ? 'bg-slate-800 text-amber-400 border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Interactive REPL (&gt;&gt;&gt;)</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              {executionTime !== null && (
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {executionTime}ms
                </span>
              )}
              {exitCode !== null && (
                <span
                  className={`px-1.5 py-0.2 rounded font-semibold ${
                    exitCode === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  Exit: {exitCode}
                </span>
              )}
              <button
                onClick={clearTerminal}
                className="text-slate-400 hover:text-slate-200 transition text-[11px]"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Terminal Output Logs Viewport */}
          <div className="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1 bg-slate-950 selection:bg-amber-500/30">
            {terminalLines.map((line) => {
              let colorClass = 'text-slate-300';
              if (line.type === 'stderr') colorClass = 'text-rose-400';
              else if (line.type === 'system') colorClass = 'text-cyan-400 font-semibold';
              else if (line.type === 'info') colorClass = 'text-slate-500';
              else if (line.type === 'input') colorClass = 'text-amber-300 font-semibold';

              return (
                <div key={line.id} className={`leading-relaxed whitespace-pre-wrap break-all ${colorClass}`}>
                  {line.text}
                </div>
              );
            })}

            {/* In-progress run indicator */}
            {isRunning && (
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs py-1">
                <span className="animate-spin">⠋</span>
                <span>Executing Python script (PID {Math.floor(Math.random() * 8000 + 1000)})...</span>
              </div>
            )}

            <div ref={terminalEndRef} />
          </div>

          {/* DEDICATED "RUN PROMPT" & STDIN INPUT PANEL (CORE USER FEATURE) */}
          <div className="border-t border-slate-800 bg-slate-900/90 p-2.5 space-y-2 shrink-0">
            {activeTab === 'editor' ? (
              // STDIN / RUN PROMPT BUFFER PANEL
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Run Prompt (Standard Input / stdin Stream)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* The User-Requested PASTE INTO RUN PROMPT BUTTON */}
                    <button
                      type="button"
                      onClick={handlePasteIntoRunPrompt}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition shadow"
                      title="Paste clipboard contents directly into this Run Prompt"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      <span>Paste Into Run Prompt</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRunPrompt('')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    ref={runPromptTextareaRef}
                    value={runPrompt}
                    onChange={(e) => setRunPrompt(e.target.value)}
                    rows={2}
                    placeholder="Enter or paste stdin inputs here (one per line). These are sequentially fed into input() calls when you click Run..."
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2 font-mono text-xs text-amber-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/80 resize-none selection:bg-indigo-500/30"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>
                    Lines in Run Prompt buffer:{' '}
                    <strong className="text-amber-400">
                      {runPrompt.split('\n').filter((x) => x.trim()).length}
                    </strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Quick Feeds:</span>
                    <button
                      onClick={() => setRunPrompt('ApexOS-Pro\namd64\nyes')}
                      className="hover:text-amber-400 underline"
                    >
                      ISO args
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setRunPrompt('2560\n1440\n165')}
                      className="hover:text-amber-400 underline"
                    >
                      Display EDID
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => setRunPrompt('1000\n30')}
                      className="hover:text-amber-400 underline"
                    >
                      Primes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // INTERACTIVE REPL INPUT BAR (>>> )
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <span className="text-amber-400 font-mono font-bold">&gt;&gt;&gt;</span>
                    <span>Interactive Python Command Prompt</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePasteIntoRepl}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition"
                      title="Paste snippet into REPL Prompt"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      <span>Paste Snippet</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 font-mono text-xs focus-within:ring-1 focus-within:ring-amber-500">
                    <span className="text-amber-400 font-bold mr-2 select-none">&gt;&gt;&gt;</span>
                    <input
                      ref={replInputRef}
                      type="text"
                      value={replInput}
                      onChange={(e) => setReplInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRunRepl();
                        } else if (e.key === 'ArrowUp') {
                          if (replHistory.length > 0) {
                            const newIdx = historyIndex + 1;
                            if (newIdx < replHistory.length) {
                              setHistoryIndex(newIdx);
                              setReplInput(replHistory[replHistory.length - 1 - newIdx]);
                            }
                          }
                        } else if (e.key === 'ArrowDown') {
                          if (historyIndex > 0) {
                            const newIdx = historyIndex - 1;
                            setHistoryIndex(newIdx);
                            setReplInput(replHistory[replHistory.length - 1 - newIdx]);
                          } else if (historyIndex === 0) {
                            setHistoryIndex(-1);
                            setReplInput('');
                          }
                        }
                      }}
                      placeholder="e.g. print([x**2 for x in range(10)]) or math.sqrt(65536)..."
                      className="flex-1 bg-transparent text-slate-100 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleRunRepl}
                    disabled={!replInput.trim()}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 rounded-lg font-bold text-xs flex items-center gap-1 transition"
                  >
                    <span>Run</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Modal when script calls input() and Run Prompt buffer is empty */}
      {interactivePromptModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-xl p-4 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 font-semibold text-sm text-white">
                <TerminalIcon className="w-4 h-4 text-amber-400" />
                <span>Python input() Request</span>
              </div>
              <button
                onClick={() => {
                  interactivePromptModal.resolve('');
                  setInteractivePromptModal(null);
                }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Cancel
              </button>
            </div>

            <p className="text-xs text-slate-300 font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              {interactivePromptModal.promptText}
            </p>

            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={modalInputValue}
                onChange={(e) => setModalInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    interactivePromptModal.resolve(modalInputValue);
                    setInteractivePromptModal(null);
                  }
                }}
                placeholder="Type or paste input here..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <button
                type="button"
                onClick={handlePasteIntoModal}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                title="Paste clipboard into this input"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  interactivePromptModal.resolve('');
                  setInteractivePromptModal(null);
                }}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
              >
                Skip (Empty)
              </button>
              <button
                onClick={() => {
                  interactivePromptModal.resolve(modalInputValue);
                  setInteractivePromptModal(null);
                }}
                className="px-4 py-1 rounded bg-amber-500 hover:bg-amber-400 text-xs text-slate-950 font-bold transition shadow"
              >
                Submit to Python
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Snippet to Library Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Save Code Snippet to Library</h3>
              </div>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Snippet Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newSnippetTitle}
                  onChange={(e) => setNewSnippetTitle(e.target.value)}
                  placeholder="e.g. Sysfs Sensor Monitor, Prime Sieve, ISO Packager..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newSnippetCategory}
                    onChange={(e) => setNewSnippetCategory(e.target.value as UserSnippet['category'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 capitalize focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="system">System (Linux / OS)</option>
                    <option value="hardware">Hardware (CPU / BAT0)</option>
                    <option value="utility">Utility / Stream</option>
                    <option value="math">Math & Algorithms</option>
                    <option value="custom">Custom / Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Created Date</label>
                  <input
                    type="text"
                    disabled
                    value={new Date().toLocaleDateString('en-CA')}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newSnippetDesc}
                  onChange={(e) => setNewSnippetDesc(e.target.value)}
                  placeholder="Brief summary of what this code does or arguments it expects..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (Optional, comma-separated)
                </label>
                <input
                  type="text"
                  value={newSnippetTagsInput}
                  onChange={(e) => setNewSnippetTagsInput(e.target.value)}
                  placeholder="e.g. acpi, sysfs, linux, grub, benchmark, api"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Include Run Prompt option */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="includeRunPrompt"
                  type="checkbox"
                  checked={newSnippetIncludeInput}
                  onChange={(e) => setNewSnippetIncludeInput(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="includeRunPrompt" className="text-xs text-slate-300 cursor-pointer">
                  Save current <strong>Run Prompt stdin buffer</strong> with this snippet ({runPrompt.split('\n').filter(Boolean).length} lines)
                </label>
              </div>

              {/* Code Preview */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Code Preview ({code.split('\n').length} lines):
                </label>
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-2.5 max-h-28 overflow-y-auto text-[10px] font-mono text-emerald-400/90 whitespace-pre leading-relaxed select-text">
                  {code.slice(0, 400)}
                  {code.length > 400 && '...'}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsSaveModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewSnippet}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs text-slate-950 font-bold transition shadow flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Library</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {snippetToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
              <Trash2 className="w-4 h-4" />
              <span>Delete Snippet</span>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete snippet{' '}
              <strong className="text-white">"{snippetToDelete.title}"</strong> from your library?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSnippetToDelete(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSnippet(snippetToDelete.id)}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold transition shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Snippets to JSON Backup Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileDown className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Export Snippet Library (JSON Backup)</h3>
                  <p className="text-[11px] text-slate-400">
                    Portable JSON archive with complete source code &amp; default stdin input buffers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* Scope & Options */}
            <div className="space-y-3">
              {/* Export Scope Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Export Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExportScope('all')}
                    className={`p-2.5 rounded-lg border text-left transition flex items-start gap-2.5 ${
                      exportScope === 'all'
                        ? 'bg-amber-500/10 border-amber-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                        exportScope === 'all' ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}
                    >
                      {exportScope === 'all' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-200">All Saved Snippets</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {userSnippets.length} snippets ({userSnippets.filter((s) => Boolean(s.defaultInput?.trim())).length} with input buffers)
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope('filtered')}
                    className={`p-2.5 rounded-lg border text-left transition flex items-start gap-2.5 ${
                      exportScope === 'filtered'
                        ? 'bg-amber-500/10 border-amber-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                        exportScope === 'filtered' ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                      }`}
                    >
                      {exportScope === 'filtered' && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-200">Current Filtered View</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {filteredSnippets.length} matches ({selectedSnippetCategory !== 'all' ? `Cat: ${selectedSnippetCategory}` : 'All categories'})
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Include default input buffers toggle */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exportIncludeInputBuffers}
                    onChange={(e) => setExportIncludeInputBuffers(e.target.checked)}
                    className="mt-0.5 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-slate-200">
                      Include default stdin input buffers (<code className="text-amber-400 font-mono text-[11px]">defaultInput</code>)
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                      Preserves associated stdin feeds, parameter inputs, and test data for each snippet so they can be seamlessly re-executed in any ApexOS terminal or Python environment.
                    </p>
                  </div>
                </label>
              </div>

              {/* Live JSON Backup Preview */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-medium">JSON Backup Preview:</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {(exportPreviewJson.length / 1024).toFixed(1)} KB • {exportPreviewJson.split('\n').length} lines
                  </span>
                </div>
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 max-h-40 overflow-y-auto text-[10px] font-mono text-emerald-300 whitespace-pre leading-relaxed select-text [scrollbar-width:thin]">
                  {exportPreviewJson}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                Format: apexos-python-snippets-backup v1.0
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCopyExportJson}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 font-semibold transition flex items-center gap-1.5"
                >
                  {isExportCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleExportSnippetsJson(exportScope, exportIncludeInputBuffers)}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download Backup JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==============================================================
// PYTHON TO JS AST TRANSPILER & RUNTIME BRIDGE
// Handles Python syntax:
// - Comments (# ...)
// - def func(args): -> async function func(args) { ... }
// - if/elif/else: with indentation block scoping
// - for x in range(...): -> for (const x of range(...)) { ... }
// - for item in list: -> for (const item of list) { ... }
// - while cond: -> while (cond) { ... }
// - f-strings f"Value: {val}" -> `Value: ${val}`
// - print(...) -> await print(...)
// - input(...) -> await input(...)
// - time.sleep(...) -> await time.sleep(...)
// - True, False, None -> true, false, null
// - and, or, not, in -> &&, ||, !, includes
// ==============================================================
function transpilePythonToJs(pyCode: string): string {
  const lines = pyCode.split('\n');
  const jsLines: string[] = [];
  const indentStack: number[] = [0];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const rawLine = lines[lineIndex];

    // Preserve empty lines
    if (!rawLine.trim()) {
      jsLines.push('');
      continue;
    }

    // Skip pure comment lines
    if (rawLine.trim().startsWith('#')) {
      jsLines.push(`// ${rawLine.trim().substring(1)}`);
      continue;
    }

    // Measure indentation
    const indentMatch = rawLine.match(/^(\s*)/);
    const indentLevel = indentMatch ? indentMatch[1].length : 0;
    let trimmed = rawLine.trim();

    // Remove inline comment if any
    const hashIdx = trimmed.indexOf('#');
    if (hashIdx > 0 && !trimmed.slice(0, hashIdx).includes('"') && !trimmed.slice(0, hashIdx).includes("'")) {
      trimmed = trimmed.substring(0, hashIdx).trim();
    }

    // Handle dedenting
    while (indentStack.length > 1 && indentLevel < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    const currentIndent = ' '.repeat(indentLevel);

    // Transform Python boolean & None constants
    let transformed = trimmed
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null');

    // Transform f-strings: f"..." -> `...` with ${...}
    transformed = transformed.replace(/f"([^"]*)"/g, (_, content) => {
      const template = content.replace(/\{([^}]+)\}/g, (_: string, expr: string) => {
        // Handle format specifiers like :.2f
        if (expr.includes(':')) {
          const [varName, spec] = expr.split(':');
          if (spec.endsWith('f')) {
            const digits = parseInt(spec.replace(/[^0-9]/g, ''), 10) || 2;
            return `\${Number(${varName}).toFixed(${digits})}`;
          }
          return `\${${varName}}`;
        }
        return `\${${expr}}`;
      });
      return `\`${template}\``;
    });

    transformed = transformed.replace(/f'([^']*)'/g, (_, content) => {
      const template = content.replace(/\{([^}]+)\}/g, (_: string, expr: string) => {
        if (expr.includes(':')) {
          const [varName, spec] = expr.split(':');
          if (spec.endsWith('f')) {
            const digits = parseInt(spec.replace(/[^0-9]/g, ''), 10) || 2;
            return `\${Number(${varName}).toFixed(${digits})}`;
          }
          return `\${${varName}}`;
        }
        return `\${${expr}}`;
      });
      return `\`${template}\``;
    });

    // Transform import statements
    if (transformed.startsWith('import ') || transformed.startsWith('from ')) {
      jsLines.push(`${currentIndent}// ${transformed}`);
      continue;
    }

    // Transform input() and time.sleep() calls to async await
    transformed = transformed.replace(/\binput\(/g, 'await input(');
    transformed = transformed.replace(/\btime\.sleep\(/g, 'await time.sleep(');

    // Function definition: def name(args):
    if (transformed.startsWith('def ') && transformed.endsWith(':')) {
      const defContent = transformed.slice(4, -1);
      const parenIdx = defContent.indexOf('(');
      const fnName = defContent.slice(0, parenIdx).trim();
      const fnArgs = defContent.slice(parenIdx);
      jsLines.push(`${currentIndent}async function ${fnName}${fnArgs} {`);
      indentStack.push(indentLevel + 4);
      continue;
    }

    // If / Elif / Else:
    if (transformed.startsWith('if ') && transformed.endsWith(':')) {
      const condition = transformCondition(transformed.slice(3, -1));
      jsLines.push(`${currentIndent}if (${condition}) {`);
      indentStack.push(indentLevel + 4);
      continue;
    }

    if (transformed.startsWith('elif ') && transformed.endsWith(':')) {
      const condition = transformCondition(transformed.slice(5, -1));
      // Pop previous block if needed
      jsLines.push(`${currentIndent}} else if (${condition}) {`);
      continue;
    }

    if (transformed === 'else:') {
      jsLines.push(`${currentIndent}} else {`);
      continue;
    }

    // While loop: while cond:
    if (transformed.startsWith('while ') && transformed.endsWith(':')) {
      const condition = transformCondition(transformed.slice(6, -1));
      jsLines.push(`${currentIndent}while (${condition}) {`);
      indentStack.push(indentLevel + 4);
      continue;
    }

    // For loop: for x in iterable:
    const forMatch = transformed.match(/^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+(.+):$/);
    if (forMatch) {
      const vars = forMatch[1].trim();
      const iterable = forMatch[2].trim();
      jsLines.push(`${currentIndent}for (const ${vars} of ${iterable}) {`);
      indentStack.push(indentLevel + 4);
      continue;
    }

    // List slicing: var[:10] -> var.slice(0, 10)
    transformed = transformed.replace(/([a-zA-Z0-9_]+)\[:([0-9]+)\]/g, '$1.slice(0, $2)');
    transformed = transformed.replace(/([a-zA-Z0-9_]+)\[([0-9]+):\]/g, '$1.slice($2)');
    transformed = transformed.replace(/([a-zA-Z0-9_]+)\[-1\]/g, '$1[$1.length - 1]');

    // .append(...) -> .push(...)
    transformed = transformed.replace(/\.append\(/g, '.push(');

    // .isdigit() -> (!isNaN(Number(...)))
    transformed = transformed.replace(/([a-zA-Z0-9_]+)\.isdigit\(\)/g, '!isNaN(Number($1))');

    // String repetition: "-" * 55 -> "-".repeat(55)
    transformed = transformed.replace(/"([^"]+)"\s*\*\s*([0-9]+)/g, '"$1".repeat($2)');
    transformed = transformed.replace(/'([^']+)'\s*\*\s*([0-9]+)/g, "'$1'.repeat($2)");

    // Variable assignment: x = ...
    // Auto-declare with 'let' or 'const' if not already declared in current scope
    const assignMatch = transformed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
    if (assignMatch && !transformed.includes('==') && !transformed.startsWith('self.')) {
      const varName = assignMatch[1];
      const val = assignMatch[2];
      jsLines.push(`${currentIndent}let ${varName} = ${val};`);
      continue;
    }

    // Standard expression / statement
    if (!transformed.endsWith(';') && !transformed.endsWith('{') && !transformed.endsWith('}')) {
      transformed += ';';
    }

    jsLines.push(`${currentIndent}${transformed}`);
  }

  // Close any remaining open blocks
  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
  }

  return jsLines.join('\n');
}

function transformCondition(pyCond: string): string {
  let cond = pyCond.trim();
  cond = cond.replace(/\band\b/g, '&&');
  cond = cond.replace(/\bor\b/g, '||');
  cond = cond.replace(/\bnot\b/g, '!');
  cond = cond.replace(/\bTrue\b/g, 'true');
  cond = cond.replace(/\bFalse\b/g, 'false');
  cond = cond.replace(/\bNone\b/g, 'null');
  return cond;
}
