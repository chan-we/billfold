import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  database: process.env.DB_DATABASE || 'billfold',
}));

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : undefined,
  pass: process.env.REDIS_PASS,
}));

export const cloudflareConfig = registerAs('cloudflare', () => ({
  accountId: process.env.CF_ACCOUNT_ID,
  namespaceId: process.env.CF_NAMESPACE_ID,
  apiToken: process.env.CF_API_TOKEN,
}));

export const securityConfig = registerAs('security', () => ({
  jwtSecret: process.env.JWT_SECRET,
  redirectWhitelist: process.env.REDIRECT_WHITELIST,
}));

// Helper function to check if Cloudflare config is complete
export function isCloudflareConfigComplete(config: {
  accountId?: string;
  namespaceId?: string;
  apiToken?: string;
}): boolean {
  return !!(config.accountId && config.namespaceId && config.apiToken);
}
