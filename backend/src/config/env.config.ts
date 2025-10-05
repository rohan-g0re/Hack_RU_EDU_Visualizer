import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  supabase: {
    url: string;
    serviceKey: string;
    jwtSecret: string;
  };
  ai: {
    anthropicApiKey: string;
    geminiApiKey: string;
    geminiModel: string;
    geminiSvgModel: string;
  };
  stripe: {
    secretKey: string;
    webhookSecret: string;
  };
  cors: {
    origin: string | string[];
  };
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: EnvConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: getEnvVar('SUPABASE_URL'),
    serviceKey: getEnvVar('SUPABASE_SERVICE_KEY'),
    jwtSecret: getEnvVar('SUPABASE_JWT_SECRET'),
  },
  ai: {
    anthropicApiKey: getEnvVar('ANTHROPIC_API_KEY'),
    geminiApiKey: getEnvVar('GEMINI_API_KEY'),
    // Default to flash-2.0 for general tasks
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    // Use flash-2.5 specifically for SVG generation
    geminiSvgModel: process.env.GEMINI_SVG_MODEL || 'gemini-2.5-flash',
  },
  stripe: {
    secretKey: getEnvVar('STRIPE_SECRET_KEY'),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  },
};

