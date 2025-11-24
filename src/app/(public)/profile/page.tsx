"use client";

import { motion } from "framer-motion";
import { Info, Mail, Phone, Users } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 px-6 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <Image
          src="/logo.png"
          alt="Logo Sistem"
          width={120}
          height={120}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Tentang Sistem Inventaris TIK
        </h1>
        <p className="text-gray-300 mb-6 text-lg md:text-xl">
          Sistem Inventaris Alat TIK Kominfo Kab. Serang membantu OPD memantau
          dan mengelola aset TIK dengan mudah, aman, dan efisien. Data tersimpan
          secara terpusat sehingga mempermudah pelaporan dan pengambilan
          keputusan.
        </p>
        <p className="text-gray-400">
          Sistem ini mendukung manajemen aset TIK, monitoring status, laporan
          cepat, serta keamanan data berbasis role.
        </p>
      </motion.div>

      {/* Kontak & Informasi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-slate-800 p-8 rounded-2xl shadow-md mb-16"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center gap-2">
          <Info className="w-6 h-6 text-indigo-500" /> Kontak & Informasi
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-gray-200">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            <span>kominfo@serangkab.go.id</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-indigo-400" />
            <span>+62 812 3456 7890</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" />
            <span>Jl. Raya Serang No. 123, Serang, Banten</span>
          </div>
        </div>
      </motion.div>

      {/* Tim Pengelola / Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2 justify-center">
          <Users className="w-6 h-6 text-indigo-500" /> Tim Pengelola
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-200">
          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              AF
            </div>
            <h3 className="font-semibold text-white mb-1">A. Fikri</h3>
            <p>Developer & TTG</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              NR
            </div>
            <h3 className="font-semibold text-white mb-1">N. Ridho</h3>
            <p>UI/UX & Frontend</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              AA
            </div>
            <h3 className="font-semibold text-white mb-1">A. Ahmad</h3>
            <p>Backend & API</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
