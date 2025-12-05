import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { handleResponse } from "@/lib/handleResponse";
import { handlePrismaError } from "@/lib/handlePrsimaError";
import { handleZodValidation } from "@/lib/handleZodValidation";
import {
  kategoriSoftwareQuerySchema,
  kategoriSoftwareSchema,
} from "@/schema/ketegoriSoftwareSchema";

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

    const parsed = kategoriSoftwareSchema.safeParse(body);

    if (!parsed.success) return handleZodValidation(parsed);

    const data = parsed.data;

    const kategoriSoftware = await prisma.kategoriSoftware.create({ data });

    return handleResponse({
      success: true,
      message: "Kategori Software Berhasil Dibuat",
      data: kategoriSoftware,
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

    if (!user) {
      return handleResponse({
        success: false,
        message: "User Belum Login",
        status: 403,
      });
    }

    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q") || "";

    const parsedQ = kategoriSoftwareQuerySchema.safeParse({ q });

    if (!parsedQ.success) return handleZodValidation(parsedQ);

    const query = parsedQ.data.q;

    const kategoriSoftware = await prisma.kategoriSoftware.findMany({
      where: query ? { nama: { contains: query, mode: "insensitive" } } : {},
    });

    if (kategoriSoftware.length === 0) {
      return handleResponse({
        success: false,
        message: "Data Kategori Software Tidak Ditemukan",
        status: 404,
      });
    }

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
