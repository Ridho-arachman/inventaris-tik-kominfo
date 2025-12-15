import { auth } from "@/lib/auth";
import { handleBetterAuthError } from "@/lib/handleBetterAuthError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import { userUpdatePasswordSchema } from "@/schema/authSchema";
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

    const parsed = userUpdatePasswordSchema.safeParse(body);
    if (!parsed.success) return handleZodValidation(parsed);

    const { currentPassword, newPassword } = parsed.data;

    const data = await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: false,
      },
      headers: await headers(),
    });

    return handleResponse({
      success: true,
      message: "Password berhasil diubah",
      data: data.user,
      status: 200,
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
