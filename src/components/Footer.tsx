"use client";

import { motion } from "framer-motion";
import { Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900 text-gray-400 py-10 px-6 border-t border-slate-700"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-indigo-500" />
          <a
            href="mailto:kominfo@serangkab.go.id"
            className="hover:text-white transition-colors font-medium"
          >
            kominfo@serangkab.go.id
          </a>
        </div>

        {/* Media Sosial */}
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-white transition-colors">
            <Facebook className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Twitter className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Instagram className="w-5 h-5" />
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            <Linkedin className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Kominfo Kab. Serang. Semua hak
        dilindungi.
      </div>
    </motion.footer>
  );
}
