/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Dummy asset sesuai schema baru
const dummyAsset = {
  id: 1,
  category: "Laptop",
  brand: "HP",
  model: "Probook 440 G8",
  specification: "Intel i5, 8GB RAM, 512GB SSD, 14 inch IPS, Windows 11 Pro",
  acquisitionYear: 2022,
  jmlhAktif: 8,
  jmlhNonaktif: 2,
  jml: 10,
  location: "Ruang Administrasi",
  photoUrl:
    "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress",
};

export default function AssetDetailOPD() {
  const asset = dummyAsset;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-8"
      >
        Detail Aset
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle>Foto Aset</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-64 rounded-lg overflow-hidden bg-gray-200"
              >
                <Image
                  src={asset.photoUrl ?? "/no-image.png"}
                  alt={asset.category}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT — INFO */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>
                {asset.brand} {asset.model} — {asset.category}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-gray-800 space-y-4">
              {/* JUMLAH */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-3 gap-4"
              >
                <InfoItem
                  label="Jumlah Total"
                  value={asset.jml}
                  valueClass="text-blue-600"
                />
                <InfoItem
                  label="Aktif"
                  value={asset.jmlhAktif}
                  valueClass="text-green-600"
                />
                <InfoItem
                  label="Non Aktif"
                  value={asset.jmlhNonaktif}
                  valueClass="text-red-600"
                />
              </motion.div>

              {/* DETAIL */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <InfoItem label="Kategori" value={asset.category} />
                <InfoItem label="Brand" value={asset.brand} />
                <InfoItem label="Model" value={asset.model} />
                <InfoItem
                  label="Tahun Perolehan"
                  value={asset.acquisitionYear}
                />
                <InfoItem label="Lokasi" value={asset.location} />
              </motion.div>

              {/* SPESIFIKASI */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6"
              >
                <p className="text-sm text-gray-600">Spesifikasi</p>
                <p className="font-semibold">{asset.specification}</p>
              </motion.div>

              {/* ACTION BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex gap-4 pt-4"
              >
                <Link href={`/opd/asset/${dummyAsset.id}/edit`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Edit Aset
                  </Button>
                </Link>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Hapus Aset
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: any;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}
