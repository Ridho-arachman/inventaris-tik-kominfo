import { auth } from "@/lib/auth";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import { UserUpdateEmailSchema } from "@/schema/authSchema";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const allowedRoles = ["ADMIN", "OPD"];

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return handleResponse({
        success: false,
        message: "User belum login",
        status: 403,
      });
    }

    if (!allowedRoles.includes(session.user.role as string)) {
      return handleResponse({
        success: false,
        message: "Akses ditolak",
        status: 403,
      });
    }

    const body = await req.json();

    const parsed = UserUpdateEmailSchema.safeParse(body);
    if (!parsed.success) return handleZodValidation(parsed);

    const { email } = parsed.data;

    const res = await auth.api.changeEmail({
      body: {
        newEmail: email,
        callbackURL: "http://localhost:3000/verify-success",
      },
      headers: await headers(),
    });

    return handleResponse({
      success: true,
      data: res,
      status: 200,
      message: "Email berhasil diubah",
    });
  } catch (error) {
    const betterAuthErr = handleBetterAuthError(error);
    if (betterAuthErr) {
      return handleResponse({
        success: false,
        message: betterAuthErr.message,
        status: betterAuthErr.status,
      });
    }

    return handleResponse({
      success: false,
      message: "Terjadi error pada server",
      status: 500,
    });
  }
};
