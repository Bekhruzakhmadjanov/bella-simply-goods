import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import type { Product } from '../types/product.types';
import type { Route } from '../types/common.types';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Button } from '../components/common/Button';

interface ProductsPageProps {
  products: Product[]; // Add this line
  onAddToCart: (product: Product) => void;
  onNavigate: (route: Route) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ products, onAddToCart, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name');

  // Get unique categories - filter out undefined values
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter((cat): cat is string => Boolean(cat))))];

  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen">
      <Breadcrumb 
        items={[{ label: 'All Products', isActive: true }]}
        onNavigate={onNavigate}
      />

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-800 via-amber-800 to-yellow-900 bg-clip-text text-transparent mb-6">
            All Products
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Discover our complete collection of authentic Dubai chocolate creations, 
            from classic bars to gift sets and specialty fillings.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-800 to-amber-900 mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* UPDATED Filters and Sort Section */}
      <section className="py-4 px-6 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            
            {/* Filter Row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-3 flex-shrink-0">
                <Filter className="text-yellow-800" size={20} />
                <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">Filter by:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-yellow-800 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and Results Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100">
              {/* Results Count */}
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  Showing {sortedProducts.length} of {products.length} products
                </span>
                {selectedCategory !== 'All' && (
                  <span className="ml-2 text-yellow-800 font-medium">
                    in "{selectedCategory}"
                  </span>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 min-w-[140px]"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Rating (Highest First)</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Active Filters (if category is selected) */}
            {selectedCategory !== 'All' && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Active:</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="hover:bg-yellow-200 rounded-full p-0.5 transition-colors"
                      aria-label="Remove filter"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">No products found</h3>
            <p className="text-gray-500 mb-8">Try selecting a different category or adjusting your filters.</p>
            <Button onClick={() => setSelectedCategory('All')}>
              Show All Products
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-yellow-200 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {product.popular && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                        Popular
                      </div>
                    )}
                    
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-yellow-800">
                      {product.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3 min-h-[4rem]">{product.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-amber-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600 font-medium">({product.rating})</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-yellow-800 to-amber-900 bg-clip-text text-transparent">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button 
                        onClick={() => onAddToCart(product)}
                        disabled={!product.inStock}
                        variant={product.inStock ? 'primary' : 'secondary'}
                        size="small"
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Can't decide?</h3>
          <p className="text-lg text-gray-600 mb-8">
            Try our popular gift set or start with a single bar to experience authentic Dubai chocolate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => {
                const giftSet = products.find(p => p.category === 'Gift Sets');
                if (giftSet) onAddToCart(giftSet);
              }}
              size="large"
            >
              Try Our Gift Set
            </Button>
            <Button 
              onClick={() => {
                const singleBar = products.find(p => p.category === 'Single Bars');
                if (singleBar) onAddToCart(singleBar);
              }}
              variant="outline"
              size="large"
            >
              Start with Single Bar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export { ProductsPage };