// lib/auth.ts
export const setAuthCookies = (accessToken: string, refreshToken?: string) => {
  // Set access token cookie (1 week expiry)
  document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; secure=${process.env.NODE_ENV === 'production'}; sameSite=lax`;
  
  // Set refresh token cookie (30 days expiry)
  if (refreshToken) {
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; secure=${process.env.NODE_ENV === 'production'}; sameSite=lax`;
  }
  
  // Store in localStorage for immediate client-side access
  localStorage.setItem('bearerToken', accessToken);
};

export const getBearerToken = (): string | null => {
  // First try to get from localStorage (for immediate use)
  const localToken = localStorage.getItem('bearerToken');
  if (localToken) return localToken;
  
  // Fallback to cookie (for SSR/initial load)
  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1];
  
  return cookieToken || null;
};

export const clearAuthCookies = () => {
  // Clear cookies
  document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
  // Clear localStorage
  localStorage.removeItem('bearerToken');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getBearerToken();
};