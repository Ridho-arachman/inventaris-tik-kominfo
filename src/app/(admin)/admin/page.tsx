"use client";

import { motion } from "framer-motion";
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
import { useGet } from "@/hooks/useApi";
import { AdminDashboardData } from "@/types/DashboardAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

const colors = ["#22c55e", "#ef4444"];

export default function AdminDashboard() {
  const { data, error, isLoading } = useGet("/dashboard/admin");

  // Safety fallback
  const safeData: AdminDashboardData = data || {};
  const summary = safeData.summary || {
    totalOpd: 0,
    totalUsers: 0,
    totalHardware: 0,
    totalSoftware: 0,
  };
  const assetHardwareStatus = Array.isArray(safeData.assetHardwareStatus)
    ? safeData.assetHardwareStatus
    : [];
  const assetSoftwareStatus = Array.isArray(safeData.assetSoftwareStatus)
    ? safeData.assetSoftwareStatus
    : [];
  const assetsPerOpd = Array.isArray(safeData.assetsPerOpd)
    ? safeData.assetsPerOpd
    : [];
  const assetGrowth = Array.isArray(safeData.assetGrowth)
    ? safeData.assetGrowth
    : [];

  // Hitung total aktif & non aktif
  const totalAktif =
    (assetHardwareStatus.find((a) => a.name === "Aktif")?.aktifHardware || 0) +
    (assetSoftwareStatus.find((a) => a.name === "Aktif")?.aktifSoftware || 0);

  const totalNonAktif =
    (assetHardwareStatus.find((a) => a.name === "Non Aktif")
      ?.nonAktifHardware || 0) +
    (assetSoftwareStatus.find((a) => a.name === "Non Aktif")
      ?.nonAktifSoftware || 0);

  const totalAssets =
    (summary.totalHardware || 0) + (summary.totalSoftware || 0);

  const pieData = [
    { name: "Aktif", value: totalAktif },
    { name: "Non Aktif", value: totalNonAktif },
  ];

  const barData = assetsPerOpd.map((o) => ({
    name: o.name || "-",
    total: o.totalAssets || 0,
  }));

  if (isLoading)
    return (
      <div className="min-h-screen px-6 py-10 space-y-10">
        {/* Title */}
        <Skeleton className="h-8 w-64" />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>

        {/* OPD List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[260px] rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md w-full border-red-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <CardTitle className="text-red-600">
                Gagal Memuat Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>Terjadi kesalahan saat mengambil data dashboard admin.</p>
              <p className="text-red-600 font-medium">
                {error.message || "Silakan coba beberapa saat lagi."}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );

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
          { label: "Total OPD", value: summary.totalOpd },
          { label: "Total User", value: summary.totalUsers },
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
              <CardTitle>Perkembangan Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={assetGrowth}>
                  <XAxis dataKey="label" />
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
        {assetsPerOpd.map((opd, idx) => (
          <motion.div
            key={opd.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <Card className="hover:shadow-xl transition-shadow duration-300 border border-gray-200 rounded-xl overflow-hidden">
              <CardHeader className="bg-gray-50 p-4">
                <CardTitle className="text-lg font-semibold">
                  {opd.name || "-"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {/* Total Asset */}
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-700">Total Asset</p>
                  <p className="font-bold text-gray-900 text-lg">
                    {opd.totalAssets || 0}
                  </p>
                </div>

                {/* Hardware & Software Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hardware */}
                  <div className="p-3 bg-green-50 rounded-lg space-y-2">
                    <p className="font-medium text-green-800 text-sm">
                      Hardware
                    </p>
                    <div className="flex justify-between">
                      <p>Total</p>
                      <p className="font-semibold">
                        {opd.hardware?.total || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Aktif</p>
                      <Badge className="bg-green-100 text-green-800">
                        {opd.hardware?.aktif || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p>Non Aktif</p>
                      <Badge className="bg-red-100 text-red-800">
                        {opd.hardware?.nonAktif || 0}
                      </Badge>
                    </div>
                  </div>

                  {/* Software */}
                  <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                    <p className="font-medium text-blue-800 text-sm">
                      Software
                    </p>
                    <div className="flex justify-between">
                      <p>Total</p>
                      <p className="font-semibold">
                        {opd.software?.total || 0}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Aktif</p>
                      <Badge className="bg-green-100 text-green-800">
                        {opd.software?.aktif || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p>Non Aktif</p>
                      <Badge className="bg-red-100 text-red-800">
                        {opd.software?.nonAktif || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
