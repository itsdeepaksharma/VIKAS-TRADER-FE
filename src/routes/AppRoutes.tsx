import { Route, Routes } from 'react-router-dom';

import { AuthLayout } from '../layouts/AuthLayout';
import { MainLayout } from '../layouts/MainLayout';
import { CartPage } from '../pages/CartPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { ProductListingPage } from '../pages/ProductListingPage';
import { ProfilePage } from '../pages/ProfilePage';
import { WishlistPage } from '../pages/WishlistPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminRoute } from './AdminRoute';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/orders" element={<AdminOrdersPage />} />
          <Route path="admin/products" element={<AdminProductsPage />} />
          <Route path="admin/categories" element={<AdminCategoriesPage />} />
          <Route path="admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/:slug" element={<ProductListingPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
