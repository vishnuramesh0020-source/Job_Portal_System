import axios from 'axios';

// In-flight promise cache and response cache for GET requests
const inFlightRequests = new Map();
const responseCache = new Map();
const CACHE_TTL_MS = 60000; // 60 seconds

// Create an Axios instance for API communications
export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Third-party REST API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clear cache helper (called on mutations or manual refresh)
export const clearApiCache = () => {
  responseCache.clear();
  inFlightRequests.clear();
};

// Preserve original get method
const originalGet = api.get.bind(api);

// Enhanced GET with in-flight deduplication and TTL caching
api.get = (url, config = {}) => {
  // If forceRefresh / bypassCache is explicitly requested
  if (config.bypassCache) {
    return originalGet(url, config);
  }

  const cacheKey = `${url}_${JSON.stringify(config.params || {})}`;
  const now = Date.now();

  // 1. Check TTL response cache
  const cached = responseCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return Promise.resolve(cached.response);
  }

  // 2. Check in-flight requests (concurrent deduplication)
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  // 3. Make real network request
  const requestPromise = originalGet(url, config)
    .then((response) => {
      responseCache.set(cacheKey, { timestamp: Date.now(), response });
      inFlightRequests.delete(cacheKey);
      return response;
    })
    .catch((error) => {
      inFlightRequests.delete(cacheKey);
      throw error;
    });

  inFlightRequests.set(cacheKey, requestPromise);
  return requestPromise;
};

// Interceptor for mutations: automatically invalidate cache on POST, PUT, DELETE, PATCH
api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toLowerCase();
    if (method && method !== 'get' && method !== 'head' && method !== 'options') {
      clearApiCache();
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
