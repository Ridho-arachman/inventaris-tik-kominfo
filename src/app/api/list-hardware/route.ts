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

    const idOpd = user.user.idOpd;

    const hardware = await prisma.hardware.findMany({
      where: idOpd ? { opdId: idOpd as string, deletedAt: null } : {},
      take: 5,
    });

    return handleResponse({
      success: true,
      message: "Data hardware berhasil diambil",
      data: hardware,
      status: 200,
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
