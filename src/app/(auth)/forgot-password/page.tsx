"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { usePost } from "@/hooks/useApi";
import { notifier } from "@/components/ToastNotifier";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AxiosError } from "axios";
import { ApiError } from "@/types/ApiError";
import { EmailSchema } from "@/schema/authSchema";

type ForgotPasswordForm = z.infer<typeof EmailSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { post, loading } = usePost("/auth/request-password-reset");

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordForm) => {
    try {
      await post(values);

      notifier.success(
        "Email terkirim",
        "Link reset password telah dikirim ke email Anda"
      );

      form.reset();
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      notifier.error(
        "Gagal",
        err?.response?.data?.message || "Terjadi kesalahan"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full sm:max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Masukkan email Anda untuk menerima link reset password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="contoh@email.com"
                    aria-invalid={fieldState.invalid}
                  />
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
              {loading ? "Mengirim..." : "Kirim Link Reset"}
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
