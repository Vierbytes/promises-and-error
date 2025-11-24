// API Simulator - Promise-based mock API functions
import { NetworkError, DataError } from './errors.js';

// Type definitions
export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface Review {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  author: string;
}

export interface SalesReport {
  totalSales: number;
  unitsSold: number;
  averagePrice: number;
}

// Mock data
const mockProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Smartphone', price: 699.99 },
  { id: 3, name: 'Headphones', price: 199.99 },
  { id: 4, name: 'Tablet', price: 449.99 },
  { id: 5, name: 'Smartwatch', price: 299.99 }
];

const mockReviews: Review[] = [
  { id: 1, productId: 1, rating: 5, comment: 'Excellent laptop!', author: 'John' },
  { id: 2, productId: 1, rating: 4, comment: 'Good performance', author: 'Jane' },
  { id: 3, productId: 2, rating: 5, comment: 'Best phone ever', author: 'Mike' },
  { id: 4, productId: 2, rating: 3, comment: 'Battery could be better', author: 'Sarah' },
  { id: 5, productId: 3, rating: 4, comment: 'Great sound quality', author: 'Tom' },
  { id: 6, productId: 4, rating: 5, comment: 'Perfect for work', author: 'Lisa' },
  { id: 7, productId: 5, rating: 4, comment: 'Nice features', author: 'Alex' }
];

const mockSalesReport: SalesReport = {
  totalSales: 125000,
  unitsSold: 450,
  averagePrice: 277.78
};

// Helper function to determine if request should fail (20% chance)
function shouldFail(): boolean {
  return Math.random() < 0.2;
}

// Fetch product catalog
export function fetchProductCatalog(): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new NetworkError('Failed to fetch product catalog: Network connection timeout'));
      } else {
        resolve(mockProducts);
      }
    }, 1000);
  });
}

// Fetch product reviews
export function fetchProductReviews(productId: number): Promise<Review[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new NetworkError(`Failed to fetch reviews for product ${productId}: Server unavailable`));
      } else {
        const reviews = mockReviews.filter(review => review.productId === productId);
        if (reviews.length === 0) {
          reject(new DataError(`No reviews found for product ${productId}`));
        } else {
          resolve(reviews);
        }
      }
    }, 1500);
  });
}

// Fetch sales report
export function fetchSalesReport(): Promise<SalesReport> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail()) {
        reject(new NetworkError('Failed to fetch sales report: Database connection failed'));
      } else {
        resolve(mockSalesReport);
      }
    }, 1000);
  });
}
