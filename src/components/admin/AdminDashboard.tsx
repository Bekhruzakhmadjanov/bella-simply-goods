// components/admin/AdminDashboard.tsx
import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import type { DashboardStats, AdminUser } from '../../types/admin.types';
import type { Order } from '../../types/order.types';

interface AdminDashboardProps {
  user: AdminUser;
  stats: DashboardStats;
  onNavigateToOrders: () => void;
  onNavigateToProducts: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  stats,
  onNavigateToOrders,
  onNavigateToProducts
}) => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'placed': return <Clock className="text-orange-500" size={16} />;
      case 'processing': return <Package className="text-blue-500" size={16} />;
      case 'shipped': 
      case 'in_transit': return <TrendingUp className="text-purple-500" size={16} />;
      case 'delivered': return <CheckCircle className="text-green-500" size={16} />;
      default: return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'placed': return 'bg-orange-100 text-orange-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped':
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your store today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last login</p>
            <p className="text-lg font-semibold text-gray-900">
              {user.lastLogin.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ title, value, icon: Icon, bgColor, iconColor }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
              </div>
              <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={iconColor} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button
              onClick={onNavigateToOrders}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <ShoppingCart className="text-yellow-700" size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                  <p className="text-sm text-gray-600">View and update order status</p>
                </div>
              </div>
            </button>

            <button
              onClick={onNavigateToProducts}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <Package className="text-yellow-700" size={20} />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">Manage Products</h3>
                  <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <button
              onClick={onNavigateToOrders}
              className="text-yellow-800 hover:text-yellow-900 font-semibold text-sm"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {stats.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-600">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatCurrency(order.totals.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-xl">
          <div className="flex items-center">
            <AlertCircle className="text-orange-400" size={24} />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-orange-800">
                Low Stock Alert
              </h3>
              <p className="text-orange-700">
                {stats.lowStockProducts} product(s) are running low on stock. 
                <button 
                  onClick={onNavigateToProducts}
                  className="ml-2 font-semibold underline hover:no-underline"
                >
                  View Products
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AdminDashboard };