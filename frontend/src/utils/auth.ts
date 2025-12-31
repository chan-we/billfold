import { AuthConfig } from '@/config/auth.config';

/**
 * Redirect to login page with current full URL as redirect parameter
 */
export function redirectToLogin(): void {
  // Use full URL (window.location.href) instead of just path
  const currentFullUrl = window.location.href;
  const loginUrl = `${AuthConfig.loginUrl}?${AuthConfig.redirectParamName}=${encodeURIComponent(currentFullUrl)}`;
  window.location.href = loginUrl;
}

/**
 * Check if error is an authentication error (401)
 */
export function isAuthError(status: number): boolean {
  return status === 401;
}
