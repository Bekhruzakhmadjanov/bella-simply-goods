import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartIconProps {
  count: number;
  onClick: () => void;
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({ count, onClick, className = '' }) => (
  <button 
    onClick={onClick}
    className={`relative bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2 ${className}`}
  >
    <ShoppingCart size={20} />
    <span className="hidden sm:inline">Cart ({count})</span>
    <span className="sm:hidden">({count})</span>
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
        {count > 99 ? '99+' : count}
      </span>
    )}
  </button>
);

export { CartIcon };