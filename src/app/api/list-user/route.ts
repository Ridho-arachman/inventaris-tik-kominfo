import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export const GET = async () => {
  try {
    const user = await auth.api.getSession({ headers: await headers() });
    if (!user)
      return handleResponse({
        success: false,
        message: "User belum login",
        status: 403,
      });

    const users = await prisma.user.findUniqueOrThrow({
      where: { id: user.user.id },
    });

    return handleResponse({
      success: true,
      data: users,
      status: 200,
      message: "Data pengguna berhasil diambil",
    });
  } catch (error) {
    const prismaError = handlePrismaError(error);
    if (prismaError)
      return handleResponse({
        success: false,
        message: prismaError.message,
        status: prismaError.status,
      });

    return handleResponse({
      success: false,
      message: "Terjadi kesalahan pada server",
      status: 500,
    });
  }
};
