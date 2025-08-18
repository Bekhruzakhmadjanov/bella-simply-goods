import React from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';

interface CartEmptyProps {
  onContinueShopping: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

const CartEmpty: React.FC<CartEmptyProps> = ({
  onContinueShopping,
  title = "Your cart is empty",
  subtitle = "Add some delicious Dubai chocolate to get started!",
  buttonText = "Continue Shopping"
}) => (
  <div className="text-center py-16">
    <div className="max-w-md mx-auto">
      {/* Empty Cart Icon */}
      <div className="mb-6">
        <ShoppingCart 
          size={80} 
          className="mx-auto text-gray-300 mb-4" 
          strokeWidth={1}
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="text-gray-500 mb-8 leading-relaxed">
        {subtitle}
      </p>

      {/* Continue Shopping Button */}
      <Button 
        onClick={onContinueShopping}
        size="large"
        className="inline-flex items-center"
      >
        <ArrowLeft size={20} className="mr-2" />
        {buttonText}
      </Button>

      {/* Additional Info */}
      <div className="mt-8 text-sm text-gray-400">
        <p>🍫 Fresh handmade Dubai chocolate</p>
        <p>🚚 Free shipping on orders over $50</p>
        <p>📦 Same-day processing</p>
      </div>
    </div>
  </div>
);

export { CartEmpty };