"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { useGet, usePut } from "@/hooks/useApi";
import { notifier } from "@/components/ToastNotifier";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { useEffect } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Skeleton } from "@/components/ui/skeleton";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { kategoriSoftwareSchema } from "@/schema/ketegoriSoftwareSchema";

export default function EditKategoriHardwarePageUI() {
  const router = useRouter();
  const { id } = useParams();

  const { data, isLoading, error } = useGet(`/software/kategori/${id}`);
  const { loading, put } = usePut(`/software/kategori/${id}`);

  const form = useForm<z.infer<typeof kategoriSoftwareSchema>>({
    resolver: zodResolver(kategoriSoftwareSchema),
    defaultValues: { nama: "" }, // aman dulu
  });

  // ⬅ setelah data masuk, reset form
  useEffect(() => {
    if (data?.nama) {
      form.reset({ nama: data.nama });
    }
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof kategoriSoftwareSchema>) => {
    try {
      const res = await put(values);

      notifier.success(
        "Berhasil Diupdate",
        `Kategori Hardware ${res.data.nama} berhasil diperbarui`
      );

      router.refresh();
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error("Gagal Diupdate", err.response?.data?.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <Skeleton className="h-10 w-64 mb-8 rounded-lg" />

        <Card className="w-full max-w-xl shadow-md border border-gray-200 p-6 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-40" />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center p-6"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Edit Kategori Software
      </h1>

      {error && (
        <div className="w-full max-w-xl mx-auto p-6 border border-red-300 rounded-lg bg-red-50 text-red-700 text-center space-y-3 shadow-sm">
          <p className="font-semibold text-lg">Gagal memuat data</p>
          <p className="text-sm">
            {error.response?.data?.message || "Terjadi kesalahan pada server"}
          </p>

          <Button variant="outline" onClick={() => router.back()}>
            Kembali
          </Button>
        </div>
      )}

      {!error && (
        <Card className="w-full max-w-xl shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-center">Edit Kategori</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <Controller
                name="nama"
                control={form.control}
                rules={{ required: "Nama kategori wajib diisi" }}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nama Kategori</FieldLabel>

                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan nama kategori"
                      autoComplete="off"
                    />

                    <FieldDescription>
                      Masukkan nama kategori software.
                    </FieldDescription>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="flex items-center justify-center gap-3 pt-4 border-t">
                <Link href={"/admin/manage-kategori-asset/software"}>
                  <Button variant="outline" className="cursor-pointer">
                    <MoveLeft />
                    Kembali
                  </Button>
                </Link>

                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
