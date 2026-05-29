import { Download, RefreshCw, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { registerSW } from 'virtual:pwa-register';

import { cn } from '../../lib/utils';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export function PwaProvider() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissedInstall, setDismissedInstall] = useState(false);
  const [dismissedOffline, setDismissedOffline] = useState(false);

  const updateSWRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    updateSWRef.current = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
    });
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
    setDismissedInstall(true);
  }

  function handleRefresh() {
    void updateSWRef.current?.(true);
  }

  const showInstall = installPrompt && !dismissedInstall;
  const showOffline = offlineReady && !dismissedOffline && !needRefresh;
  const showUpdate = needRefresh;

  if (!showInstall && !showOffline && !showUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-[60] px-4 md:bottom-6">
      <div className="mx-auto max-w-lg">
        {showUpdate && (
          <Banner
            icon={<RefreshCw className="h-5 w-5 text-vt-blue" />}
            title="Update available"
            description="A new version of Vikas Traders is ready."
            primaryLabel="Reload"
            onPrimary={handleRefresh}
            onDismiss={() => setNeedRefresh(false)}
          />
        )}

        {showInstall && !showUpdate && (
          <Banner
            icon={<Download className="h-5 w-5 text-vt-blue" />}
            title="Install Vikas Traders"
            description="Add to your home screen for a faster app-like experience."
            primaryLabel="Install"
            onPrimary={handleInstall}
            onDismiss={() => setDismissedInstall(true)}
          />
        )}

        {showOffline && !showUpdate && !showInstall && (
          <Banner
            icon={<Download className="h-5 w-5 text-emerald-600" />}
            title="Ready for offline"
            description="Browse catalog even without internet."
            primaryLabel="Got it"
            onPrimary={() => setDismissedOffline(true)}
            onDismiss={() => setDismissedOffline(true)}
          />
        )}
      </div>
    </div>
  );
}

type BannerProps = {
  icon: ReactNode;
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
  onDismiss: () => void;
};

function Banner({ icon, title, description, primaryLabel, onPrimary, onDismiss }: BannerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-elevated',
      )}
      role="status"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vt-light-blue">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-vt-dark">{title}</p>
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        <button
          type="button"
          onClick={onPrimary}
          className="mt-3 rounded-xl bg-vt-gradient px-4 py-2 text-sm font-semibold text-white"
        >
          {primaryLabel}
        </button>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
