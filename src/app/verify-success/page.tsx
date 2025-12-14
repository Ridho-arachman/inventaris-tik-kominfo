"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWindowSize } from "react-use";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function VerifySuccessPage() {
  const { width, height } = useWindowSize();
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 overflow-hidden">
      <Confetti width={width} height={height} />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white rounded-xl shadow-md text-center z-10"
      >
        <h1 className="text-2xl font-bold mb-4">
          Email Berhasil Diverifikasi!
        </h1>
        <p className="text-gray-700 mb-6">
          Terima kasih telah memverifikasi email Anda. Sekarang Anda bisa login.
        </p>
        <Link href="/login">
          <Button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">
            Login
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
