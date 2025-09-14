// src/services/emailService.ts
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

class EmailService {
  private serviceId: string;
  private templateIds: {
    orderConfirmation: string;
    orderStatusUpdate: string;
    welcomeAdmin: string;
    passwordReset: string;
  };

  constructor() {
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    this.templateIds = {
      orderConfirmation: import.meta.env.VITE_EMAILJS_ORDER_CONFIRMATION_TEMPLATE || '',
      orderStatusUpdate: import.meta.env.VITE_EMAILJS_ORDER_UPDATE_TEMPLATE || '',
      welcomeAdmin: import.meta.env.VITE_EMAILJS_WELCOME_ADMIN_TEMPLATE || '',
      passwordReset: import.meta.env.VITE_EMAILJS_PASSWORD_RESET_TEMPLATE || ''
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

  // Send order confirmation email
  async sendOrderConfirmation(order: Order): Promise<boolean> {
    const templateParams: EmailTemplate = {
      to_email: order.shippingAddress.email,
      to_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      from_name: 'Bella Simply Goods',
      order_number: order.orderNumber,
      order_total: `$${order.totals.total.toFixed(2)}`,
      order_date: order.createdAt.toLocaleDateString(),
      estimated_delivery: order.estimatedDelivery?.toLocaleDateString() || 'TBD',
      customer_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      shipping_address: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
      items_list: order.items.map(item => 
        `${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
      ).join('\n'),
      subtotal: `$${order.totals.subtotal.toFixed(2)}`,
      tax: `$${order.totals.tax.toFixed(2)}`,
      shipping: order.totals.shipping === 0 ? 'Free' : `$${order.totals.shipping.toFixed(2)}`,
      company_email: 'hello@bellasimplygoods.com',
      company_phone: '+1 (555) 123-4567'
    };

    return await this.sendEmail(this.templateIds.orderConfirmation, templateParams);
  }

  // Send order status update email
  async sendOrderStatusUpdate(order: Order, trackingNumber?: string): Promise<boolean> {
    const statusMessages = {
      placed: 'Your order has been placed and will be processed soon.',
      processing: 'Your order is being prepared with care.',
      shipped: 'Your order is on its way!',
      in_transit: 'Your order is currently in transit.',
      delivered: 'Your order has been delivered. Enjoy your delicious chocolate!',
      cancelled: 'Your order has been cancelled.'
    };

    const templateParams: EmailTemplate = {
      to_email: order.shippingAddress.email,
      to_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      from_name: 'Bella Simply Goods',
      order_number: order.orderNumber,
      status: order.status.replace('_', ' ').toUpperCase(),
      status_message: statusMessages[order.status] || 'Your order status has been updated.',
      tracking_number: trackingNumber || '',
      customer_name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      estimated_delivery: order.estimatedDelivery?.toLocaleDateString() || 'TBD',
      company_email: 'hello@bellasimplygoods.com',
      company_phone: '+1 (555) 123-4567'
    };

    return await this.sendEmail(this.templateIds.orderStatusUpdate, templateParams);
  }

  // Send welcome email to new admin
  async sendAdminWelcomeEmail(adminEmail: string, adminName: string, tempPassword: string): Promise<boolean> {
    const templateParams: EmailTemplate = {
      to_email: adminEmail,
      to_name: adminName,
      from_name: 'Bella Simply Goods',
      admin_name: adminName,
      admin_email: adminEmail,
      temp_password: tempPassword,
      login_url: `${window.location.origin}/admin`,
      company_name: 'Bella Simply Goods'
    };

    return await this.sendEmail(this.templateIds.welcomeAdmin, templateParams);
  }

  // Send newsletter subscription confirmation
  async sendNewsletterConfirmation(email: string, name?: string): Promise<boolean> {
    const templateParams: EmailTemplate = {
      to_email: email,
      to_name: name || 'Valued Customer',
      from_name: 'Bella Simply Goods',
      subscriber_name: name || 'Valued Customer',
      company_email: 'hello@bellasimplygoods.com',
      unsubscribe_url: `${window.location.origin}/unsubscribe?email=${encodeURIComponent(email)}`
    };

    // You can use the order confirmation template as a fallback or create a dedicated newsletter template
    return await this.sendEmail(this.templateIds.orderConfirmation, templateParams);
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

export const sendAdminWelcomeEmail = (email: string, name: string, password: string) => {
  return emailService.sendAdminWelcomeEmail(email, name, password);
};

export const sendNewsletterConfirmationEmail = (email: string, name?: string) => {
  return emailService.sendNewsletterConfirmation(email, name);
};