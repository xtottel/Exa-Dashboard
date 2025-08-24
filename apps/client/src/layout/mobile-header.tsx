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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/logout"; // ✅ import logout util

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export function MobileHeader() {
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

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

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
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-foreground">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/home/settings/profile")}>
              <User className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/home/settings/security")}>
              <ShieldCheck className="mr-2 size-4" />
              Security
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 hover:text-red-700 focus:text-red-700"
            >
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
