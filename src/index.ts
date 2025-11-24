// E-commerce Dashboard - Main Application Logic
import { fetchProductCatalog, fetchProductReviews, fetchSalesReport, Product, Review, SalesReport } from './apiSimulator.js';
import { retryPromise } from './retryUtility.js';
import { NetworkError, DataError } from './errors.js';

// Configuration for retry mechanism
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Main dashboard function
async function runDashboard(): Promise<void> {
  console.log('=== E-commerce Dashboard Starting ===\n');

  let products: Product[] = [];
  let allReviews: Map<number, Review[]> = new Map();
  let salesReport: SalesReport | null = null;

  // Step 1: Fetch product catalog with retry
  console.log('Fetching product catalog...');
  await retryPromise(() => fetchProductCatalog(), MAX_RETRIES, RETRY_DELAY)
    .then((catalog) => {
      products = catalog;
      console.log(`Successfully fetched ${products.length} products:`);
      products.forEach(product => {
        console.log(`  - ${product.name}: $${product.price}`);
      });
      console.log('');
    })
    .catch((error) => {
      if (error instanceof NetworkError) {
        console.error(`Network Error: ${error.message}`);
      } else if (error instanceof DataError) {
        console.error(`Data Error: ${error.message}`);
      } else {
        console.error(`Unexpected Error: ${error.message}`);
      }
      console.log('Failed to fetch product catalog after all retries.\n');
    })
    .finally(() => {
      console.log('Product catalog fetch attempt completed.\n');
    });

  // Step 2: Fetch reviews for each product
  if (products.length > 0) {
    console.log('Fetching reviews for each product...');

    const reviewPromises = products.map(product => {
      return retryPromise(
        () => fetchProductReviews(product.id),
        MAX_RETRIES,
        RETRY_DELAY
      )
        .then((reviews) => {
          allReviews.set(product.id, reviews);
          console.log(`  Reviews for ${product.name}:`);
          reviews.forEach(review => {
            console.log(`    - ${review.author}: ${review.rating}/5 - "${review.comment}"`);
          });
        })
        .catch((error) => {
          if (error instanceof NetworkError) {
            console.error(`  Network Error fetching reviews for ${product.name}: ${error.message}`);
          } else if (error instanceof DataError) {
            console.error(`  Data Error for ${product.name}: ${error.message}`);
          } else {
            console.error(`  Unexpected Error for ${product.name}: ${error.message}`);
          }
        })
        .finally(() => {
          console.log(`  Review fetch for ${product.name} completed.`);
        });
    });

    await Promise.all(reviewPromises);
    console.log('\nAll product reviews fetch attempts completed.\n');
  }

  // Step 3: Fetch sales report after products and reviews
  console.log('Fetching sales report...');
  await retryPromise(() => fetchSalesReport(), MAX_RETRIES, RETRY_DELAY)
    .then((report) => {
      salesReport = report;
      console.log('Sales Report:');
      console.log(`  Total Sales: $${report.totalSales}`);
      console.log(`  Units Sold: ${report.unitsSold}`);
      console.log(`  Average Price: $${report.averagePrice}`);
    })
    .catch((error) => {
      if (error instanceof NetworkError) {
        console.error(`Network Error: ${error.message}`);
      } else if (error instanceof DataError) {
        console.error(`Data Error: ${error.message}`);
      } else {
        console.error(`Unexpected Error: ${error.message}`);
      }
      console.log('Failed to fetch sales report after all retries.');
    })
    .finally(() => {
      console.log('\nSales report fetch attempt completed.');
    });

  // Summary
  console.log('\n=== Dashboard Summary ===');
  console.log(`Products loaded: ${products.length}`);
  console.log(`Products with reviews: ${allReviews.size}`);
  console.log(`Sales report: ${salesReport ? 'Loaded' : 'Failed to load'}`);
  console.log('=== Dashboard Complete ===\n');
}

// Run the dashboard
runDashboard().catch(console.error);
