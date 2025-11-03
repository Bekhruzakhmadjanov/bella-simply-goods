// src/App.tsx - Updated with cart and quantity management props

import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Backend Hooks
import { useProducts, useOrders } from './hooks/useFirebaseData';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';

// Email Service
import { initializeEmailService } from './services/emailService';

// Types
import type { Route as AppRoute } from './types/common.types';
import type { Product } from './types/product.types';
import type { Order, ShippingAddress } from './types/order.types';
import type { ProductFormData, OrderUpdateData } from './types/admin.types';

// Utils
import { generateOrderNumber } from './utils/calculations';

// Layout Components
import { Layout } from './components/layout/Layout';

// Page Components
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackingPage } from './pages/TrackingPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { LeaveReviewPage } from './pages/LeaveReviewPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { ReturnPolicyPage } from './pages/ReturnPolicyPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { Toast } from './components/common/Toast';

// Admin Components
import { AdminApp } from './components/admin/AdminApp';

// Main App Content Component
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const navigateTo = useCallback((route: AppRoute | 'admin', productId?: string) => {
    const pathMap = {
      home: '/',
      products: '/products',
      'product-detail': '/product-detail',
      cart: '/cart',
      checkout: '/checkout',
      tracking: '/tracking',
      confirmation: '/confirmation',
      'leave-review': '/leave-review',
      'privacy-policy': '/privacy-policy',
      'return-policy': '/return-policy',
      admin: '/admin'
    };
    
    if (route === 'product-detail' && productId) {
      setSelectedProductId(productId);
    }
    
    navigate(pathMap[route] || '/');
  }, [navigate]);

  const getCurrentRoute = (): AppRoute | 'admin' => {
    const routeMap: Record<string, AppRoute | 'admin'> = {
      '/': 'home',
      '/products': 'products',
      '/product-detail': 'product-detail',
      '/cart': 'cart',
      '/checkout': 'checkout',
      '/tracking': 'tracking',
      '/confirmation': 'confirmation',
      '/leave-review': 'leave-review',
      '/privacy-policy': 'privacy-policy',
      '/return-policy': 'return-policy',
      '/admin': 'admin'
    };
    return routeMap[location.pathname] || 'home';
  };

  const currentRoute = getCurrentRoute();
  
  // Use enhanced backend hooks
  const {
    products,
    loading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    incrementProductView
  } = useProducts();

  const {
    orders,
    addOrder,
    updateOrderStatus
  } = useOrders();

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

  // Initialize email service on app start
  useEffect(() => {
    initializeEmailService();
  }, []);

  const removeItem = useCallback((productId: string) => {
    updateQuantity(productId, 0);
  }, [updateQuantity]);

  const totals = { subtotal, tax, shipping, total };

  // Enhanced add to cart with analytics and toast notification
  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product);
    incrementProductView(product.id);
    success(`${product.name} added to cart!`);
  }, [addToCart, incrementProductView, success]);

  // Handle quantity updates with toast notifications
  const handleUpdateQuantity = useCallback((productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    const currentItem = cart.find(item => item.id === productId);
    
    if (newQuantity === 0 && currentItem) {
      // Item being removed
      success(`${product?.name} removed from cart`);
    } else if (currentItem && newQuantity > currentItem.quantity) {
      // Quantity increased
      const diff = newQuantity - currentItem.quantity;
      success(`Added ${diff} more ${product?.name} to cart`);
    } else if (currentItem && newQuantity < currentItem.quantity) {
      // Quantity decreased
      const diff = currentItem.quantity - newQuantity;
      success(`Removed ${diff} ${product?.name} from cart`);
    }
    
    updateQuantity(productId, newQuantity);
  }, [updateQuantity, products, cart, success]);

  // Admin product management functions with error handling
  const handleAddProduct = useCallback(async (productData: ProductFormData) => {
    try {
      await addProduct(productData);
      console.log('Product added successfully');
    } catch (err) {
      console.error('Failed to add product:', err);
      throw err;
    }
  }, [addProduct]);

  const handleUpdateProduct = useCallback(async (id: string, productData: ProductFormData) => {
    try {
      await updateProduct(id, productData);
      console.log('Product updated successfully');
    } catch (err) {
      console.error('Failed to update product:', err);
      throw err;
    }
  }, [updateProduct]);

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      await deleteProduct(id);
      console.log('Product deleted successfully');
    } catch (err) {
      console.error('Failed to delete product:', err);
      throw err;
    }
  }, [deleteProduct]);

  const handleUpdateOrderStatus = useCallback(async (orderId: string, updateData: OrderUpdateData) => {
    try {
      await updateOrderStatus(orderId, updateData);
      console.log('Order status updated successfully');
    } catch (err) {
      console.error('Failed to update order status:', err);
      throw err;
    }
  }, [updateOrderStatus]);

  const handlePlaceOrder = useCallback(async (shippingAddress: ShippingAddress) => {
    try {
      const newOrder: Omit<Order, 'id'> = {
        orderNumber: generateOrderNumber(),
        items: cart,
        shippingAddress,
        totals,
        status: 'placed',
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      };
      
      const firebaseOrderId = await addOrder(newOrder);
      const orderWithFirebaseId = { ...newOrder, id: firebaseOrderId };
      
      setCurrentOrder(orderWithFirebaseId);
      clearCart();
      navigateTo('confirmation');
      success('Order placed successfully!');
      
      console.log('Order placed successfully:', orderWithFirebaseId);
    } catch (err) {
      console.error('Failed to place order:', err);
      showError('Failed to place order. Please try again.');
      throw err;
    }
  }, [cart, totals, clearCart, navigateTo, addOrder, success, showError]);

  // Show loading spinner while initial data loads
  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  // If no products available, show empty state
  if (!productsLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Products Available</h2>
          <p className="text-gray-600 mb-6">Please add some products through the admin panel.</p>
          <button
            onClick={() => navigateTo('admin')}
            className="bg-yellow-800 text-white px-6 py-3 rounded-lg hover:bg-yellow-900 transition-colors"
          >
            Go to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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
                    <HomePage 
                      products={products}
                      cart={cart}
                      onAddToCart={handleAddToCart} 
                      onUpdateQuantity={handleUpdateQuantity}
                      onNavigate={navigateTo} 
                    />
                  } 
                />
                <Route 
                  path="/products" 
                  element={
                    <ProductsPage 
                      products={products}
                      cart={cart}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      onNavigate={navigateTo}
                    />
                  } 
                />
                <Route 
                  path="/product-detail" 
                  element={
                    <ProductDetailPage 
                      productId={selectedProductId}
                      products={products}
                      onAddToCart={(product, qty) => {
                        for (let i = 0; i < qty; i++) {
                          addToCart(product);
                        }
                        incrementProductView(product.id);
                        success(`${qty} × ${product.name} added to cart!`);
                      }}
                      onNavigate={navigateTo}
                      onBuyNow={(product, qty) => {
                        for (let i = 0; i < qty; i++) {
                          addToCart(product);
                        }
                        navigateTo('checkout');
                      }}
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
                  element={
                    <TrackingPage 
                      orders={orders}
                      onNavigate={navigateTo} 
                    />
                  } 
                />
                <Route 
                  path="/confirmation" 
                  element={
                    <ConfirmationPage 
                      order={currentOrder} 
                      onNavigate={navigateTo} 
                    />
                  } 
                />
                <Route 
                  path="/leave-review" 
                  element={
                    <LeaveReviewPage 
                      onNavigate={navigateTo} 
                    />
                  } 
                />
                <Route 
                  path="/privacy-policy" 
                  element={
                    <PrivacyPolicyPage 
                      onNavigate={navigateTo} 
                    />
                  } 
                />
                <Route 
                  path="/return-policy" 
                  element={
                    <ReturnPolicyPage 
                      onNavigate={navigateTo} 
                    />
                  } 
                />
              </Routes>
            </Layout>
          } 
        />
      </Routes>
      
      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
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