import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Box,
  Compass,
  Eye,
  Folder,
  FileCode,
  HardDrive,
  Maximize2,
  Minimize2,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  MousePointer,
  Crosshair,
  Terminal,
  FolderOpen,
  Copy,
  Check,
  Navigation,
  Layers,
  Flame,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { ActiveAppId, DistroConfiguration } from '../../types/distro';

interface TdfsbAppProps {
  config: DistroConfiguration;
  onOpenApp?: (appId: ActiveAppId) => void;
}

interface FsNode {
  name: string;
  type: 'dir' | 'file';
  size: string;
  permissions: string;
  preview?: string;
  color: number;
  category?: 'script' | 'config' | 'binary' | 'desktop' | 'source';
}

export const TdfsbApp: React.FC<TdfsbAppProps> = ({ config, onOpenApp }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const minimapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentDirectory, setCurrentDirectory] = useState<string>('/home/developer');
  const [hoveredNode, setHoveredNode] = useState<FsNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<FsNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pointerLockActive, setPointerLockActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copiedPath, setCopiedPath] = useState<boolean>(false);
  const [flySpeed, setFlySpeed] = useState<number>(1.0);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthesizer sound generator
  const playSfx = useCallback((type: 'warp' | 'click' | 'hover') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'warp') {
        // Sci-Fi Teleport sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'hover') {
        // Subtle cyber blip
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'click') {
        // Tech click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch {
      // Audio might be blocked by browser autoplay policy before gesture
    }
  }, [soundEnabled]);

  // Virtual directories data for 3D navigation
  const tdfsbFs: Record<string, FsNode[]> = {
    '/': [
      { name: 'bin', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
      { name: 'boot', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
      { name: 'etc', type: 'dir', size: '12.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
      { name: 'home', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
      { name: 'opt', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
      { name: 'usr', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
      { name: 'var', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
      {
        name: 'vmlinuz-6.11-xanmod',
        type: 'file',
        size: '14.2 MB',
        permissions: '-rwxr-xr-x',
        preview: 'Linux kernel image x86_64 XanMod (PREEMPT_RT Gaming Optimized)',
        color: 0xef4444,
        category: 'binary',
      },
    ],
    '/home/developer': [
      { name: '.. (Parent)', type: 'dir', size: 'UP', permissions: 'drwxr-xr-x', color: 0x94a3b8 },
      { name: 'Desktop', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
      { name: 'Games', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0xa855f7 },
      { name: 'Downloads', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
      {
        name: 'build-iso.sh',
        type: 'file',
        size: '4.2 KB',
        permissions: '-rwxr-xr-x',
        preview: `#!/bin/bash\n# Debootstrap live-build for ${config.distroName}\necho "Starting ISO image creation..."\nmksquashfs chroot /tmp/live/filesystem.squashfs -comp zstd\ngrub-mkrescue -o output/${config.distroName.toLowerCase().replace(/\\s+/g, '-')}-24.04-amd64.iso live/`,
        color: 0x10b981,
        category: 'script',
      },
      {
        name: 'steam.desktop',
        type: 'file',
        size: '940 B',
        permissions: '-rwxr-xr-x',
        preview: '[Desktop Entry]\nName=Steam\nComment=Application for managing and playing games\nExec=steam %U\nIcon=steam\nTerminal=false\nType=Application\nCategories=Network;FileTransfer;Game;',
        color: 0x06b6d4,
        category: 'desktop',
      },
      {
        name: 'q4wine.conf',
        type: 'file',
        size: '1.2 KB',
        permissions: '-rw-r--r--',
        preview: '[Q4Wine]\nDefaultPrefix=/home/developer/.wine\nWineVer=9.21-staging\nArch=win64\nDxvkEnabled=true\nVkd3dEnabled=true',
        color: 0xf59e0b,
        category: 'config',
      },
      {
        name: 'mangohud.conf',
        type: 'file',
        size: '820 B',
        permissions: '-rw-r--r--',
        preview: 'fps\nframetime\ncpu_stats\ngpu_stats\ncpu_temp\ngpu_temp\nram\nvram\narch\nvulkan_driver\nposition=top-left',
        color: 0xa855f7,
        category: 'config',
      },
      {
        name: 'cmatrix.sh',
        type: 'file',
        size: '220 B',
        permissions: '-rwxr-xr-x',
        preview: '#!/bin/bash\n# Run cmatrix digital rain in high speed\ncmatrix -b -C green -u 2 -a',
        color: 0x22c55e,
        category: 'script',
      },
    ],
    '/home/developer/Games': [
      { name: '.. (Parent)', type: 'dir', size: 'UP', permissions: 'drwxr-xr-x', color: 0x94a3b8 },
      {
        name: 'Cyberpunk2077.sh',
        type: 'file',
        size: '2.1 KB',
        permissions: '-rwxr-xr-x',
        preview: '#!/bin/bash\nPROTON_ENABLE_NVAPI=1 DXVK_ASYNC=1 mangohud steam steam://rungameid/1091500',
        color: 0xf43f5e,
        category: 'script',
      },
      {
        name: 'WinePrefixes',
        type: 'dir',
        size: '4.0 KB',
        permissions: 'drwxr-xr-x',
        color: 0x38bdf8,
      },
      {
        name: 'dxvk-cache.bin',
        type: 'file',
        size: '34.8 MB',
        permissions: '-rw-r--r--',
        preview: 'Direct3D 11 to Vulkan state cache binary stream',
        color: 0x64748b,
        category: 'binary',
      },
    ],
    '/etc/apt/sources.list.d': [
      { name: '.. (Parent)', type: 'dir', size: 'UP', permissions: 'drwxr-xr-x', color: 0x94a3b8 },
      {
        name: 'lutris.sources',
        type: 'file',
        size: '420 B',
        permissions: '-rw-r--r--',
        preview: 'Types: deb\nURIs: https://ppa.launchpadcontent.net/lutris-team/lutris/ubuntu\nSuites: noble\nComponents: main\nSigned-By: /etc/apt/keyrings/lutris.gpg',
        color: 0xf59e0b,
        category: 'source',
      },
      {
        name: 'android-studio.sources',
        type: 'file',
        size: '445 B',
        permissions: '-rw-r--r--',
        preview: 'Types: deb\nURIs: https://ppa.launchpadcontent.net/maarten-fonville/android-studio/ubuntu\nSuites: noble\nComponents: main\nSigned-By: /etc/apt/keyrings/android-studio.gpg',
        color: 0x06b6d4,
        category: 'source',
      },
      {
        name: 'winehq.sources',
        type: 'file',
        size: '390 B',
        permissions: '-rw-r--r--',
        preview: 'Types: deb\nURIs: https://dl.winehq.org/wine-builds/ubuntu/\nSuites: noble\nComponents: main\nSigned-By: /etc/apt/keyrings/winehq.gpg',
        color: 0xec4899,
        category: 'source',
      },
      {
        name: 'vscode.sources',
        type: 'file',
        size: '360 B',
        permissions: '-rw-r--r--',
        preview: 'Types: deb\nURIs: https://packages.microsoft.com/repos/code\nSuites: stable\nComponents: main\nSigned-By: /etc/apt/keyrings/microsoft.gpg',
        color: 0x3b82f6,
        category: 'source',
      },
    ],
    '/usr/bin': [
      { name: '.. (Parent)', type: 'dir', size: 'UP', permissions: 'drwxr-xr-x', color: 0x94a3b8 },
      { name: 'cmatrix', type: 'file', size: '48.2 KB', permissions: '-rwxr-xr-x', preview: 'ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV)', color: 0x22c55e, category: 'binary' },
      { name: 'tdfsb', type: 'file', size: '92.4 KB', permissions: '-rwxr-xr-x', preview: 'ELF 64-bit LSB executable, x86-64, dynamically linked (OpenGL/GLU)', color: 0x06b6d4, category: 'binary' },
      { name: 'thunar', type: 'file', size: '412 KB', permissions: '-rwxr-xr-x', preview: 'ELF 64-bit LSB pie executable, GTK3 XFCE desktop manager', color: 0x38bdf8, category: 'binary' },
      { name: 'wine64', type: 'file', size: '32.1 KB', permissions: '-rwxr-xr-x', preview: 'Wine 9.21 Windows compatibility loader executable', color: 0xa855f7, category: 'binary' },
      { name: 'mangoapp', type: 'file', size: '128 KB', permissions: '-rwxr-xr-x', preview: 'Vulkan/Wayland autonomous frame-timing overlay runner', color: 0x10b981, category: 'binary' },
    ],
  };

  const getDirNodes = (path: string): FsNode[] => {
    return (
      tdfsbFs[path] || [
        { name: '.. (Parent)', type: 'dir', size: 'UP', permissions: 'drwxr-xr-x', color: 0x94a3b8 },
        { name: 'system_core', type: 'dir', size: '4.0 KB', permissions: 'drwxr-xr-x', color: 0x38bdf8 },
        { name: 'config.json', type: 'file', size: '1.4 KB', permissions: '-rw-r--r--', preview: '{"kernel": "6.11-xanmod", "arch": "x86_64"}', color: 0xf59e0b, category: 'config' },
        { name: 'kernel.img', type: 'file', size: '8.4 MB', permissions: '-rwxr-xr-x', preview: 'Binary executable ELF 64-bit kernel image', color: 0x10b981, category: 'binary' },
      ]
    );
  };

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {
        // Fallback: local container fullscreen
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Request Pointer Lock for FPS Look
  const togglePointerLock = () => {
    const canvas = mountRef.current?.querySelector('canvas');
    if (!canvas) return;

    if (document.pointerLockElement === canvas) {
      document.exitPointerLock();
    } else {
      canvas.requestPointerLock();
    }
  };

  useEffect(() => {
    const handleLockChange = () => {
      const canvas = mountRef.current?.querySelector('canvas');
      setPointerLockActive(document.pointerLockElement === canvas);
    };
    document.addEventListener('pointerlockchange', handleLockChange);
    return () => document.removeEventListener('pointerlockchange', handleLockChange);
  }, []);

  // Global hotkey: 'F' or 'F11' for fullscreen toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        setSoundEnabled((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.032);

    const width = container.clientWidth > 0 ? container.clientWidth : 800;
    const height = container.clientHeight > 0 ? container.clientHeight : 500;

    const camera = new THREE.PerspectiveCamera(72, width / height, 0.1, 1000);
    camera.position.set(0, 1.7, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 3, 35);
    pointLight.position.set(0, 6, 0);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0xa855f7, 2, 25);
    accentLight.position.set(0, 2, 0);
    scene.add(accentLight);

    // 3. Cybernetic Grid & Reflective Floor
    const gridHelper = new THREE.GridHelper(80, 80, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Dark mirror-like floor plane
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.15,
      metalness: 0.85,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    scene.add(floorMesh);

    // 4. Volumetric Dust Particles
    const particlesCount = 600;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 60;
      posArray[i + 1] = Math.random() * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 60;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 5. Spawn 3D File and Directory Nodes in Circular Gallery Room
    const nodes = getDirNodes(currentDirectory);
    const interactiveObjects: THREE.Object3D[] = [];
    const nodePositionMap: { name: string; type: 'dir' | 'file'; x: number; z: number }[] = [];

    const radius = Math.max(5.0, nodes.length * 0.9);

    nodes.forEach((node, idx) => {
      const angle = (idx / nodes.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      nodePositionMap.push({ name: node.name, type: node.type, x, z });

      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(x, 0, z);

      // Rotating Pedestal Base
      const baseGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.15, 24);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.2,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.075;
      nodeGroup.add(baseMesh);

      // Glowing Base Ring
      const ringGeo = new THREE.RingGeometry(0.75, 0.85, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.16;
      nodeGroup.add(ringMesh);

      // Main Node Representation
      let mainObject: THREE.Object3D;

      if (node.type === 'dir') {
        // Holographic Archway Portal
        const portalGroup = new THREE.Group();

        // Left Pillar
        const pillarGeo = new THREE.BoxGeometry(0.2, 2.4, 0.2);
        const frameMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          metalness: 0.8,
          roughness: 0.2,
        });
        const leftPillar = new THREE.Mesh(pillarGeo, frameMat);
        leftPillar.position.set(-0.75, 1.2, 0);
        portalGroup.add(leftPillar);

        // Right Pillar
        const rightPillar = new THREE.Mesh(pillarGeo, frameMat);
        rightPillar.position.set(0.75, 1.2, 0);
        portalGroup.add(rightPillar);

        // Top Arch Beam
        const beamGeo = new THREE.BoxGeometry(1.7, 0.2, 0.2);
        const topBeam = new THREE.Mesh(beamGeo, frameMat);
        topBeam.position.set(0, 2.4, 0);
        portalGroup.add(topBeam);

        // Inner glowing translucent energy membrane
        const energyGeo = new THREE.PlaneGeometry(1.3, 2.2);
        const energyMat = new THREE.MeshBasicMaterial({
          color: node.color,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
        });
        const energyMesh = new THREE.Mesh(energyGeo, energyMat);
        energyMesh.position.set(0, 1.2, 0);
        portalGroup.add(energyMesh);

        // Face portal inwards toward center
        portalGroup.lookAt(0, 1.2, 0);
        nodeGroup.add(portalGroup);
        mainObject = energyMesh;
      } else {
        // 3D Polyhedral Crystals & Binary Orbs for files
        let meshGeo: THREE.BufferGeometry;
        if (node.category === 'script') {
          meshGeo = new THREE.OctahedronGeometry(0.55);
        } else if (node.category === 'desktop') {
          meshGeo = new THREE.TetrahedronGeometry(0.6);
        } else if (node.category === 'config' || node.category === 'source') {
          meshGeo = new THREE.DodecahedronGeometry(0.55);
        } else {
          meshGeo = new THREE.IcosahedronGeometry(0.55);
        }

        const meshMat = new THREE.MeshStandardMaterial({
          color: node.color,
          roughness: 0.15,
          metalness: 0.8,
          emissive: node.color,
          emissiveIntensity: 0.4,
        });
        const fileMesh = new THREE.Mesh(meshGeo, meshMat);
        fileMesh.position.y = 1.35;

        // Wireframe cage
        const wireGeo = meshGeo.clone();
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
          transparent: true,
          opacity: 0.25,
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        fileMesh.add(wireMesh);

        nodeGroup.add(fileMesh);
        mainObject = fileMesh;
      }

      // 3D Canvas Label Sprite
      const canvas = document.createElement('canvas');
      canvas.width = 384;
      canvas.height = 96;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Background Pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = node.type === 'dir' ? '#38bdf8' : '#10b981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(8, 8, 368, 80, 24);
        ctx.fill();
        ctx.stroke();

        // Icon prefix
        ctx.fillStyle = node.type === 'dir' ? '#38bdf8' : '#f59e0b';
        ctx.font = 'bold 26px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(node.type === 'dir' ? 'DIR »' : 'FILE •', 24, 55);

        // Filename
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 28px sans-serif';
        const displayLabel = node.name.length > 14 ? node.name.substring(0, 13) + '…' : node.name;
        ctx.fillText(displayLabel, 130, 56);

        const textTexture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(0, node.type === 'dir' ? 2.8 : 2.2, 0);
        sprite.scale.set(2.4, 0.6, 1);
        nodeGroup.add(sprite);
      }

      // Attach data for Raycasting
      mainObject.userData = node;
      interactiveObjects.push(mainObject);
      scene.add(nodeGroup);
    });

    // 6. Navigation Controls State & Handlers
    const keys: Record<string, boolean> = {};
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Mouse rotation state
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let cameraYaw = 0;
    let cameraPitch = 0;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging = true;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Pointer Lock FPS Mode
      if (document.pointerLockElement === renderer.domElement) {
        cameraYaw -= e.movementX * 0.0022;
        cameraPitch -= e.movementY * 0.0022;
        cameraPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, cameraPitch));
      } else if (isDragging) {
        // Drag-to-look mode
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        cameraYaw -= deltaX * 0.003;
        cameraPitch -= deltaY * 0.003;
        cameraPitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, cameraPitch));
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    // Warp or Select on Click
    const handleWarp = (hitNode: FsNode) => {
      if (hitNode.type === 'dir') {
        playSfx('warp');
        if (hitNode.name.includes('Parent')) {
          const segs = currentDirectory.split('/').filter(Boolean);
          segs.pop();
          const parentPath = '/' + segs.join('/');
          setCurrentDirectory(parentPath || '/');
        } else {
          setCurrentDirectory(
            currentDirectory === '/' ? `/${hitNode.name}` : `${currentDirectory}/${hitNode.name}`
          );
        }
      } else {
        playSfx('click');
        setSelectedNode(hitNode);
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);
      if (intersects.length > 0) {
        const hitNode = intersects[0].object.userData as FsNode;
        handleWarp(hitNode);
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    // 7. Animation & Physics Loop with Smooth Velocity
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const velocity = new THREE.Vector3();
    let lastHoveredName: string | null = null;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.1);

      // Camera orientation from yaw & pitch
      const euler = new THREE.Euler(cameraPitch, cameraYaw, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);

      // WASD Smooth Movement Vector
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();
      right.y = 0;
      right.normalize();

      const speedMultiplier = (keys['shift'] ? 2.2 : 1.0) * flySpeed;
      const targetVel = new THREE.Vector3();

      if (keys['w'] || keys['arrowup']) targetVel.add(forward);
      if (keys['s'] || keys['arrowdown']) targetVel.addScaledVector(forward, -1);
      if (keys['a'] || keys['arrowleft']) targetVel.addScaledVector(right, -1);
      if (keys['d'] || keys['arrowright']) targetVel.add(right);
      if (keys[' '] || keys['e']) targetVel.y += 0.8;
      if (keys['c'] || keys['control']) targetVel.y -= 0.8;

      if (targetVel.lengthSq() > 0) {
        targetVel.normalize().multiplyScalar(5.5 * speedMultiplier);
      }

      // Damped velocity interpolation
      velocity.lerp(targetVel, 10 * delta);
      camera.position.addScaledVector(velocity, delta);

      // Floor clamp
      if (camera.position.y < 0.8) camera.position.y = 0.8;

      // Rotate file polyhedra
      interactiveObjects.forEach((obj) => {
        if (obj.userData?.type === 'file') {
          obj.rotation.y += 0.015;
          obj.rotation.x += 0.008;
        } else if (obj.userData?.type === 'dir') {
          // Pulsing opacity for portal gate
          const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat && mat.opacity !== undefined) {
            mat.opacity = 0.35 + Math.sin(clock.getElapsedTime() * 3) * 0.15;
          }
        }
      });

      // Hover Raycasting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);
      if (intersects.length > 0) {
        const foundNode = intersects[0].object.userData as FsNode;
        setHoveredNode(foundNode);
        if (foundNode.name !== lastHoveredName) {
          lastHoveredName = foundNode.name;
          playSfx('hover');
        }
      } else {
        setHoveredNode(null);
        lastHoveredName = null;
      }

      // Render 3D Scene
      renderer.render(scene, camera);

      // Render Radar / Minimap HUD
      if (minimapCanvasRef.current) {
        const mCanvas = minimapCanvasRef.current;
        const mCtx = mCanvas.getContext('2d');
        if (mCtx) {
          mCtx.clearRect(0, 0, mCanvas.width, mCanvas.height);

          // Radar circle & rings
          const center = mCanvas.width / 2;
          mCtx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
          mCtx.lineWidth = 1.5;
          mCtx.beginPath();
          mCtx.arc(center, center, center - 4, 0, Math.PI * 2);
          mCtx.stroke();

          mCtx.beginPath();
          mCtx.arc(center, center, (center - 4) * 0.5, 0, Math.PI * 2);
          mCtx.stroke();

          // Radar sweep sweep line
          const sweepAngle = (clock.getElapsedTime() * 2) % (Math.PI * 2);
          mCtx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
          mCtx.beginPath();
          mCtx.moveTo(center, center);
          mCtx.lineTo(
            center + Math.cos(sweepAngle) * (center - 4),
            center + Math.sin(sweepAngle) * (center - 4)
          );
          mCtx.stroke();

          // Map scale
          const mapScale = 5.2;

          // Draw surrounding nodes as blips
          nodePositionMap.forEach((np) => {
            const relX = np.x - camera.position.x;
            const relZ = np.z - camera.position.z;
            const screenX = center + relX * mapScale;
            const screenY = center + relZ * mapScale;

            if (
              screenX >= 6 &&
              screenX <= mCanvas.width - 6 &&
              screenY >= 6 &&
              screenY <= mCanvas.height - 6
            ) {
              mCtx.fillStyle = np.type === 'dir' ? '#38bdf8' : '#10b981';
              mCtx.beginPath();
              mCtx.arc(screenX, screenY, np.type === 'dir' ? 3.5 : 2.5, 0, Math.PI * 2);
              mCtx.fill();
            }
          });

          // Draw player position & orientation
          mCtx.fillStyle = '#f59e0b';
          mCtx.beginPath();
          mCtx.arc(center, center, 4, 0, Math.PI * 2);
          mCtx.fill();

          // Player forward sight pointer
          const heading = -cameraYaw - Math.PI / 2;
          mCtx.strokeStyle = '#f59e0b';
          mCtx.lineWidth = 2;
          mCtx.beginPath();
          mCtx.moveTo(center, center);
          mCtx.lineTo(center + Math.cos(heading) * 12, center + Math.sin(heading) * 12);
          mCtx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || container.clientWidth <= 0 || container.clientHeight <= 0) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [currentDirectory, flySpeed, playSfx]);

  const copyPathToClipboard = () => {
    if (selectedNode) {
      const fullPath = `${currentDirectory}/${selectedNode.name}`.replace('//', '/');
      navigator.clipboard.writeText(fullPath);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    }
  };

  const currentNodes = getDirNodes(currentDirectory);

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden text-xs relative ${
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : 'h-full'
      }`}
    >
      {/* Top Header Bar */}
      <div className="h-10 px-4 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between z-20 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white tracking-wide">TDFSB (Modded)</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
            3D File System Browser (OpenGL/Three.js)
          </span>
        </div>

        {/* Center Breadcrumbs */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-slate-400 hidden md:inline">Path:</span>
          <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-400 font-bold max-w-xs md:max-w-md truncate">
            <Folder className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{currentDirectory}</span>
          </div>
        </div>

        {/* Top Control Actions */}
        <div className="flex items-center gap-2">
          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Audio Synthesizer (M)' : 'Enable Audio Synthesizer (M)'}
            className={`p-1.5 rounded-lg border transition ${
              soundEnabled
                ? 'bg-slate-900 border-cyan-500/40 text-cyan-400 hover:bg-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Pointer Lock FPS Mode Toggle */}
          <button
            onClick={togglePointerLock}
            title={pointerLockActive ? 'Exit Pointer Lock (Esc)' : 'Lock Mouse for True First-Person Look'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-medium transition ${
              pointerLockActive
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{pointerLockActive ? 'FPS Locked' : 'FPS Lock'}</span>
          </button>

          {/* Controls Help Modal */}
          <button
            onClick={() => setShowHelpModal(true)}
            title="Controls & Navigation Guide"
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Dedicated Fullscreen Toggle Option */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F or Esc)' : 'Enter Fullscreen (F or F11)'}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-[11px] transition shadow-md"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport Canvas Container */}
      <div className="relative flex-1 bg-black overflow-hidden cursor-crosshair">
        <div ref={mountRef} className="absolute inset-0 w-full h-full" />

        {/* HUD Crosshair in Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
          <div className="w-4 h-4 border border-cyan-400/80 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.6)]">
            <div className="w-1 h-1 bg-cyan-300 rounded-full"></div>
          </div>
        </div>

        {/* Floating Exit Fullscreen Button in Fullscreen Mode */}
        {isFullscreen && (
          <div className="absolute top-4 left-4 z-30">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500 text-cyan-300 font-mono text-xs flex items-center gap-2 backdrop-blur-md shadow-2xl hover:bg-slate-850 transition"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Fullscreen (F / Esc)</span>
            </button>
          </div>
        )}

        {/* Top-Right HUD Radar / Minimap */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
          <div className="p-2.5 rounded-2xl bg-slate-950/85 border border-cyan-500/40 shadow-2xl backdrop-blur-md flex flex-col items-center">
            <div className="flex items-center justify-between w-full pb-1.5 border-b border-slate-800/80 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                <Navigation className="w-3 h-3" /> RADAR
              </span>
              <span className="text-emerald-400">{currentNodes.length} Nodes</span>
            </div>
            <canvas
              ref={minimapCanvasRef}
              width={100}
              height={100}
              className="mt-1.5 rounded-full bg-slate-900/90 border border-slate-800"
            />
            <div className="pt-1.5 text-[9px] font-mono text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Portals
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Files
              </span>
            </div>
          </div>

          {/* Flight Controls Pill */}
          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-0.5">
            <div><strong className="text-white">WASD</strong> Move • <strong className="text-white">Shift</strong> Boost</div>
            <div><strong className="text-white">Space / C</strong> Ascend / Descend</div>
            <div><strong className="text-cyan-400">Click Portal</strong> Warp</div>
          </div>
        </div>

        {/* Holographic Floating Card for Hovered Item */}
        {hoveredNode && (
          <div className="absolute bottom-14 left-6 z-20 p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/80 shadow-2xl backdrop-blur-md font-mono text-xs max-w-sm pointer-events-none animate-in fade-in duration-100">
            <div className="flex items-center gap-2 text-white font-bold pb-1.5 border-b border-slate-800">
              {hoveredNode.type === 'dir' ? (
                <Folder className="w-4 h-4 text-cyan-400" />
              ) : (
                <FileCode className="w-4 h-4 text-emerald-400" />
              )}
              <span className="truncate">{hoveredNode.name}</span>
            </div>
            <div className="pt-2 text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Type:</span>
                <strong className="text-amber-400 capitalize">
                  {hoveredNode.type === 'dir' ? 'Directory Portal (Archway)' : 'File Crystal'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <strong>{hoveredNode.size}</strong>
              </div>
              <div className="flex justify-between">
                <span>Permissions:</span>
                <strong className="text-emerald-400">{hoveredNode.permissions}</strong>
              </div>
              {hoveredNode.preview && (
                <div className="mt-1 p-1.5 bg-black/70 rounded border border-slate-800 text-[10px] text-slate-300 font-mono truncate">
                  {hoveredNode.preview}
                </div>
              )}
              <div className="text-[10px] text-cyan-400 pt-1 font-sans flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                {hoveredNode.type === 'dir' ? 'Click portal to warp inside room' : 'Click crystal to inspect file & run'}
              </div>
            </div>
          </div>
        )}

        {/* Selected File Inspection Dialog / Drawer */}
        {selectedNode && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 p-5 rounded-2xl bg-slate-900/95 border border-cyan-500 shadow-2xl backdrop-blur-2xl font-mono text-xs w-[440px] max-w-[90vw] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-bold text-white text-sm flex items-center gap-2 truncate">
                <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{selectedNode.name}</span>
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block">Size:</span>
                <strong className="text-white">{selectedNode.size}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Permissions:</span>
                <strong className="text-emerald-400">{selectedNode.permissions}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Location:</span>
                <span className="text-slate-300 truncate block">{currentDirectory}</span>
              </div>
              <div>
                <span className="text-slate-500 block">MIME / Category:</span>
                <span className="text-amber-400 capitalize">{selectedNode.category || 'Binary Object'}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Content Preview</span>
                <button
                  onClick={copyPathToClipboard}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedPath ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPath ? 'Copied Full Path' : 'Copy Path'}</span>
                </button>
              </div>
              <pre className="p-3 bg-black rounded-xl border border-slate-800 text-emerald-400 text-[11px] max-h-40 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
                {selectedNode.preview || '0x00000000 7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00  .ELF............\n0x00000010 03 00 3e 00 01 00 00 00 40 5d 01 00 00 00 00 00  ..>.....@]......'}
              </pre>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setSelectedNode(null);
                  if (onOpenApp) {
                    onOpenApp('terminal');
                  }
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Run in Terminal</span>
              </button>

              <button
                onClick={() => {
                  setSelectedNode(null);
                  if (onOpenApp) {
                    onOpenApp('thunar');
                  }
                }}
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Open in Thunar</span>
              </button>
            </div>
          </div>
        )}

        {/* Controls Help Modal */}
        {showHelpModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl p-6 max-w-md w-full space-y-4 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  TDFSB 3D Navigation Guide
                </span>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-slate-300">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <strong className="text-white">[W / A / S / D]</strong>
                    <div className="text-slate-400">Flight & Strafe Movement</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <strong className="text-white">[Shift]</strong>
                    <div className="text-slate-400">Turboboost sprint (2.2x)</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <strong className="text-white">[Space] / [C]</strong>
                    <div className="text-slate-400">Ascend / Descend elevation</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <strong className="text-cyan-400">[F] / [F11]</strong>
                    <div className="text-slate-400">Toggle Fullscreen mode</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <strong className="text-amber-400">[M]</strong>
                    <div className="text-slate-400">Toggle Audio Synthesizer</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <strong className="text-emerald-400">[Click Node]</strong>
                    <div className="text-slate-400">Warp portal / Open File</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-cyan-300 font-bold block mb-1">FPS Pointer Lock:</span>
                  Click the <strong>FPS Lock</strong> button in the top bar to capture the mouse pointer for authentic 3D desktop exploration without needing to drag!
                </div>
              </div>

              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar & Teleport Nav */}
      <div className="h-8 px-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 z-20 shrink-0 font-mono">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-slate-600 hidden sm:inline">Teleport:</span>
          <button
            onClick={() => {
              playSfx('warp');
              setCurrentDirectory('/');
            }}
            className={`px-2 py-0.5 rounded transition ${
              currentDirectory === '/' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:text-amber-400'
            }`}
          >
            / (Root)
          </button>
          <span>•</span>
          <button
            onClick={() => {
              playSfx('warp');
              setCurrentDirectory('/home/developer');
            }}
            className={`px-2 py-0.5 rounded transition ${
              currentDirectory === '/home/developer'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                : 'hover:text-amber-400'
            }`}
          >
            ~/developer
          </button>
          <span>•</span>
          <button
            onClick={() => {
              playSfx('warp');
              setCurrentDirectory('/home/developer/Games');
            }}
            className={`px-2 py-0.5 rounded transition ${
              currentDirectory === '/home/developer/Games'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                : 'hover:text-amber-400'
            }`}
          >
            ~/Games
          </button>
          <span>•</span>
          <button
            onClick={() => {
              playSfx('warp');
              setCurrentDirectory('/etc/apt/sources.list.d');
            }}
            className={`px-2 py-0.5 rounded transition ${
              currentDirectory === '/etc/apt/sources.list.d'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                : 'hover:text-amber-400'
            }`}
          >
            /etc/apt/sources.list.d
          </button>
          <span>•</span>
          <button
            onClick={() => {
              playSfx('warp');
              setCurrentDirectory('/usr/bin');
            }}
            className={`px-2 py-0.5 rounded transition ${
              currentDirectory === '/usr/bin'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                : 'hover:text-amber-400'
            }`}
          >
            /usr/bin
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 hidden md:inline">Speed:</span>
          <div className="flex items-center gap-1">
            {[1.0, 1.5, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setFlySpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  flySpeed === s ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          <span className="text-emerald-400 hidden sm:inline">Three.js WebGL • 60 FPS</span>
        </div>
      </div>
    </div>
  );
};
