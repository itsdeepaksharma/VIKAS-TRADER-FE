import { AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import { BottomNavigation } from '../components/ecommerce/BottomNavigation';
import { PageTransition } from '../components/layout/PageTransition';

const hideNavPaths = ['/login', '/checkout'];

export function MainLayout() {
  const location = useLocation();
  const showNav = !hideNavPaths.some((p) => location.pathname.startsWith(p));

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <main className={showNav ? 'pb-24' : ''}>
            <div className="mx-auto min-h-screen max-w-lg md:max-w-2xl lg:max-w-4xl">
              <Outlet />
            </div>
          </main>
        </PageTransition>
      </AnimatePresence>
      {showNav && <BottomNavigation />}
    </div>
  );
}
