"use client";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";

import { usePost } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notifier } from "@/components/ToastNotifier";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { OpdCreateSchema } from "@/schema/opdSchema";

type FormValues = z.infer<typeof OpdCreateSchema>;

export default function AddOPDPage() {
  const router = useRouter();
  const { post } = usePost("/opd");

  const form = useForm<FormValues>({
    resolver: zodResolver(OpdCreateSchema),
    defaultValues: {
      kode: "",
      nama: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const res = await post(values);
      router.push("/admin/manage-opd");
      notifier.success("Berhasil", `OPD ${res.data.nama} berhasil ditambahkan`);
    } catch (error) {
      const err = error as AxiosError<ApiError>;

      notifier.error(
        "Gagal Menambahkan OPD",
        `Gagal menambahkan OPD ${err.response?.data.message}`
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* HEADER */}
      <header className="border-b py-6 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/admin/manage-opd">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Tambah OPD</h1>
        </div>
      </header>

      {/* CONTENT */}
      <main className="px-4 sm:px-8 py-10">
        <div className="max-w-3xl mx-auto space-y-10">
          <p className="text-base text-muted-foreground">
            Tambahkan data Organisasi Perangkat Daerah (OPD) baru. Pastikan kode
            dan nama OPD sesuai dengan data resmi.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* KODE OPD */}
            <Controller
              name="kode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Kode OPD</FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: DINSOS"
                    autoComplete="off"
                  />

                  <FieldDescription>
                    Masukkan kode unik OPD, biasanya berupa singkatan.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* NAMA OPD */}
            <Controller
              name="nama"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nama OPD</FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Contoh: Dinas Sosial"
                    autoComplete="off"
                  />

                  <FieldDescription>
                    Masukkan nama lengkap OPD sesuai dokumen resmi.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto cursor-pointer"
            >
              Simpan OPD
            </Button>
          </form>
        </div>
      </main>
    </motion.div>
  );
}
