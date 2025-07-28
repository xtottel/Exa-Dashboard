"use client";

import type * as React from "react";
import {
  ChevronDown,
  ChevronRight,
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
import { useState } from "react";

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
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  return (
    <Sidebar
      {...props}
      className="border-r-0"
      collapsible="mobile"
      variant="sidebar"
    >
      <div className="absolute inset-0 bg-[#0e2e4d]" />
      <div className="relative z-10 flex h-full flex-col">
        <SidebarHeader className="border-b border-white/10 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent">
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
                    className="h-20 object-contain"
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
                const isExpanded = expandedMenu === item.title;

                return (
                  <div key={item.title} className="group/collapsible">
                    <SidebarMenuItem>
                      {hasSubItems ? (
                        <Collapsible 
                          open={isExpanded}
                          onOpenChange={(open) => {
                            setExpandedMenu(open ? item.title : null);
                          }}
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={hasActiveChild || isExpanded}
                              className="group relative overflow-hidden rounded-lg hover:bg-white/5 transition-all duration-300 h-11 px-3"
                            >
                              {/* Left border indicator for active/hover state */}
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-0 group-hover:opacity-100 group-data-[active=true]:opacity-100 transition-opacity duration-300" />
                              
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center justify-center size-8 rounded-lg bg-white/10 group-hover:bg-primary/30 transition-all duration-300">
                                  <IconComponent className="size-4 text-white/80 group-hover:text-white group-data-[active=true]:text-white transition-colors duration-300" />
                                </div>
                                <span className="font-medium text-sm text-white/90 group-hover:text-white group-data-[active=true]:text-white transition-colors duration-300">
                                  {item.title}
                                </span>
                              </div>
                              
                              {/* Dropdown indicator (horizontal when collapsed, vertical when expanded) */}
                              <div className="flex items-center ml-2">
                                {isExpanded ? (
                                  <ChevronDown className="size-4 text-white/60 group-hover:text-white transition-all duration-300" />
                                ) : (
                                  <ChevronRight className="size-4 text-white/60 group-hover:text-white transition-all duration-300" />
                                )}

                                
                              </div>
                              
                              {/* Subtle hover background effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent className="mt-1">
                            <SidebarMenuSub className="ml-4 space-y-1 border-l border-white/10 pl-4">
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                    className="group relative overflow-hidden rounded-lg hover:bg-white/5 transition-all duration-300 h-9 pl-3"
                                  >
                                    <Link
                                      href={subItem.url}
                                      className="relative flex items-center"
                                    >
                                      {/* Left border indicator for subitems */}
                                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full opacity-0 group-hover:opacity-70 group-data-[active=true]:opacity-100 transition-opacity duration-300" />
                                      
                                      <span className="text-sm font-medium text-white/80 group-hover:text-white group-data-[active=true]:text-white transition-colors duration-300">
                                        {subItem.title}
                                      </span>
                                      
                                      {/* Right arrow indicator for subitems */}
                                      <ChevronRight className="ml-auto size-4 text-white/40 group-hover:text-white/60 group-data-[active=true]:text-white/80 transition-colors duration-300" />
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
                          className="group relative overflow-hidden rounded-lg hover:bg-white/5 transition-all duration-300 h-11 px-3"
                        >
                          <Link href={item.url || "#"} className="relative">
                            {/* Left border indicator */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full opacity-0 group-hover:opacity-100 group-data-[active=true]:opacity-100 transition-opacity duration-300" />
                            
                            <div className="flex items-center gap-3 flex-1">
                              <div className="flex items-center justify-center size-8 rounded-lg bg-white/10 group-hover:bg-primary/30 transition-all duration-300">
                                <IconComponent className="size-4 text-white/80 group-hover:text-white group-data-[active=true]:text-white transition-colors duration-300" />
                              </div>
                              <span className="font-medium text-sm text-white/90 group-hover:text-white group-data-[active=true]:text-white transition-colors duration-300">
                                {item.title}
                              </span>
                            </div>
                            
                            {/* Subtle hover background effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

        <div className="mt-auto p-4 border-t border-white/10 bg-gradient-to-r from-white/5 via-white/3 to-transparent">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/30 transition-colors duration-300">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/20">
              <Headset className="size-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                Need Help?
              </p>
              <p className="text-xs text-white/70">
                Check our support docs
              </p>
            </div>
            <ChevronRight className="size-4 text-white/50" />
          </div>
        </div>

        <SidebarRail className="bg-gradient-to-b from-white/10 to-transparent" />
      </div>
    </Sidebar>
  );
}