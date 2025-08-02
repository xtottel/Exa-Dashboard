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
  Clapperboard,
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
import { useRouter } from "next/navigation";

const sectionIcons = {
  "Dashboard": PieChart,
  "Get Started": Clapperboard,
  "SMS": MessageSquareText,
  "OTP": LockKeyhole,
  "Reports": FileChartPie,
  "Settings": Cog,
  "Credits": CreditCard,
} as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const router = useRouter();

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
                <Link href="/home" className="relative overflow-hidden">
                   <Image
                    src="https://cdn.sendexa.co/images/logo/exaweb.png"
                    alt="Sendexa Logo"
                    width={120}
                    height={50}
                    className="h-20 object-contain"
                  />

                  <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover/collapsible:opacity-100" />
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
                const isActive = pathname === item.url || hasActiveChild;
                const hasSubItems = item.items && item.items.length > 0;
                const isExpanded = expandedMenu === item.title || hasActiveChild;

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
                              isActive={isActive}
                              className="group/button relative overflow-hidden rounded-lg hover:bg-white/5 transition-all duration-300 h-11 px-3"
                            >
                              {/* Left border indicator for active/hover state */}
                              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-opacity duration-300 ${
                                isActive 
                                  ? 'opacity-100' 
                                  : 'opacity-0 group-hover/button:opacity-100'
                              }`} />

                              <div className="flex items-center gap-3 flex-1">
                                <div className={`flex items-center justify-center size-8 rounded-lg transition-all duration-300 ${
                                  isActive
                                    ? 'bg-primary/30'
                                    : 'bg-white/10 group-hover/button:bg-primary/30'
                                }`}>
                                  <IconComponent className={`size-4 transition-colors duration-300 ${
                                    isActive
                                      ? 'text-white'
                                      : 'text-white/80 group-hover/button:text-white'
                                  }`} />
                                </div>
                                <span className={`font-medium text-sm transition-colors duration-300 ${
                                  isActive
                                    ? 'text-white'
                                    : 'text-white/90 group-hover/button:text-white'
                                }`}>
                                  {item.title}
                                </span>
                              </div>

                              {/* Dropdown indicator (horizontal when collapsed, vertical when expanded) */}
                              <div className="flex items-center ml-2">
                                {isExpanded ? (
                                  <ChevronDown className="size-4 text-white/60 group-hover/button:text-white transition-all duration-300" />
                                ) : (
                                  <ChevronRight className="size-4 text-white/60 group-hover/button:text-white transition-all duration-300" />
                                )}
                              </div>

                              {/* Subtle hover background effect */}
                              <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover/collapsible:opacity-100" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="mt-1">
                            <SidebarMenuSub className="ml-4 space-y-1 border-l border-white/10 pl-4">
                              {item.items.map((subItem) => {
                                const isSubItemActive = pathname === subItem.url;
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubItemActive}
                                      className="group/subbutton relative overflow-hidden rounded-lg hover:bg-white/5 transition-all duration-300 h-9 pl-3"
                                    >
                                      <Link
                                        href={subItem.url}
                                        className="relative flex items-center"
                                      >
                                        {/* Left border indicator for subitems */}
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full transition-opacity duration-300 ${
                                          isSubItemActive
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover/subbutton:opacity-70'
                                        }`} />

                                        <span className={`text-sm font-medium transition-colors duration-300 ${
                                          isSubItemActive
                                            ? 'text-white'
                                            : 'text-white/80 group-hover/subbutton:text-white'
                                        }`}>
                                          {subItem.title}
                                        </span>

                                        {/* Right arrow indicator for subitems */}
                                        <ChevronRight className={`ml-auto size-4 transition-colors duration-300 ${
                                          isSubItemActive
                                            ? 'text-white/80'
                                            : 'text-white/40 group-hover/subbutton:text-white/60'
                                        }`} />
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="group/button relative overflow-hidden rounded-lg hover:bg-white/5 transition-all duration-300 h-11 px-3"
                        >
                          <Link href={item.url || "#"} className="relative">
                            {/* Left border indicator */}
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full transition-opacity duration-300 ${
                              isActive
                                ? 'opacity-100'
                                : 'opacity-0 group-hover/button:opacity-100'
                            }`} />

                            <div className="flex items-center gap-3 flex-1">
                              <div className={`flex items-center justify-center size-8 rounded-lg transition-all duration-300 ${
                                isActive
                                  ? 'bg-primary/30'
                                  : 'bg-white/10 group-hover/button:bg-primary/30'
                              }`}>
                                <IconComponent className={`size-4 transition-colors duration-300 ${
                                  isActive
                                    ? 'text-white'
                                    : 'text-white/80 group-hover/button:text-white'
                                }`} />
                              </div>
                              <span className={`font-medium text-sm transition-colors duration-300 ${
                                isActive
                                  ? 'text-white'
                                  : 'text-white/90 group-hover/button:text-white'
                              }`}>
                                {item.title}
                              </span>
                            </div>

                            {/* Subtle hover background effect */}
                            <div className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover/collapsible:opacity-100" />
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
          <div
            onClick={() => router.push("/home/settings")}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/30 transition-colors duration-300"
          >
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary/20">
              <Cog className="size-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                Account Settings
              </p>
              <p className="text-xs text-white/70">
                View settings, Api Keys, team & more
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
