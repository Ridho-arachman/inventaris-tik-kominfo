import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import {
  kategoriHardwareIdSchema,
  kategoriHardwareSchema,
} from "@/schema/ketegoriHardwareSchema";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  ctx: RouteContext<"/api/hardware/kategori/[id]">
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

    const parsedId = kategoriHardwareIdSchema.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const kategoriHardwareId = parsedId.data.id;

    const kategoriHardware = await prisma.kategoriHardware.findMany({
      where: { id: kategoriHardwareId },
    });

    if (kategoriHardware.length === 0) {
      return handleResponse({
        success: false,
        message: "Data Kategori Hardware Tidak Ditemukan",
        status: 404,
      });
    }

    return handleResponse({
      success: true,
      message: "Data Kategori Hardware Berhasil Ditemukan",
      data: kategoriHardware,
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

export const PUT = async (
  req: NextRequest,
  ctx: RouteContext<"/api/hardware/kategori/[id]">
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

    const body = await req.json();
    const { id } = await ctx.params;

    const parsedId = kategoriHardwareIdSchema.safeParse({ id });
    const parsed = kategoriHardwareSchema.safeParse(body);

    if (!parsedId.success) return handleZodValidation(parsedId);
    if (!parsed.success) return handleZodValidation(parsed);

    const data = parsed.data;
    const dataId = parsedId.data.id;

    const kategoriHardware = await prisma.kategoriHardware.update({
      where: { id: dataId },
      data,
    });

    return handleResponse({
      success: true,
      message: "Kategori Hardware Berhasil Diperbarui",
      data: kategoriHardware,
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

export const DELETE = async (
  _req: NextRequest,
  ctx: RouteContext<"/api/opd/[id]">
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

    const parsedId = kategoriHardwareIdSchema.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const kategoriHardware = await prisma.kategoriHardware.delete({
      where: { id },
    });

    return handleResponse({
      success: true,
      message: "Kategori Hardware Berhasil Dihapus",
      data: kategoriHardware,
      status: 200,
    });
  } catch (error) {
    console.log(error);

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
