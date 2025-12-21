import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { handleResponse } from "@/lib/handleResponse";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleZodValidation } from "@/lib/handleZodValidation";
import { userQuerySchemaById, userUpdateSchema } from "@/schema/userOpdSchema";

export const DELETE = async (
  _req: NextRequest,
  ctx: RouteContext<"/api/user-opd/[id]">
) => {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    });

    if (!user) {
      return handleResponse({
        success: false,
        message: "User Belum Login",
        status: 403,
      });
    }

    const { id } = await ctx.params;

    const parsedId = userQuerySchemaById.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const userOpd = await prisma.user.delete({
      where: { id: parsedId.data.id },
    });

    return handleResponse({
      success: true,
      message: "User OPD Berhasil Dihapus",
      data: userOpd,
      status: 200,
    });
  } catch (error) {
    // Prisma Error Handler
    const prismaResponse = handlePrismaError(error);
    if (prismaResponse) {
      return handleResponse({
        success: false,
        message: prismaResponse.message,
        status: prismaResponse.status,
      });
    }

    // Internal Server Error
    return handleResponse({
      success: false,
      message: "Terjadi kesalahan pada server",
      status: 500,
    });
  }
};

export const GET = async (
  req: NextRequest,
  ctx: RouteContext<"/api/user-opd/[id]">
) => {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    });

    if (!user)
      return handleResponse({
        success: false,
        message: "User Belum Login",
        status: 403,
      });
    const { id } = await ctx.params;

    const parsedId = userQuerySchemaById.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const userId = parsedId.data.id;

    const userRes = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        opd: {
          select: {
            id: true,
            kode: true,
            nama: true,
          },
        },
      },
    });

    return handleResponse({
      success: true,
      message: "Data User OPD Berhasil Ditemukan",
      data: userRes,
      status: 200,
    });
  } catch (error) {
    // PRISMA HANDLER ERROR
    const prismaResponse = handlePrismaError(error);
    if (prismaResponse) {
      return handleResponse({
        success: false,
        message: prismaResponse.message,
        status: prismaResponse.status,
      });
    }

    // Internal Server Error
    return handleResponse({
      success: false,
      message: "Terjadi kesalahan pada server",
      status: 500,
    });
  }
};

export const PATCH = async (
  req: NextRequest,
  ctx: RouteContext<"/api/user-opd/[id]">
) => {
  try {
    const user = await auth.api.getSession({
      headers: await headers(),
    });

    if (!user)
      return handleResponse({
        success: false,
        message: "User Belum Login",
        status: 403,
      });

    const { id } = await ctx.params;
    const body = await req.json();

    const parsedId = userQuerySchemaById.safeParse({ id });
    const parsed = userUpdateSchema.safeParse(body);

    if (!parsedId.success) return handleZodValidation(parsedId);
    if (!parsed.success) return handleZodValidation(parsed);

    const data = parsed.data;
    const dataId = parsedId.data.id;

    const isEmailVerified = await prisma.user.findUniqueOrThrow({
      where: { id: dataId },
      select: { emailVerified: true },
    });

    if (isEmailVerified.emailVerified === true) {
      return handleResponse({
        success: false,
        message: "Email Sudah Terverifikasi",
        status: 400,
      });
    }

    const userOpd = await prisma.user.update({ where: { id: dataId }, data });

    return handleResponse({
      success: true,
      message: "User OPD Berhasil Diupdate",
      data: userOpd,
      status: 200,
    });
  } catch (error) {
    // PRISMA HANDLER ERROR
    const prismaResponse = handlePrismaError(error);
    if (prismaResponse) {
      return handleResponse({
        success: false,
        message: prismaResponse.message,
        status: prismaResponse.status,
      });
    }

    // Internal Server Error
    return handleResponse({
      success: false,
      message: "Terjadi kesalahan pada server",
      status: 500,
    });
  }
};
