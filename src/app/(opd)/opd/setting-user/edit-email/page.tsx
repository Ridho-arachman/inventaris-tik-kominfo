"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { UserUpdateEmailSchema } from "@/schema/authSchema";
import { useGet, usePatch } from "@/hooks/useApi";
import { notifier } from "@/components/ToastNotifier";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export default function ChangeEmailPage() {
  const router = useRouter();
  const { loading, patch } = usePatch("/auth/change-email");
  const { data } = useGet("/list-user");

  const form = useForm<z.infer<typeof UserUpdateEmailSchema>>({
    resolver: zodResolver(UserUpdateEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        email: data.email,
      });
    }
  }, [data, form]);

  const onSubmit = async (data: z.infer<typeof UserUpdateEmailSchema>) => {
    try {
      const res = await patch(data);
      notifier.success(
        "Berhasil",
        `Verifikasi ganti email telah dikirim ke ${res.data.email}`
      );
      router.back();
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error(
        "Gagal",
        err.response?.data.message || "Terjadi kesalahan"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen px-6 py-10"
    >
      {/* BACK */}
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
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-xl">Ganti Email</CardTitle>
          </div>
          <CardDescription>
            Mengubah email akan memerlukan verifikasi ulang.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* WARNING */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800"
          >
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
            <p>
              Setelah email diubah, akun Anda harus melakukan{" "}
              <span className="font-semibold">verifikasi ulang</span>.
            </p>
          </motion.div>

          {/* FORM */}
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email Baru</FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    value={field.value}
                    aria-invalid={fieldState.invalid}
                    placeholder="email@kominfo.go.id"
                    autoComplete="off"
                  />

                  <FieldDescription>
                    Email ini akan digunakan sebagai akun login baru.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ALERT DIALOG */}
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      type="button"
                      className="bg-orange-600 hover:bg-orange-700 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Spinner />
                          Loading ...
                        </>
                      ) : (
                        "Kirim Verifikasi"
                      )}
                    </Button>
                  </motion.div>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Ganti Email</AlertDialogTitle>
                    <AlertDialogDescription>
                      Email akan diubah dan Anda harus melakukan verifikasi
                      ulang. Pastikan email sudah benar.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => form.handleSubmit(onSubmit)()}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Ya, Kirim Verifikasi
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
