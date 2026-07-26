import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  linkTo?: string;
};

type NotificationState = {
  items: AppNotification[];
  add: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (notification) =>
        set((state) => ({
          items: [
            {
              ...notification,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.items,
          ].slice(0, 50),
        })),
      markRead: (id) =>
        set((state) => ({
          items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: () =>
        set((state) => ({
          items: state.items.map((n) => ({ ...n, read: true })),
        })),
      unreadCount: () => get().items.filter((n) => !n.read).length,
    }),
    { name: 'vt-notifications' },
  ),
);
