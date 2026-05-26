import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setSession: (accessToken) => set({ accessToken, isAuthenticated: true }),
  clearSession: () => set({ accessToken: null, isAuthenticated: false }),
}));
