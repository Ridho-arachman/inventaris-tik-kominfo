"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

// Dummy Data
const dummyOpdAsset = [
  {
    id: "opd1",
    kode: "DIKES",
    nama: "Dinas Kesehatan",
    aktif: 25,
    nonAktif: 5,
    cadangan: 2,
  },
  {
    id: "opd2",
    kode: "DINSOS",
    nama: "Dinas Sosial",
    aktif: 12,
    nonAktif: 3,
    cadangan: 1,
  },
  {
    id: "opd3",
    kode: "DISKOMINFO",
    nama: "Diskominfo",
    aktif: 42,
    nonAktif: 7,
    cadangan: 4,
  },
];

export default function OpdHardwareListPage() {
  const [searchValue, setSearchValue] = useState("");
  const isLoading = false; // ubah ke true jika mau lihat skeleton loading

  const filteredList = dummyOpdAsset.filter(
    (opd) =>
      opd.nama.toLowerCase().includes(searchValue.toLowerCase()) ||
      opd.kode.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="min-h-screen px-6 py-10">
      {/* Tombol Kembali */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link
          href="/admin/manage-asset"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Kembali</span>
        </Link>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        Daftar OPD — Software
      </motion.h1>

      {/* Search */}
      <div className="w-full sm:w-1/2 mb-8">
        <Input
          placeholder="Cari OPD..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Skeleton */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}

        {/* Data */}
        {!isLoading &&
          filteredList.map((opd, idx) => (
            <motion.div
              key={opd.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link href={`/hardware/opd/${opd.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer relative">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {opd.nama} ({opd.kode})
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Aset Aktif</p>
                      <p className="font-medium">{opd.aktif}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Aset Non-Aktif</p>
                      <p className="font-medium">{opd.nonAktif}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Aset Cadangan</p>
                      <p className="font-medium">{opd.cadangan}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
      </div>

      {!isLoading && filteredList.length === 0 && (
        <p className="text-gray-500 mt-10 text-center">OPD tidak ditemukan.</p>
      )}
    </div>
  );
}
