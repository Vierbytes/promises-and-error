// Retry Utility - Recursive retry mechanism for async operations

export function retryPromise<T>(
    asyncFn: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    return asyncFn().catch((error) => {
      if (retries <= 0) {
        return Promise.reject(error);
      }

    console.log(`Retrying... Attempts remaining: ${retries}. Waiting ${delay}ms`);

    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        retryPromise(asyncFn, retries - 1, delay)
          .then(resolve)
          .catch(reject);
      }, delay);
    });
  });
}
