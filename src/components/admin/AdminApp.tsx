// components/admin/AdminApp.tsx
import React, { useState, useCallback } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import type { 
  AdminRoute, 
  AdminUser, 
  AdminAuth, 
  ProductFormData, 
  OrderUpdateData,
  DashboardStats 
} from '../../types/admin.types';
import type { Product } from '../../types/product.types';
import type { Order } from '../../types/order.types';

interface AdminAppProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: ProductFormData) => void;
  onUpdateProduct: (id: number, product: ProductFormData) => void;
  onDeleteProduct: (id: number) => void;
  onUpdateOrderStatus: (orderId: string, updateData: OrderUpdateData) => void;
  onBackToStore: () => void;
}

const AdminApp: React.FC<AdminAppProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onBackToStore
}) => {
  const [auth, setAuth] = useState<AdminAuth>({
    user: null,
    isAuthenticated: false,
    token: null
  });
  const [currentRoute, setCurrentRoute] = useState<AdminRoute>('admin-dashboard');

  // Mock dashboard stats calculation
  const getDashboardStats = useCallback((): DashboardStats => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => ['placed', 'processing'].includes(o.status)).length;
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + order.totals.total, 0);
    const totalProducts = products.length;
    const lowStockProducts = 0; // In a real app, you'd have stock quantities
    const recentOrders = orders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);

    return {
      totalOrders,
      pendingOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts,
      recentOrders
    };
  }, [orders, products]);

  const handleLogin = (user: AdminUser) => {
    setAuth({
      user,
      isAuthenticated: true,
      token: 'mock-jwt-token' // In real app, this would come from backend
    });
  };

  const handleLogout = () => {
    setAuth({
      user: null,
      isAuthenticated: false,
      token: null
    });
    setCurrentRoute('admin-dashboard');
  };

  const handleNavigateToOrders = () => setCurrentRoute('admin-orders');
  const handleNavigateToProducts = () => setCurrentRoute('admin-products');

  // If not authenticated, show login
  if (!auth.isAuthenticated || !auth.user) {
    return (
      <AdminLogin 
        onLogin={handleLogin}
        onBackToStore={onBackToStore}
      />
    );
  }

  // Render current admin page
  const renderCurrentPage = () => {
    // Type guard to ensure user is not null
    if (!auth.user) {
      return null;
    }

    switch (currentRoute) {
      case 'admin-dashboard':
        return (
          <AdminDashboard
            user={auth.user}
            stats={getDashboardStats()}
            onNavigateToOrders={handleNavigateToOrders}
            onNavigateToProducts={handleNavigateToProducts}
          />
        );
      case 'admin-products':
        return (
          <AdminProducts
            products={products}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        );
      case 'admin-orders':
        return (
          <AdminOrders
            orders={orders}
            onUpdateOrderStatus={onUpdateOrderStatus}
          />
        );
      case 'admin-settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account and application settings</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Settings Panel</h3>
                <p className="text-gray-500">Account settings and configuration options will be available here.</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <AdminDashboard
            user={auth.user}
            stats={getDashboardStats()}
            onNavigateToOrders={handleNavigateToOrders}
            onNavigateToProducts={handleNavigateToProducts}
          />
        );
    }
  };

  return (
    <AdminLayout
      currentRoute={currentRoute}
      user={auth.user}
      onNavigate={setCurrentRoute}
      onLogout={handleLogout}
      onBackToStore={onBackToStore}
    >
      {renderCurrentPage()}
    </AdminLayout>
  );
};

export { AdminApp };