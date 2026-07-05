import { Download, X } from 'lucide-react';

import { usePwaInstall } from '../../hooks/usePwaInstall';

export function PwaInstallCard() {
  const { canInstall, install, dismiss } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <div className="mt-6 rounded-2xl border border-vt-blue/25 bg-vt-light-blue/40 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vt-surface">
          <Download className="h-5 w-5 text-vt-blue" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-vt-foreground">Install Vikas Traders</p>
          <p className="mt-0.5 text-sm text-vt-muted">
            Add to your home screen for quick access like a native app.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void install()}
              className="rounded-xl bg-vt-gradient px-4 py-2 text-sm font-semibold text-white"
            >
              Install app
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-xl px-3 py-2 text-sm font-medium text-vt-muted hover:text-vt-foreground"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-lg p-1 text-vt-muted hover:bg-vt-surface"
          aria-label="Dismiss install prompt"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
