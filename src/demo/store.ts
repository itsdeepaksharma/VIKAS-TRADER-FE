import { useAuthStore } from '../store/authStore';
import { DEMO_STORAGE_KEY } from './constants';
import { createInitialDemoStore, type DemoStoreState } from './seed';

function readStore(): DemoStoreState {
  try {
    const raw = sessionStorage.getItem(DEMO_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DemoStoreState;
  } catch {
    /* reset corrupt demo data */
  }
  const initial = createInitialDemoStore();
  sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function writeStore(state: DemoStoreState): void {
  sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
}

export function getDemoStore(): DemoStoreState {
  return readStore();
}

export function updateDemoStore(updater: (state: DemoStoreState) => DemoStoreState): DemoStoreState {
  const next = updater(readStore());
  writeStore(next);
  return next;
}

export function resetDemoStore(): DemoStoreState {
  const initial = createInitialDemoStore();
  writeStore(initial);
  return initial;
}

export function getDemoUserIdFromSession(): string | null {
  const token = useAuthStore.getState().accessToken;
  if (!token?.startsWith('demo-token-')) return null;
  return token.slice('demo-token-'.length);
}

export function nextDemoId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}
