"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { usePost } from "@/hooks/useApi";
import { notifier } from "@/components/ToastNotifier";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { kategoriSoftwareSchema } from "@/schema/ketegoriSoftwareSchema";

export default function EditKategoriHardwarePageUI() {
  const router = useRouter();

  const { loading, post } = usePost(`/software/kategori`);

  const form = useForm<z.infer<typeof kategoriSoftwareSchema>>({
    resolver: zodResolver(kategoriSoftwareSchema),
    defaultValues: { nama: "" },
  });

  const onSubmit = async (values: z.infer<typeof kategoriSoftwareSchema>) => {
    try {
      const res = await post(values);

      notifier.success(
        "Berhasil Diupdate",
        `Kategori Software ${res.data.nama} Berhasil Diperbarui`
      );

      router.push("/admin/manage-kategori-asset/software");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error("Gagal Diupdate", err.response?.data?.message);
    }
  };

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
    </motion.div>
  );
}
