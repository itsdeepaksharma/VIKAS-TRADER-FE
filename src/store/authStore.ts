import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { loginApi, registerApi } from '../api/auth';
import type { LoginPayload, RegisterPayload, User } from '../types/auth';

export type UserProfile = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
  isAdmin: boolean;
  avatarUrl?: string;
};

type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setSession: (accessToken: string, user: User) => void;
  updateProfile: (user: User) => void;
  setAvatarUrl: (url: string | undefined) => void;
};

function mapUser(user: User): UserProfile {
  return {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`.trim(),
    firstName: user.first_name,
    lastName: user.last_name,
    mobile: user.phone,
    email: user.email,
    address: user.address,
    isAdmin: user.is_superuser,
    avatarUrl: user.avatar_url ?? undefined,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      user: null,
      setSession: (accessToken, user) =>
        set({
          accessToken,
          isAuthenticated: true,
          user: mapUser(user),
        }),
      login: async (payload) => {
        const response = await loginApi(payload);
        set({
          accessToken: response.access_token,
          isAuthenticated: true,
          user: mapUser(response.user),
        });
      },
      register: async (payload) => {
        const response = await registerApi(payload);
        set({
          accessToken: response.access_token,
          isAuthenticated: true,
          user: mapUser(response.user),
        });
      },
      updateProfile: (user) =>
        set((state) => ({
          user: state.user ? mapUser(user) : state.user,
        })),
      setAvatarUrl: (url) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null,
        })),
      logout: () => set({ accessToken: null, isAuthenticated: false, user: null }),
    }),
    { name: 'vt-auth' },
  ),
);
