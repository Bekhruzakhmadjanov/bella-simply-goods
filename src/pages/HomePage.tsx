// src/pages/HomePage.tsx
import React from 'react';
import { CheckCircle, Clock, MapPin, ArrowRight } from 'lucide-react';
import type { Product } from '../types/product.types';
import type { Route } from '../types/common.types';

// Layout Components
import { Hero } from '../components/layout/Hero';

// Product Components
import { ProductGrid } from '../components/product/ProductGrid';

// Common Components
import { Button } from '../components/common/Button';

interface HomePageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onNavigate: (route: Route | 'admin') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ products, onAddToCart, onNavigate }) => {
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
          onAddToCart={onAddToCart}
          title="Our Dubai Chocolate Collection"
        />
      </div>

      {/* About Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-16">
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-800 via-amber-800 to-yellow-900 bg-clip-text text-transparent mb-4">
              Why Choose Bella Simply Goods?
            </h3>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-800 to-amber-900 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl border-2 border-yellow-300 transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-200 to-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="text-yellow-800" size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Authentic Recipe</h4>
              <p className="text-gray-600 leading-relaxed text-lg">Made with the original Dubai chocolate recipe using traditional techniques and premium ingredients.</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl border-2 border-yellow-300 transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="text-amber-600" size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Fresh Daily</h4>
              <p className="text-gray-600 leading-relaxed text-lg">Every piece is handcrafted fresh daily in small batches to ensure maximum quality and taste.</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-xl border-2 border-yellow-300 transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="text-gray-700" size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">USA Delivery</h4>
              <p className="text-gray-600 leading-relaxed text-lg">Fast and secure shipping nationwide with temperature-controlled packaging to preserve freshness.</p>
            </div>
          </div>
          
          {/* Call to Action to Products Page */}
          <div className="mt-16">
            <p className="text-xl text-gray-700 mb-8">Want to see our complete collection?</p>
            <Button 
              onClick={() => onNavigate('products')}
              size="large"
              className="inline-flex items-center"
            >
              View All Products
              <ArrowRight className="ml-3" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Additional sections can be added here */}
      {/* Customer Reviews Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-800 to-amber-900 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-800">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The most authentic Dubai chocolate I've tasted outside of Dubai! The pistachio and kataifi combination is absolutely divine."
              </p>
              <p className="text-sm text-gray-600 font-medium">- Sarah M., New York</p>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-800">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Perfect packaging, fast delivery, and the taste is incredible! My family is obsessed with these chocolates."
              </p>
              <p className="text-sm text-gray-600 font-medium">- Michael R., California</p>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-800">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The gift set was a huge hit at our dinner party. Everyone wanted to know where to get these amazing chocolates!"
              </p>
              <p className="text-sm text-gray-600 font-medium">- Jennifer L., Texas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-yellow-800 to-amber-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay in the Sweet Loop
          </h3>
          <p className="text-xl text-yellow-100 mb-8">
            Be the first to know about new flavors, special offers, and chocolate tips!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <Button 
              variant="secondary"
              className="bg-white text-yellow-800 hover:bg-yellow-50 whitespace-nowrap"
            >
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-yellow-200 mt-4">
            No spam, just sweet updates. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};