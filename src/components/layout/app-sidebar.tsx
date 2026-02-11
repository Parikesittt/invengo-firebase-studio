
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
import { useTranslation } from "@/lib/i18n-context";
import { LanguageToggle } from "@/components/language-toggle";

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

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const { t } = useTranslation();

  const navItems = [
    {
      title: t('nav.dashboard'),
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t('nav.inventory'),
      url: "/inventory",
      icon: Package,
    },
    {
      title: t('nav.analysis'),
      url: "/analysis",
      icon: TrendingUp,
    },
  ];

  const handleLogout = () => {
    signOut(auth);
  };

  const isAuthPage = pathname === "/login";
  const isLandingPage = pathname === "/";
  
  if (!user && (isLandingPage || isAuthPage)) return null;

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">InvenGo</span>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
           <Package className="h-5 w-5" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <LanguageToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Menu</SidebarGroupLabel>
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
        {user && (
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('nav.logout')}</span>
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
