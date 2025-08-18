import type { Product } from '../types/product.types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Classic Dubai Chocolate",
    description: "Rich milk chocolate filled with crispy kataifi and premium pistachio cream",
    price: 24.99,
    image: "/api/placeholder/300/300",
    rating: 5,
    popular: true,
    inStock: true
  },
  {
    id: 2,
    name: "Dark Dubai Delight",
    description: "70% dark chocolate with roasted pistachios and honey-infused kataifi",
    price: 27.99,
    image: "/api/placeholder/300/300",
    rating: 5,
    popular: false,
    inStock: true
  },
  {
    id: 3,
    name: "White Dubai Dream",
    description: "Creamy white chocolate with candied pistachios and vanilla kataifi",
    price: 26.99,
    image: "/api/placeholder/300/300",
    rating: 4.9,
    popular: true,
    inStock: true
  },
  {
    id: 4,
    name: "Mixed Dubai Box",
    description: "Assortment of all three flavors - perfect for sharing or gifting",
    price: 75.99,
    image: "/api/placeholder/300/300",
    rating: 5,
    popular: true,
    inStock: true
  }
];