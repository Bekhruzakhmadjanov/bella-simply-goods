// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { CartItem, CartTotals } from '../types/cart.types';
import type { Route } from '../types/common.types';
import type { ShippingAddress } from '../types/order.types';

// Constants and Data
import { US_STATES } from '../data/states';

// Utils and Hooks
import { formatCurrency } from '../utils/calculations';
import { useFormValidation } from '../hooks/useFormValidation';

// Layout Components
import { Breadcrumb } from '../components/layout/Breadcrumb';

// Common Components
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface CheckoutPageProps {
  cart: CartItem[];
  totals: CartTotals;
  onNavigate: (route: Route | 'admin') => void;
  onPlaceOrder: (shippingAddress: ShippingAddress) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  cart, 
  totals, 
  onNavigate, 
  onPlaceOrder 
}) => {
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