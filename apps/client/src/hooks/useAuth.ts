// hooks/useAuth.ts
"use client";

import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getAccessToken, isTokenExpired, getValidToken, verifyToken } from '@/lib/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getValidToken();
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Verify token with backend for extra security
      const isValid = await verifyToken(token);
      setIsAuthenticated(isValid);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isAuthenticated, isLoading, checkAuth };
}