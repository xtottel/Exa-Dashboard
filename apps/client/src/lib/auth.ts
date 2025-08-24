// lib/auth.ts
"use client";

import { toast } from "sonner";

// Store the current refresh promise to prevent multiple simultaneous refresh calls
let refreshPromise: Promise<string | null> | null = null;

export async function logout() {
  try {
    // Call the logout API endpoint
    const response = await fetch("https://onetime.sendexa.co/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookie-based auth
    });

    // Clear all client-side storage
    clearAuthData();

    if (response.ok) {
      const result = await response.json();
      toast.success(result.message || "Logged out successfully");
    } else {
      toast.success("Logged out successfully");
    }

    // Redirect to login
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
    
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Ensure cleanup even if API call fails
    clearAuthData();
    toast.success("Logged out successfully");
    
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  }
}

export function clearAuthData() {
  // Clear all cookies (more comprehensive approach)
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  // Clear localStorage
  localStorage.removeItem("bearerToken");
  localStorage.removeItem("user");
  localStorage.removeItem("tokenExpiry");
  
  // Clear sessionStorage
  sessionStorage.clear();
}

export async function refreshAccessToken(): Promise<string | null> {
  // If we're already refreshing, return the same promise
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch("https://onetime.sendexa.co/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for sending refresh cookie
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const result = await response.json();
      
      if (result.token) {
        // Store the new access token
        localStorage.setItem("bearerToken", result.token);
        
        // Set token expiry (assuming 15 minutes expiry, adjust as needed)
        const expiryTime = Date.now() + (15 * 60 * 1000);
        localStorage.setItem("tokenExpiry", expiryTime.toString());
        
        return result.token;
      }
      
      return null;
    } catch (error) {
      console.error("Token refresh error:", error);
      
      // If refresh fails, logout the user
      if (confirm("Your session has expired. Would you like to login again?")) {
        await logout();
      } else {
        clearAuthData();
        window.location.href = "/login";
      }
      
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function getAccessToken(): string | null {
  return localStorage.getItem("bearerToken");
}

export function isTokenExpired(): boolean {
  const expiryTime = localStorage.getItem("tokenExpiry");
  if (!expiryTime) return true;
  
  return Date.now() > parseInt(expiryTime);
}

export async function getValidToken(): Promise<string | null> {
  const token = getAccessToken();
  
  if (!token) {
    return null;
  }
  
  if (isTokenExpired()) {
    return await refreshAccessToken();
  }
  
  return token;
}

// API fetch wrapper with automatic token refresh
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getValidToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let response = await fetch(url, { ...options, headers });

  // If token is expired and we got 401, try to refresh and retry
  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // Retry the request with the new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
      });
    }
  }

  return response;
}

// Verify token with backend
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch("https://onetime.sendexa.co/api/auth/verify", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
}