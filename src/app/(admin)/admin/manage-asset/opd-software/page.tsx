"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useGet } from "@/hooks/useApi";
import { Opd } from "@/generated/client";
import { Skeleton } from "@/components/ui/skeleton";

import { PackageX, X, ArrowLeft } from "lucide-react";

import { useDebounce } from "use-debounce";

export default function OPDListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";

  const [searchValue, setSearchValue] = React.useState(q);
  const [debounced] = useDebounce(searchValue, 400);

  const paramsString = React.useMemo(
    () => searchParams.toString(),
    [searchParams]
  );

  React.useEffect(() => {
    const newParams = new URLSearchParams(paramsString);

    if (debounced) newParams.set("q", debounced);
    else newParams.delete("q");

    router.push(`/admin/manage-asset/opd-software?${newParams.toString()}`);
  }, [debounced, paramsString, router]);

  const { data: opdList = [], isLoading, error } = useGet(`/opd?q=${q}`);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  return (
    <div className="min-h-screen px-6 py-10">
      {/* Tombol Kembali */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm mb-4 text-gray-600 hover:text-black transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        Daftar OPD
      </motion.h1>

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="w-full sm:w-1/2 relative">
          <Input
            placeholder="Cari OPD..."
            value={searchValue}
            onChange={handleSearch}
            className="pr-10"
          />

          {searchValue !== "" && (
            <button
              onClick={() => setSearchValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center text-center p-10">
          <PackageX className="w-20 h-20 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Tidak ditemukan
          </h2>
          <p className="text-gray-500 max-w-sm">
            Data OPD tidak tersedia atau tidak sesuai pencarian.
          </p>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}

        {!isLoading &&
          opdList.map((opd: Opd, idx: number) => (
            <motion.div
              key={opd.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow relative">
                <Link href={`/admin/manage-asset/opd-software/${opd.id}`}>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {opd.nama}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Kode OPD</p>
                      <p className="font-medium">{opd.kode}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Dibuat Pada</p>
                      <p className="font-medium">
                        {new Date(opd.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Terakhir Diperbarui
                      </p>
                      <p className="font-medium">
                        {new Date(opd.updatedAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
