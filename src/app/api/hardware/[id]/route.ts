import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { hardwareIdSchema, hardwareSchema } from "@/schema/hardwareSchema";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const PUT = async (
  req: NextRequest,
  ctx: RouteContext<"/api/hardware/[id]">
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
    const bodyHardware = {
      ...body,
      tglPengadaan: body.tglPengadaan && new Date(body.tglPengadaan),
      garansiMulai: body.garansiMulai && new Date(body.garansiMulai),
      garansiSelesai: body.garansiSelesai && new Date(body.garansiSelesai),
    };

    const parsedId = hardwareIdSchema.safeParse({ id });
    const parsed = hardwareSchema.safeParse(bodyHardware);

    if (!parsedId.success) return handleZodValidation(parsedId);
    if (!parsed.success) return handleZodValidation(parsed);

    const dataHardware = parsed.data;
    const dataId = parsedId.data.id;

    const hardware = await prisma.hardware.update({
      where: { id: dataId },
      data: { ...dataHardware, updatedBy: user.user.id },
    });

    return handleResponse({
      success: true,
      message: "Hardware Berhasil Diupdate",
      data: hardware,
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
  ctx: RouteContext<"/api/hardware/[id]">
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

    const parsedId = hardwareIdSchema.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const hardwareId = parsedId.data.id;

    const hardware = await prisma.hardware.findUniqueOrThrow({
      where: { id: hardwareId },
      include: {
        kategoriHardware: { select: { nama: true } },
        opd: { select: { nama: true } },
        creator: { select: { name: true } },
        updater: { select: { name: true } },
      },
    });

    return handleResponse({
      success: true,
      message: "Hardware Berhasil Ditemukan",
      data: hardware,
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
  req: NextRequest,
  ctx: RouteContext<"/api/hardware/[id]">
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

    const parsedId = hardwareIdSchema.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const hardwareId = parsedId.data.id;

    const hardware = await prisma.hardware.update({
      where: { id: hardwareId },
      data: { deletedBy: user.user.id, deletedAt: new Date() },
      select: { nama: true },
    });

    return handleResponse({
      success: true,
      message: "Hardware Berhasil Dihapus",
      data: hardware,
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
