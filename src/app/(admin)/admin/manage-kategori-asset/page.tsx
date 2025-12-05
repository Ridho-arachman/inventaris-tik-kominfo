"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cpu, Code, Info } from "lucide-react";

export default function KategoriPage() {
  return (
    <div className="min-h-screen px-6 py-10">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-10"
      >
        Manage Kategori Asset
      </motion.h1>

      {/* Pilihan Kategori */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Hardware */}
        <Link href="/admin/manage-kategori-asset/hardware">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 border rounded-xl hover:shadow-lg cursor-pointer transition flex flex-col items-center text-center"
          >
            <Cpu className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold">Kategori Hardware</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Kelola semua kategori aset hardware seperti PC, printer, laptop.
            </p>
          </motion.div>
        </Link>

        {/* Software */}
        <Link href="/admin/manage-kategori-asset/software">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-6 border rounded-xl hover:shadow-lg cursor-pointer transition flex flex-col items-center text-center"
          >
            <Code className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold">Kategori Software</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Kelola semua kategori software seperti sistem operasi & aplikasi.
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Section Bawah */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-16 p-6 bg-gray-50 border rounded-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold">Tips Pengelolaan Asset</h3>
        </div>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Pastikan setiap hardware memiliki kategori yang sesuai.</li>
          <li>
            Update status software secara berkala untuk lisensi dan versi.
          </li>
          <li>Gunakan kategori untuk memudahkan pencarian dan laporan.</li>
          <li>Periksa aset cadangan agar selalu siap digunakan.</li>
        </ul>
      </motion.div>
    </div>
  );
}
