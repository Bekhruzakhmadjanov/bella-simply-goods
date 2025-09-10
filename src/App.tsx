// src/App.tsx - Clean, modular main app file

import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Firebase imports
import { 
  getProductsFromFirebase, 
  addProductToFirebase, 
  updateProductInFirebase, 
  deleteProductFromFirebase 
} from './firebase/products';
import { 
  getOrdersFromFirebase, 
  addOrderToFirebase, 
  updateOrderInFirebase 
} from './firebase/orders';

// Types
import type { Route as AppRoute } from './types/common.types';
import type { Product } from './types/product.types';
import type { Order, ShippingAddress } from './types/order.types';
import type { ProductFormData, OrderUpdateData } from './types/admin.types';

// Constants and Data - Fallback data
import { ALL_PRODUCTS } from './data/products';

// Utils and Hooks
import { generateOrderNumber } from './utils/calculations';
import { useCart } from './hooks/useCart';

// Layout Components
import { Layout } from './components/layout/Layout';

// Page Components
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackingPage } from './pages/TrackingPage';
import { ConfirmationPage } from './pages/ConfirmationPage';

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

// Main App Content Component
const AppContent: React.FC = () => {
  const { navigateTo, currentRoute } = useAppNavigation();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Product state for admin management
  const [products, setProducts] = useState<Product[]>([]);
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

  // Load Firebase data on app start
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        console.log('Loading Firebase data...');
        
        // Load products
        try {
          const firebaseProducts = await getProductsFromFirebase();
          console.log('Firebase products loaded:', firebaseProducts);
          setProducts(firebaseProducts.length > 0 ? firebaseProducts : ALL_PRODUCTS);
        } catch (productError) {
          console.warn('Using fallback products:', productError);
          setProducts(ALL_PRODUCTS);
        }
        
        // Load orders
        try {
          const firebaseOrders = await getOrdersFromFirebase();
          console.log('Firebase orders loaded:', firebaseOrders);
          setOrders(firebaseOrders);
        } catch (orderError) {
          console.warn('Could not load orders:', orderError);
          setOrders([]);
        }
        
      } catch (error) {
        console.error('Firebase initialization error:', error);
        // Use fallback data
        setProducts(ALL_PRODUCTS);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFirebaseData();
  }, []);

  const removeItem = useCallback((productId: number) => {
    updateQuantity(productId, 0);
  }, [updateQuantity]);

  const totals = { subtotal, tax, shipping, total };

  // Admin product management functions
  const handleAddProduct = useCallback(async (productData: ProductFormData) => {
    try {
      const newProductId = await addProductToFirebase(productData);
      const newProduct: Product = {
        id: parseInt(newProductId, 36), // Convert Firebase ID to number
        ...productData,
        rating: productData.rating ?? 5.0
      };
      setProducts(prev => [...prev, newProduct]);
      console.log('Product added successfully');
    } catch (error) {
      console.error('Failed to add product:', error);
      // Fallback to local state update
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id)) + 1,
        ...productData,
        rating: productData.rating ?? 5.0
      };
      setProducts(prev => [...prev, newProduct]);
    }
  }, [products]);

  const handleUpdateProduct = useCallback(async (id: number, productData: ProductFormData) => {
    try {
      // Convert number ID back to Firebase string ID for update
      const firebaseId = id.toString(36);
      await updateProductInFirebase(firebaseId, productData);
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...productData } : product
      ));
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Failed to update product:', error);
      // Fallback to local state update
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...productData } : product
      ));
    }
  }, []);

  const handleDeleteProduct = useCallback(async (id: number) => {
    try {
      // Convert number ID back to Firebase string ID for deletion
      const firebaseId = id.toString(36);
      await deleteProductFromFirebase(firebaseId);
      setProducts(prev => prev.filter(product => product.id !== id));
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product:', error);
      // Fallback to local state update
      setProducts(prev => prev.filter(product => product.id !== id));
    }
  }, []);

  const handleUpdateOrderStatus = useCallback(async (orderId: string, updateData: OrderUpdateData) => {
    try {
      await updateOrderInFirebase(orderId, updateData);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: updateData.status } : order
      ));
      console.log('Order status updated successfully');
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Fallback to local state update
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: updateData.status } : order
      ));
    }
  }, []);

  const handlePlaceOrder = useCallback(async (shippingAddress: ShippingAddress) => {
    try {
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
      
      // Save to Firebase
      const firebaseOrderId = await addOrderToFirebase(newOrder);
      const orderWithFirebaseId = { ...newOrder, id: firebaseOrderId };
      
      setCurrentOrder(orderWithFirebaseId);
      setOrders(prev => [orderWithFirebaseId, ...prev]);
      clearCart();
      navigateTo('confirmation');
      
      console.log('Order placed successfully:', orderWithFirebaseId);
    } catch (error) {
      console.error('Failed to place order:', error);
      // Fallback to local state
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
    }
  }, [cart, totals, clearCart, navigateTo]);

  // Show loading spinner while Firebase data loads
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
                    onAddToCart={addToCart} 
                    onNavigate={navigateTo} 
                  />
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