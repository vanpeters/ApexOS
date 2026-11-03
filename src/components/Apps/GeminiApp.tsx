import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  Copy,
  Check,
  PlusCircle,
  RotateCcw,
  Cpu,
  Layers,
  Terminal,
  Shield,
  Zap,
} from 'lucide-react';
import { DistroConfiguration, PpaRepository } from '../../types/distro';

interface GeminiAppProps {
  config: DistroConfiguration;
  onAddCustomPpa?: (ppa: PpaRepository) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedPpa?: Partial<PpaRepository>;
}

export const GeminiApp: React.FC<GeminiAppProps> = ({ config, onAddCustomPpa }) => {
  const [model, setModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedPpaId, setAddedPpaId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'g-1',
      role: 'model',
      content: `Hello! I am **Gemini AI Linux Distro Architect** for ${config.distroName} (Ubuntu 24.04 LTS).

I can help you:
1. **Design Custom PPA Repositories**: Generate Launchpad PPAs, modern GPG keyring declarations, and sources entries.
2. **Resolve Package Dependencies**: Check compatibility between Linux 6.11 XanMod kernel, Lutris Wine, Android Studio KVM, Apache2, and Synaptic.
3. **Automate Build Recipes**: Customize \`build-iso.sh\` or Dockerfile build stages for your custom distribution.

What repository or package configuration would you like to explore?`,
      timestamp: '19:55',
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      title: 'Add OBS Studio PPA',
      prompt: 'Provide the custom PPA configuration for OBS Studio official on Ubuntu Noble 24.04 with GPG keyring.',
    },
    {
      title: 'Docker CE Repository',
      prompt: 'Show me the official Docker CE APT repository line and keyring for Ubuntu 24.04 LTS.',
    },
    {
      title: 'Tune Lutris DXVK Async',
      prompt: 'What DXVK environment variables should I inject into ApexOS for maximum FPS in Cyberpunk 2077?',
    },
    {
      title: 'Android Studio SDK Path',
      prompt: 'How do I automatically export ANDROID_HOME and platform-tools in /etc/environment during live build?',
    },
  ];

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || inputVal;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputVal('');
    setIsLoading(true);

    try {
      const systemInstruction = `You are the Gemini AI Linux Distro Architect and Kernel Systems Engineer for ${config.distroName} based on Ubuntu ${config.baseUbuntuVersion} (${config.codename}).
Current pre-installed software: Lutris 0.5.17, Android Studio Ladybug, Claude Desktop, ChatGPT, Synaptic, HardInfo, Apache2.
Current kernel: ${config.kernelVariant}.
Help the user configure custom PPA repositories in modern Ubuntu format (deb [signed-by=...] https://... noble main), debug debootstrap/chroot scripts, and tune gaming/IDE performance.
When suggesting a PPA, explicitly provide the ppa Identifier (e.g. ppa:user/repo or deb source line) and GPG key details.`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          systemInstruction,
          model,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'No response returned from Gemini.';

      // Detect if Gemini provided a PPA to enable a 1-click "Add to Custom PPAs" button
      let detectedPpa: Partial<PpaRepository> | undefined;
      const ppaMatch = replyText.match(/ppa:[a-zA-Z0-9_\-.]+\/[a-zA-Z0-9_\-.]+/i);
      if (ppaMatch) {
        const idName = ppaMatch[0].replace('ppa:', '').replace('/', '-');
        detectedPpa = {
          id: `custom-ppa-${idName}`,
          name: `${ppaMatch[0]} Repository`,
          ppaIdentifier: ppaMatch[0],
          sourceLine: `deb [signed-by=/etc/apt/keyrings/${idName}.gpg] https://ppa.launchpadcontent.net/${ppaMatch[0].replace('ppa:', '')}/ubuntu ${config.codename} main`,
          keyringPath: `/etc/apt/keyrings/${idName}.gpg`,
          description: `Custom PPA added via Gemini AI Architect: ${ppaMatch[0]}`,
          category: 'custom',
          enabled: true,
          requiredPackages: [idName.split('-')[1] || 'custom-pkg'],
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'model',
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedPpa: detectedPpa,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: 'model',
          content: `Connection notice: Running local simulated architecture response. Custom PPAs for Ubuntu Noble can be added via /etc/apt/sources.list.d/. Ensure Launchpad keyrings use modern signed-by flags.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddDetectedPpa = (ppa: Partial<PpaRepository>, msgId: string) => {
    if (onAddCustomPpa && ppa.name && ppa.ppaIdentifier && ppa.sourceLine) {
      onAddCustomPpa({
        id: ppa.id || `custom-${Date.now()}`,
        name: ppa.name,
        ppaIdentifier: ppa.ppaIdentifier,
        sourceLine: ppa.sourceLine,
        keyringPath: ppa.keyringPath || '/etc/apt/keyrings/custom.gpg',
        description: ppa.description || 'Custom PPA added via Gemini',
        category: 'custom',
        enabled: true,
        requiredPackages: ppa.requiredPackages || ['custom-pkg'],
      });
      setAddedPpaId(msgId);
      setTimeout(() => setAddedPpaId(null), 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans select-none text-xs">
      {/* Top Header with Gemini Branding & Model Selector */}
      <div className="h-11 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-wide">Gemini AI Distro Architect</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Multi-Turn Linux Systems AI
            </span>
          </div>
        </div>

        {/* Model Tier Selector */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
          <button
            onClick={() => setModel('gemini-3.8-flash')}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              model === 'gemini-3.8-flash'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="General Tasks / Kernel & PPA Guidance"
          >
            gemini-3.8-flash
          </button>
          <button
            onClick={() => setModel('gemini-3.1-flash-lite')}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              model === 'gemini-3.1-flash-lite'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Fast Tasks / Quick Syntax & Flags"
          >
            gemini-3.1-flash-lite
          </button>
          <button
            onClick={() => setModel('gemini-4-argon')}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              model === 'gemini-4-argon'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Complex Tasks / Deep System Architecture"
          >
            gemini-4-argon
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto justify-end' : 'mr-auto'}`}
          >
            {m.role === 'model' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`rounded-xl p-3.5 text-xs leading-relaxed max-w-2xl ${
                m.role === 'user'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line font-sans">{m.content}</div>

              {/* 1-Click Add Detected Custom PPA button */}
              {m.suggestedPpa && onAddCustomPpa && (
                <div className="mt-3 p-2.5 bg-slate-900 rounded-lg border border-cyan-500/40 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-cyan-300 font-mono text-[11px]">
                      {m.suggestedPpa.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-md">
                      {m.suggestedPpa.sourceLine}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddDetectedPpa(m.suggestedPpa!, m.id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-[11px] transition shrink-0"
                  >
                    {addedPpaId === m.id ? (
                      <>
                        <Check className="w-3 h-3 text-slate-950" />
                        <span>Added to Distro!</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3 h-3" />
                        <span>Add to PPAs</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] mt-2 text-slate-500 font-mono">
                <span>{m.timestamp}</span>
                <button
                  onClick={() => copyText(m.content, m.id)}
                  className="hover:text-slate-300 transition flex items-center gap-1"
                >
                  {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-2xl mr-auto">
            <div className="w-7 h-7 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Gemini ({model}) is architecting your distribution config...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Starter Prompts */}
      <div className="px-4 py-2 border-t border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 bg-slate-950/40">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q.prompt)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition disabled:opacity-40"
          >
            {q.title}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 focus-within:border-cyan-500 transition-colors"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask Gemini to configure custom PPAs, write build-iso.sh recipes, or tune kernel flags..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
