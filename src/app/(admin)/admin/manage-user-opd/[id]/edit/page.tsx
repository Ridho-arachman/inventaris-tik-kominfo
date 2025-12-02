"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePatch, useGet } from "@/hooks/useApi";
import { Opd } from "@/generated/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema } from "@/schema/userOpdSchema";
import z from "zod";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { notifier } from "@/components/ToastNotifier";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  // Fetch data user & daftar OPD
  const {
    data: user,
    isLoading: userLoading,
    mutate,
  } = useGet(`/user-opd/${id}`);
  const { data: opdList = [], isLoading: opdLoading } = useGet("/opd");
  const { patch, loading: patchLoading } = usePatch(`/user-opd/${id}`);

  // ✅ useForm dengan defaultValues kosong — biarkan reset() yang isi nanti
  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: useMemo(
      () => ({
        email: user?.email ?? "",
        name: user?.name ?? "",
        idOpd: user?.idOpd,
      }),
      [user]
    ),
  });

  const onSubmit = async (values: z.infer<typeof userUpdateSchema>) => {
    try {
      const res = await patch(values);
      notifier.success(
        "Berhasil Update User OPD",
        `User ${res.data.name} berhasil diupdate !!!..`
      );
      mutate();
      router.refresh();
      form.reset();
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      notifier.error("Gagal Mengedit User", err.response?.data?.message);
    }
  };

  // Loading state
  if (userLoading)
    return <p className="text-center py-10">Memuat data pengguna...</p>;
  if (!user)
    return <p className="text-center py-10">Pengguna tidak ditemukan.</p>;

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto py-14 px-6"
    >
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          Edit Pengguna
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Perbarui data pengguna di bawah ini. Pastikan informasi sudah benar.
        </p>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Masukkan email"
                disabled={patchLoading}
              />
              <FieldDescription>Masukkan email pengguna.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Nama */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Masukkan nama"
                disabled={patchLoading}
              />
              <FieldDescription>Nama lengkap pengguna.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* OPD */}
        {/* OPD */}
        <Controller
          name="idOpd"
          control={form.control}
          render={({ field }) => {
            console.log(
              "field.value:",
              field.value,
              "typeof:",
              typeof field.value
            );
            return (
              <Field>
                <FieldLabel>OPD</FieldLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={opdLoading || patchLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih OPD">
                      {field.value
                        ? opdList.find((opd: Opd) => opd.id === field.value)
                            ?.nama ||
                          user?.opd?.nama ||
                          `OPD (${field.value})`
                        : "Pilih OPD"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {opdLoading ? (
                      <SelectItem value="" disabled>
                        Memuat OPD...
                      </SelectItem>
                    ) : opdList.length === 0 ? (
                      <SelectItem value="" disabled>
                        Tidak ada OPD tersedia
                      </SelectItem>
                    ) : (
                      opdList.map((opd: Opd) => (
                        <SelectItem key={opd.id} value={opd.id}>
                          {opd.nama}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />

        {/* Buttons */}
        <div className="mt-12 flex justify-end gap-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => window.history.back()}
            disabled={patchLoading}
          >
            Batal
          </Button>
          <Button type="submit" disabled={patchLoading}>
            {patchLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
