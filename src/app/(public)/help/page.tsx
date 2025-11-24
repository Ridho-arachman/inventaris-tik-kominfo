"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  const faqs = [
    {
      question: "Bagaimana cara menambahkan aset baru?",
      answer:
        "Masuk ke dashboard OPD → pilih 'Tambah Aset' → isi form lengkap lalu simpan.",
    },
    {
      question: "Bagaimana melihat laporan inventaris?",
      answer:
        "Masuk ke menu 'Laporan' → pilih jenis laporan → ekspor ke Excel atau PDF.",
    },
    {
      question: "Bagaimana mengganti password akun?",
      answer: "Buka menu 'Profil' → klik 'Ganti Password' → ikuti petunjuk.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 px-6 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <BookOpen className="w-14 h-14 mx-auto text-indigo-500 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Panduan Pengguna
        </h1>
        <p className="text-gray-300 text-lg md:text-xl">
          Berikut beberapa panduan singkat untuk menggunakan sistem inventaris
          TIK Kominfo Kab. Serang. Klik FAQ untuk melihat detail.
        </p>
      </motion.div>

      {/* Accordion FAQ Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-4"
      >
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-slate-800 rounded-xl shadow-lg"
            >
              <AccordionTrigger className="px-6 py-4 text-white font-semibold text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-gray-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-4">
          Siap Mengelola Aset?
        </h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Masuk sekarang dan kelola inventaris TIK OPD Anda dengan mudah.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild className="bg-indigo-500 hover:bg-indigo-600">
            <a href="/login">Masuk</a>
          </Button>
          <Button asChild variant="outline" className="text-indigo-500">
            <a href="/profile">Tentang Sistem</a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
