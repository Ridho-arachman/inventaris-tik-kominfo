import { auth } from "@/lib/auth";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { signInSchema } from "@/schema/authSchema";
import { NextRequest } from "next/server";

interface UserWithRole {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

export const POST = async (req: NextRequest) => {
  try {
    // Ambil dan validasi body
    const body = await req.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) return handleZodValidation(parsed);

    const { email, password } = parsed.data;

    // Panggil Better Auth untuk signup
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "https://example.com/callback", // redirect setelah verifikasi
        rememberMe: true,
      },
    });

    const roleRecord = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    const userRole = roleRecord?.role;

    return handleResponse({
      success: true,
      message: "Login Berhasil",
      data: {
        ...result,
        user: {
          ...result.user,
          role: userRole, // default
        } as UserWithRole,
      },
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
