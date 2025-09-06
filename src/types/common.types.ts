// types/common.types.ts - Updated with admin route
export type Route = 'home' | 'products' | 'cart' | 'checkout' | 'tracking' | 'confirmation' | 'admin';

export interface State {
  code: string;
  name: string;
}