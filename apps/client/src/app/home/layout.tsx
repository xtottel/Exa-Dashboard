// app/docs/layout.tsx
import type React from "react";
//import { AppSidebar } from "@/layout/app-sidebar";
import { AppSidebar } from "@/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesktopHeader } from "@/layout/desktop-header";
import { MobileHeader } from "@/layout/mobile-header";
import DashboardFooter from "@/layout/DashboardFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        {/* Persistent Sidebar */}
        <AppSidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header (hidden on desktop) */}
          <div className="lg:hidden sticky top-0 z-40">
            <MobileHeader />
          </div>

          {/* Desktop Header (hidden on mobile) */}
          <div className="hidden lg:block sticky top-0 z-40">
            <DesktopHeader />
          </div>

          {/* Content area with consistent padding */}
          <main className="flex-1 w-full ">
            <div className="w-full max-w-full py-2 px-2 sm:px-6">
              {children}
            </div>
          </main>

          {/* ✅ Footer */}
          <DashboardFooter />
        </div>
      </div>
    </SidebarProvider>
  );
}
