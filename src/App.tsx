/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DEFAULT_DISTRO_CONFIG } from './data/defaultDistroConfig';
import { DistroConfiguration } from './types/distro';
import { DesktopEnvironment } from './components/Desktop/DesktopEnvironment';
import { ExportDistroModal } from './components/Modals/ExportDistroModal';

export default function App() {
  const [config, setConfig] = useState<DistroConfiguration>(DEFAULT_DISTRO_CONFIG);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Live Interactive Linux Operating System Desktop */}
      <DesktopEnvironment
        config={config}
        onUpdateConfig={setConfig}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Export & Build ISO Modal with Multi-Stage Progress Bar & Download ISO */}
      <ExportDistroModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        config={config}
      />
    </div>
  );
}
