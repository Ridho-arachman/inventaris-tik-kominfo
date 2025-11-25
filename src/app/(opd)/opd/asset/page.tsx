/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

// ============================
// Dummy Data Asset (schema DB baru)
// ============================
const dummyAssets = [
  {
    id: 1,
    category: "Laptop",
    brand: "Asus",
    model: "A14",
    specification: "Ryzen 5, SSD 512GB",
    acquisitionYear: 2022,
    jmlhAktif: 8,
    jmlhNonaktif: 2,
    jml: 10,
    location: "Ruang IT",
    photoUrl: "/laptop.jpg",
    opdId: 1,
  },
  {
    id: 2,
    category: "Laptop",
    brand: "HP",
    model: "ProBook 440",
    specification: "i5 8th Gen, SSD 256GB",
    acquisitionYear: 2021,
    jmlhAktif: 0,
    jmlhNonaktif: 4,
    jml: 4,
    location: "Gudang",
    photoUrl: "",
    opdId: 1,
  },
  {
    id: 3,
    category: "Printer",
    brand: "Canon",
    model: "IP2770",
    specification: "Inkjet",
    acquisitionYear: 2023,
    jmlhAktif: 5,
    jmlhNonaktif: 0,
    jml: 5,
    location: "Ruang TU",
    photoUrl: "/printer.jpg",
    opdId: 1,
  },
];

export default function AssetListOPD() {
  const router = useRouter();
  const years = [...new Set(dummyAssets.map((a) => a.acquisitionYear))];
  const [selectedYear, setSelectedYear] = useState<number | "ALL">("ALL");

  const filteredAssets =
    selectedYear === "ALL"
      ? dummyAssets
      : dummyAssets.filter((a) => a.acquisitionYear === selectedYear);

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Daftar Asset OPD</h1>

      {/* FILTER */}
      <div className="flex items-center gap-4 mb-8">
        <p className="font-medium text-gray-700">Filter Tahun:</p>

        <Select
          defaultValue="ALL"
          onValueChange={(v) =>
            setSelectedYear(v === "ALL" ? "ALL" : parseInt(v))
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">Semua Tahun</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* SUMMARY */}
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle>Ringkasan Aset</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total Jenis Aset</p>
            <p className="text-2xl font-bold">{filteredAssets.length}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Total Unit</p>
            <p className="text-xl font-semibold">
              {filteredAssets.reduce((t, a) => t + a.jml, 0)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Total Unit Aktif</p>
            <p className="text-xl font-semibold text-green-600">
              {filteredAssets.reduce((t, a) => t + a.jmlhAktif, 0)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600">Total Unit Non Aktif</p>
            <p className="text-xl font-semibold text-red-600">
              {filteredAssets.reduce((t, a) => t + a.jmlhNonaktif, 0)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Foto</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Brand & Model</th>
              <th className="p-3">Tahun</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Aktif</th>
              <th className="p-3">Non Aktif</th>
              <th className="p-3">Lokasi</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssets.map((asset) => (
              <motion.tr
                key={asset.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push("/opd/asset/" + asset.id)}
              >
                {/* FOTO */}
                <td className="p-3">
                  <div className="w-14 h-14 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                    {asset.photoUrl ? (
                      <Image
                        src={asset.photoUrl}
                        alt={asset.category}
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No Image</span>
                    )}
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="p-3 font-medium">{asset.category}</td>

                {/* BRAND + MODEL */}
                <td className="p-3">
                  {asset.brand} {asset.model}
                </td>

                {/* TAHUN */}
                <td className="p-3">{asset.acquisitionYear}</td>

                {/* TOTAL UNIT */}
                <td className="p-3 font-medium">{asset.jml}</td>

                {/* AKTIF */}
                <td className="p-3 text-green-600">{asset.jmlhAktif}</td>

                {/* NON AKTIF */}
                <td className="p-3 text-red-600">{asset.jmlhNonaktif}</td>

                {/* LOCATION */}
                <td className="p-3">{asset.location}</td>
              </motion.tr>
            ))}

            {filteredAssets.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={9}>
                  Tidak ada aset pada tahun ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
