/* PRESSMART APP LOGIC */
const PAGE_TYPE = document.body.dataset.page || 'home';
const STORAGE_KEYS = {
  cart: 'pressmart_cart',
  wishlist: 'pressmart_wishlist',
  reviews: 'pressmart_reviews',
  orders: 'pressmart_orders',
  buyNow: 'pressmart_buy_now',
  lastOrder: 'pressmart_last_order',
};

const USER_STORAGE_KEYS = {
  account: 'pressmart_user',
  session: 'pressmart_user_session',
};

let searchModalEscapeHandler = null;

let blogArticles = [
  {
    id: 'a1',
    title: 'Holiday Fashion Trends in 2026',
    category: 'Style',
    date: 'June 1, 2026',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80',
    excerpt: 'Find the season’s freshest looks, from statement outerwear to everyday wardrobe essentials.',
    content: ['This season brings bold silhouettes, elevated basics, and effortless styling for every wardrobe. Mix tailored layers with casual accessories to create a look that feels modern and wearable.', 'Choose quality pieces that work both for work and for weekend moments. Our collection blends timeless materials with current shapes so you can shop once and wear often.', 'Don’t forget to accessorize with pieces that bring contrast and polish to any outfit. Shoes, bags, and minimal jewelry complete the perfect PressMart edit.'],
  },
  {
    id: 'a2',
    title: 'The Best Travel Essentials for Any Trip',
    category: 'Lifestyle',
    date: 'May 20, 2026',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80',
    excerpt: 'From carry-on bags to wardrobe staples, pack smart with versatile items built for travel.',
    content: ['Travel light without leaving comfort behind. Select pieces that layer well, resist wrinkles, and keep you ready for unexpected plans.', 'A compact backpack and a durable bag are essential for keeping your gear organized. Look for products that are stylish and practical so you can stay ready on the go.', 'Finish your travel wardrobe with shoes that are comfortable for walking and simple enough to pair with multiple looks. You’ll save space and still look polished.'],
  },
  {
    id: 'a3',
    title: 'How to Style Everyday Accessories',
    category: 'Guides',
    date: 'April 15, 2026',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
    excerpt: 'Learn how a few smart accessories can elevate even the simplest outfits.',
    content: ['Accessories are the easiest way to give any outfit more personality. Choose pieces that work across multiple looks for maximum versatility.', 'A good belt, a clean watch, and a polished bag can transform your daily wardrobe with minimal effort. They also make great gifts for those who love practical style.', 'Mix metals carefully and keep your palette cohesive. When your accessories complement each other, your entire look feels intentional and finished.'],
  },
];

let homeHeroProducts = ['p1', 'p2', 'p3'];
let homeHeroBanners = [];
let heroSlideIndex = 0;
let heroSlideTimer = null;
const heroSlideInterval = 6000;

let productCatalog = [
  {
    id: 'p1',
    title: 'Tan Solid Laptop Backpack',
    category: 'Backpacks',
    brand: 'PressMart',
    description: 'A sturdy, water-resistant backpack with organized storage for your laptop, charger, and daily essentials.',
    specs: ['Material: Water-resistant polyester', 'Dimensions: 18 x 12 x 6 in', 'Weight: 1.2 kg', 'Warranty: 1 year'],
    sizes: ['S', 'M', 'L'],
    colors: ['Tan', 'Black', 'Brown'],
    stock: 28,
    price: 149.0,
    oldPrice: 185.0,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.2,
    reviewCount: 24,
    images: [
      'IMAGES/BACKPACK.webp',
      'IMAGES/HANDBAG.webp',
      'IMAGES/WOMEN.webp',
      'IMAGES/Valink-2019-Hot-Sale-Men-s-Wallet-Fashion-Pu-Leather-Men-Wallets-Luxury-Brand-Male-Purses-3.jpg',
    ],
    tags: ['best-selling'],
    relatedIds: ['p2', 'p5', 'p9'],
    recommendedIds: ['p3', 'p8'],
    frequentlyBoughtTogether: ['p5', 'p8'],
    reviews: [
      {name: 'Ayesha', rating: 5, verified: true, date: 'June 2, 2026', comment: 'Great volume for daily commute and travel.'},
      {name: 'Raj', rating: 4, verified: true, date: 'May 28, 2026', comment: 'Comfortable straps and enough pockets.'},
      {name: 'Nina', rating: 4, verified: false, date: 'May 18, 2026', comment: 'Strong fabric and clean build.'},
    ],
  },
  {
    id: 'p2',
    title: 'Brown Solid Biker Jacket',
    category: 'Jackets',
    brand: 'PressMart',
    description: 'A sleek biker jacket crafted for a polished look with durable zipper detailing and warm lining.',
    specs: ['Material: Faux leather', 'Fit: Slim', 'Wash care: Dry clean only', 'Lining: Soft polyester'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Brown', 'Black'],
    stock: 14,
    price: 110.0,
    oldPrice: 120.0,
    delivery: '3-5 business days',
    returns: '30-day free returns',
    rating: 4.4,
    reviewCount: 18,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80',
      'https://images.unsplash.com/photo-1523381219952-7c236d8f810e?w=900&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80',
      'https://images.unsplash.com/photo-1472417583565-62e7bdeda490?w=900&q=80',
    ],
    tags: ['best-selling'],
    relatedIds: ['p1', 'p7', 'p9'],
    recommendedIds: ['p4', 'p6'],
    frequentlyBoughtTogether: ['p8', 'p3'],
    reviews: [
      {name: 'Maya', rating: 5, verified: true, date: 'June 5, 2026', comment: 'Perfect fit and very stylish.'},
      {name: 'Vikram', rating: 4, verified: true, date: 'May 29, 2026', comment: 'Great look, good for evenings.'},
    ],
  },
  {
    id: 'p3',
    title: 'Men Brown Solid Mid-Top Boots',
    category: 'Casual Shoes, Sneakers',
    brand: 'PressMart',
    description: 'Durable mid-top boots with a cushioned sole and rugged finish for everyday comfort.',
    specs: ['Material: Leather blend', 'Sole: Rubber', 'Closure: Lace-up', 'Water resistance: Light'],
    sizes: ['7', '8', '9', '10'],
    colors: ['Brown', 'Tan', 'Black'],
    stock: 20,
    price: 115.0,
    oldPrice: null,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.8,
    reviewCount: 9,
    images: [
      'IMAGES/shoes.webp',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=900&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
      'https://images.unsplash.com/photo-1512418490979-92798cec7b0f?w=900&q=80',
    ],
    tags: ['new-arrival'],
    relatedIds: ['p7', 'p11', 'p15'],
    recommendedIds: ['p5', 'p9'],
    frequentlyBoughtTogether: ['p4', 'p8'],
    reviews: [
      {name: 'Simran', rating: 5, verified: true, date: 'June 8, 2026', comment: 'Very comfortable and stylish.'},
      {name: 'Harman', rating: 4, verified: false, date: 'May 22, 2026', comment: 'Quality is strong and fit is great.'},
    ],
  },
  {
    id: 'p4',
    title: 'Felite Olive Green Solid Top',
    category: 'Dresses & Tops',
    brand: 'PressMart',
    description: 'A breathable top designed for comfort and easy styling, with a soft finish and modern silhouette.',
    specs: ['Material: Cotton blend', 'Fit: Regular', 'Care: Machine wash cold', 'Stretch: Mild'],
    sizes: ['S', 'M', 'L'],
    colors: ['Olive Green', 'Black'],
    stock: 32,
    price: 49.0,
    oldPrice: null,
    delivery: '2-3 business days',
    returns: '30-day free returns',
    rating: 3.6,
    reviewCount: 12,
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=80',
    ],
    tags: ['top-rated'],
    relatedIds: ['p7', 'p11'],
    recommendedIds: ['p2', 'p6'],
    frequentlyBoughtTogether: ['p9', 'p5'],
    reviews: [
      {name: 'Priya', rating: 4, verified: true, date: 'June 1, 2026', comment: 'Nice fabric and it fits well.'},
    ],
  },
  {
    id: 'p5',
    title: 'Brown Solid Laptop Bag',
    category: 'Handbags, Women Bags',
    brand: 'PressMart',
    description: 'A classic laptop bag with structured storage, premium straps, and elegant detailing.',
    specs: ['Material: Polyester blend', 'Compartments: 3', 'Closure: Zipper', 'Laptop size: Up to 15.6 in'],
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    stock: 17,
    price: 99.0,
    oldPrice: 120.0,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.5,
    reviewCount: 21,
    images: [
      'IMAGES/bag 1.webp',
      'IMAGES/bag2.webp',
      'IMAGES/bag 3.webp',
      'IMAGES/HANDBAG.webp',
    ],
    tags: ['best-selling'],
    relatedIds: ['p1', 'p7'],
    recommendedIds: ['p8', 'p11'],
    frequentlyBoughtTogether: ['p1', 'p8'],
    reviews: [
      {name: 'Rina', rating: 5, verified: true, date: 'May 30, 2026', comment: 'Beautiful and durable bag.'},
      {name: 'Arjun', rating: 4, verified: false, date: 'May 10, 2026', comment: 'Great for travel and office.'},
    ],
  },
  {
    id: 'p6',
    title: 'Analog Watches Black Regular',
    category: 'Analog Watches, Digital',
    brand: 'PressMart',
    description: 'A premium everyday watch with clean styling and a reliable analog movement.',
    specs: ['Case diameter: 42 mm', 'Band material: Leather', 'Water resistance: 30m', 'Warranty: 2 years'],
    sizes: ['One Size'],
    colors: ['Black', 'Silver'],
    stock: 10,
    price: 1599.0,
    oldPrice: null,
    delivery: '3-5 business days',
    returns: '30-day free returns',
    rating: 4.0,
    reviewCount: 6,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=900&q=80',
      'https://images.unsplash.com/photo-1536305030013-45074c33c96b?w=900&q=80',
    ],
    tags: ['best-selling'],
    relatedIds: ['p4', 'p9'],
    recommendedIds: ['p2', 'p11'],
    frequentlyBoughtTogether: ['p1', 'p3'],
    reviews: [
      {name: 'Dev', rating: 4, verified: true, date: 'May 24, 2026', comment: 'Feels premium and looks sharp.'},
    ],
  },
  {
    id: 'p7',
    title: 'Navy Blue Self Design Shoulder Bag',
    category: 'Handbags',
    brand: 'PressMart',
    description: 'A casual shoulder bag with a textured finish and versatile styling for everyday use.',
    specs: ['Material: Synthetic leather', 'Strap: Adjustable', 'Closure: Snap', 'Interior pockets: 2'],
    sizes: ['One Size'],
    colors: ['Navy Blue', 'Beige'],
    stock: 22,
    price: 78.0,
    oldPrice: null,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.3,
    reviewCount: 11,
    images: [
      'IMAGES/bag 3.webp',
      'IMAGES/bag 1.webp',
      'IMAGES/bag2.webp',
      'IMAGES/HANDBAG.webp',
    ],
    tags: ['new-arrival'],
    relatedIds: ['p5', 'p3'],
    recommendedIds: ['p8', 'p2'],
    frequentlyBoughtTogether: ['p1', 'p5'],
    reviews: [
      {name: 'Mira', rating: 5, verified: true, date: 'June 4, 2026', comment: 'Nice color and lightweight.'},
    ],
  },
  {
    id: 'p8',
    title: 'Brown Solid Leather Belt',
    category: 'Belts',
    brand: 'PressMart',
    description: 'A polished leather belt that works with both casual and formal outfits.',
    specs: ['Material: Genuine leather', 'Buckle: Metal pin', 'Width: 1.25 in', 'Length: 40 in adjustable'],
    sizes: ['S', 'M', 'L'],
    colors: ['Brown', 'Black'],
    stock: 25,
    price: 15.0,
    oldPrice: 50.0,
    delivery: '2-3 business days',
    returns: '30-day free returns',
    rating: 4.7,
    reviewCount: 20,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=80',
    ],
    tags: ['top-rated'],
    relatedIds: ['p9', 'p1'],
    recommendedIds: ['p5', 'p7'],
    frequentlyBoughtTogether: ['p1', 'p5'],
    reviews: [
      {name: 'Neha', rating: 5, verified: true, date: 'June 3, 2026', comment: 'Excellent quality for the price.'},
    ],
  },
  {
    id: 'p9',
    title: 'Aviator Frame Laptop',
    category: 'Laptops',
    brand: 'PressMart',
    description: 'A premium ultrabook with a crisp display, powerful performance, and elegant design.',
    specs: ['Processor: Intel i5', 'RAM: 16GB', 'Storage: 512GB SSD', 'Battery: 10 hrs'],
    sizes: ['13 inch', '15 inch'],
    colors: ['Silver', 'Space Gray'],
    stock: 9,
    price: 119.0,
    oldPrice: 139.0,
    delivery: '4-6 business days',
    returns: '30-day free returns',
    rating: 4.3,
    reviewCount: 19,
    images: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=900&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=80',
    ],
    tags: ['best-selling'],
    relatedIds: ['p2', 'p6'],
    recommendedIds: ['p1', 'p5'],
    frequentlyBoughtTogether: ['p1', 'p8'],
    reviews: [
      {name: 'Satish', rating: 4, verified: true, date: 'June 7, 2026', comment: 'Lightweight and reliable performance.'},
    ],
  },
  {
    id: 'p10',
    title: 'Black Fitness Smartwatch',
    category: 'Smartwear',
    brand: 'PressMart',
    description: 'A smart wearable with health tracking, activity monitoring, and a responsive touchscreen.',
    specs: ['Display: AMOLED', 'Battery: 7 days', 'Water resistance: IP68', 'Sensors: HR, SpO2, sleep'],
    sizes: ['One Size'],
    colors: ['Black'],
    stock: 13,
    price: 129.0,
    oldPrice: null,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.6,
    reviewCount: 41,
    images: [
      'IMAGES/pexels-photo-277390.jpeg',
      'https://images.unsplash.com/photo-1544198365-19e4f6b99877?w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
    ],
    tags: ['new-arrival'],
    relatedIds: ['p6', 'p11'],
    recommendedIds: ['p10', 'p5'],
    frequentlyBoughtTogether: ['p11', 'p5'],
    reviews: [
      {name: 'Anika', rating: 5, verified: true, date: 'June 6, 2026', comment: 'Perfect tracking and long battery life.'},
      {name: 'Ishan', rating: 4, verified: false, date: 'May 20, 2026', comment: 'Feels premium on the wrist.'},
    ],
  },
  {
    id: 'p11',
    title: 'White Minimal Sneakers',
    category: 'Casual Shoes',
    brand: 'PressMart',
    description: 'Minimal sneakers with a soft sole, breathable upper, and clean modern profile for daily wear.',
    specs: ['Material: Mesh and synthetic', 'Sole: Rubber', 'Closure: Lace-up', 'Insole: Cushioned'],
    sizes: ['7', '8', '9', '10'],
    colors: ['White'],
    stock: 21,
    price: 89.0,
    oldPrice: null,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.9,
    reviewCount: 10,
    images: [
      'IMAGES/istockphoto-1394359723-612x612.jpg',
      'IMAGES/shoes.webp',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80',
    ],
    tags: ['top-rated'],
    relatedIds: ['p3', 'p10', 'p15'],
    recommendedIds: ['p11', 'p5'],
    frequentlyBoughtTogether: ['p3', 'p5'],
    reviews: [
      {name: 'Karan', rating: 5, verified: true, date: 'June 9, 2026', comment: 'Super comfy and great look.'},
    ],
  },
  {
    id: 'p12',
    title: 'Genuine Leather Travel Wallet',
    category: 'Wallets',
    brand: 'PressMart',
    description: 'A compact travel wallet with multiple card slots, bill compartment, and a premium leather finish.',
    specs: ['Material: Genuine leather', 'Slots: 10', 'Closure: Snap', 'Dimensions: 5 x 4 in'],
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    stock: 34,
    price: 39.0,
    oldPrice: 43.0,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.3,
    reviewCount: 16,
    images: [
      'IMAGES/Valink-2019-Hot-Sale-Men-s-Wallet-Fashion-Pu-Leather-Men-Wallets-Luxury-Brand-Male-Purses-3.jpg',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=80',
    ],
    tags: ['best-selling'],
    relatedIds: ['p8', 'p5'],
    recommendedIds: ['p1', 'p7'],
    frequentlyBoughtTogether: ['p8', 'p1'],
    reviews: [
      {name: 'Sonal', rating: 4, verified: true, date: 'May 26, 2026', comment: 'Very handy and well-made.'},
    ],
  },
  {
    id: 'p13',
    title: 'Heritage Leather Backpack',
    category: 'Backpacks',
    brand: 'PressMart',
    description: 'A refined leather backpack with padded laptop protection and polished hardware for everyday travel.',
    specs: ['Material: Genuine leather', 'Dimensions: 17 x 12 x 6 in', 'Laptop sleeve: 15 in', 'Warranty: 1 year'],
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    stock: 18,
    price: 129.0,
    oldPrice: 159.0,
    delivery: '3-5 business days',
    returns: '30-day free returns',
    rating: 4.6,
    reviewCount: 12,
    images: [
      'IMAGES/Best-Mens-Leather-Backpacks.jpg',
      'IMAGES/BACKPACK.webp',
      'IMAGES/HANDBAG.webp',
      'IMAGES/Valink-2019-Hot-Sale-Men-s-Wallet-Fashion-Pu-Leather-Men-Wallets-Luxury-Brand-Male-Purses-3.jpg',
    ],
    tags: ['best-selling'],
    relatedIds: ['p1', 'p5'],
    recommendedIds: ['p2', 'p8'],
    frequentlyBoughtTogether: ['p5', 'p8'],
    reviews: [
      {name: 'Irfan', rating: 5, verified: true, date: 'June 10, 2026', comment: 'The leather feels premium and the pockets are very useful.'},
    ],
  },
  {
    id: 'p14',
    title: 'Fashion Men Formal Shirt',
    category: "Men's Clothing",
    brand: 'PressMart',
    description: 'A crisp shirt designed for office or evening wear, crafted from breathable fabric with a modern fit.',
    specs: ['Material: Cotton blend', 'Fit: Slim', 'Care: Machine wash cold', 'Collar: Spread'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Navy'],
    stock: 26,
    price: 45.0,
    oldPrice: 62.0,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.4,
    reviewCount: 8,
    images: [
      'IMAGES/fashion men.webp',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80',
    ],
    tags: ['new-arrival'],
    relatedIds: ['p4', 'p7'],
    recommendedIds: ['p2', 'p6'],
    frequentlyBoughtTogether: ['p9', 'p11'],
    reviews: [
      {name: 'Sameer', rating: 5, verified: true, date: 'June 8, 2026', comment: 'Looks sharp and fits perfectly.'},
    ],
  },
  {
    id: 'p15',
    title: 'Street Style Runner Shoes',
    category: 'Sports Shoes',
    brand: 'PressMart',
    description: 'Lightweight runners with a flexible sole and breathable upper designed for everyday comfort.',
    specs: ['Material: Mesh upper', 'Sole: EVA foam', 'Closure: Lace-up', 'Weight: 320g'],
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Black', 'Gray'],
    stock: 24,
    price: 65.0,
    oldPrice: 79.0,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.5,
    reviewCount: 18,
    images: [
      'IMAGES/shoes.webp',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=900&q=80',
    ],
    tags: ['top-rated'],
    relatedIds: ['p3', 'p11'],
    recommendedIds: ['p5', 'p8'],
    frequentlyBoughtTogether: ['p1', 'p9'],
    reviews: [
      {name: 'Rajat', rating: 4, verified: true, date: 'June 7, 2026', comment: 'Perfect everyday shoe with good support.'},
    ],
  },
  {
    id: 'p16',
    title: 'Modern Digital Watch',
    category: 'Watches',
    brand: 'PressMart',
    description: 'A sleek digital watch with a comfortable silicone strap and clear display for daily wear.',
    specs: ['Display: LED', 'Water resistance: 5 ATM', 'Battery: 12 months', 'Strap: Silicone'],
    sizes: ['One Size'],
    colors: ['Black'],
    stock: 12,
    price: 89.0,
    oldPrice: 119.0,
    delivery: '2-3 business days',
    returns: '30-day free returns',
    rating: 4.2,
    reviewCount: 14,
    images: [
      'IMAGES/WATCH.webp',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&q=80',
    ],
    tags: ['best-selling'],
    relatedIds: ['p6', 'p10'],
    recommendedIds: ['p2', 'p8'],
    frequentlyBoughtTogether: ['p1', 'p3'],
    reviews: [
      {name: 'Preet', rating: 5, verified: true, date: 'June 9, 2026', comment: 'Very comfortable and looks premium.'},
    ],
  },
  {
    id: 'p17',
    title: 'Luxury Accessory Gift Set',
    category: 'Accessories',
    brand: 'PressMart',
    description: 'A curated gift set with stylish accessories that complement any outfit.',
    specs: ['Contents: Hat, sunglasses, wallet', 'Material: Mixed', 'Packaging: Gift box', 'Care: Wipe clean'],
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    stock: 20,
    price: 79.0,
    oldPrice: 99.0,
    delivery: '2-4 business days',
    returns: '30-day free returns',
    rating: 4.7,
    reviewCount: 22,
    images: [
      'IMAGES/flat-lay-fashion-accessories-with-white-brown-hats-sunglasses-jewelry-makeup_1088041-21243.avif',
      'IMAGES/HANDBAG.webp',
      'IMAGES/BACKPACK.webp',
    ],
    tags: ['new-arrival'],
    relatedIds: ['p5', 'p7'],
    recommendedIds: ['p8', 'p12'],
    frequentlyBoughtTogether: ['p1', 'p13'],
    reviews: [
      {name: 'Shilpa', rating: 5, verified: true, date: 'June 11, 2026', comment: 'Great set for gifting or everyday use.'},
    ],
  },
];

// Attempt to load dynamic data from backend API and replace static arrays.
async function loadBackendData() {
  const base = window.API_BASE || 'http://127.0.0.1:5000/api';
  try {
    const [productsRes, bannersRes, promosRes, blogRes] = await Promise.all([
      fetch(base + '/products'),
      fetch(base + '/banners'),
      fetch(base + '/promos'),
      fetch(base + '/blog')
    ]);

    if (productsRes.ok) {
      const products = await productsRes.json();
      if (Array.isArray(products) && products.length) {
        const normalizeArray = value => {
          if (Array.isArray(value)) return value;
          if (typeof value === 'string') return value.split(',').map(item => item.trim()).filter(Boolean);
          return [];
        };

        const normalizeProductId = value => String(value).toLowerCase().replace(/^p/, '').trim();

        const backendProducts = products.map(p => {
          const existing = productCatalog.find(item => normalizeProductId(item.id) === normalizeProductId(p.id));
          const rating = Number(p.rating);
          const reviewCount = Number(p.review_count ?? p.reviewCount);
          return {
            id: String(p.id),
            title: p.name || p.title || existing?.title || `Product ${p.id}`,
            category: p.category || existing?.category || '',
            brand: p.brand || existing?.brand || '',
            description: p.description || existing?.description || '',
            specs: normalizeArray(p.specs || existing?.specs),
            sizes: normalizeArray(p.sizes || existing?.sizes),
            colors: normalizeArray(p.colors || existing?.colors),
            stock: Number(p.stock) || existing?.stock || 0,
            price: Number(p.price) || existing?.price || 0,
            oldPrice: p.old_price || p.oldPrice || existing?.oldPrice || null,
            delivery: p.delivery || existing?.delivery || '2-4 business days',
            returns: p.returns || existing?.returns || '30-day free returns',
            rating: Number.isFinite(rating) && rating >= 0 ? rating : existing?.rating || 0,
            reviewCount: Number.isFinite(reviewCount) && reviewCount >= 0 ? reviewCount : existing?.reviewCount || 0,
            images: p.image_url ? [p.image_url] : (Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? [p.images] : existing?.images || ['IMAGES/placeholder.png'])),
            tags: normalizeArray(p.tags || existing?.tags),
            relatedIds: normalizeArray(p.related_ids || p.relatedIds || existing?.relatedIds),
            recommendedIds: normalizeArray(p.recommended_ids || p.recommendedIds || existing?.recommendedIds),
            frequentlyBoughtTogether: normalizeArray(p.frequently_bought_together || p.frequentlyBoughtTogether || existing?.frequentlyBoughtTogether),
            reviews: Array.isArray(p.reviews) ? p.reviews : existing?.reviews || []
          };
        });

        // Merge backend products into productCatalog without removing static ones
        backendProducts.forEach(bp => {
          const idx = productCatalog.findIndex(item => normalizeProductId(item.id) === normalizeProductId(bp.id));
          if (idx >= 0) {
            productCatalog[idx] = bp;
          } else {
            productCatalog.push(bp);
          }
        });
      }
    }

    if (bannersRes.ok) {
      const banners = await bannersRes.json();
      if (Array.isArray(banners) && banners.length) {
        homeHeroBanners = banners.map(b => ({
          id: b.id,
          title: b.title || 'Banner',
          subtext: b.subtext || '',
          description: b.description || '',
          image: b.image_url || b.image || 'IMAGES/placeholder.png',
          cta: b.cta_label || b.cta || 'Shop now',
          link: b.cta_link || b.link || 'shop.html',
          type: b.type || 'homepage',
          status: b.status || 'Active'
        }));
        homeHeroProducts = homeHeroBanners.map(b => b.link || 'shop.html');
      }
    }

    if (promosRes.ok) {
      const promos = await promosRes.json();
      if (Array.isArray(promos) && promos.length) window.promos = promos;
    }

    if (blogRes.ok) {
      const posts = await blogRes.json();
      if (Array.isArray(posts) && posts.length) {
        blogArticles = posts.map(post => ({
          id: post.id,
          title: post.title || 'Blog Post',
          category: post.author || 'Blog',
          date: post.published_at ? new Date(post.published_at).toLocaleDateString() : new Date().toLocaleDateString(),
          image: post.image_url || post.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&q=80',
          excerpt: post.excerpt || '',
          content: Array.isArray(post.content) ? post.content : (typeof post.content === 'string' ? post.content.split(/\r?\n\r?\n/).filter(Boolean) : [])
        }));
      }
    }
  } catch (err) {
    // silent fail — keep static data
    console.warn('Could not load backend data:', err);
  }
}

function renderHomeHeroSlider() {
  const slidesContainer = document.getElementById('heroSlides');
  const dotsContainer = document.getElementById('heroDots');
  if (!slidesContainer || !dotsContainer) return;

  const banners = homeHeroBanners.length ? homeHeroBanners : [
    {
      title: 'Season Sale',
      subtext: 'MEN\'S FASHION',
      description: 'Min. 35–70% Off',
      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&q=80',
      cta: 'SHOP NOW',
      link: 'shop.html'
    },
    {
      title: 'New Arrival',
      subtext: 'WOMEN\'S FASHION',
      description: 'Up to 50% Off',
      image: 'IMAGES/WOMEN.webp',
      cta: 'SHOP NOW',
      link: 'shop.html'
    },
    {
      title: 'Trending',
      subtext: 'ACCESSORIES',
      description: 'Latest Collection',
      image: 'IMAGES/flat-lay-fashion-accessories-with-white-brown-hats-sunglasses-jewelry-makeup_1088041-21243.avif',
      cta: 'SHOP NOW',
      link: 'shop.html'
    }
  ];

  slidesContainer.innerHTML = banners.map((banner, index) => `
    <div class="slide slide-${(index % 3) + 1} ${index === 0 ? 'active' : ''}">
      <div class="hero-text">
        <h3>${banner.title}</h3>
        <h1>${banner.subtext}</h1>
        <p>${banner.description}</p>
        <div class="hero-btns">
          <button class="btn-primary">${banner.cta}</button>
        </div>
      </div>
      <div class="hero-img">
        <img src="${banner.image}" alt="${banner.title}">
      </div>
    </div>
  `).join('');

  dotsContainer.innerHTML = banners.map((_, index) => `
    <div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
  `).join('');

  slidesContainer.querySelectorAll('.btn-primary').forEach((button, index) => {
    button.addEventListener('click', () => {
      window.location.href = banners[index]?.link || 'shop.html';
    });
  });

  setupHeroSlider();
}

function setHeroSlide(index) {
  const slides = document.querySelectorAll('#heroSlides .slide');
  const dots = document.querySelectorAll('#heroDots .dot');
  if (!slides.length) return;
  heroSlideIndex = ((index % slides.length) + slides.length) % slides.length;
  
  const track = document.getElementById('heroSlides');
  if (track) {
    track.style.transform = `translateX(-${heroSlideIndex * 100}%)`;
  }
  
  slides.forEach((slide, idx) => slide.classList.toggle('active', idx === heroSlideIndex));
  dots.forEach((dot, idx) => dot.classList.toggle('active', idx === heroSlideIndex));
}

function resetHeroAutoplay() {
  clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(() => setHeroSlide(heroSlideIndex + 1), heroSlideInterval);
}

function setupHeroSlider() {
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  const dots = document.querySelectorAll('#heroDots .dot');
  const slidesContainer = document.getElementById('heroSlides');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      setHeroSlide(heroSlideIndex - 1);
      resetHeroAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      setHeroSlide(heroSlideIndex + 1);
      resetHeroAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.index);
      setHeroSlide(index);
      resetHeroAutoplay();
    });
  });

  if (slidesContainer) {
    slidesContainer.addEventListener('mouseenter', () => clearInterval(heroSlideTimer));
    slidesContainer.addEventListener('mouseleave', () => resetHeroAutoplay());
  }

  resetHeroAutoplay();
}

// Load backend data first, then initialize the UI so pages render live values.
async function main() {
  await loadBackendData();
  renderHomeHeroSlider();
  setupWishlistDelegation();
  initPage();
  setupCartPanel();
}

// Start the app
main();
const cartPanelTemplate = `
  <div class="cart-drawer" id="cartDrawer" aria-hidden="true">
    <div class="cart-backdrop" id="cartBackdrop"></div>
    <div class="cart-panel-content">
      <div class="cart-panel-header">
        <h3>Shopping Cart</h3>
        <button type="button" class="cart-close" id="cartCloseBtn" aria-label="Close cart">×</button>
      </div>
      <div class="cart-panel-body" id="cartPanelBody"></div>
      <div class="cart-panel-footer">
        <div class="cart-summary-line"><span>Subtotal</span><span id="cartSubtotal">$0.00</span></div>
        <button type="button" class="btn-primary" id="cartCheckoutBtn">Proceed to Checkout</button>
      </div>
    </div>
  </div>
`;

function getLocalStorageJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || fallback);
  } catch (error) {
    return JSON.parse(fallback);
  }
}

function saveLocalStorageJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCart() {
  const cart = getLocalStorageJson(STORAGE_KEYS.cart, '[]');
  return Array.isArray(cart)
    ? cart.map(item => ({ ...item, id: String(item.id) }))
    : [];
}

function saveCart(cart) {
  saveLocalStorageJson(STORAGE_KEYS.cart, cart.map(item => ({ ...item, id: String(item.id) })));
}

function getWishlist() {
  return getLocalStorageJson(STORAGE_KEYS.wishlist, '[]');
}

function saveWishlist(wishlist) {
  saveLocalStorageJson(STORAGE_KEYS.wishlist, wishlist);
}

function updateWishlistIcon(element, productId) {
  const icon = element?.querySelector('i');
  if (!icon || !element) return;
  const active = isInWishlist(productId);
  icon.style.color = active ? '#ff4444' : '';
  element.classList.toggle('wish-active', active);
}

function getSavedReviews() {
  return getLocalStorageJson(STORAGE_KEYS.reviews, '{}');
}

function saveReviews(value) {
  saveLocalStorageJson(STORAGE_KEYS.reviews, value);
}

function getOrders() {
  return getLocalStorageJson(STORAGE_KEYS.orders, '[]');
}

function saveOrders(orders) {
  saveLocalStorageJson(STORAGE_KEYS.orders, orders);
}

function getProductById(id) {
  return productCatalog.find(item => item.id == id);
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getStoredUser() {
  return JSON.parse(localStorage.getItem(USER_STORAGE_KEYS.account) || 'null');
}

function getUserSession() {
  const session = sessionStorage.getItem(USER_STORAGE_KEYS.session) || localStorage.getItem(USER_STORAGE_KEYS.session);
  return JSON.parse(session || 'null');
}

function saveUserSession(session, remember = false) {
  const value = JSON.stringify(session);
  if (remember) {
    localStorage.setItem(USER_STORAGE_KEYS.session, value);
    sessionStorage.removeItem(USER_STORAGE_KEYS.session);
  } else {
    sessionStorage.setItem(USER_STORAGE_KEYS.session, value);
    localStorage.removeItem(USER_STORAGE_KEYS.session);
  }
}

function clearUserSession() {
  sessionStorage.removeItem(USER_STORAGE_KEYS.session);
  localStorage.removeItem(USER_STORAGE_KEYS.session);
  return fetch('http://127.0.0.1:5000/api/users/logout', { method: 'POST', credentials: 'include' })
    .catch(err => console.error('Error logging out on backend:', err));
}

function saveRegisteredUser(user) {
  localStorage.setItem(USER_STORAGE_KEYS.account, JSON.stringify(user));
}

function renderUserStatus() {
  const user = getStoredUser();
  const session = getUserSession();
  const userIcon = document.querySelector('.navbar .icons .fa-user');
  const profileAvatar = document.querySelector('.navbar .icons .user-avatar');

  if (!userIcon) return;

  if (session && user) {
    userIcon.classList.add('logged-in');
    userIcon.style.display = 'inline-block'; // Keep generic login icon visible when logged in

    const name = session.name || user.name || user.email.split('@')[0] || 'Customer';
    const initial = (name && name.charAt ? name.charAt(0).toUpperCase() : 'U');
    
    let avatar = profileAvatar;
    if (!avatar) {
      avatar = document.createElement('span');
      avatar.className = 'user-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      userIcon.parentNode?.insertBefore(avatar, userIcon.nextSibling);
    }
    
    avatar.textContent = initial;
    avatar.style.display = 'inline-flex';
    avatar.style.cursor = 'pointer';
    avatar.setAttribute('title', `Logged in as ${name}`);

    // show dropdown on click/tap on the avatar itself
    avatar.onclick = (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      showUserDropdown(session, user, avatar);
    };
    
    // also show dropdown on click/tap of the login icon when logged in
    userIcon.onclick = (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      showUserDropdown(session, user, avatar);
    };
    
    const handleTouch = (ev) => {
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      showUserDropdown(session, user, avatar);
    };
    avatar.addEventListener('touchstart', handleTouch);

  } else {
    userIcon.classList.remove('logged-in');
    userIcon.style.display = 'inline-block'; // Show generic login icon when logged out
    userIcon.setAttribute('title', 'Login or register');
    if (profileAvatar) {
      profileAvatar.style.display = 'none';
    }
    // ensure click opens auth modal when not signed in
    userIcon.onclick = () => { if (typeof openAuthModal === 'function') openAuthModal(); };
  }
}

function showUserDropdown(session, user, anchorEl) {
  closeUserDropdown();
  const name = session.name || user.name || user.email.split('@')[0] || 'Customer';
  const email = session.email || user.email || '';

  const dropdown = document.createElement('div');
  dropdown.className = 'user-dropdown';
  dropdown.innerHTML = `
    <div class="user-dropdown-inner">
      <div class="user-dropdown-header">
        <strong>${name}</strong>
        <div class="user-email">${email}</div>
      </div>
      <div class="user-dropdown-actions">
        <button type="button" class="btn-secondary" id="udAccountBtn">My Account</button>
        <button type="button" class="btn-outline" id="udLogoutBtn">Logout</button>
      </div>
    </div>
  `;

  document.body.appendChild(dropdown);

  // position near anchor
  const rect = anchorEl.getBoundingClientRect();
  dropdown.style.position = 'absolute';
  dropdown.style.top = `${rect.bottom + window.scrollY + 8}px`;
  dropdown.style.left = `${Math.min(rect.left + window.scrollX - 120, window.innerWidth - 260)}px`;

  // handlers
  document.getElementById('udLogoutBtn')?.addEventListener('click', () => {
    clearUserSession().then(() => {
      closeUserDropdown();
      renderUserStatus();
    });
  });
  document.getElementById('udAccountBtn')?.addEventListener('click', () => {
    closeUserDropdown();
    window.location.href = 'profile.html';
  });

  // close on outside click
  setTimeout(() => {
    document.addEventListener('click', onDocClickForUserDropdown);
    document.addEventListener('touchstart', onDocClickForUserDropdown);
  }, 0);
}

function onDocClickForUserDropdown(e) {
  const dd = document.querySelector('.user-dropdown');
  if (!dd) return;
  if (!dd.contains(e.target) && !e.target.closest('.fa-user') && !e.target.closest('.user-avatar')) {
    closeUserDropdown();
  }
}

function closeUserDropdown() {
  const existing = document.querySelector('.user-dropdown');
  if (existing) existing.remove();
  document.removeEventListener('click', onDocClickForUserDropdown);
  document.removeEventListener('touchstart', onDocClickForUserDropdown);
}

function openAuthModal() {
  if (document.getElementById('authModal')) return;
  const currentUser = getStoredUser();
  const currentSession = getUserSession();
  const signedIn = currentSession && currentUser;

  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay auth-modal" id="authModal" role="dialog" aria-modal="true">
      <div class="modal-dialog">
        <button type="button" class="modal-close" id="authCloseBtn" aria-label="Close auth">×</button>
        <div class="modal-header">
          <h3>${signedIn ? 'My Account' : 'Welcome Back'}</h3>
          <p class="modal-subtitle">${signedIn ? 'Manage your profile and logout from here.' : 'Login or create an account to continue shopping.'}</p>
        </div>
        ${signedIn ? `
          <div class="modal-body modal-profile">
            <div>
              <strong>${currentSession.name || currentUser.name || currentSession.email || 'Customer'}</strong>
              <span class="profile-email">${currentSession.email}</span>
            </div>
            <button type="button" id="accountBtn" class="btn-secondary">My Account</button>
            <button type="button" id="logoutBtn" class="btn-outline">Logout</button>
            <p id="authMessage" class="auth-notice auth-success">You are logged in and ready to shop.</p>
          </div>
        ` : `
          <div class="modal-tabs">
            <button type="button" class="modal-tab active" data-tab="login">Login</button>
            <button type="button" class="modal-tab" data-tab="register">Register</button>
          </div>
          <div class="modal-body auth-body">
            <div class="auth-panel auth-active" data-panel="login">
              <div class="form-row">
                <label for="authEmail">Email Address</label>
                <input id="authEmail" type="email" placeholder="you@example.com" autocomplete="username">
              </div>
              <div class="form-row">
                <label for="authPassword">Password</label>
                <div class="input-group">
                  <input id="authPassword" type="password" placeholder="Password" autocomplete="current-password">
                  <button type="button" class="toggle-password" data-target="authPassword" aria-label="Show password"><i class="fa-solid fa-eye"></i></button>
                </div>
              </div>
              <div class="form-foot">
                <label class="checkbox-row"><input type="checkbox" id="rememberMe"><span>Remember me</span></label>
                <button type="button" id="forgotPasswordBtn" class="forgot-link">Forgot Password?</button>
              </div>
              <button type="button" id="authLoginBtn" class="btn-primary">Login</button>
              <p id="authLoginMessage" class="auth-notice"></p>
            </div>
            <div class="auth-panel" data-panel="register">
              <div class="form-row">
                <label for="authName">Full Name</label>
                <input id="authName" type="text" placeholder="John Doe" autocomplete="name">
              </div>
              <div class="form-row">
                <label for="authRegisterEmail">Email Address</label>
                <input id="authRegisterEmail" type="email" placeholder="you@example.com" autocomplete="email">
              </div>
              <div class="form-row">
                <label for="authMobile">Mobile Number</label>
                <input id="authMobile" type="tel" placeholder="123-456-7890" autocomplete="tel">
              </div>
              <div class="form-row">
                <label for="authRegisterPassword">Password</label>
                <div class="input-group">
                  <input id="authRegisterPassword" type="password" placeholder="Create password" autocomplete="new-password">
                  <button type="button" class="toggle-password" data-target="authRegisterPassword" aria-label="Show password"><i class="fa-solid fa-eye"></i></button>
                </div>
              </div>
              <div class="form-row">
                <label for="authConfirmPassword">Confirm Password</label>
                <div class="input-group">
                  <input id="authConfirmPassword" type="password" placeholder="Confirm password" autocomplete="new-password">
                  <button type="button" class="toggle-password" data-target="authConfirmPassword" aria-label="Show password"><i class="fa-solid fa-eye"></i></button>
                </div>
              </div>
              <button type="button" id="authRegisterBtn" class="btn-primary">Register</button>
              <p id="authRegisterMessage" class="auth-notice"></p>
            </div>
          </div>
        `}
      </div>
    </div>
  `);

  const authModal = document.getElementById('authModal');
  document.getElementById('authCloseBtn')?.addEventListener('click', closeAuthModal);
  authModal?.addEventListener('click', event => {
    if (event.target.id === 'authModal') closeAuthModal();
  });

  if (signedIn) {
    document.getElementById('accountBtn')?.addEventListener('click', () => {
      closeAuthModal();
      window.location.href = 'profile.html';
    });
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      clearUserSession().then(() => {
        closeAuthModal();
        renderUserStatus();
      });
    });
  } else {
    document.querySelectorAll('.modal-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.modal-tab').forEach(el => el.classList.toggle('active', el === tab));
        document.querySelectorAll('.auth-panel').forEach(panel => panel.classList.toggle('auth-active', panel.dataset.panel === target));
      });
    });

    document.querySelectorAll('.toggle-password').forEach(button => {
      button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.target);
        if (!target) return;
        const show = target.type === 'password';
        target.type = show ? 'text' : 'password';
        button.innerHTML = show ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
      });
    });

    document.getElementById('forgotPasswordBtn')?.addEventListener('click', () => {
      const message = document.getElementById('authLoginMessage');
      if (message) {
        message.textContent = 'Forgot password is demo-only. Please register again if you do not remember your password.';
        message.classList.add('message-warning');
      }
    });

    document.getElementById('authLoginBtn')?.addEventListener('click', async () => {
      const email = document.getElementById('authEmail')?.value.trim().toLowerCase();
      const password = document.getElementById('authPassword')?.value || '';
      const remember = document.getElementById('rememberMe')?.checked;
      const message = document.getElementById('authLoginMessage');
      if (!email || !password) {
        if (message) {
          message.textContent = 'Please enter both email and password.';
          message.className = 'message-error';
        }
        return;
      }
      
      try {
        const res = await fetch('http://127.0.0.1:5000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        saveUserSession({ email: data.email, name: data.name, mobile: data.mobile }, remember);
        if (message) {
          message.textContent = 'Login successful! Redirecting...';
          message.className = 'message-success';
        }
        renderUserStatus();
        setTimeout(() => closeAuthModal(), 300);
      } catch (err) {
        if (message) {
          message.textContent = err.message || 'Email or password is incorrect.';
          message.className = 'message-error';
        }
      }
    });

    document.getElementById('authRegisterBtn')?.addEventListener('click', async () => {
      const name = document.getElementById('authName')?.value.trim();
      const email = document.getElementById('authRegisterEmail')?.value.trim().toLowerCase();
      const mobile = document.getElementById('authMobile')?.value.trim();
      const password = document.getElementById('authRegisterPassword')?.value || '';
      const confirm = document.getElementById('authConfirmPassword')?.value || '';
      const message = document.getElementById('authRegisterMessage');
      if (!name || !email || !mobile || !password || !confirm) {
        if (message) {
          message.textContent = 'Please fill in all fields to register.';
          message.className = 'message-error';
        }
        return;
      }
      if (password !== confirm) {
        if (message) {
          message.textContent = 'Passwords do not match.';
          message.className = 'message-error';
        }
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:5000/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, mobile, password }),
          credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        saveUserSession({ email: data.email, name: data.name, mobile: data.mobile }, true);
        if (message) {
          message.textContent = 'Registration successful! Logging you in...';
          message.className = 'message-success';
        }
        renderUserStatus();
        setTimeout(() => closeAuthModal(), 300);
      } catch (err) {
        if (message) {
          message.textContent = err.message || 'Error occurred during registration.';
          message.className = 'message-error';
        }
      }
    });
  }
  window.openAuthModal = openAuthModal;
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.remove();

  if (window.location.pathname.includes('checkout.html') && sessionStorage.getItem('pending_checkout') === 'true') {
    sessionStorage.removeItem('pending_checkout');
    const form = document.getElementById('checkoutForm');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }
}

function getSearchResults(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return productCatalog.slice();
  return productCatalog.filter(product => {
    const tagsStr = Array.isArray(product.tags) ? product.tags.join(' ') : '';
    const haystack = [product.title, product.category, product.brand, product.description, tagsStr].join(' ').toLowerCase();
    return haystack.includes(normalized);
  });
}

function buildRatingStars(rating) {
  const value = Number(rating) || 0;
  let html = '';
  for (let i = 1; i <= 5; i += 1) {
    if (value >= i) {
      html += '<i class="fa-solid fa-star"></i>';
    } else if (value >= i - 0.5) {
      html += '<i class="fa-solid fa-star-half-stroke"></i>';
    } else {
      html += '<i class="fa-regular fa-star"></i>';
    }
  }
  return html;
}

function createProductCard(product) {
  return `
    <div class="product-card" data-product-id="${product.id}" data-category="${product.category}">
      <div class="img-wrap">
        <span class="badge">${product.oldPrice ? 'Sale' : 'New'}</span>
        <button type="button" class="wishlist" data-product-id="${product.id}" aria-label="Toggle wishlist">
          <i class="fa-solid fa-heart"></i>
        </button>
        <img src="${product.images[0]}" alt="${product.title}">
      </div>
      <div class="info">
        <div class="meta">${product.category}</div>
        <h4>${product.title}</h4>
        <div class="stars">${buildRatingStars(product.rating)} <span>(${product.reviewCount || 0})</span></div>
        <div class="price">${formatCurrency(product.price)} ${product.oldPrice ? `<span class="old">${formatCurrency(product.oldPrice)}</span>` : ''}</div>
      </div>
    </div>
  `;
}

function renderSearchResults(query) {
  const results = getSearchResults(query);
  const resultsContainer = document.getElementById('searchResults');
  if (!resultsContainer) return;
  if (!results.length) {
    resultsContainer.innerHTML = '<p class="empty-state">No products matched your search.</p>';
    return;
  }
  resultsContainer.innerHTML = results.map(product => `
    <div class="search-result-card" data-id="${product.id}">
      <img src="${product.images[0]}" alt="${product.title}">
      <div>
        <h4>${product.title}</h4>
        <p>${product.category}</p>
      </div>
      <span>${formatCurrency(product.price)}</span>
    </div>
  `).join('');
  resultsContainer.querySelectorAll('.search-result-card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = `product.html?id=${encodeURIComponent(card.dataset.id)}`;
      closeSearchModal();
    });
  });
}

function openSearchModal() {
  if (document.getElementById('searchModal')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="searchModal" role="dialog" aria-modal="true">
      <div class="modal-dialog">
        <button type="button" class="modal-close" id="searchCloseBtn" aria-label="Close search">×</button>
        <div class="modal-header">
          <h3>Search products</h3>
        </div>
        <div class="modal-body">
          <input id="searchInput" type="search" placeholder="Search product, brand or category">
          <div id="searchResults" class="search-results"></div>
        </div>
      </div>
    </div>
  `);
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  if (!searchModal || !searchInput) return;

  const handleSearch = () => renderSearchResults(searchInput.value);
  searchInput.addEventListener('input', handleSearch);
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  });

  document.getElementById('searchCloseBtn')?.addEventListener('click', closeSearchModal);
  searchModal.addEventListener('click', event => {
    if (event.target.id === 'searchModal') closeSearchModal();
  });

  searchModalEscapeHandler = event => {
    if (event.key === 'Escape') closeSearchModal();
  };
  document.addEventListener('keydown', searchModalEscapeHandler);

  searchInput.focus();
  renderSearchResults('');
}

function closeSearchModal() {
  const modal = document.getElementById('searchModal');
  if (modal) modal.remove();
  if (searchModalEscapeHandler) {
    document.removeEventListener('keydown', searchModalEscapeHandler);
    searchModalEscapeHandler = null;
  }
}

function getMergedReviews(productId) {
  const product = getProductById(productId);
  if (!product) return [];
  const saved = getSavedReviews()[productId] || [];
  return [...product.reviews, ...saved];
}

function getAverageRating(productId) {
  const reviews = getMergedReviews(productId);
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((total / reviews.length).toFixed(1));
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function setProductCardIds() {
  document.querySelectorAll('.product-card').forEach(card => {
    const title = card.querySelector('h4')?.textContent.trim();
    const product = productCatalog.find(item => item.title === title);
    if (product) {
      card.dataset.productId = product.id;
    }
  });
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.add('active');
  drawer.setAttribute('aria-hidden', 'false');
  renderCartPanel();
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.remove('active');
  drawer.setAttribute('aria-hidden', 'true');
}

function getCartTotal(cartItems) {
  return cartItems.reduce((sum, item) => {
    const product = getProductById(item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

function renderCartPanel() {
  const body = document.getElementById('cartPanelBody');
  const subtotalEl = document.getElementById('cartSubtotal');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  if (!body || !subtotalEl || !checkoutBtn) return;

  const cart = getCart();
  body.innerHTML = '';
  if (!cart.length) {
    body.innerHTML = '<p class="empty-cart">Your cart is currently empty.</p>';
    subtotalEl.textContent = formatCurrency(0);
    checkoutBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  cart.forEach(item => {
    const product = getProductById(item.id);
    if (!product) return;
    const itemHtml = document.createElement('div');
    itemHtml.className = 'cart-item';
    itemHtml.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}">
      <div class="cart-item-details">
        <h4>${product.title}</h4>
        <p>${product.category}</p>
        <div class="cart-quantity-controls">
          <button type="button" class="cart-qty-decrease" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button type="button" class="cart-qty-increase" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item-actions">
          <span>${formatCurrency(product.price * item.qty)}</span>
          <button type="button" class="cart-remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
    body.appendChild(itemHtml);
  });

  subtotalEl.textContent = formatCurrency(getCartTotal(cart));

  body.querySelectorAll('.cart-qty-decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const item = cart.find(entry => String(entry.id) === String(btn.dataset.id));
      if (!item) return;
      item.qty = Math.max(1, item.qty - 1);
      saveCart(cart);
      updateCartCount();
      renderCartPanel();
    });
  });

  body.querySelectorAll('.cart-qty-increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const item = cart.find(entry => String(entry.id) === String(btn.dataset.id));
      if (!item) return;
      item.qty += 1;
      saveCart(cart);
      updateCartCount();
      renderCartPanel();
    });
  });

  body.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      let cart = getCart();
      cart = cart.filter(entry => String(entry.id) !== String(btn.dataset.id));
      saveCart(cart);
      updateCartCount();
      renderCartPanel();
    });
  });

  checkoutBtn.addEventListener('click', () => {
    closeCartDrawer();
    window.location.href = 'checkout.html';
  });
}

function addToCart(productId, quantity = 1) {
  const id = String(productId);
  const cart = getCart();
  const item = cart.find(entry => String(entry.id) === id);
  if (item) {
    item.qty += quantity;
  } else {
    cart.push({ id, qty: quantity });
  }
  saveCart(cart);
  updateCartCount();
}

function toggleWishlist(productId) {
  const id = String(productId);
  const wishlist = getWishlist();
  const index = wishlist.indexOf(id);
  if (index >= 0) {
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    return false;
  }
  wishlist.push(id);
  saveWishlist(wishlist);
  return true;
}

function isInWishlist(productId) {
  return getWishlist().includes(String(productId));
}

function updateProductWishlistButton(productId) {
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (!wishlistBtn) return;
  const active = isInWishlist(productId);
  wishlistBtn.classList.toggle('active', active);
  wishlistBtn.innerHTML = active ? '<i class="fa-solid fa-heart"></i> In Wishlist' : '<i class="fa-regular fa-heart"></i> Add to Wishlist';
}

function buildCartPanelIfNeeded() {
  if (document.getElementById('cartDrawer')) return;
  document.body.insertAdjacentHTML('beforeend', cartPanelTemplate);
  document.getElementById('cartBackdrop').addEventListener('click', closeCartDrawer);
  document.getElementById('cartCloseBtn').addEventListener('click', closeCartDrawer);
}

function setProductNavigation() {
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = card.dataset.productId;
    if (!productId) return;
    card.classList.add('clickable-product');
    card.addEventListener('click', event => {
      if (event.target.closest('.wishlist')) return;
      window.location.href = `product.html?id=${encodeURIComponent(productId)}`;
    });
  });
}

function initWishlistButtons() {
  document.querySelectorAll('.wishlist').forEach(btn => {
    const card = btn.closest('.product-card');
    const productId = card?.dataset.productId;
    if (!productId) return;
    updateWishlistIcon(btn, productId);
  });
}

function setupWishlistDelegation() {
  const handleWishlistClick = event => {
    // Prevent double-invocation from both click and touchend
    if (event._wishlistHandled) return;
    event._wishlistHandled = true;
    
    const button = event.target.closest('.wishlist');
    if (!button) return;
    event.stopPropagation();
    const productId = button.dataset.productId;
    if (!productId) return;
    toggleWishlist(productId);
    updateWishlistIcon(button, productId);
  };

  document.body.addEventListener('click', handleWishlistClick);
  document.body.addEventListener('touchend', handleWishlistClick, {passive: true});
}

function initProductImageZoom() {
  document.querySelectorAll('.product-card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', event => {
      event.stopPropagation();
      openZoomOverlay(img.src, img.alt);
    });
  });
}

function openZoomOverlay(src, alt) {
  const existing = document.getElementById('zoomOverlay');
  if (existing) {
    existing.remove();
  }
  document.body.insertAdjacentHTML('beforeend', `
    <div class="zoom-overlay" id="zoomOverlay" role="dialog" aria-modal="true">
      <div class="zoom-inner">
        <button type="button" class="zoom-close" id="zoomCloseBtn" aria-label="Close zoom view">×</button>
        <img src="${src}" alt="${alt}">
      </div>
    </div>
  `);
  document.getElementById('zoomCloseBtn').addEventListener('click', () => {
    document.getElementById('zoomOverlay')?.remove();
  });
  document.getElementById('zoomOverlay').addEventListener('click', event => {
    if (event.target.id === 'zoomOverlay') {
      event.target.remove();
    }
  });
}

function renderReviews(productId) {
  const reviews = getMergedReviews(productId);
  const reviewList = document.getElementById('reviewList');
  const averageRatingEl = document.getElementById('averageRating');
  const reviewCountEl = document.getElementById('reviewCount');
  const productRatingEl = document.getElementById('productRating');
  const productReviewCountEl = document.getElementById('productReviewCount');
  const average = getAverageRating(productId);
  if (productRatingEl) {
    productRatingEl.innerHTML = buildRatingStars(average);
  }
  if (productReviewCountEl) {
    productReviewCountEl.textContent = `${reviews.length} Reviews`;
  }
  if (averageRatingEl) {
    averageRatingEl.innerHTML = buildRatingStars(average);
  }
  if (reviewCountEl) {
    reviewCountEl.textContent = `${reviews.length} reviews`;
  }
  if (!reviewList) return;
  reviewList.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="review-head">
        <div>
          <strong>${review.name}</strong>
          ${review.verified ? '<span class="badge verified">Verified Buyer</span>' : ''}
        </div>
        <div class="review-rating">${buildRatingStars(review.rating)}</div>
      </div>
      <p class="review-date">${review.date}</p>
      <p>${review.comment}</p>
    </div>
  `).join('');
}

function submitReview(productId) {
  const nameInput = document.getElementById('reviewerName');
  const ratingInput = document.getElementById('reviewRating');
  const commentInput = document.getElementById('reviewComment');
  const errorEl = document.getElementById('reviewError');
  if (!nameInput || !ratingInput || !commentInput || !errorEl) return;
  const name = nameInput.value.trim();
  const rating = Number(ratingInput.value);
  const comment = commentInput.value.trim();
  if (!name || rating < 1 || rating > 5 || !comment) {
    errorEl.textContent = 'Please enter your name, rating, and comment.';
    return;
  }
  const reviews = getSavedReviews();
  const existing = reviews[productId] || [];
  existing.unshift({
    name,
    rating,
    verified: true,
    date: new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}),
    comment,
  });
  reviews[productId] = existing;
  saveReviews(reviews);
  nameInput.value = '';
  commentInput.value = '';
  ratingInput.value = '5';
  errorEl.textContent = '';
  renderReviews(productId);
}

function renderSimilarProducts(product) {
  const container = document.getElementById('similarProducts');
  if (!container) return;
  const relatedIds = Array.isArray(product.relatedIds) ? product.relatedIds : [];
  let similar = relatedIds.map(id => getProductById(id)).filter(Boolean);

  if (!similar.length) {
    similar = productCatalog.filter(item => item.id !== product.id && item.category.toLowerCase() === String(product.category).toLowerCase()).slice(0, 4);
  }
  if (!similar.length) {
    similar = productCatalog.filter(item => item.id !== product.id).slice(0, 4);
  }

  container.innerHTML = `
    <h3>Similar products</h3>
    <div class="similar-products-grid">
      ${similar.map(item => `
        <div class="similar-card" data-product-id="${item.id}">
          <img src="${item.images[0]}" alt="${item.title}">
          <div class="similar-card-info">
            <h4>${item.title}</h4>
            <span>${formatCurrency(item.price)}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  container.querySelectorAll('.similar-card').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = `product.html?id=${encodeURIComponent(card.dataset.productId)}`;
    });
  });
}

function attachCartPageNavigation() {
  document.querySelectorAll('.cart-wrap').forEach(el => {
    el.addEventListener('click', event => {
      event.stopPropagation();
      window.location.href = 'cart.html';
    });
  });
}

function renderProductCards(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!products.length) {
    container.innerHTML = '<p class="empty-state">No products match your current filters.</p>';
    return;
  }
  container.innerHTML = products.map(createProductCard).join('');
  setProductNavigation();
  initWishlistButtons();
  initProductImageZoom();
}

function initShopPage() {
  buildCartPanelIfNeeded();
  updateCartCount();
  attachCartPageNavigation();

  const searchInput = document.getElementById('shopSearch');
  const categorySelect = document.getElementById('shopCategoryFilter');
  const sortSelect = document.getElementById('shopSort');
  const clearBtn = document.getElementById('shopClearFilters');

  const categories = new Set();
  productCatalog.forEach(product => {
    product.category.split(',').map(cat => cat.trim()).forEach(cat => {
      if (cat) categories.add(cat);
    });
  });
  categories.forEach(category => {
    categorySelect?.insertAdjacentHTML('beforeend', `<option value="${category}">${category}</option>`);
  });

  const applyFilters = () => {
    const query = searchInput?.value.trim().toLowerCase() || '';
    const selectedCategory = categorySelect?.value;
    let results = productCatalog.slice();
    if (query) {
      results = results.filter(product => {
        const haystack = [product.title, product.category, product.brand, product.description, product.tags.join(' ')].join(' ').toLowerCase();
        return haystack.includes(query);
      });
    }
    if (selectedCategory) {
      results = results.filter(product => product.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    if (sortSelect?.value === 'price-asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortSelect?.value === 'price-desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortSelect?.value === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }
    renderProductCards(results, 'shopProducts');
  };

  searchInput?.addEventListener('input', applyFilters);
  categorySelect?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', applyFilters);
  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = '';
    if (sortSelect) sortSelect.value = 'featured';
    applyFilters();
  });
  applyFilters();
}

function initCartPage() {
  buildCartPanelIfNeeded();
  updateCartCount();
  attachCartPageNavigation();

  const cartContent = document.getElementById('cartContent');
  const summaryPanel = document.getElementById('cartSummary');
  const checkoutBtn = document.getElementById('cartCheckoutPageBtn');
  if (!cartContent || !summaryPanel || !checkoutBtn) return;

  const cartItems = getCart();
  if (!cartItems.length) {
    cartContent.innerHTML = '<div class="empty-state"><p>Your cart is empty. Add items from the shop to continue.</p><button class="btn-primary" onclick="window.location.href=\'shop.html\'">Continue Shopping</button></div>';
    summaryPanel.innerHTML = '<div class="summary-line"><span>Subtotal</span><span>$0.00</span></div>';
    checkoutBtn.disabled = true;
    return;
  }

  cartContent.innerHTML = cartItems.map(item => {
    const product = getProductById(item.id);
    if (!product) return '';
    return `
      <div class="cart-item-row">
        <img src="${product.images[0]}" alt="${product.title}">
        <div class="cart-details">
          <h4>${product.title}</h4>
          <p>${product.category}</p>
          <div class="cart-quantity-controls">
            <button type="button" class="cart-qty-decrease" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button type="button" class="cart-qty-increase" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-actions">
          <span>${formatCurrency(product.price * item.qty)}</span>
          <button type="button" class="btn-outline cart-remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  const orderSummary = buildOrderSummary(cartItems);
  summaryPanel.innerHTML = `
    <div class="summary-line"><span>Subtotal</span><span>${formatCurrency(orderSummary.subtotal)}</span></div>
    <div class="summary-line"><span>Shipping</span><span>${formatCurrency(orderSummary.shipping)}</span></div>
    <div class="summary-line"><span>Tax</span><span>${formatCurrency(orderSummary.tax)}</span></div>
    <div class="summary-total"><span>Total</span><span>${formatCurrency(orderSummary.total)}</span></div>
  `;
  checkoutBtn.disabled = false;
  checkoutBtn.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });

  cartContent.querySelectorAll('.cart-qty-decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const item = cart.find(entry => String(entry.id) === String(btn.dataset.id));
      if (!item) return;
      item.qty = Math.max(1, item.qty - 1);
      saveCart(cart);
      initCartPage();
    });
  });
  cartContent.querySelectorAll('.cart-qty-increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const item = cart.find(entry => String(entry.id) === String(btn.dataset.id));
      if (!item) return;
      item.qty += 1;
      saveCart(cart);
      initCartPage();
    });
  });
  cartContent.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      let cart = getCart();
      cart = cart.filter(entry => String(entry.id) !== String(btn.dataset.id));
      saveCart(cart);
      updateCartCount();
      initCartPage();
    });
  });
}

function initWishlistPage() {
  buildCartPanelIfNeeded();
  updateCartCount();
  attachCartPageNavigation();

  const container = document.getElementById('wishlistContent');
  if (!container) return;
  const wishlistItems = getWishlist();
  if (!wishlistItems.length) {
    container.innerHTML = '<div class="empty-state"><p>Your wishlist is empty. Browse the shop to save favorites.</p><button class="btn-primary" onclick="window.location.href=\'shop.html\'">Shop now</button></div>';
    return;
  }
  const products = wishlistItems.map(id => getProductById(id)).filter(Boolean);
  container.innerHTML = products.map(createProductCard).join('');
  setProductNavigation();
  initWishlistButtons();
  initProductImageZoom();
}

function initBlogPage() {
  buildCartPanelIfNeeded();
  updateCartCount();
  attachCartPageNavigation();

  const blogList = document.getElementById('blogList');
  if (!blogList) return;
  blogList.innerHTML = blogArticles.map(article => `
    <article class="blog-card">
      <img src="${article.image}" alt="${article.title}">
      <div class="blog-card-content">
        <span class="badge accent">${article.category}</span>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
        <a href="article.html?id=${article.id}">Read article</a>
      </div>
    </article>
  `).join('');
}

function initArticlePage() {
  buildCartPanelIfNeeded();
  updateCartCount();
  attachCartPageNavigation();

  const articleId = getQueryParam('id');
  const article = blogArticles.find(item => item.id == articleId);
  const container = document.getElementById('articleContent');
  if (!container) return;
  if (!article) {
    container.innerHTML = '<div class="empty-state"><p>Article not found. Please return to the blog page.</p><button class="btn-primary" onclick="window.location.href=\'blog.html\'">Back to blog</button></div>';
    return;
  }
  container.innerHTML = `
    <span class="badge accent">${article.category}</span>
    <h1>${article.title}</h1>
    <div class="article-meta">${article.date}</div>
    <img src="${article.image}" alt="${article.title}">
    ${article.content.map(paragraph => `<p>${paragraph}</p>`).join('')}
    <button class="btn-outline" onclick="window.location.href='blog.html'">
      <i class="fa-solid fa-arrow-left"></i> Back to blog
    </button>
  `;
}

function initHomePage() {
  setProductCardIds();
  setProductNavigation();
  initWishlistButtons();
  initProductImageZoom();
  updateCartCount();
  buildCartPanelIfNeeded();
  attachCartPageNavigation();

  document.querySelectorAll('.hero-btns .btn-primary').forEach(button => {
    button.addEventListener('click', () => {
      window.location.href = 'shop.html';
    });
  });

  document.querySelectorAll('.hero-btns .btn-outline').forEach((button, index) => {
    const productId = homeHeroProducts[index] || 'p1';
    button.addEventListener('click', () => {
      window.location.href = `product.html?id=${productId}`;
    });
  });

  document.querySelectorAll('.categories button, .categories a').forEach(element => {
    element.addEventListener('click', () => {
      window.location.href = 'shop.html';
    });
  });
}

function initProductPage() {
  buildCartPanelIfNeeded();
  attachCartPageNavigation();
  updateCartCount();
  const productId = getQueryParam('id');
  const product = getProductById(productId);
  const missing = document.getElementById('missingProduct');
  if (!product) {
    if (missing) missing.textContent = 'Product not found.';
    return;
  }
  const titleEl = document.getElementById('productTitle');
  const categoryEl = document.getElementById('productCategory');
  const descriptionEl = document.getElementById('productDescription');
  const brandEl = document.getElementById('productBrand');
  const stockEl = document.getElementById('productStock');
  const deliveryEl = document.getElementById('productDelivery');
  const returnsEl = document.getElementById('productReturns');
  const priceEl = document.getElementById('productPrice');
  const oldPriceEl = document.getElementById('productOldPrice');
  const specEl = document.getElementById('productSpecs');
  const sizeEl = document.getElementById('productSizes');
  const colorEl = document.getElementById('productColors');
  const galleryEl = document.getElementById('productGallery');
  const mainImage = document.getElementById('productImage');
  if (titleEl) titleEl.textContent = product.title;
  if (categoryEl) categoryEl.textContent = product.category;
  if (descriptionEl) descriptionEl.textContent = product.description;
  if (brandEl) brandEl.textContent = product.brand;
  if (stockEl) stockEl.textContent = product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock';
  if (deliveryEl) deliveryEl.textContent = product.delivery;
  if (returnsEl) returnsEl.textContent = product.returns;
  if (priceEl) priceEl.textContent = formatCurrency(product.price);
  if (oldPriceEl) {
    oldPriceEl.textContent = product.oldPrice ? formatCurrency(product.oldPrice) : '';
    oldPriceEl.style.display = product.oldPrice ? 'inline-block' : 'none';
  }
  if (specEl) {
    specEl.innerHTML = product.specs.map(spec => `<li>${spec}</li>`).join('');
  }
  if (sizeEl) {
    sizeEl.innerHTML = product.sizes.map(size => `<button type="button" class="spec-button" data-option-type="size">${size}</button>`).join('');
  }
  if (colorEl) {
    colorEl.innerHTML = product.colors.map(color => `<button type="button" class="spec-button color-button" data-option-type="color">${color}</button>`).join('');
  }
  const setupOptionButtons = () => {
    document.querySelectorAll('#productSizes .spec-button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#productSizes .spec-button').forEach(el => {
          el.classList.remove('active');
          el.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      });
    });
    document.querySelectorAll('#productColors .spec-button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#productColors .spec-button').forEach(el => {
          el.classList.remove('active');
          el.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      });
    });
  };
  setupOptionButtons();
  if (galleryEl && mainImage) {
    mainImage.src = product.images[0];
    mainImage.alt = product.title;
    galleryEl.innerHTML = product.images.map((src, index) => `
      <button type="button" class="gallery-thumb ${index === 0 ? 'active' : ''}" data-src="${src}">
        <img src="${src}" alt="${product.title} image ${index + 1}">
      </button>
    `).join('');
    galleryEl.querySelectorAll('.gallery-thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        galleryEl.querySelectorAll('.gallery-thumb').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        mainImage.src = btn.dataset.src;
      });
    });
    mainImage.addEventListener('click', () => {
      openZoomOverlay(mainImage.src, product.title);
    });
  }
  const ratingBar = document.getElementById('productRating');
  const reviewCount = document.getElementById('productReviewCount');
  if (ratingBar) ratingBar.innerHTML = buildRatingStars(product.rating);
  if (reviewCount) reviewCount.textContent = `${product.reviewCount}+ Reviews`;

  const addToCartBtn = document.getElementById('addToCartBtn');
  const buyNowBtn = document.getElementById('buyNowBtn');
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      addToCart(product.id);
      updateCartCount();
      alert('Product added to cart.');
    });
  }
  if (wishlistBtn) {
    const handleProductWishlistClick = event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      toggleWishlist(product.id);
      updateProductWishlistButton(product.id);
    };

    wishlistBtn.addEventListener('click', handleProductWishlistClick);
  }
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      sessionStorage.setItem(STORAGE_KEYS.buyNow, JSON.stringify({id: product.id, qty: 1}));
      window.location.href = 'checkout.html';
    });
  }

  updateProductWishlistButton(product.id);
  renderReviews(product.id);
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', event => {
      event.preventDefault();
      submitReview(product.id);
    });
  }
  renderSimilarProducts(product);
}

function buildOrderSummary(items) {
  const rows = items.map(item => {
    const product = getProductById(item.id);
    if (!product) return '';
    return `
      <div class="order-line">
        <img src="${product.images[0]}" alt="${product.title}">
        <div>
          <strong>${product.title}</strong>
          <p>${formatCurrency(product.price)} x ${item.qty}</p>
        </div>
        <span>${formatCurrency(product.price * item.qty)}</span>
      </div>
    `;
  }).join('');
  const subtotal = getCartTotal(items);
  const shipping = items.length ? 15.0 : 0.0;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));
  return {rows, subtotal, shipping, tax, total};
}

function initCheckoutPage() {
  buildCartPanelIfNeeded();
  attachCartPageNavigation();
  updateCartCount();
  const sessionItem = sessionStorage.getItem(STORAGE_KEYS.buyNow);
  const cart = getCart();
  const checkoutData = sessionItem ? [JSON.parse(sessionItem)] : cart;
  const content = document.getElementById('checkoutContent');
  if (!content) return;
  if (!checkoutData.length) {
    content.innerHTML = '<p>Your cart is empty. Add a product before proceeding to checkout.</p>';
    return;
  }
  const summary = buildOrderSummary(checkoutData);
  document.getElementById('checkoutSummary').innerHTML = summary.rows;
  document.getElementById('checkoutSubtotal').textContent = formatCurrency(summary.subtotal);
  document.getElementById('checkoutShipping').textContent = formatCurrency(summary.shipping);
  document.getElementById('checkoutTax').textContent = formatCurrency(summary.tax);
  document.getElementById('checkoutTotal').textContent = formatCurrency(summary.total);

  const form = document.getElementById('checkoutForm');
  const errorEl = document.getElementById('checkoutError');
  if (!form || !errorEl) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(form);
    const customer = {
      name: formData.get('fullName')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      phone: formData.get('phone')?.toString().trim(),
      address: formData.get('address')?.toString().trim(),
      city: formData.get('city')?.toString().trim(),
      state: formData.get('state')?.toString().trim(),
      zip: formData.get('zip')?.toString().trim(),
      country: formData.get('country')?.toString().trim(),
    };
    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city) {
      errorEl.textContent = 'Please complete all required fields.';
      return;
    }

    // Require user login before proceeding to payment
    const session = getUserSession();
    if (!session) {
      errorEl.innerHTML = `Only logged-in users can proceed. Please <a href="#" id="checkoutLoginLink" style="font-weight: 700; text-decoration: underline; color: var(--blue);">Login or Create Account</a> first.`;
      
      // Hook up click listener for login link
      document.getElementById('checkoutLoginLink')?.addEventListener('click', e => {
        e.preventDefault();
        if (typeof openAuthModal === 'function') openAuthModal();
      });

      // Auto-prompt login modal
      if (typeof openAuthModal === 'function') openAuthModal();

      sessionStorage.setItem('pending_checkout', 'true');
      return;
    }

    const checkoutPayload = {
      customer,
      items: checkoutData,
      summary,
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem('pressmart_checkout_payload', JSON.stringify(checkoutPayload));
    window.location.href = 'payment.html';
  });
}

function validatePaymentFields(method) {
  const errorEl = document.getElementById('paymentError');
  if (!errorEl) return false;
  errorEl.textContent = '';
  
  if (method === 'credit-card') {
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s+/g, '').trim();
    const expiryDate = document.getElementById('cardExpiry')?.value.trim();
    const cvv = document.getElementById('cardCvv')?.value.trim();
    const name = document.getElementById('cardName')?.value.trim();
    if (!name) {
      errorEl.textContent = 'Please enter the cardholder name.';
      return false;
    }
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      errorEl.textContent = 'Please enter a valid card number.';
      return false;
    }
    if (!expiryDate || !expiryDate.includes('/') || expiryDate.length < 5) {
      errorEl.textContent = 'Please enter a valid expiry date (MM/YY).';
      return false;
    }
    if (!cvv || cvv.length < 3) {
      errorEl.textContent = 'Please enter a valid CVV (3 or 4 digits).';
      return false;
    }
  }
  
  if (method === 'debit-card') {
    const cardNumber = document.getElementById('cardNumberDebit')?.value.replace(/\s+/g, '').trim();
    const expiryDate = document.getElementById('cardExpiryDebit')?.value.trim();
    const cvv = document.getElementById('cardCvvDebit')?.value.trim();
    const name = document.getElementById('cardNameDebit')?.value.trim();
    if (!name) {
      errorEl.textContent = 'Please enter the cardholder name.';
      return false;
    }
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      errorEl.textContent = 'Please enter a valid card number.';
      return false;
    }
    if (!expiryDate || !expiryDate.includes('/') || expiryDate.length < 5) {
      errorEl.textContent = 'Please enter a valid expiry date (MM/YY).';
      return false;
    }
    if (!cvv || cvv.length < 3) {
      errorEl.textContent = 'Please enter a valid CVV (3 or 4 digits).';
      return false;
    }
  }
  
  if (method === 'upi') {
    const upiId = document.getElementById('upiId')?.value.trim();
    if (!upiId || !upiId.includes('@')) {
      errorEl.textContent = 'Please enter a valid UPI ID (e.g., username@bank).';
      return false;
    }
  }
  
  if (method === 'net-banking') {
    const bank = document.getElementById('bankSelect')?.value;
    if (!bank) {
      errorEl.textContent = 'Please select a bank to continue.';
      return false;
    }
  }
  
  if (method === 'wallet') {
    const wallet = document.getElementById('walletSelect')?.value;
    if (!wallet) {
      errorEl.textContent = 'Please select a wallet provider to continue.';
      return false;
    }
  }
  
  return true;
}

function initPaymentPage() {
  buildCartPanelIfNeeded();
  attachCartPageNavigation();
  updateCartCount();
  const payload = JSON.parse(sessionStorage.getItem('pressmart_checkout_payload') || 'null');
  const content = document.getElementById('paymentSummary');
  if (!payload || !content) {
    document.getElementById('paymentContent')?.insertAdjacentHTML('afterbegin', '<p class="checkout-expired-msg">Checkout session expired. Please return to the cart.</p>');
    return;
  }
  const summary = payload.summary;
  
  // Render Itemized Checkout Summary
  const orderSummary = buildOrderSummary(payload.items);
  content.innerHTML = `
    <div class="payment-summary-items-list">
      ${orderSummary.rows}
    </div>
    <div class="payment-summary-details">
      <div class="payment-summary-item">
        <span>Subtotal</span>
        <span>${formatCurrency(summary.subtotal)}</span>
      </div>
      <div class="payment-summary-item">
        <span>Shipping</span>
        <span>${formatCurrency(summary.shipping)}</span>
      </div>
      <div class="payment-summary-item">
        <span>Tax (5%)</span>
        <span>${formatCurrency(summary.tax)}</span>
      </div>
      <div class="payment-summary-total">
        <span>Total Amount</span>
        <span class="final-price">${formatCurrency(summary.total)}</span>
      </div>
    </div>
  `;

  const form = document.getElementById('paymentForm');
  const errorEl = document.getElementById('paymentError');
  const submitBtn = document.getElementById('paymentSubmit');
  if (!form || !errorEl || !submitBtn) return;

  // Manage Payment Method switching
  const methodInputs = form.querySelectorAll('input[name="paymentMethod"]');
  const methodDetails = form.querySelectorAll('.method-details');
  const methodCards = form.querySelectorAll('.method-card');

  function updateActiveMethod() {
    const selected = form.paymentMethod?.value;
    methodDetails.forEach(detail => {
      const detailId = detail.id.replace('details-', '');
      if (detailId === selected) {
        detail.classList.add('active');
        detail.querySelectorAll('input, select').forEach(inp => inp.removeAttribute('disabled'));
      } else {
        detail.classList.remove('active');
        detail.querySelectorAll('input, select').forEach(inp => inp.setAttribute('disabled', 'true'));
      }
    });

    methodCards.forEach(card => {
      const radio = card.querySelector('input');
      card.classList.toggle('selected', radio && radio.checked);
    });
  }

  methodInputs.forEach(input => {
    input.addEventListener('change', updateActiveMethod);
  });
  
  // Initialize default active tab
  updateActiveMethod();

  // Helper Auto-formatting and quick selections
  // Card Number space separation (Credit & Debit)
  const formatCardNumber = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    e.target.value = formatted.substring(0, 19);
  };
  
  document.getElementById('cardNumber')?.addEventListener('input', formatCardNumber);
  document.getElementById('cardNumberDebit')?.addEventListener('input', formatCardNumber);

  // Card Expiry month/year separation (Credit & Debit)
  const formatCardExpiry = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) {
      e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
    } else {
      e.target.value = val;
    }
  };
  
  document.getElementById('cardExpiry')?.addEventListener('input', formatCardExpiry);
  document.getElementById('cardExpiryDebit')?.addEventListener('input', formatCardExpiry);

  // Exclude non-digits from CVV
  const limitCvvDigits = (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
  };
  document.getElementById('cardCvv')?.addEventListener('input', limitCvvDigits);
  document.getElementById('cardCvvDebit')?.addEventListener('input', limitCvvDigits);

  // UPI shortcuts tags click helper
  const upiInput = document.getElementById('upiId');
  const shortcutButtons = form.querySelectorAll('.upi-shortcut-tag');
  shortcutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!upiInput) return;
      let val = upiInput.value.trim().split('@')[0];
      if (!val) val = 'user';
      upiInput.value = val + btn.dataset.suffix;
      upiInput.focus();
    });
  });

  // Handle payment processing and redirect to confirmation
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selectedMethod = form.paymentMethod?.value;
    if (!selectedMethod) {
      errorEl.textContent = 'Select a payment method.';
      return;
    }
    if (!validatePaymentFields(selectedMethod)) return;
    
    // UI feedback
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(async () => {
      const orderId = `PM-${Date.now()}`;
      const order = {
        id: orderId,
        customer: payload.customer,
        items: payload.items,
        summary: payload.summary,
        paymentMethod: selectedMethod,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
        deliveryEstimate: 'Delivered in 4-7 business days',
      };
      
      // POST order details to backend
      try {
        const apiBase = window.API_BASE || 'http://127.0.0.1:5000/api';
        await fetch(apiBase + '/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        });
      } catch (err) {
        console.error('Failed to submit order to backend:', err);
      }
      
      const orders = getOrders();
      orders.unshift(order);
      saveOrders(orders);
      saveCart([]);
      updateCartCount();
      
      sessionStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(order));
      sessionStorage.removeItem(STORAGE_KEYS.buyNow);
      sessionStorage.removeItem('pressmart_checkout_payload');
      window.location.href = 'confirmation.html';
    }, 1800);
  });
}

function initConfirmationPage() {
  buildCartPanelIfNeeded();
  attachCartPageNavigation();
  updateCartCount();
  const order = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.lastOrder) || 'null');
  const content = document.getElementById('confirmationContent');
  if (!order || !content) {
    content.innerHTML = '<p>Order details not available. Please complete a purchase first.</p>';
    return;
  }
  content.innerHTML = `
    <div class="confirmation-card">
      <h2>Thank you for your order!</h2>
      <p>Order ID: <strong>${order.id}</strong></p>
      <p>${order.deliveryEstimate}</p>
      <div class="confirmation-section">
        <h4>Payment</h4>
        <p>${order.paymentMethod}</p>
      </div>
      <div class="confirmation-section">
        <h4>Customer</h4>
        <p>${order.customer.name}</p>
        <p>${order.customer.email}</p>
        <p>${order.customer.phone}</p>
      </div>
      <div class="confirmation-section">
        <h4>Shipping</h4>
        <p>${order.customer.address}, ${order.customer.city}, ${order.customer.state}, ${order.customer.zip}, ${order.customer.country}</p>
      </div>
      <div class="confirmation-section">
        <h4>Products</h4>
        ${order.items.map(item => {
          const product = getProductById(item.id);
          return product ? `<div class="confirmation-product"><img src="${product.images[0]}" alt="${product.title}"><div><strong>${product.title}</strong><span>${item.qty} × ${formatCurrency(product.price)}</span></div></div>` : '';
        }).join('')}
      </div>
      <div class="confirmation-section">
        <h4>Total Paid</h4>
        <p>${formatCurrency(order.summary.total)}</p>
      </div>
      <div class="confirmation-actions">
        <button type="button" id="downloadInvoiceBtn" class="btn-primary">Download Invoice</button>
        <button type="button" id="continueShoppingBtn" class="btn-outline">Continue Shopping</button>
      </div>
    </div>
  `;
  document.getElementById('downloadInvoiceBtn')?.addEventListener('click', () => {
    const invoiceText = `Order ID: ${order.id}\nCustomer: ${order.customer.name}\nEmail: ${order.customer.email}\nTotal: ${formatCurrency(order.summary.total)}\n\nProducts:\n${order.items.map(item => {
      const product = getProductById(item.id);
      return product ? `- ${product.title} x ${item.qty} = ${formatCurrency(product.price * item.qty)}` : '';
    }).join('\n')}`;
    const blob = new Blob([invoiceText], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PressMart_Order_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
  document.getElementById('continueShoppingBtn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

async function syncSessionWithBackend() {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/users/session', { credentials: 'include' });
    if (res.ok) {
      const user = await res.json();
      if (user) {
        const remember = !!localStorage.getItem(USER_STORAGE_KEYS.session);
        saveUserSession(user, remember);
      } else {
        sessionStorage.removeItem(USER_STORAGE_KEYS.session);
        localStorage.removeItem(USER_STORAGE_KEYS.session);
      }
    }
  } catch (err) {
    console.error('Failed to sync session with backend:', err);
  }
}

async function initPage() {
  await syncSessionWithBackend();
  renderUserStatus();
  updateCartCount();
  if (PAGE_TYPE === 'home') {
    initHomePage();
  }
  if (PAGE_TYPE === 'shop') {
    initShopPage();
  }
  if (PAGE_TYPE === 'product') {
    initProductPage();
  }
  if (PAGE_TYPE === 'cart') {
    initCartPage();
  }
  if (PAGE_TYPE === 'wishlist') {
    initWishlistPage();
  }
  if (PAGE_TYPE === 'blog') {
    initBlogPage();
  }
  if (PAGE_TYPE === 'article') {
    initArticlePage();
  }
  if (PAGE_TYPE === 'checkout') {
    initCheckoutPage();
  }
  if (PAGE_TYPE === 'payment') {
    initPaymentPage();
  }
  if (PAGE_TYPE === 'confirmation') {
    initConfirmationPage();
  }
  if (PAGE_TYPE === 'profile') {
    initProfilePage();
  }
}

function setupCartPanel() {
  buildCartPanelIfNeeded();
  document.body.addEventListener('click', event => {
    if (event.target.matches('.cart-wrap, .cart-wrap *')) return;
    if (event.target.closest('.cart-drawer')) return;
    closeCartDrawer();
  });

  document.body.addEventListener('click', event => {
    const removeBtn = event.target.closest('.cart-remove');
    if (removeBtn) {
      event.stopPropagation();
      let cart = getCart();
      cart = cart.filter(entry => entry.id !== removeBtn.dataset.id);
      saveCart(cart);
      updateCartCount();
      if (document.body.dataset.page === 'cart') initCartPage();
      else renderCartPanel();
      return;
    }

    const incBtn = event.target.closest('.cart-qty-increase');
    if (incBtn) {
      event.stopPropagation();
      const cart = getCart();
      const item = cart.find(entry => entry.id === incBtn.dataset.id);
      if (item) {
        item.qty += 1;
        saveCart(cart);
        updateCartCount();
        if (document.body.dataset.page === 'cart') initCartPage();
        else renderCartPanel();
      }
      return;
    }

    const decBtn = event.target.closest('.cart-qty-decrease');
    if (decBtn) {
      event.stopPropagation();
      const cart = getCart();
      const item = cart.find(entry => entry.id === decBtn.dataset.id);
      if (item) {
        item.qty = Math.max(1, item.qty - 1);
        saveCart(cart);
        updateCartCount();
        if (document.body.dataset.page === 'cart') initCartPage();
        else renderCartPanel();
      }
    }
  });
}

function initProfilePage() {
  const session = getUserSession();
  if (!session) {
    window.location.href = 'index.html';
    return;
  }
  
  // Set user details in inputs
  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const phoneInput = document.getElementById('profilePhone');
  
  if (nameInput) nameInput.value = session.name || '';
  if (emailInput) {
    emailInput.value = session.email || '';
    emailInput.setAttribute('readonly', 'true');
  }
  if (phoneInput) phoneInput.value = session.mobile || '';
  
  // Render sidebar name & email
  const sidebarName = document.getElementById('sidebarName');
  const sidebarEmail = document.getElementById('sidebarEmail');
  const sidebarAvatar = document.getElementById('sidebarAvatar');
  
  const name = session.name || session.email.split('@')[0] || 'Customer';
  if (sidebarName) sidebarName.textContent = name;
  if (sidebarEmail) sidebarEmail.textContent = session.email;
  if (sidebarAvatar) sidebarAvatar.textContent = name.charAt(0).toUpperCase();

  // Handle Profile Save Changes
  const form = document.getElementById('profileForm');
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const newName = nameInput?.value.trim();
      const newPhone = phoneInput?.value.trim();
      
      if (!newName) {
        alert('Name is required.');
        return;
      }
      
      try {
        const res = await fetch('http://127.0.0.1:5000/api/users/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.email, name: newName, mobile: newPhone }),
          credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Profile update failed');

        saveUserSession({ email: session.email, name: newName, mobile: newPhone }, true);
        
        if (sidebarName) sidebarName.textContent = newName;
        if (sidebarAvatar) sidebarAvatar.textContent = newName.charAt(0).toUpperCase();
        
        renderUserStatus();
        alert('Profile updated successfully!');
      } catch (err) {
        alert(err.message || 'Error occurred while updating profile.');
      }
    });
  }

  // Handle Tab Switcher
  document.querySelectorAll('.profile-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.panel;
      if (target === 'logout') {
        clearUserSession().then(() => {
          window.location.href = 'index.html';
        });
        return;
      }
      document.querySelectorAll('.profile-nav-item').forEach(el => el.classList.toggle('active', el === btn));
      document.querySelectorAll('.profile-content-panel').forEach(panel => panel.classList.toggle('active', panel.id === target));
    });
  });

  // Render Orders
  renderProfileOrders();
}

function renderProfileOrders() {
  const container = document.getElementById('profileOrders');
  if (!container) return;
  
  // Get orders from localStorage
  const orders = getOrders();
  if (!orders || !orders.length) {
    container.innerHTML = '<p class="empty-state">You have not placed any orders yet.</p>';
    return;
  }
  
  container.innerHTML = orders.map(order => {
    const itemsHtml = (order.items || []).map(item => {
      return `
        <div class="profile-order-item">
          <span>${item.name || 'Product'} (x${item.qty})</span>
          <span>${formatCurrency(item.price * item.qty)}</span>
        </div>
      `;
    }).join('');
    
    return `
      <div class="profile-order-card" style="margin-bottom: 16px;">
        <div class="profile-order-header">
          <div>
            <strong>Order #${order.order_number || order.id}</strong><br>
            <span>Date: ${new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
          </div>
          <div>
            <span class="profile-order-status status-${(order.order_status || 'Confirmed').toLowerCase()}">${order.order_status || 'Confirmed'}</span>
          </div>
        </div>
        <div class="profile-order-items">
          ${itemsHtml}
        </div>
        <div style="margin-top:12px; border-top:1px solid #eee; padding-top:8px; display:flex; justify-content:space-between; font-weight:700;">
          <span>Total:</span>
          <span>${formatCurrency(order.total || 0)}</span>
        </div>
      </div>
    `;
  }).join('');
}

main();
