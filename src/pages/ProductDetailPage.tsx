// src/pages/ProductDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Zap, Star, MessageSquare } from 'lucide-react';
import type { Product } from '../types/product.types';
import type { Route } from '../types/common.types';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Button } from '../components/common/Button';
import { StarRating } from '../components/product/StarRating';
import { usePublishedReviews } from '../hooks/useReviews';

interface ProductDetailPageProps {
  productId: string | null;
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onNavigate: (route: Route | 'admin') => void;
  onBuyNow?: (product: Product, quantity: number) => void;
}

const formatCurrency = (amount: number): string => `$${amount.toFixed(2)}`;

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  products,
  onAddToCart,
  onNavigate,
  onBuyNow
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { reviews, loading: reviewsLoading } = usePublishedReviews(10);

  // Find the product
  const product = products.find(p => p.id === productId);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb 
          items={[
            { label: 'Products', route: 'products' },
            { label: 'Product Not Found', isActive: true }
          ]}
          onNavigate={onNavigate}
        />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Button onClick={() => onNavigate('products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

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
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product, quantity);
    } else {
      onAddToCart(product, quantity);
      onNavigate('checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Products', route: 'products' },
          { label: product.name, isActive: true }
        ]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center text-yellow-800 hover:text-yellow-900 mb-6 font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative mb-4 bg-white rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={productImages[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
              {product.popular && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  🔥 Popular Choice
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative rounded-xl overflow-hidden border-3 transition-all transform hover:scale-105 ${
                      selectedImageIndex === index 
                        ? 'border-yellow-800 ring-4 ring-yellow-300 shadow-lg' 
                        : 'border-gray-200 hover:border-yellow-600'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <div className="inline-block bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-semibold">
                {product.category}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <StarRating rating={product.rating} size={24} />
              <span className="text-gray-600">
                ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-yellow-800">
                {formatCurrency(product.price)}
              </span>
              <span className="text-gray-500 text-lg">per bar</span>
            </div>

            {/* Description */}
            <div className="prose prose-lg">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Features/Benefits */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <Star className="text-amber-500 mr-2" size={20} />
                Product Highlights
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Handcrafted with premium ingredients
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Made fresh daily in small batches
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Authentic Dubai chocolate recipe
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Free shipping on orders over $100
                </li>
              </ul>
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-gray-900">Quantity:</span>
                  <div className="flex items-center border-2 border-yellow-700 rounded-xl">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-4 py-3 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-xl font-bold">−</span>
                    </button>
                    <span className="px-8 py-3 border-x-2 border-yellow-700 min-w-[80px] text-center text-xl font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 10}
                      className="px-4 py-3 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleAddToCart}
                    size="large"
                    className="w-full flex items-center justify-center text-lg"
                  >
                    <ShoppingCart size={20} className="mr-2" />
                    Add {quantity} to Cart - {formatCurrency(product.price * quantity)}
                  </Button>
                  
                  <Button 
                    onClick={handleBuyNow}
                    variant="secondary"
                    size="large"
                    className="w-full flex items-center justify-center text-lg"
                  >
                    <Zap size={20} className="mr-2" />
                    Buy Now
                  </Button>
                </div>

                {/* Stock Indicator */}
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">In Stock - Ships within 1-2 business days</span>
                </div>
              </div>
            )}

            {!product.inStock && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-800 font-semibold text-lg">
                  Currently Out of Stock
                </p>
                <p className="text-red-600 text-sm mt-2">
                  Check back soon or explore our other products
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="mr-3 text-yellow-800" size={32} />
              Customer Reviews
            </h2>
            <Button 
              onClick={() => onNavigate('leave-review')}
              variant="outline"
            >
              Write a Review
            </Button>
          </div>

          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-800 mx-auto"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{review.customerName}</h4>
                      <StarRating rating={review.overallRating} size={16} showNumber={false} />
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
                  {review.wouldRecommend && (
                    <div className="mt-2 inline-flex items-center text-green-700 text-sm font-medium">
                      ✓ Recommends this product
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-600 mb-4">No reviews yet. Be the first to review this product!</p>
              <Button onClick={() => onNavigate('leave-review')}>
                Write First Review
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};