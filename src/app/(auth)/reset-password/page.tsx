"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { usePost } from "@/hooks/useApi";
import { notifier } from "@/components/ToastNotifier";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { PasswordResetSchema } from "@/schema/authSchema";

type ResetPasswordForm = z.infer<typeof PasswordResetSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { post, loading } = usePost(`/auth/reset-password?token=${token}`);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordForm) => {
    if (!token) {
      notifier.error(
        "Token tidak valid",
        "Silakan request ulang reset password"
      );
      return;
    }

    try {
      await post(values);

      notifier.success("Berhasil", "Password berhasil direset");

      router.replace("/login");
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      console.log(err);

      notifier.error(
        "Gagal",
        err?.response?.data?.message ||
          "Token tidak valid atau sudah kedaluwarsa"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Buat Password Baru</CardTitle>
          <CardDescription>
            Masukkan password baru untuk akun Anda
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* PASSWORD BARU */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password Baru</FieldLabel>
                  <div className="flex items-center gap-3">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password baru"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-0 w-10 h-10"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* KONFIRMASI PASSWORD */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Konfirmasi Password</FieldLabel>
                  <div className="flex items-center gap-3">
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Ulangi password"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="p-0 w-10 h-10"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Reset Password"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full flex items-center gap-2"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
