"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  User,
  Plus,
  MessageSquareText,
  CreditCard,
  ShieldCheck,
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

export function MobileHeader() {
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
    return user.business.name;
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        {/* Left: Sidebar trigger + logo */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
         
           <Image
          src="https://cdn.sendexa.co/images/logo/exaweb.png"
          alt="Sendexa Logo"
          width={100}
          height={40}
          className="h-7 w-auto object-contain"
        />
        </div>

        {/* Right: Loading state */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      {/* Left: Sidebar trigger + logo */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Image
          src="https://cdn.sendexa.co/images/logo/exaweb.png"
          alt="Sendexa Logo"
          width={100}
          height={40}
          className="h-7 w-auto object-contain"
        />
      </div>

      {/* Right: Quick Actions + Avatar */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Plus className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/home/sms/send")}>
              <MessageSquareText className="mr-2 size-4" />
              Send Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/home/credits/buy")}>
              <CreditCard className="mr-2 size-4" />
              Buy Credit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer rounded-full ring-2 ring-muted-foreground/30 p-0.5 transition hover:ring-foreground">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-foreground">
                {getUserName()}
              </p>
              <p className="text-xs text-muted-foreground">
                {getBusinessName()}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/home/settings/profile")}
            >
              <User className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/home/settings/security")}
            >
              <ShieldCheck className="mr-2 size-4" />
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
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 size-4" />
                  Log out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
