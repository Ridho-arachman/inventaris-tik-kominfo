import { auth } from "@/lib/auth";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import { signUpAdminSchema } from "@/schema/authSchema";

import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const parsed = signUpAdminSchema.safeParse(body);

    if (!parsed.success) return handleZodValidation(parsed);

    const { name, email, password } = parsed.data;

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: "ADMIN",
        callbackURL:
          `${process.env.BETTER_AUTH_URL}/login` ||
          "http://localhost:3000/login",
      },
    });

    return handleResponse({
      success: true,
      message: "Signup Berhasil",
      data: { ...result },
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
