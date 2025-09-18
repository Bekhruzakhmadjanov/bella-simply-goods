import type { Product } from '../types/product.types';

// All products for the products page
export const ALL_PRODUCTS: Product[] = [
  {
    id: "1", // Changed from number to string
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
    id: "2", // Changed from number to string
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
    id: "3", // Changed from number to string
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
    id: "4", // Changed from number to string
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
    id: "5", // Changed from number to string
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
    id: "6", // Changed from number to string
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
    id: "7", // Changed from number to string
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
    id: "8", // Changed from number to string
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

// Featured products for the homepage
export const FEATURED_PRODUCTS: Product[] = [
  ALL_PRODUCTS[0], // Dubai chocolate, Pistachio chocolate, Knafeh milk chocolate
  ALL_PRODUCTS[1], // Dubai chocolate, Pistachio chocolate, Knafeh dark chocolate
  ALL_PRODUCTS[3], // Homemade Heart Shape Dubai Pistachio with Knafeh Milk Chocolate 6 piece with Gift Wrap
  ALL_PRODUCTS[4], // DUBAI chocolate "Original" 1 single bar milk chocolate
];