"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Dummy Data OPD
const dummyOPD = {
  id: 1,
  name: "Dinas Pendidikan",
  email: "pendidikan@domain.go.id",
  phone: "021-123456",
  totalAssets: 12,
  totalUsers: 25,
  aktif: 10,
  nonAktif: 2,
  assets: [
    {
      id: 1,
      name: "Laptop HP",
      brand: "HP",
      model: "Probook 440 G8",
      location: "Ruang Administrasi",
      jmlhAktif: 8,
      jmlhNonaktif: 2,
      jml: 10,
    },
    {
      id: 2,
      name: "Proyektor Epson",
      brand: "Epson",
      model: "Pro 1000",
      location: "Ruang Aula",
      jmlhAktif: 5,
      jmlhNonaktif: 3,
      jml: 8,
    },
  ],
};

export default function OPDDetailPage() {
  const opd = dummyOPD;

  const handleDeleteOPD = () => {
    const confirmed = confirm(
      `Apakah Anda yakin ingin menghapus OPD "${opd.name}"?`
    );
    if (confirmed) {
      console.log("Deleted OPD id:", opd.id);
      alert("OPD berhasil dihapus (dummy).");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8"
      >
        Detail OPD
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Informasi OPD */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>{opd.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{opd.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Telepon</p>
              <p className="font-medium">{opd.phone}</p>
            </div>
            <div className="flex justify-between mt-2">
              <p>Total Asset:</p>
              <p className="font-semibold">{opd.totalAssets}</p>
            </div>
            <div className="flex justify-between">
              <p>Total User:</p>
              <p className="font-semibold">{opd.totalUsers}</p>
            </div>
            <div className="flex justify-between">
              <p>Aktif:</p>
              <Badge className="bg-green-100 text-green-700">{opd.aktif}</Badge>
            </div>
            <div className="flex justify-between">
              <p>Non Aktif:</p>
              <Badge className="bg-red-100 text-red-700">{opd.nonAktif}</Badge>
            </div>

            {/* Tombol aksi OPD */}
            <div className="flex gap-4 pt-4">
              <Button size="sm" variant="outline">
                Edit OPD
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDeleteOPD}>
                Delete OPD
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* List Asset OPD (Read-only) */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Daftar Asset (Read-only)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {opd.assets.map((asset) => (
              <div
                key={asset.id}
                className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 py-2"
              >
                <p className="font-medium">{asset.name}</p>
                <p className="text-sm text-gray-500">{asset.brand}</p>
                <p className="text-sm text-gray-500">{asset.model}</p>
                <p className="text-sm text-gray-500">{asset.location}</p>
                <p className="text-sm text-gray-500">
                  {asset.jmlhAktif} Aktif / {asset.jmlhNonaktif} Nonaktif
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
