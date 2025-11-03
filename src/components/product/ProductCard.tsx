import React from 'react';
import type { Product } from '../../types/product.types';
import { StarRating } from './StarRating';
import { Button } from '../common/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails?: (productId: string) => void;
}

const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-green-100 transform hover:-translate-y-1">
    {/* Image - Clickable */}
    <div 
      className="relative overflow-hidden cursor-pointer"
      onClick={() => onViewDetails?.(product.id)}
    >
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {product.popular && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
          🔥 Popular
        </div>
      )}
      {!product.inStock && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
            Out of Stock
          </span>
        </div>
      )}
    </div>
    
    <div className="p-6">
      {/* Title - Clickable */}
      <h4 
        className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] leading-6 cursor-pointer hover:text-yellow-800 transition-colors"
        onClick={() => onViewDetails?.(product.id)}
      >
        {product.name}
      </h4>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
        {product.description}
      </p>
      
      <StarRating rating={product.rating} />
      
      <div className="flex items-center justify-between mt-6">
        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-800 to-amber-900 bg-clip-text text-transparent">
          {formatCurrency(product.price)}
        </span>
        
        <div className="flex gap-2">
          {onViewDetails && (
            <Button 
              onClick={() => onViewDetails(product.id)}
              variant="outline"
              size="small"
            >
              View
            </Button>
          )}
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={!product.inStock}
            variant={product.inStock ? 'primary' : 'secondary'}
            size="small"
          >
            {product.inStock ? 'Add' : 'Out'}
          </Button>
        </div>
      </div>
    </div>
  </div>
);

export { ProductCard };