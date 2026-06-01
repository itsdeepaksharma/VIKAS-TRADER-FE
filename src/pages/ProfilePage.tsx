import {
  Bell,
  ChevronRight,
  CreditCard,
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

const menuItems = [
  { icon: Package, label: 'My Orders', path: '/orders' },
  { icon: Heart, label: 'Wishlist', path: '/wishlist' },
  { icon: MapPin, label: 'Addresses', path: '/profile' },
  { icon: CreditCard, label: 'Payment Methods', path: '/profile' },
  { icon: Bell, label: 'Notifications', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/profile' },
  { icon: HelpCircle, label: 'Help & Support', path: '/profile' },
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.isAdmin;

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <PageHeader title="Profile" showBack={false} />

      <div className="px-4 pb-8">
        <div className="mb-6 flex items-center gap-4 rounded-4xl bg-vt-gradient p-5 text-white shadow-elevated">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
            {user?.name?.charAt(0) ?? 'V'}
          </div>
          <div>
            <h2 className="text-lg font-bold">{user?.name ?? 'Guest User'}</h2>
            <p className="text-sm text-white/80">{user?.mobile}</p>
            <p className="text-sm text-white/70">{user?.email}</p>
            {user?.address && (
              <p className="mt-1 text-xs text-white/60 line-clamp-2">{user.address}</p>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="flex w-full items-center gap-4 border-b border-slate-100 bg-vt-light-blue/40 px-4 py-4 text-left transition-colors hover:bg-vt-light-blue"
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
              className={`flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50 ${
                index < menuItems.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vt-light-blue">
                <item.icon className="h-5 w-5 text-vt-blue" />
              </div>
              <span className="flex-1 font-medium text-vt-dark">{item.label}</span>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-red-100 bg-red-50 py-4 font-semibold text-red-600 transition-colors hover:bg-red-100"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
