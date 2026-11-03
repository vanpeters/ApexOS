import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Smartphone,
  FolderTree,
  FileCode,
  Terminal as TermIcon,
  CheckCircle2,
  Bug,
  HardDrive,
  Cpu,
  Layers,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { DistroConfiguration } from '../../types/distro';

interface AndroidStudioAppProps {
  config: DistroConfiguration;
}

export const AndroidStudioApp: React.FC<AndroidStudioAppProps> = ({ config }) => {
  const [activeFile, setActiveFile] = useState<'MainActivity.kt' | 'build.gradle.kts' | 'AndroidManifest.xml'>('MainActivity.kt');
  const [bottomTab, setBottomTab] = useState<'logcat' | 'build' | 'terminal'>('build');
  const [isBuilding, setIsBuilding] = useState(false);
  const [showEmulator, setShowEmulator] = useState(true);
  const [appCounter, setAppCounter] = useState(42);
  const [deviceStatus, setDeviceStatus] = useState('Online (KVM Hardware Accel)');

  const mainActivityCode = `package com.apex.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.apex.app.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Native Linux OS Distro Diagnostic Integration
        binding.txtDistroTitle.text = "${config.distroName}"
        binding.txtKernelInfo.text = "Host Kernel: 6.11.0-xanmod-gaming"
        binding.txtPpaStatus.text = "PPAs: Lutris, Android Studio, Claude, ChatGPT"

        binding.btnIncrement.setOnClickListener {
            // Interactive Kotlin state handler
            updateDiagnosticCount()
        }
    }

    private fun updateDiagnosticCount() {
        val current = binding.txtCounter.text.toString().toIntOrNull() ?: 0
        binding.txtCounter.text = (current + 1).toString()
    }
}`;

  const gradleCode = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.apex.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.apex.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0-apex"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}`;

  const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.ApexOS">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const handleRunApp = () => {
    setIsBuilding(true);
    setBottomTab('build');
    setTimeout(() => {
      setIsBuilding(false);
      setDeviceStatus('App Launched (PID: 14209)');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans select-none">
      {/* Studio Top Toolbar */}
      <div className="h-10 px-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Android Studio Ladybug
          </span>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-slate-200 font-medium">ApexApp</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300 font-mono text-[11px]">{activeFile}</span>
          </div>
        </div>

        {/* Build & Run Controls */}
        <div className="flex items-center gap-2">
          {/* Target device picker */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-700/80 rounded-md text-[11px] text-slate-200">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">Pixel 8 Pro (API 35, KVM)</span>
          </div>

          <button
            onClick={handleRunApp}
            disabled={isBuilding}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium transition shadow-xs disabled:opacity-50"
            title="Run on Android Device / KVM Emulator"
          >
            {isBuilding ? (
              <RotateCcw className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3 fill-current" />
            )}
            <span>{isBuilding ? 'Building...' : 'Run'}</span>
          </button>

          <button
            onClick={() => setShowEmulator(!showEmulator)}
            className={`px-2.5 py-1 rounded-md text-xs border transition ${
              showEmulator
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            AVD Emulator
          </button>
        </div>
      </div>

      {/* Main Workspace (Project Tree + Code Editor + Live Phone Emulator) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Project Explorer Tree */}
        <div className="w-56 bg-slate-950/80 border-r border-slate-800 p-2 flex flex-col text-xs text-slate-300 shrink-0 select-none">
          <div className="flex items-center gap-1.5 px-2 py-1 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Project Files</span>
          </div>

          <div className="space-y-0.5 mt-1 font-mono text-[11px]">
            <div className="flex items-center gap-1 px-1.5 py-1 text-slate-400">
              <ChevronDown className="w-3.5 h-3.5" />
              <span>app/src/main/</span>
            </div>
            <button
              onClick={() => setActiveFile('MainActivity.kt')}
              className={`w-full flex items-center gap-2 px-4 py-1.5 rounded transition ${
                activeFile === 'MainActivity.kt'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>MainActivity.kt</span>
            </button>
            <button
              onClick={() => setActiveFile('AndroidManifest.xml')}
              className={`w-full flex items-center gap-2 px-4 py-1.5 rounded transition ${
                activeFile === 'AndroidManifest.xml'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>AndroidManifest.xml</span>
            </button>
            <button
              onClick={() => setActiveFile('build.gradle.kts')}
              className={`w-full flex items-center gap-2 px-4 py-1.5 rounded transition ${
                activeFile === 'build.gradle.kts'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>build.gradle.kts</span>
            </button>
          </div>

          <div className="mt-auto p-2 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <Cpu className="w-3 h-3" />
              <span>KVM Virtualization</span>
            </div>
            <p>Android Studio PPA + OpenJDK 17 active on Ubuntu 24.04.</p>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* File Tab */}
          <div className="h-8 bg-slate-950/60 border-b border-slate-800 flex items-center px-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border-t-2 border-emerald-500 text-slate-200 font-mono text-[11px]">
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeFile}</span>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed text-slate-200 bg-slate-950">
            <pre className="select-text text-[11px]">
              {activeFile === 'MainActivity.kt' && mainActivityCode}
              {activeFile === 'build.gradle.kts' && gradleCode}
              {activeFile === 'AndroidManifest.xml' && manifestCode}
            </pre>
          </div>

          {/* Bottom Tool Panel */}
          <div className="h-40 bg-slate-950 border-t border-slate-800 flex flex-col shrink-0">
            <div className="h-7 bg-slate-900 border-b border-slate-800/80 flex items-center px-2 gap-4 text-xs">
              <button
                onClick={() => setBottomTab('build')}
                className={`flex items-center gap-1.5 pb-0.5 ${
                  bottomTab === 'build' ? 'text-emerald-400 border-b border-emerald-400 font-medium' : 'text-slate-400'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Build: Sync</span>
              </button>
              <button
                onClick={() => setBottomTab('logcat')}
                className={`flex items-center gap-1.5 pb-0.5 ${
                  bottomTab === 'logcat' ? 'text-emerald-400 border-b border-emerald-400 font-medium' : 'text-slate-400'
                }`}
              >
                <Bug className="w-3.5 h-3.5" />
                <span>Logcat (KVM)</span>
              </button>
              <button
                onClick={() => setBottomTab('terminal')}
                className={`flex items-center gap-1.5 pb-0.5 ${
                  bottomTab === 'terminal' ? 'text-emerald-400 border-b border-emerald-400 font-medium' : 'text-slate-400'
                }`}
              >
                <TermIcon className="w-3.5 h-3.5" />
                <span>Embedded Terminal</span>
              </button>
            </div>

            <div className="flex-1 p-2 font-mono text-[11px] overflow-y-auto text-slate-300">
              {bottomTab === 'build' && (
                <div className="space-y-0.5 text-slate-400">
                  <p className="text-emerald-400 font-semibold">BUILD SUCCESSFUL in 1s</p>
                  <p>19 actionable tasks: 19 executed</p>
                  <p>&gt; Task :app:preBuild UP-TO-DATE</p>
                  <p>&gt; Task :app:compileDebugKotlin (OpenJDK 17 on Linux 6.11)</p>
                  <p>&gt; Task :app:mergeDebugJavaResource</p>
                  <p>&gt; Task :app:packageDebug</p>
                  <p className="text-slate-300">&gt; Target APK: app/build/outputs/apk/debug/app-debug.apk</p>
                </div>
              )}
              {bottomTab === 'logcat' && (
                <div className="space-y-0.5 text-slate-400">
                  <p>19:25:31.104 14209-14209/com.apex.app I/ApexOS: Activity created on Pixel 8 Pro</p>
                  <p>19:25:31.106 14209-14209/com.apex.app D/HardwareAccel: Vulkan pipeline initialized via /dev/kvm</p>
                  <p>19:25:31.110 14209-14209/com.apex.app I/ApexOS: Counter state synchronized: {appCounter}</p>
                </div>
              )}
              {bottomTab === 'terminal' && (
                <div className="space-y-0.5">
                  <p className="text-emerald-400">developer@{config.hostname}:~/AndroidProjects/ApexApp$ adb devices</p>
                  <p className="text-slate-300">List of devices attached</p>
                  <p className="text-emerald-400 font-mono">emulator-5554    device (Pixel 8 Pro API 35)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live AVD Mobile Phone Emulator Frame */}
        {showEmulator && (
          <div className="w-72 bg-slate-950 border-l border-slate-800 p-4 flex flex-col items-center justify-center shrink-0">
            {/* Phone casing */}
            <div className="w-56 h-[460px] bg-slate-900 border-4 border-slate-700 rounded-[36px] p-2.5 shadow-2xl flex flex-col relative overflow-hidden">
              {/* Notch / Dynamic Island */}
              <div className="w-16 h-3.5 bg-black rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
              </div>

              {/* Screen Area */}
              <div className="flex-1 bg-gradient-to-b from-slate-950 to-slate-900 rounded-[24px] p-3 flex flex-col text-white text-center justify-between overflow-hidden border border-slate-800">
                <div>
                  <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                    Android 15 (Vanilla Ice Cream)
                  </div>
                  <h3 className="text-sm font-bold mt-1 text-slate-100">ApexOS Mobile</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Built with Android Studio PPA</p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 my-auto space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Interactive Test State</span>
                  <div className="text-3xl font-extrabold text-amber-400 font-mono">{appCounter}</div>
                  <button
                    onClick={() => setAppCounter((c) => c + 1)}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-semibold text-white transition active:scale-95 shadow"
                  >
                    Tap Increment (+1)
                  </button>
                </div>

                <div className="text-[9px] text-slate-400 space-y-0.5">
                  <p className="text-emerald-400 font-mono">{deviceStatus}</p>
                  <p>KVM Virtualized on Linux 6.11</p>
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-20 h-1 bg-slate-600 rounded-full mx-auto mt-2 shrink-0"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
