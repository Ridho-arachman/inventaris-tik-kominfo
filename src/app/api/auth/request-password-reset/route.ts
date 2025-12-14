import { auth } from "@/lib/auth";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import { EmailSchema } from "@/schema/authSchema";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    const parsed = EmailSchema.safeParse({ email });
    if (!parsed.success) return handleZodValidation(parsed);

    const res = await auth.api.requestPasswordReset({
      body: {
        email: parsed.data.email,
        redirectTo:
          `${process.env.NEXT_PUBLIC_APP_URL}/reset-password` ||
          "http://localhost:3000/reset-password",
      },
    });

    return handleResponse({
      success: true,
      message: "Link reset password telah dikirim ke email Anda",
      data: res,
      status: 200,
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
