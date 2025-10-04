import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for AI endpoints
 * Limits requests per user to prevent abuse
 */
export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP/user to 10 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this user, please try again later.',
    statusCode: 429,
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Use user ID from authenticated request for rate limiting
  keyGenerator: (req) => {
    const authReq = req as any;
    return authReq.user?.id || req.ip || 'anonymous';
  },
});

/**
 * General API rate limiter
 * More permissive for non-AI endpoints
 */
export const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests, please try again later.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

