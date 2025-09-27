// components/admin/AdminLayout.tsx - Complete with Reviews section
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Mail,
  MessageSquare,
  Settings, 
  LogOut, 
  Menu, 
  X,
  Store,
  Shield
} from 'lucide-react';
import type { AdminRoute, AdminUser } from '../../types/admin.types';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentRoute: AdminRoute;
  user: AdminUser;
  onNavigate: (route: AdminRoute) => void;
  onLogout: () => void;
  onBackToStore: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentRoute,
  user,
  onNavigate,
  onLogout,
  onBackToStore
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { route: 'admin-dashboard' as AdminRoute, label: 'Dashboard', icon: LayoutDashboard },
    { route: 'admin-products' as AdminRoute, label: 'Products', icon: Package },
    { route: 'admin-orders' as AdminRoute, label: 'Orders', icon: ShoppingCart },
    { route: 'admin-reviews' as AdminRoute, label: 'Reviews', icon: MessageSquare },
    { route: 'admin-feedback' as AdminRoute, label: 'Email Feedback', icon: Mail },
    { route: 'admin-settings' as AdminRoute, label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (route: AdminRoute) => {
    onNavigate(route);
    setSidebarOpen(false);
  };

  const isActiveRoute = (route: AdminRoute) => currentRoute === route;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 w-64 lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-800 to-amber-900 rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-600">Bella Simply Goods</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map(({ route, label, icon: Icon }) => (
            <button
              key={route}
              onClick={() => handleNavigate(route)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                isActiveRoute(route)
                  ? 'bg-yellow-100 text-yellow-900 border border-yellow-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} className="mr-3" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={onBackToStore}
              className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Store size={16} className="mr-2" />
              <span className="text-sm">Back to Store</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{user.name}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export { AdminLayout };