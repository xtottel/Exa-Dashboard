

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import {
  Plus,
  MessageSquareText,
  CreditCard,
  Settings,
  ShieldCheck,
  Building2,
  LogOut,
} from "lucide-react";

import { useRouter } from "next/navigation";
// Update the path below to the correct location of your logout utility
// For example, if it's in src/auth/logout.ts, use:
import { logout } from "@/lib/logout";

export function DesktopHeader() {
  const router = useRouter();

  // Static sample data (replace with real values from context or props)
  const userName = "Collins Joe";

  return (
    <header className="sticky top-0 z-40 hidden h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex">
      {/* Left: Branding */}
      <div className="text-lg font-semibold text-muted-foreground">
        {/* Sendexa Dashboard */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">

        {/* Quick Create Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-sm font-medium flex items-center gap-2">
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
                <AvatarImage src="/user.svg" alt="@user" />
                <AvatarFallback>CL</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground">{userName}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/home/settings/profile")}>
              <Settings className="w-4 h-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/home/settings/security")}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Security
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/home/settings/business")}>
              <Building2 className="w-4 h-4 mr-2" />
              Business
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
