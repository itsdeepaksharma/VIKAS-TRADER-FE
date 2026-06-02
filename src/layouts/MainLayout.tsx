import { AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import { BottomNavigation } from '../components/ecommerce/BottomNavigation';
import { NotificationBellMenu } from '../components/ecommerce/NotificationBellMenu';
import { AppBrandHeader } from '../components/layout/AppBrandHeader';
import { PageTransition } from '../components/layout/PageTransition';
import { useOrderNotifications } from '../hooks/useOrderNotifications';

const hideNavPaths = ['/login', '/checkout', '/products'];

export function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const showNav = !hideNavPaths.some((p) => location.pathname.startsWith(p));
  useOrderNotifications();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-vt-page">
      <AppBrandHeader rightSlot={isHome ? <NotificationBellMenu /> : undefined} />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname} className="flex min-h-0 flex-1 flex-col">
          <main
            className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${showNav ? 'pb-24' : 'pb-4'}`}
          >
            <div className="vt-container min-w-0">
              <Outlet />
            </div>
          </main>
        </PageTransition>
      </AnimatePresence>
      {showNav && <BottomNavigation />}
    </div>
  );
}
