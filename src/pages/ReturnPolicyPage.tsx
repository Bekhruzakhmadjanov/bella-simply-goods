// src/pages/ReturnPolicyPage.tsx
import React from 'react';
import type { Route } from '../types/common.types';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Package, Clock, RefreshCw, Mail } from 'lucide-react';

interface ReturnPolicyPageProps {
  onNavigate: (route: Route | 'admin') => void;
}

export const ReturnPolicyPage: React.FC<ReturnPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb 
        items={[{ label: 'Return Policy', isActive: true }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Return & Refund Policy</h1>
            <p className="text-gray-600">Last updated: November 4, 2025</p>
          </div>

          {/* Quick Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-3">Quick Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <Clock className="text-green-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-green-800">30-Day Window</p>
                  <p className="text-green-700 text-sm">Return within 30 days</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Package className="text-green-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-green-800">Original Packaging</p>
                  <p className="text-green-700 text-sm">Items must be unopened</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RefreshCw className="text-green-600 mt-1" size={20} />
                <div>
                  <p className="font-medium text-green-800">Full Refund</p>
                  <p className="text-green-700 text-sm">Money back guarantee</p>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              At Bella Simply Goods, we want you to be completely satisfied with your Dubai chocolate experience. 
              If for any reason you're not happy with your purchase, we offer a straightforward return policy.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Return Eligibility</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Items That Can Be Returned</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Unopened chocolate products in original packaging</li>
              <li>Items damaged during shipping</li>
              <li>Incorrect items received due to our error</li>
              <li>Products that arrived significantly past their expiration date</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Items That Cannot Be Returned</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Opened or partially consumed chocolate products (for health and safety reasons)</li>
              <li>Items damaged due to improper storage by customer</li>
              <li>Products returned after 30 days from delivery date</li>
              <li>Custom or personalized items (unless defective)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Return Process</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step-by-Step Instructions</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-800 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium text-gray-800">Contact Us</p>
                    <p className="text-gray-600 text-sm">Email us at returns@bellasimplygoods.com within 30 days of delivery</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-800 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium text-gray-800">Get Authorization</p>
                    <p className="text-gray-600 text-sm">We'll provide a Return Authorization Number (RAN) and return instructions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-800 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium text-gray-800">Package Items</p>
                    <p className="text-gray-600 text-sm">Securely pack items in original packaging with RAN included</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-800 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-medium text-gray-800">Ship Back</p>
                    <p className="text-gray-600 text-sm">Send to the address we provide (we'll cover return shipping for our errors)</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Refunds</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Processing Time</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Refunds are processed within 3-5 business days after we receive your return</li>
              <li>Original payment method will be credited</li>
              <li>Bank processing may take additional 3-7 business days</li>
              <li>You'll receive an email confirmation when refund is processed</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Refund Amount</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Full product price refunded for eligible returns</li>
              <li>Original shipping costs refunded if error was on our part</li>
              <li>Customer pays return shipping unless item was damaged or incorrect</li>
              <li>No restocking fees</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Special Circumstances</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Damaged Items</h3>
            <p className="text-gray-700 mb-4">
              If your chocolate arrives damaged due to shipping, please:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Take photos of the packaging and damaged items</li>
              <li>Contact us within 48 hours of delivery</li>
              <li>We'll provide a full refund or replacement at no cost</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Temperature-Related Issues</h3>
            <p className="text-gray-700 mb-6">
              We ship with temperature-controlled packaging, but extreme weather can sometimes affect chocolate. 
              If your chocolate arrives melted due to shipping conditions, we'll gladly provide a replacement or refund.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Wrong Item Received</h3>
            <p className="text-gray-700 mb-6">
              If you receive the wrong item, we'll send you the correct item immediately and provide a prepaid 
              return label for the incorrect item. No need to wait for the return to be processed.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Exchanges</h2>
            <p className="text-gray-700 mb-6">
              We currently offer refunds rather than direct exchanges. If you'd like a different product, 
              please return the original item for a refund and place a new order. This ensures faster 
              processing and gives you the flexibility to choose exactly what you want.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For returns, questions, or concerns, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-600" size={16} />
                  <span className="text-gray-700"><strong>Returns Email:</strong> returns@bellasimplygoods.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-600" size={16} />
                  <span className="text-gray-700"><strong>General Support:</strong> hello@bellasimplygoods.com</span>
                </div>
                <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p className="text-gray-700"><strong>Hours:</strong> Monday-Friday, 9AM-6PM EST</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
              <p className="text-green-800 text-sm">
                <strong>Our Promise:</strong> We stand behind the quality of our Dubai chocolate. If you're not 
                completely satisfied with your purchase, we'll make it right. Your satisfaction is our priority, 
                and we're committed to providing exceptional customer service.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> This return policy applies to purchases made directly from Bella Simply Goods. 
                For items purchased through third-party retailers, please refer to their return policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};