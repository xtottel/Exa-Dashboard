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

import {
  Plus,
  MessageSquareText,
  CreditCard,
  Settings,
  ShieldCheck,
  LogOut,
  Clapperboard,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/logout";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export function DesktopHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Fetch logged in user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Failed to fetch profile");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchUser();
  }, []);

  // Full name & initials
  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 hidden h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex">
      {/* Left: Branding */}
      <div className="text-lg font-semibold text-muted-foreground">
        {/* Sendexa Dashboard */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* get started button */}
        <Button
          variant="outline"
          className="text-sm font-medium flex items-center gap-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 focus:bg-red-500/20 focus:text-red-700"
          onClick={() => router.push("/home/get-started")}
         // onClick={() => router.push("/home/sms/send")}
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
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground">
                {fullName}
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
              onClick={logout}
              className="text-red-600 hover:text-red-700 focus:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
