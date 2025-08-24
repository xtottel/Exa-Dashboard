
"use client";

import { toast } from "sonner";

export async function logout() {
  try {
    // ✅ Call the logout API endpoint
    const response = await fetch("https://onetime.sendexa.co/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include the token in the Authorization header if needed
        Authorization: `Bearer ${localStorage.getItem("bearerToken") || ""}`,
      },
      credentials: "include", // Include cookies if your API uses them
    });

    // ✅ Clear client-side storage regardless of API response
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Clear all relevant localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("bearerToken");
    localStorage.removeItem("user");
    
    // Clear sessionStorage as well if used
    sessionStorage.clear();

    if (response.ok) {
      toast.success("Logged out successfully");
    } else {
      // Even if API call fails, we still clear client-side data
      const result = await response.json();
      toast.success("Logged out successfully"); // Still show success to user
      console.warn("Logout API call failed, but client data cleared:", result.message);
    }

    // ✅ Redirect to login
    window.location.href = "/login";
    
  } catch (error) {
    // Even if there's an error, we should still clear client-side data
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("token");
    localStorage.removeItem("bearerToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
    
    toast.success("Logged out successfully"); // Still show success to user
    console.error("Logout error:", error);
    
    // ✅ Redirect to login
    window.location.href = "/login";
  }
}