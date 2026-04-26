/**
 * Environment Variable Validation
 * 
 * Validates required environment variables at startup
 * Throws descriptive errors if critical vars are missing
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
];

const optionalEnvVars = [
  'GROQ_API_KEY',
  'OPENAI_API_KEY',
  'EMAIL_SERVER_HOST',
  'SENTRY_DSN',
  'NEXT_PUBLIC_GA_ID',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
];

/**
 * Validate required environment variables
 * Call this at application startup
 */
export function validateEnv() {
  const missing: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please set these variables in your .env file or Vercel project settings.`
    );
  }
  
  // Warn about missing optional vars
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`[ENV] Warning: ${envVar} is not set. Some features may be unavailable.`);
    }
  }
  
  console.log('[ENV] Environment validation passed');
}

/**
 * Get a required environment variable or throw
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Get an optional environment variable with default
 */
export function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}