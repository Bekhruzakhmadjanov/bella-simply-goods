// src/firebase/orders.ts - Updated to work with new backend
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { Order } from '../types/order.types';
import type { OrderUpdateData } from '../types/admin.types';

// Convert Firebase Timestamp to Date
const convertTimestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Convert Date to Firebase Timestamp
const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Add a new order to Firebase
export const addOrderToFirebase = async (order: Omit<Order, 'id'>): Promise<string> => {
  try {
    const orderData = {
      ...order,
      createdAt: convertDateToTimestamp(order.createdAt),
      estimatedDelivery: order.estimatedDelivery 
        ? convertDateToTimestamp(order.estimatedDelivery) 
        : null,
      isActive: true,
      version: 1
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);
    console.log('Order added to Firebase with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding order to Firebase: ', error);
    throw error;
  }
};

// Get all orders from Firebase
export const getOrdersFromFirebase = async (): Promise<Order[]> => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(ordersQuery);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Only include active orders (or orders without isActive field for backward compatibility)
      if (data.isActive !== false) {
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
      }
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders from Firebase: ', error);
    throw error;
  }
};

// Update order status in Firebase
export const updateOrderInFirebase = async (orderId: string, updateData: OrderUpdateData): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: updateData.status,
      ...(updateData.trackingNumber && { trackingNumber: updateData.trackingNumber }),
      ...(updateData.notes && { notes: updateData.notes }),
      updatedAt: convertDateToTimestamp(new Date())
    });
    console.log('Order updated in Firebase');
  } catch (error) {
    console.error('Error updating order in Firebase: ', error);
    throw error;
  }
};