import { RefreshCw, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { registerSW } from 'virtual:pwa-register';

import { cn } from '../../lib/utils';

/** Global PWA toasts — app updates and offline ready only (install is on login page). */
export function PwaProvider() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
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

  function handleRefresh() {
    void updateSWRef.current?.(true);
  }

  const showOffline = offlineReady && !dismissedOffline && !needRefresh;
  const showUpdate = needRefresh;

  if (!showOffline && !showUpdate) {
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

        {showOffline && !showUpdate && (
          <Banner
            icon={<RefreshCw className="h-5 w-5 text-emerald-600" />}
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
        'flex items-start gap-3 rounded-3xl border border-vt-border bg-vt-surface p-4 shadow-elevated',
      )}
      role="status"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vt-light-blue">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-vt-foreground">{title}</p>
        <p className="mt-0.5 text-sm text-vt-muted">{description}</p>
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
        className="shrink-0 rounded-lg p-1 text-vt-muted hover:bg-slate-100"
        aria-label="Dismiss"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
