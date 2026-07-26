import { motion } from 'framer-motion';
import { Grid3X3, Heart, Home, ShoppingCart, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/categories', icon: Grid3X3, label: 'Categories' },
  { to: '/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNavigation() {
  const cartCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.itemCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-vt-border bg-vt-surface/95 px-2 pb-safe pt-2 shadow-vt-card backdrop-blur-lg">
      <div className="vt-container flex items-center justify-around !px-2 sm:!px-5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 transition-colors',
                  isActive ? 'text-vt-blue' : 'text-vt-muted',
                )}
              >
                <div className="relative">
                  <Icon className={cn('h-6 w-6', isActive && 'stroke-[2.5]')} />
                  {label === 'Cart' && cartCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-vt-gradient px-1 text-[10px] font-bold text-white">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                  {label === 'Wishlist' && wishlistCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-0.5 h-0.5 w-8 rounded-full bg-vt-blue"
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
