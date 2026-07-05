import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Shield, UserCheck, UserX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { getAdminUsers, updateUserStatus } from '../../api/admin';
import { getApiErrorMessage } from '../../api/client';
import { AdminIconButton } from '../../components/admin/AdminIconButton';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { ResponsiveTable } from '../../components/admin/ResponsiveTable';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

const PAGE_SIZE = 10;

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const userFilter = searchParams.get('filter');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

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

  const searchedUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return filteredUsers;

    return filteredUsers.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return (
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query)
      );
    });
  }, [filteredUsers, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(searchedUsers.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return searchedUsers.slice(start, start + PAGE_SIZE);
  }, [searchedUsers, page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, userFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

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
          {searchQuery.trim()
            ? `${searchedUsers.length} user(s) matching "${searchQuery.trim()}"`
            : userFilter
              ? `${filteredUsers.length} matching account(s)`
              : 'All registered customers and admins'}
        </p>
      </div>

      <div className="mb-4 flex justify-end border-b border-vt-border pb-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vt-muted" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="h-11 rounded-2xl pl-10"
            aria-label="Search users"
          />
        </div>
      </div>

      {isLoading && <p className="text-vt-muted">Loading users...</p>}
      {isError && (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">Failed to load users.</p>
      )}

      {!isLoading && !isError && searchedUsers.length === 0 ? (
        <p className="rounded-3xl bg-vt-surface p-8 text-center text-vt-muted shadow-vt-card">
          {searchQuery.trim()
            ? `No users found for "${searchQuery.trim()}".`
            : 'No users match this filter.'}
        </p>
      ) : (
        !isLoading &&
        !isError && (
          <>
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
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-vt-border last:border-0">
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
                        <AdminIconButton
                          label={user.is_active ? 'Deactivate user' : 'Activate user'}
                          icon={user.is_active ? UserX : UserCheck}
                          variant={user.is_active ? 'delete' : 'edit'}
                          disabled={statusMutation.isPending}
                          onClick={() =>
                            statusMutation.mutate({
                              userId: user.id,
                              isActive: !user.is_active,
                            })
                          }
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </ResponsiveTable>

            <AdminPagination
              className="mt-4"
              page={page}
              pageSize={PAGE_SIZE}
              totalItems={searchedUsers.length}
              onPageChange={setPage}
            />
          </>
        )
      )}

      {statusMutation.isError && (
        <p className="mt-4 text-sm text-red-500">
          {getApiErrorMessage(statusMutation.error, 'Could not update user status.')}
        </p>
      )}
    </div>
  );
}
