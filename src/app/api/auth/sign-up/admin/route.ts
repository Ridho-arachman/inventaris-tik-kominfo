import { auth } from "@/lib/auth";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { signUpSchema } from "@/schema/authSchema";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) return handleZodValidation(parsed);

    const { name, email, password } = parsed.data;

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: "https://example.com/callback", // redirect setelah verifikasi
      },
    });

    const roleAdmin = await prisma.user.update({
      where: { email: result.user.email },
      data: { role: "ADMIN" },
      select: { role: true },
    });

    return handleResponse({
      success: true,
      message: "Signup Berhasil",
      data: { ...result, role: roleAdmin.role },
    });
  } catch (error) {
    console.log(error);

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
