import React, { useState, useCallback } from 'react';
import { ArrowLeft, CheckCircle, Clock, MapPin, Package, Truck, Home as HomeIcon } from 'lucide-react';

// Types
import type { Route } from './types/common.types';
import type { Product } from './types/product.types';
import type { CartItem, CartTotals } from './types/cart.types';
import type { Order, ShippingAddress, OrderStatus } from './types/order.types';

// Constants and Data
import { ROUTES } from './constants/routes';
import { PRODUCTS } from './data/products';
import { US_STATES } from './data/states';

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

// Page Components
const HomePage: React.FC<{ onAddToCart: (product: Product) => void }> = ({ onAddToCart }) => (
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
        products={PRODUCTS}
        onAddToCart={onAddToCart}
        title="Our Dubai Chocolate Collection"
      />
    </div>

    {/* About Section */}
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-3xl font-light text-gray-900 mb-12 tracking-tight">Why Choose Bella Simply Goods?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-sky-600" size={28} />
            </div>
            <h4 className="text-xl font-medium mb-4 text-gray-900">Authentic Recipe</h4>
            <p className="text-gray-600 leading-relaxed">Made with the original Dubai chocolate recipe using traditional techniques and premium ingredients.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-pink-600" size={28} />
            </div>
            <h4 className="text-xl font-medium mb-4 text-gray-900">Fresh Daily</h4>
            <p className="text-gray-600 leading-relaxed">Every piece is handcrafted fresh daily in small batches to ensure maximum quality and taste.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="text-gray-700" size={28} />
            </div>
            <h4 className="text-xl font-medium mb-4 text-gray-900">USA Delivery</h4>
            <p className="text-gray-600 leading-relaxed">Fast and secure shipping nationwide with temperature-controlled packaging to preserve freshness.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const CartPage: React.FC<{
  cart: CartItem[];
  totals: CartTotals;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onNavigate: (route: Route) => void;
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
          {/* Cart Items */}
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

          {/* Order Summary */}
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
  onNavigate: (route: Route) => void;
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
    // Simulate API call
    setTimeout(() => {
      // Create proper ShippingAddress object
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

  // Convert US_STATES to the format expected by Select component
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
          {/* Checkout Form */}
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

          {/* Order Summary */}
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

const TrackingPage: React.FC<{ onNavigate: (route: Route) => void }> = ({ onNavigate }) => {
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTrackingResult({
        id: '1',
        orderNumber: 'BG-2025-001234',
        status: 'in_transit',
        items: [PRODUCTS[0], PRODUCTS[2]].map(p => ({ ...p, quantity: 1 })),
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
        {/* Tracking Form */}
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

        {/* Tracking Results */}
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
  onNavigate: (route: Route) => void;
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

// Main App Component
const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>(ROUTES.HOME);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
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

  // Add removeItem functionality to useCart hook
  const removeItem = useCallback((productId: number) => {
    updateQuantity(productId, 0);
  }, [updateQuantity]);

  const totals: CartTotals = { subtotal, tax, shipping, total };

  const handlePlaceOrder = useCallback((shippingAddress: ShippingAddress) => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: generateOrderNumber(),
      items: cart,
      shippingAddress,
      totals,
      status: 'placed',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days from now
    };
    
    setCurrentOrder(newOrder);
    clearCart();
    setCurrentRoute(ROUTES.CONFIRMATION);
    
    // Here you would integrate with:
    // 1. Stripe for payment processing
    // 2. Supabase to save order
    // 3. SendGrid to send confirmation email
    console.log('Order placed:', newOrder);
  }, [cart, totals, clearCart]);

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case ROUTES.HOME:
        return <HomePage onAddToCart={addToCart} />;
      case ROUTES.CART:
        return (
          <CartPage 
            cart={cart}
            totals={totals}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onNavigate={setCurrentRoute}
          />
        );
      case ROUTES.CHECKOUT:
        return (
          <CheckoutPage 
            cart={cart}
            totals={totals}
            onNavigate={setCurrentRoute}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      case ROUTES.TRACKING:
        return <TrackingPage onNavigate={setCurrentRoute} />;
      case ROUTES.CONFIRMATION:
        return <ConfirmationPage order={currentOrder} onNavigate={setCurrentRoute} />;
      default:
        return <HomePage onAddToCart={addToCart} />;
    }
  };

  return (
    <Layout
      onNavigate={setCurrentRoute}
      cartCount={cartTotal}
      currentRoute={currentRoute}
    >
      {renderCurrentPage()}
    </Layout>
  );
};

export default App;