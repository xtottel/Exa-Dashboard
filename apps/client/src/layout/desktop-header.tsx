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
  Wallet,
  CreditCard,
} from "lucide-react";

import { useRouter } from "next/navigation";

export function DesktopHeader() {
  const router = useRouter();

  // Static sample data (replace with real values from context or props)
  const userName = "Collins Joe";
  // const smsUnits = 6420;

  return (
    <header className="sticky top-0 z-40 hidden h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:flex">
      {/* Left: Branding */}
      <div className="text-lg font-semibold text-muted-foreground">
        Sendexa Dashboard
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        {/* SMS Units */}
        {/* <div className="text-sm font-medium text-muted-foreground">
          <span className="text-primary font-semibold">{smsUnits}</span> SMS Units
        </div> */}

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
            {/* <DropdownMenuItem onClick={() => router.push("/home/invoicing/create")}>
              <ReceiptCent className="w-4 h-4 mr-2" />
              Create Invoice
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => router.push("/home/sms/send")}>
              <MessageSquareText className="w-4 h-4 mr-2" />
              Send Message
            </DropdownMenuItem>
           <DropdownMenuItem onClick={() => router.push("/home/credits/buy")}>
              <CreditCard className="w-4 h-4 mr-2" />
              Buy Credit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/home/balance/topup")}>
              <Wallet className="w-4 h-4 mr-2" />
              Top Up Balance
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/home/settings/profile")}>
              Profile
            </DropdownMenuItem>
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
