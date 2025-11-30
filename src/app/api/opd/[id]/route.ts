import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import z from "zod";

export const OpdCreateSchema = z.object({
  code: z.string().trim().min(1, "code wajib diisi"), // contoh: "DKES"
  name: z.string().trim().min(1, "name wajib diisi"), // contoh: "Dinas Kesehatan"
});

export const idOpdSchema = z.object({
  id: z.string().trim().cuid("id wajib diisi"),
});

export const GET = async (
  req: NextRequest,
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

    const parsedId = idOpdSchema.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const opdId = parsedId.data.id;

    const opd = await prisma.opd.findMany({ where: { id: opdId } });

    if (opd.length === 0) {
      return handleResponse({
        success: false,
        message: "Data OPD Tidak Ditemukan",
        status: 404,
      });
    }

    return handleResponse({
      success: true,
      message: "Data OPD Berhasil Ditemukan",
      data: opd,
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

    const body = await req.json();
    const { id } = await ctx.params;

    const parsedId = idOpdSchema.safeParse({ id });
    const parsed = OpdCreateSchema.safeParse(body);

    if (!parsedId.success) return handleZodValidation(parsedId);
    if (!parsed.success) return handleZodValidation(parsed);

    const data = parsed.data;

    const opd = await prisma.opd.update({ where: { id }, data });

    return handleResponse({
      success: true,
      message: "OPD Berhasil Diperbarui",
      data: opd,
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

    const parsedId = idOpdSchema.safeParse({ id });

    if (!parsedId.success) return handleZodValidation(parsedId);

    const opd = await prisma.opd.delete({ where: { id } });

    return handleResponse({
      success: true,
      message: "OPD Berhasil Dihapus",
      data: opd,
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
