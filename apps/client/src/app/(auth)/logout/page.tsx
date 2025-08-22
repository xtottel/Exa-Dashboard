"use client";

import { toast } from "sonner";

export function logout() {
  // Clear cookies
  document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
  toast.success("Logged out successfully");
  window.location.href = "/login";
}

// Usage in your dashboard component:
// <Button onClick={logout}>Logout</Button>