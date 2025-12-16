"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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

import { useGet } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";

type YearKey = "all" | number;

interface ChartStatus {
  name: string;
  value: number;
}

interface ChartPerTahun {
  year: number;
  total: number;
}

export default function DashboardOPD() {
  const currentYear = new Date().getFullYear();
  const tenYearsAgo = currentYear - 10;
  const yearOptions: YearKey[] = [
    "all",
    ...Array.from({ length: 11 }, (_, i) => tenYearsAgo + i),
  ];

  const [year, setYear] = useState<YearKey>("all");

  const pieColors = ["#22c55e", "#ef4444"];

  // ambil data dari API
  const { data, error, isLoading } = useGet(`/dashboard/opd?year=${year}`);

  if (isLoading)
    return (
      <div className="p-8 space-y-10">
        {/* Header skeleton */}
        <Skeleton className="h-10 w-1/3 rounded" />

        {/* Summary cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-80 rounded-lg lg:col-span-2" />
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div className="p-8">
        <Card className="p-6 text-center bg-red-50 border border-red-200">
          <CardTitle className="text-red-600">Terjadi Kesalahan</CardTitle>
          <p>{error?.message || "Gagal memuat data."}</p>
        </Card>
      </div>
    );

  const { summary, charts } = data!;

  return (
    <div className="p-8 space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Dashboard OPD
        </motion.h1>

        {/* SELECT TAHUN */}
        <Select
          value={year.toString()}
          onValueChange={(val) => setYear(val === "all" ? "all" : Number(val))}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter Tahun" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y === "all" ? "Semua Tahun" : y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
        ].map((item, idx) => (
          <Card key={idx} className="p-4">
            <CardTitle>{item.label}</CardTitle>
            <p className={`text-3xl font-bold mt-2 ${item.color ?? ""}`}>
              {item.value}
            </p>
          </Card>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* PIE */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>
              {year === "all"
                ? "Status Aset 10 Tahun Terakhir"
                : `Status Aset Tahun ${year}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={charts.status}
                  dataKey="value"
                  outerRadius={90}
                  label
                >
                  {charts.status.map((_: ChartStatus, i: number) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BAR */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>
              {year === "all"
                ? "Aset per Kategori 10 Tahun Terakhir"
                : `Aset per Kategori Tahun ${year}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.kategori}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* LINE */}
        <Card className="p-4 lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {year === "all"
                ? "Perkembangan Aset 10 Tahun Terakhir"
                : "Perkembangan Aset Tahun " + year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={
                  year === "all"
                    ? charts.perTahun
                        .sort(
                          (a: ChartPerTahun, b: ChartPerTahun) =>
                            b.year - a.year
                        )
                        .slice(0, 10)
                        .sort(
                          (a: ChartPerTahun, b: ChartPerTahun) =>
                            a.year - b.year
                        )
                    : charts.perTahun
                }
              >
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
      </div>
    </div>
  );
}
