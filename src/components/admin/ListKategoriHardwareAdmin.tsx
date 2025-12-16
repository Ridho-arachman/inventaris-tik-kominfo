"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KategoriHardware } from "@/generated/client";
import { useDelete, useGet } from "@/hooks/useApi";
import { motion } from "framer-motion";
import { Pencil, Trash, ArrowLeft, Plus, Search, PackageX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notifier } from "@/components/ToastNotifier";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function KategoriHardwareListComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Ambil query dari URL saat page dibuka
  const initialQ = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(initialQ);

  // debounce untuk API
  const [debounced] = useDebounce(search, 400);

  // Fetch data
  const {
    data: kategoriHardwareData,
    isLoading,
    error,
    mutate,
  } = useGet(`/hardware/kategori?q=${debounced}`);

  const { del, loading } = useDelete();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debounced) {
      params.set("q", debounced);
    } else {
      params.delete("q");
    }

    router.replace(`${pathname}?${params.toString()}`);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      const res = await del(`/hardware/kategori/${id}`);
      notifier.success(
        "Berhasil",
        `Kategori hardware ${res.data.nama} berhasil dihapus`
      );
      mutate(`/hardware/kategori?q=${debounced}`);
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error(
        "Gagal Menghapus Kategori Hardware",
        err.response?.data.message
      );
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kategori Hardware</h1>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/manage-kategori-asset">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali
            </Link>
          </Button>

          <Button asChild>
            <Link href="/admin/manage-kategori-asset/hardware/add">
              <Plus className="w-4 h-4 mr-1" />
              Tambah Kategori Hardware
            </Link>
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-8 flex items-center gap-3 max-w-md">
        <div className="relative w-full">
          {/* Icon search */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kategori hardware..."
            className="pl-10 pr-10"
          />

          {/* Tombol CLEAR (X) */}
          {search !== "" && (
            <Button
              variant={"ghost"}
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* SKELETON */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="shadow-md border border-gray-200 p-4 space-y-4"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-4 border-t flex justify-end gap-3">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {error && (
        <div className="flex flex-col items-center justify-center text-center p-10">
          <PackageX className="w-20 h-20 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Tidak ditemukan
          </h2>
          <p className="text-gray-500 max-w-sm">
            Data kategori hardware tidak tersedia atau tidak sesuai pencarian.
          </p>
        </div>
      )}

      {/* LIST */}
      {!error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kategoriHardwareData?.map(
            (kategori: KategoriHardware, index: number) => (
              <motion.div
                key={kategori.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-all border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {kategori.nama}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3">
                    <p className="text-gray-500 text-sm">
                      ID: <span className="font-mono">{kategori.id}</span>
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex items-center gap-1"
                      >
                        <Link
                          href={`/admin/manage-kategori-asset/hardware/${kategori.id}`}
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </Link>
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDelete(kategori.id)}
                        disabled={loading}
                      >
                        <Trash className="w-4 h-4" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </div>
      )}
    </div>
  );
}
