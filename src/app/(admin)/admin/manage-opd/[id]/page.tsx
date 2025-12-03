"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { notifier } from "@/components/ToastNotifier";
import { useDelete, useGet } from "@/hooks/useApi";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { Skeleton } from "@/components/ui/skeleton";

export default function OPDDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: opd, error, isLoading } = useGet(`/opd/${id}`);
  const { del, loading } = useDelete();

  const handleDelete = async () => {
    try {
      await del(`/opd/${id}`);
      notifier.success("Berhasil", "OPD berhasil dihapus");
      router.push("/admin/manage-opd");
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      notifier.error(
        "Gagal Menghapus OPD",
        axiosErr.response?.data?.message || "Terjadi kesalahan"
      );
    }
  };

  return (
    <div className="min-h-screen px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4 mb-10"
      >
        <Link href="/admin/manage-opd">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
        </Link>

        <h1 className="text-3xl font-bold">Detail OPD</h1>
      </motion.div>

      {/* Content Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-sm border p-8"
      >
        {/* Title Section */}
        <div className="mb-8">
          {isLoading ? (
            <>
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-40 mt-3" />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">{opd?.nama}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Kode OPD: <span className="font-medium">{opd?.kode}</span>
              </p>
            </>
          )}
        </div>

        <div className="border-t pt-6 space-y-6">
          {/* Detail Data */}
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/5" />
            </>
          ) : error ? (
            <p className="text-red-500">Gagal memuat data OPD.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dibuat Pada
                </p>
                <p className="font-medium">
                  {new Date(opd?.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Terakhir Diperbarui
                </p>
                <p className="font-medium">
                  {new Date(opd?.updatedAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isLoading && opd && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href={`/admin/manage-opd/${opd.id}/edit`}>
              <Button className="w-full flex items-center gap-2 cursor-pointer">
                <Pencil className="w-4 h-4" />
                Edit OPD
              </Button>
            </Link>

            <Button
              className="w-full flex items-center gap-2 cursor-pointer"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash className="w-4 h-4" />
              {loading ? "Menghapus..." : "Hapus OPD"}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
