// components/admin/FeedbackManager.tsx - Simple feedback overview with real data
import React, { useState, useEffect } from 'react';
import { Mail, Users, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import type { Order } from '../../types/order.types';

interface EmailStats {
  totalOrderEmails: number;
  totalFeedbackEmails: number;
  lastWeekEmails: number;
}

interface FeedbackManagerProps {
  orders?: Order[];
}

export const FeedbackManager: React.FC<FeedbackManagerProps> = ({ orders = [] }) => {
  const [stats, setStats] = useState<EmailStats>({
    totalOrderEmails: 0,
    totalFeedbackEmails: 0,
    lastWeekEmails: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate real stats from orders data
    const calculateStats = () => {
      const totalOrderEmails = orders.length; // One confirmation email per order
      const totalFeedbackEmails = orders.filter(o => o.status === 'delivered').length; // Feedback sent when delivered
      
      // Calculate last week emails (orders placed in last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const lastWeekEmails = orders.filter(o => o.createdAt >= oneWeekAgo).length;

      return {
        totalOrderEmails,
        totalFeedbackEmails,
        lastWeekEmails
      };
    };

    // Simulate loading delay
    setTimeout(() => {
      setStats(calculateStats());
      setLoading(false);
    }, 500);
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Overview</h1>
        <p className="text-gray-600">Monitor your automated email communications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">Order Confirmations</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalOrderEmails}</p>
              <p className="text-sm text-blue-600 mt-1">Total orders placed</p>
            </div>
            <Mail className="text-blue-400" size={32} />
          </div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-emerald-800">Feedback Requests</h3>
              <p className="text-3xl font-bold text-emerald-600">{stats.totalFeedbackEmails}</p>
              <p className="text-sm text-emerald-600 mt-1">Orders delivered</p>
            </div>
            <Users className="text-emerald-400" size={32} />
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-amber-800">This Week</h3>
              <p className="text-3xl font-bold text-amber-600">{stats.lastWeekEmails}</p>
              <p className="text-sm text-amber-600 mt-1">New orders (7 days)</p>
            </div>
            <TrendingUp className="text-amber-400" size={32} />
          </div>
        </div>
      </div>

      {/* Email Templates Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Email Templates Status</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Order Confirmation</h3>
              <p className="text-sm text-gray-600">Sent when customers place orders ({stats.totalOrderEmails} sent)</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Feedback Request</h3>
              <p className="text-sm text-gray-600">Sent when orders are delivered ({stats.totalFeedbackEmails} sent)</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Email Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Current Status</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Total orders in system: {orders.length}</li>
              <li>• Orders delivered: {orders.filter(o => o.status === 'delivered').length}</li>
              <li>• Orders pending: {orders.filter(o => ['placed', 'processing'].includes(o.status)).length}</li>
              <li>• Orders in transit: {orders.filter(o => ['shipped', 'in_transit'].includes(o.status)).length}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Email Automation</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Confirmation emails are sent automatically when orders are placed</li>
              <li>• Feedback emails are sent when you mark orders as "delivered"</li>
              <li>• All emails use your configured EmailJS templates</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">How Email Automation Works</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Order Placed</h3>
              <p className="text-sm text-gray-600">Customer places an order → Order confirmation email sent automatically</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Order Delivered</h3>
              <p className="text-sm text-gray-600">Admin changes order status to "delivered" → Feedback request email sent automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};