// src/services/emailService.ts - Fixed TypeScript types
import emailjs from '@emailjs/browser';
import type { Order } from '../types/order.types';

// Initialize EmailJS (call this in your main App component)
export const initializeEmailService = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

interface EmailTemplate {
  to_email: string;
  to_name: string;
  from_name: string;
  [key: string]: any;
}

// Define a proper interface for status configuration
interface StatusEmailConfig {
  status_class: string;
  status_message: string;
  status_content: string;
  show_tracking: boolean;
  show_cta: boolean;
  show_feedback: boolean;
  cta_text?: string;
  cta_link?: string;
  feedback_link?: string;
}

// Status-specific configuration for dynamic emails
const STATUS_CONFIG: Record<string, StatusEmailConfig> = {
  placed: {
    status_class: 'placed',
    status_message: '🎉 Your Order Has Been Placed!',
    status_content: `
      <p>Great news! We've received your order and it's now in our system.</p>
      <p><strong style="color: #92400e;">What's Next?</strong></p>
      <ul style="color: #78350f; margin: 15px 0; padding-left: 20px;">
        <li>We'll review and process your order within 1-2 business days</li>
        <li>You'll receive another update when we start preparing your chocolate</li>
        <li>All our chocolates are handcrafted fresh to order</li>
      </ul>
    `,
    show_tracking: false,
    show_cta: true,
    cta_text: 'View Order Details',
    cta_link: 'https://bellasimplygoods.web.app/tracking',
    show_feedback: false
  },
  
  processing: {
    status_class: 'processing',
    status_message: '👨‍🍳 Your Order is Being Prepared!',
    status_content: `
      <p>Exciting news! Our chocolatiers have started crafting your delicious Dubai chocolate.</p>
      <p><strong style="color: #92400e;">What's Happening Now?</strong></p>
      <ul style="color: #78350f; margin: 15px 0; padding-left: 20px;">
        <li>Your chocolate is being handcrafted with premium ingredients</li>
        <li>We're carefully packaging each item for optimal freshness</li>
        <li>Expected to ship within 1-2 business days</li>
      </ul>
      <p>The anticipation makes it even sweeter! 🍫</p>
    `,
    show_tracking: false,
    show_cta: true,
    cta_text: 'Track Your Order',
    cta_link: 'https://bellasimplygoods.web.app/tracking',
    show_feedback: false
  },
  
  shipped: {
    status_class: 'shipped',
    status_message: '📦 Your Order Has Shipped!',
    status_content: `
      <p>Your Dubai chocolate is now on its way to you!</p>
      <p><strong style="color: #92400e;">Shipping Details:</strong></p>
      <ul style="color: #78350f; margin: 15px 0; padding-left: 20px;">
        <li>Your package has left our facility</li>
        <li>Use the tracking information below to monitor progress</li>
        <li>Expected delivery in 3-5 business days</li>
      </ul>
      <p><strong>💡 Pro Tip:</strong> Store your chocolate in a cool, dry place upon arrival for the best taste experience!</p>
    `,
    show_tracking: true,
    show_cta: true,
    cta_text: 'Track Package',
    cta_link: 'https://bellasimplygoods.web.app/tracking',
    show_feedback: false
  },
  
  in_transit: {
    status_class: 'intransit',
    status_message: '🚛 Your Package is In Transit!',
    status_content: `
      <p>Your delicious Dubai chocolate is making its way to you!</p>
      <p><strong style="color: #92400e;">Current Status:</strong></p>
      <ul style="color: #78350f; margin: 15px 0; padding-left: 20px;">
        <li>Package is currently in transit</li>
        <li>On schedule for delivery as estimated</li>
        <li>You may receive delivery notifications from the carrier</li>
      </ul>
      <p>We can almost taste the excitement! Your authentic Dubai chocolate will be worth the wait. 🎯</p>
    `,
    show_tracking: true,
    show_cta: true,
    cta_text: 'Track Package',
    cta_link: 'https://bellasimplygoods.web.app/tracking',
    show_feedback: false
  },
  
  delivered: {
    status_class: 'delivered',
    status_message: '🎉 Your Order Has Been Delivered!',
    status_content: `
      <p>Congratulations! Your authentic Dubai chocolate has been delivered and is ready to be enjoyed!</p>
      <p><strong style="color: #92400e;">Time to Indulge:</strong></p>
      <ul style="color: #78350f; margin: 15px 0; padding-left: 20px;">
        <li>Your package should be at your doorstep</li>
        <li>Best enjoyed at room temperature</li>
        <li>Share the experience with family and friends</li>
      </ul>
      <p>We hope you absolutely love every bite of your handcrafted Dubai chocolate! 🍫✨</p>
    `,
    show_tracking: false,
    show_cta: false,
    show_feedback: true,
    feedback_link: 'https://bellasimplygoods.web.app/leave-review'
  },
  
  cancelled: {
    status_class: 'cancelled',
    status_message: '❌ Your Order Has Been Cancelled',
    status_content: `
      <p>We're sorry to inform you that your order has been cancelled.</p>
      <p><strong style="color: #92400e;">What This Means:</strong></p>
      <ul style="color: #78350f; margin: 15px 0; padding-left: 20px;">
        <li>No charges will be processed for this order</li>
        <li>Any payments made will be refunded within 3-5 business days</li>
        <li>You'll receive a separate confirmation of the refund</li>
      </ul>
      <p>If you have any questions about this cancellation or would like to place a new order, please don't hesitate to contact us.</p>
    `,
    show_tracking: false,
    show_cta: true,
    cta_text: 'Shop Again',
    cta_link: 'https://bellasimplygoods.web.app/products',
    show_feedback: false
  }
};

class EmailService {
  private serviceId: string;
  private templateIds: {
    orderConfirmation: string;
    statusUpdate: string;
  };

  constructor() {
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    this.templateIds = {
      orderConfirmation: import.meta.env.VITE_EMAILJS_ORDER_CONFIRMATION_TEMPLATE || '',
      statusUpdate: import.meta.env.VITE_EMAILJS_STATUS_UPDATE_TEMPLATE || '',
    };
  }

  private async sendEmail(templateId: string, templateParams: EmailTemplate): Promise<boolean> {
    try {
      if (!this.serviceId || !templateId) {
        console.warn('Email service not configured');
        return false;
      }

      const response = await emailjs.send(
        this.serviceId,
        templateId,
        templateParams
      );

      console.log('Email sent successfully:', response.status, response.text);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Keep existing order confirmation method unchanged
  async sendOrderConfirmation(order: Order): Promise<boolean> {
    // Create HTML formatted product list with images
    const productListHTML = order.items.map(item => {
      const totalPrice = (item.price * item.quantity).toFixed(2);
      return `
        <div style="display: flex; align-items: center; background: white; padding: 12px; margin: 8px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 12px;">
          <div style="flex: 1; font-size: 14px; line-height: 1.4;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 4px;">${item.name}</div>
            <div style="color: #6b7280; font-size: 12px;">Quantity: ${item.quantity}</div>
          </div>
          <div style="font-weight: bold; color: #92400e; font-size: 14px;">$${totalPrice}</div>
        </div>
      `;
    }).join('');

    // Also create plain text version as backup
    const productListText = order.items.map(item => 
      `${item.name} - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const templateParams: EmailTemplate = {
      // Customer info
      email: order.shippingAddress.email,
      name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      
      // Order details
      order_id: order.orderNumber,
      order_date: order.createdAt.toLocaleDateString(),
      
      // Product info - HTML formatted for unlimited products
      items_list: productListHTML,
      items_list_text: productListText, // Backup plain text version
      
      // Quantities and counts
      orders: order.items.length,
      units: order.items.reduce((sum, item) => sum + item.quantity, 0),
      
      // Pricing - properly formatted to avoid decimal issues
      subtotal: parseFloat(order.totals.subtotal.toFixed(2)),
      shipping: parseFloat(order.totals.shipping.toFixed(2)),
      tax: parseFloat(order.totals.tax.toFixed(2)),
      total: parseFloat(order.totals.total.toFixed(2)),
      cost: parseFloat(order.totals.total.toFixed(2)),
      
      // Legacy compatibility
      to_email: order.shippingAddress.email,
      to_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      from_name: 'Bella Simply Goods',
      company_email: 'hello@bellasimplygoods.com',
      company_phone: '+1 (555) 123-4567'
    };

    console.log('Sending email with params:', templateParams);

    return await this.sendEmail(this.templateIds.orderConfirmation, templateParams);
  }

  // Enhanced order status update with dynamic content
  async sendOrderStatusUpdate(order: Order, trackingNumber?: string): Promise<boolean> {
    const config = STATUS_CONFIG[order.status];
    
    if (!config) {
      console.warn(`No email configuration found for status: ${order.status}`);
      return false;
    }

    // Build template parameters with safe property access
    const templateParams: EmailTemplate = {
      // CRITICAL: EmailJS recipient info (must be first)
      to_email: order.shippingAddress.email,
      to_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      
      // Basic order info
      name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      order_id: order.orderNumber,
      order_date: order.createdAt.toLocaleDateString(),
      status: order.status.replace('_', ' ').toUpperCase(),
      
      // Subject line variables
      subject: `Order Update: ${order.status.replace('_', ' ').toUpperCase()} - Bella Simply Goods #${order.orderNumber}`,
      
      // Status-specific content
      status_class: config.status_class,
      status_message: config.status_message,
      status_content: config.status_content,
      
      // Conditional sections (these control what shows in template)
      show_tracking: config.show_tracking ? 'true' : '',
      show_cta: config.show_cta ? 'true' : '',
      show_feedback: config.show_feedback ? 'true' : '',
      
      // CTA information (with safe fallbacks)
      cta_text: config.cta_text || '',
      cta_link: config.cta_link || '',
      
      // Tracking information (if applicable)
      tracking_number: trackingNumber || '',
      carrier: 'FedEx', // You can make this dynamic
      estimated_delivery: order.estimatedDelivery?.toLocaleDateString() || '',
      
      // Feedback link (with safe fallback)
      feedback_link: config.feedback_link || '',
      
      // Company contact info
      from_name: 'Bella Simply Goods',
      company_email: 'hello@bellasimplygoods.com',
      company_phone: '+1 (555) 123-4567'
    };

    // Debug log to check email address
    console.log('Sending email to:', order.shippingAddress.email);
    console.log('Template params:', templateParams);

    return await this.sendEmail(this.templateIds.statusUpdate, templateParams);
  }

  // Keep existing feedback request method for backward compatibility
  async sendFeedbackRequest(order: Order): Promise<boolean> {
    // This is now handled automatically by sendOrderStatusUpdate when status is 'delivered'
    return await this.sendOrderStatusUpdate(order);
  }
}

// Singleton instance
export const emailService = new EmailService();

// Utility functions for different email types
export const sendOrderConfirmationEmail = (order: Order) => {
  return emailService.sendOrderConfirmation(order);
};

export const sendOrderUpdateEmail = (order: Order, trackingNumber?: string) => {
  return emailService.sendOrderStatusUpdate(order, trackingNumber);
};

export const sendFeedbackRequestEmail = (order: Order) => {
  return emailService.sendFeedbackRequest(order);
};