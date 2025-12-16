"use client";

import { motion } from "framer-motion";
import { BookOpen, Shield, Users } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    {
      question: "Bagaimana cara menambahkan aset baru?",
      answer:
        "Login sebagai Operator OPD atau Admin → masuk ke Dashboard → pilih menu Aset → klik Tambah Aset → isi data lengkap lalu simpan.",
    },
    {
      question: "Bagaimana cara melihat dan mengunduh laporan inventaris?",
      answer:
        "Masuk ke menu Laporan → pilih jenis laporan dan periode → klik Ekspor untuk mengunduh dalam format Excel atau PDF.",
    },
    {
      question: "Bagaimana cara mengganti password akun?",
      answer:
        "Masuk ke menu Profil → pilih Ganti Password → masukkan password lama dan password baru → simpan perubahan.",
    },
    {
      question: "Siapa saja yang dapat mengakses sistem ini?",
      answer:
        "Admin dan Operator OPD memerlukan login. Pengguna publik dapat mengakses halaman informasi, profil sistem, dan panduan tanpa login.",
    },
  ];

  return (
    <div className="min-h-screen  px-6 py-12">
      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <BookOpen className="w-14 h-14 mx-auto text-indigo-500 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Panduan Pengguna
        </h1>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          Halaman ini berisi panduan singkat penggunaan Sistem Inventaris Alat
          TIK Kominfo Kabupaten Serang untuk Admin, Operator OPD, dan pengguna
          umum.
        </p>
      </motion.div>

      {/* ================= ROLE INFO ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
      >
        <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
          <Shield className="w-8 h-8 mx-auto text-indigo-500 mb-3" />
          <h3 className="font-semibold text-white mb-2">Admin Sistem</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Mengelola pengguna, data master, aset seluruh OPD, dan konfigurasi
            sistem.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
          <Users className="w-8 h-8 mx-auto text-indigo-500 mb-3" />
          <h3 className="font-semibold text-white mb-2">Operator OPD</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Mencatat, memperbarui, dan memantau aset TIK sesuai OPD
            masing-masing.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
          <BookOpen className="w-8 h-8 mx-auto text-indigo-500 mb-3" />
          <h3 className="font-semibold text-white mb-2">Publik</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Mengakses informasi umum, profil sistem, dan panduan tanpa login.
          </p>
        </div>
      </motion.div>

      {/* ================= FAQ ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mb-20"
      >
        <h2 className="text-2xl font-semibold text-white mb-8 text-center">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-slate-800 rounded-xl shadow"
            >
              <AccordionTrigger className="px-6 py-4 text-white font-medium text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-gray-300 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* ================= CTA ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-4">
          Siap Mengelola Aset TIK?
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Masuk ke sistem dan mulai kelola inventaris aset TIK OPD secara aman
          dan terpusat.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild className="bg-indigo-500 hover:bg-indigo-600">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button asChild variant="outline" className="text-indigo-500">
            <Link href="/profile">Tentang Sistem</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
