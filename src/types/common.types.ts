// types/common.types.ts - Updated with leave-review route
export type Route = 'home' | 'products' | 'cart' | 'checkout' | 'tracking' | 'confirmation' | 'leave-review' | 'admin';

export interface State {
  code: string;
  name: string;
}