/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useGet } from "@/hooks/useApi";
import { Opd } from "@/generated/client";

// Soft colors untuk badge
const statusColors: Record<string, string> = {
  AKTIF: "bg-green-100 text-green-800",
  CADANGAN: "bg-yellow-100 text-yellow-800",
  NON_AKTIF: "bg-red-100 text-red-800",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function OPDListPage() {
  const { data: opdData, error, isLoading } = useGet("/opd");

  if (isLoading) return <p className="p-6">Loading...</p>;
  if (error)
    return (
      <p className="p-6 text-red-600">Terjadi kesalahan: {error.message}</p>
    );
  if (!opdData || opdData.length === 0)
    return <p className="p-6">Data OPD tidak ditemukan.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Daftar OPD</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opdData.map((opd: any, index: number) => (
          <motion.div
            key={opd.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Link href={`/admin/manage-kategori-asset/opd/${opd.id}/hardware`}>
              {/* Entire card clickable */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card className="shadow-lg hover:shadow-xl transition-all border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {opd.nama} ({opd.kode})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      <strong>Dibuat:</strong>{" "}
                      {new Date(opd.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-700">
                      <strong>Diubah:</strong>{" "}
                      {new Date(opd.updatedAt).toLocaleString()}
                    </p>

                    <Separator className="my-3" />

                    {/* Hardware */}
                    <div className="mb-3">
                      <strong>Hardware:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Object.entries(opd._count.hardwareByStatus).map(
                          ([status, count]) => (
                            <span
                              key={status}
                              className={`${statusColors[status]} px-2 py-1 rounded-full text-sm font-medium`}
                            >
                              {status}: {count as number}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* View hint */}
                    <div className="mt-4 flex justify-end">
                      <span className="px-4 py-2 bg-slate-600 text-white rounded text-sm font-medium">
                        Klik untuk lihat hardware
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
