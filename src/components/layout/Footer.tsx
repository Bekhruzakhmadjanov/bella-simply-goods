import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import type { Route } from '../../types/common.types';

interface FooterProps {
  onNavigate?: (route: Route) => void;
  companyName?: string;
  supportEmail?: string;
  supportPhone?: string;
  showSocialLinks?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  onNavigate,
  companyName = 'Bella Simply Goods',
  supportEmail = 'hello@bellasimplygoods.com',
  supportPhone = '+1 (555) 123-4567',
  showSocialLinks = true
}) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Track Your Order', action: () => onNavigate?.('tracking') },
    { label: 'Shipping Info', action: () => window.open('#shipping', '_blank') },
    { label: 'Return Policy', action: () => window.open('#returns', '_blank') },
    { label: 'Privacy Policy', action: () => window.open('#privacy', '_blank') },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h3 className="text-xl font-bold">{companyName}</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Bringing authentic Dubai chocolate experience to your doorstep across America. 
              Handcrafted with premium ingredients and traditional techniques.
            </p>
            
            {/* Social Links */}
            {showSocialLinks && (
              <div className="flex space-x-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-gray-400 hover:text-amber-400 transition-colors"
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail size={16} className="flex-shrink-0" />
                <a 
                  href={`mailto:${supportEmail}`}
                  className="hover:text-amber-400 transition-colors text-sm"
                >
                  {supportEmail}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={16} className="flex-shrink-0" />
                <a 
                  href={`tel:${supportPhone}`}
                  className="hover:text-amber-400 transition-colors text-sm"
                >
                  {supportPhone}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin size={16} className="flex-shrink-0" />
                <span className="text-sm">Nationwide USA Delivery</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="block text-gray-300 hover:text-amber-400 transition-colors text-sm text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-300 text-sm">
              &copy; {currentYear} {companyName}. All rights reserved.
            </p>
            
            {/* Additional Info */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <span>🍫 Fresh Handmade Daily</span>
              <span>🚚 Free Shipping Over $50</span>
              <span>🔒 Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };