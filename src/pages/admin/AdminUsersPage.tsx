import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getAdminUsers, updateUserStatus } from '../../api/admin';
import { getApiErrorMessage } from '../../api/client';
import { Badge } from '../../components/ui/badge';

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const userFilter = searchParams.get('filter');

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
  });

  const filteredUsers = useMemo(() => {
    switch (userFilter) {
      case 'active':
        return users.filter((u) => u.is_active);
      case 'inactive':
        return users.filter((u) => !u.is_active);
      case 'admin':
        return users.filter((u) => u.is_superuser);
      default:
        return users;
    }
  }, [users, userFilter]);

  const pageTitle =
    userFilter === 'active'
      ? 'Active Users'
      : userFilter === 'inactive'
        ? 'Inactive Users'
        : userFilter === 'admin'
          ? 'Admins'
          : 'Users';

  const statusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      updateUserStatus(userId, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-vt-dark">{pageTitle}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {userFilter
            ? `${filteredUsers.length} matching account(s)`
            : 'All registered customers and admins'}
        </p>
      </div>

      {isLoading && <p className="text-slate-500">Loading users...</p>}
      {isError && (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">Failed to load users.</p>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-vt-dark">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                  <td className="px-4 py-3">
                    {user.is_superuser ? (
                      <Badge variant="default" className="gap-1">
                        <Shield className="h-3 w-3" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="warning">Customer</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.is_active ? 'success' : 'danger'}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {!user.is_superuser && (
                      <button
                        type="button"
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            userId: user.id,
                            isActive: !user.is_active,
                          })
                        }
                        className="rounded-lg bg-vt-light-blue px-3 py-1.5 text-xs font-semibold text-vt-blue hover:bg-vt-light-mint"
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {statusMutation.isError && (
        <p className="mt-4 text-sm text-red-500">
          {getApiErrorMessage(statusMutation.error, 'Could not update user status.')}
        </p>
      )}
    </div>
  );
}
