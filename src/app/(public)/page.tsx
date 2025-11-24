"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Monitor, FileText, Shield } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "Pantau Aset",
      desc: "Lacak status aset secara real-time.",
      icon: Monitor,
    },
    {
      title: "Laporan Cepat",
      desc: "Ekspor laporan inventaris dalam format Excel/PDF.",
      icon: FileText,
    },
    {
      title: "Aman & Terpercaya",
      desc: "Data terenkripsi dan akses role-based.",
      icon: Shield,
    },
  ];

  return (
    <div className="bg-gray-900 font-sans text-gray-100">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-800 relative overflow-hidden ">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg mt-16"
        >
          Sistem Inventaris Alat TIK
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-sm text-gray-300"
        >
          Kelola inventaris alat TIK Kominfo Kab. Serang dengan mudah dan
          efisien. Pantau aset, laporan, dan statusnya dalam satu platform
          terpadu.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-center gap-4"
        >
          <Link href="/login">
            <Button
              size="lg"
              className="bg-white text-indigo-900 hover:bg-gray-200 shadow-lg"
            >
              Masuk
            </Button>
          </Link>
          <Link href="/help">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-indigo-900 hover:bg-white hover:text-indigo-900"
            >
              Panduan
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          className="mt-16 relative w-80 h-80 md:w-96 md:h-96 mx-auto"
        >
          <Image
            src="/logo.png"
            alt="Illustrasi Inventaris"
            fill
            className="object-contain drop-shadow-xl"
          />
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-6 bg-slate-800">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Fitur Unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="flex flex-col items-center text-center p-8 bg-slate-900 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-transform border border-transparent hover:border-indigo-500"
              >
                <div className="p-5 bg-indigo-600 rounded-full mb-4">
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-300">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-tr from-indigo-900 via-slate-900 to-slate-800 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-lg">
          Siap Memulai?
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto drop-shadow-sm text-gray-300">
          Masuk sekarang dan kelola inventaris TIK OPD Anda dengan mudah.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-white text-indigo-900 hover:bg-gray-200 shadow-lg"
            >
              Masuk Sekarang
            </Button>
          </Link>
          <Link href="/help">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-indigo-900 hover:bg-white hover:text-indigo-900"
            >
              Panduan Pengguna
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
