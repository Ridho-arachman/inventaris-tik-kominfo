/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Info, ClipboardList, Edit3, User, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HelpOPD() {
  const helpTopics = [
    {
      title: "Dashboard OPD",
      content:
        "Dashboard menampilkan ringkasan aset, grafik perkembangan aset per tahun, dan status aktif/non-aktif. Gunakan filter tahun untuk menyesuaikan data.",
      icon: <Info className="w-5 h-5 text-blue-500" />,
      badge: "Tips",
    },
    {
      title: "Daftar Asset",
      content:
        "Halaman daftar asset menampilkan seluruh aset OPD. Klik pada asset untuk melihat detail. Gunakan filter tahun untuk menampilkan aset berdasarkan tahun perolehan.",
      icon: <ClipboardList className="w-5 h-5 text-green-500" />,
    },
    {
      title: "Detail Asset",
      content:
        "Halaman detail menampilkan informasi lengkap tentang asset, termasuk kategori, brand, model, spesifikasi, lokasi, jumlah, dan status.",
      icon: <Info className="w-5 h-5 text-purple-500" />,
    },
    {
      title: "Edit Asset",
      content:
        "Halaman edit asset digunakan untuk memperbarui data asset. Pastikan semua kolom wajib terisi dengan benar.",
      icon: <Edit3 className="w-5 h-5 text-yellow-500" />,
      badge: "Penting",
    },
    {
      title: "Profil User",
      content:
        "Halaman profil memungkinkan user OPD mengubah nama, email, dan password. Password bisa dikosongkan jika tidak ingin diganti.",
      icon: <User className="w-5 h-5 text-pink-500" />,
    },
    {
      title: "Ekspor Laporan",
      content:
        "Gunakan fitur ekspor untuk mendapatkan laporan aset dalam format Excel atau PDF. Pilih filter tahun sebelum ekspor untuk data spesifik.",
      icon: <FileText className="w-5 h-5 text-indigo-500" />,
    },
  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-8"
      >
        Panduan OPD
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-md max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Panduan Penggunaan Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible>
              {helpTopics.map((topic, idx) => (
                <AccordionItem
                  key={idx}
                  value={`item-${idx}`}
                  className="border rounded-md overflow-hidden"
                >
                  <AccordionTrigger className="flex items-center justify-between gap-2 hover:bg-gray-100 px-4 py-2">
                    <div className="flex items-center gap-2">
                      {topic.icon}
                      <span>{topic.title}</span>
                      {topic.badge && (
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                          {topic.badge}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-2 text-gray-700">
                    {topic.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
