export interface Sneaker {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  sizes: number[];
  colors: string[];
  badge?: string;
  stock: number;
  sku: string;
  category?: string;
}

export const brands = ["Nike", "Adidas", "Puma", "Reebok", "Vans", "New Balance"];

export const sneakers: Sneaker[] = [
  {
    id: "1", name: "Air Max 90 Essential", brand: "Nike", price: 65, originalPrice: 120,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    rating: 4.5, reviews: 234, sizes: [7, 8, 9, 10, 11, 12], colors: ["#fff", "#000", "#e53e3e"],
    badge: "Budget Gem", stock: 45, sku: "NK-AM90-001", category: "Running"
  },
  {
    id: "2", name: "Ultraboost 22", brand: "Adidas", price: 89, originalPrice: 180,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop",
    rating: 4.8, reviews: 567, sizes: [7, 8, 9, 10, 11], colors: ["#000", "#fff"],
    badge: "High Demand", stock: 12, sku: "AD-UB22-002", category: "Running"
  },
  {
    id: "3", name: "RS-X Reinvention", brand: "Puma", price: 55, originalPrice: 110,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop",
    rating: 4.2, reviews: 89, sizes: [8, 9, 10, 11, 12], colors: ["#fff", "#3182ce"],
    badge: "Verified Authentic", stock: 78, sku: "PM-RSX-003", category: "Lifestyle"
  },
  {
    id: "4", name: "Classic Leather", brand: "Reebok", price: 45, originalPrice: 75,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=300&fit=crop",
    rating: 4.0, reviews: 156, sizes: [7, 8, 9, 10, 11, 12, 13], colors: ["#fff", "#000"],
    stock: 120, sku: "RB-CL-004", category: "Classic"
  },
  {
    id: "5", name: "Old Skool", brand: "Vans", price: 60, originalPrice: 70,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop",
    rating: 4.6, reviews: 890, sizes: [6, 7, 8, 9, 10, 11, 12], colors: ["#000", "#fff", "#e53e3e"],
    badge: "Budget Gem", stock: 200, sku: "VN-OS-005", category: "Skate"
  },
  {
    id: "6", name: "574 Core", brand: "New Balance", price: 69, originalPrice: 90,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
    rating: 4.3, reviews: 345, sizes: [7, 8, 9, 10, 11, 12], colors: ["#718096", "#fff"],
    badge: "Verified Authentic", stock: 67, sku: "NB-574-006", category: "Lifestyle"
  },
  {
    id: "7", name: "Dunk Low Retro", brand: "Nike", price: 95, originalPrice: 110,
    image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400&h=300&fit=crop",
    rating: 4.7, reviews: 1200, sizes: [7, 8, 9, 10, 11], colors: ["#fff", "#000", "#38a169"],
    badge: "High Demand", stock: 5, sku: "NK-DL-007", category: "Lifestyle"
  },
  {
    id: "8", name: "Suede Classic XXI", brand: "Puma", price: 42, originalPrice: 70,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=300&fit=crop",
    rating: 4.1, reviews: 210, sizes: [8, 9, 10, 11, 12], colors: ["#2d3748", "#e53e3e"],
    badge: "Pending Scan", stock: 34, sku: "PM-SC-008", category: "Classic"
  },
];

export const scoutMatches = [
  { id: "m1", name: "Air Max 97 Silver Bullet", brand: "Nike", price: 68, match: 94, colorway: "Metallic Silver/Varsity Red", authenticated: true, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { id: "m2", name: "Yeezy Boost 350 V2", brand: "Adidas", price: 89, match: 87, colorway: "Sesame", authenticated: true, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop" },
  { id: "m3", name: "React Element 87", brand: "Nike", price: 72, match: 82, colorway: "Sail/Light Bone", authenticated: false, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop" },
  { id: "m4", name: "NMD R1 Primeknit", brand: "Adidas", price: 55, match: 78, colorway: "Core Black/Gum", authenticated: true, image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=300&fit=crop" },
  { id: "m5", name: "Gel-Lyte III", brand: "Puma", price: 61, match: 75, colorway: "Koi Fish", authenticated: true, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop" },
  { id: "m6", name: "Classic Nylon", brand: "Reebok", price: 38, match: 71, colorway: "White/Grey", authenticated: true, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop" },
];

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export const blogCategories = [
  { name: "Sneaker Culture", description: "Trends, history, and community stories", count: 24 },
  { name: "Deal Alerts", description: "Latest drops and price notifications", count: 18 },
  { name: "Style Guides", description: "How to rock your kicks with confidence", count: 15 },
  { name: "AI & Tech", description: "How our AI finds your perfect match", count: 9 },
  { name: "Brand Spotlights", description: "Deep dives into iconic sneaker brands", count: 12 },
  { name: "Reviews", description: "Honest reviews from the 100 Sneaker team", count: 21 },
];

export const blogPosts: BlogPost[] = [
  {
    id: "bp1", title: "Top 10 Budget Sneakers That Look Expensive", excerpt: "You don't need to break the bank to look like a million bucks. These picks fool even the sneakerheads.",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=400&fit=crop",
    author: "Alex Chen", date: "Feb 28, 2026", category: "Style Guides", readTime: "5 min read"
  },
  {
    id: "bp2", title: "How AI Is Changing the Sneaker Resale Market", excerpt: "From authentication to price prediction, AI tools are disrupting how we buy and sell sneakers.",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=400&fit=crop",
    author: "Jordan Lee", date: "Feb 25, 2026", category: "AI & Tech", readTime: "7 min read"
  },
  {
    id: "bp3", title: "Nike Dunk Low: The $60 Colorways You're Sleeping On", excerpt: "These under-the-radar Dunk colorways are available right now for way less than you'd think.",
    image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&h=400&fit=crop",
    author: "Maya Rodriguez", date: "Feb 22, 2026", category: "Deal Alerts", readTime: "4 min read"
  },
  {
    id: "bp4", title: "The Rise of Retro Runners in Streetwear", excerpt: "Dad shoes aren't going anywhere. Here's why retro runners are the new grails of 2026.",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=400&fit=crop",
    author: "Alex Chen", date: "Feb 18, 2026", category: "Sneaker Culture", readTime: "6 min read"
  },
  {
    id: "bp5", title: "Puma vs New Balance: Best Budget Picks Compared", excerpt: "We put the most affordable models head-to-head. The results might surprise you.",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop",
    author: "Jordan Lee", date: "Feb 14, 2026", category: "Reviews", readTime: "8 min read"
  },
  {
    id: "bp6", title: "5 Signs Your Sneakers Are Fake (And How AI Detects Them)", excerpt: "Our AI authentication catches what the human eye misses. Learn the telltale signs of counterfeit kicks.",
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=400&fit=crop",
    author: "Maya Rodriguez", date: "Feb 10, 2026", category: "AI & Tech", readTime: "5 min read"
  },
];

export const adminStats = {
  totalRevenue: 48250,
  activeListings: 156,
  aiScoutUsage: 2340,
  revenueTrend: 12.5,
  listingsTrend: 8.3,
  scoutTrend: 24.1,
};

export const recentListings = [
  { id: "1", product: "Air Max 90", price: 65, stock: 45, status: "Active" },
  { id: "2", product: "Ultraboost 22", price: 89, stock: 12, status: "Active" },
  { id: "3", product: "RS-X Reinvention", price: 55, stock: 78, status: "Active" },
  { id: "4", product: "Dunk Low Retro", price: 95, stock: 5, status: "Low Stock" },
  { id: "5", product: "Suede Classic XXI", price: 42, stock: 0, status: "Out of Stock" },
];
