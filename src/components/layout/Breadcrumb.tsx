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
    <nav className={`py-4 px-4 ${className}`} aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isHome = item.route === 'home';
            
            return (
              <li key={item.label} className="flex items-center">
                {/* Home Icon */}
                {isHome && (
                  <Home size={16} className="mr-1 text-gray-500" />
                )}
                
                {/* Breadcrumb Item */}
                {item.route && !isLast ? (
                  <button
                    onClick={() => onNavigate(item.route!)}
                    className="text-gray-500 hover:text-amber-600 transition-colors font-medium"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span 
                    className={`${
                      isLast 
                        ? 'text-gray-900 font-semibold' 
                        : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
                
                {/* Separator */}
                {!isLast && (
                  <ChevronRight 
                    size={16} 
                    className="mx-2 text-gray-400" 
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