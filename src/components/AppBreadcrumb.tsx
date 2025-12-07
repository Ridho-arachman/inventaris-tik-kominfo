"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function AppBreadcrumb() {
  const pathname = usePathname();

  // Split URL
  let segments = pathname.split("/").filter((s) => s !== "");

  // Hapus segment "admin"
  if (segments[0] === "admin") {
    segments = segments.slice(1);
  }

  // Format agar huruf kapital dan "-" jadi spasi
  const format = (str: string) =>
    str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* HOME breadcrumb bisa dihilangkan kalau tidak mau */}
        <BreadcrumbItem>
          <span className="text-gray-500">Home</span>
        </BreadcrumbItem>

        {segments.map((seg, index) => (
          <div key={index} className="flex items-center gap-2">
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              {index === segments.length - 1 ? (
                <span className="font-semibold">{format(seg)}</span>
              ) : (
                <span className="text-gray-500">{format(seg)}</span>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
