// components/desktop-header.tsx

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

export function DesktopHeader() {
  return (
    <header className="sticky top-0 z-40 hidden h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex">
      {/* Left Side - Branding or Navigation Placeholder */}
      <div className="text-lg font-semibold text-muted-foreground">
        Sendexa Dashboard
      </div>

      {/* Right Side - Buttons and Avatar */}
      <div className="flex items-center gap-4">
        {/* Balance Button */}
        <Button
          variant="outline"
          className="text-sm font-medium text-green-600 hover:bg-green-100 dark:hover:bg-green-900"
        >
          GHS 420.00
        </Button>

        {/* SMS Credits Button */}
        <Button
          variant="outline"
          className="text-sm font-medium text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900"
        >
          5,000 Credits
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer rounded-full ring-2 ring-muted-foreground/30 p-0.5 transition hover:ring-foreground">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/user.jpg" alt="@user" />
                <AvatarFallback>CL</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 hover:text-red-700">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

