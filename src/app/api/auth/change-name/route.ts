import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { userUpdateNameSchema } from "@/schema/authSchema";
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

    const parsed = userUpdateNameSchema.safeParse(body);
    if (!parsed.success) return handleZodValidation(parsed);

    const { name } = parsed.data;

    const res = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    return handleResponse({
      success: true,
      message: "Password berhasil diubah",
      data: res,
      status: 200,
    });
  } catch (error) {
    const prismaErr = handlePrismaError(error);
    if (prismaErr) {
      return handleResponse({
        success: false,
        message: prismaErr.message,
        status: prismaErr.status,
      });
    }

    return handleResponse({
      success: false,
      message: "Terjadi error pada server",
      status: 500,
    });
  }
};
