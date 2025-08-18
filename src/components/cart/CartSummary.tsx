import React from 'react';
import { Truck, Gift } from 'lucide-react';
import type { CartTotals } from '../../types/cart.types';
import { Button } from '../common/Button';

interface CartSummaryProps {
  totals: CartTotals;
  onCheckout: () => void;
  showShippingNote?: boolean;
  freeShippingThreshold?: number;
  isLoading?: boolean;
  checkoutButtonText?: string;
}

const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

const CartSummary: React.FC<CartSummaryProps> = ({ 
  totals,
  onCheckout, 
  showShippingNote = true,
  freeShippingThreshold = 50,
  isLoading = false,
  checkoutButtonText = "Proceed to Checkout"
}) => {
  const { subtotal, tax, shipping, total } = totals;
  const amountForFreeShipping = freeShippingThreshold - subtotal;
  const qualifiesForFreeShipping = shipping === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        <Gift className="mr-2 text-amber-600" size={24} />
        Order Summary
      </h2>
      
      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Truck className="mr-1 text-gray-500" size={16} />
            <span className="text-gray-600">Shipping</span>
          </div>
          <span className={`${shipping === 0 ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Free Shipping Note */}
        {showShippingNote && !qualifiesForFreeShipping && amountForFreeShipping > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 text-sm text-center">
              <span className="font-medium">🚚 Add {formatCurrency(amountForFreeShipping)} more</span>
              <br />
              <span>for free shipping!</span>
            </p>
          </div>
        )}

        {/* Free Shipping Achievement */}
        {qualifiesForFreeShipping && showShippingNote && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm text-center font-medium">
              🎉 You qualify for free shipping!
            </p>
          </div>
        )}

        {/* Checkout Button */}
        <Button 
          onClick={onCheckout} 
          className="w-full mt-6" 
          size="large"
          disabled={isLoading || total <= 0}
        >
          {isLoading ? 'Processing...' : checkoutButtonText}
        </Button>

        {/* Security Note */}
        <p className="text-xs text-gray-500 text-center mt-2">
          🔒 Secure checkout with SSL encryption
        </p>
      </div>
    </div>
  );
};

export { CartSummary };