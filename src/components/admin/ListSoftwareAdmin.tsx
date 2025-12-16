"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
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
  Pencil,
  Trash,
  Plus,
  Cpu,
  Eye,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useDelete, useGet } from "@/hooks/useApi";
import {
  Hardware,
  KategoriHardware,
  KategoriSoftware,
  Opd,
  Software,
} from "@/generated/client";
// import { Select } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { notifier } from "@/components/ToastNotifier";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SoftwareRes = Software & {
  hardware: Hardware;
  kategoriSoftware: KategoriSoftware;
  opd: Opd;
};

export default function SoftwareListComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchNama, setSearchNama] = useState("");
  const [jenisLisensi, setJenisLisensi] = useState("");
  const [kategori, setKategori] = useState("");
  const [kritikalitas, setKritikalitas] = useState("");
  const [status, setStatus] = useState("");
  const [tahun, setTahun] = useState("");
  const [pic, setPic] = useState("");
  const [opdId, setOpdId] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [openFilter, setOpenFilter] = useState(false);

  const [debouncedNama] = useDebounce(searchNama, 500);

  useEffect(() => {
    if (!searchParams) return;

    const qNama = searchParams.get("q") ?? "";
    const qKritikalitas = searchParams.get("kritikalitas") ?? "";
    const qJenisLisensi = searchParams.get("jenisLisensi") ?? "";
    const qKategori = searchParams.get("kategori") ?? "";
    const qStatus = searchParams.get("status") ?? "";
    const qTahun = searchParams.get("tahun") ?? "";
    const qPic = searchParams.get("pic") ?? "";
    const qOpd = searchParams.get("opdId") ?? "";
    const qPage = parseInt(searchParams.get("page") ?? "1", 10);

    setSearchNama((prev) => (prev === qNama ? prev : qNama));
    setKritikalitas((prev) => (prev === qKritikalitas ? prev : qKritikalitas));
    setJenisLisensi((prev) => (prev === qJenisLisensi ? prev : qJenisLisensi));
    setKategori((prev) => (prev === qKategori ? prev : qKategori));
    setStatus((prev) => (prev === qStatus ? prev : qStatus));
    setTahun((prev) => (prev === qTahun ? prev : qTahun));
    setPic((prev) => (prev === qPic ? prev : qPic));
    setOpdId((prev) => (prev === qOpd ? prev : qOpd));
    setPage((prev) => (prev === qPage ? prev : qPage));
  }, [searchParams]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedNama) params.set("q", debouncedNama);

    if (kritikalitas) params.set("kritikalitas", kritikalitas);
    if (jenisLisensi) params.set("jenisLisensi", jenisLisensi);
    if (kategori) params.set("kategori", kategori);
    if (status) params.set("status", status);
    if (tahun) params.set("tahun", tahun);
    if (pic) params.set("pic", pic);
    if (opdId) params.set("opdId", opdId);

    params.set("page", String(page || 1));
    params.set("limit", String(limit));

    return params.toString();
  }, [
    debouncedNama,
    jenisLisensi,
    kategori,
    kritikalitas,
    status,
    tahun,
    pic,
    opdId,
    page,
    limit,
  ]);

  useEffect(() => {
    const base = "/admin/manage-asset/opd-software";
    const newPath = queryString ? `${base}?${queryString}` : base;

    router.replace(newPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const fetchUrl = `/software${queryString ? `?${queryString}` : ""}`;
  const { data, error, isLoading, mutate } = useGet(fetchUrl);
  const { data: opdData } = useGet("/opd");
  const { data: kategoriData } = useGet("/software/kategori");
  const { del } = useDelete();

  const software: SoftwareRes[] = (data?.software as SoftwareRes[]) ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit,
    totalItems: 0,
    totalPages: 1,
  };
  const summary = data?.summary ?? { total: 0, aktif: 0, nonAktif: 0 };

  const tahunList = Array.from(
    new Set(
      software.map((sw) => (sw ? new Date(sw.tglPengadaan).getFullYear() : 0))
    )
  )
    .filter((y) => y !== 0)
    .sort((a, b) => b - a);

  useEffect(() => {
    setPage((cur) => (cur === 1 ? cur : 1));
  }, [debouncedNama, jenisLisensi, kategori, status, tahun, pic, opdId]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () =>
    setPage((p) => Math.min(pagination?.totalPages ?? 1, p + 1));

  const handleDelete = async (id: string) => {
    try {
      const res = await del(`/software/${id}`);
      console.log(res);

      notifier.success(
        "Berhasil",
        `Software ${res.data.nama} Berhasil Dihapus`
      );
      mutate();
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error("Gagal Menghapus Software", err.response?.data.message);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      {/* BACK */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Button>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Cpu className="w-6 h-6 sm:w-7 sm:h-7" /> Daftar Software
        </h1>

        <Link href="/admin/manage-asset/opd-software/add">
          <Button className="w-full sm:w-auto flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Tambah Software
          </Button>
        </Link>
      </div>

      {/* SUMMARY — responsive flex-wrap */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-md text-center">
          <div className="text-sm">Total</div>
          <div className="text-xl font-bold">{summary.total}</div>
        </div>
        <div className="bg-green-100 text-green-900 px-4 py-3 rounded-md text-center">
          <div className="text-sm">Aktif</div>
          <div className="text-xl font-bold">{summary.aktif}</div>
        </div>
        <div className="bg-red-100 text-red-900 px-4 py-3 rounded-md text-center">
          <div className="text-sm">Non-Aktif</div>
          <div className="text-xl font-bold">{summary.nonAktif}</div>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
        <Input
          placeholder="Cari software berdasarkan nama / nomor seri / no seri hardware terinstall ..."
          className="flex-1"
          value={searchNama}
          onChange={(e) => setSearchNama(e.target.value)}
        />

        <Button
          variant="outline"
          className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setOpenFilter(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* TABLE / CARD LIST — RESPONSIVE SWITCH */}
      <Card className="rounded-xl shadow-md overflow-hidden">
        {isLoading && (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-6 text-center">
            <div className="text-red-500 font-medium mb-2">
              Terjadi kesalahan saat memuat data
            </div>
            <Button onClick={() => mutate()} variant="outline">
              Coba Lagi
            </Button>
          </div>
        )}

        {!isLoading && !error && software.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            Tidak ada data ditemukan.
          </div>
        )}

        {!isLoading && !error && software.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table className="text-sm">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>Nama</TableHead>
                    <TableHead>Nomor Seri</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>OPD</TableHead>
                    <TableHead>Tanggal Pengadaan</TableHead>
                    <TableHead>Kritikalitas</TableHead>
                    <TableHead>Jenis Lisensi</TableHead>
                    <TableHead>No Seri Hardware Terinstall</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {software.map((sw) => (
                    <motion.tr
                      key={sw.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b hover:bg-gray-50"
                    >
                      <TableCell className="font-medium max-w-[180px] truncate">
                        {sw.nama}
                      </TableCell>

                      <TableCell className="max-w-[150px] truncate">
                        {sw.nomorSeri || "—"}
                      </TableCell>

                      <TableCell className="max-w-[150px] truncate">
                        {sw.kategoriSoftware?.nama || "—"}
                      </TableCell>

                      <TableCell className="max-w-[150px] truncate">
                        {sw.opd?.nama || "—"}
                      </TableCell>

                      <TableCell className="max-w-[150px] truncate">
                        {sw.tglPengadaan
                          ? new Date(sw.tglPengadaan).toLocaleDateString(
                              "id-ID"
                            )
                          : "—"}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            sw.kritikalitas === "TINGGI"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {sw.kritikalitas || "—"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge>{sw.jenisLisensi || "—"}</Badge>
                      </TableCell>

                      <TableCell className="max-w-[150px] truncate">
                        {sw.hardware?.nomorSeri || "—"}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            sw.status === "AKTIF"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sw.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Link
                            href={`/admin/manage-asset/opd-software/${sw.id}`}
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> View
                            </Button>
                          </Link>

                          <Link
                            href={`/admin/manage-asset/opd-software/${sw.id}/edit`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                            </Button>
                          </Link>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="cursor-pointer"
                              >
                                <Trash className="w-3.5 h-3.5 mr-1" /> Hapus
                              </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Hapus Software?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Data akan
                                  dipindahkan ke arsip (soft delete).
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(sw.id)}
                                  className="bg-red-600 hover:bg-red-700 cursor-pointer"
                                >
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden">
              <div className="divide-y divide-gray-200">
                {software.map((sw) => (
                  <motion.div
                    key={sw.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border-b"
                  >
                    <div className="font-semibold text-lg">{sw.nama}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {sw.nomorSeri ? `SN: ${sw.nomorSeri}` : "—"}
                    </div>

                    <div className="mt-2 space-y-1 text-sm">
                      <div>
                        <span className="font-medium">Kategori:</span>{" "}
                        {sw.kategoriSoftware?.nama || "—"}
                      </div>
                      <div>
                        <span className="font-medium">OPD:</span>{" "}
                        {sw.opd?.nama || "—"}
                      </div>
                      <div>
                        <span className="font-medium">PIC:</span>{" "}
                        {sw.pic || "—"}
                      </div>
                      <div>
                        <span className="font-medium">Tanggal:</span>{" "}
                        {sw.tglPengadaan
                          ? new Date(sw.tglPengadaan).toLocaleDateString(
                              "id-ID"
                            )
                          : "—"}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            sw.status === "AKTIF"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sw.status}
                        </span>
                      </div>
                    </div>

                    {/* Aksi — stacked buttons on mobile */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <Link href={`/admin/manage-asset/opd-software/${sw.id}`}>
                        <Button
                          variant="secondary"
                          className="w-full cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-1" /> Detail
                        </Button>
                      </Link>
                      <Link
                        href={`/admin/manage-asset/opd-software/${sw.id}/edit`}
                      >
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="w-full cursor-pointer"
                          >
                            <Trash className="w-4 h-4 mr-1" /> Hapus
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Hardware?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Data hardware
                              akan dipindahkan ke arsip (soft delete).
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(sw.id)}
                              className="bg-red-600 hover:bg-red-700 cursor-pointer"
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* PAGINATION — responsive stack on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <Button
          disabled={page <= 1}
          onClick={goPrev}
          className="w-full sm:w-auto"
        >
          Sebelumnya
        </Button>

        <div className="text-sm text-gray-600">
          Halaman {pagination?.page ?? 1} dari {pagination?.totalPages ?? 1}
        </div>

        <Button
          disabled={page >= (pagination?.totalPages ?? 1)}
          onClick={goNext}
          className="w-full sm:w-auto"
        >
          Selanjutnya
        </Button>
      </div>

      {/* FILTER MODAL — responsive inner spacing */}
      <Dialog open={openFilter} onOpenChange={setOpenFilter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Hardware</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Select value={kritikalitas} onValueChange={setKritikalitas}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Jenis Lisensi" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value={"TINGGI"}>TINGGI</SelectItem>
                <SelectItem value={"SEDANG"}>SEDANG</SelectItem>
                <SelectItem value={"RENDAH"}>RENDAH</SelectItem>
              </SelectContent>
            </Select>

            <Select value={jenisLisensi} onValueChange={setJenisLisensi}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Jenis Lisensi" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value={"LANGGANAN"}>LANGGANAN</SelectItem>
                <SelectItem value={"OPEN_SOURCE"}>OPEN SOURCE</SelectItem>
                <SelectItem value={"PERPETUAL"}>PERPETUAL</SelectItem>
              </SelectContent>
            </Select>

            <Select value={kategori} onValueChange={setKategori}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Semua Kategori</SelectItem>

                {kategoriData?.map((item: KategoriHardware) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="PIC..."
              value={pic}
              onChange={(e) => setPic(e.target.value)}
            />

            <Select value={opdId} onValueChange={setOpdId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih OPD" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Semua OPD</SelectItem>

                {opdData?.map((item: Opd) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <select
              className="w-full border rounded-md px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="AKTIF">AKTIF</option>
              <option value="NON_AKTIF">NON_AKTIF</option>
            </select>

            <select
              className="w-full border rounded-md px-3 py-2"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
            >
              <option value="">Semua Tahun</option>
              {tahunList.map((t) => (
                <option key={t} value={t.toString()}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenFilter(false)}>
              Tutup
            </Button>
            <Button onClick={() => setOpenFilter(false)}>Terapkan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
