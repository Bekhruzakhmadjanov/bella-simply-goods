import React from 'react';
import type { Route } from '../../types/common.types';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (route: Route) => void;
  cartCount: number;
  currentRoute?: Route;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  onNavigate,
  cartCount,
  currentRoute = 'home',
  showHeader = true,
  showFooter = true,
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 ${className}`}>
      {/* Header */}
      {showHeader && (
        <Header 
          onNavigate={onNavigate}
          cartCount={cartCount}
          currentRoute={currentRoute}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <Footer onNavigate={onNavigate} />
      )}
    </div>
  );
};

export { Layout };