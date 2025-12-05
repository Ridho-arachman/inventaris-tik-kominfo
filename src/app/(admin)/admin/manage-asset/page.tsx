"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Cpu, HardDrive, Info, HelpCircle, CheckCircle } from "lucide-react";

export default function CategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold">Kategori Aset</h1>
        <p className="text-gray-600 mt-2 max-w-xl">
          Pilih kategori aset yang ingin Anda kelola. Setiap kategori berisi
          daftar aset dan statistik penggunaan.
        </p>
      </motion.div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/admin/manage-asset/hardware">
            <Card className="hover:shadow-lg bg-white transition-all cursor-pointer p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center gap-4 p-0">
                <HardDrive className="w-10 h-10 text-blue-600" />
                <div>
                  <CardTitle className="text-2xl font-semibold">
                    Hardware
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Aset fisik seperti laptop, monitor, printer, dll.
                  </p>
                </div>
              </CardHeader>

              <CardContent className="pt-4 p-0 text-gray-600">
                Klik untuk melihat semua aset hardware.
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Software */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Link href="/admin/manage-asset/software">
            <Card className="hover:shadow-lg bg-white transition-all cursor-pointer p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center gap-4 p-0">
                <Cpu className="w-10 h-10 text-purple-600" />
                <div>
                  <CardTitle className="text-2xl font-semibold">
                    Software
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Lisensi OS, antivirus, office, dan aplikasi lainnya.
                  </p>
                </div>
              </CardHeader>

              <CardContent className="pt-4 p-0 text-gray-600">
                Klik untuk melihat semua aset software.
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>

      {/* ================================ */}
      {/* Section Tambahan */}
      {/* ================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-14"
      >
        <h2 className="text-xl font-semibold mb-4">
          Informasi Pengelolaan Aset
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Info */}
          <Card className="p-5 border border-gray-200 bg-white">
            <div className="flex items-center gap-3 mb-3">
              <Info className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-medium">Data Terpusat</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Semua aset yang Anda kelola akan muncul di halaman kategori ini,
              memudahkan pengelolaan dan monitoring.
            </p>
          </Card>

          {/* Help */}
          <Card className="p-5 border border-gray-200 bg-white">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-medium">Panduan Penggunaan</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Anda dapat menambah, mengedit, atau menghapus aset dengan mudah
              melalui menu yang tersedia.
            </p>
          </Card>

          {/* Check */}
          <Card className="p-5 border border-gray-200 bg-white">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-medium">Data Akurat</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Pastikan data selalu diperbarui untuk menjaga kualitas laporan dan
              analisis aset.
            </p>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
