import React, { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { Product } from '../../types/product.types';
import { StarRating } from './StarRating';
import { Button } from '../common/Button';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onClose?: () => void;
}

const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  onAddToCart, 
  onClose 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Use images array if available, otherwise fallback to single image
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="relative mb-4">
            <img 
              src={productImages[selectedImageIndex]} 
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.popular && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-yellow-800 ring-2 ring-yellow-300' 
                      : 'border-gray-200 hover:border-yellow-600'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {onClose && (
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {product.category && (
              <p className="text-amber-600 font-medium mb-2">{product.category}</p>
            )}

            <StarRating rating={product.rating} size={20} />

            <p className="text-gray-600 mt-4 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          {product.inStock && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                size="large"
                className="w-full"
              >
                Add {quantity} to Cart - {formatCurrency(product.price * quantity)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProductDetails };