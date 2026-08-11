import { AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import { BottomNavigation } from '../components/ecommerce/BottomNavigation';
import { PageTransition } from '../components/layout/PageTransition';
import { useOrderNotifications } from '../hooks/useOrderNotifications';

const hideNavPaths = ['/login'];

export function MainLayout() {
  const location = useLocation();
  const showNav = !hideNavPaths.some((p) => location.pathname.startsWith(p));
  useOrderNotifications();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-vt-page">
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname} className="flex min-h-0 flex-1 flex-col">
          <main
            className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${showNav ? 'pb-24' : 'pb-4'}`}
          >
            <div className="vt-container min-w-0 space-y-4 pb-4 pt-4">
              <Outlet />
            </div>
          </main>
        </PageTransition>
      </AnimatePresence>
      {showNav && <BottomNavigation />}
    </div>
  );
}
