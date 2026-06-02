import { Outlet } from 'react-router-dom';

import { AppBrandHeader } from '../components/layout/AppBrandHeader';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-vt-beige-light">
      <AppBrandHeader homeTo="/login" />
      <Outlet />
    </div>
  );
}
