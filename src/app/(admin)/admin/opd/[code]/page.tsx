/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

// Dummy data asset OPD
const opdAssets = [
  {
    id: 1,
    category: "Laptop",
    acquisitionYear: 2022,
    status: "AKTIF",
    quantity: 5,
  },
  {
    id: 2,
    category: "Laptop",
    acquisitionYear: 2023,
    status: "NON_AKTIF",
    quantity: 2,
  },
  {
    id: 3,
    category: "Printer",
    acquisitionYear: 2021,
    status: "AKTIF",
    quantity: 3,
  },
  {
    id: 4,
    category: "Meja",
    acquisitionYear: 2022,
    status: "AKTIF",
    quantity: 4,
  },
];

// Warna untuk pie chart
const colors = ["#22c55e", "#ef4444"];

export default function DashboardDetailOPD() {
  const summary = useMemo(() => {
    const total = opdAssets.reduce((acc, a) => acc + a.quantity, 0);
    const aktif = opdAssets
      .filter((a) => a.status === "AKTIF")
      .reduce((acc, a) => acc + a.quantity, 0);
    const nonAktif = opdAssets
      .filter((a) => a.status === "NON_AKTIF")
      .reduce((acc, a) => acc + a.quantity, 0);
    return { total, aktif, nonAktif };
  }, []);

  // Pie Data
  const pieData = [
    { name: "Aktif", value: summary.aktif },
    { name: "Non Aktif", value: summary.nonAktif },
  ];

  // Bar Data
  const barData = Object.values(
    opdAssets.reduce((acc: any, asset) => {
      if (!acc[asset.category])
        acc[asset.category] = { category: asset.category, total: 0 };
      acc[asset.category].total += asset.quantity;
      return acc;
    }, {})
  );

  // Line Data (per tahun)
  const lineData = Object.values(
    opdAssets.reduce((acc: any, asset) => {
      if (!acc[asset.acquisitionYear])
        acc[asset.acquisitionYear] = { year: asset.acquisitionYear, total: 0 };
      acc[asset.acquisitionYear].total += asset.quantity;
      return acc;
    }, {})
  ).sort((a: any, b: any) => a.year - b.year);

  return (
    <div className="p-8 space-y-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold"
      >
        Dashboard OPD - Detail
      </motion.h1>

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
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
          transition={{ duration: 0.4, delay: 0.2 }}
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
