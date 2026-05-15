export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  description: string;
  variants?: {
    sizes?: string[];
    colors?: string[];
  };
  relatedProducts?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'shipped' | 'delivered';
  items: CartItem[];
  total: number;
}

export const categories = [
  { id: 'electronics', name: 'Electronics', icon: '💻' },
  { id: 'fashion', name: 'Fashion', icon: '👕' },
  { id: 'home', name: 'Home & Living', icon: '🏠' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'books', name: 'Books', icon: '📚' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'electronics',
    brand: 'AudioTech',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.',
    variants: { colors: ['Black', 'White', 'Blue', 'Red'] },
    relatedProducts: ['2', '3', '4'],
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    price: 299.99,
    rating: 4.8,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'electronics',
    brand: 'TechPro',
    description: 'Advanced fitness tracking, heart rate monitoring, GPS, and seamless smartphone integration.',
    variants: { sizes: ['38mm', '42mm', '44mm'], colors: ['Silver', 'Gold', 'Black'] },
    relatedProducts: ['1', '3', '5'],
  },
  {
    id: '3',
    name: 'Premium Running Shoes',
    price: 119.99,
    originalPrice: 159.99,
    rating: 4.6,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'sports',
    brand: 'SportMax',
    description: 'Lightweight running shoes with advanced cushioning technology and breathable mesh upper.',
    variants: { sizes: ['7', '8', '9', '10', '11', '12'], colors: ['White', 'Black', 'Blue', 'Red'] },
    relatedProducts: ['2', '6', '7'],
  },
  {
    id: '4',
    name: 'Laptop Backpack',
    price: 49.99,
    rating: 4.4,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    category: 'fashion',
    brand: 'TravelPro',
    description: 'Durable laptop backpack with multiple compartments, USB charging port, and water-resistant material.',
    variants: { colors: ['Black', 'Gray', 'Navy'] },
    relatedProducts: ['1', '2', '8'],
  },
  {
    id: '5',
    name: 'Wireless Charger Pad',
    price: 29.99,
    originalPrice: 49.99,
    rating: 4.3,
    reviews: 423,
    image: 'https://images.unsplash.com/photo-1591290619762-d2c9e86f0b63?w=500&h=500&fit=crop',
    category: 'electronics',
    brand: 'ChargeTech',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    variants: { colors: ['Black', 'White'] },
    relatedProducts: ['1', '2', '9'],
  },
  {
    id: '6',
    name: 'Fitness Tracker Band',
    price: 59.99,
    rating: 4.2,
    reviews: 789,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop',
    category: 'sports',
    brand: 'FitLife',
    description: 'Track your steps, calories, heart rate, and sleep with this sleek fitness band.',
    variants: { sizes: ['Small', 'Medium', 'Large'], colors: ['Black', 'Pink', 'Blue'] },
    relatedProducts: ['2', '3', '7'],
  },
  {
    id: '7',
    name: 'Yoga Mat Premium',
    price: 39.99,
    rating: 4.7,
    reviews: 1456,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
    category: 'sports',
    brand: 'YogaPro',
    description: 'Extra thick, non-slip yoga mat with carrying strap. Perfect for yoga and pilates.',
    variants: { colors: ['Purple', 'Pink', 'Blue', 'Green'] },
    relatedProducts: ['3', '6', '10'],
  },
  {
    id: '8',
    name: 'Ceramic Coffee Mug Set',
    price: 24.99,
    rating: 4.5,
    reviews: 634,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&h=500&fit=crop',
    category: 'home',
    brand: 'HomeEssentials',
    description: 'Set of 4 elegant ceramic mugs. Microwave and dishwasher safe.',
    variants: { colors: ['White', 'Black', 'Gray', 'Beige'] },
    relatedProducts: ['11', '12'],
  },
  {
    id: '9',
    name: 'Bluetooth Speaker Portable',
    price: 69.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviews: 912,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    category: 'electronics',
    brand: 'SoundWave',
    description: 'Waterproof portable speaker with 360° sound and 12-hour battery life.',
    variants: { colors: ['Black', 'Blue', 'Red', 'Green'] },
    relatedProducts: ['1', '5', '10'],
  },
  {
    id: '10',
    name: 'Stainless Steel Water Bottle',
    price: 19.99,
    rating: 4.8,
    reviews: 2145,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop',
    category: 'sports',
    brand: 'HydroMax',
    description: 'Insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    variants: { sizes: ['500ml', '750ml', '1000ml'], colors: ['Black', 'White', 'Blue', 'Pink'] },
    relatedProducts: ['3', '6', '7'],
  },
  {
    id: '11',
    name: 'Scented Candle Set',
    price: 34.99,
    rating: 4.4,
    reviews: 478,
    image: 'https://images.unsplash.com/photo-1602874801006-903a96bc7eb1?w=500&h=500&fit=crop',
    category: 'home',
    brand: 'AromaLife',
    description: 'Set of 3 premium scented candles with natural soy wax and essential oils.',
    relatedProducts: ['8', '12'],
  },
  {
    id: '12',
    name: 'Throw Pillow Cover Set',
    price: 27.99,
    rating: 4.3,
    reviews: 356,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&h=500&fit=crop',
    category: 'home',
    brand: 'CozyHome',
    description: 'Set of 4 decorative throw pillow covers in premium cotton fabric.',
    variants: { colors: ['Gray', 'Beige', 'Navy', 'Green'] },
    relatedProducts: ['8', '11'],
  },
];
