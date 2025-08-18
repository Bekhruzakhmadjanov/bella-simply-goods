import React from 'react';
import type { Product } from '../../types/product.types';
import { StarRating } from './StarRating';
import { Button } from '../common/Button';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const formatCurrency = (amount: number): string => `${amount.toFixed(2)}`;

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
    <div className="relative">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {product.popular && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Popular
        </div>
      )}
      {!product.inStock && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
            Out of Stock
          </span>
        </div>
      )}
    </div>
    <div className="p-6">
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h4>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
      <StarRating rating={product.rating} />
      <div className="flex items-center justify-between mt-4">
        <span className="text-2xl font-bold text-gray-900">
          {formatCurrency(product.price)}
        </span>
        <Button 
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          variant={product.inStock ? 'primary' : 'secondary'}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  </div>
);

export { ProductCard };