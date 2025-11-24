"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Monitor } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname(); // dapatkan path saat ini
  const links = [
    { name: "Beranda", href: "/" },
    { name: "Panduan", href: "/help" },
    { name: "Profil", href: "/profile" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-slate-900 shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Monitor className="w-6 h-6 text-indigo-500" />
          <span className="text-xl font-bold text-indigo-500 hover:text-indigo-400 transition-colors">
            TIK Inventaris
          </span>
        </Link>

        <div className="flex space-x-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isActive
                    ? "text-white border-b-2 border-indigo-500"
                    : "text-gray-200 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
