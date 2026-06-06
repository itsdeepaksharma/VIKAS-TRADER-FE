import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  LayoutDashboard,
  Package,
  Shield,
  ShoppingBag,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { getAdminDashboard } from '../../api/admin';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { cn } from '../../lib/utils';

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: getAdminDashboard,
  });

  return (
    <div>
      <div className="mb-6 hidden flex-col gap-4 sm:mb-8 lg:flex lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="vt-page-title">Dashboard</h1>
          <p className="vt-page-desc">
            Store inventory, orders, and customer overview
          </p>
        </div>
        <Link
          to="/admin/orders?status=pending"
          className={cn(
            'inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-vt-gradient px-6 py-2.5 sm:w-auto sm:min-h-12',
            'text-sm font-semibold text-white shadow-soft transition-all',
            'hover:scale-[1.02] hover:shadow-elevated active:scale-[0.98]',
          )}
        >
          New Orders ({data?.new_orders ?? '…'})
        </Link>
      </div>

      {isLoading && <p className="text-vt-muted">Loading stats...</p>}
      {isError && (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
          Failed to load dashboard. Ensure you are logged in as admin.
        </p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <AdminStatCard
              title="Total Products"
              value={data.total_products}
              icon={Package}
              variant="cyan"
              to="/admin/products"
            />
            <AdminStatCard
              title="New Orders"
              value={data.new_orders}
              icon={ShoppingBag}
              variant="navy"
              to="/admin/orders?status=pending"
            />
            <AdminStatCard
              title="Out of Stock"
              value={data.out_of_stock_products}
              icon={AlertTriangle}
              variant="coral"
              to="/admin/products?stock=out"
            />
            <AdminStatCard
              title="Low Stock"
              value={data.low_stock_products}
              icon={LayoutDashboard}
              variant="amber"
              to="/admin/products?stock=low"
            />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:mt-4 sm:gap-4 xl:grid-cols-4">
            <AdminStatCard
              title="Total Users"
              value={data.total_users}
              icon={Users}
              variant="teal"
              to="/admin/users"
            />
            <AdminStatCard
              title="Active Users"
              value={data.active_users}
              icon={UserCheck}
              variant="mint"
              to="/admin/users?filter=active"
            />
            <AdminStatCard
              title="Inactive Users"
              value={data.inactive_users}
              icon={UserMinus}
              variant="slate"
              to="/admin/users?filter=inactive"
            />
            <AdminStatCard
              title="Admins"
              value={data.admin_users}
              icon={Shield}
              variant="violet"
              to="/admin/users?filter=admin"
            />
          </div>
        </>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-vt-border bg-vt-surface p-6 shadow-vt-card">
          <h2 className="font-semibold text-vt-foreground">Quick actions</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/admin/products" className="text-vt-blue hover:underline">
                Manage products & stock
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="text-vt-blue hover:underline">
                Add or remove categories
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="text-vt-blue hover:underline">
                View and update orders
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="text-vt-blue hover:underline">
                Manage customer accounts
              </Link>
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-vt-border bg-vt-gradient p-6 text-white shadow-elevated">
          <h2 className="font-semibold">Vikas Traders Admin</h2>
          <p className="mt-2 text-sm text-white/85">
            Full inventory control: categories, products, quantities, and order fulfillment from one
            panel.
          </p>
        </div>
      </div>
    </div>
  );
}
