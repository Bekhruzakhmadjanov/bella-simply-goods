// src/firebase/database.ts - Cleaned up unused imports
import { 
  collection,
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  where, 
  limit,
  startAfter,
  writeBatch,
  increment,
  Timestamp,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';
import type { Product } from '../types/product.types';
import type { Order } from '../types/order.types';
import type { ProductFormData, OrderUpdateData } from '../types/admin.types';

// Utility functions
const convertTimestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Enhanced Products Service
export class ProductsService {
  private static collection = 'products';

  // Add product with analytics
  static async addProduct(productData: ProductFormData): Promise<string> {
    try {
      const batch = writeBatch(db);
      
      // Add product
      const productRef = doc(collection(db, this.collection));
      batch.set(productRef, {
        ...productData,
        rating: productData.rating ?? 5.0,
        createdAt: convertDateToTimestamp(new Date()),
        updatedAt: convertDateToTimestamp(new Date()),
        viewCount: 0,
        orderCount: 0,
        isActive: true
      });

      // Update analytics
      const analyticsRef = doc(db, 'analytics', 'products');
      batch.set(analyticsRef, {
        totalProducts: increment(1),
        lastUpdated: convertDateToTimestamp(new Date())
      }, { merge: true });

      await batch.commit();
      console.log('Product added with ID: ', productRef.id);
      return productRef.id;
    } catch (error) {
      console.error('Error adding product: ', error);
      throw error;
    }
  }

  // Get products with pagination and filtering
  static async getProducts(options?: {
    category?: string;
    inStock?: boolean;
    popular?: boolean;
    limit?: number;
    lastDoc?: DocumentSnapshot;
  }): Promise<{ products: Product[]; lastDoc?: DocumentSnapshot }> {
    try {
      let q = query(
        collection(db, this.collection),
        orderBy('createdAt', 'desc')
      );

      // Add filters
      if (options?.category) {
        q = query(q, where('category', '==', options.category));
      }
      if (options?.inStock !== undefined) {
        q = query(q, where('inStock', '==', options.inStock));
      }
      if (options?.popular !== undefined) {
        q = query(q, where('popular', '==', options.popular));
      }

      // Add pagination
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }
      if (options?.lastDoc) {
        q = query(q, startAfter(options.lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id, // Use Firebase document ID as string
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image,
          rating: data.rating,
          popular: data.popular,
          category: data.category,
          inStock: data.inStock ?? true
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { products, lastDoc };
    } catch (error) {
      console.error('Error getting products: ', error);
      throw error;
    }
  }

  // Update product with version control
  static async updateProduct(productId: string, productData: ProductFormData): Promise<void> {
    try {
      const productRef = doc(db, this.collection, productId);
      await updateDoc(productRef, {
        ...productData,
        rating: productData.rating ?? 5.0,
        updatedAt: convertDateToTimestamp(new Date()),
        version: increment(1)
      });
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product: ', error);
      throw error;
    }
  }

  // Soft delete product
  static async deleteProduct(productId: string): Promise<void> {
    try {
      const productRef = doc(db, this.collection, productId);
      await updateDoc(productRef, {
        isActive: false,
        deletedAt: convertDateToTimestamp(new Date())
      });
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product: ', error);
      throw error;
    }
  }

  // Increment product view count
  static async incrementViewCount(productId: string): Promise<void> {
    try {
      const productRef = doc(db, this.collection, productId);
      await updateDoc(productRef, {
        viewCount: increment(1),
        lastViewed: convertDateToTimestamp(new Date())
      });
    } catch (error) {
      console.error('Error incrementing view count: ', error);
    }
  }
}

// Enhanced Orders Service
export class OrdersService {
  private static collection = 'orders';

  // Add order with inventory management
  static async addOrder(order: Omit<Order, 'id'>): Promise<string> {
    try {
      const batch = writeBatch(db);
      
      // Add order
      const orderRef = doc(collection(db, this.collection));
      batch.set(orderRef, {
        ...order,
        createdAt: convertDateToTimestamp(order.createdAt),
        estimatedDelivery: order.estimatedDelivery 
          ? convertDateToTimestamp(order.estimatedDelivery) 
          : null,
        version: 1,
        isActive: true
      });

      // Update product order counts
      order.items.forEach(item => {
        const productRef = doc(db, 'products', item.id); // Use string ID directly
        batch.set(productRef, {
          orderCount: increment(item.quantity)
        }, { merge: true });
      });

      // Update analytics
      const analyticsRef = doc(db, 'analytics', 'orders');
      batch.set(analyticsRef, {
        totalOrders: increment(1),
        totalRevenue: increment(order.totals.total),
        lastUpdated: convertDateToTimestamp(new Date())
      }, { merge: true });

      await batch.commit();
      console.log('Order added with ID: ', orderRef.id);
      return orderRef.id;
    } catch (error) {
      console.error('Error adding order: ', error);
      throw error;
    }
  }

  // Get orders with advanced filtering
  static async getOrders(options?: {
    status?: string;
    customerId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    lastDoc?: DocumentSnapshot;
  }): Promise<{ orders: Order[]; lastDoc?: DocumentSnapshot }> {
    try {
      let q = query(
        collection(db, this.collection),
        orderBy('createdAt', 'desc')
      );

      // Add filters
      if (options?.status) {
        q = query(q, where('status', '==', options.status));
      }
      if (options?.customerId) {
        q = query(q, where('customerId', '==', options.customerId));
      }
      if (options?.startDate) {
        q = query(q, where('createdAt', '>=', convertDateToTimestamp(options.startDate)));
      }
      if (options?.endDate) {
        q = query(q, where('createdAt', '<=', convertDateToTimestamp(options.endDate)));
      }

      // Add pagination
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }
      if (options?.lastDoc) {
        q = query(q, startAfter(options.lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          orderNumber: data.orderNumber,
          items: data.items,
          shippingAddress: data.shippingAddress,
          totals: data.totals,
          status: data.status,
          createdAt: convertTimestampToDate(data.createdAt),
          estimatedDelivery: data.estimatedDelivery 
            ? convertTimestampToDate(data.estimatedDelivery) 
            : undefined
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      return { orders, lastDoc };
    } catch (error) {
      console.error('Error getting orders: ', error);
      throw error;
    }
  }

  // Update order with audit trail
  static async updateOrder(orderId: string, updateData: OrderUpdateData): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Update order
      const orderRef = doc(db, this.collection, orderId);
      batch.update(orderRef, {
        status: updateData.status,
        ...(updateData.trackingNumber && { trackingNumber: updateData.trackingNumber }),
        ...(updateData.notes && { notes: updateData.notes }),
        updatedAt: convertDateToTimestamp(new Date()),
        version: increment(1)
      });

      // Add to audit trail
      const auditRef = doc(collection(db, 'order_audit'));
      batch.set(auditRef, {
        orderId,
        action: 'status_update',
        newStatus: updateData.status,
        updatedBy: 'admin',
        updatedAt: convertDateToTimestamp(new Date()),
        notes: updateData.notes || ''
      });

      await batch.commit();
      console.log('Order updated successfully');
    } catch (error) {
      console.error('Error updating order: ', error);
      throw error;
    }
  }
}