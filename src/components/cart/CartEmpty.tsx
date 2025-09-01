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
  <div className="text-center py-20">
    <div className="max-w-md mx-auto">
      {/* Empty Cart Icon */}
      <div className="mb-8">
        <ShoppingCart 
          size={100} 
          className="mx-auto text-gray-300 mb-6" 
          strokeWidth={1}
        />
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-700 mb-4">
        {title}
      </h2>

      {/* Subtitle */}
      <p className="text-gray-500 mb-10 leading-relaxed text-lg">
        {subtitle}
      </p>

      {/* Continue Shopping Button */}
      <Button 
        onClick={onContinueShopping}
        size="large"
        className="inline-flex items-center"
      >
        <ArrowLeft size={20} className="mr-3" />
        {buttonText}
      </Button>

      {/* Additional Info */}
      <div className="mt-12 text-sm text-gray-400 space-y-2">
        <p>Fresh handmade Dubai chocolate</p>
        <p>Free shipping on orders over $50</p>
        <p>Same-day processing</p>
      </div>
    </div>
  </div>
);

export { CartEmpty };