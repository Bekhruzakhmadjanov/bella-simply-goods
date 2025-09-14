// src/hooks/useFirebaseData.ts - Fixed to use string IDs consistently
import { useState, useEffect, useCallback } from 'react';
import { ProductsService, OrdersService } from '../firebase/database';
import { sendOrderConfirmationEmail } from '../services/emailService';
import type { Product } from '../types/product.types';
import type { Order } from '../types/order.types';
import type { ProductFormData, OrderUpdateData } from '../types/admin.types';

// Enhanced Product Hook
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (filters?: {
    category?: string;
    inStock?: boolean;
    popular?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const { products: fetchedProducts } = await ProductsService.getProducts(filters);
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (productData: ProductFormData) => {
    try {
      const newProductId = await ProductsService.addProduct(productData);
      await loadProducts(); // Reload to get the latest data
      return newProductId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  }, [loadProducts]);

  const updateProduct = useCallback(async (id: string, productData: ProductFormData) => {
    try {
      await ProductsService.updateProduct(id, productData);
      await loadProducts(); // Reload to get the latest data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  }, [loadProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await ProductsService.deleteProduct(id);
      await loadProducts(); // Reload to get the latest data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  }, [loadProducts]);

  const incrementProductView = useCallback(async (id: string) => {
    try {
      await ProductsService.incrementViewCount(id);
    } catch (err) {
      console.error('Error incrementing product view:', err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    incrementProductView
  };
};

// Enhanced Orders Hook
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async (filters?: {
    status?: string;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const { orders: fetchedOrders } = await OrdersService.getOrders(filters);
      setOrders(fetchedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addOrder = useCallback(async (order: Omit<Order, 'id'>) => {
    try {
      const newOrderId = await OrdersService.addOrder(order);
      
      // Send confirmation email
      const fullOrder = { ...order, id: newOrderId };
      try {
        await sendOrderConfirmationEmail(fullOrder);
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError);
      }
      
      await loadOrders(); // Reload to get the latest data
      return newOrderId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
      throw err;
    }
  }, [loadOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, updateData: OrderUpdateData) => {
    try {
      await OrdersService.updateOrder(orderId, updateData);
      await loadOrders(); // Reload to get the latest data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
      throw err;
    }
  }, [loadOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    orders,
    loading,
    error,
    loadOrders,
    addOrder,
    updateOrderStatus
  };
};