// src/firebase/products.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './config';
import type { Product } from '../types/product.types';
import type { ProductFormData } from '../types/admin.types';

// Add a new product to Firebase
export const addProductToFirebase = async (productData: ProductFormData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      rating: productData.rating ?? 5.0,
      createdAt: new Date(),
      updatedAt: new Date()
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
      products.push({
        id: parseInt(doc.id, 36), // Convert Firebase ID to number
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
    
    return products;
  } catch (error) {
    console.error('Error getting products from Firebase: ', error);
    throw error;
  }
};

// Update product in Firebase
export const updateProductInFirebase = async (productId: string, productData: ProductFormData): Promise<void> => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      rating: productData.rating ?? 5.0,
      updatedAt: new Date()
    });
    console.log('Product updated in Firebase');
  } catch (error) {
    console.error('Error updating product in Firebase: ', error);
    throw error;
  }
};

// Delete product from Firebase
export const deleteProductFromFirebase = async (productId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    console.log('Product deleted from Firebase');
  } catch (error) {
    console.error('Error deleting product from Firebase: ', error);
    throw error;
  }
};