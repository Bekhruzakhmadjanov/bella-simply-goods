// src/firebase/stripe.ts
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

// Get Stripe key from environment variables
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('Stripe publishable key is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file');
}

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// Test card numbers for Stripe testing
export const TEST_CARDS = {
  success: {
    number: '4242 4242 4242 4242',
    description: 'Successful payment',
    expiry: '12/34',
    cvc: '123',
    zip: '12345'
  },
  declined: {
    number: '4000 0000 0000 0002',
    description: 'Card declined',
    expiry: '12/34',
    cvc: '123',
    zip: '12345'
  },
  requiresAuth: {
    number: '4000 0025 0000 3155',
    description: 'Requires authentication',
    expiry: '12/34',
    cvc: '123',
    zip: '12345'
  },
  insufficientFunds: {
    number: '4000 0000 0000 9995',
    description: 'Insufficient funds',
    expiry: '12/34',
    cvc: '123',
    zip: '12345'
  }
};

export const STRIPE_CONFIG = {
  testMode: true,
  currency: 'usd',
  country: 'US'
};