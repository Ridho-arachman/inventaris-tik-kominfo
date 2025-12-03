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
import { usePathname, useRouter } from "next/navigation";
import { usePost } from "@/hooks/useApi";
import { notifier } from "./ToastNotifier";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";

type MenuItem = {
  title: string;
  url: string;
  onClick?: () => void; // optional
};

type NavGroup = {
  title: string;
  url: string;
  items: MenuItem[];
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { post, loading } = usePost("/auth/logout");
  const pathname = usePathname();

  const data: {
    versions: string[];
    navMain: NavGroup[];
  } = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      {
        title: "Application Management",
        url: "/admin",
        items: [
          {
            title: "Dashboard",
            url: "/admin/",
          },
          {
            title: "Manage OPD",
            url: "/admin/manage-opd",
          },
          {
            title: "Manage User OPD",
            url: "/admin/manage-user-opd",
          },
          {
            title: "Manage Asset TIK",
            url: "/admin/manage-asset",
          },
          {
            title: "Logout",
            url: "#",
            onClick: async () => {
              try {
                await post({});
                notifier.success("Berhasil Logout", "Selamat Tinggal !!!..");
                router.refresh();
              } catch (error) {
                const err = error as AxiosError<ApiError>;
                notifier.error("Logout Gagal", err.response?.data?.message);
              }
            },
          },
        ],
      },
      {
        title: "API Reference",
        url: "#",
        items: [
          {
            title: "Components",
            url: "#",
          },
          {
            title: "File Conventions",
            url: "#",
          },
          {
            title: "Functions",
            url: "#",
          },
          {
            title: "next.config.js Options",
            url: "#",
          },
          {
            title: "CLI",
            url: "#",
          },
          {
            title: "Edge Runtime",
            url: "#",
          },
        ],
      },
      {
        title: "Architecture",
        url: "#",
        items: [
          {
            title: "Accessibility",
            url: "#",
          },
          {
            title: "Fast Refresh",
            url: "#",
          },
          {
            title: "Next.js Compiler",
            url: "#",
          },
          {
            title: "Supported Browsers",
            url: "#",
          },
          {
            title: "Turbopack",
            url: "#",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
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
                      onClick={item.onClick || undefined}
                      disabled={loading}
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
