import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_BUYER_EMAIL,
  DEMO_BUYER_PASSWORD,
} from '../../demo/constants';
import { env } from '../../utils/env';

export function DemoModeBanner() {
  if (!env.isDemoMode) return null;

  return (
    <div className="border-b border-vt-cyan/30 bg-vt-cyan/10 px-4 py-2 text-center text-xs text-vt-foreground sm:text-sm">
      <span className="font-semibold">Prototype mode</span> — all data is local demo data, no backend
      required.
    </div>
  );
}

export function DemoLoginCredentials() {
  if (!env.isDemoMode) return null;

  return (
    <div className="mt-5 rounded-2xl border border-vt-border bg-vt-surface-muted/80 p-4 text-sm">
      <p className="font-semibold text-vt-foreground">Demo login credentials</p>
      <div className="mt-2 space-y-2 text-vt-muted">
        <p>
          <span className="font-medium text-vt-foreground">Buyer:</span>{' '}
          <span className="text-vt-cyan dark:text-vt-blue">{DEMO_BUYER_EMAIL}</span>
          {' · '}
          <span className="text-vt-cyan dark:text-vt-blue">{DEMO_BUYER_PASSWORD}</span>
        </p>
        <p>
          <span className="font-medium text-vt-foreground">Admin:</span>{' '}
          <span className="text-vt-cyan dark:text-vt-blue">{DEMO_ADMIN_EMAIL}</span>
          {' · '}
          <span className="text-vt-cyan dark:text-vt-blue">{DEMO_ADMIN_PASSWORD}</span>
        </p>
      </div>
    </div>
  );
}
