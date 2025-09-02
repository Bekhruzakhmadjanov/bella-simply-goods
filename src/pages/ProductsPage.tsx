import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import type { Product } from '../types/product.types';
import type { Route } from '../types/common.types';
import { Breadcrumb } from '../components/layout/Breadcrumb';
import { Button } from '../components/common/Button';

// All products data
const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Dubai chocolate, Pistachio chocolate, Knafeh milk chocolate",
    description: "Rich milk chocolate filled with crispy kataifi and premium pistachio cream",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop",
    rating: 5,
    popular: true,
    inStock: true,
    category: "Milk Chocolate"
  },
  {
    id: 2,
    name: "Dubai chocolate, Pistachio chocolate, Knafeh dark chocolate",
    description: "70% dark chocolate with roasted pistachios and honey-infused kataifi",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&h=400&fit=crop",
    rating: 5,
    popular: false,
    inStock: true,
    category: "Dark Chocolate"
  },
  {
    id: 3,
    name: "Dubai chocolate, Pistachio chocolate, Knafeh white chocolate",
    description: "Creamy white chocolate with candied pistachios and vanilla kataifi",
    price: 26.99,
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop",
    rating: 4.9,
    popular: false,
    inStock: true,
    category: "White Chocolate"
  },
  {
    id: 4,
    name: "Homemade Heart Shape Dubai Pistachio with Knafeh Milk Chocolate 6 piece with Gift Wrap",
    description: "Six heart-shaped milk chocolate pieces with pistachio and kataifi, beautifully gift wrapped - perfect for special occasions",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop",
    rating: 5,
    popular: true,
    inStock: true,
    category: "Gift Sets"
  },
  {
    id: 5,
    name: "DUBAI chocolate \"Original\" 1 single bar milk chocolate",
    description: "Get a taste of Original Dubai Chocolate - single milk chocolate bar perfect for trying our authentic recipe",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop",
    rating: 4.8,
    popular: true,
    inStock: true,
    category: "Single Bars"
  },
  {
    id: 6,
    name: "DUBAI chocolate \"Original\" 1 single bar dark chocolate",
    description: "Get a taste of Original Dubai Chocolate - single dark chocolate bar perfect for trying our authentic recipe",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&h=400&fit=crop",
    rating: 4.8,
    popular: false,
    inStock: true,
    category: "Single Bars"
  },
  {
    id: 7,
    name: "Dubai chocolate Original size. Pistachio Knafeh chocolate bar",
    description: "Only ONE Bar of Chocolate - original size Dubai chocolate bar with pistachio and kataifi filling",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop",
    rating: 4.9,
    popular: false,
    inStock: true,
    category: "Original Size"
  },
  {
    id: 8,
    name: "DUBAI CHOCOLATE FILLING",
    description: "Sweet, Crunchy and Buttery Taste - 1x Jar 13oz of our signature Dubai chocolate filling",
    price: 32.99,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    rating: 4.7,
    popular: false,
    inStock: true,
    category: "Fillings"
  }
];

interface ProductsPageProps {
  onAddToCart: (product: Product) => void;
  onNavigate: (route: Route) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onAddToCart, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name');

  // Get unique categories - filter out undefined values
  const categories = ['All', ...Array.from(new Set(ALL_PRODUCTS.map(p => p.category).filter((cat): cat is string => Boolean(cat))))];

  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(product => product.category === selectedCategory);

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

      {/* Filters and Sort */}
      <section className="py-8 px-6 bg-white border-b-2 border-yellow-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Category Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Filter className="text-yellow-800" size={20} />
                <span className="font-semibold text-gray-800">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-yellow-800 text-white shadow-lg'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-800">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-yellow-700 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-amber-800"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating (Highest First)</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-gray-600">
            Showing {sortedProducts.length} of {ALL_PRODUCTS.length} products
            {selectedCategory !== 'All' && (
              <span className="ml-2">
                in <span className="font-semibold text-yellow-800">{selectedCategory}</span>
              </span>
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
                const giftSet = ALL_PRODUCTS.find(p => p.category === 'Gift Sets');
                if (giftSet) onAddToCart(giftSet);
              }}
              size="large"
            >
              Try Our Gift Set
            </Button>
            <Button 
              onClick={() => {
                const singleBar = ALL_PRODUCTS.find(p => p.category === 'Single Bars');
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