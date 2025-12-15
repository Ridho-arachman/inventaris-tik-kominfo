"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useGet, usePatch } from "@/hooks/useApi";
import { Controller, useForm } from "react-hook-form";
import { userUpdateNameSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { notifier } from "@/components/ToastNotifier";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: user, error, isLoading } = useGet("/list-user");
  const { loading, patch } = usePatch("/auth/change-name");

  const form = useForm<z.infer<typeof userUpdateNameSchema>>({
    resolver: zodResolver(userUpdateNameSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof userUpdateNameSchema>) => {
    try {
      await patch(data);
      notifier.success(
        "Berhasil",
        `Nama Admin Telah Berubah Menjadi ${user.name}`
      );
      router.back();
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error(err.response?.data.message || "Terjadi kesalahan");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen px-6 py-10 "
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
      </motion.div>
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Profil Admin</CardTitle>
          <CardDescription>
            Perbarui informasi dasar akun administrator.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading && (
            <CardContent className="space-y-6">
              {/* Title */}
              <Skeleton className="h-6 w-48" />

              {/* Input */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              {/* Button */}
              <div className="flex justify-end">
                <Skeleton className="h-9 w-36 rounded-md" />
              </div>
            </CardContent>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Terjadi Kesalahan</p>
                <p className="text-sm text-muted-foreground">
                  {error.message || "Gagal memuat data."}
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <motion.form
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      value={field.value}
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan nama admin baru ..."
                      autoComplete="off"
                    />
                    <FieldDescription></FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="flex justify-end">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner /> <span>Menyimpan...</span>
                      </>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
