import {
  Bell,
  ChevronRight,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Package,
  Settings,
  Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '../components/ecommerce/PageHeader';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

const menuItems = [
  { icon: Package, label: 'My Orders', path: '/orders' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  { icon: MapPin, label: 'Addresses', path: '/profile/address' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/profile/settings' },
  { icon: HelpCircle, label: 'Help & Support', path: '/profile' },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const unread = useNotificationStore((s) => s.unreadCount());
  const isAdmin = user?.isAdmin;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="vt-page">
      <PageHeader title="Profile" />

      <div className="vt-page-body-narrow space-y-4">
        <div className="flex gap-4 rounded-3xl bg-vt-gradient p-5 text-white shadow-elevated sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 text-2xl font-bold ring-2 ring-white/30">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              (user?.name?.charAt(0) ?? 'V')
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold sm:text-xl">{user?.name ?? 'Guest User'}</h2>
            {user?.mobile ? <p className="mt-0.5 text-sm text-white/90">{user.mobile}</p> : null}
            {user?.email ? (
              <p className="truncate text-sm text-white/80">{user.email}</p>
            ) : null}
            {user?.address ? (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/70">{user.address}</p>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-vt-border bg-vt-surface shadow-vt-card">
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="flex w-full items-center gap-4 border-b border-vt-border bg-vt-light-blue/40 px-4 py-4 text-left transition-colors hover:bg-vt-light-blue"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vt-gradient text-white">
                <Shield className="h-5 w-5" />
              </div>
              <span className="flex-1 font-semibold text-vt-blue">Admin Panel</span>
              <ChevronRight className="h-5 w-5 text-vt-blue" />
            </button>
          )}
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-vt-surface-muted ${
                index < menuItems.length - 1 ? 'border-b border-vt-border' : ''
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vt-light-blue">
                <item.icon className="h-5 w-5 text-vt-blue" />
              </div>
              <span className="flex-1 font-medium text-vt-foreground">{item.label}</span>
              {item.label === 'Notifications' && unread > 0 && (
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                  {unread}
                </span>
              )}
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-red-100 bg-red-50 py-4 font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
