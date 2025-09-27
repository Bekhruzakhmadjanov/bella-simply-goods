// src/constants/routes.ts - Updated with leave-review route
import type { Route } from '../types/common.types';

export const ROUTES: Record<string, Route> = {
  HOME: 'home',
  PRODUCTS: 'products',
  CART: 'cart',
  CHECKOUT: 'checkout',
  TRACKING: 'tracking',
  CONFIRMATION: 'confirmation',
  LEAVE_REVIEW: 'leave-review', // Add this new route
} as const;