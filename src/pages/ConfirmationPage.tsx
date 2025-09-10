// src/pages/ConfirmationPage.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { Route } from '../types/common.types';
import type { Order } from '../types/order.types';

// Utils
import { formatCurrency } from '../utils/calculations';

// Common Components
import { Button } from '../components/common/Button';

interface ConfirmationPageProps {
  order: Order | null;
  onNavigate: (route: Route | 'admin') => void;
}

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ order, onNavigate }) => {
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No order found</h2>
          <p className="text-gray-500 mb-8">It looks like there's no order information available.</p>
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
          <div className="text-center mb-8">
            <h2 className="text-2xl font-medium mb-2 text-gray-900">Order #{order.orderNumber}</h2>
            <p className="text-xl text-gray-600 mb-2">Total: {formatCurrency(order.totals.total)}</p>
            <p className="text-sm text-gray-500">
              Placed on {order.createdAt.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Items */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Shipping Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.email}</p>
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  )}
                </div>

                {order.estimatedDelivery && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      <strong>Estimated Delivery:</strong> {order.estimatedDelivery.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="max-w-sm ml-auto">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(order.totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>{order.totals.shipping === 0 ? 'Free' : formatCurrency(order.totals.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatCurrency(order.totals.tax)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(order.totals.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

          {/* Additional Information */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg text-left">
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• You'll receive an order confirmation email within 5 minutes</li>
              <li>• Your order will be processed and shipped within 1-2 business days</li>
              <li>• You'll get a tracking number once your order ships</li>
              <li>• Questions? Contact us at support@bellasimplygoods.com</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};