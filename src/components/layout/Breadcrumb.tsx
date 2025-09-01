import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import type { Route } from '../../types/common.types';

interface BreadcrumbItem {
  label: string;
  route?: Route;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (route: Route) => void;
  showHome?: boolean;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onNavigate,
  showHome = true,
  className = ''
}) => {
  const allItems: BreadcrumbItem[] = showHome 
    ? [{ label: 'Home', route: 'home' }, ...items]
    : items;

  return (
    <nav className={`py-6 px-6 bg-gradient-to-r from-green-100 to-emerald-50 ${className}`} aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-3 text-lg">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isHome = item.route === 'home';
            
            return (
              <li key={item.label} className="flex items-center">
                {/* Home Icon */}
                {isHome && (
                  <Home size={18} className="mr-2 text-yellow-800" />
                )}
                
                {/* Breadcrumb Item */}
                {item.route && !isLast ? (
                  <button
                    onClick={() => onNavigate(item.route!)}
                    className="text-gray-600 hover:text-amber-600 transition-colors font-semibold hover:bg-amber-50 px-3 py-1 rounded-lg"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span 
                    className={`${
                      isLast 
                        ? 'text-gray-900 font-bold bg-white px-3 py-1 rounded-lg shadow-sm border border-green-100' 
                        : 'text-gray-600'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
                
                {/* Separator */}
                {!isLast && (
                  <ChevronRight 
                    size={18} 
                    className="mx-3 text-gray-400" 
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export { Breadcrumb };