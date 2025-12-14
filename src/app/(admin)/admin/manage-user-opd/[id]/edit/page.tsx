"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { useEffect } from "react";

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
import { AlertCircle } from "lucide-react";

export default function EditUserPage() {
  const { id } = useParams();

  const router = useRouter();

  const { data: opdList, isLoading: opdLoading } = useGet("/opd");
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    mutate,
  } = useGet(`/user-opd/${id}`);

  const { patch, loading: patchLoading } = usePatch(`/user-opd/${id}`);

  // ✅ useForm dengan defaultValues kosong — biarkan reset() yang isi nanti
  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      email: "",
      name: "",
      idOpd: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user?.email,
        name: user?.name,
        idOpd: user?.idOpd,
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof userUpdateSchema>) => {
    try {
      const res = await patch(values);
      notifier.success(
        "Berhasil Update User OPD",
        `User ${res.data.name} berhasil diupdate !!!..`
      );
      mutate();
      router.push("/admin/manage-user-opd");
      form.reset();
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      notifier.error("Gagal Mengedit User", err.response?.data?.message);
    }
  };

  // Loading state
  if (userLoading)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="my-auto px-6 space-y-6"
      >
        {/* Header skeleton */}
        <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />

        {/* Form skeleton */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />{" "}
            {/* Label */}
            <div className="h-12 bg-gray-200 rounded animate-pulse" />{" "}
            {/* Input */}
          </div>
        ))}

        {/* Buttons skeleton */}
        <div className="flex gap-4 mt-6">
          <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </motion.div>
    );

  if (userError)
    return (
      <div className="w-1/2 mx-auto mt-20 p-6 border rounded-lg shadow-md bg-red-50 flex items-center justify-center gap-4 ">
        <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
        <div className="flex flex-col justify-center items-center gap-1">
          <h2 className="font-semibold text-red-800 text-lg">
            Pengguna tidak ditemukan
          </h2>
          <p className="text-red-700 text-sm">
            Maaf, data pengguna yang Anda cari tidak tersedia.
          </p>
          <Button onClick={() => router.back()} className="cursor-pointer mt-2">
            Kembali
          </Button>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="my-auto px-6 space-y-16"
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
                value={field.value || ""}
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
                value={field.value || ""}
              />
              <FieldDescription>Nama lengkap pengguna.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {!userLoading && user && !opdLoading && opdList.length > 0 && (
          <Controller
            name="idOpd"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>OPD</FieldLabel>
                <Select
                  key={field.value}
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih OPD" />
                  </SelectTrigger>
                  <SelectContent>
                    {opdList.map((opd: Opd) => (
                      <SelectItem key={opd.id} value={opd.id}>
                        {opd.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        {/* Buttons */}
        <div className="mt-12 flex justify-end gap-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
            disabled={patchLoading}
            className="cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={patchLoading}
            className="cursor-pointer"
          >
            {patchLoading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
