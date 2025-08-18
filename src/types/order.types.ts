import type { CartItem, CartTotals } from './cart.types';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  totals: CartTotals;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery?: Date;
}

export type OrderStatus = 
  | 'placed'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';