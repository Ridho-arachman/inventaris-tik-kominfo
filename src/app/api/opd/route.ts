import { Prisma } from "@/generated/client";
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

export const opdQuerySchema = z.object({
  q: z.string("Query harus berupa string").trim().uppercase().optional(),
});

export const POST = async (req: NextRequest) => {
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

    const parsed = OpdCreateSchema.safeParse(body);

    if (!parsed.success) return handleZodValidation(parsed);

    const data = parsed.data;

    const opd = await prisma.opd.create({ data });

    return handleResponse({
      success: true,
      message: "OPD Berhasil Dibuat",
      data: opd,
      status: 201,
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

export const GET = async (req: NextRequest) => {
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

    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q") || "";

    const parsedQ = opdQuerySchema.safeParse({ q });

    if (!parsedQ.success) return handleZodValidation(parsedQ);

    const query = parsedQ.data.q;

    const where: Prisma.OpdWhereInput = query
      ? {
          OR: [
            { code: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
          ],
        }
      : {};

    const opd = await prisma.opd.findMany({ where });

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
