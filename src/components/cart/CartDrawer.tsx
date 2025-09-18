import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import type { CartItem as CartItemType, CartTotals } from '../../types/cart.types';
import { CartItem } from './CartItem';
import { CartEmpty } from './CartEmpty';
import { Button } from '../common/Button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItemType[];
  totals: CartTotals;
  onUpdateQuantity: (productId: string, newQuantity: number) => void; // Changed from number to string
  onRemoveItem: (productId: string) => void; // Changed from number to string
  onCheckout: () => void;
  onContinueShopping: () => void;
}

const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totals,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping
}) => {
  if (!isOpen) return null;

  const handleCheckout = () => {
    onCheckout();
    onClose();
  };

  const handleContinueShopping = () => {
    onContinueShopping();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <ShoppingBag className="mr-2 text-amber-600" size={24} />
            <h2 className="text-lg font-semibold">
              Shopping Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <CartEmpty 
                onContinueShopping={handleContinueShopping}
                title="Your cart is empty"
                subtitle="Browse our delicious Dubai chocolate collection!"
                buttonText="Start Shopping"
              />
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {items.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemove={onRemoveItem}
                      showRemoveButton
                    />
                  ))}
                </div>
              </div>

              {/* Footer with Totals and Checkout */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                {/* Quick Totals */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    onClick={handleCheckout}
                    className="w-full"
                    size="large"
                  >
                    Checkout - {formatCurrency(totals.total)}
                  </Button>
                  <Button 
                    onClick={handleContinueShopping}
                    variant="outline"
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export { CartDrawer };