import React, { useState } from 'react';
import {
  Globe,
  Play,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Shield,
  Server,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface Apache2AppProps {
  config: DistroConfiguration;
}

export const Apache2App: React.FC<Apache2AppProps> = ({ config }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [activeTab, setActiveTab] = useState<'browser' | 'status' | 'vhost' | 'logs'>('browser');
  const [browserUrl, setBrowserUrl] = useState('http://localhost/');
  const [accessLogs, setAccessLogs] = useState<string[]>([
    '127.0.0.1 - - [01/Nov/2026:19:30:12 -0800] "GET / HTTP/1.1" 200 11520 "-" "Mozilla/5.0 ApexOS"',
    '127.0.0.1 - - [01/Nov/2026:19:31:05 -0800] "GET /favicon.ico HTTP/1.1" 404 492 "-" "Mozilla/5.0"',
    '127.0.0.1 - - [01/Nov/2026:19:35:22 -0800] "GET /icons/ubuntu-logo.png HTTP/1.1" 200 3614 "-" "curl/8.5.0"',
  ]);

  const toggleServer = (action: 'start' | 'stop' | 'restart') => {
    if (action === 'stop') {
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
    const newLog = `127.0.0.1 - - [${new Date().toLocaleTimeString()}] "systemctl ${action} apache2.service" 200 0`;
    setAccessLogs((prev) => [...prev, newLog]);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans select-none text-xs">
      {/* Top Header & Service Controls */}
      <div className="h-11 px-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-wide text-white">Apache HTTP Server 2.4.58</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className={isRunning ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
              {isRunning ? 'active (running) on Port 80' : 'inactive (stopped)'}
            </span>
          </div>
        </div>

        {/* Server Actions */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <>
              <button
                onClick={() => toggleServer('restart')}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition text-xs border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Restart</span>
              </button>
              <button
                onClick={() => toggleServer('stop')}
                className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-md transition text-xs border border-rose-500/40"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => toggleServer('start')}
              className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold transition text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Server</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="h-9 px-4 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 text-xs shrink-0">
        <button
          onClick={() => setActiveTab('browser')}
          className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
            activeTab === 'browser' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Localhost Browser (Port 80)</span>
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
            activeTab === 'status' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>systemctl Status</span>
        </button>
        <button
          onClick={() => setActiveTab('vhost')}
          className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
            activeTab === 'vhost' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>VirtualHost Config</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1.5 ${
            activeTab === 'logs' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Access Logs ({accessLogs.length})</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tab 1: Localhost Browser */}
        {activeTab === 'browser' && (
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* Browser URL Bar */}
            <div className="h-9 px-3 bg-slate-900 border-b border-slate-800 flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 text-slate-500">
                <button
                  onClick={() => setBrowserUrl('http://localhost/')}
                  className="p-1 hover:text-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-md px-3 py-1 text-xs font-mono text-emerald-400">
                <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{browserUrl}</span>
              </div>
            </div>

            {/* Browser Render Canvas */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
              {isRunning ? (
                /* Authentic Ubuntu Apache2 Default Webpage */
                <div className="max-w-3xl mx-auto bg-white text-slate-900 p-8 rounded-xl shadow-2xl border border-slate-300 font-sans space-y-4">
                  <div className="border-b-2 border-red-700 pb-3 flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-black text-slate-900">
                        Apache2 Ubuntu Default Page
                      </h1>
                      <p className="text-xs text-red-700 font-semibold uppercase tracking-wider mt-0.5">
                        It works! — {config.distroName}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow">
                      A2
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    This is the default welcome page used to test the correct operation of the Apache2 server after installation on <strong>{config.distroName}</strong> (Ubuntu 24.04 LTS). It is based on the equivalent page on Ubuntu.
                  </p>

                  <div className="p-4 bg-slate-100 rounded-lg border border-slate-200 text-xs space-y-2">
                    <h3 className="font-bold text-slate-800">Configuration Overview</h3>
                    <p className="text-slate-600">
                      Apache's default configuration files are located in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">/etc/apache2/</code>. You can customize site virtual hosts in <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">sites-available/</code>.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <strong className="text-red-900 block mb-1">DocumentRoot:</strong>
                      <span className="font-mono text-red-800">/var/www/html/index.html</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                      <strong className="text-emerald-900 block mb-1">Server Status:</strong>
                      <span className="font-mono text-emerald-800">HTTP 200 OK (KeepAlive on)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 text-slate-400">
                  <AlertCircle className="w-12 h-12 text-rose-500" />
                  <h3 className="text-base font-bold text-white">This site can’t be reached</h3>
                  <p className="text-xs max-w-sm">
                    localhost refused to connect. Start the Apache HTTP Server service using the toolbar controls above.
                  </p>
                  <button
                    onClick={() => toggleServer('start')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs"
                  >
                    Start Apache2 Server
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: systemctl status */}
        {activeTab === 'status' && (
          <div className="flex-1 p-5 bg-slate-950 font-mono text-xs overflow-y-auto space-y-1 text-slate-300">
            <p className="text-emerald-400 font-bold">● apache2.service - The Apache HTTP Server</p>
            <p className="pl-4">Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)</p>
            <p className="pl-4">
              Active: <span className={isRunning ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                {isRunning ? 'active (running)' : 'inactive (dead)'}
              </span>
            </p>
            <p className="pl-4">Docs: https://httpd.apache.org/docs/2.4/</p>
            <p className="pl-4">Process: 2841 ExecStart=/usr/sbin/apache2ctl start (code=exited, status=0/SUCCESS)</p>
            <p className="pl-4">Main PID: 2842 (apache2)</p>
            <p className="pl-4">Tasks: 55 (limit: 38321)</p>
            <p className="pl-4">Memory: 24.8M</p>
            <p className="pl-4">CGroup: /system.slice/apache2.service</p>
            <p className="pl-12">├─2842 /usr/sbin/apache2 -k start</p>
            <p className="pl-12">├─2843 /usr/sbin/apache2 -k start</p>
            <p className="pl-12">└─2844 /usr/sbin/apache2 -k start</p>
            <p className="text-slate-500 pt-3">Listening ports: 0.0.0.0:80, [::]:80 (TCP)</p>
          </div>
        )}

        {/* Tab 3: VirtualHost Config */}
        {activeTab === 'vhost' && (
          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-y-auto text-slate-300">
            <div className="text-slate-500 mb-2"># /etc/apache2/sites-available/000-default.conf</div>
            <pre className="text-amber-300/90 leading-relaxed select-text">
{`<VirtualHost *:80>
    ServerAdmin webmaster@${config.hostname}
    DocumentRoot /var/www/html

    ServerName ${config.hostname}
    ServerAlias localhost 127.0.0.1

    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>`}
            </pre>
          </div>
        )}

        {/* Tab 4: Logs */}
        {activeTab === 'logs' && (
          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-y-auto space-y-1 text-slate-300">
            <div className="text-slate-500 mb-2"># /var/log/apache2/access.log</div>
            {accessLogs.map((log, idx) => (
              <div key={idx} className="text-emerald-400/90">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
