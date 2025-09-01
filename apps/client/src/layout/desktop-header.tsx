"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

import {
  Plus,
  MessageSquareText,
  CreditCard,
  Settings,
  ShieldCheck,
  Clapperboard,
  Loader2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailVerified: string | null;
  isActive: boolean;
  business: {
    id: string;
    name: string;
    isActive: boolean;
  };
  role: {
    name: string;
    permissions: string[];
  };
}

export function DesktopHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("bearerToken");

        if (!token) {
          console.warn("No token found, redirecting to login");
          router.push("/login");
          return;
        }

        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else if (response.status === 401) {
          // Token expired or invalid
          console.warn("Token invalid, redirecting to login");
          localStorage.removeItem("bearerToken");
          localStorage.removeItem("user");
          router.push("/login");
        } else {
          console.error("Failed to fetch user data");
          toast.error("Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem("bearerToken");

      // Call logout API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("bearerToken");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");

        // Clear cookies by setting expired dates
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");

      // Fallback: Clear storage even if API call fails
      localStorage.removeItem("bearerToken");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiry");
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "US";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  // Get full user name
  const getUserName = () => {
    if (!user) return "Loading...";
    return `${user.firstName} ${user.lastName}`;
  };

  // Get business name
  const getBusinessName = () => {
    if (!user) return "";
    return user.business?.name || "";
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 hidden h-16 w-full items-center justify-between border-b bg-slate-200 px-6 backdrop-blur supports-[backdrop-filter]:bg-slate-200/60 md:flex">
        {/* Business name skeleton */}
        <Skeleton className="h-6 w-48" />
        
        <div className="flex items-center gap-6">
          {/* Watch Video button skeleton */}
          <Skeleton className="h-9 w-32" />
          
          {/* Create New button skeleton */}
          <Skeleton className="h-9 w-32" />
          
          {/* Profile skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 hidden h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex">
      {/* Left: Branding */}
      <div className="text-lg font-semibold text-muted-foreground">
        {getBusinessName()}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* get started button */}
        <Button
          variant="outline"
          className="text-sm font-medium flex items-center gap-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 focus:bg-red-500/20 focus:text-red-700"
          onClick={() => router.push("/home/get-started")}
          
        >
          <Clapperboard className="h-4 w-4" />
          Watch Video
        </Button>
        {/* Quick Create Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/home/sms/send")}>
              <MessageSquareText className="w-4 h-4 mr-2" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/home/credits/buy")}>
              <CreditCard className="w-4 h-4 mr-2" />
              Buy Credit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer rounded-full ring-2 ring-muted-foreground/30 px-2 py-1 transition hover:ring-foreground">
              <Avatar className="h-8 w-8">
                {/* <AvatarImage src="/user.jpg" alt="@user" /> */}
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground">
                {getUserName()}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push("/home/settings/profile")}
            >
              <Settings className="w-4 h-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/home/settings/security")}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Security
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 hover:text-red-700"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Log out"
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}