"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Beranda",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Daftar Inventaris",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "AI Analysis",
    url: "/analysis",
    icon: TrendingUp,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  // Only show sidebar on app routes, not on landing or login
  const isAuthPage = pathname === "/login";
  const isLandingPage = pathname === "/";
  
  // Actually, standard SaaS pattern is to show it always or handle visibility
  // For MVP, let's only show it if user is logged in and not on landing
  if (!user && (isLandingPage || isAuthPage)) return null;

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-6">
        <div className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">InvenGo</span>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
           <Package className="h-5 w-5" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="hover:bg-primary/20 transition-colors"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden space-y-4">
        <div className="rounded-xl bg-primary/10 p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Status Sistem</p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-semibold">Tersambung</span>
          </div>
        </div>
        {user && (
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
