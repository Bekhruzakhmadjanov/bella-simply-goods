import type { Route } from '../types/common.types';

export const ROUTES: Record<string, Route> = {
  HOME: 'home',
  CART: 'cart',
  CHECKOUT: 'checkout',
  TRACKING: 'tracking',
  CONFIRMATION: 'confirmation',
} as const;