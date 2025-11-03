// src/firebase/products.ts - Updated with multiple images support
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
import type { Product } from '../types/product.types';
import type { ProductFormData } from '../types/admin.types';

// Convert Date to Firebase Timestamp
const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Add a new product to Firebase
export const addProductToFirebase = async (productData: ProductFormData & { images?: string[] }): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      rating: productData.rating ?? 5.0,
      images: productData.images || [productData.image], // Store images array
      createdAt: convertDateToTimestamp(new Date()),
      updatedAt: convertDateToTimestamp(new Date()),
      isActive: true,
      viewCount: 0,
      orderCount: 0
    });
    console.log('Product added to Firebase with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding product to Firebase: ', error);
    throw error;
  }
};

// Get all products from Firebase
export const getProductsFromFirebase = async (): Promise<Product[]> => {
  try {
    const productsQuery = query(
      collection(db, 'products'), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(productsQuery);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      if (data.isActive !== false) {
        products.push({
          id: doc.id, // Use Firebase document ID directly as string
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image,
          images: data.images || [data.image], // Include images array with fallback
          rating: data.rating || 5.0,
          popular: data.popular || false,
          category: data.category || 'Other',
          inStock: data.inStock ?? true
        });
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products from Firebase: ', error);
    throw error;
  }
};

// Update product in Firebase
export const updateProductInFirebase = async (
  productId: string, 
  productData: ProductFormData & { images?: string[] }
): Promise<void> => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      rating: productData.rating ?? 5.0,
      images: productData.images || [productData.image], // Update images array
      updatedAt: convertDateToTimestamp(new Date())
    });
    console.log('Product updated in Firebase');
  } catch (error) {
    console.error('Error updating product in Firebase: ', error);
    throw error;
  }
};

// Delete product from Firebase (soft delete)
export const deleteProductFromFirebase = async (productId: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      isActive: false,
      deletedAt: convertDateToTimestamp(new Date())
    });
    console.log('Product soft deleted from Firebase');
  } catch (error) {
    console.error('Error deleting product from Firebase: ', error);
    throw error;
  }
};