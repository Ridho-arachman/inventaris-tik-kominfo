import { auth } from "@/lib/auth";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleResponse } from "@/lib/handleResponse";
import { handleZodValidation } from "@/lib/handleZodValidation";
import prisma from "@/lib/prisma";
import {
  IdSoftwareSchema,
  softwareUpdateSchema,
} from "@/schema/softwareSchema";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const GET = async (
  _req: NextRequest,
  ctx: RouteContext<"/api/software/[id]">
) => {
  try {
    const user = await auth.api.getSession({ headers: await headers() });
    if (!user)
      return handleResponse({
        success: false,
        message: "User belum login",
        status: 403,
      });

    const { id } = await ctx.params;
    const parsedId = IdSoftwareSchema.safeParse({ id });
    if (!parsedId.success) return handleZodValidation(parsedId);

    const software = await prisma.software.findUniqueOrThrow({
      where: { id: parsedId.data.id },
      include: {
        creator: true,
        delete: true,
        hardware: true,
        kategoriSoftware: true,
        opd: true,
        updater: true,
      },
    });

    return handleResponse({
      success: true,
      message: "Data Software Berhasil Ditemukan",
      status: 200,
      data: software,
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
      message: "Terjadi kesalahan pada server",
      status: 500,
    });
  }
};

export const PUT = async (
  req: NextRequest,
  ctx: RouteContext<"/api/software/[id]">
) => {
  try {
    const user = await auth.api.getSession({ headers: await headers() });

    if (!user) {
      return handleResponse({
        success: false,
        message: "User belum login",
        status: 403,
      });
    }

    const { id } = await ctx.params;

    const body = await req.json();

    const payload = {
      ...body,
      tglPengadaan: body.tglPengadaan && new Date(body.tglPengadaan),
      tglBerakhirLisensi:
        body.tglBerakhirLisensi && new Date(body.tglBerakhirLisensi),
    };

    const parsedId = IdSoftwareSchema.safeParse({ id });
    if (!parsedId.success) return handleZodValidation(parsedId);

    const parsed = softwareUpdateSchema.safeParse(payload);
    if (!parsed.success) return handleZodValidation(parsed);

    const data = parsed.data;

    const res = await prisma.software.update({
      where: { id: parsedId.data.id },
      data: {
        ...data,
        nomorSeri: data.nomorSeri === undefined ? undefined : data.nomorSeri,
        updatedBy: user.user.id,
      },
    });

    return handleResponse({
      success: true,
      message: "Data software berhasil diupdate",
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
      message: "Terjadi kesalahan pada server",
      status: 500,
    });
  }
};
