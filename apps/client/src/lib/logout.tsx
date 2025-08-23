"use client";

import { toast } from "sonner";

export async function logout() {
  try {
    // ✅ Clear cookie token
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // ✅ Clear localStorage (if token is stored there)
    localStorage.removeItem("token");

    toast.success("Logged out successfully");

    // ✅ Redirect to login
    window.location.href = "/login";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error("Logout failed, please try again");
  }
}
