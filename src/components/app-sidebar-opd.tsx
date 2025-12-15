"use client";
import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { isActiveRoute } from "@/lib/isActive";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Monitor } from "lucide-react";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Your Application",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/opd",
        },
        {
          title: "Asset's",
          url: "/opd/asset",
        },
      ],
    },
    {
      title: "Configuration and Information",
      url: "#",
      items: [
        {
          title: "Setting User OPD Profile",
          url: "/opd/setting-user",
        },
        {
          title: "Help",
          url: "/opd/help",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link
          href="/opd"
          className="flex items-center gap-2 px-2 py-1 transition-colors group"
        >
          <Monitor className="w-6 h-6  transition-transform duration-200 group-hover:scale-110" />
          <span className="text-xl font-bold  transition-transform duration-200 group-hover:scale-105 ">
            TIK Inventaris
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActiveRoute(pathname, item.url)}
                    >
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
