import { auth } from "@/lib/auth";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import { NextRequest } from "next/server";
import z from "zod";

// Validasi body request
const signUpSchema = z
  .object({
    name: z
      .string("Nama wajib diisi")
      .trim()
      .min(3, "Nama minimal 3 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    email: z
      .string("Email wajib diisi")
      .trim()
      .email("Format email tidak valid"),
    password: z
      .string("Password wajib diisi")
      .trim()
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-z]/, "Password harus mengandung huruf kecil")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung angka")
      .regex(/[^a-zA-Z0-9]/, "Password harus mengandung simbol"),
    confirmPassword: z.string("Confirm Password wajib diisi").trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama",
  });

export const POST = async (req: NextRequest) => {
  try {
    // Ambil dan validasi body
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) return handleZodValidation(parsed);

    const { name, email, password } = parsed.data;

    // Panggil Better Auth untuk signup
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: "https://example.com/callback", // redirect setelah verifikasi
      },
    });

    return handleResponse({
      success: true,
      message: "Signup Berhasil",
      data: result,
    });
  } catch (error) {
    // Better Auth Handler
    const betterAuthErr = handleBetterAuthError(error);
    if (betterAuthErr) {
      return handleResponse({
        success: false,
        message: betterAuthErr.message,
        status: betterAuthErr.status,
      });
    }

    // Error Internal Server
    return handleResponse({
      success: false,
      message: "Terjadi error pada server",
      status: 500,
    });
  }
};
