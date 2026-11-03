import React, { useState } from 'react';
import { Send, Sparkles, Copy, Check, Terminal, Code2, Layers } from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface ChatGPTAppProps {
  config: DistroConfiguration;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  code?: string;
  time: string;
}

export const ChatGPTApp: React.FC<ChatGPTAppProps> = ({ config }) => {
  const [model, setModel] = useState<'gpt-4o' | 'o1-preview'>('gpt-4o');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'gpt-1',
      sender: 'assistant',
      content: `Welcome! ChatGPT Linux client is active on ${config.distroName} (Ubuntu Noble). I am synchronized with your system's PPA repositories. What Linux task would you like help with?`,
      time: '19:21',
    },
    {
      id: 'gpt-2',
      sender: 'user',
      content: 'Can you show me how to write a systemd service to automatically compile my Android app and trigger Lutris game launch?',
      time: '19:23',
    },
    {
      id: 'gpt-3',
      sender: 'assistant',
      content: `Here is a custom systemd user unit that integrates both Android Studio's Gradle CLI and the Lutris game runner on Ubuntu:`,
      code: `[Unit]
Description=ApexOS Dev & Game Automation Service
After=graphical-session.target

[Service]
Type=oneshot
Environment="ANDROID_HOME=/home/developer/Android/Sdk"
ExecStartPre=/usr/bin/gradle -p /home/developer/AndroidProjects/ApexDemo assembleDebug
ExecStart=/usr/bin/gamemoderun /usr/bin/lutris lutris:rungame/cyberpunk-2077
StandardOutput=journal

[Install]
WantedBy=default.target`,
      time: '19:24',
    },
  ]);

  const handleSend = (text?: string) => {
    const q = text || inputVal;
    if (!q.trim()) return;

    const userEntry: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      content: q.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userEntry]);
    setInputVal('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          content: `Here is how we handle that in ${config.distroName} with pre-configured PPAs:`,
          code: `# Inspect active PPA keys and fingerprint status
apt-key list 2>/dev/null || gpg --show-keys /etc/apt/keyrings/*.gpg

# Update local package indexes
sudo apt update`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 500);
  };

  const copyCode = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="h-11 px-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="text-xs font-semibold text-slate-200">ChatGPT Linux Edition</span>
        </div>

        {/* Model Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => setModel('gpt-4o')}
            className={`px-2.5 py-1 rounded-md transition ${
              model === 'gpt-4o' ? 'bg-slate-800 text-emerald-400 font-medium shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GPT-4o (Omni)
          </button>
          <button
            onClick={() => setModel('o1-preview')}
            className={`px-2.5 py-1 rounded-md transition ${
              model === 'o1-preview' ? 'bg-slate-800 text-emerald-400 font-medium shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            o1-preview (Reasoning)
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`rounded-xl p-3.5 text-xs leading-relaxed max-w-2xl ${
                m.sender === 'user'
                  ? 'bg-emerald-600/90 text-white'
                  : 'bg-slate-800/80 border border-slate-700/60 text-slate-200'
              }`}
            >
              <div className="whitespace-pre-line">{m.content}</div>

              {m.code && (
                <div className="mt-2.5 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                    <span>systemd / bash</span>
                    <button
                      onClick={() => copyCode(m.code!, m.id)}
                      className="flex items-center gap-1 hover:text-slate-200"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-emerald-300/90 overflow-x-auto">
                    {m.code}
                  </pre>
                </div>
              )}

              <div
                className={`text-[10px] mt-1.5 text-right ${
                  m.sender === 'user' ? 'text-emerald-200/70' : 'text-slate-400'
                }`}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-emerald-500/80 transition-colors"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Message ChatGPT about Ubuntu configuration, PPAs, or Lutris scripts..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
