import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-vt-page">
      <Outlet />
    </div>
  );
}
