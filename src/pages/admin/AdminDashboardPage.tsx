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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vt-dark">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Store inventory, orders, and customer overview
          </p>
        </div>
        <Link
          to="/admin/orders?view=new"
          className={cn(
            'inline-flex h-12 items-center justify-center rounded-2xl bg-vt-gradient px-6',
            'text-sm font-semibold text-white shadow-soft transition-all',
            'hover:scale-[1.02] hover:shadow-elevated active:scale-[0.98]',
          )}
        >
          New Orders ({data?.new_orders ?? '…'})
        </Link>
      </div>

      {isLoading && <p className="text-slate-500">Loading stats...</p>}
      {isError && (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
          Failed to load dashboard. Ensure you are logged in as admin.
        </p>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              title="Total Products"
              value={data.total_products}
              icon={Package}
              accent="blue"
              to="/admin/products"
            />
            <AdminStatCard
              title="New Orders"
              value={data.new_orders}
              icon={ShoppingBag}
              accent="green"
              to="/admin/orders?view=new"
            />
            <AdminStatCard
              title="Out of Stock"
              value={data.out_of_stock_products}
              icon={AlertTriangle}
              accent="amber"
              to="/admin/products?stock=out"
            />
            <AdminStatCard
              title="Low Stock"
              value={data.low_stock_products}
              icon={LayoutDashboard}
              accent="slate"
              to="/admin/products?stock=low"
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              title="Total Users"
              value={data.total_users}
              icon={Users}
              accent="blue"
              to="/admin/users"
            />
            <AdminStatCard
              title="Active Users"
              value={data.active_users}
              icon={UserCheck}
              accent="green"
              to="/admin/users?filter=active"
            />
            <AdminStatCard
              title="Inactive Users"
              value={data.inactive_users}
              icon={UserMinus}
              accent="amber"
              to="/admin/users?filter=inactive"
            />
            <AdminStatCard
              title="Admins"
              value={data.admin_users}
              icon={Shield}
              accent="slate"
              to="/admin/users?filter=admin"
            />
          </div>
        </>
      )}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-vt-dark">Quick actions</h2>
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
        <div className="rounded-3xl border border-slate-100 bg-vt-gradient p-6 text-white shadow-elevated">
          <h2 className="font-semibold">Vikas Traders Admin</h2>
          <p className="mt-2 text-sm text-white/85">
            Full inventory control: categories, products, quantities, and order fulfillment from
            one panel.
          </p>
        </div>
      </div>
    </div>
  );
}
