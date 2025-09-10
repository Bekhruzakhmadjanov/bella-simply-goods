// src/pages/TrackingPage.tsx
import React, { useState } from 'react';
import { CheckCircle, Package, Truck, Home as HomeIcon } from 'lucide-react';
import type { Route } from '../types/common.types';
import type { Order, OrderStatus } from '../types/order.types';

// Layout Components
import { Breadcrumb } from '../components/layout/Breadcrumb';

// Common Components
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Fallback products for demo tracking
import { ALL_PRODUCTS } from '../data/products';

interface TrackingPageProps {
  orders?: Order[];
  onNavigate: (route: Route | 'admin') => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ orders = [], onNavigate }) => {
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    setIsLoading(true);
    setError(undefined);
    
    setTimeout(() => {
      // First try to find the order in the actual orders array
      const foundOrder = orders.find(order => 
        order.orderNumber.toLowerCase() === trackingInput.toLowerCase() ||
        order.shippingAddress.email.toLowerCase() === trackingInput.toLowerCase()
      );

      if (foundOrder) {
        setTrackingResult(foundOrder);
      } else {
        // Generate a demo tracking result if not found
        const isEmail = trackingInput.includes('@');
        if (isEmail || trackingInput.toLowerCase().startsWith('bg-')) {
          setTrackingResult({
            id: '1',
            orderNumber: isEmail ? 'BG-2025-001234' : trackingInput.toUpperCase(),
            status: 'in_transit',
            items: [ALL_PRODUCTS[0], ALL_PRODUCTS[4]].map(p => ({ ...p, quantity: 1 })),
            shippingAddress: {
              firstName: 'John',
              lastName: 'Doe',
              email: isEmail ? trackingInput : 'customer@example.com',
              address: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001'
            },
            totals: { subtotal: 37.98, tax: 3.04, shipping: 0, total: 41.02 },
            createdAt: new Date('2025-08-10T14:30:00'),
            estimatedDelivery: new Date('2025-08-14T18:00:00')
          });
        } else {
          setError('Order not found. Please check your order number or email address.');
        }
      }
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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'processing': return 'text-pink-700 bg-pink-50 border-pink-200';
      case 'shipped':
      case 'in_transit': return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'delivered': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
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
          <p className="text-gray-600 mb-6">
            Enter your order number (e.g., BG-2025-001234) or the email address used during checkout.
          </p>
          
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <Input
              placeholder="Enter order number or email address"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="mb-0"
              error={error}
            />
            <Button 
              type="submit" 
              variant="primary"
              disabled={!trackingInput.trim() || isLoading}
              className="w-full sm:w-auto flex items-center justify-center"
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
                <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg border ${getStatusColor(trackingResult.status)}`}>
                  {getStatusIcon(trackingResult.status)}
                  <span className="font-medium text-lg capitalize">
                    {trackingResult.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              {trackingResult.estimatedDelivery && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <p className="text-amber-800">
                    <strong>Estimated Delivery:</strong> {trackingResult.estimatedDelivery.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* Order Items */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {trackingResult.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-6 mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    {trackingResult.shippingAddress.firstName} {trackingResult.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">{trackingResult.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {trackingResult.shippingAddress.city}, {trackingResult.shippingAddress.state} {trackingResult.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Order Support</h4>
              <p className="text-gray-600 text-sm mb-2">
                Having trouble tracking your order? Contact our support team.
              </p>
              <p className="text-sm text-yellow-800 font-medium">support@bellasimplygoods.com</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Shipping Information</h4>
              <p className="text-gray-600 text-sm">
                Orders are processed within 1-2 business days and typically arrive within 3-5 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};