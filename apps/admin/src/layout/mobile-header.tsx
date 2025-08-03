"use client";

import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Wallet,
  MessageSquareText,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

const userName = "Collins Joe";
// const smsUnits = 6420;

export function MobileHeader() {
  const router = useRouter();
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
            <DropdownMenuItem
              onClick={() => router.push("/home/balance/topup")}
            >
              <Wallet className="mr-2 size-4" />
              Top Up Balance
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer rounded-full ring-2 ring-muted-foreground/30 p-0.5 transition hover:ring-foreground">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/user.svg" alt="@user" />
                <AvatarFallback>CJ</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-foreground">
                {userName}
              </p>
              {/* <p className="text-xs text-muted-foreground">
                {smsUnits.toLocaleString()} SMS Units
              </p> */}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/home/settings/profile")}>
              <User className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 hover:text-red-700">
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
