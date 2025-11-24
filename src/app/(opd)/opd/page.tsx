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
// Dummy Session User Login
// ===========================
const userSession = {
  id: 100,
  opdId: 1,
};

// ===========================
// Dummy Data Asset (NEW SCHEMA)
// ===========================
const assets = [
  {
    id: 1,
    category: "Laptop",
    brand: "Asus",
    model: "A14",
    acquisitionYear: 2022,
    jmlhAktif: 8,
    jmlhNonaktif: 2,
    jml: 10,
    opdId: 1,
  },
  {
    id: 2,
    category: "Laptop",
    brand: "HP",
    model: "840 G2",
    acquisitionYear: 2020,
    jmlhAktif: 4,
    jmlhNonaktif: 3,
    jml: 7,
    opdId: 1,
  },
  {
    id: 3,
    category: "Printer",
    brand: "Canon",
    model: "IP2770",
    acquisitionYear: 2023,
    jmlhAktif: 5,
    jmlhNonaktif: 0,
    jml: 5,
    opdId: 1,
  },
  {
    id: 4,
    category: "Meja",
    brand: "Ikea",
    model: "ProTable",
    acquisitionYear: 2021,
    jmlhAktif: 11,
    jmlhNonaktif: 0,
    jml: 11,
    opdId: 1,
  },
];

// =========================
// Component Dashboard
// =========================
export default function DashboardOPD() {
  const [yearFilter, setYearFilter] = useState("all");

  // Tahun unik
  const years = [...new Set(assets.map((a) => a.acquisitionYear))];

  // Filter berdasarkan OPD login
  const opdAssets = useMemo(
    () => assets.filter((a) => a.opdId === userSession.opdId),
    []
  );

  // Filter tahun
  const filteredAssets = useMemo(() => {
    if (yearFilter === "all") return opdAssets;
    return opdAssets.filter((a) => String(a.acquisitionYear) === yearFilter);
  }, [yearFilter, opdAssets]);

  // Summary (NEW)
  const summary = {
    total: filteredAssets.reduce((t, a) => t + a.jml, 0),
    aktif: filteredAssets.reduce((t, a) => t + a.jmlhAktif, 0),
    nonAktif: filteredAssets.reduce((t, a) => t + a.jmlhNonaktif, 0),
  };

  // Bar Chart: total asset per kategori
  const barData = Object.values(
    filteredAssets.reduce((acc, asset) => {
      if (!acc[asset.category]) {
        acc[asset.category] = { category: asset.category, total: 0 };
      }
      acc[asset.category].total += asset.jml;
      return acc;
    }, {} as Record<string, any>)
  );

  // Pie Chart: aktif vs nonaktif
  const pieData = [
    { name: "Aktif", value: summary.aktif },
    { name: "Non Aktif", value: summary.nonAktif },
  ];

  const colors = ["#22c55e", "#ef4444"];

  // Line Chart: total asset per tahun
  const lineData = Object.values(
    opdAssets.reduce((acc, asset) => {
      if (!acc[asset.acquisitionYear]) {
        acc[asset.acquisitionYear] = {
          year: asset.acquisitionYear,
          total: 0,
        };
      }
      acc[asset.acquisitionYear].total += asset.jml;
      return acc;
    }, {} as Record<number, any>)
  ).sort((a, b) => a.year - b.year);

  return (
    <div className="p-8 space-y-10">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Asset", value: summary.total },
          { label: "Aktif", value: summary.aktif, color: "text-green-600" },
          {
            label: "Non Aktif",
            value: summary.nonAktif,
            color: "text-red-600",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
          >
            <Card className="p-4 shadow-md">
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
          <Card className="shadow-md p-4">
            <CardHeader>
              <CardTitle>Status Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={90} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={colors[i]} />
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
          <Card className="shadow-md p-4">
            <CardHeader>
              <CardTitle>Total Asset per Kategori</CardTitle>
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
          <Card className="shadow-md p-4">
            <CardHeader>
              <CardTitle>Perkembangan Asset per Tahun</CardTitle>
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
