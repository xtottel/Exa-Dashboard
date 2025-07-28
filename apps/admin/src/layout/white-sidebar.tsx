"use client";

import type * as React from "react";
import {
  Minus,
  Plus,
  CreditCard,
  MessageSquareText,
  FileText,
  PieChart,
  Cog,
  LockKeyhole,
  FileChartPie,
  Headset,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import navigationData from "@/data/navigation.json";
import Link from "next/link";

// Icon mapping for each section
const sectionIcons = {
  Dashboard: PieChart,
  "SMS": MessageSquareText,
  "OTP": LockKeyhole,
  "Reports": FileChartPie,
  "Settings": Cog,
  "Credits": CreditCard,
} as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      {...props}
      className="border-r-0"
      collapsible="mobile"
      variant="sidebar"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur-xl" />
      <div className="relative z-10 flex h-full flex-col">
        <SidebarHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="group hover:bg-primary/10 transition-all duration-300 px-5"
              >
                <Link href="/dashboard" className="relative overflow-hidden">
                  <Image
                    src="https://cdn.sendexa.co/images/logo/exaweb.png"
                    alt="Sendexa Logo"
                    width={120}
                    height={50}
                    className="h-20  object-contain"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4 space-y-2">
          <SidebarGroup>
            <SidebarMenu className="space-y-1">
              {navigationData.navMain.map((item) => {
                const IconComponent =
                  sectionIcons[item.title as keyof typeof sectionIcons] ||
                  FileText;
                const hasActiveChild = item.items?.some(
                  (subItem) => pathname === subItem.url
                );
                const isActive = pathname === item.url;
                const hasSubItems = item.items && item.items.length > 0;

                return (
                  <div key={item.title} className="group/collapsible">
                    <SidebarMenuItem>
                      {hasSubItems ? (
                        <Collapsible defaultOpen={hasActiveChild}>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={hasActiveChild}
                              className="group relative overflow-hidden rounded-xl border border-transparent hover:border-border/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 h-11"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-muted via-muted/80 to-muted/60 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-transparent transition-all duration-300">
                                  <IconComponent className="size-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                                </div>
                                <span className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                                  {item.title}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Plus className="size-4 text-muted-foreground group-data-[state=open]/collapsible:opacity-0 group-data-[state=open]/collapsible:h-0 group-hover:text-primary transition-all duration-300" />
                                <Minus className="size-4 text-muted-foreground absolute opacity-0 h-0 group-data-[state=open]/collapsible:opacity-100 group-data-[state=open]/collapsible:h-4 group-hover:text-primary transition-all duration-300" />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-1">
                            <SidebarMenuSub className="ml-4 space-y-1 border-l border-border/30 pl-4">
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                    className="group relative overflow-hidden rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 h-9"
                                  >
                                    <Link
                                      href={subItem.url}
                                      className="relative"
                                    >
                                      <span className="text-sm font-medium group-hover:text-primary transition-colors duration-300">
                                        {subItem.title}
                                      </span>
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="group relative overflow-hidden rounded-xl border border-transparent hover:border-border/50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-300 h-11"
                        >
                          <Link href={item.url || "#"} className="relative">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-muted via-muted/80 to-muted/60 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-transparent transition-all duration-300">
                                <IconComponent className="size-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                              </div>
                              <span className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                                {item.title}
                              </span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <div className="mt-auto p-4 border-t border-border/40 bg-gradient-to-r from-muted/20 via-muted/10 to-transparent">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border border-primary/10">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Headset className="size-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Need Help?
              </p>
              <p className="text-xs text-muted-foreground">
                Check our support docs
              </p>
            </div>
          </div>
        </div>

        <SidebarRail className="bg-gradient-to-b from-border/50 to-border/20" />
      </div>
    </Sidebar>
  );
}
