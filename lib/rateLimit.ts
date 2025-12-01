import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  max: number;
  windowMs: number;
}

const rateLimitCache = new LRUCache<string, number>({
  max: 500, // Max 500 unique IPs
  ttl: 60000, // 1 minute
});

/**
 * Check if IP is rate limited
 */
export function rateLimit(ip: string, options: RateLimitOptions): boolean {
  const key = ip;
  const count = rateLimitCache.get(key) as number || 0;
  
  if (count >= options.max) {
    return false; // Rate limited
  }
  
  rateLimitCache.set(key, count + 1);
  return true; // Allowed
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  // Try various headers to get real IP
  const headers = {
    'x-forwarded-for': request.headers.get('x-forwarded-for'),
    'x-real-ip': request.headers.get('x-real-ip'),
    'cf-connecting-ip': request.headers.get('cf-connecting-ip'), // Cloudflare
  };

  let ip = '127.0.0.1'; // Default to localhost

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      // Take first IP if multiple (proxy chain)
      ip = value.split(',')[0].trim();
      break;
    }
  }

  return ip;
}

/**
 * Middleware function for rate limiting
 */
export function createRateLimiter(max: number, windowMs: number = 60000) {
  return async (request: Request): Promise<{ allowed: boolean; resetTime: number }> => {
    const ip = getClientIP(request);
    const allowed = rateLimit(ip, { max, windowMs });
    
    // Get reset time (current time + window)
    const resetTime = Date.now() + windowMs;
    
    return { allowed, resetTime };
  };
}

/**
 * Common rate limiters
 */
export const rateLimiters = {
  // Strict rate limiter for auth endpoints
  auth: createRateLimiter(5, 60000), // 5 requests per minute
  
  // Medium rate limiter for API endpoints
  api: createRateLimiter(30, 60000), // 30 requests per minute
  
  // Lenient rate limiter for upload endpoints
  upload: createRateLimiter(20, 60000), // 20 requests per minute
  
  // Very lenient for public endpoints
  public: createRateLimiter(100, 60000), // 100 requests per minute
};






