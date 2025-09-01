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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-800 to-amber-900 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{companyName}</h3>
                <p className="text-gray-300 text-sm">Authentic Dubai Chocolate</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 max-w-lg leading-relaxed text-lg">
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
                    className="w-12 h-12 bg-gradient-to-r from-yellow-800 to-amber-900 rounded-xl flex items-center justify-center text-white hover:from-amber-800 hover:to-yellow-900 transition-all duration-300 shadow-lg transform hover:scale-105"
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
            <h4 className="text-xl font-bold mb-6 text-yellow-600">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-yellow-800 rounded-lg flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <a 
                  href={`mailto:${supportEmail}`}
                  className="hover:text-amber-400 transition-colors"
                >
                  {supportEmail}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-yellow-800 rounded-lg flex items-center justify-center">
                  <Phone size={16} />
                </div>
                <a 
                  href={`tel:${supportPhone}`}
                  className="hover:text-amber-400 transition-colors"
                >
                  {supportPhone}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-yellow-800 rounded-lg flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <span>Nationwide USA Delivery</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-yellow-600">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map(({ label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="block text-gray-300 hover:text-amber-400 transition-colors text-left hover:bg-gray-800 px-3 py-2 rounded-lg w-full"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-300 text-lg">
              © {currentYear} {companyName}. All rights reserved.
            </p>
            
            {/* Additional Info */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mt-4 md:mt-0 text-gray-400">
              <span>Fresh Handmade Daily</span>
              <span>Free Shipping Over $50</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };