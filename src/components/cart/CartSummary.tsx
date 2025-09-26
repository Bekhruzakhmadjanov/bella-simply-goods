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

const formatCurrency = (amount: number): string => `${amount.toFixed(2)}`;

const CartSummary: React.FC<CartSummaryProps> = ({ 
  totals,
  onCheckout, 
  showShippingNote = true,
  freeShippingThreshold = 100,
  isLoading = false,
  checkoutButtonText = "Proceed to Checkout"
}) => {
  const { subtotal, tax, shipping, total } = totals;
  const amountForFreeShipping = freeShippingThreshold - subtotal;
  const qualifiesForFreeShipping = shipping === 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-6 border-2 border-green-100">
      <h2 className="text-2xl font-bold mb-8 flex items-center text-gray-800">
        <Gift className="mr-3 text-yellow-800" size={28} />
        Order Summary
      </h2>
      
      <div className="space-y-6">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600 text-lg">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center text-lg">
          <div className="flex items-center">
            <Truck className="mr-2 text-gray-500" size={18} />
            <span className="text-gray-600">Shipping</span>
          </div>
          <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-gray-600'}`}>
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-gray-600 text-lg">
          <span>Tax</span>
          <span className="font-semibold">{formatCurrency(tax)}</span>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-green-100 pt-6">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">Total</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-800 to-amber-900 bg-clip-text text-transparent">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Free Shipping Note */}
        {showShippingNote && !qualifiesForFreeShipping && amountForFreeShipping > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-4">
            <p className="text-amber-800 text-sm text-center font-semibold">
              <span className="block">Add {formatCurrency(amountForFreeShipping)} more</span>
              <span>for free shipping!</span>
            </p>
          </div>
        )}

        {/* Free Shipping Achievement */}
        {qualifiesForFreeShipping && showShippingNote && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4">
            <p className="text-green-800 text-sm text-center font-bold">
              You qualify for free shipping!
            </p>
          </div>
        )}

        {/* Checkout Button */}
        <Button 
          onClick={onCheckout} 
          className="w-full mt-8" 
          size="large"
          disabled={isLoading || total <= 0}
        >
          {isLoading ? 'Processing...' : checkoutButtonText}
        </Button>

        {/* Security Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Secure checkout with SSL encryption
        </p>
      </div>
    </div>
  );
};

export { CartSummary };