/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// ===========================
// Dummy Session User OPD
// ===========================
const userSession = {
  id: "user-1",
  opdId: "OPD-001",
};

// ===========================
// DUMMY DATA — Hardware
// ===========================
const hardwareDummy = [
  {
    kodeId: "HW-001",
    nama: "Laptop A14",
    merk: "Asus",
    tglPengadaan: new Date("2022-06-12"),
    status: "AKTIF",
    opdId: "OPD-001",
    jenisId: "JEN-1",
    jenisHardware: { nama: "Laptop" },
  },
  {
    kodeId: "HW-002",
    nama: "Laptop HP 840",
    merk: "HP",
    tglPengadaan: new Date("2020-04-10"),
    status: "NON_AKTIF",
    opdId: "OPD-001",
    jenisId: "JEN-1",
    jenisHardware: { nama: "Laptop" },
  },
  {
    kodeId: "HW-003",
    nama: "Printer IP2770",
    merk: "Canon",
    tglPengadaan: new Date("2023-01-15"),
    status: "AKTIF",
    opdId: "OPD-001",
    jenisId: "JEN-2",
    jenisHardware: { nama: "Printer" },
  },
  {
    kodeId: "HW-004",
    nama: "Meja Kantor",
    merk: "IKEA",
    tglPengadaan: new Date("2021-02-20"),
    status: "CADANGAN",
    opdId: "OPD-001",
    jenisId: "JEN-3",
    jenisHardware: { nama: "Furniture" },
  },
];

// ===========================
// DUMMY DATA — Software
// ===========================
const softwareDummy = [
  {
    kodeId: "SW-001",
    nama: "Microsoft Office 2021",
    jenis: "Lisensi",
    tglPengadaan: new Date("2022-01-12"),
    status: "AKTIF",
    opdId: "OPD-001",
  },
  {
    kodeId: "SW-002",
    nama: "Adobe Photoshop",
    jenis: "Lisensi",
    tglPengadaan: new Date("2021-03-18"),
    status: "AKTIF",
    opdId: "OPD-001",
  },
  {
    kodeId: "SW-003",
    nama: "Sistem Informasi Absensi",
    jenis: "Aplikasi Internal",
    tglPengadaan: new Date("2020-08-22"),
    status: "NON_AKTIF",
    opdId: "OPD-001",
  },
];

// =========================
// Component Dashboard
// =========================
export default function DashboardOPD() {
  const [yearFilter, setYearFilter] = useState("all");

  // Gabungkan hardware + software sesuai OPD user
  const allAssets = useMemo(() => {
    const hw = hardwareDummy
      .filter((h) => h.opdId === userSession.opdId)
      .map((h) => ({
        ...h,
        kategori: h.jenisHardware.nama,
        tipe: "Hardware",
      }));

    const sw = softwareDummy
      .filter((s) => s.opdId === userSession.opdId)
      .map((s) => ({
        ...s,
        kategori: s.jenis,
        tipe: "Software",
      }));

    return [...hw, ...sw];
  }, []);

  // Tahun unik
  const years = [
    ...new Set(allAssets.map((a) => a.tglPengadaan.getFullYear())),
  ].sort();

  // Filter tahun
  const filteredAssets = useMemo(() => {
    if (yearFilter === "all") return allAssets;
    return allAssets.filter(
      (a) => a.tglPengadaan.getFullYear().toString() === yearFilter
    );
  }, [yearFilter, allAssets]);

  // Summary
  const summary = {
    total: filteredAssets.length,
    aktif: filteredAssets.filter((a) => a.status === "AKTIF").length,
    nonAktif: filteredAssets.filter((a) => a.status === "NON_AKTIF").length,
    cadangan: filteredAssets.filter((a) => a.status === "CADANGAN").length,
  };

  // Bar Chart kategori hardware+software
  const barData = Object.values(
    filteredAssets.reduce((acc, item) => {
      const cat = item.kategori;
      if (!acc[cat]) acc[cat] = { category: cat, total: 0 };
      acc[cat].total += 1;
      return acc;
    }, {} as Record<string, any>)
  );

  // Pie Chart status
  const pieData = [
    { name: "Aktif", value: summary.aktif },
    { name: "Non Aktif", value: summary.nonAktif },
    { name: "Cadangan", value: summary.cadangan },
  ];

  const pieColors = ["#22c55e", "#ef4444", "#eab308"];

  // Line Chart jumlah per tahun
  const lineData = Object.values(
    allAssets.reduce((acc, item) => {
      const year = item.tglPengadaan.getFullYear();
      if (!acc[year]) acc[year] = { year, total: 0 };
      acc[year].total += 1;
      return acc;
    }, {} as Record<number, any>)
  ).sort((a, b) => a.year - b.year);

  return (
    <div className="p-8 space-y-10">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold">Dashboard OPD</h1>

        <div className="w-40">
          <Select onValueChange={setYearFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Aset", value: summary.total },
          { label: "Aktif", value: summary.aktif, color: "text-green-600" },
          {
            label: "Non Aktif",
            value: summary.nonAktif,
            color: "text-red-600",
          },
          {
            label: "Cadangan",
            value: summary.cadangan,
            color: "text-yellow-600",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className="p-4">
              <CardTitle>{item.label}</CardTitle>
              <p className={`text-3xl font-bold mt-2 ${item.color || ""}`}>
                {item.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Status Aset</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={90} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Aset per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2"
        >
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Perkembangan Aset per Tahun</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6366f1"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
