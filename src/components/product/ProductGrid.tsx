import React from 'react';
import type { Product } from '../../types/product.types';
import { Button } from '../common/Button';  // Add this import

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  title?: string;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart, 
  title,
  className = ''
}) => (
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
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-green-100 transform hover:-translate-y-1 flex flex-col h-full">
              <div className="relative overflow-hidden">
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
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem] leading-6">{product.name}</h4>
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
                    <Button 
                      onClick={() => onAddToCart(product)}
                      disabled={!product.inStock}
                      variant={product.inStock ? 'primary' : 'secondary'}
                      size="small"
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

export { ProductGrid };