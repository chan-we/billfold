/**
 * Authentication configuration for Fence gateway integration
 */
export const AuthConfig = {
  /** Unified login page URL - replace with actual URL */
  loginUrl: import.meta.env.VITE_LOGIN_URL || 'https://hat.ushiwe.com/login',

  /** Query parameter name for redirect URL (full URL, not path) */
  redirectParamName: 'redirectUrl',

  /** Cookie name used by Fence gateway (for reference only, cannot read HttpOnly cookie) */
  cookieName: 'CowboyHat',
} as const;
