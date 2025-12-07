import React, { useState } from 'react';
import { Header } from './components/Header';
import { Features } from './components/Features';
import { StylistInterface } from './components/StylistInterface';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case AppMode.FACE:
        return <StylistInterface mode={AppMode.FACE} />;
      case AppMode.BODY:
        return <StylistInterface mode={AppMode.BODY} />;
      case AppMode.HOME:
      default:
        return <Features onNavigate={setMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      <Header currentMode={mode} onNavigate={setMode} />
      <main>
        {renderContent()}
      </main>
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>
    </div>
  );
}

export default App;