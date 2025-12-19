"use client";

import { useMemo, useState } from "react";
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

/**
 * ======================
 * TYPES
 * ======================
 */
type AssetStatus = {
  name: "Aktif" | "Non Aktif";
  count: number;
};

type AssetGrowth = {
  label: string;
  total: number;
};

type AssetPerOpd = {
  id: string;
  name: string;
  totalAssets: number;
  hardware: {
    total: number;
    aktif: number;
    nonAktif: number;
  };
  software: {
    total: number;
    aktif: number;
    nonAktif: number;
  };
};

type DashboardSummary = {
  totalOpd: number;
  totalUsers: number;
  totalHardware: number;
  totalSoftware: number;
};

type DashboardData = {
  summary: DashboardSummary;
  assetHardwareStatus: AssetStatus[];
  assetSoftwareStatus: AssetStatus[];
  assetsPerOpd: AssetPerOpd[];
  assetGrowth: AssetGrowth[];
};

const colors = ["#22c55e", "#ef4444"];

/**
 * EMPTY STATE CHART
 */
const EmptyChart = ({ label }: { label: string }) => (
  <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
    {label}
  </div>
);

export default function AdminDashboard() {
  /**
   * ======================
   * FILTER TAHUN
   * ======================
   */
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 10 }, (_, i) => String(currentYear - i)),
    [currentYear]
  );

  const [selectedYear, setSelectedYear] = useState<number | "All">("All");

  /**
   * ======================
   * FETCH DATA
   * ======================
   */
  const { data, isLoading } = useGet(
    selectedYear === "All"
      ? "/dashboard/admin"
      : `/dashboard/admin?year=${selectedYear}`
  );

  const dashboard = (data ?? {}) as Partial<DashboardData>;

  /**
   * ======================
   * SAFE DATA
   * ======================
   */
  const summary: DashboardSummary = dashboard.summary ?? {
    totalOpd: 0,
    totalUsers: 0,
    totalHardware: 0,
    totalSoftware: 0,
  };

  const assetHardwareStatus = dashboard.assetHardwareStatus ?? [];
  const assetSoftwareStatus = dashboard.assetSoftwareStatus ?? [];
  const assetsPerOpd = dashboard.assetsPerOpd ?? [];
  const assetGrowth = dashboard.assetGrowth ?? [];

  /**
   * ======================
   * DERIVED DATA
   * ======================
   */
  const totalAktif =
    (assetHardwareStatus.find((a) => a.name === "Aktif")?.count || 0) +
    (assetSoftwareStatus.find((a) => a.name === "Aktif")?.count || 0);

  const totalNonAktif =
    (assetHardwareStatus.find((a) => a.name === "Non Aktif")?.count || 0) +
    (assetSoftwareStatus.find((a) => a.name === "Non Aktif")?.count || 0);

  const totalAssets = summary.totalHardware + summary.totalSoftware;

  const pieData = [
    { name: "Aktif", value: totalAktif },
    { name: "Non Aktif", value: totalNonAktif },
  ];

  const barData = assetsPerOpd.map((o) => ({
    name: o.name || "-",
    total: o.totalAssets || 0,
  }));

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen px-6 py-10 space-y-10">
      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold"
      >
        Dashboard Admin
      </motion.h1>

      {/* FILTER */}
      <div className="flex items-center gap-4">
        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(
              e.target.value === "All" ? "All" : Number(e.target.value)
            )
          }
          className="border px-3 py-2 rounded-md"
        >
          <option value="All">10 Tahun Terakhir</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <Badge variant="secondary">
          {selectedYear === "All"
            ? "Mode: Tahunan (10 Tahun)"
            : `Mode: Bulanan (${selectedYear})`}
        </Badge>
      </div>

      {/* SUMMARY */}
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
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-4">
              <CardTitle className="text-lg">{item.label}</CardTitle>
              <p className="text-2xl font-bold mt-2">{item.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PIE */}
        <Card>
          <CardHeader>
            <CardTitle>Status Asset</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.every((d) => d.value === 0) ? (
              <EmptyChart label="Data status asset tidak tersedia" />
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* BAR */}
        <Card>
          <CardHeader>
            <CardTitle>Jumlah Asset per OPD</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length === 0 ? (
              <EmptyChart label="Data asset per OPD tidak ditemukan" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* LINE */}
        <Card>
          <CardHeader>
            <CardTitle>
              Perkembangan Asset{" "}
              {selectedYear === "All" ? "(Tahunan)" : "(Bulanan)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assetGrowth.length === 0 ? (
              <EmptyChart label="Data perkembangan asset belum tersedia" />
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* OPD LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assetsPerOpd.map((opd, idx) => (
          <motion.div
            key={opd.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{opd.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Asset</span>
                  <strong>{opd.totalAssets}</strong>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded">
                    <p className="font-medium text-green-800">Hardware</p>
                    <p>Total: {opd.hardware.total}</p>
                    <p>
                      Aktif:{" "}
                      <Badge className="bg-green-100 text-green-800">
                        {opd.hardware.aktif}
                      </Badge>
                    </p>
                    <p>
                      Non Aktif:{" "}
                      <Badge className="bg-red-100 text-red-800">
                        {opd.hardware.nonAktif}
                      </Badge>
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <p className="font-medium text-blue-800">Software</p>
                    <p>Total: {opd.software.total}</p>
                    <p>
                      Aktif:{" "}
                      <Badge className="bg-green-100 text-green-800">
                        {opd.software.aktif}
                      </Badge>
                    </p>
                    <p>
                      Non Aktif:{" "}
                      <Badge className="bg-red-100 text-red-800">
                        {opd.software.nonAktif}
                      </Badge>
                    </p>
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
