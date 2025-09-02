export type Route = 'home' | 'products' | 'cart' | 'checkout' | 'tracking' | 'confirmation';

export interface State {
  code: string;
  name: string;
}