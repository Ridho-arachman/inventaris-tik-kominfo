"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schema/authSchema";
import { usePost } from "@/hooks/useApi";
import { notifier } from "./ToastNotifier";
import { AxiosError } from "axios";

// Lucide Icons
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/ApiError";
import { Checkbox } from "./ui/checkbox";
import { Spinner } from "./ui/spinner";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const { post, loading } = usePost("/auth/sign-in");
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const res = await post(data);
      console.log(res);

      notifier.success(
        res.message,
        `Selamat datang, ${res.data.user.name}!!!..`
      );

      if (res.data.user.role === "OPD") router.push("/opd");
      if (res.data.user.role === "ADMIN") router.push("/admin");
    } catch (error) {
      console.log(error);

      const err = error as AxiosError<ApiError>;
      notifier.error("Login Gagal", err.response?.data.message);
    }
  };

  return (
    <Card className="sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Login dengan Email dan Password Anda</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="flex flex-col gap-3">
            {/* EMAIL */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    placeholder="Masukkan Email Anda ...."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* PASSWORD */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <div className="flex items-center gap-3">
                    <Input
                      {...field}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan Password Anda ...."
                      aria-invalid={fieldState.invalid}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-0 w-10 h-10 flex items-center justify-center cursor-pointer"
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

            {/* REMEMBER ME + FORGOT PASSWORD */}
            <div className="flex items-center justify-between mb-4">
              <Controller
                name="rememberMe"
                control={form.control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      className="w-4 h-4 shrink-0 cursor-pointer"
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-semibold cursor-pointer"
                    >
                      Remember Me
                    </label>
                  </div>
                )}
              />

              {/* FORGOT PASSWORD */}
              <Link
                href="/forgot-password"
                className="text-sm font-medium  hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Field>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner /> <span>Loading...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
