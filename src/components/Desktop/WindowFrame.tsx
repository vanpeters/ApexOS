import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, X, RefreshCw } from 'lucide-react';
import { ActiveAppId, WindowState } from '../../types/distro';

interface WindowFrameProps {
  window: WindowState;
  onClose: (id: ActiveAppId) => void;
  onMinimize: (id: ActiveAppId) => void;
  onMaximize: (id: ActiveAppId) => void;
  onFocus: (id: ActiveAppId) => void;
  onMove?: (id: ActiveAppId, x: number, y: number) => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  icon,
  children,
}) => {
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState(win.position);

  useEffect(() => {
    setPos(win.position);
  }, [win.position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus(win.id);
    if ((e.target as HTMLElement).closest('.window-control-btn')) return;
    if (win.isMaximized) return;

    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const newX = Math.max(10, Math.min(ev.clientX - dragStart.current.x, document.documentElement.clientWidth - 200));
      const newY = Math.max(36, Math.min(ev.clientY - dragStart.current.y, document.documentElement.clientHeight - 100));
      setPos({ x: newX, y: newY });
      if (onMove) onMove(win.id, newX, newY);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'absolute',
        top: 32, // below desktop topbar
        left: 64, // beside desktop dock
        right: 0,
        bottom: 0,
        zIndex: win.zIndex,
      }
    : {
        position: 'absolute',
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={style}
      onClick={() => onFocus(win.id)}
      className="flex flex-col rounded-xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl text-slate-100 transition-[box-shadow] duration-150 select-none"
    >
      {/* Linux Titlebar */}
      <div
        onMouseDown={handleMouseDown}
        className="h-10 px-3 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between cursor-move shrink-0"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span className="text-xs font-semibold text-slate-200 truncate tracking-wide">
            {win.title}
          </span>
        </div>

        {/* Window controls (Ubuntu GNOME style right buttons) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(win.id);
            }}
            className="window-control-btn w-6 h-6 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
            title="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(win.id);
            }}
            className="window-control-btn w-6 h-6 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
            title={win.isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose(win.id);
            }}
            className="window-control-btn w-6 h-6 rounded-full bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white flex items-center justify-center transition-colors"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto flex flex-col bg-slate-900/90 select-text">
        {children}
      </div>
    </div>
  );
};
