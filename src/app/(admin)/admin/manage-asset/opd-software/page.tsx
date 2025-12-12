"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  SlidersHorizontal,
  Plus,
  Package,
  Eye,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { notifier } from "@/components/ToastNotifier";

// ✅ Dummy data (tidak berubah)
const DUMMY_SOFTWARE = [
  {
    id: "sw-001",
    nama: "Microsoft Windows 11 Pro",
    jenisLisensi: "PERPETUAL" as const,
    nomorSeri: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    tglBerakhirLisensi: "2030-12-31",
    versiTerpasang: 22621,
    vendor: "Microsoft",
    inHouse: false,
    kritikalitas: "TINGGI" as const,
    hargaPerolehan: "2500000",
    tahunPengadaan: "2023-08-15",
    status: "AKTIF" as const,
    pic: "Ahmad Fauzi",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-01", nama: "Sistem Operasi" },
    hardware: { id: "hw-101", nama: "Laptop Dell Latitude 5420" },
    createdAt: "2023-08-15T07:00:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "sw-002",
    nama: "Microsoft Office 365",
    jenisLisensi: "LANGGANAN" as const,
    nomorSeri: "O365-2025-ABCD-1234",
    tglBerakhirLisensi: "2025-12-31",
    versiTerpasang: 2412,
    vendor: "Microsoft",
    inHouse: false,
    kritikalitas: "SEDANG" as const,
    hargaPerolehan: "1200000",
    tahunPengadaan: "2024-01-10",
    status: "AKTIF" as const,
    pic: "Siti Rahayu",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-02", nama: "Produktivitas" },
    hardware: null,
    createdAt: "2024-01-10T10:30:00Z",
    updatedAt: "2024-01-10T10:30:00Z",
  },
  {
    id: "sw-003",
    nama: "ESET Endpoint Antivirus",
    jenisLisensi: "LANGGANAN" as const,
    nomorSeri: "ESET-ANTV-2026-XYZ",
    tglBerakhirLisensi: "2026-03-31",
    versiTerpasang: 9,
    vendor: "ESET",
    inHouse: false,
    kritikalitas: "TINGGI" as const,
    hargaPerolehan: "450000",
    tahunPengadaan: "2024-02-01",
    status: "AKTIF" as const,
    pic: "Budi Santoso",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-03", nama: "Keamanan" },
    hardware: { id: "hw-102", nama: "PC Desktop Lenovo" },
    createdAt: "2024-02-01T08:45:00Z",
    updatedAt: "2024-02-01T08:45:00Z",
  },
  {
    id: "sw-004",
    nama: "Sistem Inventory Internal",
    jenisLisensi: "OPEN_SOURCE" as const,
    nomorSeri: "-",
    tglBerakhirLisensi: "9999-12-31",
    versiTerpasang: 2,
    vendor: null,
    inHouse: true,
    kritikalitas: "TINGGI" as const,
    hargaPerolehan: "0",
    tahunPengadaan: "2023-05-20",
    status: "AKTIF" as const,
    pic: "Umar Usmanis",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-04", nama: "Aplikasi Internal" },
    hardware: { id: "hw-103", nama: "Server Dell R740" },
    createdAt: "2023-05-20T14:20:00Z",
    updatedAt: "2024-03-10T11:00:00Z",
  },
  {
    id: "sw-005",
    nama: "Adobe Photoshop CC",
    jenisLisensi: "LANGGANAN" as const,
    nomorSeri: "ADBE-PHSP-2025-7890",
    tglBerakhirLisensi: "2025-06-30",
    versiTerpasang: 25,
    vendor: "Adobe",
    inHouse: false,
    kritikalitas: "RENDAH" as const,
    hargaPerolehan: "950000",
    tahunPengadaan: "2024-04-05",
    status: "AKTIF" as const,
    pic: "Dewi Lestari",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-05", nama: "Desain & Multimedia" },
    hardware: { id: "hw-104", nama: "Workstation HP Z4" },
    createdAt: "2024-04-05T09:10:00Z",
    updatedAt: "2024-04-05T09:10:00Z",
  },
  {
    id: "sw-006",
    nama: "MySQL Community Server",
    jenisLisensi: "OPEN_SOURCE" as const,
    nomorSeri: "-",
    tglBerakhirLisensi: "9999-12-31",
    versiTerpasang: 80033,
    vendor: "Oracle",
    inHouse: false,
    kritikalitas: "TINGGI" as const,
    hargaPerolehan: "0",
    tahunPengadaan: "2022-11-12",
    status: "AKTIF" as const,
    pic: "Umar Usmanis",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-06", nama: "Database" },
    hardware: { id: "hw-103", nama: "Server Dell R740" },
    createdAt: "2022-11-12T16:30:00Z",
    updatedAt: "2022-11-12T16:30:00Z",
  },
  {
    id: "sw-007",
    nama: "Windows Server 2022",
    jenisLisensi: "PERPETUAL" as const,
    nomorSeri: "WS22-STD-XXXX-YYYY-ZZZZ",
    tglBerakhirLisensi: "2035-12-31",
    versiTerpasang: 20348,
    vendor: "Microsoft",
    inHouse: false,
    kritikalitas: "TINGGI" as const,
    hargaPerolehan: "8500000",
    tahunPengadaan: "2023-02-18",
    status: "AKTIF" as const,
    pic: "Ahmad Fauzi",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-01", nama: "Sistem Operasi" },
    hardware: { id: "hw-105", nama: "Server HPE ProLiant" },
    createdAt: "2023-02-18T11:20:00Z",
    updatedAt: "2023-02-18T11:20:00Z",
  },
  {
    id: "sw-008",
    nama: "Notepad++",
    jenisLisensi: "OPEN_SOURCE" as const,
    nomorSeri: "-",
    tglBerakhirLisensi: "9999-12-31",
    versiTerpasang: 864,
    vendor: null,
    inHouse: false,
    kritikalitas: "RENDAH" as const,
    hargaPerolehan: "0",
    tahunPengadaan: "2021-07-30",
    status: "AKTIF" as const,
    pic: "Umar Usmanis",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-07", nama: "Utilitas" },
    hardware: { id: "hw-101", nama: "Laptop Dell Latitude 5420" },
    createdAt: "2021-07-30T15:45:00Z",
    updatedAt: "2021-07-30T15:45:00Z",
  },
  {
    id: "sw-009",
    nama: "Laporan Bulanan (Template)",
    jenisLisensi: "OPEN_SOURCE" as const,
    nomorSeri: "-",
    tglBerakhirLisensi: "9999-12-31",
    versiTerpasang: 1,
    vendor: null,
    inHouse: true,
    kritikalitas: "RENDAH" as const,
    hargaPerolehan: "0",
    tahunPengadaan: "2024-01-01",
    status: "NON_AKTIF" as const,
    pic: "Siti Rahayu",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-04", nama: "Aplikasi Internal" },
    hardware: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-05-01T12:00:00Z",
  },
  {
    id: "sw-010",
    nama: "Zoom Workplace",
    jenisLisensi: "LANGGANAN" as const,
    nomorSeri: "ZOOM-PRO-2025-ABCD",
    tglBerakhirLisensi: "2025-10-15",
    versiTerpasang: 6050,
    vendor: "Zoom",
    inHouse: false,
    kritikalitas: "SEDANG" as const,
    hargaPerolehan: "300000",
    tahunPengadaan: "2024-03-20",
    status: "AKTIF" as const,
    pic: "Budi Santoso",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-08", nama: "Komunikasi" },
    hardware: null,
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "sw-011",
    nama: "Postman",
    jenisLisensi: "OPEN_SOURCE" as const,
    nomorSeri: "-",
    tglBerakhirLisensi: "9999-12-31",
    versiTerpasang: 1025,
    vendor: "Postman Inc",
    inHouse: false,
    kritikalitas: "RENDAH" as const,
    hargaPerolehan: "0",
    tahunPengadaan: "2023-09-12",
    status: "AKTIF" as const,
    pic: "Umar Usmanis",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-07", nama: "Utilitas" },
    hardware: { id: "hw-101", nama: "Laptop Dell Latitude 5420" },
    createdAt: "2023-09-12T14:15:00Z",
    updatedAt: "2023-09-12T14:15:00Z",
  },
  {
    id: "sw-012",
    nama: "Visual Studio Code",
    jenisLisensi: "OPEN_SOURCE" as const,
    nomorSeri: "-",
    tglBerakhirLisensi: "9999-12-31",
    versiTerpasang: 189,
    vendor: "Microsoft",
    inHouse: false,
    kritikalitas: "RENDAH" as const,
    hargaPerolehan: "0",
    tahunPengadaan: "2022-05-05",
    status: "AKTIF" as const,
    pic: "Umar Usmanis",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-07", nama: "Utilitas" },
    hardware: { id: "hw-101", nama: "Laptop Dell Latitude 5420" },
    createdAt: "2022-05-05T09:30:00Z",
    updatedAt: "2022-05-05T09:30:00Z",
  },
  {
    id: "sw-013",
    nama: "Sistem Pelaporan SIMDA",
    jenisLisensi: "PERPETUAL" as const,
    nomorSeri: "SIMDA-BRG-2020-001",
    tglBerakhirLisensi: "2040-12-31",
    versiTerpasang: 4,
    vendor: "BPKP",
    inHouse: false,
    kritikalitas: "TINGGI" as const,
    hargaPerolehan: "15000000",
    tahunPengadaan: "2020-12-01",
    status: "NON_AKTIF" as const,
    pic: "Ahmad Fauzi",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-04", nama: "Aplikasi Internal" },
    hardware: { id: "hw-106", nama: "Server Backup" },
    createdAt: "2020-12-01T00:00:00Z",
    updatedAt: "2024-05-01T12:00:00Z",
  },
  {
    id: "sw-014",
    nama: "GIMP",
    jenisLisensi: "OPEN_SOURCE" as const,
    nomorSeri: "-",
    tglBerakhirLisensi: "9999-12-31",
    versiTerpasang: 210,
    vendor: null,
    inHouse: false,
    kritikalitas: "RENDAH" as const,
    hargaPerolehan: "0",
    tahunPengadaan: "2023-10-10",
    status: "AKTIF" as const,
    pic: "Dewi Lestari",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-05", nama: "Desain & Multimedia" },
    hardware: { id: "hw-104", nama: "Workstation HP Z4" },
    createdAt: "2023-10-10T13:20:00Z",
    updatedAt: "2023-10-10T13:20:00Z",
  },
  {
    id: "sw-015",
    nama: "Node.js",
    jenisLisensi: "OPEN_SOURCE" as const,
    nomorSeri: "-",
    tglBerakhirLisensi: "9999-12-31",
    versiTerpasang: 20,
    vendor: "OpenJS Foundation",
    inHouse: false,
    kritikalitas: "SEDANG" as const,
    hargaPerolehan: "0",
    tahunPengadaan: "2024-02-28",
    status: "AKTIF" as const,
    pic: "Umar Usmanis",
    opd: { id: "opd-01", nama: "Dinas Kominfo" },
    kategoriSoftware: { id: "kat-07", nama: "Utilitas" },
    hardware: { id: "hw-101", nama: "Laptop Dell Latitude 5420" },
    createdAt: "2024-02-28T16:40:00Z",
    updatedAt: "2024-02-28T16:40:00Z",
  },
];

const DUMMY_KATEGORI: { id: string; nama: string }[] = [
  { id: "kat-01", nama: "Sistem Operasi" },
  { id: "kat-02", nama: "Produktivitas" },
  { id: "kat-03", nama: "Keamanan" },
  { id: "kat-04", nama: "Aplikasi Internal" },
  { id: "kat-05", nama: "Desain & Multimedia" },
  { id: "kat-06", nama: "Database" },
  { id: "kat-07", nama: "Utilitas" },
  { id: "kat-08", nama: "Komunikasi" },
];

// ✅ Dummy OPD — dimasukkan ke filter
const DUMMY_OPD: { id: string; nama: string }[] = [
  { id: "opd-01", nama: "Dinas Kominfo" },
  { id: "opd-02", nama: "Dinas Pendidikan" },
  { id: "opd-03", nama: "Dinas Kesehatan" },
  { id: "opd-04", nama: "Dinas PU" },
  { id: "opd-05", nama: "Dinas Perhubungan" },
];

export type Software = (typeof DUMMY_SOFTWARE)[0];

export default function SoftwareListPage() {
  const router = useRouter();

  // ✅ Controlled state — semua string kosong (bukan undefined)
  const [searchNama, setSearchNama] = useState("");
  const [jenisLisensi, setJenisLisensi] = useState("");
  const [kritikalitas, setKritikalitas] = useState("");
  const [status, setStatus] = useState("");
  const [tahun, setTahun] = useState("");
  const [pic, setPic] = useState("");
  const [opdId, setOpdId] = useState(""); // ✅ dikembalikan
  const [kategoriId, setKategoriId] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;
  const [openFilter, setOpenFilter] = useState(false);

  // ✅ Filter lokal — termasuk opdId
  const filteredSoftware = useMemo(() => {
    return DUMMY_SOFTWARE.filter((sw) => {
      if (searchNama) {
        const term = searchNama.toLowerCase();
        if (
          !sw.nama.toLowerCase().includes(term) &&
          !sw.nomorSeri.toLowerCase().includes(term)
        )
          return false;
      }
      if (
        jenisLisensi &&
        jenisLisensi !== "ALL" &&
        sw.jenisLisensi !== jenisLisensi
      )
        return false;
      if (
        kritikalitas &&
        kritikalitas !== "ALL" &&
        sw.kritikalitas !== kritikalitas
      )
        return false;
      if (status && status !== "ALL" && sw.status !== status) return false;
      if (pic && !sw.pic.toLowerCase().includes(pic.toLowerCase()))
        return false;
      if (
        kategoriId &&
        kategoriId !== "ALL" &&
        sw.kategoriSoftware.id !== kategoriId
      )
        return false;
      if (opdId && opdId !== "ALL" && sw.opd.id !== opdId) return false;
      if (
        tahun &&
        new Date(sw.tahunPengadaan).getFullYear().toString() !== tahun
      )
        return false;
      return true;
    });
  }, [
    searchNama,
    jenisLisensi,
    kritikalitas,
    status,
    pic,
    opdId,
    kategoriId,
    tahun,
  ]);

  const totalPages = Math.ceil(filteredSoftware.length / limit);
  const paginatedSoftware = filteredSoftware.slice(
    (page - 1) * limit,
    page * limit
  );

  const summary = {
    total: filteredSoftware.length,
    aktif: filteredSoftware.filter((sw) => sw.status === "AKTIF").length,
    nonAktif: filteredSoftware.filter((sw) => sw.status === "NON_AKTIF").length,
  };

  const tahunList = Array.from(
    new Set(
      DUMMY_SOFTWARE.map((sw) =>
        new Date(sw.tahunPengadaan).getFullYear()
      ).filter((y) => y > 0)
    )
  ).sort((a, b) => b - a);

  const goPrev = () => setPage(Math.max(1, page - 1));
  const goNext = () => setPage(Math.min(totalPages, page + 1));

  const handleDelete = async (id: string, nama: string) => {
    setTimeout(() => {
      notifier.success(`Software "${nama}" berhasil diarsipkan`);
    }, 300);
  };

  const formatRupiah = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num)
      ? "Rp 0"
      : new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(num);
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* BACK */}
      <Button
        variant="ghost"
        onClick={router.back}
        className="inline-flex items-center gap-2 mb-4 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Button>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6 sm:w-7 sm:h-7" /> Daftar Software
        </h1>
        <Link href="/admin/manage-asset/opd-software/add">
          <Button className="w-full sm:w-auto flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Software
          </Button>
        </Link>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 px-4 py-3 rounded-md text-center">
          <div className="text-sm text-gray-800">Total</div>
          <div className="text-xl font-bold">{summary.total}</div>
        </div>
        <div className="bg-green-100 px-4 py-3 rounded-md text-center">
          <div className="text-sm text-green-900">Aktif</div>
          <div className="text-xl font-bold">{summary.aktif}</div>
        </div>
        <div className="bg-red-100 px-4 py-3 rounded-md text-center">
          <div className="text-sm text-red-900">Non-Aktif</div>
          <div className="text-xl font-bold">{summary.nonAktif}</div>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Cari software (nama/nomor seri)..."
          value={searchNama}
          onChange={(e) => setSearchNama(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={() => setOpenFilter(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* TABLE / CARDS */}
      <Card className="rounded-xl shadow-md overflow-hidden">
        {paginatedSoftware.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Tidak ada software ditemukan.
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">Nama</th>
                    <th className="p-3">Lisensi</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">OPD</th>
                    <th className="p-3">Versi</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">Kritis</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSoftware.map((sw) => (
                    <motion.tr
                      key={sw.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">{sw.nama}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                          {sw.jenisLisensi}
                        </span>
                      </td>
                      <td className="p-3">{sw.kategoriSoftware.nama}</td>
                      <td className="p-3">{sw.opd.nama}</td>
                      <td className="p-3 text-center">{sw.versiTerpasang}</td>
                      <td className="p-3">{formatRupiah(sw.hargaPerolehan)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            sw.kritikalitas === "TINGGI"
                              ? "bg-red-100 text-red-800"
                              : sw.kritikalitas === "SEDANG"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {sw.kritikalitas}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            sw.status === "AKTIF"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sw.status}
                        </span>
                      </td>
                      <td className="p-3 flex flex-wrap gap-2 justify-center">
                        <Link
                          href={`/admin/manage-asset/opd-software/${sw.id}`}
                        >
                          <Button variant="secondary" size="sm">
                            <Eye className="w-3.5 h-3.5 mr-1" /> Detail
                          </Button>
                        </Link>
                        <Link
                          href={`/admin/manage-asset/opd-software/${sw.id}/edit`}
                        >
                          <Button variant="outline" size="sm">
                            <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash className="w-3.5 h-3.5 mr-1" /> Arsipkan
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Arsipkan Software?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Software akan dipindahkan ke arsip (status
                                diubah menjadi <b>NON-AKTIF</b>). Data tetap
                                bisa dipulihkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(sw.id, sw.nama)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Ya, Arsipkan
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y">
              {paginatedSoftware.map((sw) => (
                <motion.div
                  key={sw.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4"
                >
                  <div className="font-semibold">{sw.nama}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                      {sw.jenisLisensi}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        sw.kritikalitas === "TINGGI"
                          ? "bg-red-100 text-red-800"
                          : sw.kritikalitas === "SEDANG"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {sw.kritikalitas}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">Kategori:</span>{" "}
                      {sw.kategoriSoftware.nama}
                    </div>
                    <div>
                      <span className="font-medium">OPD:</span> {sw.opd.nama}
                    </div>
                    <div>
                      <span className="font-medium">Harga:</span>{" "}
                      {formatRupiah(sw.hargaPerolehan)}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-2">
                    <Link href={`/admin/manage-asset/opd-software/${sw.id}`}>
                      <Button variant="secondary" className="w-full">
                        <Eye className="w-4 h-4 mr-1" /> Detail
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash className="w-4 h-4 mr-1" /> Arsipkan
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Arsipkan Software?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Software akan dipindahkan ke arsip (status diubah
                            menjadi <b>NON-AKTIF</b>). Data tetap bisa
                            dipulihkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(sw.id, sw.nama)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Ya, Arsipkan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* PAGINATION */}
      {filteredSoftware.length > limit && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <Button
            disabled={page <= 1}
            onClick={goPrev}
            className="w-full sm:w-auto"
          >
            Sebelumnya
          </Button>
          <div className="text-sm text-gray-600">
            Halaman {page} dari {totalPages}
          </div>
          <Button
            disabled={page >= totalPages}
            onClick={goNext}
            className="w-full sm:w-auto"
          >
            Selanjutnya
          </Button>
        </div>
      )}

      {/* FILTER DIALOG — Dengan OPD */}
      <Dialog open={openFilter} onOpenChange={setOpenFilter}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Software</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Nama / Nomor Seri..."
              value={searchNama}
              onChange={(e) => setSearchNama(e.target.value)}
            />

            <Select value={jenisLisensi} onValueChange={setJenisLisensi}>
              <SelectTrigger>
                <SelectValue placeholder="Jenis Lisensi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jenis</SelectItem>
                <SelectItem value="PERPETUAL">Perpetual</SelectItem>
                <SelectItem value="LANGGANAN">Langganan</SelectItem>
                <SelectItem value="OPEN_SOURCE">Open Source</SelectItem>
              </SelectContent>
            </Select>

            <Select value={kritikalitas} onValueChange={setKritikalitas}>
              <SelectTrigger>
                <SelectValue placeholder="Kritikalitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                <SelectItem value="TINGGI">Tinggi</SelectItem>
                <SelectItem value="SEDANG">Sedang</SelectItem>
                <SelectItem value="RENDAH">Rendah</SelectItem>
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="AKTIF">Aktif</SelectItem>
                <SelectItem value="NON_AKTIF">Non-Aktif</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="PIC..."
              value={pic}
              onChange={(e) => setPic(e.target.value)}
            />

            {/* ✅ Dropdown OPD ditambahkan di sini */}
            <Select value={opdId} onValueChange={setOpdId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih OPD" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua OPD</SelectItem>
                {DUMMY_OPD.map((opd) => (
                  <SelectItem key={opd.id} value={opd.id}>
                    {opd.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={kategoriId} onValueChange={setKategoriId}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Kategori</SelectItem>
                {DUMMY_KATEGORI.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <label className="block text-sm mb-1">Tahun Pengadaan</label>
              <select
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className="w-full rounded border px-3 py-2 text-sm"
              >
                <option value="">Semua Tahun</option>
                {tahunList.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenFilter(false)}
              className="w-full"
            >
              Batal
            </Button>
            <Button onClick={() => setOpenFilter(false)} className="w-full">
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
