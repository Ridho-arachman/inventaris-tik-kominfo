"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useGet, usePut } from "@/hooks/useApi";
import { Skeleton } from "@/components/ui/skeleton";
import { notifier } from "@/components/ToastNotifier";
import { OpdCreateSchema } from "@/schema/opdSchema";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";

type OPDForm = z.infer<typeof OpdCreateSchema>;

export default function EditOPDPage() {
  const { id } = useParams();
  const router = useRouter();

  // GET DATA
  const { data: opd, isLoading } = useGet(`/opd/${id}`);

  const { put, loading } = usePut(`/opd/${id}`);

  const form = useForm<OPDForm>({
    resolver: zodResolver(OpdCreateSchema),
    values: opd ? { kode: opd.kode, nama: opd.nama } : { kode: "", nama: "" },
  });

  const onSubmit = async (data: OPDForm) => {
    try {
      await put(data);
      notifier.success("Berhasil", "OPD berhasil diperbarui");
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
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-8"
      >
        Edit OPD
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto space-y-6"
      >
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Kode */}
            <div>
              <label className="block text-sm font-medium">Kode OPD</label>
              <Input {...form.register("kode")} autoComplete="off" />

              {form.formState.errors.kode && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.kode.message}
                </p>
              )}
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium">Nama OPD</label>
              <Input {...form.register("nama")} autoComplete="off" />

              {form.formState.errors.nama && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.nama.message}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-3">
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>

              <Button
                type="button"
                className="cursor-pointer"
                onClick={() => router.back()}
              >
                Batal
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
