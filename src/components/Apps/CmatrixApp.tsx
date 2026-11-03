import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  Sliders,
  Palette,
  Volume2,
  VolumeX,
  Type,
  Zap,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface CmatrixAppProps {
  config: DistroConfiguration;
}

export const CmatrixApp: React.FC<CmatrixAppProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [colorScheme, setColorScheme] = useState<'green' | 'cyan' | 'amber' | 'purple' | 'red' | 'rainbow'>('green');
  const [charSet, setCharSet] = useState<'matrix' | 'binary' | 'hex' | 'cyber'>('matrix');
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast' | 'hyper'>('normal');
  const [fontSize, setFontSize] = useState<number>(14);
  const [glowEnabled, setGlowEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [customText, setCustomText] = useState('THE MATRIX HAS YOU...');
  const [showCustomBanner, setShowCustomBanner] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);

  // Fullscreen toggle using HTML5 Fullscreen API
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      // Fallback for iframe environments: toggle local maximized state
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard shortcut: F for fullscreen, Space for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Ambient Web Audio synth hum
  useEffect(() => {
    if (!soundEnabled) {
      if (synthGainRef.current) {
        synthGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current?.currentTime || 0, 0.1);
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A1 cyber drone

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      synthGainRef.current = gain;

      return () => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      };
    } catch (e) {
      console.warn('AudioContext unavailable');
    }
  }, [soundEnabled]);

  // Main high-performance Matrix Rain engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Character Sets
    let charBank = '';
    if (charSet === 'matrix') {
      charBank = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF$#@%&*+-=<>{}[]';
    } else if (charSet === 'binary') {
      charBank = '01';
    } else if (charSet === 'hex') {
      charBank = '0123456789ABCDEF';
    } else {
      charBank = 'ΨΩΔΣΠλμθ⚡☠▲▼◆★0123456789<>=+*/';
    }

    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = [];
    const speeds: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -60);
      speeds[i] = 0.8 + Math.random() * 0.6;
    }

    let animationId: number;
    let lastTime = performance.now();

    const interval = speed === 'hyper' ? 16 : speed === 'fast' ? 24 : speed === 'slow' ? 65 : 36;

    const render = (now: number) => {
      animationId = requestAnimationFrame(render);
      if (!isPlaying) return;

      const elapsed = now - lastTime;
      if (elapsed < interval) return;
      lastTime = now;

      // Semi-transparent black wash for phosphorescent trailing
      ctx.fillStyle = 'rgba(2, 6, 23, 0.09)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px "Courier New", Courier, monospace`;

      if (glowEnabled) {
        ctx.shadowBlur = 8;
      } else {
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < drops.length; i++) {
        const char = charBank.charAt(Math.floor(Math.random() * charBank.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Is leading head character
        const isLeader = Math.random() > 0.82;

        if (isLeader) {
          ctx.fillStyle = '#ffffff';
          if (glowEnabled) ctx.shadowColor = '#ffffff';
        } else {
          switch (colorScheme) {
            case 'green':
              ctx.fillStyle = '#22c55e';
              if (glowEnabled) ctx.shadowColor = '#22c55e';
              break;
            case 'cyan':
              ctx.fillStyle = '#06b6d4';
              if (glowEnabled) ctx.shadowColor = '#06b6d4';
              break;
            case 'amber':
              ctx.fillStyle = '#f59e0b';
              if (glowEnabled) ctx.shadowColor = '#f59e0b';
              break;
            case 'purple':
              ctx.fillStyle = '#c084fc';
              if (glowEnabled) ctx.shadowColor = '#c084fc';
              break;
            case 'red':
              ctx.fillStyle = '#ef4444';
              if (glowEnabled) ctx.shadowColor = '#ef4444';
              break;
            case 'rainbow': {
              const hue = (i * 8 + drops[i] * 6) % 360;
              ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
              if (glowEnabled) ctx.shadowColor = `hsl(${hue}, 100%, 65%)`;
              break;
            }
          }
        }

        ctx.fillText(char, x, y);

        // Reset to top when off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i] += speeds[i] || 1;
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [isPlaying, colorScheme, speed, charSet, fontSize, glowEnabled]);

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex flex-col bg-black text-slate-100 font-mono select-none overflow-hidden text-xs relative ${
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : 'h-full'
      }`}
    >
      {/* Top Header / Control Bar */}
      <div className="h-10 px-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between shrink-0 gap-2 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs">cmatrix v2.0 (Terminal Rain)</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">GPU Canvas 60 FPS</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Palette Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
            {[
              { id: 'green', label: 'Green', color: '#22c55e' },
              { id: 'cyan', label: 'Cyan', color: '#06b6d4' },
              { id: 'amber', label: 'Amber', color: '#f59e0b' },
              { id: 'purple', label: 'Purple', color: '#c084fc' },
              { id: 'red', label: 'Red', color: '#ef4444' },
              { id: 'rainbow', label: 'RGB', color: '#ec4899' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setColorScheme(p.id as any)}
                className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
                  colorScheme === p.id
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                <span className="hidden md:inline">{p.label}</span>
              </button>
            ))}
          </div>

          {/* CharSet Selector */}
          <select
            value={charSet}
            onChange={(e) => setCharSet(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-none cursor-pointer"
          >
            <option value="matrix">Katakana Matrix</option>
            <option value="binary">Binary (0/1)</option>
            <option value="hex">Hexadecimal</option>
            <option value="cyber">Cyber Glyphs</option>
          </select>

          {/* Speed */}
          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 outline-none cursor-pointer"
          >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
            <option value="hyper">Hyper</option>
          </select>

          {/* Glow toggle */}
          <button
            onClick={() => setGlowEnabled(!glowEnabled)}
            className={`p-1.5 rounded-lg border transition ${
              glowEnabled ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="Toggle Bloom / Neon Glow"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border transition ${
              soundEnabled ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title={soundEnabled ? 'Mute Cybernetic Drone' : 'Enable Cybernetic Drone'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            title={isPlaying ? 'Pause Rain (Space)' : 'Resume Rain (Space)'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* FULLSCREEN BUTTON */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1 shadow-md"
            title={isFullscreen ? 'Exit Fullscreen (F / Esc)' : 'Enter Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-mono text-[10px] font-bold">
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Retro CRT Scanlines & Curved Screen Vignette */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.6) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
            backgroundSize: '100% 3px, 6px 100%',
          }}
        ></div>

        {/* Fullscreen Overlay Floating Controls when in fullscreen */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/80 p-2 rounded-xl border border-emerald-500/40 backdrop-blur-md opacity-70 hover:opacity-100 transition shadow-2xl">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2.5 py-1 rounded bg-slate-900 text-emerald-400 text-xs font-mono border border-emerald-500/30"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-xs font-mono"
            >
              Exit Fullscreen (Esc)
            </button>
          </div>
        )}

        {/* Custom Holographic Message Banner */}
        {showCustomBanner && (
          <div className="absolute z-10 px-8 py-4 bg-black/90 border-2 border-emerald-500/80 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.3)] backdrop-blur-xl text-center space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <span className="text-2xl font-black text-emerald-400 tracking-widest block font-mono drop-shadow-[0_0_12px_rgba(34,197,94,0.8)]">
              {customText}
            </span>
            <div className="text-[10px] text-emerald-600 font-mono tracking-wider">
              APEXOS 24.04 LTS NOBLE NUMBAT • CYBER REALM
            </div>
            <div className="pt-2 flex items-center justify-center gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type custom matrix transmission..."
                className="px-3 py-1 bg-slate-950 border border-emerald-500/40 rounded text-emerald-300 text-xs font-mono outline-none w-64 text-center focus:border-emerald-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Footer */}
      <div className="h-7 px-4 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span>Command: <code className="text-emerald-400">cmatrix -b -C {colorScheme}</code></span>
          <span className="hidden sm:inline">Shortcuts: <kbd className="text-slate-300">[Space]</kbd> Pause · <kbd className="text-slate-300">[F]</kbd> Fullscreen</span>
        </div>
        <button
          onClick={() => setShowCustomBanner(!showCustomBanner)}
          className="text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
        >
          {showCustomBanner ? 'Close Cyber Banner' : 'Transmit Custom Message ❯'}
        </button>
      </div>
    </div>
  );
};
