"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { useDelete, useGet } from "@/hooks/useApi";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
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
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";

export default function HardwareDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: hardware, error, isLoading } = useGet(`/hardware/${id}`);
  const { del } = useDelete();

  const handleDelete = async (id: string) => {
    try {
      const res = await del(`/hardware/${id}`);
      notifier.success("Berhasil", `Hardware ${res.data.nama} telah dihapus`);
      router.push("/admin/manage-asset/opd-hardware");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error(
        "Gagal",
        `Gagal menghapus hardware: ${err.response?.data.message || err.message}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero / Header Skeleton */}
        <div className="relative bg-white shadow-md animate-pulse">
          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-4">
            {/* Back Button Skeleton */}
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            {/* Title Skeleton */}
            <div className="h-12 w-1/2 bg-gray-200 rounded"></div>
            {/* Tags / Info Skeleton */}
            <div className="flex gap-4">
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              <div className="h-6 w-28 bg-gray-200 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
          {/* Image Skeleton */}
          <div className="w-full h-64 bg-gray-200"></div>
        </div>

        {/* Content Section Skeleton */}
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Spesifikasi Skeleton */}
          <div className="mb-10">
            <div className="h-8 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>

          {/* Detail Info Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded-lg shadow-sm"
              ></div>
            ))}
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hardware) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-600 text-lg">Gagal memuat data hardware.</p>
        <p className="text-gray-500 text-sm">
          Silakan coba muat ulang halaman atau periksa koneksi internet Anda.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Hero / Header */}
      <div className="relative bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link
            href="/admin/manage-asset/opd-hardware"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <h1 className="text-5xl font-bold mb-2">{hardware?.nama || "-"}</h1>
          <div className="flex flex-wrap gap-4 text-gray-500">
            <span>Kategori: {hardware?.kategoriHardware?.nama || "-"}</span>
            <span>OPD: {hardware?.opd?.nama || "-"}</span>
            <span>
              Status:{" "}
              <span
                className={`ml-1 px-2 py-1 rounded ${
                  hardware?.status === "AKTIF"
                    ? "bg-green-100 text-green-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                {hardware?.status || "-"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Spesifikasi */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Spesifikasi</h2>
          <p className="text-gray-700">{hardware?.spesifikasi || "-"}</p>
        </div>

        {/* Detail Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <DetailItem label="Merk" value={hardware?.merk} />
          <DetailItem label="PIC" value={hardware?.pic} />
          <DetailItem label="Lokasi Fisik" value={hardware?.lokasiFisik} />
          <DetailItem label="Nomor Seri" value={hardware?.nomorSeri} />
          <DetailItem label="Sumber" value={hardware?.sumber} />
          <DetailItem label="Penyedia" value={hardware?.penyedia} />
          <DetailItem
            label="Biaya Perolehan"
            value={
              hardware?.biayaPerolehan
                ? new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(hardware?.biayaPerolehan)
                : "-"
            }
          />
          <DetailItem
            label="Tanggal Pengadaan"
            value={
              hardware?.tglPengadaan
                ? new Date(hardware.tglPengadaan).toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })
                : "-"
            }
          />
          <DetailItem
            label="Garansi Mulai"
            value={
              hardware?.garansiMulai
                ? new Date(hardware?.garansiMulai).toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })
                : "-"
            }
          />
          <DetailItem
            label="Garansi Selesai"
            value={
              hardware?.garansiSelesai
                ? new Date(hardware.garansiSelesai).toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })
                : "-"
            }
          />
          <DetailItem label="Dibuat Oleh" value={hardware?.creator?.name} />
          <DetailItem label="Diubah Oleh" value={hardware?.updater?.name} />
          <DetailItem
            label="Tanggal Dibuat"
            value={new Date(hardware?.createdAt).toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
          <DetailItem
            label="Tanggal Diubah"
            value={new Date(hardware?.updatedAt).toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          />
        </div>

        {/* Aksi */}
        <div className="flex gap-4">
          <Link href={`/admin/manage-asset/opd-hardware/${hardware.id}/edit`}>
            <Button variant="outline" className="gap-2 cursor-pointer">
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2 cursor-pointer">
                <Trash className="w-4 h-4" />
                Hapus
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Data Hardware</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Data hardware akan
                  dihapus secara permanen dari sistem.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 cursor-pointer"
                  onClick={() => handleDelete(hardware.id)}
                >
                  Ya, Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DetailItem({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-sm">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}
