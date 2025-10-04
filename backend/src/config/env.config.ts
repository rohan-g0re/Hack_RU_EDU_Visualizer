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
    // Default to a widely available model; can be overridden via GEMINI_MODEL
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  },
};

