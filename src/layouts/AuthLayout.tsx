import { Outlet } from 'react-router-dom';

import { DemoModeBanner } from '../components/demo/DemoModeBanner';

export function AuthLayout() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-vt-page">
      <DemoModeBanner />
      <Outlet />
    </div>
  );
}
