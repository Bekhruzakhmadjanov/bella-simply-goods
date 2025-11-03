import React from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Product } from '../../types/product.types';
import type { CartItem } from '../../types/cart.types';
import { Button } from '../common/Button';

interface ProductGridProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onViewDetails?: (productId: string) => void;
  title?: string;
  className?: string;
}

// Quantity Control Component
const QuantityControl: React.FC<{
  product: Product;
  currentQuantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
}> = ({ product, currentQuantity, onAddToCart, onUpdateQuantity }) => {
  if (currentQuantity === 0) {
    // Show Add to Cart button when not in cart
    return (
      <Button 
        onClick={() => onAddToCart(product)}
        disabled={!product.inStock}
        variant={product.inStock ? 'primary' : 'secondary'}
        size="small"
      >
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    );
  }

  // Show quantity controls when item is in cart
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => onUpdateQuantity(product.id, currentQuantity - 1)}
        className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-red-500 text-white flex items-center justify-center hover:from-red-500 hover:to-red-600 shadow-lg transform hover:scale-105 transition-all duration-200"
        aria-label="Decrease quantity"
        title={currentQuantity === 1 ? "Remove from cart" : "Decrease quantity"}
      >
        <Minus size={14} />
      </button>
      
      <span className="w-8 text-center font-bold text-lg text-gray-800">
        {currentQuantity}
      </span>
      
      <button 
        onClick={() => onUpdateQuantity(product.id, currentQuantity + 1)}
        disabled={currentQuantity >= 10}
        className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center justify-center hover:from-green-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-105 transition-all duration-200"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  cart,
  onAddToCart, 
  onUpdateQuantity,
  onViewDetails,
  title,
  className = ''
}) => {
  // Helper function to get current quantity for a product
  const getProductQuantity = (productId: string): number => {
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <section className={`py-20 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-800 via-amber-800 to-yellow-900 bg-clip-text text-transparent mb-4">
              {title}
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-800 to-amber-900 mx-auto rounded-full" />
          </div>
        )}
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => {
              const currentQuantity = getProductQuantity(product.id);
              
              return (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-green-100 transform hover:-translate-y-1 flex flex-col h-full">
                  {/* Make image clickable */}
                  <div 
                    className="relative overflow-hidden cursor-pointer"
                    onClick={() => onViewDetails?.(product.id)}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {product.popular && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        Popular
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {/* Show quantity badge if item is in cart */}
                    {currentQuantity > 0 && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        {currentQuantity} in cart
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    {/* Make title clickable */}
                    <h4 
                      className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] leading-6 cursor-pointer hover:text-yellow-800 transition-colors"
                      onClick={() => onViewDetails?.(product.id)}
                    >
                      {product.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 flex-1">{product.description}</p>
                    <div className="mt-auto">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) 
                                ? 'text-amber-400 fill-current drop-shadow-sm' 
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600 font-medium">({product.rating})</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-800 to-amber-900 bg-clip-text text-transparent">
                          ${product.price.toFixed(2)}
                        </span>
                        <QuantityControl
                          product={product}
                          currentQuantity={currentQuantity}
                          onAddToCart={onAddToCart}
                          onUpdateQuantity={onUpdateQuantity}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export { ProductGrid };