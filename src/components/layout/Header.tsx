import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Route } from '../../types/common.types';
import { CartIcon } from '../cart/CartIcon';

interface HeaderProps {
  onNavigate: (route: Route) => void;
  cartCount: number;
  currentRoute?: Route;
  companyName?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavigate, 
  cartCount, 
  currentRoute = 'home',
  companyName = 'Bella Simply Goods'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { route: 'home' as Route, label: 'Home' },
    { route: 'tracking' as Route, label: 'Track Order' },
  ];

  const handleNavigate = (route: Route) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (route: Route) => currentRoute === route;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigate('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {companyName}
            </h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map(({ route, label }) => (
              <button
                key={route}
                onClick={() => handleNavigate(route)}
                className={`text-sm font-medium transition-colors py-2 ${
                  isActiveRoute(route)
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right side - Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <CartIcon 
              count={cartCount} 
              onClick={() => handleNavigate('cart')}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map(({ route, label }) => (
                <button
                  key={route}
                  onClick={() => handleNavigate(route)}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute(route)
                      ? 'text-sky-600 bg-sky-50'
                      : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export { Header };