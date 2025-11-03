// src/types/common.types.ts
export type Route = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'tracking' 
  | 'confirmation' 
  | 'leave-review' 
  | 'privacy-policy' 
  | 'return-policy' 
  | 'admin';

export interface State {
  code: string;
  name: string;
}