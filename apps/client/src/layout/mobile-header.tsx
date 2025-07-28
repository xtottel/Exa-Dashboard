// components/mobile-header.tsx
"use client";

import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileHeader() {
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

      {/* Right: Profile Avatar with Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer rounded-full ring-2 ring-muted-foreground/30 p-0.5 transition hover:ring-foreground">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/user.jpg" alt="@user" />
              <AvatarFallback>CL</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem disabled>
            <span className="text-sm text-muted-foreground">
              GHS 420 • 5,000 credits
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 hover:text-red-700">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

