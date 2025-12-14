"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { motion } from "framer-motion";
import { usePost, useGet } from "@/hooks/useApi";
import { useRouter } from "next/navigation";

import { Opd } from "@/generated/client";
import { notifier } from "@/components/ToastNotifier";
import { userCreateSchema } from "@/schema/userOpdSchema";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { Separator } from "@/components/ui/separator";

export default function AddUserPage() {
  const router = useRouter();

  const { post, loading } = usePost("/user-opd");
  const { data: opdList, isLoading } = useGet("/opd");

  const form = useForm<z.infer<typeof userCreateSchema>>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      idOpd: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof userCreateSchema>) => {
    try {
      const res = await post(values);

      notifier.success(
        "Berhasil",
        `User ${res.data.name} berhasil ditambahkan`
      );

      router.push("/admin/manage-user-opd");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      if (err.response?.status === 409) {
        notifier.error("Terjadi Kesalahan", "Email sudah terdaftar");
      }

      if (err.response?.status === 400) {
        notifier.error("Bad Request", err.response?.data?.message);
      }
    }
  };

  if (isLoading)
    return (
      <div className="px-6 py-10 space-y-8" key="loading-skeleton">
        {/* Header skeleton */}
        <div className="h-10 w-1/3 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>

        <Separator className="my-6" />

        {/* Form skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            {/* Label skeleton */}
            <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
            {/* Input skeleton */}
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}

        {/* Select skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Button skeleton */}
        <div className="flex gap-4 mt-4">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );

  return (
    <motion.div
      className="min-h-screen px-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Tambah User OPD</h1>
      </header>

      <motion.form
        className="max-w-4xl w-full mx-auto space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Nama */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
              <Input {...field} id={field.name} placeholder="Nama OPD" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
                type="email"
                placeholder="Email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="Password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="password"
                placeholder="Confirm Password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* OPD */}
        <Controller
          name="idOpd"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>OPD</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="mt-12 flex justify-end gap-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="cursor-pointer"
          >
            Kembali
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Tambah User"}
          </Button>
        </div>
      </motion.form>
    </motion.div>
  );
}
