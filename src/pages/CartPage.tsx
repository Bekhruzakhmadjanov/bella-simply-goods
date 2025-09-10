// src/pages/CartPage.tsx
import React from 'react';
import type { CartItem, CartTotals } from '../types/cart.types';
import type { Route } from '../types/common.types';

// Layout Components
import { Breadcrumb } from '../components/layout/Breadcrumb';

// Cart Components
import { CartItem as CartItemComponent } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { CartEmpty } from '../components/cart/CartEmpty';

interface CartPageProps {
  cart: CartItem[];
  totals: CartTotals;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onNavigate: (route: Route | 'admin') => void;
}

export const CartPage: React.FC<CartPageProps> = ({ 
  cart, 
  totals, 
  onUpdateQuantity, 
  onRemoveItem, 
  onNavigate 
}) => (
  <div className="min-h-screen bg-gray-50">
    <Breadcrumb 
      items={[{ label: 'Shopping Cart', isActive: true }]}
      onNavigate={onNavigate}
    />
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {cart.length === 0 ? (
        <CartEmpty onContinueShopping={() => onNavigate('home')} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-medium mb-6 text-gray-900">Cart Items ({cart.length})</h2>
              {cart.map(item => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <CartSummary 
              totals={totals}
              onCheckout={() => onNavigate('checkout')}
              showShippingNote
            />
          </div>
        </div>
      )}
    </div>
  </div>
);