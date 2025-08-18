import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types/cart.types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemove?: (productId: number) => void;
  showRemoveButton?: boolean;
}

const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  showRemoveButton = true 
}) => (
  <div className="flex items-center py-4 border-b border-gray-200 last:border-b-0">
    {/* Product Image */}
    <div className="flex-shrink-0">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-20 h-20 object-cover rounded-lg"
      />
    </div>

    {/* Product Details */}
    <div className="flex-1 ml-4">
      <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
      <p className="text-gray-600 text-sm mt-1">
        {formatCurrency(item.price)} each
      </p>
      {item.popular && (
        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-2">
          Popular
        </span>
      )}
    </div>

    {/* Quantity Controls */}
    <div className="flex items-center space-x-3 mx-4">
      <button 
        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      
      <span className="w-12 text-center font-medium text-lg">
        {item.quantity}
      </span>
      
      <button 
        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        disabled={item.quantity >= 10}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>

    {/* Price and Remove */}
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <div className="font-semibold text-gray-900 text-lg">
          {formatCurrency(item.price * item.quantity)}
        </div>
        {item.quantity > 1 && (
          <div className="text-sm text-gray-500">
            {item.quantity} × {formatCurrency(item.price)}
          </div>
        )}
      </div>
      
      {showRemoveButton && onRemove && (
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Remove item"
        >
          <X size={20} />
        </button>
      )}
    </div>
  </div>
);

export { CartItem };