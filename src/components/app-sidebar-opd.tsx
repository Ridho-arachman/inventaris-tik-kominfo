"use client";
import * as React from "react";

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
import Link from "next/link";
import { Monitor } from "lucide-react";
import { usePost } from "@/hooks/useApi";
import { notifier } from "./ToastNotifier";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();
  const { post, loading } = usePost("/auth/logout");

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
          {
            title: "Logout",
            url: "#",
            classname: "bg-red-500 text-white",
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
    ],
  };
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
                      onClick={item.onClick || undefined}
                      disabled={loading}
                      className={item.classname}
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
