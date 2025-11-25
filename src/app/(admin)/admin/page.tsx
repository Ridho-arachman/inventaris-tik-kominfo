"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Dummy Data OPD
const opdList = [
  { id: 1, name: "Dinas Pendidikan", totalAssets: 12, aktif: 10, nonAktif: 2 },
  { id: 2, name: "Dinas Kesehatan", totalAssets: 8, aktif: 6, nonAktif: 2 },
  { id: 3, name: "Dinas Perhubungan", totalAssets: 15, aktif: 12, nonAktif: 3 },
];

const totalUsers = 25;
const colors = ["#22c55e", "#ef4444"];

export default function AdminDashboard() {
  // Summary
  const totalAssets = opdList.reduce((acc, o) => acc + o.totalAssets, 0);
  const totalAktif = opdList.reduce((acc, o) => acc + o.aktif, 0);
  const totalNonAktif = opdList.reduce((acc, o) => acc + o.nonAktif, 0);

  const pieData = [
    { name: "Aktif", value: totalAktif },
    { name: "Non Aktif", value: totalNonAktif },
  ];

  const barData = opdList.map((o) => ({ name: o.name, total: o.totalAssets }));

  return (
    <div className="min-h-screen px-6 py-10 space-y-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-4"
      >
        Dashboard Admin
      </motion.h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total OPD", value: opdList.length },
          { label: "Total User", value: totalUsers },
          { label: "Total Asset", value: totalAssets },
          {
            label: "Aktif / Non Aktif",
            value: `${totalAktif} / ${totalNonAktif}`,
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className="p-4 shadow-md">
              <CardTitle className="text-lg font-semibold">
                {item.label}
              </CardTitle>
              <p className="text-2xl font-bold mt-2">{item.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-4 shadow-md">
            <CardHeader>
              <CardTitle>Status Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={80} label>
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
          <Card className="p-4 shadow-md">
            <CardHeader>
              <CardTitle>Jumlah Asset per OPD</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
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
        >
          <Card className="p-4 shadow-md">
            <CardHeader>
              <CardTitle>Perkembangan Asset (Dummy)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={barData}>
                  <XAxis dataKey="name" />
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

      {/* LIST OPD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {opdList.map((opd, idx) => (
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
                  <div className="flex justify-between">
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
