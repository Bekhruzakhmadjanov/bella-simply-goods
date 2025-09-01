import React, { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import type { Route } from '../../types/common.types';

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
    <header className="bg-white/95 backdrop-blur-md border-b-2 border-green-100 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNavigate('home')}
            className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-800 to-amber-900 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-800 via-amber-800 to-yellow-900 bg-clip-text text-transparent">
                {companyName}
              </h1>
              <p className="text-xs text-gray-600 font-medium">Authentic Dubai Chocolate</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map(({ route, label }) => (
              <button
                key={route}
                onClick={() => handleNavigate(route)}
                className={`text-lg font-semibold transition-all duration-300 py-2 px-4 rounded-xl ${
                  isActiveRoute(route)
                    ? 'text-white bg-yellow-800 border-2 border-amber-700'
                    : 'text-gray-700 hover:text-yellow-900 hover:bg-yellow-200'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right side - Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <button 
              onClick={() => handleNavigate('cart')}
              className="relative bg-yellow-800 text-white border-2 border-amber-700 px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg transform hover:scale-105"
            >
              <ShoppingCart size={22} />
              <span className="hidden sm:inline font-semibold">Cart ({cartCount})</span>
              <span className="sm:hidden font-semibold">({cartCount})</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 text-gray-700 hover:text-yellow-900 hover:bg-yellow-200 rounded-xl transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-green-100 py-6 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map(({ route, label }) => (
                <button
                  key={route}
                  onClick={() => handleNavigate(route)}
                  className={`text-left px-4 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                    isActiveRoute(route)
                      ? 'text-white bg-yellow-800 border-2 border-amber-700'
                      : 'text-gray-700 hover:text-yellow-900 hover:bg-yellow-200'
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