import React, { useState } from 'react';
import { Send, Bot, Copy, Check, Sparkles, Terminal, Cpu, Gamepad2 } from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface ClaudeAppProps {
  config: DistroConfiguration;
}

interface Message {
  id: string;
  sender: 'user' | 'claude';
  text: string;
  codeSnippet?: string;
  timestamp: string;
}

export const ClaudeApp: React.FC<ClaudeAppProps> = ({ config }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'claude',
      text: `Hello! I'm Claude Desktop running natively on your custom ${config.distroName} (Ubuntu 24.04 LTS). Both your development and gaming repositories are verified: Android Studio PPA, Lutris Gaming PPA, and OpenAI ChatGPT. How can I assist you with your distribution today?`,
      timestamp: '19:20',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'How are my PPA repositories configured on this system for Lutris and Android Studio?',
      timestamp: '19:22',
    },
    {
      id: 'm3',
      sender: 'claude',
      text: 'Your repositories are configured using modern Debian/Ubuntu GPG keyring standards in `/etc/apt/sources.list.d/`. Here is the breakdown:\n\n1. **Lutris Gaming**: Points to `ppa:lutris-team/lutris` with Kisak-Mesa and WineHQ staging backends for peak DirectX 12 translation.\n2. **Android Studio**: Uses Maarten Fonville’s Launchpad PPA, linking the latest IDE builds with OpenJDK 17.\n3. **Claude & ChatGPT**: Configured via dedicated deb keyrings in `/usr/share/keyrings/`.',
      codeSnippet: `# Verify PPA keys and sources status
cat /etc/apt/sources.list.d/ppa-lutris.list
cat /etc/apt/sources.list.d/ppa-android-studio.list

# Test hardware acceleration for Android Emulator
egrep -c '(vmx|svm)' /proc/cpuinfo
ls -l /dev/kvm`,
      timestamp: '19:23',
    },
  ]);

  const quickPrompts = [
    { title: 'Tune Lutris DXVK for Cyberpunk', prompt: 'How do I optimize Lutris Wine and DXVK cache for high FPS?' },
    { title: 'Enable Android Studio KVM', prompt: 'How do I grant user permissions for KVM hardware acceleration in Android Studio?' },
    { title: 'Add a new PPA repository', prompt: 'Show me the secure way to add a Launchpad PPA with gpg keyring.' },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Claude automatic contextual response
    setTimeout(() => {
      let reply = '';
      let code = '';

      const lower = text.toLowerCase();
      if (lower.includes('lutris') || lower.includes('fps') || lower.includes('game') || lower.includes('dxvk')) {
        reply = `To extract peak performance from Lutris on ${config.distroName}:\n1. Use **GE-Proton9** or Wine-Staging 9.21.\n2. Enable **Gamemode** (pre-installed via PPA) to set the CPU governor to performance.\n3. Enable DXVK state cache and asynchronous pipeline compilation.`;
        code = `# Launch any game with GameMode & MangoHud overlay
gamemoderun lutris lutris:rungame/cyberpunk-2077

# Verify Vulkan ICD loader on Kisak Mesa driver
vulkaninfo --summary`;
      } else if (lower.includes('android') || lower.includes('kvm') || lower.includes('emulator')) {
        reply = `Android Studio on ${config.distroName} is pre-configured with the KVM group. Ensure your user belongs to both \`kvm\` and \`libvirt\` so the Android Virtual Device (AVD) boots at bare-metal speed:`;
        code = `# Add current user to KVM group
sudo usermod -aG kvm,libvirt $USER

# Set device permissions
sudo chmod 666 /dev/kvm

# Verify emulator acceleration
$ANDROID_HOME/emulator/emulator -accel-check`;
      } else {
        reply = `I have analyzed your request regarding **${config.distroName}**. Your system is running Linux 6.11 Xanmod Gaming with APT integration across official Ubuntu and Launchpad PPAs.`;
        code = `# Check system health and active repositories
apt-cache policy claude-desktop lutris android-studio chatgpt-desktop`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'claude',
          text: reply,
          codeSnippet: code,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-56 bg-slate-950/70 border-r border-slate-800/80 p-3 hidden md:flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 px-2 py-1.5 mb-3 text-amber-400 font-semibold text-xs tracking-wide">
            <Bot className="w-4 h-4" />
            <span>Claude 3.7 Sonnet</span>
          </div>

          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider px-2 mb-2">
            Recent Linux Chats
          </div>

          <div className="space-y-1">
            <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/80 text-white font-medium truncate">
              Distro PPA Diagnostics
            </button>
            <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition truncate">
              Lutris Proton & DXVK Setup
            </button>
            <button className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition truncate">
              Android Studio AVD Emulator
            </button>
          </div>
        </div>

        <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Sparkles className="w-3 h-3" />
            <span>Native Linux Integration</span>
          </div>
          <p>Direct access to apt repos, terminal logs, and system configs.</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${m.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto'}`}
            >
              {m.sender === 'claude' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`rounded-xl p-3.5 text-xs leading-relaxed max-w-2xl ${
                  m.sender === 'user'
                    ? 'bg-amber-600/90 text-white shadow-sm'
                    : 'bg-slate-800/90 border border-slate-700/60 text-slate-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.codeSnippet && (
                  <div className="mt-3 relative rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
                      <span>bash</span>
                      <button
                        onClick={() => copyToClipboard(m.codeSnippet!, m.id)}
                        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
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
                    <pre className="p-3 text-[11px] font-mono text-amber-300/90 overflow-x-auto">
                      {m.codeSnippet}
                    </pre>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    m.sender === 'user' ? 'text-amber-200/70' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.prompt)}
              className="px-2.5 py-1 text-[11px] rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white whitespace-nowrap transition-colors"
            >
              {q.title}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-amber-500/80 transition-colors"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Claude about Linux PPAs, Lutris wine config, or Android builds..."
              className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
