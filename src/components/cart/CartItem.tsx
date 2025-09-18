import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types/cart.types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, newQuantity: number) => void; // Changed from number to string
  onRemove?: (productId: string) => void; // Changed from number to string
  showRemoveButton?: boolean;
}

const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  showRemoveButton = true 
}) => (
  <div className="flex items-center py-6 border-b-2 border-green-100 last:border-b-0">
    {/* Product Image */}
    <div className="flex-shrink-0">
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-24 h-24 object-cover rounded-2xl shadow-lg border-2 border-green-100"
      />
    </div>

    {/* Product Details */}
    <div className="flex-1 ml-6">
      <h3 className="font-bold text-gray-900 text-xl">{item.name}</h3>
      <p className="text-gray-600 text-sm mt-1 font-medium">
        {formatCurrency(item.price)} each
      </p>
      {item.popular && (
        <span className="inline-block bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-xs px-3 py-1 rounded-full mt-2 font-semibold border border-red-200">
          🔥 Popular
        </span>
      )}
    </div>

    {/* Quantity Controls */}
    <div className="flex items-center space-x-4 mx-6">
      <button 
        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        disabled={item.quantity <= 1}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-red-500 text-white flex items-center justify-center hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition-all duration-200"
        aria-label="Decrease quantity"
      >
        <Minus size={18} />
      </button>
      
      <span className="w-16 text-center font-bold text-xl text-gray-800">
        {item.quantity}
      </span>
      
      <button 
        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        disabled={item.quantity >= 10}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center justify-center hover:from-green-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition-all duration-200"
        aria-label="Increase quantity"
      >
        <Plus size={18} />
      </button>
    </div>

    {/* Price and Remove */}
    <div className="flex items-center space-x-6">
      <div className="text-right">
        <div className="font-bold text-gray-900 text-xl">
          {formatCurrency(item.price * item.quantity)}
        </div>
        {item.quantity > 1 && (
          <div className="text-sm text-gray-600 font-medium">
            {item.quantity} × {formatCurrency(item.price)}
          </div>
        )}
      </div>
      
      {showRemoveButton && onRemove && (
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
          aria-label="Remove item"
        >
          <X size={22} />
        </button>
      )}
    </div>
  </div>
);

export { CartItem };