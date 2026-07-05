export function adminPageTitle(pathname: string): string {
  if (pathname.startsWith('/admin/orders')) return 'Orders';
  if (pathname.startsWith('/admin/products')) return 'Products';
  if (pathname.startsWith('/admin/categories')) return 'Categories';
  if (pathname.startsWith('/admin/users')) return 'Users';
  if (pathname.startsWith('/admin/settings')) return 'Settings';
  return 'Dashboard';
}
