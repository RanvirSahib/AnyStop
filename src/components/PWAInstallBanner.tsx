import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AnyStopLogo } from './AnyStopLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 bg-[#1F1A3F] text-white p-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 shrink-0">
          <AnyStopLogo variant="app-icon" height="40px" />
        </div>
        <div>
          <div className="font-display font-bold text-sm">Install AnyStop</div>
          <div className="text-xs text-[#DAD3F2]">Instant access on your phone home screen</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-xl bg-[#FF5A4E] hover:bg-[#E8433A] text-white font-bold text-xs transition-all active:scale-95"
        >
          Install
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1.5 rounded-lg text-white/60 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
