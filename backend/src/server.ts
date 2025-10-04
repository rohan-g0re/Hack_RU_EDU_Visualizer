import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { authenticateUser } from './middleware/auth.middleware';
import { aiRateLimiter, generalRateLimiter } from './middleware/rateLimit.middleware';
import healthRoutes from './routes/health.routes';
import aiRoutes from './routes/ai.routes';

// Create Express app
const app: Application = express();

// Trust proxy - important for rate limiting behind reverse proxies (like Render)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline SVG
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for PDF uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// General rate limiter for all routes
app.use(generalRateLimiter);

// Health check route (no authentication required)
app.use('/api/health', healthRoutes);

// AI routes (authentication required + stricter rate limiting)
app.use('/api/ai', authenticateUser, aiRateLimiter, aiRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔒 CORS enabled for: ${config.cors.origin}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;

