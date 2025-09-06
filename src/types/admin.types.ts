// types/admin.types.ts
import type { Order } from './order.types';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  lastLogin: Date;
}

export interface AdminAuth {
  user: AdminUser | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  popular: boolean;
  rating?: number; // Optional since we can default to 5.0
}

export interface OrderUpdateData {
  status: 'placed' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  recentOrders: Order[];
}

export type AdminRoute = 
  | 'admin-login'
  | 'admin-dashboard' 
  | 'admin-products' 
  | 'admin-orders' 
  | 'admin-settings';

export interface AdminNavItem {
  route: AdminRoute;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export interface ProductFilters {
  category: string;
  inStock: boolean | null;
  popular: boolean | null;
  priceRange: { min: number; max: number } | null;
}

export interface OrderFilters {
  status: string;
  dateRange: { start: Date; end: Date } | null;
  customer: string;
}