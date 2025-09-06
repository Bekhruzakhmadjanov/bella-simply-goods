import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, MapPin, Package, Truck, Home as HomeIcon, Filter, ArrowRight } from 'lucide-react';

// Types
import type { Route as AppRoute } from './types/common.types';
import type { Product } from './types/product.types';
import type { CartItem, CartTotals } from './types/cart.types';
import type { Order, ShippingAddress, OrderStatus } from './types/order.types';
import type { ProductFormData, OrderUpdateData } from './types/admin.types';

// Constants and Data
import { US_STATES } from './data/states';
import { ALL_PRODUCTS, FEATURED_PRODUCTS } from './data/products';

// Utils and Hooks
import { formatCurrency, generateOrderNumber } from './utils/calculations';
import { useCart } from './hooks/useCart';
import { useFormValidation } from './hooks/useFormValidation';

// Layout Components
import { Layout } from './components/layout/Layout';
import { Hero } from './components/layout/Hero';
import { Breadcrumb } from './components/layout/Breadcrumb';

// Common Components
import { Button } from './components/common/Button';
import { Input } from './components/common/Input';
import { Select } from './components/common/Select';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Product Components
import { ProductGrid } from './components/product/ProductGrid';

// Cart Components
import { CartItem as CartItemComponent } from './components/cart/CartItem';
import { CartSummary } from './components/cart/CartSummary';
import { CartEmpty } from './components/cart/CartEmpty';

// Admin Components
import { AdminApp } from './components/admin/AdminApp';

// Navigation hook that syncs with router
const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = useCallback((route: AppRoute | 'admin') => {
    const pathMap = {
      home: '/',
      products: '/products',
      cart: '/cart',
      checkout: '/checkout',
      tracking: '/tracking',
      confirmation: '/confirmation',
      admin: '/admin'
    };
    navigate(pathMap[route] || '/');
  }, [navigate]);

  const getCurrentRoute = (): AppRoute | 'admin' => {
    const routeMap: Record<string, AppRoute | 'admin'> = {
      '/': 'home',
      '/products': 'products',
      '/cart': 'cart',
      '/checkout': 'checkout',
      '/tracking': 'tracking',
      '/confirmation': 'confirmation',
      '/admin': 'admin'
    };
    return routeMap[location.pathname] || 'home';
  };

  return { navigateTo, currentRoute: getCurrentRoute() };
};

// Page Components
const HomePage: React.FC<{ 
  onAddToCart: (product: Product) => void;
  onNavigate: (route: AppRoute | 'admin') => void;
}> = ({ onAddToCart, onNavigate }) => (
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
        products={FEATURED_PRODUCTS}
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
  </div>
);

const ProductsPage: React.FC<{
  products: Product[];
  onAddToCart: (product: Product) => void;
  onNavigate: (route: AppRoute | 'admin') => void;
}> = ({ products, onAddToCart, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen">
      <Breadcrumb 
        items={[{ label: 'All Products', isActive: true }]}
        onNavigate={onNavigate}
      />

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-800 via-amber-800 to-yellow-900 bg-clip-text text-transparent mb-6">
            All Products
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Discover our complete collection of authentic Dubai chocolate creations, 
            from classic bars to gift sets and specialty fillings.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-800 to-amber-900 mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* Filters and Sort Section */}
      <section className="py-4 px-6 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            
            {/* Filter Row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-3 flex-shrink-0">
                <Filter className="text-yellow-800" size={20} />
                <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">Filter by:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-yellow-800 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and Results Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100">
              {/* Results Count */}
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  Showing {sortedProducts.length} of {products.length} products
                </span>
                {selectedCategory !== 'All' && (
                  <span className="ml-2 text-yellow-800 font-medium">
                    in "{selectedCategory}"
                  </span>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-w-[140px]"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Rating (Highest First)</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {selectedCategory !== 'All' && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Active:</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="hover:bg-yellow-200 rounded-full p-0.5 transition-colors"
                      aria-label="Remove filter"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">No products found</h3>
            <p className="text-gray-500 mb-8">Try selecting a different category or adjusting your filters.</p>
            <Button onClick={() => setSelectedCategory('All')}>
              Show All Products
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-yellow-200 transform hover:-translate-y-1">
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
                    
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-yellow-800">
                      {product.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 min-h-[4rem]">{product.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-amber-400 fill-current' 
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
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Can't decide?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Try our popular gift set or start with a single bar to experience authentic Dubai chocolate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => {
                const giftSet = products.find(p => p.category === 'Gift Sets');
                if (giftSet) onAddToCart(giftSet);
              }}
              size="large"
            >
              Try Our Gift Set
            </Button>
            <Button 
              onClick={() => {
                const singleBar = products.find(p => p.category === 'Single Bars');
                if (singleBar) onAddToCart(singleBar);
              }}
              variant="outline"
              size="large"
            >
              Start with Single Bar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const CartPage: React.FC<{
  cart: CartItem[];
  totals: CartTotals;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onNavigate: (route: AppRoute | 'admin') => void;
}> = ({ cart, totals, onUpdateQuantity, onRemoveItem, onNavigate }) => (
  <div className="min-h-screen bg-gray-50">
    <Breadcrumb 
      items={[{ label: 'Shopping Cart', isActive: true }]}
      onNavigate={onNavigate}
    />
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {cart.length === 0 ? (
        <CartEmpty onContinueShopping={() => onNavigate('home')} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-medium mb-6 text-gray-900">Cart Items ({cart.length})</h2>
              {cart.map(item => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <CartSummary 
              totals={totals}
              onCheckout={() => onNavigate('checkout')}
              showShippingNote
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

const CheckoutPage: React.FC<{
  cart: CartItem[];
  totals: CartTotals;
  onNavigate: (route: AppRoute | 'admin') => void;
  onPlaceOrder: (shippingAddress: ShippingAddress) => void;
}> = ({ cart, totals, onNavigate, onPlaceOrder }) => {
  const { values: formData, errors, updateValue, validateRequired } = useFormValidation({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateValue(e.target.name, e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    
    if (!validateRequired(requiredFields)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const shippingAddress: ShippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      };
      onPlaceOrder(shippingAddress);
      setIsSubmitting(false);
    }, 1000);
  };

  const stateOptions = US_STATES.map(state => ({ 
    value: state.code, 
    label: state.name 
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[
          { label: 'Cart', route: 'cart' },
          { label: 'Checkout', isActive: true }
        ]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-light mb-8 text-gray-900">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={errors.lastName}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
              />

              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
              />

              <Input
                label="Street Address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                />
                <Select
                  label="State"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  error={errors.state}
                  options={stateOptions}
                />
                <Input
                  label="ZIP Code"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  error={errors.zipCode}
                />
              </div>

              <div className="flex space-x-4 mt-8">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate('cart')}
                  className="flex items-center"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Cart
                </Button>
                <Button 
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-medium mb-6 text-gray-900">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackingPage: React.FC<{ onNavigate: (route: AppRoute | 'admin') => void }> = ({ onNavigate }) => {
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      setTrackingResult({
        id: '1',
        orderNumber: 'BG-2025-001234',
        status: 'in_transit',
        items: [FEATURED_PRODUCTS[0], FEATURED_PRODUCTS[2]].map(p => ({ ...p, quantity: 1 })),
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          email: trackingInput.includes('@') ? trackingInput : 'customer@example.com',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        totals: { subtotal: 51.98, tax: 4.16, shipping: 0, total: 56.14 },
        createdAt: new Date('2025-08-10T14:30:00'),
        estimatedDelivery: new Date('2025-08-14T18:00:00')
      });
      setIsLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return <CheckCircle className="text-sky-500" size={20} />;
      case 'processing': return <Package className="text-pink-500" size={20} />;
      case 'shipped':
      case 'in_transit': return <Truck className="text-sky-600" size={20} />;
      case 'delivered': return <HomeIcon className="text-green-600" size={20} />;
      default: return <CheckCircle className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[{ label: 'Track Order', isActive: true }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-light mb-6 text-gray-900">Track Your Order</h2>
          <form onSubmit={handleTrackOrder} className="flex gap-4">
            <Input
              placeholder="Enter order number or email address"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="flex-1 mb-0"
            />
            <Button 
              type="submit" 
              variant="primary"
              disabled={!trackingInput.trim() || isLoading}
              className="whitespace-nowrap flex items-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  Tracking...
                </>
              ) : (
                'Track Order'
              )}
            </Button>
          </form>
        </div>

        {trackingResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Order #{trackingResult.orderNumber}</h3>
                  <p className="text-gray-500 mt-1">
                    Placed on {trackingResult.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3 bg-sky-50 px-4 py-2 rounded-lg">
                  {getStatusIcon(trackingResult.status)}
                  <span className="font-medium text-lg capitalize text-sky-700">
                    {trackingResult.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              {trackingResult.estimatedDelivery && (
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                  <p className="text-pink-800">
                    <strong>Estimated Delivery:</strong> {trackingResult.estimatedDelivery.toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ConfirmationPage: React.FC<{ 
  order: Order | null; 
  onNavigate: (route: AppRoute | 'admin') => void;
}> = ({ order, onNavigate }) => {
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No order found</h2>
          <Button onClick={() => onNavigate('home')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">Thank you for your order. We'll send you a confirmation email shortly.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-2 text-gray-900">Order #{order.orderNumber}</h2>
            <p className="text-xl text-gray-600 mb-8">Total: {formatCurrency(order.totals.total)}</p>

            <div className="flex justify-center space-x-4">
              <Button 
                variant="primary"
                onClick={() => onNavigate('tracking')}
                className="px-8"
              >
                Track Your Order
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('home')}
                className="px-8"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { navigateTo, currentRoute } = useAppNavigation();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Product state for admin management
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);

  const {
    cart,
    addToCart,
    updateQuantity,
    clearCart,
    cartTotal,
    subtotal,
    tax,
    shipping,
    total
  } = useCart();

  const removeItem = useCallback((productId: number) => {
    updateQuantity(productId, 0);
  }, [updateQuantity]);

  const totals: CartTotals = { subtotal, tax, shipping, total };

  // Admin product management functions
  const handleAddProduct = useCallback((productData: ProductFormData) => {
    const newProduct: Product = {
      id: Math.max(...products.map(p => p.id)) + 1,
      ...productData,
      rating: productData.rating ?? 5.0
    };
    setProducts(prev => [...prev, newProduct]);
  }, [products]);

  const handleUpdateProduct = useCallback((id: number, productData: ProductFormData) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
  }, []);

  const handleDeleteProduct = useCallback((id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  }, []);

  const handleUpdateOrderStatus = useCallback((orderId: string, updateData: OrderUpdateData) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: updateData.status } : order
    ));
  }, []);

  const handlePlaceOrder = useCallback((shippingAddress: ShippingAddress) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: generateOrderNumber(),
      items: cart,
      shippingAddress,
      totals,
      status: 'placed',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    };
    
    setCurrentOrder(newOrder);
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    navigateTo('confirmation');
    
    console.log('Order placed:', newOrder);
  }, [cart, totals, clearCart, navigateTo]);

  return (
    <Routes>
      {/* Admin Route - No Layout */}
      <Route 
        path="/admin" 
        element={
          <AdminApp
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onBackToStore={() => navigateTo('home')}
          />
        } 
      />
      
      {/* All other routes - With Layout */}
      <Route 
        path="/*" 
        element={
          <Layout
            onNavigate={navigateTo}
            cartCount={cartTotal}
            currentRoute={currentRoute as AppRoute}
          >
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage onAddToCart={addToCart} onNavigate={navigateTo} />
                } 
              />
              <Route 
                path="/products" 
                element={
                  <ProductsPage 
                    products={products}
                    onAddToCart={addToCart}
                    onNavigate={navigateTo}
                  />
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <CartPage 
                    cart={cart}
                    totals={totals}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    onNavigate={navigateTo}
                  />
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <CheckoutPage 
                    cart={cart}
                    totals={totals}
                    onNavigate={navigateTo}
                    onPlaceOrder={handlePlaceOrder}
                  />
                } 
              />
              <Route 
                path="/tracking" 
                element={<TrackingPage onNavigate={navigateTo} />} 
              />
              <Route 
                path="/confirmation" 
                element={<ConfirmationPage order={currentOrder} onNavigate={navigateTo} />} 
              />
            </Routes>
          </Layout>
        } 
      />
    </Routes>
  );
};

// Main App Component with Router
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;