import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shield } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getAdminUsers, updateUserStatus } from '../../api/admin';
import { getApiErrorMessage } from '../../api/client';
import { ResponsiveTable } from '../../components/admin/ResponsiveTable';
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
      <div className="mb-6 hidden sm:mb-8 lg:block">
        <h1 className="vt-page-title">{pageTitle}</h1>
        <p className="vt-page-desc">
          {userFilter
            ? `${filteredUsers.length} matching account(s)`
            : 'All registered customers and admins'}
        </p>
      </div>

      {isLoading && <p className="text-vt-muted">Loading users...</p>}
      {isError && (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">Failed to load users.</p>
      )}

      <ResponsiveTable minWidth="680px">
            <thead className="border-b border-vt-border bg-vt-surface-muted text-vt-muted">
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
                  <td className="px-4 py-3 font-medium text-vt-foreground">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-4 py-3 text-vt-muted">{user.email}</td>
                  <td className="px-4 py-3 text-vt-muted">{user.phone}</td>
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
      </ResponsiveTable>

      {statusMutation.isError && (
        <p className="mt-4 text-sm text-red-500">
          {getApiErrorMessage(statusMutation.error, 'Could not update user status.')}
        </p>
      )}
    </div>
  );
}
