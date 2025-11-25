"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// =====================
// Dummy Data OPD
// Sesuai schema DB
// =====================
const dummyOPD = [
  {
    id: 1,
    name: "Dinas Pendidikan",
    email: "pendidikan@domain.go.id",
    phone: "021-123456",
    totalAssets: 12,
    aktif: 10,
    nonAktif: 2,
  },
  {
    id: 2,
    name: "Dinas Kesehatan",
    email: "kesehatan@domain.go.id",
    phone: "021-234567",
    totalAssets: 8,
    aktif: 6,
    nonAktif: 2,
  },
  {
    id: 3,
    name: "Dinas Perhubungan",
    email: "perhubungan@domain.go.id",
    phone: "021-345678",
    totalAssets: 15,
    aktif: 12,
    nonAktif: 3,
  },
];

export default function OPDListPage() {
  return (
    <div className="min-h-screen px-6 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8"
      >
        Daftar OPD
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyOPD.map((opd, idx) => (
          <motion.div
            key={opd.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Link href={`/admin/opd/${opd.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {opd.name}
                  </CardTitle>
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
                    <p>Aktif:</p>
                    <Badge className="bg-green-100 text-green-700">
                      {opd.aktif}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <p>Non Aktif:</p>
                    <Badge className="bg-red-100 text-red-700">
                      {opd.nonAktif}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
