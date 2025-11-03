// src/pages/HomePage.tsx
import React from 'react';
import { CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import type { Product } from '../types/product.types';
import type { Route } from '../types/common.types';
import type { CartItem } from '../types/cart.types';

// Layout Components
import { Hero } from '../components/layout/Hero';

// Product Components
import { ProductGrid } from '../components/product/ProductGrid';

// Common Components
import { Button } from '../components/common/Button';

interface HomePageProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onNavigate: (route: Route | 'admin', productId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, cart, onAddToCart, onUpdateQuantity, onNavigate }) => {
  // Use featured products from Firebase data or fallback
  const featuredProducts = products.length > 0 
    ? products.filter(p => p.popular).slice(0, 4)
    : [];

  return (
    <div>
      <Hero 
        title="Authentic Dubai Chocolate"
        subtitle="Experience the viral sensation that took the world by storm. Handcrafted with premium pistachios, crispy kataifi, and the finest chocolate - delivered fresh to your doorstep across the USA."
        onGetStarted={() => {
          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
      
      <div id="products">
        <ProductGrid 
          products={featuredProducts}
          cart={cart}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
          onViewDetails={(productId) => onNavigate('product-detail', productId)}
          title="Our Dubai Chocolate Collection"
        />
      </div>

      {/* About Section - Updated with Knafeh Green Colors */}
      <section className="py-24 px-6 bg-gradient-to-r from-amber-50 via-green-50 to-emerald-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-16">
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-700 via-green-700 to-emerald-800 bg-clip-text text-transparent mb-4">
              Why Choose Bella Simply Goods?
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 via-green-600 to-emerald-700 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border-2 border-green-200 transform hover:scale-105 transition-all duration-300 hover:border-green-300 hover:shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-200 via-green-200 to-emerald-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="text-green-700" size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-800 to-green-800 bg-clip-text text-transparent">Authentic Recipe</h4>
              <p className="text-gray-700 leading-relaxed text-lg">Made with the original Dubai chocolate recipe using traditional techniques and premium ingredients.</p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl border-2 border-emerald-200 transform hover:scale-105 transition-all duration-300 hover:border-emerald-300 hover:shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-green-200 via-emerald-200 to-teal-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="text-emerald-700" size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent">Fresh Daily</h4>
              <p className="text-gray-700 leading-relaxed text-lg">Every piece is handcrafted fresh daily in small batches to ensure maximum quality and taste.</p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-white to-teal-50 rounded-2xl shadow-xl border-2 border-teal-200 transform hover:scale-105 transition-all duration-300 hover:border-teal-300 hover:shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-200 via-teal-200 to-green-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="text-teal-700" size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-800 to-teal-800 bg-clip-text text-transparent">USA Delivery</h4>
              <p className="text-gray-700 leading-relaxed text-lg">Fast and secure shipping nationwide with temperature-controlled packaging to preserve freshness.</p>
            </div>
          </div>
          
          {/* Stats Section - Moved from Hero */}
          <div className="mt-20 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-green-100 shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                    10K+
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  Happy Customers
                </p>
              </div>
              
              <div className="text-center p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-green-100 shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 bg-clip-text text-transparent">
                    4.9
                  </span>
                  <svg className="ml-2 w-7 h-7 text-amber-400 drop-shadow-sm fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  Average Rating
                </p>
              </div>
              
              <div className="text-center p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-green-100 shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 via-green-600 to-emerald-700 bg-clip-text text-transparent">
                    48hrs
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  Fresh Delivery
                </p>
              </div>
            </div>
          </div>
          
          {/* Call to Action to Products Page */}
          <div className="mt-16">
            <p className="text-xl text-gray-700 mb-8">Want to see our complete collection?</p>
            <Button 
              onClick={() => onNavigate('products')}
              size="large"
              className="inline-flex items-center bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:via-teal-600 hover:to-green-700"
            >
              View All Products
              <ArrowRight className="ml-3" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-700 via-emerald-800 to-teal-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay in the Sweet Loop
          </h3>
          <p className="text-xl text-green-100 mb-8">
            Be the first to know about new flavors, special offers, and chocolate tips!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-300 text-gray-900"
            />
            <Button 
              variant="secondary"
              size="medium"
              className="whitespace-nowrap bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:via-teal-600 hover:to-green-700"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-green-200 mt-4">
            No spam, just sweet updates. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};