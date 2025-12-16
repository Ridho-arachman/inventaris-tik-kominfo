"use client";

import { motion } from "framer-motion";
import { Info, Mail, Phone, Users } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="min-h-screen  px-4 sm:px-6 lg:px-8 py-10">
      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center mb-20"
      >
        <Image
          src="/kominfo_logo.png"
          alt="Logo Sistem"
          width={120}
          height={120}
          priority
          className="mx-auto mb-6"
        />

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5">
          Tentang Sistem Inventaris TIK
        </h1>

        <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-6">
          Sistem Inventaris Alat TIK Kominfo Kab. Serang membantu OPD memantau
          dan mengelola aset TIK dengan mudah, aman, dan efisien.
        </p>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Sistem ini mendukung manajemen aset TIK, monitoring status, laporan
          cepat, serta keamanan data berbasis role.
        </p>
      </motion.div>

      {/* ================= KONTAK ================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-md mb-20"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-8 flex items-center justify-center gap-2">
          <Info className="w-6 h-6 text-indigo-500" />
          Kontak & Informasi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-gray-200 lg:items-center">
          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-indigo-400 mt-1" />
            <div>
              <p className="font-medium text-white">Email</p>
              <p className="text-gray-300 break-all">kominfo@serangkab.go.id</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-indigo-400 mt-1" />
            <div>
              <p className="font-medium text-white">Telepon</p>
              <p className="text-gray-300">+62 812 3456 7890</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 sm:col-span-2 md:col-span-3">
            <Info className="w-5 h-5 text-indigo-400 mt-1" />
            <div>
              <p className="font-medium text-white">Alamat</p>
              <p className="text-gray-300 leading-relaxed">
                Jl. Veteran No.3, RT.3/RW.4, Kotabaru, Kec. Serang, Kota Serang,
                Banten 42112
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================= MAPS ================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mb-20"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 flex items-center justify-center gap-2">
          <Info className="w-6 h-6 text-indigo-500" />
          Lokasi Kantor
        </h2>

        <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-lg aspect-4/3 sm:aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.113927847395!2d106.15262659999999!3d-6.1153621000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e418b4f98ce28a3%3A0x4d6db7c4fa10a935!2sDinas%20Kominfosatik%20Kab.%20Serang!5e0!3m2!1sid!2sid!4v1765868228102!5m2!1sid!2sid"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </motion.section>

      {/* ================= USER ACCESS LEVEL ================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-8 flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-indigo-500" />
          Hak Akses Pengguna
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Admin */}
          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              AD
            </div>
            <h3 className="font-semibold text-white mb-1">Admin Sistem</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Mengelola seluruh data, pengguna, master aset, dan konfigurasi
              sistem inventaris TIK.
            </p>
          </div>

          {/* Operator OPD */}
          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              OP
            </div>
            <h3 className="font-semibold text-white mb-1">Operator OPD</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Mencatat, memperbarui, dan memantau aset TIK pada masing-masing
              OPD sesuai kewenangan.
            </p>
          </div>

          {/* Public */}
          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              PB
            </div>
            <h3 className="font-semibold text-white mb-1">Publik</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Mengakses informasi umum, halaman profil, dan panduan penggunaan
              tanpa perlu login.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
