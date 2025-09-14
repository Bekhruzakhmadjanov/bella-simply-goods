// src/types/product.types.ts - Updated to use string IDs consistently

export interface Product {
  id: string; // Changed from number to string for Firebase compatibility
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  popular: boolean;
  category: string;
  inStock: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  popular?: boolean;
  rating?: number;
}