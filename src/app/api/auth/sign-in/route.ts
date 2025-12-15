import { auth } from "@/lib/auth";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { signInSchema } from "@/schema/authSchema";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Ambil dan validasi body
    const body = await req.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) return handleZodValidation(parsed);

    const { email, password, rememberMe } = parsed.data;

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL:
          `${process.env.BETTER_AUTH_URL}/verify-success` ||
          "http://localhost:3000/verify-success",
        rememberMe,
      },
      params: { expand: "user,roles,opd" },
      headers: await headers(),
    });

    const user = await prisma.user.findUnique({
      where: { id: result.user?.id },
      include: { opd: true },
    });

    const responseData = {
      ...result,
      user,
    };

    return handleResponse({
      success: true,
      message: "Login Berhasil",
      data: responseData,
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
