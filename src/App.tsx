// src/App.tsx - Updated with review page route

import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Backend Hooks
import { useProducts, useOrders } from './hooks/useFirebaseData';
import { useCart } from './hooks/useCart';

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
      'leave-review': '/leave-review',
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
      '/leave-review': 'leave-review',
      '/admin': 'admin'
    };
    return routeMap[location.pathname] || 'home';
  };

  return { navigateTo, currentRoute: getCurrentRoute() };
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { navigateTo, currentRoute } = useAppNavigation();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
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

  // Enhanced add to cart with analytics
  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product);
    // Track product interaction
    incrementProductView(product.id);
  }, [addToCart, incrementProductView]);

  // Admin product management functions with error handling
  const handleAddProduct = useCallback(async (productData: ProductFormData) => {
    try {
      await addProduct(productData);
      console.log('Product added successfully');
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error; // Re-throw to let the admin component handle it
    }
  }, [addProduct]);

  const handleUpdateProduct = useCallback(async (id: string, productData: ProductFormData) => {
    try {
      await updateProduct(id, productData);
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }, [updateProduct]);

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      await deleteProduct(id);
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }, [deleteProduct]);

  const handleUpdateOrderStatus = useCallback(async (orderId: string, updateData: OrderUpdateData) => {
    try {
      await updateOrderStatus(orderId, updateData);
      console.log('Order status updated successfully');
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
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
      
      // Save to Firebase and send confirmation email
      const firebaseOrderId = await addOrder(newOrder);
      const orderWithFirebaseId = { ...newOrder, id: firebaseOrderId };
      
      setCurrentOrder(orderWithFirebaseId);
      clearCart();
      navigateTo('confirmation');
      
      console.log('Order placed successfully:', orderWithFirebaseId);
    } catch (error) {
      console.error('Failed to place order:', error);
      throw error;
    }
  }, [cart, totals, clearCart, navigateTo, addOrder]);

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
                    onAddToCart={handleAddToCart} 
                    onNavigate={navigateTo} 
                  />
                } 
              />
              <Route 
                path="/products" 
                element={
                  <ProductsPage 
                    products={products}
                    onAddToCart={handleAddToCart}
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