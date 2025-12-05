import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import {
  kategoriSoftwareIdSchema,
  kategoriSoftwareSchema,
} from "@/schema/ketegoriSoftwareSchema";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const GET = async (
  _req: NextRequest,
  ctx: RouteContext<"/api/software/kategori/[id]">
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

    const parsedId = kategoriSoftwareIdSchema.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const kategoriSoftwareId = parsedId.data.id;

    const kategoriSoftware = await prisma.kategoriSoftware.findUniqueOrThrow({
      where: { id: kategoriSoftwareId },
    });

    return handleResponse({
      success: true,
      message: "Data Kategori Software Berhasil Ditemukan",
      data: kategoriSoftware,
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

    const parsedId = kategoriSoftwareIdSchema.safeParse({ id });
    const parsed = kategoriSoftwareSchema.safeParse(body);

    if (!parsedId.success) return handleZodValidation(parsedId);
    if (!parsed.success) return handleZodValidation(parsed);

    const data = parsed.data;
    const dataId = parsedId.data.id;

    const kategoriSoftware = await prisma.kategoriSoftware.update({
      where: { id: dataId },
      data,
    });

    return handleResponse({
      success: true,
      message: "Kategori Software Berhasil Diperbarui",
      data: kategoriSoftware,
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
  ctx: RouteContext<"/api/software/kategori/[id]">
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

    const parsedId = kategoriSoftwareIdSchema.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const kategoriSoftware = await prisma.kategoriSoftware.delete({
      where: { id },
    });

    return handleResponse({
      success: true,
      message: "Kategori Software Berhasil Dihapus",
      data: kategoriSoftware,
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
